import { useQuery } from "@tanstack/react-query";
import useCommonAxios from "../../hooks/useCommonAxios";

const AllUser = () => {
  const commonAxios = useCommonAxios();

  // Fetch all users from API using react-query
  const { data: alluser = [], isLoading } = useQuery({
    queryKey: "allUsers",
    queryFn: async () => {
      return commonAxios("/allusers");
    },
    onSuccess: () => {
      console.log(" Succesful");
    },
  });
  if (isLoading) return <p>loading.....</p>;
  console.log(alluser.data);
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className=" bg-gray-400 ">
              <th className="font-bold text-xl">Name</th>
              <th className=" text-xl font-bold">UserType</th>
              <th className=" text-xl font-bold">Confirm/update Role</th>
            </tr>
          </thead>
          <tbody>
            {alluser.data?.map((user,inx) => (
                <tr key={inx}>
                <th className=" text-xl font-bold">{user.name}</th>
                <td className=" text-xl">{user.userType}</td>
                <td><button className="btn">Update Role</button></td>
              </tr>
            ))}
           
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUser;
