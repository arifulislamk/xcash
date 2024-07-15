import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div>
      <h2 className=" text-5xl text-left font-bold">Xcash</h2>
      <Outlet />
    </div>
  );
};

export default Main;
