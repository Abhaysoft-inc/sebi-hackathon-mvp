interface Feature {
  title: string
  description: string
  accent?: string
}

const features: Feature[] = [
  {
    title: 'Narrative-first learning',
    description: 'Each case frames market behavior or misconduct as a clear story arc—context, mechanism, signals, impact, and lessons.'
  },
  {
    title: 'Adaptive quiz design',
    description: 'Structured multi-question sets reinforce retention across timelines, actors, red flags, and regulatory responses.'
  },
  {
    title: 'Source-linked synthesis',
    description: 'Generated narratives are backed by enrichment passes across news and reference sources for transparency.'
  },
  {
    title: 'Rapid authoring workflow',
    description: 'Create, enrich, synthesize, refine, and publish—all in a guided 5-step pipeline.'
  }
]

export function FeatureBlocks() {
  return (
    <section className="relative py-20 bg-amber-100/25">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div className="max-w-xl space-y-4">
            <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-gray-900 leading-snug">
              Structured building blocks for <span className="inline-block rounded-md bg-indigo-600 px-2 py-1 text-white">analytical skill</span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Designed for clarity and iteration. Each artifact is intentional: inputs, enrichment signals, narrative layers, and assessment.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Fast authoring</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Durable retention</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Source awareness</span>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(f => (
            <div key={f.title} className="group relative rounded-xl border border-gray-200 bg-white/60 backdrop-blur p-6 shadow-sm hover:shadow-md transition">
              <div className="absolute top-0 left-0 h-1 w-10 bg-indigo-600 rounded-tl-xl rounded-br-lg" />
              <div className="relative space-y-3">
                <h3 className="text-base font-semibold text-gray-900 leading-snug tracking-tight">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <GridFade />
    </section>
  )
}

function GridFade() { return null }