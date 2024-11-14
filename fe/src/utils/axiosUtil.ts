import { message } from "antd";
import axios from "axios";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const instance = axios.create({
  baseURL: "http://localhost:9999/",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    Accept: "application/json; charset=UTF-8",
  },
  withCredentials: true,
});
instance.interceptors.response.use(
  function (response) {
    const res = response.data;
    if (res.message) {
      message.success(res.message);
    }
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest.retried) {
      originalRequest.retried = false;
      try {
        await axios.get(`${SERVER_URL}api/auth/refreshToken`, {
          withCredentials: true,
        });
        originalRequest.retried = true;
        return instance(originalRequest);
      } catch (error: any) {
        if (error.response.status === 401) {
          message.error("Token expired, please login");

          const persistRoot = localStorage.getItem("persist:root");

          if (persistRoot) {
            const updatedPersistRoot = JSON.parse(persistRoot);
            let role = null;
            if (updatedPersistRoot.auth) {
              role = JSON.parse(updatedPersistRoot?.auth).userInfo?.role;
            }
            delete updatedPersistRoot.auth;
            localStorage.setItem("persist:root", updatedPersistRoot);
            setInterval(() => {
              window.location.href = `/${role}/login`;
            }, 1000);
          }
        }
      }
    }
    if (error.response.status === 403) {
      setInterval(() => {
        window.location.href = `/`;
      }, 1000);
    }
    if (error.response.data.error) {
      message.error(error.response.data.error);
    }
    return Promise.reject(error);
  }
);
export default instance;
