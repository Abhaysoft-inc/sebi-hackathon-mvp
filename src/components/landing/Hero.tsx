"use client";
import { useEffect, useState } from "react";

const features = [
  "Quizzes",
  "Interactive Case Studies",
  "Verified Educators",
  "Multilingual Summaries",
  "Portfolio Insights",
  "Scenario Sandbox"
];


export function Hero() {
  const [featureIdx, setFeatureIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [prevIdx, setPrevIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setPrevIdx(featureIdx);
        setFeatureIdx((i) => (i + 1) % features.length);
        setAnimating(false);
      }, 400);
    }, 2000);
    return () => clearInterval(interval);
  }, [featureIdx]);

  return (
    <section className="relative py-24 md:py-32 min-h-[70vh] flex items-center overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 w-full">
        <div className="space-y-10">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight text-gray-900 max-w-5xl">
            <span className="inline-block align-middle rounded-lg bg-indigo-600 px-3 py-1 font-semibold text-white shadow">EduFinX</span> — Unlock the future of financial learning
            <br />
            <span className="relative inline-block align-middle ml-2" style={{ minWidth: 200 }}>
              {/* Previous text slides up and fades out */}
              <span
                className={`absolute left-0 top-0 rounded px-3 py-1 font-semibold text-white bg-amber-500 shadow transition-all duration-400 ease-in-out ${animating ? 'opacity-0 -translate-y-6' : 'opacity-0'} pointer-events-none`}
                style={{ zIndex: 1 }}
              >
                {features[prevIdx]}
              </span>
              {/* Current text slides down and fades in, gets darker as it appears */}
              <span
                className={`inline-block rounded px-3 py-1 font-semibold shadow transition-all duration-400 ease-in-out ${animating ? 'opacity-0 translate-y-6 text-amber-300' : 'opacity-100 translate-y-0 text-white'} bg-amber-500`}
                style={{ zIndex: 2 }}
              >
                {features[featureIdx]}
              </span>
            </span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl leading-relaxed text-gray-700 font-medium">
            Join a monitored, gamified community where SEBI-registered experts, multilingual resources, and real-time insights empower every investor. Compete, learn, and grow with creative case studies, scenario simulations, and accessibility-first design.
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <a
              href="/"
              className="rounded-md bg-white border border-indigo-600 text-indigo-600 px-7 py-3 text-base font-semibold tracking-wide shadow transition-colors duration-200 hover:bg-indigo-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              Get Started
            </a>
            <a href="/about" className="rounded-md bg-white border border-gray-300 text-gray-900 px-7 py-3 text-base font-semibold tracking-wide shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition">Learn More</a>
          </div>
        </div>
      </div>
    </section>
  );
}
