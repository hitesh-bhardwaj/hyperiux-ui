import React from 'react'
import CounterOne from '@/components/Counters/CounterOne'

const page = () => {
  return (
    <>
    {/* <div className='h-screen bg-white' /> */}
    <div className='h-screen bg-white flex flex-col gap-2 items-center justify-center'>

       <h2 className="text-[3vw] max-sm:text-[5vw] max-sm:w-[90%] font-semibold text-[#111111] text-center mb-[2vw] tablet:text-[5vw] mobile:text-[8vw]">
  Trusted by Hundreds Worldwide
</h2>

        <CounterOne
  textColor="#111111"
  stats={[
      { value: "594", superSuffix: "+" },
    ]}
/>
    </div>
    </>
  )
}

export default page