import {initializeApp} from 'firebase/app'
import { initializeFirestore,collection,doc, getDocs,getDoc, addDoc, query, where, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import { getAuth } from "firebase/auth";
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
export const db = initializeFirestore(firebaseApp, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED
});
enableIndexedDbPersistence(db)
  .catch((err) => {
      if (err.code == 'failed-precondition') {
        console.log(err.code)
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
        console.log(err.code)
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });
const restaurantsCollection = collection(db,"restaurants")
const ordersCollection = collection(db,"orders")

export const getOrders = async (id) => {
  const q = query(ordersCollection, ...[where('user','==',id), where('status', '==', 'Done')])
  const Orders = await getDocs(q);
  let ord = []
  Orders.forEach((doc) => {
    ord.push({
      id : doc.id,
      ...doc.data()
    })
  });
   return ord;
}

export const getOrderDetail = async (id) => {
  const order = collection(db,"orders",id,"lineItems");
  const orderDetail = await getDocs(order);
  let items = []
  orderDetail.forEach(async (doc) => {
      items.push({quantity : doc.data().quantity, ref : doc.data().idItem})
  })
  let ind = 0
  await Promise.all(items.map(async (i, index) => {
      const item = await getDoc(i.ref);
      items[index].price = item.data().price;
      items[index].name = item.data().name;
      delete i.ref
      return ind + 1
    }
  ))
  return items;
}

export const addOrder = async (order) => {
  const docRef = await addDoc(collection(db, "orders"), {
    date: new Date(),
    description: order.description,
    img : order.img,
    restaurantName : order.restaurantName,
    total : order.total,
    user : order.user,
    status : order.status,
    token : order.token
  });
  order.lineItems.map(async item => {
    await addDoc(collection(db, "orders", docRef.id, 'lineItems'), {
      idItem : doc(db,`/restaurants/${order.id}/menu/${item.id}`),
      quantity : item.quantity
    })
  })
  return docRef.id;
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
