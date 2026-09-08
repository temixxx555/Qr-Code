import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise = null;
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !["/auth/refresh", "/auth/login", "/auth/register", "/auth/logout"].some(
        (path) => original.url?.includes(path),
      )
    ) {
      original._retry = true;
      if (!refreshPromise)
        refreshPromise = api.post("/auth/refresh").finally(() => {
          refreshPromise = null;
        });
      await refreshPromise;
      return api(original);
    }
    return Promise.reject(error);
  },
);
export default api;
