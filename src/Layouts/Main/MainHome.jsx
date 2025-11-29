import MainNavbar from "./MainComponents/MainNavbar";
import { Outlet } from "react-router";

const MainHome = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <MainNavbar></MainNavbar>
      <div className="w-full sm:py-20 py-16"></div>
      <Outlet></Outlet>
    </div>
  );
};

export default MainHome;
