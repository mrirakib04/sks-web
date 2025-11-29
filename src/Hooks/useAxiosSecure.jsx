import axios from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import MainContext from "../Context/MainContext";

const AxiosSecure = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { handleLogout } = useContext(MainContext);

  useEffect(() => {
    // Request interceptor
    const requestInterceptor = AxiosSecure.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    const responseInterceptor = AxiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error?.response) {
          const status = error.response.status;

          // Handle unauthorized or forbidden responses
          if (status === 401 || status === 403) {
            await handleLogout();
            navigate("/login");
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount (optional)
    return () => {
      AxiosSecure.interceptors.request.eject(requestInterceptor);
      AxiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [handleLogout, navigate]);

  return AxiosSecure;
};

export default useAxiosSecure;
