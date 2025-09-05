interface ValuePoint { title: string; body: string }

const values: ValuePoint[] = [
  { title: 'Signal over noise', body: 'Cases distill events into essential mechanisms, eliminating headline clutter and narrative inflation.' },
  { title: 'Composable structure', body: 'Each layer—seed, enrichment, synthesis, refinement—can evolve independently without breaking flow.' },
  { title: 'Transparent generation', body: 'Synthesis references curated source metadata, improving trust and auditability.' },
  { title: 'Retention by design', body: 'Spaced cognitive friction via ordered multi-question quizzes reinforces recall.' },
  { title: 'Low-friction authoring', body: 'Fast iterative pipeline cuts down creation time from hours to minutes.' },
  { title: 'Extensible taxonomy', body: 'Quiz categories align to analytical dimensions (timeline, actor, mechanism, impact).' }
]

export function ValueGrid() {
  return (
    <section className="relative py-24 border-t border-gray-200 bg-amber-100/25">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-xl space-y-4">
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-gray-900 leading-snug">Guiding <span className="rounded-md bg-indigo-600 px-2 py-1 text-white">principles</span></h2>
          <p className="text-gray-600 text-base leading-relaxed">Opinionated defaults shape a coherent authoring + learning loop while staying flexible for future depth.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map(v => (
            <div key={v.title} className="relative rounded-xl border border-gray-200 bg-white/60 backdrop-blur p-6 shadow-sm hover:shadow-md transition">
              <div className="absolute top-0 left-0 h-1 w-10 bg-indigo-600 rounded-tl-xl rounded-br-lg" />
              <div className="relative space-y-2">
                <h3 className="text-sm font-semibold tracking-tight text-gray-900">{v.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}