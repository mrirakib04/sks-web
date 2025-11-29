import { useContext, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import MainContext from "../../../Context/MainContext";
import { useQuery } from "@tanstack/react-query";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import skLogo from "/sk-icon.jpg";
import { RiMenu2Fill } from "react-icons/ri";
import { Link, NavLink, useNavigate } from "react-router";
import { Tooltip } from "react-tooltip";
import { FaHome } from "react-icons/fa";

const AdminNavbar = () => {
  const { user, userImage, handleLogout } = useContext(MainContext);
  const AxiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [navShow, setNavShow] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navShowHide = () => {
    setShowProfile(false);
    setNavShow((prev) => !prev);
  };
  const profileShowHide = () => {
    setNavShow(false);
    setShowProfile((prev) => !prev);
  };

  // dynamic navbar control
  const { data: userForNav = [] } = useQuery({
    queryKey: ["userForNav"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await AxiosSecure.get(`/user/${user?.email}`);
      return res.data;
    },
    retry: 3,
    retryDelay: 2000,
  });

  const navLinks = [
    { to: "/admin/home", label: "Home", roles: ["admin", "moderator"] },
    {
      to: "/admin/orders",
      label: "Orders",
      roles: ["admin", "moderator"],
    },
    {
      to: "/admin/products",
      label: "Products",
      roles: ["admin", "moderator"],
    },
    {
      to: "/admin/add-product",
      label: "Add Product",
      roles: ["admin", "moderator"],
    },
    {
      to: "/admin/users",
      label: "Users",
      roles: ["admin"],
    },
    {
      to: "/admin/settings",
      label: "Settings",
      roles: ["admin"],
    },
  ];

  const generateLinks = (role, styleFn) =>
    navLinks
      .filter((link) => link.roles.includes(role))
      .map(({ to, label }, idx) => (
        <NavLink key={idx} to={to} className={styleFn}>
          {label}
        </NavLink>
      ));

  const dynamicMobileNavbar = (role) => {
    return generateLinks(role, ({ isActive }) =>
      isActive
        ? "border-cyan-400 text-cyan-600 border-2 py-1 px-4 rounded-lg"
        : "border-2 border-transparent py-2 px-4 rounded-lg"
    );
  };

  const dynamicComputerNavbar = (role) => {
    return generateLinks(role, ({ isActive }) =>
      isActive
        ? "py-1 shadow-lg px-3 rounded-lg border-b-2 border-cyan-500 text-cyan-800"
        : "py-1 px-3 rounded-lg border-b-2 border-transparent hover:text-cyan-600 duration-300"
    );
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        setNavShow(false);
        setShowProfile(false);
      }}
    >
      <div className="bg-white/95 w-full fixed z-50 shadow-lg max-w-[1480px]">
        <div className="text-black flex justify-between items-center py-4 md:px-6 sm:px-3 px-2 mx-auto container">
          <div className="relative text-xl flex lg:gap-0 gap-5 font-bold items-center">
            <div className="flex">
              <button className="lg:hidden text-2xl" onClick={navShowHide}>
                <RiMenu2Fill></RiMenu2Fill>
              </button>
              {navShow && (
                <div className="absolute lg:hidden border-2 text-base rounded-lg top-14 font-bold bg-gray-100 text-gray-700 p-4">
                  <ul className="flex flex-col gap-2 text-nowrap">
                    {user && dynamicMobileNavbar(userForNav?.role)}
                  </ul>
                </div>
              )}
            </div>
            <Link
              className="sm:w-12 w-10 rounded-tr-xl rounded-bl-xl border-b-2 border-r-2 overflow-hidden"
              to={"/admin/home"}
            >
              <img className="w-full h-full" src={skLogo} alt="logo" />
            </Link>
          </div>
          <div className="lg:flex font-bold text-base hidden">
            <ul className="flex gap-1">
              {user && dynamicComputerNavbar(userForNav.role)}
            </ul>
          </div>

          <div className="flex items-center text-black">
            <div className="relative flex gap-2 items-center">
              <a
                data-tooltip-id="my-tooltip"
                data-tooltip-content={user?.displayName}
              >
                <button onClick={profileShowHide}>
                  <img
                    className="h-12 w-12 object-cover rounded-full border-2 border-black"
                    src={userImage || user?.photoURL}
                    alt="User-Photo"
                  />
                </button>
              </a>
              {showProfile && (
                <div className="absolute top-16 right-2 flex flex-col gap-1 py-5 px-3 bg-gray-50 rounded-lg border-2">
                  <Link
                    to={"/me"}
                    className="text-lg font-bold hover:text-black text-gray-600 duration-300"
                  >
                    <h2>{user.displayName}</h2>
                  </Link>
                  <p className="sm:text-base text-sm text-gray-600 font-medium mt-1">
                    {user.email}
                  </p>

                  <Link
                    className="text-lg font-bold border-2 border-green-700 hover:border-black hover:bg-black px-3 py-1 w-fit text-center rounded-lg hover:text-white text-green-700 duration-300 mt-3 flex items-center gap-2"
                    to={"/"}
                  >
                    Home <FaHome className="text-xl"></FaHome>
                  </Link>

                  <div>
                    <button
                      onClick={() => {
                        handleLogout();
                        navigate("/");
                      }}
                      className="mt-3 text-xl text-left font-bold text-red-600 transition duration-300 hover:text-red-800"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Tooltip id="my-tooltip" />
      </div>
    </ClickAwayListener>
  );
};

export default AdminNavbar;
