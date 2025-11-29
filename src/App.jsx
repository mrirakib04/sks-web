import "./App.css";
import AOS from "aos";
import { Outlet } from "react-router";
import Footer from "./Shared/Footer";
import ScrollToTop from "react-scroll-to-top";
import { MdVerticalAlignTop } from "react-icons/md";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "aos/dist/aos.css";

function App() {
  AOS.init();
  return (
    <div className="max-w-[1480px] mx-auto flex flex-col items-center w-full">
      <Outlet></Outlet>
      <Footer></Footer>
      <ScrollToTop
        smooth
        color="white"
        style={{
          background: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        component={
          <MdVerticalAlignTop className="text-white text-3xl"></MdVerticalAlignTop>
        }
      ></ScrollToTop>
    </div>
  );
}

export default App;
