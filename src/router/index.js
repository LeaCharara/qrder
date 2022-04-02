import { createRouter, createWebHistory } from "vue-router";
import Orders from "../views/Orders.vue";
import Menu from "../views/Menu.vue";
import Catalog from "../views/Catalog.vue";
import RestaurantDescription from "../views/RestaurantDescription.vue";
import Scan from "../views/Scan.vue";
import Login from "../views/Login.vue";

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
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
