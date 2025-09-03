"use client"

import { useState, useMemo } from 'react'

export default function AdminHome() {
  const [form, setForm] = useState({
    companyName: '', ticker: '', periodStart: '', periodEnd: '', shortSummary: '', seedTitle: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [activeStep, setActiveStep] = useState<'seed'|'enrich'|'synth'|'review'|'publish'>('seed')
  const [enriching, setEnriching] = useState(false)
  const [enrichment, setEnrichment] = useState<any>(null)
  const [synth, setSynth] = useState<any>(null)
  const [synthLoading, setSynthLoading] = useState(false)
  const [providerFilter, setProviderFilter] = useState<string | null>(null)
  const [expandedSource, setExpandedSource] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const update = (k:string,v:string)=> setForm(f=>({...f,[k]:v}))

  const submit = async (e:React.FormEvent)=>{
    e.preventDefault()
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await fetch('/admin/api/cases',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
      const data = await res.json()
      if(!res.ok) throw new Error(data.error||'Request failed')
      setResult(data.caseStudy)
      setActiveStep('enrich')
    } catch(err:any){ setError(err.message) } finally { setLoading(false) }
  }

  const runEnrichment = async ()=>{
    if(!result?.id) return
    setEnriching(true); setEnrichment(null); setSynth(null)
    try {
      const res = await fetch(`/admin/api/cases/${result.id}/enrich`, { method:'POST' })
      const data = await res.json(); if(!res.ok) throw new Error(data.error||'Enrichment failed')
      setEnrichment(data)
    } catch(err:any){ setEnrichment({ error: err.message }) } finally { setEnriching(false) }
  }
  const runSynthesis = async ()=>{
    if(!result?.id) return
    setSynthLoading(true)
    try {
      const res = await fetch(`/admin/api/cases/${result.id}/synthesize`, { method:'POST' })
      const data = await res.json(); if(!res.ok) throw new Error(data.error||'Synthesis failed')
      setSynth(data) // stay on synth step so user sees output immediately
    } catch(err:any){ setSynth({ error: err.message }) } finally { setSynthLoading(false) }
  }
  const publishCase = async ()=>{
    if(!result?.id) return
    try {
      const res = await fetch(`/admin/api/cases/${result.id}/publish`, { method:'POST' })
      const data = await res.json(); if(!res.ok) throw new Error(data.error||'Publish failed')
      setResult(data.caseStudy); setActiveStep('publish')
    } catch(err:any){ setError(err.message) }
  }

  const canNext = () => {
    if (activeStep==='seed') return !!result
    if (activeStep==='enrich') return !!enrichment?.sources?.length
    if (activeStep==='synth') return !!synth && !synth.error
    if (activeStep==='review') return true
    return false
  }
  const nextStep = () => {
    if (activeStep==='seed') setActiveStep('enrich')
    else if (activeStep==='enrich') setActiveStep('synth')
    else if (activeStep==='synth') setActiveStep('review')
    else if (activeStep==='review') setActiveStep('publish')
  }
  const prevStep = () => {
    if (activeStep==='enrich') setActiveStep('seed')
    else if (activeStep==='synth') setActiveStep('enrich')
    else if (activeStep==='review') setActiveStep('synth')
    else if (activeStep==='publish') setActiveStep('review')
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="heading-page">Case Creation</h1>
        <ProgressBar step={activeStep} />
      </div>
      <div className="panel panel-spacious space-y-6">
        {activeStep==='seed' && (
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Step 1: Seed Draft</h2>
              <p className="text-xs text-gray-500">Provide minimal context. After creation you can enrich with external sources.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-semibold uppercase text-gray-500">Case / Topic Title *</label>
                <input required value={form.companyName} onChange={e=>update('companyName', e.target.value)} placeholder="e.g. Harshad Mehta Scam" className="w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase text-gray-500">Ticker</label>
                <input value={form.ticker} onChange={e=>update('ticker', e.target.value.toUpperCase())} className="w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition tracking-wide" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase text-gray-500">Period Start</label>
                <input type="date" value={form.periodStart} onChange={e=>update('periodStart', e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase text-gray-500">Period End</label>
                <input type="date" value={form.periodEnd} onChange={e=>update('periodEnd', e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition" />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-semibold uppercase text-gray-500">Seed Title (optional)</label>
                <input value={form.seedTitle} onChange={e=>update('seedTitle', e.target.value)} placeholder="Alternate internal title (optional)" className="w-full rounded-lg border border-gray-300 bg-white/70 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition" />
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-semibold uppercase text-gray-500">Short Summary / Seed Context *</label>
                <textarea required value={form.shortSummary} onChange={e=>update('shortSummary', e.target.value)} rows={6} className="w-full rounded-xl border border-gray-300 bg-white/70 px-3 py-3 text-sm leading-relaxed shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition resize-y" placeholder="Brief description of the event / suspected fraud angle" />
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 shadow">
                {loading && <span className="h-4 w-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />}
                {loading ? 'Creating Draft…' : 'Create Draft Case'}
              </button>
              {result && <span className="text-xs text-green-700 bg-green-50 border border-green-300 rounded-md px-2 py-1">Draft #{result.id} created.</span>}
              {error && <span className="text-xs text-red-600">{error}</span>}
            </div>
          </form>
        )}

        {activeStep==='enrich' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Step 2: Enrichment</h2>
              <div className="flex gap-2">
                <button onClick={prevStep} className="px-2.5 py-1 rounded border text-[11px]">Back</button>
                <button disabled={!enrichment?.sources?.length} onClick={nextStep} className="px-2.5 py-1 rounded bg-indigo-600 text-white text-[11px] disabled:opacity-50">Next</button>
              </div>
            </div>
            <button onClick={runEnrichment} disabled={enriching} className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-[11px] font-semibold px-3 py-1.5 shadow">
              {enriching && <span className="h-3 w-3 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />}
              {enriching ? 'Enriching…' : (enrichment? 'Re-run Enrichment':'Run Enrichment')}
            </button>
            {enrichment?.error && <div className="text-red-600 border border-red-300 bg-red-50 p-2 rounded">{enrichment.error}</div>}
            {enrichment && !enrichment.error && (
              <SourcesPanel
                enrichment={enrichment}
                providerFilter={providerFilter}
                setProviderFilter={setProviderFilter}
                expandedSource={expandedSource}
                setExpandedSource={setExpandedSource}
              />
            )}
          </div>
        )}

        {activeStep==='synth' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Step 3: Synthesis</h2>
              <div className="flex gap-2">
                <button onClick={prevStep} className="px-2.5 py-1 rounded border text-[11px]">Back</button>
                <button disabled={!synth || synth.error} onClick={nextStep} className="px-2.5 py-1 rounded bg-purple-600 text-white text-[11px] disabled:opacity-50">Next</button>
              </div>
            </div>
            {!synth && <button onClick={runSynthesis} disabled={synthLoading || !enrichment?.sources} className="inline-flex items-center justify-center gap-2 rounded-md bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white text-[11px] font-semibold px-3 py-1.5 shadow">
              {synthLoading && <span className="h-3 w-3 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />}
              {synthLoading ? 'Synthesizing…' : 'Generate Narrative & Quiz'}
            </button>}
            {synth?.error && <div className="text-red-600 border border-red-300 bg-red-50 p-2 rounded">{synth.error}</div>}
            {synth && !synth.error && (
              <div className="space-y-2 max-h-[420px] overflow-auto">
                <div className="font-semibold flex items-center gap-2">Narrative {synth.mode && <span className="text-[9px] font-medium bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded uppercase">{synth.mode}</span>}</div>
                <p className="whitespace-pre-wrap leading-relaxed text-[11px]">{synth.fullNarrative}</p>
                <div className="font-semibold">Quiz ({synth.quiz?.length || 0})</div>
                <ol className="space-y-2 list-decimal pl-5">
                  {synth.quiz?.map((q:any)=> (
                    <li key={q.order} className="space-y-1">
                      <div className="font-medium">{q.prompt}</div>
                      <ul className="list-disc pl-5 space-y-0.5">
                        {q.options.map((o:string,idx:number)=> <li key={idx} className={idx===q.correctOptionIndex? 'text-green-700 font-semibold':'text-purple-900'}>{o}</li>)}
                      </ul>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {activeStep==='review' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Step 4: Review & Edit</h2>
              <div className="flex gap-2">
                <button onClick={prevStep} className="px-2.5 py-1 rounded border text-[11px]">Back</button>
                <button onClick={nextStep} className="px-2.5 py-1 rounded bg-slate-700 text-white text-[11px]">Next</button>
              </div>
            </div>
            {!synth && <p className="text-gray-500">Run synthesis first.</p>}
      {synth && !synth.error && result && (
              <div className="space-y-2">
                <p className="text-gray-600">Open the detailed editor for full narrative & quiz editing before publishing.</p>
        <a href={`/admin/case/${result.id}?t=review`} className="inline-block px-3 py-1.5 rounded bg-slate-700 text-white text-[11px] font-semibold">Open Detailed Editor</a>
              </div>
            )}
          </div>
        )}

        {activeStep==='publish' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Step 5: Publish</h2>
              <div className="flex gap-2">
                <button onClick={prevStep} className="px-2.5 py-1 rounded border text-[11px]">Back</button>
              </div>
            </div>
            {!synth && <p className="text-gray-500">Synthesize first to publish.</p>}
            {synth && !synth.error && (
              <div className="space-y-2">
                <p className="text-gray-600">Publish makes the case visible to end users.</p>
                <button onClick={publishCase} disabled={result?.status==='PUBLISHED'} className="px-3 py-1.5 rounded bg-emerald-600 text-white text-[11px] font-semibold disabled:opacity-60">
                  {result?.status==='PUBLISHED'? 'Already Published':'Publish Case'}
                </button>
                {result?.status==='PUBLISHED' && <p className="text-emerald-700 font-medium">Published ✅</p>}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-[10px] text-gray-500">Unauthenticated prototype endpoints.</div>
          <div className="flex gap-2">
            {activeStep!=='seed' && <button onClick={prevStep} className="btn-xs btn-surface">Back</button>}
            {activeStep!=='publish' && <button onClick={nextStep} disabled={!canNext()} className="btn-xs btn-primary-xs disabled:opacity-40">Next</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProgressBar({ step }: { step: 'seed'|'enrich'|'synth'|'review'|'publish' }) {
  const order: typeof step[] = ['seed','enrich','synth','review','publish']
  const idx = order.indexOf(step)
  return (
    <div className="flex items-center gap-2 mb-4" aria-label="Progress">
      {order.map((s,i)=> (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full text-[11px] flex items-center justify-center font-semibold ${i<=idx? 'bg-blue-600 text-white':'bg-gray-200 text-gray-600'}`}>{i+1}</div>
          {i<order.length-1 && <div className={`h-0.5 w-10 ${i<idx? 'bg-blue-600':'bg-gray-300'}`}></div>}
        </div>
      ))}
    </div>
  )
}

// StepNav removed in wizard redesign.

// --- Helper component for source inspection ---
function SourcesPanel({ enrichment, providerFilter, setProviderFilter, expandedSource, setExpandedSource }: any) {
  const sources = enrichment.sources || []
  const stats = enrichment.stats || {}
  const providerCounts = useMemo(()=>{
    const map: Record<string, number> = {}
    for (const s of sources) map[s.provider] = (map[s.provider]||0)+1
    return map
  },[sources])
  const filtered = providerFilter ? sources.filter((s:any)=>s.provider===providerFilter) : sources
  const badgeColor = (p:string) => p==='guardian' ? 'bg-emerald-600' : p==='currents' ? 'bg-indigo-600' : p==='wikipedia' ? 'bg-slate-600' : p==='yahoo-finance' ? 'bg-amber-600' : 'bg-gray-600'

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800 space-y-2 max-h-80 overflow-auto">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="font-semibold flex items-center gap-2">
          <span>Sources ({sources.length})</span>
          <div className="flex gap-1 flex-wrap">
            {Object.entries(providerCounts).map(([p,c])=> (
              <button
                key={p}
                onClick={()=> setProviderFilter(providerFilter===p? null : p)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold text-white ${badgeColor(p)} ${providerFilter===p ? 'ring-2 ring-offset-1 ring-white/70':''}`}
                title={`Filter to ${p}`}
              >{p}:{c}</button>
            ))}
            {providerFilter && (
              <button onClick={()=>setProviderFilter(null)} className="px-1 py-0.5 rounded text-[10px] font-medium bg-gray-300 text-gray-800">ALL</button>
            )}
          </div>
        </div>
      </div>
      <ul className="space-y-1">
        {filtered.map((s:any,i:number)=>{
          const idx = sources.indexOf(s)
          const isOpen = expandedSource===idx
          return (
            <li key={idx} className="border border-blue-200 rounded bg-white/60">
              <button
                type="button"
                onClick={()=> setExpandedSource(isOpen? null : idx)}
                className="w-full text-left px-2 py-1 flex items-start gap-2"
              >
                <span className={`shrink-0 mt-0.5 inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide text-white ${badgeColor(s.provider)}`}>{s.provider}</span>
                <span className="flex-1 truncate pr-2">{s.title || s.url || (s.snippet? s.snippet.slice(0,80): 'Untitled')}</span>
                <span className="text-[9px] opacity-60">{isOpen? '−':'+'}</span>
              </button>
              {isOpen && (
                <div className="px-3 pb-2 pt-0.5 text-[11px] leading-relaxed space-y-1 bg-white/80 border-t border-blue-100">
                  {s.url && <div className="break-words"><span className="font-medium">URL:</span> <a href={s.url} target="_blank" className="text-blue-700 underline break-all">{s.url}</a></div>}
                  {s.publishedAt && <div><span className="font-medium">Published:</span> {s.publishedAt}</div>}
                  <div className="whitespace-pre-wrap"><span className="font-medium">Snippet:</span> {s.snippet || '(none)'} </div>
                  {s.extra && <details className="mt-1">
                    <summary className="cursor-pointer text-blue-700">Extra Meta</summary>
                    <pre className="mt-1 max-h-40 overflow-auto bg-slate-900 text-slate-100 p-2 rounded text-[10px] leading-snug">{JSON.stringify(s.extra,null,2)}</pre>
                  </details>}
                </div>
              )}
            </li>
          )
        })}
        {filtered.length===0 && (
          <li className="text-[11px] italic text-blue-600/70">No sources for this filter.</li>
        )}
      </ul>
      {stats && (
        <div className="pt-1 text-[10px] text-blue-700/80 tracking-wide space-y-0.5">
          <div>Guardian: {stats.guardian||0} | Currents: {stats.currents||0} | Wikipedia: {stats.wikipedia||0} | Finance: {stats.finance||0}</div>
          <div className="opacity-70">Tokens: {(stats._requiredTokens||[]).join(', ') || '—'} | Queries: {stats._queriesTried}</div>
        </div>
      )}
    </div>
  )
}
