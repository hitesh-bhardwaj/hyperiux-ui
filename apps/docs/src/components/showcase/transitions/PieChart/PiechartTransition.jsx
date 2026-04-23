'use client'

import { TransitionRouter } from 'next-transition-router'
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function PiechartTransition({ children, config = { enableBlur: false, duration: 0.5 } }) {
    const { enableBlur, duration } = config
    const overlayRef = useRef(null)
    const wrapperRef = useRef(null)

    useEffect(() => {
        gsap.set(overlayRef.current, { opacity: 0 })
    }, [])

    return (
        <TransitionRouter auto
            leave={next => {
                // const tl = gsap.timeline({ onComplete: next })
                // tl.to(overlayRef.current, {
                //     opacity: 1,
                //     duration: duration,
                //     ease: "power2.out",
                // })
                // return () => tl.kill()
            }}
            enter={next => {
                // const tl = gsap.timeline({ onComplete: next })
                // tl.to(overlayRef.current, {
                //     opacity: 0,
                //     duration: duration,
                //     ease: "power2.in",
                // })
                // return () => tl.kill()
            }}
        >
            <div className={`fixed z-998 bg-red-500 inset-0 pointer-events-none opacity-100`}>
             
            </div>
            <div ref={wrapperRef}>
                {children}
            </div>
        </TransitionRouter>
    )
}