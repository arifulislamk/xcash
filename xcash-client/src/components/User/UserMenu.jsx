import { useQuery } from "@tanstack/react-query";
import useCommonAxios from "../../hooks/useCommonAxios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import useSecureAxios from "../../hooks/useSecureAxios";

const UserMenu = () => {
  const email = localStorage.getItem("email");
  const [sendmoney, setsendmoney] = useState(false);
  const [cashOut, setcashOut] = useState(false);
  const [cashIn, setcashIn] = useState(false);
  const [TransectionHistory, setTransectionHistory] = useState(false);
  console.log(email);
  const commonAxios = useCommonAxios();
  const secureAxios = useSecureAxios();

  const { data: userinfo, isLoading } = useQuery({
    queryKey: ["userInfo", !!email],
    queryFn: async () => {
      const { data } = await secureAxios(`/user/${email}`);
      return data;
    },
  });
  // console.log(userinfo);

  // sendmoney handle
  const handleSendMoney = async (e) => {
    e.preventDefault();
    const number = e.target.number.value;
    const amount = e.target.amount.value;
    const pin = e.target.pin.value;
    console.log(number, amount, pin);
    if (amount > 100 && 105 > userinfo.balance)
      return toast.error("not enough balance with fee");
    if (amount <= userinfo?.balance && pin === userinfo?.pin && amount > 49) {
      const { data } = await commonAxios.patch(`/transfer/${number}`, {
        amount: amount,
        userNumber: userinfo?.number,
      });
      // console.log(data);
      if (data.modifiedCount) {
        toast.success("Money sent successfully");
        const { data } = await commonAxios.patch(`/minus/${userinfo?.number}`, {
          amount: amount,
        });
        // console.log(data);
        setsendmoney(false);
      }
      // window.location.reload();
    } else {
      if (amount > userinfo?.balance) {
        toast.error("Insufficient balance ");
      }
      if (amount < 50) {
        toast.error("Transaction amount should be greater than 49 ");
      }
      if (pin !== userinfo?.pin) {
        toast.error("pin not matching ");
      }
    }
  };

  // cashOut handle
  const handleCashOut = async (e) => {
    e.preventDefault();
    const amount = e.target.amount.value;
    const number = e.target.number.value;
    const pin = e.target.pin.value;

    console.log(
      number,
      amount,
      pin,
      parseFloat(amount * (1.5 / 100)) + parseFloat(amount)
    );
    if (
      parseFloat(amount * (1.5 / 100)) + parseFloat(amount) >
      userinfo.balance
    )
      return toast.error("not enough balance with fee");
    if (amount <= userinfo?.balance && pin === userinfo?.pin) {
      const { data } = await commonAxios.patch(`/cashouttransfer/${number}`, {
        amount: amount,
        userNumber: userinfo?.number,
      });
      // console.log(data);
      if (data.modifiedCount) {
        toast.success("Cash Out successfully");
        const { data } = await commonAxios.patch(
          `/cashoutminus/${userinfo?.number}`,
          {
            amount: amount,
          }
        );
        // console.log(data);
        setcashOut(false);
      }
      // window.location.reload();
    } else {
      if (amount > userinfo?.balance) {
        toast.error("Insufficient balance ");
      }
      if (pin !== userinfo?.pin) {
        toast.error("pin not matching ");
      }
    }
  };

  // cashIn handle
  const handleCashIn = async (e) => {
    e.preventDefault();
    const amount = e.target.amount.value;
    const number = e.target.number.value;
    const pin = e.target.pin.value;
    console.log(amount, pin, number);
    if (pin === userinfo?.pin ) {
      const { data } = await commonAxios.patch(`/cashin/${userinfo?.email}`, {
        requestamount : amount,
        requestnumber : number,
      });
      console.log(data);
      if (data.modifiedCount >= 0) {
        toast.success("Money Requested successfully");
        // console.log(data);
        setcashIn(false);
      }
      // window.location.reload();
    } else {
      if (amount === 0) {
        toast.error("low balace requested");
      }
      if (pin !== userinfo?.pin) {
        toast.error("pin not matching ");
      }
    }
  };

  // payment history.get
  const { data: paymentHistory } = useQuery({
    queryKey: ["paymentHistory", !!userinfo?.number],
    queryFn: async () => {
      const { data } = await secureAxios(`/paymenthistory/${userinfo?.number}`);
      return data;
    },
  });
  // console.log(paymentHistory);
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
      {/* sendmoney ul  */}
      {sendmoney && (
        <div>
          <div className=" p-3">
            <button
              onClick={() => setsendmoney(!sendmoney)}
              className="btn text-left"
            >
              back
            </button>
          </div>
          <h2 className=" text-center font-bold text-xl ">Send Money</h2>
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
      )}

      {/* Cashout Ui  */}
      {cashOut && (
        <div>
          <div className=" p-3">
            <button
              onClick={() => setcashOut(!cashOut)}
              className="btn text-left"
            >
              back
            </button>
          </div>
          <h2 className=" text-center font-bold text-xl ">Cash Out</h2>
          <div className=" flex flex-col justify-center items-center ">
            <form onSubmit={handleCashOut} className="space-y-5 mt-4" action="">
              <div>
                <input
                  name="number"
                  className="border border-gray-400 p-3 rounded-md"
                  placeholder="Agent number"
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
      )}

      {/* CashIn Ui  */}
      {cashIn && (
        <div>
          <div className=" p-3">
            <button
              onClick={() => setcashIn(!cashIn)}
              className="btn text-left"
            >
              back
            </button>
          </div>
          <h2 className=" text-center font-bold text-xl ">Cash In</h2>
          <div className=" flex flex-col justify-center items-center ">
            <form onSubmit={handleCashIn} className="space-y-5 mt-4" action="">
              <div>
                <input
                  name="number"
                  className="border border-gray-400 p-3 rounded-md"
                  placeholder="Agent number"
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
                      <td>{payment.To}</td>
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

      {!sendmoney && !cashOut && !cashIn && !TransectionHistory && (
        <div className=" text-center grid grid-cols-2 justify-center items-center gap-5 p-4">
          <Link onClick={() => setsendmoney(!sendmoney)}>
            <div className="bg-yellow-500 border-2 border-gray-600 flex justify-center items-center rounded-md w-32 h-24 ">
              <h4 className=" font-bold text-white text-xl p-3">Send Money</h4>
            </div>
          </Link>
          <Link onClick={() => setcashOut(!cashOut)}>
            <div className=" border-2 border-gray-600 flex justify-center items-center rounded-md w-32 h-24 bg-red-400">
              <h4 className=" font-bold text-white text-xl p-3">Cash Out</h4>
            </div>
          </Link>
          <Link onClick={() => setcashIn(!cashIn)}>
            <div className=" border-2 border-gray-600 flex justify-center items-center rounded-md w-32 h-24 bg-green-400">
              <h4 className=" font-bold text-white text-xl p-3">Cash In</h4>
            </div>
          </Link>

          <Link onClick={() => setTransectionHistory(!TransectionHistory)}>
            <div className="bg-blue-500 border-2 border-gray-600 flex justify-center items-center rounded-md w-32 h-24 ">
              <h4 className=" font-bold text-white text-xl p-3">
                Transaction History
              </h4>
            </div>
          </Link>
        </div>
      )}

      {/* <p className=" text-xl text-center mb-4 font-bold">
        Request for Agent ? <button className="btn">click</button>{" "}
      </p> */}
    </div>
  );
};

export default UserMenu;
