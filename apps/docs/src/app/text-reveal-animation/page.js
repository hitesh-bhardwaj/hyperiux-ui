import React from 'react'
import TextClipAnim from '@/components/TextAnims/NewTextt'

const page = () => {
  return (
    <>
    <div className='h-[70vh] bg-white'>

    </div>
        <TextClipAnim
    text="Design systems should feel effortless, not like you're fighting your own components every time you build."
    overtakeColor="#FAACBF"
    baseColor="#FFF6F6"
    bgColor="#ffffff"
    textSize="text-[2.5vw]"
    mobileTextSize="text-[7vw]"
    containerWidth="w-[70%]"
  />
    <div className='h-[50vh] bg-white'>

    </div>
    </>
  )
}

export default page