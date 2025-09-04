import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ExpandableText from '@/components/ExpandableText'
import React from 'react'

async function getIPO(id: number) {
  // Temporary any return to accommodate newly added JSON columns pending Prisma client regeneration on Windows (EPERM issue)
  return prisma.iPO.findUnique({ where: { id }, include: { opinions: true } }) as any
}

const stanceMeta: Record<string, { label: string; color: string }> = {
  APPLY: { label: 'Apply', color: 'bg-green-500' },
  AVOID: { label: 'Avoid', color: 'bg-red-500' },
  NEUTRAL_APPLY_FOR_LISTING_GAINS: { label: 'Neutral / Listing Gains', color: 'bg-yellow-400 text-black' }
}

function SentimentBar({ opinions }: { opinions: any[] }) {
  const counts: Record<string, number> = {}
  for (const o of opinions) counts[o.stance] = (counts[o.stance] || 0) + 1
  const total = opinions.length || 1
  const segments = Object.entries(counts).map(([stance, v]) => ({ stance, pct: (v / total) * 100 }))
  return (
    <div className="space-y-2">
      <div className="h-4 w-full rounded-full overflow-hidden flex bg-gray-700">
        {segments.map(s => (
          <div key={s.stance} className={`${stanceMeta[s.stance]?.color || 'bg-gray-400'} h-full`} style={{ width: `${s.pct}%` }} title={`${s.stance} ${s.pct.toFixed(0)}%`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-xs">
        {segments.map(s => (
          <span key={s.stance} className="inline-flex items-center gap-1">
            <span className={`inline-block w-3 h-3 rounded ${stanceMeta[s.stance]?.color || 'bg-gray-400'}`}></span>
            {stanceMeta[s.stance]?.label || s.stance} ({s.pct.toFixed(0)}%)
          </span>
        ))}
      </div>
    </div>
  )
}

export default async function IPOShow(props: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const resolvedParams: any = await (props as any).params
  const idNum = Number(resolvedParams.id)
  if (Number.isNaN(idNum)) return notFound()
  const ipo: any = await getIPO(idNum)
  if (!ipo) return notFound()
  const stats = ipo.statsJson || {}
  const reservation = ipo.reservationJson || {}
  const subscription = ipo.subscriptionStatusJson || {}
  const highlights = [
    { label: 'Issue Window', value: `${new Date(ipo.issueOpenDate).toLocaleDateString()} – ${new Date(ipo.issueCloseDate).toLocaleDateString()}` },
    { label: 'Price Band', value: `₹${ipo.priceBandLower} – ₹${ipo.priceBandUpper}` },
    { label: 'Issue Size', value: stats.totalIssueValue || '—', sub: stats.totalIssueShares || '' },
    { label: 'Est. Mkt Cap', value: stats.marketCap || '—' },
    { label: 'Lot Size', value: ipo.lotSize },
    { label: 'Face Value', value: stats.faceValue || '₹10' }
  ]
  // Trimmed advanced visual widgets for cleaner first-pass layout
  const timeline: any[] = []
  const anchors: any = {}
  return (
    <div className="bg-white">
  <div className="px-6 pt-10 pb-4 max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-6 flex-1">
            <div className="w-24 h-24 rounded-xl overflow-hidden ring-1 ring-gray-200 bg-gray-50 shadow-sm">
              <img src={ipo.logoUrl} alt={ipo.companyName} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-4 flex-1">
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">{ipo.companyName}</h1>
              <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wide font-medium">
                {stats.issueType && <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white">{stats.issueType}</span>}
                {stats.listingAt && <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white">{stats.listingAt}</span>}
                {stats.saleType && <span className="px-2 py-0.5 rounded-md bg-pink-500 text-white">{stats.saleType}</span>}
              </div>
              <p className="text-sm leading-relaxed text-gray-700 max-w-3xl">{ipo.aboutCompany}</p>
              <div className="flex gap-3 pt-1">
                <a href="https://www.nseindia.com/" target="_blank" className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2 shadow-sm transition">Apply</a>
                <a href="/ipos" className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium px-4 py-2 shadow-sm transition">All IPOs</a>
              </div>
            </div>
          </div>
        </header>
        <section>
          <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {highlights.map(h => (
              <div key={h.label} className="relative rounded-lg bg-white border border-gray-100 px-3 py-3 shadow-sm flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wide text-gray-500 font-medium">{h.label}</span>
                <span className="text-sm font-semibold text-gray-900">{h.value}</span>
                {h.sub && <span className="text-[10px] text-gray-500">{h.sub}</span>}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 via-amber-500 to-pink-500 opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </section>

        {/* Highlights */}
  {/* Core sections */}

        {/* Allocation & Subscription */}
  <section className="grid lg:grid-cols-2 gap-8 items-stretch">
          {Object.keys(reservation).length > 0 && (
            <div className="h-full">
              <div className="rounded-lg p-5 bg-white border border-gray-100 shadow-sm h-full flex flex-col">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-base font-bold text-gray-900">Reservation Split</span>
                  <span className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="space-y-4 flex-1">
                  {Object.entries(reservation as any).map(([cat, v]: any) => { const pct = parseFloat((v.percent || '0').replace(/[^0-9.]/g,'')) || 0; return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-[11px] uppercase tracking-wide text-gray-600 font-medium"><span>{cat}</span><span>{v.percent}</span></div>
                      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden ring-1 ring-gray-200"><div className="h-full bg-indigo-500" style={{ width: `${pct}%` }} /></div>
                      <div className="text-[10px] text-gray-500">{v.shares} shares</div>
                    </div>
                  )})}
                </div>
              </div>
            </div>
          )}
          {subscription.overall && (
            <div className="h-full">
              <div className="rounded-lg p-5 bg-white border border-gray-100 shadow-sm h-full flex flex-col">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-base font-bold text-gray-900">Live Subscription</span>
                  <span className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-500">{subscription.asOf && `As of ${subscription.asOf}`}</span>
                </div>
                <div className="space-y-6 flex-1 flex flex-col">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Overall</div>
                    <div className="flex items-baseline gap-3"><span className="text-3xl font-bold text-indigo-600">{subscription.overall}</span><span className="text-[11px] text-gray-500">times</span></div>
                  </div>
                  <div className="space-y-4">
                    {Object.entries((subscription.categories||{}) as any).map(([cat, v]: any) => (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-[11px] uppercase tracking-wide text-gray-600 font-medium"><span>{cat}</span><span>{v.subscribed}</span></div>
                        <div className="h-2 w-full rounded bg-gray-100 overflow-hidden ring-1 ring-gray-200"><div className="h-full bg-amber-500" style={{ width: `${Math.min(parseFloat((v.subscribed||'0').replace(/[^0-9.]/g,''))*10,100)}%` }} /></div>
                        <div className="text-[10px] text-gray-500">Bids: {v.bids} • Offered: {v.offered}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] text-gray-500 pt-1 mt-auto">Applications: {subscription.totalApplications} • Total Bids: {subscription.totalBids}</div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Financial Snapshot */}
        {Array.isArray(ipo.financialsJson) && (
    <section className="space-y-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-base font-bold text-gray-900">Financial Snapshot</span>
                <span className="flex-1 h-px bg-gray-200" />
              </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {(ipo.financialsJson as any[]).map((f: any, i: number) => (
                <div key={i} className="rounded-xl p-4 bg-white border border-gray-200 shadow-sm flex flex-col">
                  <span className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">{f.metric}</span>
                  <span className="mt-1 text-lg font-semibold text-gray-900">{f.value}</span>
                  {f.growth && <span className={`text-[11px] mt-1 font-medium ${f.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{f.growth}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Strengths & Risks */}
  <section className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-base font-bold text-gray-900">Strengths</span>
              <span className="flex-1 h-px bg-gray-200" />
            </div>
            <ul className="space-y-2">{ipo.strengths.map((s: string, i: number) => (<li key={i} className="flex items-start gap-2 text-sm text-gray-700"><span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-green-500" />{s}</li>))}</ul>
          </div>
          <div className="space-y-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-base font-bold text-gray-900">Risks</span>
              <span className="flex-1 h-px bg-gray-200" />
            </div>
            <ul className="space-y-2">{ipo.risks.map((r: string, i: number) => (<li key={i} className="flex items-start gap-2 text-sm text-gray-700"><span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-red-500" />{r}</li>))}</ul>
          </div>
        </section>

        {/* Expert Opinions */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-base font-bold text-gray-900">Expert Opinions</span>
            <span className="flex-1 h-px bg-gray-200" />
            <div className="w-1/2 max-w-sm"><SentimentBar opinions={ipo.opinions || []} /></div>
          </div>
          <div className="space-y-5">{ipo.opinions.length === 0 && <div className="text-sm text-gray-500">No expert opinions yet.</div>}{ipo.opinions.map((op: any) => (<OpinionCard key={op.id} op={op} />))}</div>
        </section>

        {/* Advanced */}
        <DetailsDisclosure><AdvancedDetails ipo={ipo} /></DetailsDisclosure>
      </div>
    </div>
  )
}

// Simplified layout version – removed sidebar snapshot for cleaner hierarchy

function DetailsDisclosure({ children }: { children: React.ReactNode }) {
  return (
  <details className="group rounded-lg bg-white border border-gray-100 p-6 shadow">
      <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
        <span className="text-base font-bold text-gray-900">Advanced Details & Tables</span>
        <span className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 text-xs text-gray-600 group-open:rotate-180 transition">▼</span>
      </summary>
      <div className="pt-6 space-y-10 transition-all duration-300 ease-out group-open:animate-in group-open:fade-in group-open:slide-in-from-top-2">{children}</div>
    </details>
  )
}

// Removed SnapshotRow & MetricStrip components (no longer used)

function AdvancedDetails({ ipo }: { ipo: any }) {
  return (
    <div className="space-y-12">
      {ipo.financialsTableJson && (
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-800">Multi-Period Financials</h3>
          <div className="overflow-auto rounded-lg border border-gray-200 bg-white">
            <table className="text-xs w-full min-w-[560px] border-collapse">
              <thead><tr className="bg-gray-50 text-gray-700"><th className="text-left p-2 font-medium">Metric</th>{(ipo.financialsTableJson.periods || []).map((p: string) => <th key={p} className="text-right p-2 font-medium">{p}</th>)}</tr></thead>
              <tbody>{(ipo.financialsTableJson.rows || []).map((row: any, i: number) => (<tr key={row.label} className={i % 2 === 0 ? 'bg-gray-50/60' : ''}><td className="p-2 font-medium text-gray-800">{row.label}</td>{row.values.map((val: string, j: number) => (<td key={j} className="p-2 text-right text-gray-700">{val}</td>))}</tr>))}</tbody>
            </table>
          </div>
          {ipo.financialsTableJson.unit && <p className="text-[10px] text-gray-500 mt-1">Amounts in {ipo.financialsTableJson.unit}</p>}
        </div>
      )}
      {ipo.objectsOfIssueJson && (
        <div><h3 className="text-sm font-semibold mb-3 text-gray-800">Objects of the Issue</h3><ol className="list-decimal list-inside text-sm space-y-1 text-gray-700">{(ipo.objectsOfIssueJson as any[]).map(o => (<li key={o.sn}>{o.object} {o.amountCr && o.amountCr !== '—' && <span className="text-[11px] text-gray-500">({o.amountCr} Cr)</span>}</li>))}</ol></div>
      )}
    </div>
  )
}

function OpinionCard({ op }: { op: any }) {
  const meta = stanceMeta[op.stance] || { label: op.stance, color: 'bg-gray-500' }
  return (
    <div className="rounded-xl p-5 bg-white border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden ring-1 ring-gray-200 bg-gray-50"><img src={op.expertImage} alt={op.expertName} className="w-full h-full object-cover" /></div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="font-semibold text-base text-gray-900 truncate">{op.expertName}</h3>
            <span className={`text-[10px] px-2 py-1 rounded-md font-semibold tracking-wide ${meta.color} text-white shadow-sm`}>{meta.label}</span>
            <span className="text-[10px] text-gray-500">{op.registrationNumber}</span>
          </div>
          <ExpandableText summary={op.summary} full={op.fullQuote} />
        </div>
      </div>
    </div>
  )
}

// ExpandableText moved to client component file