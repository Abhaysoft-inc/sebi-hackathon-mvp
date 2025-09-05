"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';

// Minimal registry for simulated commands (will expand + fuzzy later)
interface SimpleCommand { id: string; phrase: string; target?: string; dynamic?: boolean; }
// Static base commands for top-level navigation only (no specific item pages)
const BASE_COMMANDS: SimpleCommand[] = [
  // Home / landing
  { id: 'home-open', phrase: 'open home', target: '/' },
  { id: 'home-go', phrase: 'go home', target: '/' },
  { id: 'home-landing', phrase: 'open landing', target: '/' },
  // Feed
  { id: 'feed-open', phrase: 'open feed', target: '/feed' },
  { id: 'feed-show', phrase: 'show feed', target: '/feed' },
  // IPO list
  { id: 'ipos-open', phrase: 'open ipos', target: '/ipos' },
  { id: 'ipos-show', phrase: 'show ipos', target: '/ipos' },
  // Cases list
  { id: 'cases-open', phrase: 'open cases', target: '/cases' },
  { id: 'cases-show', phrase: 'show cases', target: '/cases' },
  // Quizzes (ranked quiz list route)
  { id: 'quiz-open', phrase: 'open quiz', target: '/quiz/ranked' },
  { id: 'quizzes-open', phrase: 'open quizzes', target: '/quiz/ranked' },
  { id: 'quizzes-show', phrase: 'show quizzes', target: '/quiz/ranked' },
  { id: 'ranked-quiz-open', phrase: 'open ranked quiz', target: '/quiz/ranked' },
  // Leaderboard
  { id: 'leaderboard-open', phrase: 'open leaderboard', target: '/leaderboard' },
  { id: 'leaderboard-show', phrase: 'show leaderboard', target: '/leaderboard' },
  // Admin
  { id: 'admin-open', phrase: 'open admin', target: '/admin' },
  { id: 'admin-dashboard', phrase: 'open admin dashboard', target: '/admin' },
  // Circulars
  { id: 'circulars-open', phrase: 'open circulars', target: '/circulars' },
  { id: 'circulars-show', phrase: 'show circulars', target: '/circulars' },
  { id: 'sebi-circulars-open', phrase: 'open sebi circulars', target: '/circulars' },
];

// Mutable commands list (static + dynamic)
const COMMANDS: SimpleCommand[] = [...BASE_COMMANDS];

// Voice-only mode toggle (false => show assistant reply text + audio)
const VOICE_ONLY_MODE = false;
const AUTO_SEND_SILENCE_MS = 1400; // auto process after this silence if transcript present

type State = 'idle' | 'listening' | 'processing';

interface VAChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  status?: 'playing' | 'complete' | 'pending';
}

