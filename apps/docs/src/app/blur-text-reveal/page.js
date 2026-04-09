import React from 'react'
import BlurText from '@/components/effects/BlueText'
import { ReactLenis } from 'lenis/react'

const page = () => {
  return (
    <ReactLenis root>
      <section className="min-h-screen flex items-center justify-center bg-white px-8">
        <BlurText className="text-6xl font-bold text-center max-w-4xl">
          Beautiful blur-to-focus text reveal animation that creates a smooth
          transition as you scroll through your content.
        </BlurText>
      </section>

      <section className="min-h-screen flex items-center justify-center bg-gray-50 px-8">
        <BlurText className="text-5xl font-medium text-center max-w-3xl text-gray-800">
          Each word reveals with a subtle blur effect, drawing attention to your message.
        </BlurText>
      </section>

      <section className="min-h-screen flex items-center justify-center bg-black px-8">
        <BlurText className="text-6xl font-bold text-center max-w-4xl text-white">
          Perfect for hero sections, testimonials, and important messages.
        </BlurText>
      </section>
    </ReactLenis>
  )
}

export default page
