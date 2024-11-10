import React, { useEffect, useState } from 'react'
import AdminPanel from '../../components/admin/AdminPanel'
import AddProduct from '../../components/admin/AddProduct'
import { useNavigate } from 'react-router-dom'
import Inventory from '../../components/admin/Inventory'
import UserManagement from '../../components/admin/UserManagement'
import Product from '../../components/admin/Product'
import Analytics from '../../components/admin/Analytics'
import Notifications from '../../components/admin/Notifications'
import { getToken } from 'firebase/messaging'
import { messaging } from '../../config/firebase'
import PrescriptionManagement from '../../components/admin/PrescriptionManagement'

function AdminSide() {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('Dashboard');
  const [adminCredential, setAdminCredential] = useState(JSON.parse(localStorage.getItem('adminCredentials')));
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);


  useEffect(() => {
    const isAdminAuthenticated = sessionStorage.getItem('isAdminAuthenticated');

    if (!isAdminAuthenticated) {
      navigate('/login')
    }
    requestNotificationPermission();
  }, [navigate]);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Dashboard':
        return <AddProduct />;
      case 'User Management':
        return <UserManagement />;
      case 'Sales And Product':
        return <Product />
      case 'Inventory':
        return <Inventory />;
      case 'Analytics':
        return <Analytics />
      case 'Notifications And Messages':
        return <Notifications />;
      case 'Prescription Management':
        return <PrescriptionManagement />;
      default:
        return <AddProduct />;
    }
  };

  const requestNotificationPermission = async () => {
    try {
      
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
        });
        const email = adminCredential.email;
        if (email) {
          await sendFCMTokenToBackend(email, token);
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

  const sendFCMTokenToBackend = async (email, token) => {
    try {
      await fetch('http://localhost:5000/save-fcm-token/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
      });
    } catch (error) {
      console.error('Error sending FCM token to server:', error);
    }
  };

  return (
    <>
    <AdminPanel setActiveComponent={setActiveComponent} activeComponent={activeComponent}/>
    <div className="flex-1 p-2">
        {renderComponent()}
      </div>
    </>
  )
}

export default AdminSide