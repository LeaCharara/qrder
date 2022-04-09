import {initializeApp} from 'firebase/app'
import { getFirestore,collection,doc, getDocs,getDoc, addDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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
export default firebaseApp.messaging()
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
    status : 'Received'
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
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}