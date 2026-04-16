import React from 'react'
import WebGLProjectSlider from '@/components/Slider/WebGLSlider'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'

const images = [
  { src: "/assets/img/image01.webp", text: "PR.04\n       /07" },
  { src: "/assets/img/image02.webp", text: "PR.06\n       /07" },
  { src: "/assets/img/image03.webp", text: "PR.08\n       /07" },
  { src: "/assets/img/image04.png", text: "PR.00\n       /07" },
  { src: "/assets/img/image05.png", text: "PR.02\n       /07" },
  { src: "/assets/img/image06.png", text: "PR.04\n       /07" },
  { src: "/assets/img/image07.png", text: "PR.06\n       /07" },
  { src: "/assets/nature/nature02.png", text: "PR.08\n       /07" },
  { src: "/assets/nature/nature09.png", text: "PR.00\n       /07" },
  { src: "/assets/nature/nature03.png", text: "PR.02\n       /07" },
  { src: "/assets/nature/nature11.png", text: "PR.04\n       /07" },
  // { src: "/assets/img/image12.png", text: "PR.06\n       /07" },
  // { src: "/assets/img/image13.png", text: "PR.08\n       /07" },
  // { src: "/assets/img/image14.png", text: "PR.00\n       /07" },
];

const page = () => {
  return (
    <ReactLenis root options={{ 
      infinite: true, 
      autoRaf: true, 
      duration: 1.5, 
      lerp: 0.075 
    }}>
      <WebGLProjectSlider images={images} />
    </ReactLenis>
  )
}

export default page