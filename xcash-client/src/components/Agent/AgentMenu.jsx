import { useQuery } from "@tanstack/react-query";
import useCommonAxios from "../../hooks/useCommonAxios";

const AgentMenu = () => {
  const email = localStorage.getItem("email");
  // console.log(email)
  const commonAxios = useCommonAxios();

  const { data: userinfo, isLoading } = useQuery({
    queryKey: ["userInfo", !!email],
    queryFn: async () => {
      const { data } = await commonAxios(`/user/${email}`);
      return data;
    },
  });
  // console.log(userinfo)
  if (isLoading) return <p>loadingg</p>;
  return (
    <div>
      <div className=" p-4">
        <h2 className=" text-xl font-medium">Welcome , {userinfo?.name} </h2>
        <div className=" flex justify-between mb-3">
          <h3 className=" font-medium">Email: {userinfo?.email}</h3>
          <p className="font-medium">Role: Agent</p>
        </div>
        <div className=" flex justify-between">
          <p>status : {userinfo?.status} </p>{" "}
          <p>Balance: {userinfo?.balance}</p>
        </div>
      </div>
      <div className=" text-center grid grid-cols-2 justify-center items-center gap-4 p-4">
        <div className="bg-green-500 border-2 border-gray-600 flex justify-center items-center rounded-md w-36 h-24 ">
          <h4 className=" font-bold text-white text-xl p-3">
            Transaction Managements
          </h4>
        </div>
        <div className="bg-gray-300 border-2 border-gray-600 flex justify-center items-center rounded-md w-36 h-24 ">
          <h4 className=" font-bold text-green-500 text-xl p-3">Balance</h4>
        </div>
        <div className="bg-blue-500 border-2 border-gray-600 flex justify-center items-center rounded-md w-36 h-24 ">
          <h4 className=" font-bold text-white text-xl p-3">
            Transaction History
          </h4>
        </div>
      </div>
    </div>
  );
};

export default AgentMenu;
