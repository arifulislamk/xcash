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
    const email = localStorage.getItem("email");
    const userType = localStorage.getItem("userType");
    const info = { email, userType };
    setuser(info);
    // console.log(info);
  }, []);

  const logout = () => {
    localStorage.clear();
    reloadPage();
  };

  // console.log(user);
  return (
    <div>
      {user.userType === "user" && <UserMenu />}
      {user.userType === "agent" && <AgentMenu />}
      {user.userType === "admin" && <AdminMenu />}
      {user.userType === "pending" && <Pending />}
      {user.userType === "user" ||
      user.userType === "agent" ||
      user.userType === "admin" ||
      user.userType === "pending" ? (
        ""
      ) : (
        <Login />
      )}

      {user.userType && (
        <div className=" flex justify-center mt-6">
          <button
            onClick={logout}
            className="btn  text-xl font-bold text-center"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
