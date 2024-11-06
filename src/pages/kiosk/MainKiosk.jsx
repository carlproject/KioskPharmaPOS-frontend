import React, { useState, useEffect } from 'react'
import Kiosk from '../../components/pos/Kiosk'
import { messaging, app } from '../../config/firebase';
import { getToken } from 'firebase/messaging';

function MainKiosk() {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const token = await messaging.getToken({
          vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
        });
        const userId = app.auth().currentUser?.uid; 
        
        if (userId) {
          await sendFCMTokenToBackend(userId, token);
          setIsPermissionGranted(true);
        } else {
          console.error('User is not authenticated');
        }
      } else {
        console.error('Notification permission denied');
      }
    } catch (error) {
      console.error('Error getting notification permission or token', error);
    }
  };

  const sendFCMTokenToBackend = async (userId, token) => {
    try {
      await fetch('http://localhost:5000/save-fcm-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token }),
      });
    } catch (error) {
      console.error('Error sending FCM token to server:', error);
    }
  };


  return (
    <>
        <Kiosk />
        <p>{isPermissionGranted ? 'Notifications Enabled!' : 'Requesting Notification Permission...'}</p>
    </>
  )
}

export default MainKiosk