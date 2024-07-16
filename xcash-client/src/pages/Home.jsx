import { useEffect, useState } from "react";
import UserMenu from "../components/User/UserMenu";
import Login from "./Login";
import AgentMenu from "../components/Agent/AgentMenu";
import AdminMenu from "../components/Admin/AdminMenu";

const Home = () => {
  const [user, setuser] = useState({});
  useEffect(() => {
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const number = localStorage.getItem("number");
    const pin = localStorage.getItem("pin");
    const userType = localStorage.getItem("userType");
    const info = { name, email, number, pin, userType };
    setuser(info);
    console.log(info);
  }, []);
  
  console.log(user)
  return (
    <div>
      { user.userType === 'user' ? <UserMenu /> : <Login />}
      { user.userType === 'agent' && <AgentMenu /> }
      { user.userType === 'admin' && <AdminMenu />  }
      
    </div>
  );
};

export default Home;
