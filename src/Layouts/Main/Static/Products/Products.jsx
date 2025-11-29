import { HeadProvider, Title } from "react-head";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";
import { Button } from "@mui/material";
import { FaCartPlus } from "react-icons/fa6";
import MainContext from "../../../../Context/MainContext";
import { toast } from "react-toastify";

const Products = () => {
  const AxiosPublic = useAxiosPublic();
  const { name: categoryName } = useParams();
  const [sortType, setSortType] = useState("");
  console.log(categoryName);
  const navigate = useNavigate();
  const { addToCart } = useContext(MainContext);

  const {
    data: products = [],
    isLoading,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products", categoryName],
    queryFn: async () => {
      const res = await AxiosPublic.get(
        categoryName.toLowerCase() == "all"
          ? "/products"
          : `/products?category=${categoryName}`
      );
      return res.data;
    },
    retry: 3,
    retryDelay: 2000,
  });

  // sorting logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortType === "latest") {
      return new Date(b.postedDate) - new Date(a.postedDate);
    }
    if (sortType === "price-low-high") {
      return a.discountedPrice - b.discountedPrice;
    }
    if (sortType === "price-high-low") {
      return b.discountedPrice - a.discountedPrice;
    }
    if (sortType === "discount") {
      return b.discount - a.discount;
    }
    return 0; // default
  });

  useEffect(() => {
    console.log(sortType);
  }, [sortType]);

  return (
    <div className="flex flex-col items-center gap-5 w-full mt-5 sm:px-10 px-5">
      <HeadProvider>
        <Title>Products || Sinthia Kitchen Shop</Title>
      </HeadProvider>

      <h2 className="lg:text-4xl md:text-3xl text-2xl font-bold text-start w-full">
        {categoryName
          ? `${decodeURIComponent(categoryName)} Products`
          : "All Products"}
      </h2>

      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 w-full">
        {/* Filter Buttons */}
        <div className="col-span-1 flex flex-col gap-3 items-center justify-start font-medium border p-5 rounded-lg h-full">
          <h4 className="text-xl font-semibold text-start w-full italic">
            Filters
          </h4>
          <button
            onClick={() => setSortType("latest")}
            className={`px-3 py-2 rounded-lg border w-full ${
              sortType === "latest"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setSortType("price-low-high")}
            className={`px-3 py-2 rounded-lg border w-full ${
              sortType === "price-low-high"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            Price: Low → High
          </button>
          <button
            onClick={() => setSortType("price-high-low")}
            className={`px-3 py-2 rounded-lg border w-full ${
              sortType === "price-high-low"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            Price: High → Low
          </button>
          <button
            onClick={() => setSortType("discount")}
            className={`px-3 py-2 rounded-lg border w-full ${
              sortType === "discount"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            Best Discount
          </button>
          <button
            onClick={() => setSortType("")}
            className={`px-3 py-2 rounded-lg border w-full ${
              sortType === ""
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            All Products
          </button>
        </div>
        {/* Products */}
        <div className="lg:col-span-3 md:col-span-2 col-span-1 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 items-start justify-center">
          {isLoading ? (
            <BounceLoader
              className="mx-auto"
              color="#000"
              size={50}
            ></BounceLoader>
          ) : sortedProducts.length > 0 ? (
            sortedProducts.map((p) => (
              <div
                data-aos="fade-up"
                key={p._id}
                className="border rounded-lg shadow hover:shadow-lg duration-300 p-3 flex flex-col gap-2 h-full justify-between"
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
                    <span className="line-through text-gray-400">
                      ৳{p.price}
                    </span>
                  )}
                </div>
                {p.discount > 0 && (
                  <span className="text-sm font-medium text-red-500">
                    -{p.discount}%
                  </span>
                )}
                {p.inStock == false ? (
                  <p className="text-red-600 font-semibold text-lg h-full">
                    Out of Stock
                  </p>
                ) : (
                  <div className="w-full flex items-center gap-4">
                    {/* Buy Now */}
                    <Button
                      onClick={() => {
                        addToCart(p);
                        toast.success(`${p.name} added to cart!`, {
                          position: "top-right",
                          autoClose: 2000,
                          draggable: true,
                        });
                        navigate("/cart");
                      }}
                      type="button"
                      className="w-full mx-auto py-2 rounded-md border-2 text-white! shadow-gray-400/90 bg-gradient-to-tr from-orange-500 to-gray-500 transition-all duration-300 hover:to-emerald-500 hover:shadow-md"
                    >
                      <p className="text-lg font-bold py-1">BUY NOW</p>
                    </Button>
                    {/* Add to Cart */}
                    <button
                      onClick={() => {
                        toast.success(`${p.name} added to cart!`, {
                          position: "top-right",
                          autoClose: 2000,
                          draggable: true,
                        });
                        addToCart(p);
                      }}
                      className="hover:text-green-700 duration-300"
                    >
                      <FaCartPlus className="text-3xl"></FaCartPlus>
                    </button>
                  </div>
                )}

                <Link
                  to={`/product/${p._id}`}
                  className="w-full mx-auto py-2 rounded-md border-2 text-white! shadow-gray-400/90 bg-gradient-to-tr from-black to-gray-500 transition-all duration-300 hover:to-cyan-500 hover:shadow-md"
                >
                  <p className="text-lg font-bold py-1 text-center">
                    VIEW MORE
                  </p>
                </Link>
              </div>
            ))
          ) : (
            <p className="py-10 text-center font-medium w-full lg:col-span-3 md:col-span-2 col-span-1">
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
