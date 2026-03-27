import React from 'react'
import Product from '@/components/CardsStack/CircularSlider'
import { ReactLenis } from 'lenis/react'

const page = () => {
  return (
    <>
       <ReactLenis root>

       <Product
  sectionHeading="Hyperiux UI Components"
  footerText="Reusable Components Library"
  cardBg="bg-white"
  cardTextColor="text-black"
  cards={[
    {
      img: "/assets/nature/nature01.png",
      heading: "Component One",
      text: "Reusable UI block",
      link: "#",
    },
    {
      img: "/assets/nature/nature02.png",
      heading: "Component Two",
      text: "Modern layout system",
      link: "#",
    },
    {
      img: "/assets/nature/nature03.png",
      heading: "Component Three",
      text: "GSAP powered animation",
      link: "#",
    },
    {
      img: "/assets/nature/nature04.png",
      heading: "Component Four",
      text: "Highly customizable",
      link: "#",
    },
    {
      img: "/assets/nature/nature05.png",
      heading: "Component Five",
      text: "Tailwind based design",
      link: "#",
    },
    
  ]}
/>
       </ReactLenis>
    </>
  )
}

export default page