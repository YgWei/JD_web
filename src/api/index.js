import render from "./render.js";
import appserve from "./appserve";
import login from "./login";
import user from "./user";

appserve.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export { render, appserve, login, user };
