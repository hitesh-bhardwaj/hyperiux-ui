import React from 'react'
import StripSlider from '@/components/Slider/StripSlider'
import LenisSmoothScroll from '@/components/SmoothScroll/LenisScroll'

const items = Array.from({ length: 14 }).map((_, i) => ({
  id: `item-${i}`,
  url: `/assets/nature/nature${(i + 1).toString().padStart(2, '0')}.png`,
  text: `Nature ${i + 1}`,
  atlasIndex: i,
  colors: ['#333', '#aaa']
}));

const page = () => {
  return (
    <div className="w-full h-screen bg-black">
      <LenisSmoothScroll />
      <StripSlider items={items} />
    </div>
  )
}

export default page