import { Hero } from '@/components/landing/Hero'
import { FeatureBlocks } from '@/components/landing/FeatureBlocks'
import { ValueGrid } from '@/components/landing/ValueGrid'
import { PlatformMatrix } from '@/components/landing/PlatformMatrix'
import { Testimonials } from '@/components/landing/Testimonials'
import { CTA } from '@/components/landing/CTA'

export default function LandingPage() {
  return (
    <div className="relative">
      <GridBackground />
      <Hero />
      <FeatureBlocks />
      <PlatformMatrix />
      <ValueGrid />
      <Testimonials />
  <CTA />
    </div>
  )
}

function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <svg className="absolute inset-0 h-full w-full text-indigo-300/60" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.6" />
          </pattern>
          <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#dots)" className="opacity-20" />
      </svg>
    </div>
  )
}
