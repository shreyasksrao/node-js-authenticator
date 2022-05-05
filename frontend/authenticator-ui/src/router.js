/*jshint esversion: 11 */
import { createWebHistory, createRouter } from "vue-router";
const routes =  [
  {
    path: "/loginUser",
    alias: "/login",
    name: "login",
    component: () => import("./components/UserLogin")
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
