// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAZGIAs5agJk5HH_LGidkhX-ZkTG1Rh_I0",
  authDomain: "smartvax-fcm.firebaseapp.com",
  projectId: "smartvax-fcm",
  storageBucket: "smartvax-fcm.appspot.com",
  messagingSenderId: "370407188316",
  appId: "1:370407188316:web:4b1d23dbc982cccd938399",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body: body,
    icon: '/moh.png', // شعار وزارة الصحة
  });
});
