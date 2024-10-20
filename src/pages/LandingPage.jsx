import React from 'react'
import Heading from '../components/LandingPage/Heading'
import Carousell from '../components/LandingPage/Carousell'
import Hero from '../components/LandingPage/Hero'
import Feature from '../components/LandingPage/Feature'
import Nav from '../components/Nav'

function LandingPage() {
  return (
    <div className='w-full'>
    <Nav />
    <Hero />
    <Heading />
    <Carousell />
    <Feature />
    </div>
  )
}

export default LandingPage

