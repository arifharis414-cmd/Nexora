import axios from "axios";

// One shared Axios instance for the whole app.
// Every request automatically goes to our backend and includes the JWT if present.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Runs before every request — attaches the saved token (if the user is logged in)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
