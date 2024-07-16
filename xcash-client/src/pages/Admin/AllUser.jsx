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
            <tr>
              <th>Name</th>
              <th>UserType</th>
            </tr>
          </thead>
          <tbody>
            {alluser.data?.map((user,inx) => (
                <tr key={inx}>
                <th>{user.name}</th>
                <td>{user.userType}</td>
              </tr>
            ))}
           
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUser;
