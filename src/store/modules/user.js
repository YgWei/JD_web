import { login, user } from "@/api";
export const state = {
  token: null,
  user: null
};

export const mutations = {
  TOKEN(state, token) {
    state.token = token;
  },
  USER(state, user) {
    state.user = user;
  }
};

export const actions = {
  async Login({ commit }, params) {
    const response = await login.login(params);
    commit("TOKEN", response.data.data.jwt);
    return response;
  },
  async userInfo({ commit }) {
    const response = await user.getUserInfo();
    commit("USER", response.data.data);
  }
};

export const getters = {
  getToken(state) {
    return state.token;
  },
  getUserInfo(state) {
    return state.user;
  }
};
