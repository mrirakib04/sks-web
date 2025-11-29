import { useContext, useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import MainContext from "../../Context/MainContext";
import { toast } from "react-toastify";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import Button from "@mui/material/Button";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import { HeadProvider, Title } from "react-head";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const AxiosPublic = useAxiosPublic();
  const {
    handleLoginEmailPassword,
    setUser,
    setUserName,
    setUserImage,
    handleGoogle,
  } = useContext(MainContext);
  const navigate = useNavigate();

  // form submit functionality
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const target = e.target;

    const email = target.email.value;
    const password = target.password.value;

    handleLoginEmailPassword(email, password)
      .then(async (userCredential) => {
        await AxiosPublic.post(
          "/jwt",
          { email: userCredential?.user?.email },
          { withCredentials: true }
        );
        setUser(userCredential.user);
        toast.success("Login Successful.", {
          position: "top-right",
          autoClose: 2000,
          closeButton: true,
          pauseOnHover: true,
          draggable: true,
        });
        target.reset();
        navigate("/");
      })
      .catch((error) => {
        toast.error(`Login Error:${error.message}`, {
          position: "top-right",
          autoClose: 2000,
          closeButton: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  // google registration
  const handleGoogleMethod = async () => {
    try {
      const result = await handleGoogle();

      setUser(result.user);
      setUserImage(result.user.photoURL);
      setUserName(result.user.displayName);

      await AxiosPublic.post(
        "/jwt",
        { email: result.user.email },
        { withCredentials: true }
      );

      toast.success(`Login Successful`, {
        position: "top-right",
        autoClose: 2000,
        closeButton: true,
        pauseOnHover: true,
        draggable: true,
      });

      const userRes = await AxiosPublic.get(`/user/${result.user.email}`);
      const existingUser = userRes.data;

      if (!existingUser) {
        const userData = {
          name: result.user.displayName,
          email: result.user.email,
          image: result.user.photoURL,
          role: "none",
        };

        AxiosPublic.post("/users", userData)
          .then((res) => {
            toast.success(`Registration Successful ${res.status}`, {
              position: "top-right",
              autoClose: 2000,
              closeButton: true,
              pauseOnHover: true,
              draggable: true,
            });
          })
          .catch((error) => {
            toast.error(`Error ${error.message}`, {
              position: "top-right",
              autoClose: 2000,
              closeButton: true,
              pauseOnHover: true,
              draggable: true,
            });
          });
      }
      navigate("/");
    } catch (error) {
      toast.error(`Google Registration Error: ${error.message}`, {
        position: "top-right",
        autoClose: 2000,
        closeButton: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center sm:gap-5 gap-2 px-5">
      <HeadProvider>
        <Title>Login || Sinthia Kitchen Shop</Title>
      </HeadProvider>
      <div className="flex flex-col gap-1 items-center md:mt-8 mt-4">
        <h3 className="md:text-4xl text-2xl italic font-semibold">Login</h3>
        <p className="text-base font-medium text-green-500">
          Login to access your details.
        </p>
      </div>
      <Divider
        className="lg:w-3/5 md:w-7/12 sm:w-9/12 w-full mx-auto!"
        orientation="horizontal"
        variant="middle"
        flexItem
      ></Divider>
      <div className="flex flex-col gap-4 lg:w-2/5 md:w-6/12 sm:w-8/12 w-full">
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col justify-center gap-4 mt-4 w-full"
        >
          <div className="flex md:flex-nowrap flex-wrap items-center gap-4">
            <TextField
              name="email"
              className="w-full"
              type="email"
              label="Email"
              variant="outlined"
              autoComplete="username"
              required
            ></TextField>
          </div>

          <div className="flex md:flex-nowrap flex-wrap items-center gap-4">
            <div className="w-full relative">
              <TextField
                name="password"
                className="w-full"
                type={showPassword ? "text" : "password"}
                label="Password"
                variant="outlined"
                autoComplete="current-password"
                required
              />
              {!showPassword ? (
                <MdVisibilityOff
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-4 right-3 text-2xl z-40 cursor-pointer"
                ></MdVisibilityOff>
              ) : (
                <MdVisibility
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-4 right-3 text-2xl z-40 cursor-pointer"
                ></MdVisibility>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col items-center">
            <Button
              type="submit"
              className="w-full mx-auto py-2 rounded-md border-2 text-white! shadow-gray-400/90 bg-gradient-to-tr from-emerald-500 to-gray-500 hover:to-cyan-600 transition-all duration-300 hover:shadow-md"
            >
              <p className="text-lg font-semibold py-1">Login</p>
            </Button>
          </div>
        </form>

        <p className="text-xl font-bold text-center">or</p>
        <button
          onClick={handleGoogleMethod}
          className="w-full mx-auto border-2 border-cyan-500 bg-white rounded-md text-xl font-semibold transition hover:shadow-md shadow-gray-400/90 hover:border-cyan-600 py-2 flex items-center justify-center gap-2 text-black"
        >
          <FcGoogle className="text-2xl"></FcGoogle>
          Google
        </button>
        <p className="font-medium text-lg flex items-center gap-1">
          New User?
          <Link
            className="text-cyan-600 hover:text-purple-700 duration-300 font-bold"
            to={"/register"}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
