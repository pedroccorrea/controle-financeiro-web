import axios from "axios";
import store from "@/store";

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        Accept: "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = store.state.auth.token;

        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if ( error.response && error.responst.status == 401 ) {
            store.commit('auth/logout');
        }
        return Promise.reject(error);
    }
)

export default api;