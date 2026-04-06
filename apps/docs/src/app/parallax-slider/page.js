import React from 'react'
import ParallaxImgSlider from '@/components/ParallaxImgSlider/ParallaxSlider'
import LenisSmoothScroll from '@/components/SmoothScroll/LenisScroll'

const page = () => {
  return (
    <>
        <LenisSmoothScroll />
        {/* <div className='h-[120vh] bg-white' /> */}
        <ParallaxImgSlider images={[
  '/assets/nature/nature06.png',
  '/assets/nature/image08.png',
  '/assets/nature/image09.png',
  '/assets/nature/image10.png',
  '/assets/nature/image11.png',
  '/assets/nature/image12.png',
  '/assets/nature/image13.png',
  '/assets/nature/image14.png',
]} bgColor='#111111' />
    </>
  )
}

export default page