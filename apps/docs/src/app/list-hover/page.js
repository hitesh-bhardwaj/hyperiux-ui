import React from 'react'
import ListHover from '@/components/ListHover/ListHover'
import LenisSmoothScroll from '@/components/SmoothScroll/LenisScroll'

const page = () => {
  return (
    <>
    <LenisSmoothScroll />
    <div className='flex items-center flex-col gap-20  justify-center h-screen bg-neutral-900'>

        <h2 className='font-mono text-white text-3xl'>
            Elevating interaction through motion
        </h2>

        <ListHover items={projects} />
    </div>
    </>
  )
}

export default page;

const projects = [
  {
    client: "DOCKERS",
    platform: "SHOPIFY",
    services: "Integration, Marketing, SEO, CRO, MOR",
    img: "/assets/nature/nature06.png",
  },
  {
    client: "CHAMPION",
    platform: "SHOPIFY PLUS",
    services: "UX/UI, Dev, Integration, SEO, Marketing",
    img: "/assets/nature/nature07.png",
  },
  {
    client: "BENETTON",
    platform: "SHOPIFY PLUS",
    services: "UX/UI, Dev, Integration, SEO",
    img: "/assets/nature/nature08.png",
  },
  {
    client: "SOTF",
    platform: "CUSTOM",
    services: "UX/UI, Brand Direction",
    img: "/assets/nature/nature09.png",
  },
  {
    client: "MASON'S",
    platform: "SHOPIFY PLUS",
    services: "UX/UI, Dev, Integration, SEO",
    img: "/assets/nature/nature10.png",
  },
  {
    client: "ROBERTO COLLINA",
    platform: "SHOPIFY PLUS",
    services: "UX/UI, Dev B2C, Marketing, Integration, SEO",
    img: "/assets/nature/nature11.png",
  },
  {
    client: "POLLINI",
    platform: "LARAVEL",
    services: "UX/UI, Dev, Integration, SEO, Marketing",
    img: "/assets/nature/nature12.png",
  },
  {
    client: "ENGINE",
    platform: "SHOPIFY HEADLESS",
    services: "Dev, Marketing, Integration",
    img: "/assets/nature/nature13.png",
  },
  {
    client: "ROMBO GROUP",
    platform: "SHOPIFY",
    services: "UX/UI, Dev (B2C/B2B), Marketing, Integration, SEO",
    img: "/assets/nature/nature14.png",
  },
  {
    client: "8PM",
    platform: "SHOPIFY PLUS",
    services: "UX/UI, Dev, Marketing, Integration, SEO",
    img: "/assets/img/image02.webp",
  },
];