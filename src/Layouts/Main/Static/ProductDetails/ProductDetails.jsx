import { HeadProvider, Title } from "react-head";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { useNavigate, useParams } from "react-router";
import { useContext, useState } from "react";
import MainContext from "../../../../Context/MainContext";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { FaCartPlus } from "react-icons/fa6";

const ProductDetails = () => {
  const { id } = useParams();
  const AxiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const { addToCart } = useContext(MainContext);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await AxiosPublic.get(`/product/${id}`);
      return res.data;
    },
    enabled: !!id,
    retry: 2,
  });

  return (
    <div className="px-5 py-10 flex flex-col items-center w-full">
      <HeadProvider>
        <Title>Product Name || Sinthia Kitchen Shop</Title>
      </HeadProvider>
      {isLoading ? (
        <BounceLoader size={60} color="#000"></BounceLoader>
      ) : !product?._id ? (
        <p className="text-red-600 font-medium">Product not found.</p>
      ) : (
        <div className="max-w-6xl w-full flex flex-col md:flex-row gap-10 border rounded-lg shadow-lg p-5 bg-white">
          {/* Image Slider */}
          <div className="w-full md:w-1/2">
            <Swiper
              style={{
                "--swiper-navigation-color": "#000",
                "--swiper-pagination-color": "#000",
              }}
              spaceBetween={10}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper2 rounded-lg shadow-md"
            >
              {product.images?.map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={img}
                    alt={`${product.name}-${i}`}
                    className="w-full lg:h-96 md:h-80 sm:h-72 h-40 object-fill rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper mt-3"
            >
              {product.images?.map((img, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={img}
                    alt={`thumb-${i}`}
                    className="w-full sm:h-20 h-16 object-cover rounded-md border"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Info */}
          <div className="w-full md:w-1/2 flex flex-col gap-3">
            <h2 className="text-3xl font-bold">{product.name}</h2>
            <p className="text-gray-600 text-lg font-medium">
              {product.category}
            </p>
            <div className="flex flex-col items-start">
              <span className="font-bold">Description:</span>
              <p className="text-gray-800">{product.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-green-600">
                ৳{product.discountedPrice}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="line-through text-gray-400">
                    ৳{product.price}
                  </span>
                  <span className="text-red-600 font-semibold">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>

            {/* Buttons */}
            {product.inStock == false ? (
              <p className="text-red-600 font-semibold text-lg h-full">
                Out of Stock
              </p>
            ) : (
              <div className="flex gap-4 mt-5">
                <Button
                  onClick={() => {
                    addToCart(product);
                    toast.success(`${product.name} added to cart!`, {
                      position: "top-right",
                      autoClose: 2000,
                    });
                    navigate("/cart");
                  }}
                  className="bg-gradient-to-tr from-purple-500 to-sky-500 text-white! font-bold! px-6! py-3! text-lg! rounded-lg hover:to-emerald-500 duration-300"
                >
                  BUY NOW
                </Button>
                <button
                  onClick={() => {
                    addToCart(product);
                    toast.success(`${product.name} added to cart!`, {
                      position: "top-right",
                      autoClose: 2000,
                    });
                  }}
                  className="flex items-center justify-center border-2 rounded-lg px-6 py-3 hover:bg-sky-200 duration-300"
                >
                  <FaCartPlus className="text-2xl mr-2" /> Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
