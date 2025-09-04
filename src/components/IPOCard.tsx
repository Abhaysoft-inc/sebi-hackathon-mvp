"use client"
import Link from 'next/link'

const stanceColor: Record<string, string> = {
  APPLY: 'bg-green-500',
  AVOID: 'bg-red-500',
  NEUTRAL_APPLY_FOR_LISTING_GAINS: 'bg-yellow-400'
}

export function IPOCard({ ipo }: { ipo: any }) {
  const counts: Record<string, number> = {}
  for (const o of ipo.opinions || []) counts[o.stance] = (counts[o.stance] || 0) + 1
  const total = (ipo.opinions || []).length || 1
  const segments = Object.entries(counts).map(([stance, v]) => ({ stance, pct: (v / total) * 100 }))
  return (
    <Link href={`/ipos/${ipo.id}`} className="group border rounded-xl bg-white/5 hover:bg-white/10 transition p-5 flex flex-col shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <img src={ipo.logoUrl} alt={ipo.companyName} className="w-12 h-12 rounded object-cover border" />
        <h2 className="font-semibold text-lg group-hover:text-blue-400">{ipo.companyName}</h2>
      </div>
      <div className="text-sm text-gray-300 space-y-1 mb-4">
        <div><span className="font-medium">Issue Window:</span> {new Date(ipo.issueOpenDate).toLocaleDateString()} - {new Date(ipo.issueCloseDate).toLocaleDateString()}</div>
        <div><span className="font-medium">Price Band:</span> ₹{ipo.priceBandLower} - ₹{ipo.priceBandUpper}</div>
        <div><span className="font-medium">Lot Size:</span> {ipo.lotSize}</div>
      </div>
      <div className="mt-auto">
        <div className="h-3 w-full rounded-full overflow-hidden flex bg-gray-700">
          {segments.map(s => (
            <div key={s.stance} className={`${stanceColor[s.stance] || 'bg-gray-400'} h-full`} style={{ width: `${s.pct}%` }} title={`${s.stance} ${s.pct.toFixed(0)}%`} />
          ))}
        </div>
        <div className="flex justify-between text-[10px] mt-1 text-gray-400">
          <span>Apply</span><span>Neutral</span><span>Avoid</span>
        </div>
      </div>
    </Link>
  )
}