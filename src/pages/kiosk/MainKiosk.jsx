import React, { useState, useEffect } from 'react';
import Kiosk from '../../components/pos/Kiosk';
import { messaging, auth } from '../../config/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MainKiosk() {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    requestNotificationPermission();

    onMessage(messaging, (payload) => {
      console.log("Foreground message received: ", payload);

      const { title, body } = payload.notification;
      const orderId = payload.data?.orderId;
      toast.info(`New Notification: ${title}, ${orderId}`, {
        position: "top-right",
        autoClose: 5000,
      });
    });
  }, []);

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);

      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
        });
        console.log("FCM Token received:", token);

        if (user?.uid) {
          await sendFCMTokenToBackend(user.uid, token);
          setIsPermissionGranted(true);
          console.log("Success")
        } else {
          console.error('User is not authenticated');
        }
      } else {
        console.error('Notification permission denied');
      }
    } catch (error) {
      console.error('Error getting notification permission or token:', error);
    }
  };

  const sendFCMTokenToBackend = async (userId, token) => {
    try {
      const response = await fetch('http://localhost:5000/save-fcm-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, token }),
      });

      if (response.ok) {
        console.log("FCM token successfully sent to backend");
      } else {
        console.error("Failed to send FCM token to backend:", response.statusText);
      }
    } catch (error) {
      console.error('Error sending FCM token to server:', error);
    }
  };

  return (
    <>
      <Kiosk />
      <ToastContainer />
    </>
  );
}

export default MainKiosk;
