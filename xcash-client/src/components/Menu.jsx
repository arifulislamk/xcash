import AgentMenu from "./Agent/AgentMenu";
import UserMenu from "./User/UserMenu";

const Menu = () => {
  return (
    <>
      <div>
        <UserMenu />
        <AgentMenu />
      </div>
    </>
  );
};

export default Menu;
