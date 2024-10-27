import React, { useState, useEffect } from 'react'
import Heading from '../components/LandingPage/Heading'
import Carousell from '../components/LandingPage/Carousell'
import Hero from '../components/LandingPage/Hero'
import Feature from '../components/LandingPage/Feature'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useLocation } from 'react-router-dom'
import Gallery from '../components/LandingPage/Gallery'
import LoadingSpinner from '../components/LoadingSpinner'
import FinalComponent from '../components/LandingPage/FinalComponent'

function LandingPage() {
  const location = useLocation();
  const { user } = location || {};

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
  console.log("User data:", user);
  return (
    <div className='w-full overflow-hidden overflow-x-hidden'> {isLoading ? <LoadingSpinner />: <FinalComponent />}
    </div>
  )
}

export default LandingPage

