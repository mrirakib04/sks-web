import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { useContext } from "react";
import MainContext from "../../../Context/MainContext";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button, Divider, TextField } from "@mui/material";
import { HeadProvider, Title } from "react-head";
import { Typewriter } from "react-simple-typewriter";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const AxiosSecure = useAxiosSecure();
  const AxiosPublic = useAxiosPublic();
  const { user } = useContext(MainContext);

  // fetch product by id
  const { data: product, isLoading } = useQuery({
    queryKey: ["admin-product", id],
    queryFn: async () => {
      const res = await AxiosSecure.get(`/admin/product/get/${id}`);
      return res.data;
    },
  });

  // fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await AxiosSecure.get(`settings/category`);
      return res.data;
    },
  });

  // upload single image
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
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
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed!");
      return null;
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value;
    const description = form.description.value;
    const price = parseFloat(form.price.value);
    const discount = parseInt(form.discount.value);
    const category = form.category.value;
    const discountedPrice = Math.round(price - price * (discount / 100));
    const inStock = form.inStock.value === "true";

    const file1 = form.image1.files[0];
    const file2 = form.image2.files[0];
    const file3 = form.image3.files[0];

    let uploadedImages = [...product.images];

    if (file1 || file2 || file3) {
      toast.info("Uploading new images...");
      uploadedImages = [];

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
    }

    const updatedProduct = {
      name,
      description,
      price,
      discount,
      category,
      discountedPrice,
      images: uploadedImages,
      updatedBy: user.email,
      inStock,
    };

    try {
      const res = await AxiosSecure.put(
        `/admin/products/update/${id}`,
        updatedProduct
      );
      if (res.data.success) {
        toast.success("Product updated successfully!");
        navigate("/admin/products");
      } else {
        toast.error(res.data.error || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (!product) return <p className="text-center py-10">Product not found</p>;

  return (
    <div className="w-full flex flex-col gap-5 items-center mt-5 px-5">
      <HeadProvider>
        <Title>Edit Product || Admin || SKS</Title>
      </HeadProvider>
      <h3 className="md:text-4xl text-2xl italic font-semibold flex items-center gap-2">
        Edit
        <span className="text-purple-700">
          <Typewriter
            words={["Product"]}
            cursor
            loop={false}
            delaySpeed={500}
            deleteSpeed={200}
          ></Typewriter>
        </span>
      </h3>

      <div className="py-5 w-full max-w-5xl mx-auto">
        <Divider></Divider>
      </div>

      <form
        onSubmit={handleUpdate}
        className="flex flex-col items-center gap-5 max-w-4xl w-full p-5"
      >
        <div className="w-full flex sm:flex-nowrap flex-wrap items-center gap-5">
          <TextField
            name="name"
            className="w-full"
            type="text"
            label="Name"
            defaultValue={product.name}
            required
            fullWidth
          ></TextField>
          <fieldset className="w-full border border-gray-300 rounded-lg">
            <legend className="px-1 text-sm text-gray-600">Category</legend>
            <select
              name="category"
              className="w-full p-2 outline-none bg-transparent"
              defaultValue={product.category}
            >
              {categories.map((c) => (
                <option key={c._id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </fieldset>
        </div>

        <TextField
          name="description"
          className="w-full"
          type="text"
          label="Description"
          multiline
          rows={6}
          defaultValue={product.description}
          required
          fullWidth
        ></TextField>

        <div className="w-full flex sm:flex-nowrap flex-wrap items-center gap-5">
          <TextField
            name="price"
            type="number"
            label="Price"
            defaultValue={product.price}
            required
            fullWidth
          ></TextField>
          <TextField
            name="discount"
            type="number"
            label="Discount (%)"
            defaultValue={product.discount}
            required
            fullWidth
          ></TextField>
        </div>
        {/* In Stock Option */}
        <div className="w-full flex items-center gap-3">
          <label className="font-medium w-fit text-nowrap">In Stock:</label>
          <select
            name="inStock"
            defaultValue={product.inStock ? "true" : "false"}
            className="border rounded-lg p-2 w-full"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Image upload */}
        <div className="w-full flex flex-col gap-3">
          <p className="font-medium">Update Images (optional):</p>
          <input
            className="py-2 px-3 border rounded-lg"
            type="file"
            name="image1"
          />
          <input
            className="py-2 px-3 border rounded-lg"
            type="file"
            name="image2"
          />
          <input
            className="py-2 px-3 border rounded-lg"
            type="file"
            name="image3"
          />
          <div className="flex gap-3 mt-2">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="preview"
                className="h-20 w-20 object-cover rounded"
              />
            ))}
          </div>
        </div>

        <div className="w-full sm:w-1/2 mx-auto">
          <Button
            type="submit"
            className="w-full py-2! rounded-md text-white! font-bold! text-lg! bg-gradient-to-tr from-purple-500 to-emerald-700 hover:to-gray-600"
          >
            Update Product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
