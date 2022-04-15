import { createRouter, createWebHistory } from "vue-router";
import Orders from "../views/Orders.vue";
import Menu from "../views/Menu.vue";
import Catalog from "../views/Catalog.vue";
import RestaurantDescription from "../views/RestaurantDescription.vue";
import Scan from "../views/Scan.vue";
import Login from "../views/Login.vue";
import Create from "../views/CreateAccount.vue";
import OrderRecap from "../views/OrderRecap.vue";
import status from "../views/status.vue";
import Account from "../views/Account.vue";
import EditAccount from "../views/EditAccount.vue";

const routes = [
  {
    path: "/orders",
    name: "orders",
    component: Orders,
    props : true,
  },
  {
    path: "/menu",
    name: "menu",
    component: Menu,
    props : true,
  },
  {
    path: "/",
    name: "catalog",
    component: Catalog,
    props : true,
  },
  {
    path: "/desc",
    name: "description",
    component: RestaurantDescription,
    props : true,
  },
  {
    path: "/scan",
    name: "scan",
    component: Scan,
    props : true,
  },
  {
    path: "/login",
    name : 'login',
    component: Login,
    props : true,
  },
  {
    path: "/create",
    name : 'create',
    component: Create,
  },
  {
    path: "/recap",
    name : 'recap',
    component: OrderRecap,
    props : true,
  },
  {
    path: "/status",
    name : 'status',
    component: status,
    props : true,
  }, 
  {
    path: "/profile",
    name: "Profile",
    component: Account,
    props: true
  },
  {
    path: "/profile/edit",
    name: "Edit Profile",
    component: EditAccount,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
