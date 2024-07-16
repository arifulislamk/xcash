import axios from "axios";
export const commonAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
}) 
const useCommonAxios = () => {
    return  commonAxios
};

export default useCommonAxios;