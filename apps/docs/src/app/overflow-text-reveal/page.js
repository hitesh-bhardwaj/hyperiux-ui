import React from 'react'
import OverFlowAnim from '@/components/TextAnimations/OverFlowAnim/OverFlowAnim'
import { ReactLenis } from 'lenis/react'

const page = () => {
  return (
    <ReactLenis root>
      <section className="min-h-screen flex items-center justify-center bg-[#e8f5e9] px-8">
        <OverFlowAnim scrub={true} className="text-center">
          <h1 className="text-7xl font-bold text-[#1b5e20] leading-tight">
            Overflow<br />Text Reveal
          </h1>
        </OverFlowAnim>
      </section>

      <section className="min-h-screen flex items-center justify-center bg-white px-8">
        <OverFlowAnim scrub={true} className="max-w-4xl">
          <p className="text-4xl font-medium text-gray-800 leading-relaxed">
            Text lines elegantly slide up from hidden overflow, creating a clean
            and professional reveal effect with smooth stagger timing.
          </p>
        </OverFlowAnim>
      </section>

      <section className="min-h-screen flex items-center justify-center bg-[#1b5e20] px-8">
        <OverFlowAnim scrub={true} className="text-center max-w-3xl">
          <h2 className="text-6xl font-bold text-white">
            Ideal for content-heavy sections and storytelling layouts
          </h2>
        </OverFlowAnim>
      </section>
    </ReactLenis>
  )
}

export default page
