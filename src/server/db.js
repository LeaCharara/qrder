import {initializeApp} from 'firebase/app'
import { getFirestore,collection,doc, getDocs,getDoc, addDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, deleteUser } from "firebase/auth";
import { async } from '@firebase/util';

export const config = { 
  apiKey: "AIzaSyBc4L-aTepKbQQkrAKJdocqCvtUo0al6Lo",
  authDomain: "qrder-eceb9.firebaseapp.com",
  projectId: "qrder-eceb9",
  storageBucket: "qrder-eceb9.appspot.com",
  messagingSenderId: "757947766402",
  appId: "1:757947766402:web:db1477a0a2d368a3a3869b",
  measurementId: "G-84189P3BP7" 
}


const firebaseApp = initializeApp(config);
const auth = getAuth();
const db = getFirestore(firebaseApp);
const restaurantsCollection = collection(db,"restaurants")
const ordersCollection = collection(db,"orders")

export const getOrders = async () => {
  const Orders = await getDocs(ordersCollection);
  let ord = []
  Orders.forEach((doc) => {
    ord.push({
      id : doc.id,
      ...doc.data()
    })
  });
   return ord;
}

export const addOrder = async (order) => {
  console.log(order);
  const docRef = await addDoc(collection(db, "orders"), {
    date: new Date(),
    description: order.description,
    img : order.img,
    restaurantName : order.title,
    total : order.total,
    user : order.user,
    status : 'Received',
    token : order.token
  });
  order.lineItems.map(async item => {
    await addDoc(collection(db, "orders", docRef.id, 'lineItems'), {
      idItem : `/restaurants/${order.id}/menu/${item.id}`,
      quantity : item.quantity
    })
  })
}

export const getRestaurants = async () => {
  const Restaurants = await getDocs(restaurantsCollection);
  let res = []
  if(Restaurants)
    Restaurants.forEach((doc) => {
      res.push({
        id : doc.id,
        ...doc.data()
      })
    });
  return res;
}

export const getRestaurant = async (id) => {
  let restaurant = await getDoc(doc(db,"restaurants", id));
  restaurant = {
    id : restaurant.id,
    ...restaurant.data()
  }
  return restaurant;
} 

export const getRestaurantMenu = async(id) => {
  const restaurant = collection(db,"restaurants",id,"menu")
  let menu = await getDocs(restaurant);
  let res = []
  menu.forEach((doc) => {
    res.push({
      id : doc.id,
      ...doc.data()
    })
  });
  const type = [];
  let menuDictionary = {}
  res.map(r => {
    if(!type.includes(r.type)){
      const temp = r.type
      type.push(temp);
      const ItemsWithSameType = res.filter(x => x.type === temp);
      menuDictionary[temp] = {
        title : temp.toUpperCase(),
        menu_items : [...ItemsWithSameType]
      }
    };

  })
  return menuDictionary;
}

export const SignIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  .catch(function(error) {
    alert("Invalid email or password.");
    return false;
  });
  return userCredential.user;
}

export const CreateAccount = async (email, password, fullname) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  .catch(function(error) {
    var errorCode = error.code;
    if (errorCode == 'auth/email-already-in-use') {
      alert('This email is already in use! please Try another one.');
    } else if (errorCode == "auth/invalid-email") {
      alert('Invalid Email Address!');
    } else
      // alert("Unexpected Error Occured! Please check db.js:CreateAccount");
      alert(errorCode);
    return false;
  });

  updateProfile(auth.currentUser, {
    displayName: fullname
  }).catch((error) => {
    deleteUser(userCredential.user);
    alert("Unexpected Error Occured! Please check db.js:CreateAccount");
    return false;
  });

  return userCredential.user;
}

export const getUserInfo = async () => {
  const user = auth.currentUser;
  if (user !== null) {
    const photoURL = user.photoURL;
    const displayName = user.displayName;
    const email = user.email;

    return [photoURL, displayName, email];
  }
  return false;
}

// export const getTokenFromFirebase = async () => {
//   const token = await getToken(messaging, { vapidKey: 'BKMetiMUvVfMeO7BY1sYllLWcTBK-sVr456aMlYjt49jmNJodpBB42GUXX8IvYSkSwk1gcx0dNBJzyxjqcJau3U' , serviceWorkerRegistration : '../firebase-messaging-sw.js'})
//   // getToken(messaging, { vapidKey: 'BKMetiMUvVfMeO7BY1sYllLWcTBK-sVr456aMlYjt49jmNJodpBB42GUXX8IvYSkSwk1gcx0dNBJzyxjqcJau3U' }).then((currentToken) => {
//   //   if (currentToken) {
//   //     console.log(currentToken)
//   //     // Send the token to your server and update the UI if necessary
//   //     // ...
//   //   } else {
//   //     // Show permission request UI
//   //     console.log('No registration token available. Request permission to generate one.');
//   //     // ...
//   //   }
//   // }).catch((err) => {
//   //   console.log('An error occurred while retrieving token. ', err);
//   //   // ...
//   // });
// }

export const onMessageReceived = () => {
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    // ...
})
}