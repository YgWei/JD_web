import appserve from "./appserve";

const API_URL = "/mail";

export default {
  async sendInvite(params) {
    return await appserve.post(`${API_URL}`, params);
  }
};
