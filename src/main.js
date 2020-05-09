import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import GAuth from "vue-google-oauth2";

const gauthOption = {
  clientId:
    "182557224693-4nonvv9tb9nta0ceu2d0s8hi999odp9j.apps.googleusercontent.com",
  scope: "profile email",
  prompt: "select_account consent"
};

Vue.use(GAuth, gauthOption);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
