import api from "@/services/api";

export default {
    namespaced: true,

    state: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
    },

    mutations: {
        setAuthData(state, { token, user }) {
            state.token = token;
            state.user = user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        },
        clearAuthData(state) {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    actions: {
        async login({ commit }, credentials) {
            try {
                const {data: {access_token: token , user}} = await api.post("/login", credentials)
                commit("setAuthData", { token, user });
                return { success: token };
            } catch (error) {
                return { success: false, message: error.response?.data?.message || "Erro ao fazer login" };
            }
        },
        logout({ commit }) {
            commit("clearAuthData");
        },
    },

    getters: {
        user: (state) => state.user,
        isAuthenticated: (state) => !!state.token,
    },
}