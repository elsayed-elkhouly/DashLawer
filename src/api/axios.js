import axios from "axios";
import Cookies from "js-cookie";

let csrfToken = null;
let isRefreshing = false;
let failedQueue = [];

export function setCsrfToken(token) {
  csrfToken = token;
}

function processQueue(error, token = null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase();
  const token = Cookies.get("token");

  if (
    csrfToken &&
    method &&
    ["post", "put", "patch", "delete"].includes(method)
  ) {
    config.headers["x-csrf-token"] = csrfToken;
  }

  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message = error.response?.data?.message;

    const isUnauthorized =
      status === 401 || (status === 500 && message === "jwt expired");

    const isRefreshRequest =
      originalRequest?.url?.includes("/auth/refreshToken");

    const isLoginRequest =
      originalRequest?.url?.includes("/auth/signin") ||
      originalRequest?.url?.includes("/auth/authSignin");

    if (!isUnauthorized || isRefreshRequest || isLoginRequest) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/refreshToken`,
        {},
        {
          withCredentials: true,
          headers: csrfToken ? { "x-csrf-token": csrfToken } : {},
        }
      );

      Cookies.set("token", data.access_token, { expires: 1 });
      processQueue(null, data.access_token);

      originalRequest.headers.authorization = `Bearer ${data.access_token}`;
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      Cookies.remove("token");
      window.location.href = "/Login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;