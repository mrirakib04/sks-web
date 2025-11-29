import axios from "axios";

const AxiosPublic = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

const useAxiosPublic = () => {
  return AxiosPublic;
};

export default useAxiosPublic;
