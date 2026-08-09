import axios from "axios";

let rawUrl = import.meta.env.VITE_API_URL;
let BASE_URL;

if (rawUrl) {
  rawUrl = rawUrl.replace(/\/+$/, "");
  BASE_URL = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`;
} else {
  BASE_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api";
}

const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("thinkboard_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
