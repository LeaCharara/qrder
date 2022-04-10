import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
    apiKey: "AIzaSyBc4L-aTepKbQQkrAKJdocqCvtUo0al6Lo",
    authDomain: "qrder-eceb9.firebaseapp.com",
    projectId: "qrder-eceb9",
    storageBucket: "qrder-eceb9.appspot.com",
    messagingSenderId: "757947766402",
    appId: "1:757947766402:web:db1477a0a2d368a3a3869b",
    measurementId: "G-84189P3BP7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);

onMessage(messaging, (payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/firebase-logo.png'
    };
          //var notification = //examples include this, seems not needed

  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
  });