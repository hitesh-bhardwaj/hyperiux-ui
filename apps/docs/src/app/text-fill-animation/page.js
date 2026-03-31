import React from 'react'
import TextFillAnimation from '@/components/TextAnims/TextRevealAnimation'
import { ReactLenis } from 'lenis/react'


const page = () => {
  return (
    <>
    <ReactLenis root>

      <TextFillAnimation
  text="Design systems should feel effortless, not like you're fighting your own components every time you build."
  textSize="3vw"
  textWidth="60%"
  textColor="#4C5C2D"
    primaryColor='#ff6b00'
  dimColor="#AAAAAA"
  backgroundColor="#F0EFE9"
  id="hero-break"
  containerClassName=""
  mobileTextSize="8vw"
  mobileTextWidth="92%"
/>
        

    </ReactLenis>
   
    </>
  )
}

export default page