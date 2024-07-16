import { Outlet } from "react-router-dom";
import Home from "../pages/Home";

const Main = () => {
  return (
    <div className="min-h-screen max-w-xs mx-auto border-2 border-blue-500">
      <Home />
      <Outlet />
    </div>
  );
};

export default Main;
