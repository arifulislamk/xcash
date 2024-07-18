import axios from "axios";
export const secureAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
const useSecureAxios = () => {
  secureAxios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return secureAxios;
};

export default useSecureAxios;
