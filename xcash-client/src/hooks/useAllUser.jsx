import { useQuery } from "@tanstack/react-query";
import useCommonAxios from "./useCommonAxios";

const useAllUser = () => {
  const commonAxios = useCommonAxios();
  const { data: alluser = [], isLoading } = useQuery({
    queryKey: "allUsers",
    queryFn: async () => {
      const { data } = await commonAxios("/allusers");
      return data;
    },
    onSuccess: () => {
      console.log(" Succesful");
    },
  });

  return [alluser?.data, isLoading];
};

export default useAllUser;
