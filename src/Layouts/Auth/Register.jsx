import { useContext, useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import MainContext from "../../Context/MainContext";
import { toast } from "react-toastify";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import Button from "@mui/material/Button";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import { HeadProvider, Title } from "react-head";

const image_API = `https://api.imgbb.com/1/upload?key=${
  import.meta.env.VITE_IMG_HOSTING_API
}`;
const cloudinary_API = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
}/image/upload`;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [imageManualField, setImageManualField] = useState(false);

  const AxiosPublic = useAxiosPublic();
  const {
    handleRegisterEmailPassword,
    setUser,
    setUserName,
    setUserImage,
    handleGoogle,
  } = useContext(MainContext);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(password);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const target = e.target;
    const name = target.name.value;
    const email = target.email.value;
    let image = null;
    const password = target.password.value;
    let imageURL = null;
    const role = "none";

    if (!imageManualField) {
      image = target.image?.files?.[0] || null;
    } else {
      imageURL = target.imageURL?.value?.trim();
    }

    if (!validatePassword(password)) {
      toast.info(
        "Password must be at least 6 characters, include a number, uppercase, lowercase & special char.",
        { position: "top-right", autoClose: 3000 }
      );
      return;
    }

    let finalImageUrl = "";

    if (image) {
      // ---- Try Imgbb ----
      try {
        const imgFile = new FormData();
        imgFile.append("image", image);

        const res = await AxiosPublic.post(image_API, imgFile, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        finalImageUrl = res?.data?.data?.url;
      } catch (imgbbErr) {
        console.warn("ImgBB failed, trying Cloudinary...");

        // ---- Try Cloudinary ----
        try {
          const data = new FormData();
          data.append("file", image);
          data.append(
            "upload_preset",
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
          );

          const res = await AxiosPublic.post(cloudinary_API, data, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (res?.data?.secure_url) {
            finalImageUrl = res.data.secure_url;
          } else {
            throw new Error("Cloudinary upload failed");
          }
        } catch (cloudErr) {
          console.error("Cloudinary also failed:", cloudErr);
          setImageManualField(true);
          toast.warn("Image upload failed. Please provide direct image URL.");
          return;
        }
      }
    } else if (imageURL) {
      finalImageUrl = imageURL;
    }

    if (!finalImageUrl) {
      toast.warn("No image URL found.");
      return;
    }

    // ---- Proceed with Firebase registration ----
    const userData = { name, email, image: finalImageUrl, role };

    handleRegisterEmailPassword(email, password)
      .then(async (userCredential) => {
        updateProfile(userCredential.user, {
          displayName: name,
          photoURL: finalImageUrl,
        });
        setUser(userCredential.user);
        setUserName(name);
        setUserImage(finalImageUrl);

        await AxiosPublic.post(
          "/jwt",
          { email: userCredential?.user?.email },
          { withCredentials: true }
        );

        sendEmailVerification(userCredential.user).then(() => {
          toast.info("Verification email sent. Please check your inbox.", {
            position: "top-right",
            autoClose: 2000,
          });
          AxiosPublic.post("/users", userData);
        });
        target.reset();
        navigate("/");
      })
      .catch((error) => {
        toast.error(`Registration Error: ${error.message}`, {
          position: "top-right",
          autoClose: 2000,
        });
      });
  };

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

      toast.success("Registration Successful", {
        position: "top-right",
        autoClose: 2000,
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
        AxiosPublic.post("/users", userData);
      }
      navigate("/");
    } catch (error) {
      toast.error(`Google Registration Error: ${error.message}`, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center sm:gap-5 gap-2 px-5">
      <HeadProvider>
        <Title>Register || Sinthia Kitchen Shop</Title>
      </HeadProvider>

      <div className="flex flex-col gap-1 items-center md:mt-8 mt-4">
        <h3 className="md:text-4xl text-2xl italic font-semibold">Register</h3>
        <p className="text-base font-medium text-purple-500">
          Join us to store and view your order details.
        </p>
      </div>

      <Divider orientation="horizontal" variant="middle" flexItem />

      <div className="flex flex-col gap-4 lg:w-3/5 md:w-8/12 sm:w-10/12">
        <form
          onSubmit={handleFormSubmit}
          className="flex flex-col justify-center gap-4 mt-4 w-full"
        >
          <div className="flex md:flex-nowrap flex-wrap items-center gap-4">
            <TextField
              name="name"
              className="w-full"
              type="text"
              label="Name"
              variant="outlined"
              autoComplete="name"
              required
            />
            <TextField
              name="email"
              className="w-full"
              type="email"
              label="Email"
              variant="outlined"
              autoComplete="email"
              required
            />
          </div>

          <div className="flex items-center">
            {!imageManualField ? (
              <TextField
                name="image"
                className="w-full"
                type="file"
                label="Image"
                variant="filled"
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start"></InputAdornment>
                    ),
                  },
                }}
              />
            ) : (
              <TextField
                name="imageURL"
                className="w-full"
                type="url"
                label="Please Add a Direct Image URL"
                variant="outlined"
                autoComplete="imageURL"
                required
              />
            )}
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
                />
              ) : (
                <MdVisibility
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-4 right-3 text-2xl z-40 cursor-pointer"
                />
              )}
            </div>
          </div>

          <div className="w-full flex flex-col items-center">
            <Button
              type="submit"
              className="w-full md:w-1/2 mx-auto py-2 rounded-md border-2 text-white! shadow-gray-400/90 bg-gradient-to-tr from-purple-500 to-gray-500 transition-all duration-300 hover:to-cyan-500 hover:shadow-md"
            >
              <p className="text-lg font-semibold py-1">Register</p>
            </Button>
          </div>
        </form>

        <p className="text-xl font-bold text-center">or</p>

        <button
          onClick={handleGoogleMethod}
          className="w-full md:w-1/2 mx-auto border-2 border-cyan-500 bg-white rounded-md text-xl font-semibold transition hover:shadow-md shadow-gray-400/90 hover:border-cyan-600 py-2 flex items-center justify-center gap-2 text-black"
        >
          <FcGoogle className="text-2xl" /> Google
        </button>

        <p className="font-medium text-lg flex items-center gap-1">
          Already have an account?{" "}
          <Link
            className="text-cyan-600 hover:text-green-700 duration-300 font-bold"
            to={"/login"}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
