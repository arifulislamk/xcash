import { Outlet } from "react-router-dom";
import Menu from "../components/Menu";

const Main = () => {
  return (
    <div className="min-h-screen max-w-xs mx-auto border-2 border-blue-500">
      <Menu />
      <Outlet />
    </div>
  );
};

export default Main;