const VoiceAssistant: React.FC = () => {
  const [panelOpen, setPanelOpen] = useState(false);
  const [state, setState] = useState<State>('idle');
  const [transcript, setTranscript] = useState('');
  const [lastMatch, setLastMatch] = useState<SimpleCommand | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [messages, setMessages] = useState<VAChatMessage[]>([]);
  const router = useRouter();
  const portalRef = useRef<HTMLElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const abortTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fuseRef = useRef<Fuse<SimpleCommand> | null>(null);
  const stateRef = useRef<State>('idle');
  const listenStartedRef = useRef<number>(0);
  const restartCountRef = useRef<number>(0);
  const lastResultTimestampRef = useRef<number>(0);
  const dynamicLoadedRef = useRef<boolean>(false);
  const manualStopRef = useRef<boolean>(false); // user explicitly stopped
  const silenceIntervalRef = useRef<NodeJS.Timeout | null>(null); // periodic silence checks
  const sessionStartRef = useRef<number>(0); // track cumulative session time across restarts
  const MAX_SESSION_MS = 20000; // hard cap for a single listening session
  const SILENCE_CUTOFF_MS = 3000; // fallback silence cutoff (upper bound)
  const MIN_ACTIVE_MS = 1200; // wait at least this before treating as silence
  const networkErrorCountRef = useRef<number>(0);
  useEffect(() => { stateRef.current = state; }, [state]);

  // Debug: confirm mount in console (can remove later)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log('[VoiceAssistant] mounted');
    }
  }, []);

  const findMatch = useCallback((text: string) => {
    const lower = text.toLowerCase().trim();
    if (!lower) return null;
    // Exact fast path
    const exact = COMMANDS.find(c => c.phrase === lower);
    if (exact) return exact;
    // Fuzzy
    if (!fuseRef.current) {
      fuseRef.current = new Fuse(COMMANDS, { keys: ['phrase'], threshold: 0.38, distance: 60, minMatchCharLength: 2 });
    }
    const res = fuseRef.current.search(lower)[0];
    if (res && res.score !== undefined && res.score <= 0.5) return res.item;
    return null;
  }, []);

  // Utility normalizer for titles / company names
  const normalizeName = (raw: string) => raw
    .toLowerCase()
    .replace(/\b(limited|ltd|inc|co\.?|company|ipo)\b/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Insert a dynamic command & refresh fuse index lazily
  const addDynamicCommand = (phrase: string, target: string) => {
    const exists = COMMANDS.some(c => c.phrase === phrase);
    if (exists) return;
    COMMANDS.push({ id: `dyn-${phrase}`, phrase, target, dynamic: true });
  };

  // Build variants for case studies
  const buildCaseVariants = (title: string, id: number, slug?: string | null) => {
    const norm = normalizeName(title);
    const path = slug ? `/case/${slug}` : `/case/${id}`;
    const base = [
      `open ${norm} case`,
      `show ${norm} case`,
      `go to ${norm} case`,
      `${norm} case`
    ];
    base.forEach(p => addDynamicCommand(p, path));
  };

  // Build variants for IPOs
  const buildIPOVariants = (companyName: string, id: number) => {
    const norm = normalizeName(companyName);
    const path = `/ipos/${id}`;
    const base = [
      `open ${norm} ipo`,
      `show ${norm} ipo`,
      `${norm} ipo`,
      `open ${norm}`
    ];
    base.forEach(p => addDynamicCommand(p, path));
  };

  // Load dynamic voice index (cases + ipos)
  const loadDynamicIndex = useCallback(async () => {
    if (dynamicLoadedRef.current) return;
    try {
      const [casesRes, iposRes] = await Promise.all([
        fetch('/api/voice-index/cases'),
        fetch('/api/voice-index/ipos')
      ]);
      if (casesRes.ok) {
        const { cases } = await casesRes.json();
        (cases || []).forEach((c: any) => buildCaseVariants(c.refinedTitle || c.title, c.id, c.slug));
      }
      if (iposRes.ok) {
        const { ipos } = await iposRes.json();
        (ipos || []).forEach((i: any) => buildIPOVariants(i.companyName, i.id));
      }
      dynamicLoadedRef.current = true;
      // Rebuild Fuse index with new commands
      fuseRef.current = new Fuse(COMMANDS, { keys: ['phrase'], threshold: 0.38, distance: 60, minMatchCharLength: 2 });
      // Optional toast
      setToast('Voice commands updated');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Voice index load failed', e);
    }
  }, []);

  // Trigger load on panel open first time
  useEffect(() => {
    if (panelOpen && !dynamicLoadedRef.current) {
      loadDynamicIndex();
    } else if (panelOpen && fuseRef.current === null) {
      // ensure fuse exists for static commands even if dynamic not yet loaded
      fuseRef.current = new Fuse(COMMANDS, { keys: ['phrase'], threshold: 0.38, distance: 60, minMatchCharLength: 2 });
    }
  }, [panelOpen, loadDynamicIndex]);

  // Portal node setup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!portalRef.current) {
      const existing = document.getElementById('voice-assistant-root');
      portalRef.current = existing || (() => {
        const el = document.createElement('div');
        el.id = 'voice-assistant-root';
        document.body.appendChild(el);
        return el;
      })();
    }
  }, []);

  const startListening = () => {
    if (state !== 'idle') return;
    setTranscript('');
    setState('listening');
    listenStartedRef.current = Date.now();
    sessionStartRef.current = Date.now();
    restartCountRef.current = 0;
    lastResultTimestampRef.current = Date.now();
    manualStopRef.current = false;
    // Start Web Speech recognition if available
    if (typeof window !== 'undefined') {
      const SpeechRecognition: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          recognitionRef.current = rec;
          // Allow continuous interim capture; we'll decide when to process
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'en-IN';
          rec.onresult = (e: any) => {
            let interim = '';
            let final = '';
            for (let i = e.resultIndex; i < e.results.length; ++i) {
              const r = e.results[i];
              if (r.isFinal) final += r[0].transcript; else interim += r[0].transcript;
            }
            setTranscript((final || interim).toLowerCase());
            lastResultTimestampRef.current = Date.now();
          };
          rec.onerror = (e: any) => {
            const err = e?.error;
            // Debug friendly console (optional remove)
            // eslint-disable-next-line no-console
            console.warn('[VoiceAssistant] recognition error:', err);

            // If user already stopped or not in listening, just ignore
            if (manualStopRef.current || stateRef.current !== 'listening') return;

            // Handle permission errors immediately
            if (err === 'not-allowed' || err === 'service-not-allowed') {
              setToast('Mic permission denied');
              stopRecognition();
              setState('idle');
              return;
            }

            // Transient network errors are common; attempt limited auto-retries
            if (err === 'network') {
              networkErrorCountRef.current += 1;
              const totalSession = Date.now() - sessionStartRef.current;
              if (networkErrorCountRef.current <= 3 && totalSession < MAX_SESSION_MS) {
                setToast(`Network glitch… retrying (${networkErrorCountRef.current})`);
                try {
                  // Small delay before restart to avoid immediate repeat
                  setTimeout(() => {
                    if (stateRef.current === 'listening' && !manualStopRef.current) {
                      try { recognitionRef.current?.start(); } catch {/* ignore */ }
                    }
                  }, 300);
                  return; // don't fall through to idle
                } catch { /* ignore */ }
              }
              // Exhausted retries, process what we have
              if (transcript.trim().length > 0) {
                stopAndProcess();
              } else {
                setToast('Mic error: network');
                stopRecognition();
                setState('idle');
              }
              return;
            }

            // Graceful handling for no-speech: if early, restart; else process
            if (err === 'no-speech') {
              const elapsed = Date.now() - listenStartedRef.current;
              if (elapsed < 1500 && restartCountRef.current < 5) {
                restartCountRef.current += 1;
                try { recognitionRef.current?.start(); } catch {/* ignore */ }
                return;
              }
              // treat as silence -> process
              stopAndProcess();
              return;
            }

            // Fallback: show toast & stop
            setToast(`Mic error: ${err || 'unknown'}`);
            stopRecognition();
            setState('idle');
          };
          rec.onend = () => {
            // If we are no longer in listening state OR user manually stopped, abort restart logic
            if (stateRef.current !== 'listening' || manualStopRef.current) return;
            const now = Date.now();
            const elapsed = now - listenStartedRef.current; // current sub-session
            const totalSession = now - sessionStartRef.current; // across restarts
            const sinceLast = now - lastResultTimestampRef.current;
            const hasTranscript = transcript.trim().length > 0;

            // If session hard cap reached -> process
            if (totalSession >= MAX_SESSION_MS) {
              stopAndProcess();
              return;
            }

            // Heuristic restart conditions:
            // 1. Ended very quickly with no speech -> restart aggressively (limit restarts)
            if (!hasTranscript && elapsed < 1500 && restartCountRef.current < 5) {
              restartCountRef.current += 1;
              try { recognitionRef.current?.start(); } catch { }
              return;
            }
            // 2. Some interim happened recently (silence less than 1s) but ended -> restart to continue
            if (!hasTranscript && sinceLast < 1000 && restartCountRef.current < 5) {
              restartCountRef.current += 1;
              try { recognitionRef.current?.start(); } catch { }
              return;
            }
            // 3. If we have partial transcript but silence triggered onend, allow one more continuation if under cutoffs
            if (hasTranscript && sinceLast < SILENCE_CUTOFF_MS && restartCountRef.current < 5 && totalSession < MAX_SESSION_MS) {
              restartCountRef.current += 1;
              try { recognitionRef.current?.start(); } catch { }
              return;
            }
            // Otherwise process what we have
            stopAndProcess();
          };
          rec.start();
          // Safety auto stop after 8s of silence
          if (abortTimeoutRef.current) clearTimeout(abortTimeoutRef.current);
          abortTimeoutRef.current = setTimeout(() => {
            if (stateRef.current === 'listening') {
              stopAndProcess();
            }
          }, 8000);
          // Additional periodic silence monitoring (more responsive than single timeout)
          if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current as any);
          silenceIntervalRef.current = setInterval(() => {
            if (stateRef.current !== 'listening' || manualStopRef.current) return;
            const now = Date.now();
            const sinceLast = now - lastResultTimestampRef.current;
            const totalSession = now - sessionStartRef.current;
            if (totalSession >= MAX_SESSION_MS) {
              stopAndProcess();
              return;
            }
            // Early auto-send with shorter silence threshold if we have content
            if (transcript.trim().length > 0 && sinceLast >= AUTO_SEND_SILENCE_MS) {
              stopAndProcess();
              return;
            }
            if (sinceLast >= SILENCE_CUTOFF_MS && (now - listenStartedRef.current) > MIN_ACTIVE_MS) {
              stopAndProcess();
            }
          }, 750);
        } catch (err: any) {
          setToast('Recognition start failed');
        }
      } else {
        setToast('SpeechRecognition unsupported');
      }
    }
  };

  const stopRecognition = () => {
    if (abortTimeoutRef.current) {
      clearTimeout(abortTimeoutRef.current);
      abortTimeoutRef.current = null;
    }
    if (silenceIntervalRef.current) {
      clearInterval(silenceIntervalRef.current as any);
      silenceIntervalRef.current = null;
    }
    const rec = recognitionRef.current;
    try { if (rec && rec.stop) rec.stop(); } catch { /* ignore */ }
    recognitionRef.current = null;
  };

  const stopAndProcess = () => {
    if (state !== 'listening') return;
    manualStopRef.current = true;
    setState('processing');
    stopRecognition();
    setTimeout(() => {
      const spoken = transcript.trim();
      if (spoken) {
        // add user message
        setMessages(m => [...m, { id: crypto.randomUUID(), role: 'user', text: spoken, status: 'complete' }]);
      }
      const match = findMatch(spoken);
      setLastMatch(match);
      // Simulate assistant generation
      const responseText = match
        ? `Opening ${match.phrase.replace(/^(open|show|go to)\s+/, '')}`
        : spoken
          ? 'Command not mapped yet.'
          : 'Silence.';
      if (!VOICE_ONLY_MODE) {
        const id = crypto.randomUUID();
        setMessages(m => [...m, { id, role: 'assistant', text: '...', status: 'pending' }]);
        setTimeout(() => {
          setMessages(m => m.map(msg => msg.id === id ? { ...msg, text: responseText, status: 'playing' } : msg));
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            try {
              const utter = new SpeechSynthesisUtterance(responseText);
              utter.rate = 1; utter.pitch = 1; utter.lang = 'en-IN';
              utter.onend = () => {
                setMessages(m => m.map(msg => msg.id === id ? { ...msg, status: 'complete' } : msg));
                if (match?.target) { setToast(`Opening: ${match.phrase}`); setTimeout(() => { setPanelOpen(false); router.push(match.target!); }, 400); }
              };
              window.speechSynthesis.cancel();
              window.speechSynthesis.speak(utter);
            } catch {
              setMessages(m => m.map(msg => msg.id === id ? { ...msg, status: 'complete' } : msg));
              if (match?.target) { setToast(`Opening: ${match.phrase}`); setTimeout(() => { setPanelOpen(false); router.push(match.target!); }, 400); }
            }
          } else if (match?.target) {
            setToast(`Opening: ${match.phrase}`);
            setTimeout(() => { setPanelOpen(false); router.push(match.target!); }, 400);
          }
        }, 250);
      } else {
        // Voice-only: no assistant text bubble, just TTS + navigation
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          try {
            const utter = new SpeechSynthesisUtterance(responseText);
            utter.rate = 1; utter.pitch = 1; utter.lang = 'en-IN';
            utter.onend = () => { if (match?.target) { setToast(`Opening: ${match.phrase}`); setTimeout(() => { setPanelOpen(false); router.push(match.target!); }, 300); } };
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utter);
          } catch {
            if (match?.target) { setToast(`Opening: ${match.phrase}`); setTimeout(() => { setPanelOpen(false); router.push(match.target!); }, 300); }
          }
        } else if (match?.target) {
          setToast(`Opening: ${match.phrase}`);
          setTimeout(() => { setPanelOpen(false); router.push(match.target!); }, 300);
        }
      }
      setState('idle');
    }, 600);
  };

  const togglePanel = () => setPanelOpen(o => !o);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
        e.preventDefault();
        if (!panelOpen) setPanelOpen(true);
        if (state === 'idle') startListening(); else if (state === 'listening') stopAndProcess();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [panelOpen, state, transcript]);

  // Toast auto hide
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const devInput = state === 'listening';

  // Chat scroll anchor
  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, state]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      manualStopRef.current = true;
      stopRecognition();
    };
  }, []);

  const ui = (
    <>
      <button
        aria-label={panelOpen ? 'Close voice assistant panel' : 'Open voice assistant panel'}
        onClick={togglePanel}
        className={`group z-[999] w-16 h-16 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400/70 shadow-[0_0_0_4px_rgba(255,255,255,0.4),0_4px_18px_-2px_rgba(79,70,229,0.55)] border-[3px] border-white/80 backdrop-blur fixed right-5 bottom-20 md:bottom-5 ${panelOpen ? 'bg-gradient-to-br from-rose-500 via-fuchsia-500 to-indigo-600' : 'bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 hover:brightness-110'}`}
      >
        {state === 'listening' && (
          <>
            <span className="absolute inset-0 rounded-full bg-fuchsia-500/30 animate-ping" />
            <span className="absolute inset-0 rounded-full bg-rose-500/25 animate-pulse [animation-duration:2.4s]" />
          </>
        )}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-8 h-8 text-white drop-shadow">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25a2.25 2.25 0 0 0-2.25 2.25v6a2.25 2.25 0 1 0 4.5 0v-6A2.25 2.25 0 0 0 12 2.25Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5a7.5 7.5 0 0 1-15 0M12 18v3.75" />
        </svg>
        <span className="absolute -top-1 -right-1 bg-white text-[10px] font-semibold text-indigo-600 px-1.5 py-0.5 rounded-full shadow border border-indigo-100">Beta</span>
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-gray-700 bg-white/90 px-2 py-0.5 rounded-full shadow border">VA</span>
      </button>

      {panelOpen && (
        <div className="fixed z-[998] bottom-28 md:bottom-24 right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-6rem)] rounded-3xl bg-white/95 backdrop-blur border border-indigo-200 shadow-[0_8px_40px_-4px_rgba(79,70,229,0.35)] flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold tracking-wide">
              <span className="inline-flex w-7 h-7 items-center justify-center rounded-full bg-white/20">
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className='w-4 h-4'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M12 2.25a2.25 2.25 0 0 0-2.25 2.25v6a2.25 2.25 0 1 0 4.5 0v-6A2.25 2.25 0 0 0 12 2.25Z' />
                  <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 10.5a7.5 7.5 0 0 1-15 0M12 18v3.75' />
                </svg>
              </span>
              Voice Assistant
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${state === 'listening' ? 'bg-rose-400/80' : state === 'processing' ? 'bg-amber-400/80' : 'bg-white/25'}`}>{state.toUpperCase()}</span>
              <button onClick={() => setPanelOpen(false)} className="p-1 rounded hover:bg-white/20 transition" aria-label='Close panel'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className='w-5 h-5'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
          </div>
          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
            {messages.length === 0 && state === 'idle' && (
              <div className='text-center text-xs text-gray-500 mt-12 space-y-2'>
                <p className='font-medium'>No conversation yet.</p>
                <p>Press the mic to start speaking or type then press Enter.</p>
              </div>
            )}
            {messages.filter(m => !(VOICE_ONLY_MODE && m.role === 'assistant')).map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm relative ${msg.role === 'user' ? 'bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white' : 'bg-white border border-gray-200 text-gray-800'} ${msg.status === 'pending' ? 'opacity-60 italic' : ''}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {state === 'listening' && (
              <div className='flex justify-start'>
                <div className='max-w-[60%] rounded-2xl px-3 py-2 text-xs bg-white border border-gray-200 text-gray-600 flex items-center gap-2'>
                  <ListeningWave />
                  Listening…
                </div>
              </div>
            )}
            {state === 'processing' && (
              <div className='flex justify-start'>
                <div className='max-w-[60%] rounded-2xl px-3 py-2 text-xs bg-white border border-gray-200 text-gray-600 flex items-center gap-2'>
                  <span className='w-2 h-2 rounded-full bg-amber-400 animate-pulse' /> Processing…
                </div>
              </div>
            )}
          </div>
          {/* Input / Controls */}
          <div className="border-t border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-fuchsia-50 px-4 pt-2 pb-3 flex flex-col gap-2">
            <div className='flex items-center gap-2'>
              <button
                onClick={() => state === 'listening' ? stopAndProcess() : startListening()}
                className={`relative w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition focus:outline-none focus:ring-2 focus:ring-indigo-400/50 ${state === 'listening' ? 'bg-rose-500 hover:bg-rose-600 animate-pulse' : 'bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 hover:brightness-110'}`}
                aria-label={state === 'listening' ? 'Stop listening' : 'Start listening'}
              >
                {state === 'listening' && (
                  <>
                    <span className='absolute inset-0 rounded-full bg-fuchsia-500/30 animate-ping' />
                    <span className='absolute inset-0 rounded-full bg-rose-500/25 animate-pulse [animation-duration:2.4s]' />
                  </>
                )}
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.8} className='w-7 h-7'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M12 2.25a2.25 2.25 0 0 0-2.25 2.25v6a2.25 2.25 0 1 0 4.5 0v-6A2.25 2.25 0 0 0 12 2.25Z' />
                  <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 10.5a7.5 7.5 0 0 1-15 0M12 18v3.75' />
                </svg>
              </button>
              <input
                disabled={state !== 'idle' && state !== 'listening'}
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                onKeyDown={e => { if (!VOICE_ONLY_MODE && e.key === 'Enter' && state === 'listening') { stopAndProcess(); } }}
                placeholder={state === 'listening' ? 'Speak now… (auto)' : 'Click mic to start speaking…'}
                className='flex-1 text-sm rounded-xl border border-indigo-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-300/60 px-3 py-2 disabled:opacity-50'
              />
              <button
                onClick={() => { if (state === 'listening') { stopAndProcess(); } else { startListening(); } }}
                className='text-[11px] font-semibold px-3 py-2 rounded-lg bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 shadow-sm'
              >{state === 'listening' ? 'Send' : 'Mic'}</button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {['open feed', 'open ipos', 'open cases', 'open quizzes', 'open leaderboard']
                .map(p => BASE_COMMANDS.find(c => c.phrase === p))
                .filter(Boolean)
                .slice(0, 5)
                .map(c => (
                  <button key={c!.id} onClick={() => { setTranscript(c!.phrase); setState('listening'); }} className='text-[10px] px-2 py-1 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium'> {c!.phrase} </button>
                ))}
            </div>
            <div className='flex justify-between items-center px-1'>
              <span className='text-[10px] text-gray-500 font-medium tracking-wide uppercase'>Voice Mode {VOICE_ONLY_MODE ? '• Audio only' : '• Text + Audio'}</span>
              <button onClick={() => { setMessages([]); setLastMatch(null); }} className='text-[10px] text-rose-600 hover:underline'>Clear</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed z-[1000] bottom-20 md:bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-gray-900/95 text-white text-sm shadow-lg backdrop-blur flex items-center gap-2 border border-gray-700">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {toast}
        </div>
      )}
    </>
  );

  if (portalRef.current) return createPortal(ui, portalRef.current);
  return ui;
};

export default VoiceAssistant;

// Simple animated bars to simulate live audio levels
const ListeningWave: React.FC = () => {
  return (
    <span className="flex items-end gap-[2px] h-4" aria-hidden>
      {[0, 1, 2, 3, 4].map(i => (
        <span key={i} className={`w-[3px] rounded-full bg-indigo-500 animate-pulse`} style={{ animationDelay: `${i * 120}ms`, height: `${6 + (i % 3) * 4}px` }} />
      ))}
    </span>
  );
};
