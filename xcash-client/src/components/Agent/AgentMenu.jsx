import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import useSecureAxios from "../../hooks/useSecureAxios";

const AgentMenu = () => {
  const email = localStorage.getItem("email");
  const [TransectionHistory, setTransectionHistory] = useState(false);
  const [TransectionManagement, setTransectionManagement] = useState(false);
  // console.log(email)
  const secureAxios = useSecureAxios();

  const { data: userinfo, isLoading } = useQuery({
    queryKey: ["userInfo", !!email],
    queryFn: async () => {
      const { data } = await secureAxios(`/user/${email}`);
      return data;
    },
  });
  // console.log(userinfo)

  // payment history get
  const { data: paymentHistory } = useQuery({
    queryKey: ["paymentHistory", !!userinfo?.number],
    queryFn: async () => {
      const { data } = await secureAxios(`/paymenthistory/${userinfo?.number}`);
      return data;
    },
  });
  console.log(paymentHistory);

  //Transection Manegement 
  const { data: requestedusers } = useQuery ( {
    queryKey: ["requestedusers", !!userinfo?.number],
    queryFn: async () => {
      const { data } = await secureAxios(`/requestedusers/${userinfo?.number}`);
      return data;
    },
  })
  console.log(requestedusers, 'requestedusers re paichi',requestedusers?.requestamount)
  if (isLoading) return <p>loadingg</p>;
  return (
    <div>
      <div className=" p-4 bg-cyan-200 text-lime-900 rounded-b-2xl font-bold">
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

      {/* TransectionManagement  */}
      {TransectionManagement && requestedusers && (
        <div>
          <div className=" p-3">
            <button
              onClick={() => setTransectionManagement(!TransectionManagement)}
              className="btn text-left"
            >
              back
            </button>
          </div>
          <h2 className=" text-center font-bold text-xl ">
            Cash In Request
          </h2>
          <div>
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Number</th>
                    <th>Amount</th>
                    <th>Confirm</th>
                  </tr>
                </thead>
                <tbody>
                {requestedusers?.map((requesteduser, index) => (
                    <tr key={index}>
                      <td>{requesteduser?.email}</td>
                      <td>{requesteduser?.number}</td>
                      <td>{requesteduser?.requestamount}</td>
                      <td>confrm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
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

      {!TransectionHistory && !TransectionManagement && (
        <div className=" text-center grid grid-cols-2 justify-center items-center gap-4 p-4">
          <Link
            onClick={() => setTransectionManagement(!TransectionManagement)}
          >
            <div className="bg-green-500 border-2 border-gray-600 flex justify-center items-center rounded-md w-36 h-24 ">
              <h4 className=" font-bold text-white text-xl p-3">
                Transaction Managements
              </h4>
            </div>
          </Link>
          <Link onClick={() => setTransectionHistory(!TransectionHistory)}>
            <div className="bg-blue-500 border-2 border-gray-600 flex justify-center items-center rounded-md w-36 h-24 ">
              <h4 className=" font-bold text-white text-xl p-3">
                Transaction History
              </h4>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AgentMenu;
