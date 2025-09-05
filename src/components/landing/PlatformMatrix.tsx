interface Module { key: string; title: string; blurb: string; status: 'now' | 'next' | 'vision'; }

const modules: Module[] = [
  { key: 'creators', title: 'Regulated Creator Hub', blurb: 'Only SEBI-registered contributors publish explainer videos & deep-dives with credibility markers.', status: 'now' },
  { key: 'cases', title: 'Investigative Case Engine', blurb: 'Narrative + quiz synthesis pipeline for misconduct & market pattern learning.', status: 'now' },
  { key: 'gamification', title: 'Competitions & XP', blurb: 'Timed challenges, profit simulations & streak rewards to sustain engagement.', status: 'now' },
  { key: 'multilingual', title: 'Multilingual Layer', blurb: 'Auto summary + translation of circulars, filings & educator content.', status: 'now' },
  { key: 'realtime-explain', title: 'Real‑Time Price Explain', blurb: 'Contextual micro-explanations combining event streams & news embeddings.', status: 'vision' },
  { key: 'scenarios', title: 'Scenario Sandbox', blurb: 'Run historical or hypothetical shocks against a virtual portfolio.', status: 'vision' },
  { key: 'ai-advisor', title: 'AI Portfolio Insights', blurb: 'Guidance distilled from aggregated expert sessions & case taxonomy.', status: 'vision' },
  { key: 'reg-sim', title: 'Regulator Simulator', blurb: 'Model outcomes of policy changes, circulars, or enforcement actions.', status: 'vision' },
  { key: 'accessibility', title: 'Inclusive Access Stack', blurb: 'Audio nav, screen reader tuning, sign language overlays, color modes.', status: 'next' },
]

const badgeStyles: Record<Module['status'], string> = {
  now: 'bg-emerald-100 text-emerald-700',
  next: 'bg-amber-100 text-amber-800',
  vision: 'bg-indigo-100 text-indigo-700'
}

export function PlatformMatrix() {
  return (
    <section className="relative py-24 border-t border-gray-200 ">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col lg:flex-row gap-10 lg:items-end">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-gray-900 leading-snug">A layered product map</h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Explore the complete set of features: expert content, interactive learning, competitions, accessibility, and more. The platform is designed for rapid insight, accuracy, and continuous iteration—beyond just case studies.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] font-medium">
            <span className="inline-flex items-center gap-1 rounded-md bg-orange-600 px-2 py-0.5 text-white">Now</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-orange-500 px-2 py-0.5 text-white">Next</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-orange-700 px-2 py-0.5 text-white">Vision</span>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map(m => (
            <div key={m.key}
              className={`group relative rounded-xl border border-gray-200 ${m.status === 'vision' ? 'bg-white' : 'bg-white/60 backdrop-blur'} p-5 shadow-sm hover:shadow-md transition`}
            >
              <div className="absolute top-0 left-0 h-1 w-12 bg-orange-600 rounded-tl-xl rounded-br-lg" />
              <div className="relative space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold tracking-tight text-gray-900 leading-snug">{m.title}</h3>
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${badgeStyles[m.status]}`}>{m.status}</span>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">{m.blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
