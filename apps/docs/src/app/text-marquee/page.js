import React from 'react'
import TextMarquee from '@/components/Marquee/TextMarquee'
import LenisSmoothScroll from '@/components/SmoothScroll/LenisScroll'

const page = () => {
  return (
    <>
        <LenisSmoothScroll />
        <TextMarquee items={items} />
    </>
  )
}

export default page

const items = [
  "makes it even better",
  "calls for adaptation",
  "an opportunity opens",
  "confronts injustice",
  "is a fresh start",
  "brings disappointment",
  "makes the difference",
  "Happens™",
  "brings the unexpected",
  "history is written",
  "doesn't always go to plan",
  "builds on the work of today",
  "brings uncertainty",
  "new life begins",
  "may bring tears",
  "the story continues",
  "a chapter comes to a close",
  "sparks a new idea",
  "an opportunity slips away",
  "heroes are made",
  "fights inequality",
  "finishes the project",
];