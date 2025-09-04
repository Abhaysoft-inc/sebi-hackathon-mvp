interface Testimonial { quote: string; author: string; role: string }

const testimonials: Testimonial[] = [
  { quote: 'The structured flow from enrichment to synthesis shortens our internal research drafting cycle dramatically.', author: 'Alisha K.', role: 'Equity Research Analyst' },
  { quote: 'Narrative backed by source context + adaptive quizzes is a retention cheat code.', author: 'Devraj S.', role: 'Finance Student' },
  { quote: 'We prototype training modules on top of the pipeline—modularity is a huge win.', author: 'Priya M.', role: 'Learning Lead' }
]

export function Testimonials() {
  return (
    <section className="relative py-24 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl space-y-4">
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-gray-900 leading-snug">Early <span className="rounded-md bg-orange-600 px-2 py-1 text-white">user feedback</span></h2>
          <p className="text-gray-600 text-base leading-relaxed">Signals from research, academic, and learning design cohorts during prototype cycles.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map(t => (
            <figure key={t.author} className="group relative rounded-xl border border-gray-200 bg-white/60 backdrop-blur p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div className="absolute top-0 left-0 h-1 w-12 bg-orange-600 rounded-tl-xl rounded-br-lg" />
              <blockquote className="text-sm leading-relaxed text-gray-700 relative">
                <span className="absolute -top-4 -left-2 text-4xl text-orange-300 select-none">"</span>
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 pt-4 border-t border-gray-100 text-[11px] tracking-wide text-gray-500 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-orange-600 text-white text-[10px] font-semibold">{t.author.split(' ')[0][0]}{t.author.split(' ')[1]?.[0]||''}</span>
                <span className="font-semibold text-gray-900">{t.author}</span>
                <span>· {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
