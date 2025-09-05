"use client"
import { useEffect, useState, useCallback, use as usePromise, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface QuizQ { id?: number; order: number; prompt: string; options: string[]; correctOptionIndex: number; explanation: string; category?: string; difficulty?: string }

// In Next.js 15 params in client components is a Promise; unwrap with React.use
function AdminCaseDetailCore({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = usePromise(params)
  const id = Number(idParam)
  const search = useSearchParams()
  const initialTab = (search?.get('t') as any) || 'seed'
  const [tab, setTab] = useState<'seed' | 'sources' | 'synth' | 'review' | 'publish'>(initialTab)
  const [caseStudy, setCaseStudy] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editNarrative, setEditNarrative] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editQuiz, setEditQuiz] = useState<QuizQ[]>([])
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [enriching, setEnriching] = useState(false)
  const [synthLoading, setSynthLoading] = useState(false)
  const [logs, setLogs] = useState<any[] | null>(null)

  const fetchCase = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const r = await fetch(`/admin/api/cases/${id}`)
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Fetch failed')
      setCaseStudy(d.caseStudy)
      if (d.caseStudy.fullNarrative) setEditNarrative(d.caseStudy.fullNarrative)
      if (d.caseStudy.refinedTitle) setEditTitle(d.caseStudy.refinedTitle)
      else setEditTitle(d.caseStudy.title)
      if (Array.isArray(d.caseStudy.quizQuestions)) setEditQuiz(d.caseStudy.quizQuestions.map((q: any) => ({ ...q })))
      // Auto-advance if we landed on seed but synthesis already exists
      if (initialTab === 'seed' && d.caseStudy.sources?.length) setTab('sources')
      if (initialTab === 'seed' && d.caseStudy.fullNarrative) setTab('review')
    } catch (e: any) { setError(e.message) } finally { setLoading(false) }
  }, [id])

  useEffect(() => { fetchCase() }, [fetchCase])
  // Ensure editor fields populate if navigating after synthesis
  useEffect(() => {
    if (caseStudy) {
      if (caseStudy.fullNarrative && !editNarrative) setEditNarrative(caseStudy.fullNarrative)
      if ((caseStudy.refinedTitle || caseStudy.title) && !editTitle) setEditTitle(caseStudy.refinedTitle || caseStudy.title)
      if (Array.isArray(caseStudy.quizQuestions) && editQuiz.length === 0) setEditQuiz(caseStudy.quizQuestions.map((q: any) => ({ ...q })))
    }
  }, [caseStudy, editNarrative, editTitle, editQuiz.length])

  const runEnrichment = async () => {
    setEnriching(true)
    try { await fetch(`/admin/api/cases/${id}/enrich`, { method: 'POST' }); await fetchCase(); setTab('sources') } catch (e: any) { setError(e.message) } finally { setEnriching(false) }
  }
  const runSynthesis = async () => {
    setSynthLoading(true)
    try { await fetch(`/admin/api/cases/${id}/synthesize`, { method: 'POST' }); await fetchCase(); setTab('synth') } catch (e: any) { setError(e.message) } finally { setSynthLoading(false) }
  }
  const saveEdits = async () => {
    setSaving(true)
    try {
      const r = await fetch(`/admin/api/cases/${id}/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refinedTitle: editTitle, fullNarrative: editNarrative, quiz: editQuiz }) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Update failed')
      setCaseStudy(d.caseStudy)
      setTab('publish')
    } catch (e: any) { setError(e.message) } finally { setSaving(false) }
  }
  const publish = async () => {
    setPublishing(true)
    try { const r = await fetch(`/admin/api/cases/${id}/publish`, { method: 'POST' }); const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Publish failed'); setCaseStudy(d.caseStudy); } catch (e: any) { setError(e.message) } finally { setPublishing(false) }
  }
  const loadLogs = async () => {
    try { const r = await fetch(`/admin/api/cases/${id}/logs`); const d = await r.json(); if (!r.ok) throw new Error(d.error || 'Log fetch failed'); setLogs(d.logs) } catch (e: any) { setLogs([{ phase: 'error', error: e.message }]) }
  }

  const addQuiz = () => setEditQuiz(qs => [...qs, { order: qs.length, prompt: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '', category: '', difficulty: 'easy' }])

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Case Admin: #{id}</h1>
      <ProgressBar step={tab} />
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <TabBar tab={tab} setTab={setTab} caseStudy={caseStudy} />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading && <div className="text-sm text-gray-500">Loading…</div>}

      {tab === 'seed' && caseStudy && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3 text-sm">
          <div><span className="font-semibold">Title:</span> {caseStudy.title}</div>
          <div><span className="font-semibold">Seed Summary:</span> <span className="whitespace-pre-wrap">{caseStudy.shortSummary}</span></div>
          <button onClick={runEnrichment} disabled={enriching} className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-[11px] font-semibold px-3 py-1.5 shadow">{enriching ? 'Enriching…' : 'Run Enrichment'}</button>
        </div>
      )}

      {tab === 'sources' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-xs max-h-[480px] overflow-auto">
          <h2 className="font-semibold mb-2 text-sm">Sources</h2>
          {!caseStudy?.sources && <p className="text-gray-500">No sources yet. Run enrichment.</p>}
          {Array.isArray(caseStudy?.sources) && (
            <ul className="space-y-1">
              {caseStudy.sources.map((s: any, i: number) => (
                <li key={i} className="border rounded p-2 bg-gray-50">
                  <div className="flex justify-between"><span className="font-medium">[{s.provider}] {s.title || '(untitled)'} </span><span className="text-[10px] opacity-60">{i + 1}</span></div>
                  {s.url && <div className="text-[10px] break-all text-blue-700 underline"><a href={s.url} target="_blank">{s.url}</a></div>}
                  <div className="mt-1 whitespace-pre-wrap">{s.snippet?.slice(0, 320)}</div>
                </li>
              ))}
            </ul>
          )}
          <button onClick={runSynthesis} disabled={synthLoading || !caseStudy?.sources} className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-[11px] font-semibold px-3 py-1.5 shadow">{synthLoading ? 'Synthesizing…' : 'Generate Narrative & Quiz'}</button>
        </div>
      )}

      {tab === 'synth' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-sm space-y-3">
          {!(caseStudy?.fullNarrative || caseStudy?.narrative) && <p className="text-gray-500">No narrative yet. Run synthesis.</p>}
          {(caseStudy?.fullNarrative || caseStudy?.narrative) && <>
            <h2 className="font-semibold">Model Output</h2>
            <pre className="whitespace-pre-wrap text-xs max-h-72 overflow-auto border rounded p-2 bg-gray-50">{caseStudy.fullNarrative || caseStudy.narrative}</pre>
            <h3 className="font-semibold">Quiz ({caseStudy.quizQuestions?.length || 0})</h3>
            {(!caseStudy.quizQuestions || caseStudy.quizQuestions.length === 0) && <div className="text-xs text-amber-600">No quiz questions stored (persistence issue?)</div>}
            {caseStudy.quizQuestions && caseStudy.quizQuestions.length > 0 && (
              <ul className="space-y-2 text-xs">
                {caseStudy.quizQuestions?.map((q: any) => (
                  <li key={q.id} className="border rounded p-2 bg-gray-50">
                    <div className="font-medium">{q.prompt}</div>
                    <ol className="list-disc pl-4">
                      {q.options.map((o: string, idx: number) => <li key={idx} className={idx === q.correctOptionIndex ? 'text-green-700 font-semibold' : 'text-gray-700'}>{o}</li>)}
                    </ol>
                    <div className="italic opacity-80">{q.explanation}</div>
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => { setEditNarrative(caseStudy.fullNarrative || caseStudy.narrative || ''); setEditQuiz(caseStudy.quizQuestions || []); setTab('review') }} className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-slate-700 hover:bg-slate-800 text-white text-[11px] font-semibold px-3 py-1.5 shadow">Review & Edit</button>
          </>}
          <button onClick={loadLogs} className="mt-2 text-[11px] underline">View Logs</button>
          {logs && <div className="text-[10px] max-h-40 overflow-auto border rounded p-2 bg-slate-900 text-slate-100 space-y-1">{logs.map((l: any, i: number) => (<div key={i}>{l.phase} {l.error && <span className="text-red-400">ERR:{l.error.slice(0, 80)}</span>}</div>))}</div>}
        </div>
      )}

      {tab === 'review' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-sm space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wide">Refined Title</label>
            <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full border rounded px-2 py-1.5 text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wide">Narrative</label>
            <textarea value={editNarrative} onChange={e => setEditNarrative(e.target.value)} rows={18} className="w-full border rounded px-2 py-2 text-xs font-mono leading-relaxed" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between"><h3 className="font-semibold">Quiz</h3><button onClick={addQuiz} className="text-[11px] px-2 py-1 rounded bg-emerald-600 text-white">Add Question</button></div>
            <ul className="space-y-2">
              {editQuiz.map((q, i) => (
                <li key={i} className="border rounded p-2 bg-gray-50 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-200 rounded">#{i + 1}</span>
                    <input value={q.prompt} onChange={e => setEditQuiz(arr => arr.map((qq, j) => j === i ? { ...qq, prompt: e.target.value } : qq))} className="flex-1 border rounded px-2 py-1 text-[11px]" placeholder="Question prompt" />
                    <select value={q.category || ''} onChange={e => setEditQuiz(arr => arr.map((qq, j) => j === i ? { ...qq, category: e.target.value } : qq))} className="border rounded text-[11px] px-1 py-0.5">
                      <option value="">cat</option>
                      <option value="timeline">timeline</option>
                      <option value="actor">actor</option>
                      <option value="mechanism">mechanism</option>
                      <option value="red_flag">red_flag</option>
                      <option value="regulatory_response">regulatory_response</option>
                      <option value="impact">impact</option>
                      <option value="lesson">lesson</option>
                    </select>
                    <select value={q.difficulty || 'easy'} onChange={e => setEditQuiz(arr => arr.map((qq, j) => j === i ? { ...qq, difficulty: e.target.value } : qq))} className="border rounded text-[11px] px-1 py-0.5">
                      <option value="easy">easy</option>
                      <option value="medium">medium</option>
                      <option value="hard">hard</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {q.options.map((o, oi) => (
                      <input key={oi} value={o} onChange={e => setEditQuiz(arr => arr.map((qq, j) => j === i ? { ...qq, options: qq.options.map((oo, ooj) => ooj === oi ? e.target.value : oo) } : qq))} className={`border rounded px-1 py-1 text-[11px] ${q.correctOptionIndex === oi ? 'border-green-600 bg-green-50' : ''}`} />
                    ))}
                  </div>
                  <div className="flex gap-2 items-center flex-wrap text-[10px]">
                    <span>Correct:</span>
                    {q.options.map((_, oi) => (
                      <button key={oi} onClick={() => setEditQuiz(arr => arr.map((qq, j) => j === i ? { ...qq, correctOptionIndex: oi } : qq))} className={`px-1.5 py-0.5 rounded border ${q.correctOptionIndex === oi ? 'bg-green-600 text-white border-green-600' : 'bg-white'}`}>{oi + 1}</button>
                    ))}
                  </div>
                  <textarea value={q.explanation} onChange={e => setEditQuiz(arr => arr.map((qq, j) => j === i ? { ...qq, explanation: e.target.value } : qq))} rows={2} className="w-full border rounded px-2 py-1 text-[11px]" placeholder="Explanation" />
                </li>
              ))}
            </ul>
          </div>
          <button onClick={saveEdits} disabled={saving} className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-[11px] font-semibold px-3 py-1.5 shadow">{saving ? 'Saving…' : 'Save & Continue'}</button>
        </div>
      )}

      {tab === 'publish' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-3 text-sm">
          <div><span className="font-semibold">Status:</span> {caseStudy?.status}</div>
          <div><span className="font-semibold">Slug:</span> {caseStudy?.slug || '(will generate on next synthesis)'} </div>
          <div className="text-xs text-gray-600">Review final details then publish.</div>
          <button onClick={publish} disabled={publishing || caseStudy?.status === 'PUBLISHED'} className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-[11px] font-semibold px-3 py-1.5 shadow">{publishing ? 'Publishing…' : caseStudy?.status === 'PUBLISHED' ? 'Already Published' : 'Publish Case'}</button>
        </div>
      )}
    </div>
  )
}

function TabBar({ tab, setTab, caseStudy }: any) {
  const tabs: { key: typeof tab; label: string; ready?: boolean }[] = [
    { key: 'seed', label: '1. Seed', ready: !!caseStudy },
    { key: 'sources', label: '2. Sources', ready: !!caseStudy?.sources },
    { key: 'synth', label: '3. Synthesis', ready: !!caseStudy?.fullNarrative },
    { key: 'review', label: '4. Review/Edit', ready: !!caseStudy?.fullNarrative },
    { key: 'publish', label: '5. Publish', ready: caseStudy?.status === 'PUBLISHED' || !!caseStudy?.fullNarrative }
  ]
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition border ${tab === t.key ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'} ${!t.ready && tab !== t.key ? 'opacity-60' : ''}`}
        >{t.label}</button>
      ))}
    </div>
  )
}

export default function AdminCaseDetail({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminCaseDetailCore params={params} />
    </Suspense>
  );
}

function ProgressBar({ step }: { step: 'seed' | 'sources' | 'synth' | 'review' | 'publish' }) {
  const order: typeof step[] = ['seed', 'sources', 'synth', 'review', 'publish']
  const idx = order.indexOf(step)
  return (
    <div className="flex items-center gap-2" aria-label="Progress">
      {order.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full text-[11px] flex items-center justify-center font-semibold ${i <= idx ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{i + 1}</div>
          {i < order.length - 1 && <div className={`h-0.5 w-10 ${i < idx ? 'bg-blue-600' : 'bg-gray-300'}`}></div>}
        </div>
      ))}
    </div>
  )
}
