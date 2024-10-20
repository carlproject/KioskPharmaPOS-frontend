import React from 'react'
import Heading from '../components/LandingPage/Heading'
import Carousell from '../components/LandingPage/Carousell'
import Hero from '../components/LandingPage/Hero'

function LandingPage() {
  return (
    <div className='w-full'>
    <Hero />
    <Heading />
    <Carousell />
    </div>
  )
}

export default LandingPage

