// src/api/axios.js
import axios from "axios";

// 🔹 Cria instância do Axios
const api = axios.create({
  baseURL: "http://localhost:8000", // sem /api, ajusta para o seu backend
});

// 🔹 Função para renovar token usando refresh
const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) throw new Error("Sem refresh token");

    const response = await axios.post("http://localhost:8000/auth/token/refresh/", {
      refresh: refresh,
    });

    localStorage.setItem("access", response.data.access);
    return response.data.access;
  } catch (err) {
    console.error("Erro ao renovar token:", err);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("tipo_conta");
    window.location.href = "/login"; // redireciona para login
    throw err;
  }
};

// 🔹 Interceptor para adicionar token em cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Interceptor para lidar com 401 e tentar refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // refaz a requisição
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
