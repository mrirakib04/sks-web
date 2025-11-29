import { HeadProvider, Title } from "react-head";
import { Typewriter } from "react-simple-typewriter";
import { Button, Divider, InputAdornment, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useContext } from "react";
import MainContext from "../../../Context/MainContext";

const AddProduct = () => {
  const AxiosSecure = useAxiosSecure();
  const AxiosPublic = useAxiosPublic();
  const { user } = useContext(MainContext);
  const { data: categories = [], refetch: refetchCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await AxiosSecure.get(`settings/category`);
      return res.data;
    },
    retry: 3,
    retryDelay: 2000,
  });
  console.log("ccc", categories);

  // Upload single image to Cloudinary
  const uploadImage = async (imageFile) => {
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
      return uploadRes.data.secure_url;
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed!");
      return null;
    }
  };

  // Post Product
  const postProduct = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value;
    const description = form.description.value;
    const price = parseFloat(form.price.value);
    const discount = parseInt(form.discount.value);
    const category = form.category.value;
    const discountedPrice = Math.round(price - price * (discount / 100));
    const postedBy = user.email;
    const postedDate = new Date();
    const updatedBy = "none";
    const updatedDate = "none";

    const file1 = form.image1.files[0];
    const file2 = form.image2.files[0];
    const file3 = form.image3.files[0];

    if (!file1) {
      toast.error("Image-1 is required!");
      return;
    }

    toast.info("Uploading images...", {
      position: "top-right",
      autoClose: 4000,
      draggable: true,
    });

    let uploadedImages = [];

    if (file1) {
      const url1 = await uploadImage(file1);
      if (url1) uploadedImages.push(url1);
    }
    if (file2) {
      const url2 = await uploadImage(file2);
      if (url2) uploadedImages.push(url2);
    }
    if (file3) {
      const url3 = await uploadImage(file3);
      if (url3) uploadedImages.push(url3);
    }

    console.log(uploadedImages.length);

    if (uploadedImages.length === 0) {
      return toast.warn("Images didn't uploaded yet. Try again.");
    }

    const newProduct = {
      name,
      description,
      price,
      discount,
      category,
      images: uploadedImages, // Array of Cloudinary links
      discountedPrice,
      postedBy,
      postedDate,
      updatedBy,
      updatedDate,
      inStock: true,
    };
    console.log(newProduct);
    try {
      const res = await AxiosSecure.post("/products", newProduct);
      if (res.data?.insertedId) {
        toast.success("Product added successfully!", {
          position: "top-right",
          autoClose: 2000,
          draggable: true,
        });
        form.reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product!", {
        position: "top-right",
        autoClose: 3000,
        draggable: true,
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 items-center mt-5 px-5 bg-gradient-to-bl from-0% to-emerald-50 via-white from-white">
      <HeadProvider>
        <Title>Add Product || Admin || SKS</Title>
      </HeadProvider>
      <div className="flex flex-col gap-1 items-center">
        <h3 className="md:text-4xl text-2xl italic font-semibold flex items-center gap-2">
          Add
          <span className="text-purple-700">
            <Typewriter
              cursorColor="purple"
              words={["Product"]}
              loop={false}
              cursor
              cursorStyle="_"
              typeSpeed={200}
              deleteSpeed={150}
            ></Typewriter>
          </span>
        </h3>
      </div>
      <div className="py-5 w-full max-w-5xl mx-auto">
        <Divider orientation="horizontal" variant="middle" flexItem></Divider>
      </div>
      <form
        onSubmit={postProduct}
        className="flex flex-col items-center gap-5 max-w-4xl w-full p-5"
      >
        <div className="w-full flex sm:flex-nowrap flex-wrap items-center gap-5">
          <TextField
            name="name"
            className="w-full"
            type="text"
            label="Name"
            variant="outlined"
            autoComplete="name"
            required
          ></TextField>
          <fieldset className="w-full border border-gray-300 rounded-lg focus-within:border-purple-500 transition duration-200">
            <legend className="px-1 text-sm text-gray-600">Category</legend>
            <select
              name="category"
              className="w-full p-2 outline-none bg-transparent"
            >
              {categories.length > 0 &&
                categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
            </select>
          </fieldset>
        </div>
        <div className="w-full flex sm:flex-nowrap flex-wrap items-center gap-5">
          <TextField
            name="description"
            className="w-full h-full"
            type="text"
            label="Description"
            variant="outlined"
            autoComplete="description"
            multiline
            rows={8}
            required
          ></TextField>
          <div className="w-full flex flex-col items-center justify-between h-full gap-5">
            <TextField
              name="image1"
              className="w-full"
              type="file"
              label="Image-1"
              variant="filled"
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
              name="image2"
              className="w-full"
              type="file"
              label="Image-2"
              variant="filled"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                },
              }}
            ></TextField>
            <TextField
              name="image3"
              className="w-full"
              type="file"
              label="Image-3"
              variant="filled"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                },
              }}
            ></TextField>
          </div>
        </div>
        <div className="w-full flex sm:flex-nowrap flex-wrap items-center gap-5">
          <TextField
            name="price"
            className="w-full"
            type="number"
            inputMode="numeric"
            label="Price (BDT)"
            variant="outlined"
            required
            defaultValue={0}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
              },
            }}
          ></TextField>
          <TextField
            name="discount"
            className="w-full"
            type="number"
            inputMode="numeric"
            label="Discount (in percentage-%)"
            variant="outlined"
            required
            defaultValue={0}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
              },
            }}
          ></TextField>
        </div>
        <div className="w-full sm:w-1/2 mx-auto">
          <Button
            type="submit"
            className="w-full py-2 rounded-md border-2 text-white! shadow-gray-400/90 bg-gradient-to-tr from-purple-500 to-emerald-700 transition-all duration-300 hover:to-gray-600 hover:shadow-md"
          >
            <p className="text-lg font-semibold py-1">Add Product</p>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
