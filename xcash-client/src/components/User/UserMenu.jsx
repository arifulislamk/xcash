import { useQuery } from "@tanstack/react-query";
import useCommonAxios from "../../hooks/useCommonAxios";
import { Link } from "react-router-dom";
import { useState } from "react";

const UserMenu = () => {
  const email = localStorage.getItem("email");
  const [sendmoney, setsendmoney] = useState(false);
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

  // sendmoney
  const handleSendMoney = async (e) => {
    e.preventDefault();
    const number = e.target.number.value;
    const amount = e.target.amount.value;
    const pin = e.target.pin.value;

    console.log(number, amount, pin);
    if (amount <= userinfo?.balance) {
      const { data } = await commonAxios.patch(`/transfer/${number}` ,{amount: amount});
      console.log(data);
      if(data.modifiedCount){
        alert("Money sent successfully");
       const { data } = await commonAxios.patch(`/minus/${userinfo?.number}` ,{amount: amount}); 
       console.log(data);
        setsendmoney(false);
      }
      window.location.reload();
    } else {
      alert("Insufficient balance");
    }
  };
  if (isLoading) return <p>loadingg</p>;
  return (
    <div>
      <div className=" p-4">
        <h2 className=" text-xl font-medium">Welcome , {userinfo?.name} </h2>
        <div className=" flex justify-between mb-3">
          <h3 className=" font-medium">Email: {userinfo?.email}</h3>
          <p className="font-medium">Role: User</p>
        </div>
        <div className=" flex justify-between">
          <p>status : {userinfo?.status} </p>{" "}
          <p>Balance: {userinfo?.balance}</p>
        </div>
      </div>
      {sendmoney ? (
        <div>
          <div className=" p-3">
            <button
              onClick={() => setsendmoney(!sendmoney)}
              className="btn text-left"
            >
              back
            </button>
          </div>
          <div className=" flex flex-col justify-center items-center ">
            <form
              onSubmit={handleSendMoney}
              className="space-y-5 mt-4"
              action=""
            >
              <div>
                <input
                  name="number"
                  className="border border-gray-400 p-3 rounded-md"
                  placeholder="sending number"
                  type="number"
                />
              </div>
              <div>
                <input
                  type="number"
                  className="border border-gray-400 p-3 rounded-md"
                  placeholder="amount"
                  name="amount"
                />
              </div>
              <div>
                <input
                  name="pin"
                  className="border border-gray-400 p-3 rounded-md"
                  placeholder="Pin"
                  type="number"
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn bg-green-400">Send</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className=" text-center grid grid-cols-2 justify-center items-center gap-5 p-4">
          <Link onClick={() => setsendmoney(!sendmoney)}>
            <div className="bg-yellow-500 border-2 border-gray-600 flex justify-center items-center rounded-md w-32 h-24 ">
              <h4 className=" font-bold text-white text-xl p-3">Send Money</h4>
            </div>
          </Link>
          <div className=" border-2 border-gray-600 flex justify-center items-center rounded-md w-32 h-24 bg-red-400">
            <h4 className=" font-bold text-white text-xl p-3">Cash Out</h4>
          </div>
          <div className=" border-2 border-gray-600 flex justify-center items-center rounded-md w-32 h-24 bg-green-400">
            <h4 className=" font-bold text-white text-xl p-3">Cash In</h4>
          </div>
          <div className="bg-blue-500 border-2 border-gray-600 flex justify-center items-center rounded-md w-32 h-24 ">
            <h4 className=" font-bold text-white text-xl p-3">
              Transaction History
            </h4>
          </div>
          <div className="bg-gray-300 border-2 border-gray-600 flex justify-center items-center rounded-md w-32 h-24 ">
            <h4 className=" font-bold text-green-500 text-xl p-3">Balance</h4>
          </div>
        </div>
      )}

      {/* <p className=" text-xl text-center mb-4 font-bold">
        Request for Agent ? <button className="btn">click</button>{" "}
      </p> */}
    </div>
  );
};

export default UserMenu;
