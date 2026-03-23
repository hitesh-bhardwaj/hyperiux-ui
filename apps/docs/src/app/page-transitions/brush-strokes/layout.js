import BrushStrokesNavbar from '@/components/showcase/transitions/BrushStrokesNavbar'
import BrushStrokesTransition from '@/components/showcase/transitions/BrushStrokesTransition'
import React from 'react'

export default function layout({ children }) {
    return (
        <BrushStrokesTransition>
            <BrushStrokesNavbar />
            {children}
        </BrushStrokesTransition >
    )
}
