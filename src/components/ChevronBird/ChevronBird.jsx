"use client"
import gsap from 'gsap';
import React, { useEffect, useRef } from 'react'

const ChevronBird = ({

  isActive = false,
  size = 14,
  strokeWidth = 10,
  duration = 0.32,
  className = "mt-[0.25vw]",
}) => {
const leftRef = useRef(null);
  const rightRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return;

    const tl = gsap.timeline({ defaults: { duration, ease: "power2.inOut" } });

    if (isActive) {
      tl.to(
        leftRef.current,
        {
          rotation: -42,
          svgOrigin: "50 50",
        },
        0
      ).to(
        rightRef.current,
        {
          rotation: 42,
          svgOrigin: "50 50",
        },
        0
      ).to(svgRef.current,{
        yPercent:-25
      },0)
    } else {
      tl.to(
        leftRef.current,
        {
          rotation: 42,
          svgOrigin: "50 50",
        },
        0
      ).to(
        rightRef.current,
        {
          rotation: -42,
          svgOrigin: "50 50",
        },
        0
      )
      .to(svgRef.current,{
        yPercent:0
      },0)
    }
  }, [isActive, duration]);

  return (
    <svg
      className={className}
      ref={svgRef}
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
    >
      <g>
        <path
          ref={leftRef}
          d="M10 50H50"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="square"
        />
        <path
          ref={rightRef}
          d="M90 50H50"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="square"
        />
      </g>
    </svg>
  );
}

export default ChevronBird