import { useContext, useState } from "react";
import MainContext from "../../../../Context/MainContext";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { LuPencilLine, LuPencilOff } from "react-icons/lu";
import { Button, InputAdornment, TextField } from "@mui/material";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import PropTypes from "prop-types";

const SingleBanner = ({
  BId,
  index,
  image,
  postedBy,
  modifiedBy,
  refetchImages,
}) => {
  const { user } = useContext(MainContext);
  const [bIndex, setBIndex] = useState(index);
  const [bImage, setBImage] = useState(image);
  const [isDisableForm, setIsDisableForm] = useState(true);
  const AxiosSecure = useAxiosSecure();
  const AxiosPublic = useAxiosPublic();

  const uploadImage = async (imageFile) => {
    console.log(imageFile);
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
      setBImage(image);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong during upload!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedBanner = {
      index: Number(bIndex),
      image: bImage,
      modifiedBy: user?.email,
    };
    const res = await AxiosSecure.put(`/settings/banner/${BId}`, updatedBanner);
    if (res.data.success) {
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 2000,
        draggable: true,
      });
      setIsDisableForm(true);
      refetchImages();
    } else {
      toast.error(res.data.message || "Update failed", {
        position: "top-right",
        autoClose: 3000,
        draggable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    console.log("delete", id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await AxiosSecure.delete(`/settings/${id}`);
          if (res.data.success) {
            Swal.fire("Deleted!", res.data.message, "success");
            toast.success("Banner deleted successfully", {
              position: "top-right",
              autoClose: 2000,
              draggable: true,
            });
            refetchImages();
          } else {
            toast.error(res.data.message || "Delete failed", {
              position: "top-right",
              autoClose: 3000,
              draggable: true,
            });
          }
        } catch {
          toast.error("Something went wrong!", {
            position: "top-right",
            autoClose: 3000,
            draggable: true,
          });
        }
      }
    });
  };

  return (
    <div
      key={BId}
      className="max-w-sm w-full border p-3 rounded-lg mx-auto flex flex-col items-center gap-5"
    >
      <img src={bImage} alt="image" />
      <form className="flex flex-col gap-3" onSubmit={handleUpdate}>
        <h3 className="text-lg font-semibold">Update Image:</h3>
        <TextField
          value={bIndex}
          onChange={(e) => {
            if (!isDisableForm) setBIndex(e.target.value);
          }}
          type="number"
          inputMode="numeric"
          label="Banner Index"
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
          onChange={(e) => {
            if (!isDisableForm) uploadImage(e.target.files[0]);
          }}
          type="file"
          label="Banner Image"
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            },
          }}
        ></TextField>
        <TextField
          value={postedBy}
          type="email"
          label="Posted By"
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            },
          }}
        ></TextField>
        <TextField
          value={isDisableForm ? modifiedBy : user?.email}
          type="text"
          label="Modified By"
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start"></InputAdornment>
              ),
            },
          }}
        ></TextField>
        <div className="w-full mt-3 flex items-center gap-5">
          <Button
            type="submit"
            className={`w-full mx-auto py-2 rounded-md border-2 text-white! shadow-gray-400/90 ${
              isDisableForm
                ? "bg-gradient-to-tr from-gray-500 to-gray-700"
                : "bg-gradient-to-tr from-green-500 to-green-700 transition-all duration-300 hover:to-gray-600 hover:shadow-md"
            }`}
            disabled={isDisableForm}
          >
            <p className="text-lg font-semibold py-1">Update</p>
          </Button>
          {!isDisableForm && (
            <button
              className="text-black text-xl hover:text-green-500 duration-300 p-2 rounded-full border-2"
              onClick={() => {
                setBIndex(index);
                setBImage(image);
                setIsDisableForm(true);
              }}
            >
              <LuPencilOff></LuPencilOff>
            </button>
          )}
        </div>
      </form>
      <div className="w-full mt-3 flex items-center gap-5">
        <Button
          onClick={() => handleDelete(BId)}
          type="submit"
          className={`w-full mx-auto py-2 rounded-md border-2 text-white! shadow-gray-400/90 ${
            !isDisableForm
              ? "bg-gradient-to-tr from-gray-500 to-gray-700"
              : "bg-gradient-to-tr from-red-500 to-red-700 transition-all duration-300 hover:to-gray-600 hover:shadow-md"
          }`}
          disabled={!isDisableForm}
        >
          <p className="text-lg font-semibold py-1">Delete</p>
        </Button>
        {isDisableForm && (
          <button
            className="text-black text-xl hover:text-green-500 duration-300 p-2 rounded-full border-2"
            onClick={() => setIsDisableForm(false)}
          >
            <LuPencilLine></LuPencilLine>
          </button>
        )}
      </div>
    </div>
  );
};

SingleBanner.propTypes = {
  BId: PropTypes.string.isRequired,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  image: PropTypes.string.isRequired,
  postedBy: PropTypes.string.isRequired,
  modifiedBy: PropTypes.string.isRequired,
  refetchImages: PropTypes.func.isRequired,
};

export default SingleBanner;
