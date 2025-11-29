import { useContext, useState } from "react";
import { TextField, Button, InputAdornment } from "@mui/material";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import MainContext from "../../../../Context/MainContext";
import { LuPencilLine, LuPencilOff } from "react-icons/lu";
import Swal from "sweetalert2";

const Category = ({
  cId,
  index,
  name,
  postedBy,
  modifiedBy,
  refetchCategories,
}) => {
  const { user } = useContext(MainContext);
  const [cIndex, setCIndex] = useState(index);
  const [cName, setCName] = useState(name);
  const [isDisableForm, setIsDisableForm] = useState(true);
  const AxiosSecure = useAxiosSecure();

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedCategory = {
      index: Number(cIndex),
      name: cName,
      modifiedBy: user?.email,
    };
    const res = await AxiosSecure.put(
      `/settings/category/${cId}`,
      updatedCategory
    );
    if (res.data.success) {
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 2000,
        draggable: true,
      });
      setIsDisableForm(true);
      refetchCategories();
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
            toast.success("Category deleted successfully", {
              position: "top-right",
              autoClose: 2000,
              draggable: true,
            });
            refetchCategories();
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
    <div key={cId} className="max-w-sm w-full border p-3 rounded-lg mx-auto">
      <form className="flex flex-col gap-3" onSubmit={handleUpdate}>
        <h3 className="text-lg font-semibold">Update Category:</h3>
        <TextField
          value={cIndex}
          onChange={(e) => {
            if (!isDisableForm) setCIndex(e.target.value);
          }}
          type="number"
          inputMode="numeric"
          label="Category Index"
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
          value={cName}
          onChange={(e) => {
            if (!isDisableForm) setCName(e.target.value);
          }}
          type="text"
          label="Category Name"
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
                setCIndex(index);
                setCName(name);
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
          onClick={() => handleDelete(cId)}
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

Category.propTypes = {
  cId: PropTypes.string.isRequired,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  postedBy: PropTypes.string.isRequired,
  modifiedBy: PropTypes.string.isRequired,
  refetchCategories: PropTypes.func.isRequired,
};

export default Category;
