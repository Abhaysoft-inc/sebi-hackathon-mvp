import Link from "next/link"

interface CaseStudy {
  id: string | number
  slug?: string | null
  title: string
  narrative: string
  challengeQuestion: string
  options: string[]
  correctOptionIndex: number | null
  explanation: string
  createdAt?: string
}

interface CaseStudyCardProps {
  caseStudy: CaseStudy
}

export default function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  const snippet = caseStudy.narrative.replace(/\n+/g, ' ')
  const maxChars = 180
  const clipped = snippet.length > maxChars ? snippet.slice(0, maxChars).trim() + '…' : snippet

  const href = caseStudy.slug ? `/case/${caseStudy.slug}` : `/case/${caseStudy.id}`
  const questionCount = caseStudy.options?.length || 0
  const created = caseStudy.createdAt ? new Date(caseStudy.createdAt) : null
  const createdLabel = created ? created.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : null

  return (
    <div className="group relative flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500/60 via-indigo-400/60 to-indigo-300/60 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex-1 space-y-3">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold leading-snug text-gray-900 line-clamp-2 tracking-tight">
            {caseStudy.title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-4 leading-relaxed">{clipped}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-3 text-[11px] text-gray-500">
          {createdLabel && <span className="font-medium text-gray-400">{createdLabel}</span>}
          <span className="inline-flex items-center gap-0.5">{questionCount}<span className="text-gray-400">Q</span></span>
        </div>
        <Link href={href} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1 inline-flex items-center gap-1">
          <span>Open</span>
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0L14 7.06v5.19a.75.75 0 001.5 0v-7.5A.75.75 0 0014.75 4h-7.5a.75.75 0 000 1.5h5.19l-7.72 7.72a.75.75 0 000 1.06z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
