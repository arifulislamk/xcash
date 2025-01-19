import { Link } from "react-router-dom";
import { useState } from "react";
import useSecureAxios from "../../hooks/useSecureAxios";
import { useQuery } from "@tanstack/react-query";
import UpdateUserModal from "../UpdateUserModal";
import { toast } from "react-toastify";

const AdminMenu = () => {
  const email = localStorage.getItem("email");
  const [TransectionHistory, setTransectionHistory] = useState(false);
  const [alluser, setAlluser] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [emails, setEmails] = useState();
  // console.log(email)
  const secureAxios = useSecureAxios() ;

  const { data: userinfo, isLoading } = useQuery({
    queryKey: ["userInfo", !!email],
    queryFn: async () => {
      const { data } = await secureAxios(`/user/${email}`);
      return data;
    },
  });

    // Fetch all users from API using react-query
    const { data: allusers = [] } = useQuery({
      queryKey: "allUsers",
      queryFn: async () => {
        return secureAxios("/allusers");
      },
      onSuccess: () => {
        // console.log(" Succesful");
      },
    });
  // console.log(userinfo)

  // payment history.get
  const { data: paymentHistory } = useQuery({
    queryKey: ["paymentHistory"],
    queryFn: async () => {
      const { data } = await secureAxios(`/paymenthistory`);
      return data;
    },
  });
  console.log(paymentHistory);
  if (isLoading) return <p>loadingg</p>;

  // user managment work
  const reloadPage = () => {
    window.location.reload();
  };
  if (isLoading) return <p>loading.....</p>;
  // console.log(alluser.data);

  // modal handle
  const modalHandler = async (selected) => {
    console.log("user role updated", selected);
    let updatedRole = {
      userType: selected,
      status: "Verified",
      balance: 40,
    };

    if (selected === "agent") updatedRole.balance = 10000;
    console.log(updatedRole);
    try {
      const { data } = await secureAxios.patch(
        `/alluser/${emails}`,
        updatedRole
      );
      // console.log(data)

      reloadPage();
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  return (
    <div>
      <div className=" p-4  bg-cyan-200 text-lime-900 rounded-b-2xl font-bold">
        <h2 className=" text-xl font-medium">Welcome , {userinfo?.name} </h2>
        <div className=" flex justify-between ">
          <h3 className=" font-medium">Email: {userinfo?.email}</h3>
          <p className="font-medium">Role: Admin</p>
        </div>
        <div className=" flex justify-between">
          <p>status : {userinfo?.status} </p>
        </div>
      </div>

      {/* TransectionHistory  */}
      {TransectionHistory && (
        <div>
          <div className=" p-3">
            <button
              onClick={() => setTransectionHistory(!TransectionHistory)}
              className="btn text-left"
            >
              back
            </button>
          </div>
          <h2 className=" text-center font-bold text-xl ">
            Transection History
          </h2>
          <div>
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>Tran. Type</th>
                    <th>Number</th>
                    <th>Amount</th>
                    <th>Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory?.map((payment, index) => (
                    <tr key={index}>
                      <td>{payment.Type}</td>
                      <td>{payment.From}</td>
                      <td>{payment.amount}</td>
                      <td>{payment.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* alluser  */}
      {alluser && (
        <div>
          <div className=" p-3">
            <button
              onClick={() => setAlluser(!alluser)}
              className="btn text-left"
            >
              back
            </button>
          </div>
          <h2 className=" text-center font-bold text-xl ">
            All Users
          </h2>
          <div>
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr className=" bg-gray-400 ">
                    <th className="font-bold">Name</th>
                    <th className=" font-bold">UserType</th>
                    <th className=" font-bold">Status</th>
                    <th className="font-bold">Confirm/update Role</th>
                  </tr>
                </thead>
                <tbody>
                  {allusers.data?.map((user, inx) => (
                    <tr key={inx}>
                      <th className="font-bold">{user.name}</th>
                      <td className="">{user.userType}</td>
                      <td>{user?.status}</td>

                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <button
                          onClick={() => {
                            setIsOpen(true);
                            setEmails(user.email);
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
        </div>
      )}

      {!TransectionHistory && !alluser && (
        <div className=" text-center grid grid-cols-2 justify-center items-center gap-4 p-4">
          <Link onClick={() => setAlluser(!alluser)}>
            <div className="bg-green-500 border-2 border-gray-600 flex justify-center items-center rounded-md w-36 h-24 ">
              <button className=" font-bold text-white text-xl p-3">
                User Management
              </button>
            </div>
          </Link>
          <Link onClick={() => setTransectionHistory(!TransectionHistory)}>
            <div className="bg-gray-300 border-2 border-gray-600 flex justify-center items-center rounded-md w-36 h-24 ">
              <h4 className=" font-bold text-green-500 text-xl p-3">
                System Monitoring
              </h4>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminMenu;
