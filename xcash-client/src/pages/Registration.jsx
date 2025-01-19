import { Link, useNavigate } from "react-router-dom";
import useCommonAxios from "../hooks/useCommonAxios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const Registration = () => {
  const commonAxios = useCommonAxios();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  // Load saved name from localStorage when component mounts
  useEffect(() => {
    const savedName = localStorage.getItem("name");
    if (savedName) {
      setName(savedName);
    }
  }, []);

  // Save to localStorage
  const saveToLocalStorage = (name, pin, number, email, userType) => {
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("pin", pin);
    localStorage.setItem("userType", userType);
    localStorage.setItem("number", number);
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (info) => {
      const { data } = await commonAxios.post("/register", info);
      return data;
    },
    onSuccess: () => {
      console.log("User Create Succesful");
      toast.success("User Create Succesful");
      navigate("/");
    },
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const pin = form.pin.value;
    const number = form.number.value;
    const balance = 0;
    const status = "requested";
    const userType = form.selection.value ;
    console.log( name, pin, number, email, userType);
    try {
      const info = { name, pin, number, email, userType ,status,balance };
      mutateAsync(info);
    } catch (err) {
      console.log(err);

      toast.error(err.message);
    }
  };
  return (
    <div>
      <div className="hero bg-base-200 min-h-screen min-w-fit">
        <div className="hero-content flex-col">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-lime-600 ">Registration Now</h1>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form onSubmit={handleRegister} className="card-body text-lime-600">
              <div className="form-control">
                <label className="label">
                  <span className="label-text  text-lime-600 font-bold text-base">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="name"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text  text-lime-600 font-bold text-base">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text  text-lime-600 font-bold text-base">Number</span>
                </label>
                <input
                  type="number"
                  name="number"
                  placeholder="Number"
                  className="input input-bordered"
                  required
                />
              </div>
              <div>
                <select name="selection" id="selection"   className="select select-info w-full max-w-xs">
                  <option disabled selected>
                    Select Role
                  </option>
                  <option>user</option>
                  <option>agent</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text  text-lime-600 font-bold text-base">PIN</span>
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
                <button className="btn text-base hover:bg-cyan-300 text-lime-100 bg-lime-600 rounded-b-2xl font-extrabold">Register</button>
              </div>
              <p>
                Already have an account?{" "}
                <Link className=" text-blue-800 font-bold" to="/">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
