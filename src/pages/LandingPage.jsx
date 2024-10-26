import React from 'react'
import Heading from '../components/LandingPage/Heading'
import Carousell from '../components/LandingPage/Carousell'
import Hero from '../components/LandingPage/Hero'
import Feature from '../components/LandingPage/Feature'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useLocation } from 'react-router-dom'
import Gallery from '../components/LandingPage/Gallery'

function LandingPage() {
  const location = useLocation();
  const { user } = location || {};
  
  console.log("User data:", user);
  return (
    <div className='w-full overflow-hidden overflow-x-hidden'>
    <Nav />
    <Hero />
    <Gallery />
    <Heading />
    <Feature />
    <Footer />
    </div>
  )
}

export default LandingPage

