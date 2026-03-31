import NoiseDiether from '@/components/cursors/NoiseDiether'
import LenisSmoothScroll from '@/components/SmoothScroll/LenisScroll'
import React from 'react'

export default function page() {
  return (
    <>
    <LenisSmoothScroll />
    <div className='min-h-screen w-full relative bg-[]'>
      {/* Hero Section - Full Screen */}
      <section className='h-screen w-full relative'>
          <p className='text-[11vw] font-medium tracking-tight leading-[.9] p-[2vw] absolute text-white w-full left-1/2 -translate-x-1/2 bottom-[1.5vw] pointer-events-none z-10'>
            Outsource Consultants, Inc
          </p>
        <NoiseDiether />
      </section>

    
    </div>
    </>

  )
}
