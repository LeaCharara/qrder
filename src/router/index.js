import { createRouter, createWebHistory } from "vue-router";
import Orders from "../views/Orders.vue";
import Menu from "../views/Menu.vue";
import Catalog from "../views/Catalog.vue";
import RestaurantDescription from "../views/RestaurantDescription.vue";
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
