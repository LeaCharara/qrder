importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js')

var firebaseConfig = {
    apiKey: "AIzaSyBc4L-aTepKbQQkrAKJdocqCvtUo0al6Lo",
    authDomain: "qrder-eceb9.firebaseapp.com",
    projectId: "qrder-eceb9",
    storageBucket: "qrder-eceb9.appspot.com",
    messagingSenderId: "757947766402",
    appId: "1:757947766402:web:db1477a0a2d368a3a3869b",
    measurementId: "G-84189P3BP7"
}

const app = firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/firebase-logo.png'
    };
          //var notification = //examples include this, seems not needed

  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
  });

  