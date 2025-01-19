import { Link } from "react-router-dom";
import useCommonAxios from "../hooks/useCommonAxios";

const Login = () => {
  const commonAxios = useCommonAxios();
  const reloadPage = () => {
    window.location.reload();
  };

  const login = async (e) => {
    e.preventDefault();
    const emailornumber = e.target.emailornumber.value;
    const pin = e.target.pin.value;
    const userinfo = { emailornumber, pin };
    try {
      const { data } = await commonAxios.post("/login", userinfo);
      console.log(data);
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.userType);
        localStorage.setItem("email", data.email);
        // alert("Login successful");
        reloadPage();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      <div className="hero bg-base-200 min-h-screen min-w-fit ">
        <div className="hero-content flex-col">
          <div className="text-center text-lime-600 lg:text-left">
            <h1 className="text-5xl font-extrabold text-lime-600 text-center">
              SignIn
            </h1>
            <p>Signup your Xcash account?</p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form onSubmit={login} className="card-body text-lime-600">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lime-600 font-bold text-base">
                    Email/Number
                  </span>
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
                  <span className="label-text  text-lime-600 font-bold text-base">
                    PIN
                  </span>
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
                <button className="btn text-base hover:bg-cyan-300 text-lime-100 bg-lime-600 rounded-b-2xl font-extrabold">
                  Login
                </button>
              </div>
              <p>
                Are you new?{" "}
                <Link className=" text-blue-800 font-bold" to="/registration">
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
