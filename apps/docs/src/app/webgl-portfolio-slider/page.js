import React from'react'
import InfiniteSlider from'@/components/Slider/CircularSlider'

const page = () => {
 const items = Array.from({ length: 21 }, (_, i) => {
 const num = String(i + 1).padStart(2,"0");
 return {
 url: `/assets/ghost/ghost${num}.webp`,
 description: `GHOST ${num}`
 };
 });

 return (
 <div>
 <InfiniteSlider items={items} />
 </div>
 )
}

export default page