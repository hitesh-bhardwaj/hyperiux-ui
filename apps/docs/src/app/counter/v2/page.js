import React from 'react'
import CounterTwo from '@/components/Counters/CounterTwo'

const page = () => {
  return (
    <>

    <div className='h-screen bg-white w-screen flex flex-col gap-16 items-center justify-center'>

      <h2 className='text-[2.5vw] text-black'>
        Numbers That Speak for Themselves
      </h2>


    <CounterTwo value='594' label='' textSize='text-[8vw]' color='#021A54'   fontWeight="normal"
 />
 
    </div>
        
    </>
  )
}

export default page

