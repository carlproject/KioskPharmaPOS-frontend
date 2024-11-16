importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyBAPuUHFKVrzMHA_CWxBITCqci6-RK5Beg',
  authDomain: 'pharma-kiosk-ad218.firebaseapp.com',
  projectId: 'pharma-kiosk-ad218',
  storageBucket: 'pharma-kiosk-ad218.appspot.com',
  messagingSenderId: '270716874976',
  appId: '1:270716874976:web:cd7c864190e61919912085',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification?.title || "Default Title";
  const notificationOptions = {
    body: payload.notification?.body || "Default body",
    icon: payload.notification?.icon || '/default-icon.png',  
    data: payload.data, 
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
  console.log('Received background message:', payload);
});
