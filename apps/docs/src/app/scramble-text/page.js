import React from 'react'
import ScrambleText from '@/components/TextAnims/ScrambleText'

const page = () => {
  return (
    <>

    <div className='h-screen w-screen flex items-center justify-center'>

        <ScrambleText 
  text="Hover me "
  textSize="text-5xl"
  textColor="text-white"
/>

    </div>
        
    </>
  )
}

export default page