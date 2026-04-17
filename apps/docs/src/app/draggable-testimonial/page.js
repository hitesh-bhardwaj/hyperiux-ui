import React from 'react'
import DraggableTestimonial from '@/components/Testimonial/DraggableTestimonial'

const page = () => {
  return (
    <>
      <DraggableTestimonial
  data={testimonials}
  bgColor="bg-black"
  bgTextColor="text-white/10"
  cardBg="bg-indigo-600"
  cardTextColor="text-white"
  barBg="bg-neutral-800"
/>
    </>
  )
}

export default page

const testimonials = [
  {
    year: "2022",
    tag: "FINANCIAL TIMES",
    text: "MONOGRID joins annual ranking of Europe’s Fastest Growing Companies.",
  },
  {
    year: "2023",
    tag: "BRAND NEWS",
    text: "MONOGRID chooses multisensoriality and the contamination of physical and virtual worlds.",
  },
  {
    year: "2023",
    tag: "ENGAGE",
    text: "MONOGRID was among the first players to bet on new frontiers of digital interaction.",
  },
  {
    year: "2023",
    tag: "WE WEALT",
    text: "MONOGRID, the digital studio that explores the impossible.",
  },
  {
    year: "2023",
    tag: "TECH",
    text: "High-tech solutions: immersive platforms, AR, projection mapping, apps, and more.",
  },
];
