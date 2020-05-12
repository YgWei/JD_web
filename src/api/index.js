import project from "./project.js";
import appserve from "./appserve";
import login from "./login";
import user from "./user";
import mail from "./mail";

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

export { project, appserve, login, user, mail };
