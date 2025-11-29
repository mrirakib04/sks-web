import { HeadProvider, Title } from "react-head";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { BounceLoader } from "react-spinners";
import { Link } from "react-router";
import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const AllProducts = () => {
  const AxiosSecure = useAxiosSecure();
  const [sortType, setSortType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: products = [],
    isLoading,
    refetch: refetchAdminProducts,
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await AxiosSecure.get("/admin/products");
      return res.data;
    },
    retry: 3,
    retryDelay: 2000,
  });

  console.log(products);

  // Filtering + Sorting + Searching
  const filteredProducts = useMemo(() => {
    let data = [...products];

    // search filter
    if (searchTerm.trim()) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // sorting
    if (sortType === "latest") {
      data.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    } else if (sortType === "price-low-high") {
      data.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (sortType === "price-high-low") {
      data.sort((a, b) => b.discountedPrice - a.discountedPrice);
    } else if (sortType === "discount") {
      data.sort((a, b) => b.discount - a.discount);
    }

    return data;
  }, [products, sortType, searchTerm]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await AxiosSecure.delete(`/admin/products/delete/${id}`);
          if (res.data.success) {
            Swal.fire("Deleted!", "Product has been deleted.", "success");
            // refresh
            refetchAdminProducts();
          } else {
            Swal.fire("Error!", res.data.error || "Failed to delete.", "error");
          }
        } catch (err) {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full mt-5 sm:px-10 px-5">
      <HeadProvider>
        <Title>Products || Admin || SKS</Title>
      </HeadProvider>

      <h2 className="lg:text-4xl md:text-3xl text-2xl font-bold text-start w-full">
        All Products (Admin)
      </h2>

      {/* Search + Filters */}
      <div className="w-full flex flex-col md:flex-row items-center gap-3 justify-between border p-4 rounded-lg bg-gray-50">
        {/* SearchBar */}
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full lg:w-1/3 md:w-5/12 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 justify-center">
          <button
            onClick={() => setSortType("latest")}
            className={`px-3 py-2 rounded-lg border ${
              sortType === "latest"
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-200"
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setSortType("price-low-high")}
            className={`px-3 py-2 rounded-lg border ${
              sortType === "price-low-high"
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-200"
            }`}
          >
            Price: Low → High
          </button>
          <button
            onClick={() => setSortType("price-high-low")}
            className={`px-3 py-2 rounded-lg border ${
              sortType === "price-high-low"
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-200"
            }`}
          >
            Price: High → Low
          </button>
          <button
            onClick={() => setSortType("discount")}
            className={`px-3 py-2 rounded-lg border ${
              sortType === "discount"
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-200"
            }`}
          >
            Best Discount
          </button>
          <button
            onClick={() => {
              setSortType("");
              setSearchTerm("");
            }}
            className="px-3 py-2 rounded-lg border bg-red-500 text-white hover:bg-red-700"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Products */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 items-start justify-center w-full">
        {isLoading ? (
          <BounceLoader className="mx-auto" color="#000" size={50} />
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div
              key={p._id}
              data-aos="fade-up"
              className="border rounded-lg shadow hover:shadow-lg duration-300 p-3 flex flex-col gap-2 bg-white h-full"
            >
              <img
                src={p.images[0]}
                alt={p.name}
                className="w-full h-40 object-cover rounded shadow"
              />
              <h3 className="font-semibold text-lg">{p.name}</h3>
              <p className="text-gray-600 text-sm">{p.category}</p>

              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">
                  ৳{p.discountedPrice}
                </span>
                {p.discount > 0 && (
                  <span className="line-through text-gray-400">৳{p.price}</span>
                )}
              </div>

              {p.discount > 0 && (
                <span className="text-sm font-medium text-red-500">
                  -{p.discount}%
                </span>
              )}

              {/* Extra Admin Info */}
              <div className="mt-2 text-sm text-gray-700 flex flex-col gap-1">
                <p>
                  <strong>Posted By:</strong> {p.postedBy || "N/A"}
                </p>
                <p>
                  <strong>Posted Date:</strong>{" "}
                  {p.postedDate
                    ? new Date(p.postedDate).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Updated By:</strong>{" "}
                  {p.updatedBy !== "none" ? p.updatedBy : "N/A"}
                </p>
                <p>
                  <strong>Updated Date:</strong>{" "}
                  {p.updatedDate !== "none"
                    ? new Date(p.updatedDate).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              {p.inStock == false ? (
                <p className="text-red-600 font-semibold text-lg h-full">
                  Out of Stock
                </p>
              ) : (
                <p className="text-green-600 text-lg font-semibold h-full">
                  In Stock
                </p>
              )}
              <div className="flex items-center gap-3 w-full">
                <Link
                  to={`/admin/product/edit/${p._id}`}
                  className="w-full mx-auto py-2 rounded-md border-2 text-white! shadow-gray-400/90 bg-gradient-to-tr from-green-700 to-gray-500 transition-all duration-300 hover:to-cyan-500 hover:shadow-md"
                >
                  <p className="text-lg font-bold py-1 text-center">EDIT</p>
                </Link>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-3xl text-red-600 hover:text-red-800 duration-300"
                >
                  <FaTrashAlt></FaTrashAlt>
                </button>
              </div>
              <Link
                to={`/product/${p._id}`}
                className="w-full mx-auto py-2 rounded-md border-2 text-white! shadow-gray-400/90 bg-gradient-to-tr from-black to-gray-500 transition-all duration-300 hover:to-cyan-500 hover:shadow-md"
              >
                <p className="text-lg font-bold py-1 text-center">VIEW MORE</p>
              </Link>
            </div>
          ))
        ) : (
          <p className="py-10 text-center font-medium w-full col-span-3">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
