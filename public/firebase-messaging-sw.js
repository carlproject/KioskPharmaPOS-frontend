importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

let firebaseInitialized = false;

self.addEventListener('message', (event) => {
  if (!firebaseInitialized && event.data.firebaseConfig) {
    firebase.initializeApp(event.data.firebaseConfig);
    firebaseInitialized = true;

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log('Received background message:', payload);
      // Optionally, show a notification here
      self.registration.showNotification(payload.notification.title, { body: payload.notification.body });
    });
  }
});
