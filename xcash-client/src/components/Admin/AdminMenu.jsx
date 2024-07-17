import { Link } from "react-router-dom";
import useCommonAxios from "../../hooks/useCommonAxios";
import { useQuery } from "@tanstack/react-query";

const AdminMenu = () => {
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
        <div className=" flex justify-between ">
          <h3 className=" font-medium">Email: {userinfo?.email}</h3>
          <p className="font-medium">Role: Admin</p>
        </div>
        <div className=" flex justify-between">
          <p>status : {userinfo?.status} </p>{" "}
          <p>Balance: {userinfo?.balance}</p>
        </div>
      </div>
      <div className=" text-center grid grid-cols-2 justify-center items-center gap-4 p-4">
        <Link to="/alluser">
          <div className="bg-green-500 border-2 border-gray-600 flex justify-center items-center rounded-md w-36 h-24 ">
            <button className=" font-bold text-white text-xl p-3">
              User Management
            </button>
          </div>
        </Link>
        <div className="bg-gray-300 border-2 border-gray-600 flex justify-center items-center rounded-md w-36 h-24 ">
          <h4 className=" font-bold text-green-500 text-xl p-3">
            System Monitoring
          </h4>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
