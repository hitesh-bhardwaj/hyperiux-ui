import React from'react'
import ClippathSlider from'@/components/Slider/ClippathSlider'

const page = () => {
 return (
 <>
 <ClippathSlider slides={slides} />
 </>
 )
}

export default page

const slides = [
 {
 name:"Seasonal Alchemy",
 tags: ["Food","Wellness","Culture"],
 description:
"Exploring the intersection of seasonal ingredients and ancient healing traditions — cooking as a form of medicine and joy.",
 image:"/assets/img/image01.webp",
 },
 {
 name:"Cultural Systems",
 tags: ["Culture","Art","Design"],
 description:
"A multidisciplinary approach shaping visuals at the intersection of culture, technology, art, and design.",
 image:"/assets/img/image02.webp",
 },
 {
 name:"Visual Language",
 tags: ["Culture","Art"],
 description:
"Bridging street sensibility with refined aesthetics, curating what defines contemporary visual culture.",
 image:"/assets/nature/nature04.png",
 },
 {
 name:"Future Tension",
 tags: ["Culture","Art","Design"],
 description:
"Finding balance between analog roots and digital futures through evolving creative expression.",
 image:"/assets/img/image03.webp",
 },
 {
 name:"System Design",
 tags: ["Culture","Art","Design"],
 description:
"Designing adaptive systems that evolve across mediums, audiences, and time.",
 image:"/assets/nature/nature13.png",
 },
 {
 name:"Slow Frames",
 tags: ["Travel","Photography","Story"],
 description:
"Capturing quiet narratives through intentional movement and observational storytelling.",
 image:"/assets/nature/nature10.png",
 },
 {
 name:"Light Studies",
 tags: ["Nature","Light","Moment"],
 description:
"Observing fleeting light and transient moments across natural landscapes.",
 image:"/assets/img/image06.png",
 },
];