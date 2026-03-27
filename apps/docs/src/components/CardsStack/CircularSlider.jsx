"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const ProductCard = ({
  img,
  heading,
  link,
  text,
  bg = "bg-white/70",
  textColor = "text-black",
}) => {
  return (
    <Link href={link} className="block w-full h-full group">
      <div
        className={`h-full w-full ${bg} rounded-[1.5vw] flex flex-col-reverse items-center justify-between relative group-hover:bg-white group-hover:shadow-xl duration-500 
      w-[23vw] h-[26vw] 
      max-lg:w-[40vw] max-lg:h-[50vw] 
      max-md:w-[85vw] max-md:h-[100vw] 
      max-md:rounded-[5vw]`}
      >
        <div
          className="h-1/2 w-full flex flex-col items-center justify-center 
        max-md:h-full max-md:justify-end max-md:pb-[10%]"
        >
          <h2
            className={`text-center font-extralight uppercase text-[1.8vw] 
          max-lg:text-[3vw] 
          max-md:text-[6vw] ${textColor}`}
          >
            {heading}
          </h2>

          <p
            className={`text-[1.15vw] font-extralight mb-[2vw] max-md:text-lg ${textColor}`}
          >
            {text}
          </p>

          <span className={`text-sm tracking-wide ${textColor}`}>
            See More →
          </span>
        </div>
      </div>
    </Link>
  );
};

const Product = ({
  sectionHeading = "Our Advanced Endo Surgery Portfolio",
  footerText = "ADVASTAP Series",
  cards = [],
  cardBg = "bg-white/70",
  cardTextColor = "text-black",
}) => {
  const sliderContainer = useRef(null);
  const wheelRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth < 1024) return;

    let resizeHandler;
    let rotateTween;

    const ctx = gsap.context(() => {
      const wheel = wheelRef.current;
      const cardsEl =
        gsap.utils.selector(sliderContainer)(".wheelCard");

      if (!wheel || !cardsEl.length) return;

      resizeHandler = () => {
        const total = cardsEl.length;
        const baseRadius = wheel.offsetWidth / 1.1;
        const radiusScale = gsap.utils.clamp(0.82, 1.28, 1 + (total - 5) * 0.08);
        const radius = baseRadius * radiusScale;
        const center = wheel.offsetWidth / 2;
        const slice = (0.58 * Math.PI) / total;

        cardsEl.forEach((item, i) => {
          const angle = i * slice;
          const x = center + radius * Math.sin(angle);
          const y = center - radius * Math.cos(angle);

          gsap.set(item, {
            rotation: `${angle}_rad`,
            xPercent: -50,
            yPercent: -50,
            x,
            y,
          });
        });
      };

      resizeHandler();
      window.addEventListener("resize", resizeHandler);

      rotateTween = gsap.to(wheel, {
        rotate: -87,
        ease: "none",
        duration: cardsEl.length,
        scrollTrigger: {
          trigger: sliderContainer.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.25,
          invalidateOnRefresh: true,
        //   markers:true
        },
      });
    }, sliderContainer);

    return () => {
      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
      }

      rotateTween?.scrollTrigger?.kill();
      rotateTween?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sliderContainer}
      className="relative h-[260vh]   max-md:py-[15%]"
    >
      {/* Desktop */}
      <div className="max-sm:hidden h-screen w-screen  sticky top-0 block">
        <div className="relative flex h-screen flex-col justify-between pb-[3%]">
          <h2 className="text-center text-3xl font-light">
            {sectionHeading}
          </h2>

          <div
            className="
              absolute w-full 
              
              top-[67vw]
              
              h-screen
            "
          >
            <div
              ref={wheelRef}
              className="wheel absolute top-0 left-1/2 flex h-screen w-screen max-h-[2000vh] max-w-500 -translate-x-1/2 items-center justify-center"
            >
              {cards.map((item, i) => (
                <div
                  key={i}
                  className="wheelCard absolute top-0 left-0 h-[26vw] w-[23vw] cursor-pointer"
                >
                  <ProductCard
                    {...item}
                    bg={item.bg ?? cardBg}
                    textColor={item.textColor ?? cardTextColor}
                  />
                </div>
              ))}
            </div>
          </div>

          <p className="text-center tracking-widest text-[2vw]">
            {footerText}
          </p>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex flex-col gap-[10vw]">
        {cards.map((item, i) => (
          <div key={i} className="w-[85vw] h-[100vw] mx-auto">
            <ProductCard
              {...item}
              bg={item.bg ?? cardBg}
              textColor={item.textColor ?? cardTextColor}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Product;
