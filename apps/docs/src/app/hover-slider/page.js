import React from'react'
import HoverSlider from'@/components/Slider/HoverSlider'
import LenisSmoothScroll from'@/components/SmoothScroll/LenisScroll'

const page = () => {
 return (
 <div>
 <LenisSmoothScroll />
 <HoverSlider items={items} />
 </div>
 )
}

export default page

const items = [
 { id:"ISB_104", title:"Unfolding Grace", focus:"WebGL – Motion – Interaction", year:"2025", img:"/assets/nature/nature01.png" },
 { id:"ISB_128", title:"The Shape of Flow", focus:"WebGL – Motion – Interaction", year:"2025", img:"/assets/nature/nature02.png" },
 { id:"ISB_142", title:"Endless in Color", focus:"WebGL – Motion – Interaction", year:"2025", img:"/assets/nature/nature03.png" },
 { id:"ISB_157", title:"TG 7th / Flow of Sound", focus:"WebGL – Motion – Interaction", year:"2025", img:"/assets/nature/nature04.png" },
 { id:"ISB_163", title:"Adult Akech for Vogue US", focus:"WebGL – Motion – Interaction", year:"2025", img:"/assets/nature/nature05.png" },
 { id:"ISB_174", title:"Transforming Spaces", focus:"WebGL – Motion – Interaction", year:"2025", img:"/assets/nature/nature06.png" },
 { id:"ISB_189", title:"Sixfold Portraits", focus:"WebGL – Motion – Interaction", year:"2025", img:"/assets/nature/nature07.png" },
 { id:"ISB_193", title:"About:Blank / Twist of Sight", focus:"WebGL – Motion – Interaction", year:"2025", img:"/assets/nature/nature08.png" },
 { id:"ISB_205", title:"AHKET: A Chain of Fashion", focus:"WebGL – Motion – Interaction", year:"2025", img:"/assets/nature/nature09.png" },
 { id:"ISB_217", title:"About:Blank / Distorted Looks", focus:"WebGL – Motion – Interaction", year:"2025", img:"/assets/nature/nature10.png" },
 { id:"ISB_224", title:"Vogue China / Waves of Fashion", focus:"WebGL – Motion – Interaction", year:"2025", img:"/assets/nature/nature11.png" },
 { id:"ISB_239", title:"MIL's Curated Collection", focus:"WebGL – Motion – Interaction", year:"2025", img:"/assets/nature/nature12.png" },
 { id:"ISB_249", title:"Curved Perspectives", focus:"WebGL – Motion – Interaction", year:"2024", img:"/assets/nature/nature01.png" },
 { id:"ISB_256", title:"YSL FW25 / Flowing Looks", focus:"WebGL – Motion – Interaction", year:"2024", img:"/assets/nature/nature02.png" },
 { id:"ISB_263", title:"Spinning Triptych", focus:"WebGL – Motion – Interaction", year:"2024", img:"/assets/nature/nature03.png" },
 { id:"ISB_275", title:"Gucci PF25 / A Moving Lookbook", focus:"WebGL – Motion – Interaction", year:"2024", img:"/assets/nature/nature04.png" },
 { id:"ISB_284", title:"Jellyfish in Motion", focus:"Kinetic Typography – Motion", year:"2024", img:"/assets/nature/nature05.png" },
 { id:"ISB_298", title:"The Cylindrical Edit", focus:"WebGL – Motion – Interaction", year:"2024", img:"/assets/nature/nature06.png" },
 { id:"ISB_302", title:"Flow of Portraits", focus:"WebGL – Shaders", year:"2024", img:"/assets/nature/nature07.png" },
 { id:"ISB_314", title:"Endless Ribbon", focus:"WebGL – Motion – Interaction", year:"2024", img:"/assets/nature/nature08.png" },
 { id:"ISB_327", title:"Twisted Portraits", focus:"WebGL – Motion – Interaction", year:"2024", img:"/assets/nature/nature09.png" },
 { id:"ISB_339", title:"Spiral of Sight", focus:"WebGL – Motion – Interaction", year:"2024", img:"/assets/nature/nature10.png" },
];