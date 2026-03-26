import React from 'react'
import TextFillAnimation from '@/components/TextAnims/TextRevealAnimation'

const page = () => {
  return (
    <>
    <div className='h-[60vh] bg-[#F0EFE9] max-sm:h-[80vh]'>

    </div>
      <TextFillAnimation
  text="Design systems should feel effortless, not like you're fighting your own components every time you build."
  textSize="3vw"
  textWidth="60%"
  textColor="#4C5C2D"
    primaryColor='#A98B76'
  dimColor="#AAAAAA"
  backgroundColor="#F0EFE9"
  id="hero-break"
  containerClassName="py-[10%]"
  mobileTextSize="8vw"
  mobileTextWidth="92%"
/>
        <div className='h-[50vh] bg-[#F0EFE9]'>
        </div>
    </>
  )
}

export default page