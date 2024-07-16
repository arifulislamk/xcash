import AdminMenu from "./Admin/AdminMenu";
import AgentMenu from "./Agent/AgentMenu";
import UserMenu from "./User/UserMenu";

const Menu = () => {
  return (
    <>
      <div>
        <UserMenu />
        <AgentMenu />
        <AdminMenu />
      </div>
    </>
  );
};

export default Menu;
