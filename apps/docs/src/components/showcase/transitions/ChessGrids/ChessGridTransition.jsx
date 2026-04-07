'use client'

import { TransitionRouter } from 'next-transition-router'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function ChessGridTransition({ children, enableContentShift = false }) {
    const wrapperRef = useRef(null)
    const gridRef = useRef(null)

    const cols = 8
    const rows = 4

    // Helper to get cells for a specific row (0-indexed)
    const getRowCells = (cells, rowIndex) => {
        const rowCells = []
        for (let col = 0; col < cols; col++) {
            rowCells.push(cells[rowIndex * cols + col])
        }
        return rowCells
    }

    // Build animation with direction: 1 = enter (slide in), -1 = exit (slide out)
    const buildAnimation = (tl, cells, direction = 1) => {
        const rowsArr = [0, 1, 2, 3]
        rowsArr.forEach((rowIndex, rowOrderIndex) => {
            const rowCells = getRowCells(cells, rowIndex)
            rowCells.forEach((cell, colIndex) => {
                const delay = rowOrderIndex * 0.1 + colIndex * 0.1
                if (direction === 1) {
                    const translateAmount = (cols - colIndex) * 100
                    tl.fromTo(cell,
                        { xPercent: translateAmount },
                        { xPercent: 0, duration: 0.8, ease: 'power2.out' },
                        delay
                    )
                } else {
                    tl.to(cell,
                        { xPercent: -(colIndex + 1) * 100, duration: 0.8, ease: 'power2.in' },
                        delay
                    )
                }
            })
        })
    }


    useEffect(() => {
        const cells = gridRef.current.children
        Array.from(cells).forEach((cell, i) => {
            const colIndex = i % cols
            gsap.set(cell, { xPercent: -(colIndex + 1) * 100 })
        })
    }, [])


    return (
        <TransitionRouter auto
            leave={(next) => {
                const cells = gridRef.current.children
                const tl = gsap.timeline({ onComplete: next })
                
                // Wrapper transition starts at the same time as grid animation
                if (enableContentShift) {
                    tl.fromTo(wrapperRef.current,
                        { xPercent: 0, filter: 'blur(0px)', opacity: 1 },
                        {
                            xPercent: -15,
                            filter: 'blur(8px)',
                            opacity: 0,
                            duration: .7,
                            ease: 'linear',
                        },
                        0
                    )
                }
                
                buildAnimation(tl, cells, 1)
                
                return () => tl.kill()
            }}
            enter={(next) => {
                const cells = gridRef.current.children
                const tl = gsap.timeline({ onComplete: next })
                
                // Wrapper transition starts at the same time as grid animation
                if (enableContentShift) {
                    tl.fromTo(wrapperRef.current,
                        { xPercent: 15, filter: 'blur(12px)', opacity: 0 },
                        {
                            xPercent: 0,
                            filter: 'blur(0px)',
                            opacity: 1,
                            duration: .7,
                            delay: .3,
                            ease: 'linear',
                        },
                        0
                    )
                }
                
                buildAnimation(tl, cells, -1)
                
                return () => tl.kill()
            }}
        >
            <div ref={gridRef} className='h-screen w-screen fixed top-0 left-0 z-999 pointer-events-none flex flex-wrap'>
                {Array.from({ length: cols * rows }).map((_, i) => {
                    return <span key={i} className={`bg-blue-500 w-[calc(100vw/8)] h-[calc(100vh/4)]`}></span>
                })}
            </div>
            <div className='h-full w-full relative'>


                <div ref={wrapperRef} className="will-change-transform h-full w-full">
                    {children}
                </div>
            </div>

        </TransitionRouter>
    )
}
