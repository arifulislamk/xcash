
const AgentMenu = () => {
  return (
    <div>
      <div className=" text-center grid grid-cols-2 justify-center items-center gap-4 p-4">
        <div className="bg-green-500 border-2 border-gray-600 flex justify-center items-center rounded-md w-36 h-24 ">
          <h4 className=" font-bold text-white text-xl p-3">Transaction Managements</h4>
        </div>
        <div className="bg-gray-300 border-2 border-gray-600 flex justify-center items-center rounded-md w-36 h-24 ">
          <h4 className=" font-bold text-green-500 text-xl p-3">Balance</h4>
        </div>
        <div className="bg-blue-500 border-2 border-gray-600 flex justify-center items-center rounded-md w-36 h-24 ">
          <h4 className=" font-bold text-white text-xl p-3">Transaction History</h4>
        </div>
      </div>
    </div>
  );
};

export default AgentMenu;
