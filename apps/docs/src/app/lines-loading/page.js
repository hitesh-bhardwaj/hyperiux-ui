import CenterLinesLoading from '@/components/CenterLinesLoading'
import LineRevealLoader from '@/components/LinesLoading'
import React from 'react'

const page = () => {
  return (
    <>
    <LineRevealLoader/>
    <CenterLinesLoading
      lineCount={41}
      title="Build better interfaces"
      subtitle="Hyperiux UI"
    />
    </>
  )
}

export default page
