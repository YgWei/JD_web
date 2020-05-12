import Vue from "vue";
import VueRouter from "vue-router";
import basicLayout from "../layout/BasicLayout.vue";
import Settings from "../views/Account/AccountSettings.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login/LoginPage.vue")
  },
  {
    path: "/settings",
    name: "accountSettings",
    component: Settings
  },
  {
    path: "/projects",
    name: "projects",
    component: basicLayout,
    children: [
      {
        path: "/projects",
        name: "projectList",
        component: () =>
          import(
            /* webpackChunkName: "projectList" */ "../views/Projects/ProjectList.vue"
          )
      },
      {
        path: ":id",
        name: "projectContent",
        component: () =>
          import(
            /* webpackChunkName: "projectContent" */ "../views/ProjectContent/ProjectContent.vue"
          )
      }
    ]
  },
  {
    path: "/users",
    name: "users",
    component: basicLayout,
    children: [
      {
        path: "/users",
        name: "userManagement",
        component: () =>
          import(
            /* webpackChunkName: "userManagement" */ "../views/User/UserManagement.vue"
          )
      }
    ]
  },
  {
    path: "/users/invite",
    name: "inviteUser",
    component: () =>
      import(
        /* webpackChunkName: "inviteUser" */ "../views/User/components/InviteUser.vue"
      )
  },
  {
    path: "/users/details",
    name: "userDetails",
    component: () =>
      import(
        /* webpackChunkName: "userDetails" */ "../views/User/components/UserDetails.vue"
      )
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
  if (token) {
    if (!store.getters.getUserInfo) {
      try {
        await store.dispatch("userInfo");
        next("/projects");
      } catch {
        localStorage.removeItem("token");
        next("/login");
      }
    }
  }

  next();
});

export default router;
