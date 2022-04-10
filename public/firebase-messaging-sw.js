import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";

const firebaseApp = initializeApp({
    apiKey: "AIzaSyBc4L-aTepKbQQkrAKJdocqCvtUo0al6Lo",
    authDomain: "qrder-eceb9.firebaseapp.com",
    projectId: "qrder-eceb9",
    storageBucket: "qrder-eceb9.appspot.com",
    messagingSenderId: "757947766402",
    appId: "1:757947766402:web:db1477a0a2d368a3a3869b",
    measurementId: "G-84189P3BP7"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
console.log('[firebase-messaging-sw.js] Received background message ', payload);
// Customize notification here
const notificationTitle = 'Background Message Title';
const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
};

self.registration.showNotification(notificationTitle,
    notificationOptions);
});