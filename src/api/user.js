import appserve from "./appserve";

const API_URL = "/user";

export default {
  async getUser(params) {
    return await appserve.get(`${API_URL}`, { params });
  },
  async getUserInfo() {
    return await appserve.get("userinfo");
  }
};
