import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useLocation } from 'react-router-dom'
import Gallery from '../components/LandingPage/Gallery'
import LoadingSpinner from '../components/LoadingSpinner'
import FinalComponent from '../components/LandingPage/FinalComponent'

function LandingPage() {
  const [storeUser, setStoreUser] = useState(null);
  const location = useLocation();
  const { user } = location || {};

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setStoreUser(JSON.parse(storedUser));
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className='w-full overflow-hidden overflow-x-hidden'> {isLoading ? <LoadingSpinner />: <FinalComponent />}
    </div>
  )
}

export default LandingPage

