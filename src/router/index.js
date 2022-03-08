import { createRouter, createWebHistory } from "vue-router";
import Menu from "../views/Menu.vue";
import Catalog from "../views/Catalog.vue";

const routes = [
  {
    path: "/menu",
    name: "menu",
    component: Menu,
  },
  {
    path: "/catalog",
    name: "catalog",
    component: Catalog,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
