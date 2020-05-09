import Vue from "vue";
import VueRouter from "vue-router";
import basicLayout from "../layout/BasicLayout.vue";
// import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/User/Login.vue")
  },
  {
    path: "/",
    name: "layout",
    component: basicLayout,
    children: [
      {
        path: "/home",
        name: "homePage",
        component: () =>
          import(/* webpackChunkName: "homePage" */ "../views/Home.vue")
      }
    ]
  },
  {
    path: "/*",
    redirect: "/login"
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  let token = localStorage.getItem("token");
  if (to.path !== "/login") {
    if (!token) {
      return next("/login");
    }
  }
  // if (token) {
  //   if (!store.getters.getRoles) {
  //     try {
  //       await store.dispatch("userInfo");
  //       next("/deploymentmanage");
  //     } catch {
  //       next("/login");
  //     }
  //   }
  // }

  next();
});

export default router;
