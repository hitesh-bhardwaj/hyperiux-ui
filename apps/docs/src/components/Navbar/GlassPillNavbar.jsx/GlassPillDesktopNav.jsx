'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react'
import Image from 'next/image'

export default function GlassPillDesktopNav() {
    const navLinksRef = useRef([])
    const ctaRef = useRef(null)
    const linkData = useRef([])
    const dropdownRef = useRef([])
    const activeDropdownIndex = useRef(null)
    const [activeIndex, setActiveIndex] = useState(null)

    // 👉 Add refs for dropdown items
    const dropdownItemsRef = useRef([])
    const dropdownTextData = useRef([])

    // 🔹 MENU ITEM + DROPDOWN DATA merged
    const menuItems = [
        {
            name: "Solutions",
            href: "#",
            isDropdown: false,
            dropdown: null
        },
        {
            name: "Tech",
            href: "#",
            isDropdown: true,
            dropdown: [
                { title: "AI Tools", img: "/img/dino.png", href: "#" },
                { title: "Web Stack", img: "/img/dino.png", href: "#" }
            ]
        },
        {
            name: "Industries",
            href: "#",
            isDropdown: false,
            dropdown: null
        },
        {
            name: "The Company",
            href: "#",
            isDropdown: true,
            dropdown: [
                { title: "Manifesto", img: "/img/dino.png", href: "#" },
                { title: "Co-founder", img: "/img/dino.png", href: "#" },
                { title: "Career", img: "/img/dino.png", href: "#" }
            ]
        }
    ]

    useEffect(() => {
        const ctx = gsap.context(() => {
            linkData.current = navLinksRef.current.map(navLinkEl => {
                if (!navLinkEl) return null
                return {
                    el: navLinkEl,
                    defaultText: navLinkEl.querySelector('[data-default]'),
                    hoverText: navLinkEl.querySelector('[data-hover]')
                }
            })

            linkData.current.forEach(navItem => {
                if (!navItem) return
                gsap.set(navItem.defaultText, { yPercent: 0 })
                gsap.set(navItem.hoverText, { yPercent: 100 })
            })

            if (ctaRef.current) {
                const d = ctaRef.current.querySelector('[data-default]')
                const h = ctaRef.current.querySelector('[data-hover]')
                gsap.set(d, { yPercent: 0 })
                gsap.set(h, { yPercent: 100 })
            }

            // 🔻 dropdown initial state
            gsap.set(dropdownRef.current, {
                autoAlpha: 0,
                y: -20,
                transformOrigin: "top center",
                pointerEvents: "none"
            })

            // 👉 Register text elements for dropdown items
            dropdownTextData.current = dropdownItemsRef.current.map(el => {
                if (!el) return null
                return {
                    el,
                    defaultText: el.querySelector('[data-default]'),
                    hoverText: el.querySelector('[data-hover]')
                }
            })

            dropdownTextData.current.forEach(item => {
                if (!item) return
                gsap.set(item.defaultText, { yPercent: 0 })
                gsap.set(item.hoverText, { yPercent: 100 })
            })
        })

        return () => ctx.revert()
    }, [])

    // 🔹 NAV ENTER
    const handleEnter = useCallback((index) => {
        const item = linkData.current[index]
        if (!item) return

        setActiveIndex(index)

        gsap.timeline({ defaults: { duration: 0.5, ease: 'power2.out', overwrite: 'auto' } })
            .to(item.defaultText, { yPercent: -100 }, 0)
            .to(item.hoverText, { yPercent: 0 }, 0)

        navLinksRef.current.forEach((el, i) => {
            gsap.to(el, {
                color: i === index ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)',
                duration: 0.5,
                overwrite: 'auto'
            })
        })

        showDropdown(index)
    }, [])

    // 🔹 NAV LEAVE
    const handleLeave = useCallback((index) => {
        const item = linkData.current[index]
        if (!item) return

        gsap.timeline({ defaults: { duration: 0.5, ease: 'power2.out', overwrite: 'auto' } })
            .to(item.defaultText, { yPercent: 0 }, 0)
            .to(item.hoverText, { yPercent: 100 }, 0)

        gsap.to(navLinksRef.current, {
            color: 'rgba(255,255,255,1)',
            duration: 0.5,
            overwrite: 'auto'
        })

        if (!dropdownRef.current?.matches(':hover')) {
            hideDropdown()
            setActiveIndex(null)
        }
    }, [])

    // 🔹 CTA
    const handleCta = (enter = true) => {
        const cta = ctaRef.current
        if (!cta) return

        const d = cta.querySelector('[data-default]')
        const h = cta.querySelector('[data-hover]')

        gsap.timeline({ defaults: { duration: 0.5, ease: 'power2.out', overwrite: 'auto' } })
            .to(cta, { backgroundColor: enter ? '#000' : '#fff' }, 0)
            .to(d, { yPercent: enter ? -100 : 0 }, 0)
            .to(h, { yPercent: enter ? 0 : 100 }, 0)
    }

    // 🔻 SHOW DROPDOWN
    const showDropdown = (index) => {
        if (!menuItems[index].isDropdown) return

        activeDropdownIndex.current = index

        gsap.to(dropdownRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            pointerEvents: "auto",
            overwrite: "auto"
        })

        // Reinitialize dropdown item text effect for the currently active dropdown
        setTimeout(() => {
            dropdownTextData.current = dropdownItemsRef.current.map(el => {
                if (!el) return null
                return {
                    el,
                    defaultText: el.querySelector('[data-default]'),
                    hoverText: el.querySelector('[data-hover]')
                }
            })

            dropdownTextData.current.forEach(item => {
                if (!item) return
                gsap.set(item.defaultText, { yPercent: 0 })
                gsap.set(item.hoverText, { yPercent: 100 })
            })
        }, 0)
    }

    // 🔻 HIDE DROPDOWN
    const hideDropdown = () => {
        activeDropdownIndex.current = null

        gsap.to(dropdownRef.current, {
            autoAlpha: 0,
            y: -20,
            duration: 0.5,
            ease: "power2.out",
            pointerEvents: "none",
            overwrite: "auto"
        })
    }

    // 👉 Add hover handlers for dropdown items
    const handleDropdownEnter = (index) => {
        const item = dropdownTextData.current[index]
        if (!item) return

        gsap.timeline({ defaults: { duration: 0.5, ease: 'power2.out' } })
            .to(item.defaultText, { yPercent: -100 }, 0)
            .to(item.hoverText, { yPercent: 0 }, 0)
    }

    const handleDropdownLeave = (index) => {
        const item = dropdownTextData.current[index]
        if (!item) return

        gsap.timeline({ defaults: { duration: 0.5, ease: 'power2.out' } })
            .to(item.defaultText, { yPercent: 0 }, 0)
            .to(item.hoverText, { yPercent: 100 }, 0)
    }

    // To clear refs for dropdown items when the dropdown menu changes
    useEffect(() => {
        dropdownItemsRef.current = []
    }, [activeIndex])

    return (
        <div className=' rounded-md absolute max-md:hidden top-[1vw] right-[2vw] bg-[#363737]'>

            <div className='w-full h-full relative p-[.3vw] flex items-center gap-[1.5vw] pl-[1vw]'>

                {/* NAV */}
                <div className="flex gap-[1.5vw]  h-full items-center">
                    {menuItems.map((item, i) => (
                        <Link
                            key={i}
                            ref={(el) => (navLinksRef.current[i] = el)}
                            href={item.href}
                            className="relative overflow-hidden py-[.5vw] uppercase flex items-center"
                            onMouseEnter={() => handleEnter(i)}
                            onMouseLeave={() => handleLeave(i)}
                        >
                            <div className='overflow-hidden relative'>

                                <span data-default className="flex items-center">
                                    {item.name}
                                    {item.isDropdown && <ChevronDown className="ml-1 w-[1vw] h-[1vw]" />}
                                </span>

                                <span data-hover className="absolute inset-0 flex items-center justify-center">
                                    <span className="flex items-center">
                                        {item.name}
                                        {item.isDropdown && <ChevronUp className="ml-1 w-[1vw] h-[1vw]" />}
                                    </span>
                                </span>
                            </div>

                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <Link
                    ref={ctaRef}
                    href="#"
                    className="bg-white relative overflow-hidden text-black py-[.5vw] px-[.5vw] rounded-sm"
                    onMouseEnter={() => handleCta(true)}
                    onMouseLeave={() => handleCta(false)}
                >
                    <span data-default className="block">BUILT W/ ICOMAT</span>
                    <span data-hover className="absolute inset-0 flex items-center justify-center text-white">
                        BUILT W/ ICOMAT
                    </span>
                </Link>

                {/* DROPDOWN */}
                <div
                    ref={dropdownRef}
                    onMouseEnter={() => showDropdown(activeDropdownIndex.current)}
                    onMouseLeave={hideDropdown}
                    className=' absolute w-full  h-fit top-[calc(100%-.5vw)] pt-[1.3vw] left-0'
                >
                    <div className='w-full h-full space-y-[.4vw]'>
                        {(menuItems[activeDropdownIndex.current]?.dropdown || []).map((item, idx) => (
                            <Link
                                href={item.href}
                                key={idx}
                                ref={el => (dropdownItemsRef.current[idx] = el)}
                                onMouseEnter={() => handleDropdownEnter(idx)}
                                onMouseLeave={() => handleDropdownLeave(idx)}
                                className='flex items-center hover:bg-white duration-500 transition-all bg-[#363737] hover:text-black! hover:scale-105 text-white rounded-md p-[.4vw] justify-between'
                            >
                                <div className='flex items-center gap-[1.5vw]'>
                                    <div className='size-[5vw] rounded-md overflow-hidden'>
                                        <Image src={item.img} alt={item.title} width={500} height={500} className='h-full w-full object-cover' />
                                    </div>
                                    {/* 🔄 Swapping text animation on dropdown items */}
                                    <div className="relative overflow-hidden uppercase">
                                        <span data-default className="block">
                                            {item.title}
                                        </span>
                                        <span
                                            data-hover
                                            className="absolute inset-0 flex items-center"
                                        >
                                            {item.title}
                                        </span>
                                    </div>
                                </div>
                                <ChevronRight className='w-[1vw] h-[1vw] mr-[2vw]' />
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}