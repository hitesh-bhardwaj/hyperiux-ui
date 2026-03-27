'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SplitText from 'gsap/SplitText'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, SplitText)
}

/**
 * TextFillAnimation
 *
 * Props:
 * @param {string}  text            - The text content to animate
 * @param {string}  textColor       - Final color (100% keyframe)             [default: '#111111']
 * @param {string}  primaryColor    - Blue sweep color (30% keyframe)         [default: '#0205fa']
 * @param {string}  dimColor        - Un-revealed color (0% keyframe)         [default: '#dddddd']
 * @param {string}  backgroundColor - Section background color                [default: '#FBFBFB']
 * @param {string}  className       - Extra classes on the <h2>
 * @param {string}  id              - Optional id for the section element
 * @param {string}  textSize        - Font size on desktop                    [default: '5vw']
 * @param {string}  textWidth       - Width of text wrapper on desktop        [default: '80%']
 * @param {string}  mobileTextSize  - Font size on mobile                     [default: '8vw']
 * @param {string}  mobileTextWidth - Width of text wrapper on mobile         [default: '95%']
 */
export default function TextFillAnimation({
    text = 'Go cashless, shop & sell virtually, access credit, insurance, and investment products seamlessly with Montra.',
    textColor = '#111111',
    primaryColor = '#ff6b00',
    dimColor = '#dddddd',
    backgroundColor = '#FBFBFB',
    className = '',
    id = 'section-break',
    textSize = '5vw',
    textWidth = '80%',
    containerClassName = '',
    mobileTextSize = '8vw',
    mobileTextWidth = '95%',
}) {
    const sectionRef = useRef(null)
    const textRef = useRef(null)

    useEffect(() => {
        const styleId = `tfa-style-${id}`

        const style = document.createElement('style')
        style.id = styleId
        style.textContent = `
            @keyframes color-transition-${id} {
                0%   { color: ${dimColor}; }
                30%  { color: ${primaryColor}; }
                100% { color: ${textColor}; }
            }

            #${id} .split__wrapper .split-chars {
                transition: color 0.4s;
                color: ${dimColor};
            }

            #${id} .split__wrapper .split-chars.show {
                animation: color-transition-${id} 0.5s;
                color: ${textColor};
            }

            #${id} .tfa-text-wrapper {
                width: ${textWidth};
            }

            #${id} .tfa-heading {
                font-size: ${textSize};
            }

            @media (max-width: 640px) {
                #${id} .tfa-text-wrapper {
                    width: ${mobileTextWidth};
                }

                #${id} .tfa-heading {
                    font-size: ${mobileTextSize};
                }
            }
        `
        document.head.appendChild(style)

        const ctx = gsap.context(() => {
            const split = SplitText.create(textRef.current, {
                type: 'words chars',
                aria: false,
                tag: 'span',
                charsClass: 'split-chars',
            })

            const chars = Array.from(textRef.current.querySelectorAll('.split-chars'))

            const isDesktop = globalThis.innerWidth > 1024

            gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: isDesktop ? 'top top' : 'top top',
                    end: isDesktop ? 'bottom bottom' : 'bottom bottom',
                    scrub: 0.25,
                    markers:true
                },
            }).to(
                chars,
                {
                    className: 'split-chars show',
                    duration: 0.4,
                    stagger: 0.05,
                    ease: 'power2.inOut',
                },
                0
            )
        })

        return () => {
            ctx.revert()
            document.getElementById(styleId)?.remove()
        }
    }, [id, textColor, primaryColor, dimColor, textSize, textWidth, mobileTextSize, mobileTextWidth])

    return (
         

        <section
            id={id}
            ref={sectionRef}
            className={`relative h-[250vh] bg-gray-500 w-full  px-[4vw] max-sm:px-2  ${containerClassName}`}
            style={{ backgroundColor }}
            >
            <div className='sticky top-0 h-screen flex items-center justify-center'>

            <div className="split__wrapper   h-fit  tfa-text-wrapper text-center mx-auto">
                <h2
                    ref={textRef}
                    className={`font-medium font-display leading-[1.2] tfa-heading ${className}`}
                    >
                    {text}
                </h2>
                    </div>
            </div>
        </section>
          
    )
}