import { Link } from "react-router-dom";

const Login = () => {

  const login = (e) => {
    e.preventDefault()
    const emailornumber = e.target.emailornumber.value ;
    const pin = e.target.pin.value ;
    console.log(emailornumber ,pin)
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
