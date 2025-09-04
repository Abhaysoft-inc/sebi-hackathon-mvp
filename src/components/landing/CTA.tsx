export function CTA() {
  return (
    <section className="relative py-28 bg-amber-100/25">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl border border-gray-200 bg-white/60 backdrop-blur p-10 shadow-sm">
          <div className="space-y-6 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
              Empowering Investors with Insight, Community, and Innovation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
              Experience a next-generation platform for market education and engagement. Connect with SEBI-registered experts, participate in gamified challenges, explore multilingual resources, and access real-time insights. Our monitored community, creative case studies, and accessibility-first design ensure everyone can learn, compete, and grow—no matter their background.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="rounded-md bg-white border border-indigo-600 text-indigo-600 px-7 py-3 text-base font-semibold shadow transition-colors duration-200 hover:bg-indigo-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
              >
                Get Started
              </a>
              <a
                href="/about"
                className="rounded-md bg-white border border-gray-300 text-gray-900 px-7 py-3 text-base font-semibold shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
