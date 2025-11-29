import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { HeadProvider, Title } from "react-head";
import { useContext } from "react";
import MainContext from "../../../Context/MainContext";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import InputAdornment from "@mui/material/InputAdornment";
import Category from "./SettingsComponents/Category";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import SingleBanner from "./SettingsComponents/SingleBanner";

const Settings = () => {
  const { user } = useContext(MainContext);
  const AxiosSecure = useAxiosSecure();
  const AxiosPublic = useAxiosPublic();
  console.log(user?.email);

  // Category controls
  const { data: categories = [], refetch: refetchCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await AxiosSecure.get(`settings/category`);
      return res.data;
    },
    retry: 3,
    retryDelay: 2000,
  });
  console.log(categories);
  const categoryPost = async (e) => {
    e.preventDefault();
    const target = e.target;
    const index = Number(target.index.value);
    const name = target.name.value;
    const settingFor = "category";
    const postedBy = user?.email;
    const modifiedBy = "none";

    const newCategory = { index, name, settingFor, postedBy, modifiedBy };
    console.log(newCategory);

    const res = await AxiosSecure.post("/settings/category", newCategory);

    if (res.data.insertedId) {
      toast.success("Category added successfully!", {
        position: "top-right",
        autoClose: 2000,
        draggable: true,
      });
      target.reset();
      refetchCategories();
    } else {
      toast.error(res.data.message || "Failed to add category", {
        position: "top-right",
        autoClose: 3000,
        draggable: true,
      });
    }
  };
  // Banner Controls
  const { data: bannerImages = [], refetch: refetchImages } = useQuery({
    queryKey: ["bannerImages"],
    queryFn: async () => {
      const res = await AxiosSecure.get(`settings/banner`);
      return res.data;
    },
    retry: 3,
    retryDelay: 2000,
  });
  const bannerPost = async (e) => {
    e.preventDefault();
    const target = e.target;

    const index = Number(target.index.value);
    const imageFile = target.imageFile.files[0];
    const settingFor = "banner";
    const postedBy = user?.email;
    const modifiedBy = "none";

    // File upload
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const uploadRes = await AxiosPublic.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        formData
      );

      const image = uploadRes.data.secure_url;
      console.log(uploadRes);

      // Final object for DB
      const newBanner = {
        index,
        image,
        settingFor,
        postedBy,
        modifiedBy,
      };

      // Post to your backend
      const res = await AxiosSecure.post("/settings/banner", newBanner);

      if (res.data.insertedId) {
        toast.success("Banner uploaded successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
        target.reset();
        refetchImages();
      } else {
        toast.error(res.data.message || "Failed to upload banner", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong during upload!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 mt-5 px-5">
      <HeadProvider>
        <Title>Settings || Admin || SKS</Title>
      </HeadProvider>
      <nav className="w-full">
        <ul className="flex mx-auto max-w-xl py-5 w-full items-center justify-center gap-5 font-medium text-lg border px-5 overflow-x-scroll">
          <li>
            <a className="hover:text-cyan-600 duration-300" href="#category">
              Category
            </a>
          </li>
          <li>
            <a className="hover:text-cyan-600 duration-300" href="#banner">
              Banner
            </a>
          </li>
        </ul>
      </nav>
      <div
        id="category"
        className="w-full flex flex-col items-center gap-5 pt-20"
      >
        <h2 className="lg:text-4xl md:text-3xl text-2xl font-bold text-left w-full mb-5">
          Category Management
        </h2>
        <div className="w-full grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 justify-center items-start">
          <form
            className="max-w-sm w-full mx-auto border p-3 rounded-lg flex flex-col gap-3"
            onSubmit={categoryPost}
          >
            <h3 className="text-lg font-semibold">Add New Category:</h3>
            <TextField
              name="index"
              className="w-full"
              type="number"
              inputMode="numeric"
              label="Category Index"
              variant="outlined"
              autoComplete="index"
              required
            ></TextField>
            <TextField
              name="name"
              className="w-full"
              type="text"
              label="Category Name"
              variant="outlined"
              autoComplete="category"
              required
            ></TextField>
            <TextField
              name="email"
              className="w-full"
              type="email"
              label="Posted By"
              variant="outlined"
              defaultValue={user?.email}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                },
              }}
            ></TextField>
            <Button
              type="submit"
              className="w-full mx-auto py-2 rounded-md border-2 text-white! shadow-gray-400/90 bg-gradient-to-tr from-purple-500 to-purple-700 transition-all duration-300 hover:to-gray-600 hover:shadow-md"
            >
              <p className="text-lg font-semibold py-1">Add Category</p>
            </Button>
          </form>
          {categories?.map((category) => (
            <Category
              key={category._id}
              cId={category._id}
              index={category.index}
              name={category.name}
              postedBy={category.postedBy}
              modifiedBy={category.modifiedBy}
              refetchCategories={refetchCategories}
            ></Category>
          ))}
        </div>
      </div>
      <div
        id="banner"
        className="w-full flex flex-col items-center gap-5 pt-20"
      >
        <h2 className="lg:text-4xl md:text-3xl text-2xl font-bold text-left w-full mb-5">
          Banner Management
        </h2>
        <div className="w-full grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 justify-center items-start">
          <form
            className="max-w-sm w-full mx-auto border p-3 rounded-lg flex flex-col gap-3"
            onSubmit={bannerPost}
          >
            <h3 className="text-lg font-semibold">Add New Image:</h3>
            <TextField
              name="index"
              className="w-full"
              type="number"
              inputMode="numeric"
              label="Image Index"
              variant="outlined"
              autoComplete="index"
              required
            ></TextField>
            <TextField
              name="imageFile"
              className="w-full"
              type="file"
              label="Image File"
              variant="outlined"
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                },
              }}
            ></TextField>
            <TextField
              name="email"
              className="w-full"
              type="email"
              label="Posted By"
              variant="outlined"
              defaultValue={user?.email}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                },
              }}
            ></TextField>
            <Button
              type="submit"
              className="w-full mx-auto py-2 rounded-md border-2 text-white! shadow-gray-400/90 bg-gradient-to-tr from-purple-500 to-purple-700 transition-all duration-300 hover:to-gray-600 hover:shadow-md"
            >
              <p className="text-lg font-semibold py-1">Add Image</p>
            </Button>
          </form>
          {bannerImages?.map((image) => (
            <SingleBanner
              key={image._id}
              BId={image._id}
              index={image.index}
              image={image.image}
              postedBy={image.postedBy}
              modifiedBy={image.modifiedBy}
              refetchImages={refetchImages}
            ></SingleBanner>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
