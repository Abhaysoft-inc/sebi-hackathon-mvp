import Link from 'next/link'
import { prisma } from '@/lib/prisma'

async function fetchIPOs() {
  // Direct DB query in a Server Component avoids network fetch issues.
  return prisma.iPO.findMany({ include: { opinions: true }, orderBy: { issueOpenDate: 'asc' } })
}

function sentimentBreakdown(opinions: any[]) {
  const counts: Record<string, number> = {}
  for (const o of opinions) counts[o.stance] = (counts[o.stance] || 0) + 1
  const total = opinions.length || 1
  return Object.entries(counts).map(([k, v]) => ({ stance: k, pct: (v / total) * 100 }))
}

const stanceColor: Record<string, string> = {
  APPLY: 'bg-green-500',
  AVOID: 'bg-red-500',
  NEUTRAL_APPLY_FOR_LISTING_GAINS: 'bg-yellow-400'
}

export default async function IPOPage() {
  const ipos = await fetchIPOs()
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Upcoming IPOs</h1>
      {ipos.length === 0 && (
        <div className="text-sm text-gray-400 mb-8">No IPO data found. (Seed might not have run or API error)</div>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ipos.map((ipo: any) => {
          const breakdown = sentimentBreakdown(ipo.opinions || [])
          return (
            <Link key={ipo.id} href={`/ipos/${ipo.id}`} className="group border rounded-xl bg-white/5 hover:bg-white/10 transition p-5 flex flex-col shadow-sm">
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
                  {breakdown.map(b => (
                    <div key={b.stance} className={`${stanceColor[b.stance] || 'bg-gray-400'} h-full`} style={{ width: `${b.pct}%` }} title={`${b.stance} ${b.pct.toFixed(0)}%`} />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] mt-1 text-gray-400">
                  <span>Apply</span><span>Neutral</span><span>Avoid</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}