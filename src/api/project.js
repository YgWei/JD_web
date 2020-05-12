import appserve from "./appserve";

const API_URL = "/project";

export default {
  async getProjects() {
    return await appserve.get(`${API_URL}`);
  },
  async getProjectContent(id) {
    return await appserve.get(`${API_URL}/${id}`);
  }
};
