import appserver from "./appserve";

const API_URL = "/user";

export default {
  async getUser(params) {
    return await appserver.get(`${API_URL}`, { params });
  },
  async getUserInfo() {
    return await appserver.get(`${API_URL}/info`);
  }
};
