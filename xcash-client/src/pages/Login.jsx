import { Link } from "react-router-dom";
import useCommonAxios from "../hooks/useCommonAxios";
import { useQuery } from "@tanstack/react-query";

const Login = () => {
  const commonAxios = useCommonAxios();
  const reloadPage = () => {
    window.location.reload();
  };
  
  // Save to localStorage
  const saveToLocalStorage = (name, pin, number, email, userType) => {
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("pin", pin);
    localStorage.setItem("userType", userType);
    localStorage.setItem("number", number);
  };

  const { data: alluser =[], refetch } = useQuery({
    queryKey: "allUsers",
    queryFn: async () => {
      return commonAxios("/allusers");
    },
    onSuccess: () => {
      console.log(' Succesful')
    },
  })
  console.log(alluser)
  const login = async (e) => {
    e.preventDefault();
    const emailornumber = e.target.emailornumber.value;
    const pin = e.target.pin.value;
    console.log(emailornumber, pin);
    try {
    {
          const userinfo = alluser.data.filter(
            (user) =>
              (user.pin === pin && user.email === emailornumber) ||
              (user.pin === pin && user.number === emailornumber)
          );
          console.log(userinfo);
          if (userinfo) {
            saveToLocalStorage(
              userinfo[0].name,
              userinfo[0].pin,
              userinfo[0].number,
              userinfo[0].email,
              userinfo[0].userType
            );
          }
        }
        reloadPage()
    } catch (err) {
      console.log(err.message);
    }

    refetch()
  };
  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-center">Login</h1>
            <p>Signup your Xcash account?</p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form onSubmit={login} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email/Number</span>
                </label>
                <input
                  type="text"
                  name="emailornumber"
                  placeholder="email"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">PIN</span>
                </label>
                <input
                  type="number"
                  name="pin"
                  placeholder="password"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Login</button>
              </div>
              <p>
                Are you new?{" "}
                <Link className=" text-blue-500" to="/registration">
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
