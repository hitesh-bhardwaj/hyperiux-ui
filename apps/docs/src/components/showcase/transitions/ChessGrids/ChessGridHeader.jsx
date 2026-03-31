'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ChessGridHeader() {
  const pathname = usePathname()

  return (
    <header className='fixed top-0 mix-blend-difference left-0 w-full z-50 p-4 flex items-center justify-between'>
      <Link href='/page-transitions/chess-grids' className='text-sm  uppercase font-bold'>
        Chess Grids
      </Link>
      <nav className='flex gap-4'>
        <Link 
          href='/page-transitions/chess-grids' 
          className={`text-sm ${pathname === '/page-transitions/chess-grids' ? 'opacity-100' : 'opacity-50'}`}
        >
          Page 1
        </Link>
        <Link 
          href='/page-transitions/chess-grids/page2' 
          className={`text-sm ${pathname === '/page-transitions/chess-grids/page2' ? 'opacity-100' : 'opacity-50'}`}
        >
          Page 2
        </Link>
      </nav>
    </header>
  )
}
