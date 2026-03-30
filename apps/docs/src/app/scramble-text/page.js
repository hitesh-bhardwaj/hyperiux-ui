import React from 'react'
import ScrambleText from '@/components/TextAnims/ScrambleText'

const page = () => {
  return (
    <>

    <div className='h-[110vh] w-screen flex items-center justify-center'>

      <div className='w-[60%] mx-auto'>


        <ScrambleText 
  text="Design that doesn’t just look good — it feels inevitable. "
  textSize="text-5xl"
  textColor="text-white"
  align='left'
/>

  </div>
    </div>
        
    </>
  )
}

export default page