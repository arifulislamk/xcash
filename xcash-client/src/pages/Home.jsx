import { useEffect, useState } from "react";
import UserMenu from "../components/User/UserMenu";
import Login from "./Login";
import AgentMenu from "../components/Agent/AgentMenu";
import AdminMenu from "../components/Admin/AdminMenu";
import Pending from "../components/Pending";

const Home = () => {
    const reloadPage = () => {
        window.location.reload();
      };
  const [user, setuser] = useState({});
  useEffect(() => {
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const number = localStorage.getItem("number");
    const pin = localStorage.getItem("pin");
    const userType = localStorage.getItem("userType");
    const info = { name, email, number, pin, userType };
    setuser(info);
    // console.log(info);
  }, []);

  const logout = () => {
    localStorage.clear()
    reloadPage()
  }

  // console.log(user);
  return (
    <div>
      {user.userType === "user" && <UserMenu /> }
      {user.userType === "agent" && <AgentMenu />}
      {user.userType === "admin" &&  <AdminMenu /> }
      {user.userType === "pending" && <Pending /> }
      {
        user.userType === "user" || user.userType === "agent" || user.userType === "admin" || user.userType === "pending" ? '' : <Login />
      }

      { user.userType && <div className=" flex justify-center">
        <button onClick={logout} className="btn  text-xl font-bold text-center">Logout</button>
      </div>}
    </div>
  );
};

export default Home;
