import useAllUser from "./useAllUser";

const useFilter = () => {
    const [alluser] = useAllUser() 
    console.log(alluser)

    const email = localStorage.getItem('email');
    const number = localStorage.getItem('number');
  
    const userinfo = alluser && alluser?.filter(user => user.email === email || user.number === number)
    console.log(userinfo , email)
  

  return [userinfo] ;
};

export default useFilter;
