// Import Firebase scripts for messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

self.addEventListener("message", (event) => {
  if (event.data && event.data.firebaseConfig) {
    firebase.initializeApp(event.data.firebaseConfig);

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] Background message received:', payload);

      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: '/your-icon.png'
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  }
});
