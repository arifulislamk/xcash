import { useQuery, useMutation } from "@tanstack/react-query";
import useCommonAxios from "../../hooks/useCommonAxios";
import { useState } from "react";
import { toast } from "react-toastify";
import UpdateUserModal from "../../components/UpdateUserModal";

const AllUser = () => {
    const reloadPage = () => {
        window.location.reload();
      };
  const commonAxios = useCommonAxios();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState();

  // Fetch all users from API using react-query
  const { data: alluser = [], isLoading } = useQuery({
    queryKey: "allUsers",
    queryFn: async () => {
      return commonAxios("/allusers");
    },
    onSuccess: () => {
      // console.log(" Succesful");
    },
  });
  if (isLoading) return <p>loading.....</p>;
  // console.log(alluser.data);

  // modal handle
  const modalHandler = async (selected) => {
    console.log("user role updated", selected);
    let updatedRole = {
      userType: selected,
      status: "Verified",
      balance: 40 ,
    };

    if(selected === 'agent') updatedRole.balance = 10000 ;
    console.log(updatedRole);
    try {
      const { data } = await commonAxios
        .patch(`/alluser/${email}`, updatedRole)
        // console.log(data)

        reloadPage()
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className=" bg-gray-400 ">
              <th className="font-bold text-xl">Name</th>
              <th className=" text-xl font-bold">UserType</th>
              <th className=" text-xl font-bold">Status</th>
              <th className=" text-xl font-bold">Confirm/update Role</th>
            </tr>
          </thead>
          <tbody>
            {alluser.data?.map((user, inx) => (
              <tr key={inx}>
                <th className=" text-xl font-bold">{user.name}</th>
                <td className=" text-xl">{user.userType}</td>
                <td>
                  {user?.status}
                </td>

                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button
                    onClick={() => {
                      setIsOpen(true);
                      setEmail(user.email);
                    }}
                    className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                    ></span>
                    <span className="relative">Confirm</span>
                  </button>
                  {/* Update User Modal */}
                  <UpdateUserModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    modalHandler={modalHandler}
                    user={user}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUser;
