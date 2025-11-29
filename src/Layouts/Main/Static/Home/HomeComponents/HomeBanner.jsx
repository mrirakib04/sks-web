import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { TiInfo } from "react-icons/ti";

const HomeBanner = () => {
  const AxiosPublic = useAxiosPublic();
  const { data: bannerImages = [], refetch: refetchImages } = useQuery({
    queryKey: ["bannerImages"],
    queryFn: async () => {
      const res = await AxiosPublic.get(`settings/banner`);
      return res.data;
    },
    retry: 3,
    retryDelay: 2000,
  });
  return (
    <div className="w-full">
      <p className="text-center w-full font-bold text-xl text-orange-600 flex flex-col items-center py-20">
        <TiInfo className="text-red-700 text-5xl"></TiInfo>
        This website is in testing, and not connected with the business.
      </p>

      <Swiper
        className="w-full shadow-lg shadow-gray-400"
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
      >
        {bannerImages.map((image) => (
          <SwiperSlide key={image._id}>
            <img
              className="mx-auto w-full lg:max-h-[500px] sm:max-h-[400px] max-h-[300px]"
              src={image.image}
              alt={`image-${image.index}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeBanner;
