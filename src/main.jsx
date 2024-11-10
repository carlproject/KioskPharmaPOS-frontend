import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRoutes from './AppRoutes.jsx'
import './index.css'

// Register the service worker and pass Firebase config as data
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration);
      
      registration.active.postMessage({
        firebaseConfig: {
          apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_APP_FIREBASE_APP_ID
        }
      });
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AppRoutes />
  </StrictMode>,
)


