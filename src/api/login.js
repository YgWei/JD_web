import appserve from "./appserve";

const API_URL = "/login";

export default {
  async login(params) {
    return await appserve.post(`${API_URL}`, params);
  },
  async googleLogin(params) {
    return await appserve.post(`${API_URL}/google`, params);
  }
};
