import { useContext } from "react";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import MainContext from "../../../../../Context/MainContext";
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { HeadProvider, Title } from "react-head";
import { BounceLoader } from "react-spinners";
import { Button } from "@mui/material";
import { FaCartPlus } from "react-icons/fa6";
import { toast } from "react-toastify";

const HomeProducts = () => {
  const AxiosPublic = useAxiosPublic();
  const { addToCart } = useContext(MainContext);
  const navigate = useNavigate();

  // latest 8 products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["home-products"],
    queryFn: async () => {
      const res = await AxiosPublic.get("/home/products");
      return res.data;
    },
    retry: 2,
  });

  return (
    <div className="w-full py-12 bg-gray-50 flex flex-col items-center gap-8">
      <HeadProvider>
        <Title>Home || Sinthia Kitchen Shop</Title>
      </HeadProvider>

      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
        Featured Products
      </h2>
      <p className="text-gray-600 text-center max-w-xl">
        Explore our latest and most popular products. Hand-picked for you with
        the best discounts and offers.
      </p>

      {isLoading ? (
        <BounceLoader size={50} color="#000"></BounceLoader>
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 w-full px-5 max-w-7xl">
          {products.map((p) => (
            <div
              data-aos="zoom-in"
              key={p._id}
              className="border rounded-xl shadow hover:shadow-lg duration-300 bg-white flex flex-col overflow-hidden justify-between h-full"
            >
              {/* Image */}
              <Link
                data-tooltip-id="my-tooltip"
                data-tooltip-content={"Click on the iamge to view details."}
                to={`/product/${p._id}`}
              >
                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                />
              </Link>

              {/* Content */}
              <div className="p-4 flex flex-col gap-2 h-full">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-gray-500 text-sm">{p.category}</p>

                <div className="flex items-center gap-2 h-full">
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
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View All Button */}
      <Link
        to="/category/all"
        className="px-6 py-3 bg-gradient-to-tr from-black via-black to-black hover:to-sky-500 hover:from-sky-500 duration-300 text-white font-semibold rounded-lg shadow hover:bg-gray-800 transition"
      >
        View All Products
      </Link>
    </div>
  );
};

export default HomeProducts;
