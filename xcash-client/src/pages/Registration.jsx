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
      const { data } = await commonAxios.post("/adduser", info);
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
      saveToLocalStorage(name, pin, number, email, userType, status ,balance);
    } catch (err) {
      console.log(err);

      toast.error(err.message);
    }
  };
  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold">Registration Now</h1>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form onSubmit={handleRegister} className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
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
                  <span className="label-text">Email</span>
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
                  <span className="label-text">Number</span>
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
                <button className="btn btn-primary">Register</button>
              </div>
              <p>
                Already have an account?{" "}
                <Link className=" text-blue-400" to="/">
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
