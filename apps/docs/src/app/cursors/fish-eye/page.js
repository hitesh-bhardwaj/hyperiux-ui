import FishEyeImage from'@/components/FishEye/FishEyeImage'
import React from'react'

export default function page() {
 return (
 <div className='h-screen w-full bg-zinc-200 flex items-start p-[5vw] justify-between'>
 <h2 className='absolute bottom-[5vw] left-[5vw] text-black text-[7vw] leading-none font-bold'>FISH EYE</h2>
 <h2 className='absolute top-[5vw] text-right right-[5vw] text-black text-[7vw] leading-none font-bold'>WITH <br/><span className='text-red-500'> TSL </span></h2>

 <div className='h-[30vw] w-[30vw] relative'>
 <FishEyeImage src="/img/mob.webp" />
 </div>
 <div className='h-[45vw] w-[30vw] relative'>
 <FishEyeImage src="/img/man.webp" />
 </div>
 <div className='size-[25vw] mt-auto relative'>
 <FishEyeImage src="/img/dino.png" />
 </div>
 </div>
 )
}
