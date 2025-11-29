import { HeadProvider, Title } from "react-head";
import { Link, useNavigate, useParams } from "react-router";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import { Button } from "@mui/material";
import { FaCartPlus } from "react-icons/fa6";
import { useContext } from "react";
import MainContext from "../../../../Context/MainContext";
import { toast } from "react-toastify";

const SearchProducts = () => {
  const { key } = useParams();
  const AxiosPublic = useAxiosPublic();
  const { addToCart } = useContext(MainContext);
  const navigate = useNavigate();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["search-products", key],
    queryFn: async () => {
      const res = await AxiosPublic.get(`/products/search/${key}`);
      return res.data;
    },
    enabled: !!key,
    retry: 2,
    retryDelay: 1500,
  });

  return (
    <div className="px-5 py-10 w-full flex flex-col items-center gap-5">
      <HeadProvider>
        <Title>Search || Sinthia Kitchen Shop</Title>
      </HeadProvider>
      <h2 className="md:text-3xl text-2xl font-bold">
        Search Results for: <span className="text-sky-600">"{key}"</span>
      </h2>

      {isLoading ? (
        <BounceLoader size={50} color="#000"></BounceLoader>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No products found for "{key}".</p>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 w-full max-w-6xl">
          {products.map((p) => (
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
                  <span className="line-through text-gray-400">৳{p.price}</span>
                )}
              </div>
              {p.discount > 0 && (
                <span className="text-sm font-medium text-red-500">
                  -{p.discount}%
                </span>
              )}
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
              <Link
                to={`/product/${p._id}`}
                className="w-full mx-auto py-2 rounded-md border-2 text-white! shadow-gray-400/90 bg-gradient-to-tr from-black to-gray-500 transition-all duration-300 hover:to-cyan-500 hover:shadow-md"
              >
                <p className="text-lg font-bold py-1 text-center">VIEW MORE</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProducts;
