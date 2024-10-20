import React from 'react'
import Heading from '../components/LandingPage/Heading'
import Carousell from '../components/LandingPage/Carousell'
import Hero from '../components/LandingPage/Hero'
import Feature from '../components/LandingPage/Feature'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

function LandingPage() {
  return (
    <div className='w-full overflow-hidden overflow-x-hidden'>
    <Nav />
    <Hero />
    <Heading />
    <Carousell />
    <Feature />
    <Footer />
    </div>
  )
}

export default LandingPage

