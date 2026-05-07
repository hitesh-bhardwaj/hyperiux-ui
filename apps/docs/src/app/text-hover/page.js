import React from'react'
import TextHover from'@/components/TextHover/TextHover'

const data = [
 {
 label:"Advanced Mobility",
 description:
"Autonomous aviation, smart transit, and sustainable transport reshaping movement.",
 },
 {
 label:"Artificial Intelligence",
 description:
"Transforming industries through data, automation, and intelligence at scale.",
 },
 {
 label:"Biotechnology & Genomics",
 description:
"Engineering breakthrough treatments and extending human potential through genetic innovation.",
 },
 {
 label:"Blockchain & DeFi",
 description:
"Building transparent, secure digital economies that move faster than convention.",
 },
 {
 label:"Next-Gen Finance",
 description:
"Alternative investments to democratized financial intelligence for everyone.",
 },
 {
 label:"Next-Gen Consumer Tech",
 description:"Hyper-personalized, cutting-edge technologies to enrich everyday lives.",
 },
 {
 label:"Quantum Computing",
 description:"New paradigms in computing power, asset analysis, and fintech.",
 },
 {
 label:"Robotics",
 description:"Augmenting human capability and automating the future of work.",
 },
 {
 label:"Space",
 description:
"Opening new frontiers in connectivity, exploration, and orbital infrastructure.",
 },
]

const page = () => {
 return (
 <>

 <div className='h-screen w-full bg-white'>
 <TextHover
 data={data}
 bgColor="#0a0a0a"
 textColor="#ffffff"
 />
 </div>
 </>
 )
}

export default page
