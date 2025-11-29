import { Link, NavLink, useNavigate } from "react-router";
import skLogo from "/sk-icon.jpg";
import { FaMapLocationDot, FaUserGear } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoMdLogIn } from "react-icons/io";
import { useContext, useState } from "react";
import { FaSearch } from "react-icons/fa";
import MainContext from "../../../Context/MainContext";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import { Swiper, SwiperSlide } from "swiper/react";
import { Tooltip } from "react-tooltip";

const MainNavbar = () => {
  const { user, userImage, handleLogout, cart } = useContext(MainContext);
  const navigate = useNavigate();
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const updateShowSearch = () => {
    setShowProfile(false);
    setIsShowSearch((prev) => !prev);
  };
  const profileShowHide = () => {
    setIsShowSearch(false);
    setShowProfile((prev) => !prev);
  };
  const AxiosSecure = useAxiosSecure();
  const AxiosPublic = useAxiosPublic();

  // user for role check
  const { data: userForRoleCheck = [] } = useQuery({
    queryKey: ["userForRoleCheck"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await AxiosSecure.get(`/user/${user?.email}`);
      return res.data;
    },
    retry: 3,
    retryDelay: 2000,
  });

  const { data: categories = [], refetch: refetchCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await AxiosPublic.get(`settings/category`);
      return res.data;
    },
    retry: 3,
    retryDelay: 2000,
  });

  const searchNavigate = (e) => {
    e.preventDefault();
    const searchText = e.target.searchNav.value;
    const formattedSearch = searchText.trim().replace(/\s+/g, "-");
    console.log(searchText, formattedSearch.length);
    if (formattedSearch.length < 3) {
      return toast.info("Please type atleast 3 characters.", {
        position: "top-right",
        autoClose: 2000,
        draggable: true,
      });
    }
    navigate(`/search/${formattedSearch}`);
    e.target.reset();
  };

  return (
    <ClickAwayListener
      onClickAway={() => {
        setShowProfile(false);
        setIsShowSearch(false);
      }}
    >
      <div className="w-full sm:py-5 py-2 bg-white/90 sm:px-5 px-2 fixed z-50 flex flex-col items-center gap-2 shadow-md max-w-[1480px]">
        <div className="w-full flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-5 w-fit">
            <Link
              className="sm:w-12 w-10 rounded-tr-xl rounded-bl-xl border-b-2 border-r-2 overflow-hidden"
              to={"/"}
            >
              <img className="w-full h-full" src={skLogo} alt="logo" />
            </Link>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "py-1 shadow-lg px-3 rounded-lg border-b-2 border-cyan-500 text-cyan-800 font-medium bg-white md:text-lg text-base flex items-center gap-1 text-nowrap"
                  : "py-1 px-3 rounded-lg border-b-2 border-transparent font-medium hover:text-gray-600 duration-300 md:text-lg text-base flex items-center gap-1 text-nowrap"
              }
              to={"/track-order"}
            >
              <span className="md:block hidden">Track Order</span>
              <FaMapLocationDot className="md:text-xl text-2xl"></FaMapLocationDot>
            </NavLink>
          </div>
          <div className="max-w-md w-full sm:block hidden">
            <form
              onSubmit={searchNavigate}
              className="w-full bg-white sm:flex hidden items-center border-2 rounded-lg gap-1"
            >
              <input
                id="searchNav"
                name="searchNav"
                className="w-full px-2 py-1 placeholder:font-medium text-lg focus:outline-0"
                type="text"
                placeholder="Search Product"
              />
              <button className="px-2 py-1 border-l border-black hover:text-emerald-500 duration-300">
                <FaSearch className="text-2xl"></FaSearch>
              </button>
            </form>
          </div>
          <div className="flex items-center gap-2 md:gap-5">
            <button onClick={updateShowSearch} className="sm:hidden flex">
              <FaSearch className="text-2xl"></FaSearch>
            </button>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "py-1 shadow-lg px-3 rounded-lg border-b-2 border-cyan-500 text-cyan-800 font-medium bg-white text-base flex items-center gap-1 text-nowrap relative"
                  : "py-1 px-3 rounded-lg border-b-2 border-transparent font-medium hover:text-gray-600 duration-300 text-base flex items-center gap-1 text-nowrap relative"
              }
              to={"/cart"}
            >
              <span className="px-2 text-sm rounded-full bg-red-700 h-fit w-fit text-white absolute -top-2 -right-2">
                {cart.length}
              </span>

              <MdOutlineShoppingCart className="md:text-3xl text-2xl"></MdOutlineShoppingCart>
            </NavLink>

            {user ? (
              <div className="relative flex gap-2 items-center">
                <a
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content={user?.displayName}
                >
                  <button
                    className="h-12 w-12 overflow-hidden rounded-full border-2 border-black"
                    onClick={profileShowHide}
                  >
                    <img
                      className="object-cover"
                      src={userImage || user?.photoURL}
                      alt="User-Photo"
                    />
                  </button>
                </a>
                {showProfile && (
                  <div className="absolute top-16 right-2 flex flex-col gap-1 py-5 px-3 bg-gray-50 rounded-lg border-2">
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? "text-lg font-bold hover:text-gray-600 text-cyan-700 duration-300"
                          : "text-lg font-bold hover:text-gray-600 text-black duration-300"
                      }
                      to={"/me"}
                    >
                      <h2>{user.displayName}</h2>
                    </NavLink>
                    <p className="sm:text-base text-sm text-gray-600 font-medium mt-1">
                      {user.email}
                    </p>
                    <NavLink
                      className={({ isActive }) =>
                        isActive
                          ? "text-lg font-bold hover:text-gray-600 text-cyan-700 duration-300 mt-3"
                          : "text-lg font-bold hover:text-gray-600 text-black duration-300 mt-3"
                      }
                      to={"/my-orders"}
                    >
                      My Orders
                    </NavLink>
                    {(userForRoleCheck.role === "admin" ||
                      userForRoleCheck.role === "moderator") && (
                      <Link
                        className="text-lg font-bold border-2 border-purple-700 hover:border-black hover:bg-black px-3 py-1 w-fit text-center rounded-lg hover:text-white text-purple-700 duration-300 mt-3 flex items-center gap-2"
                        to={"/admin/home"}
                      >
                        Admin-Panel
                        <FaUserGear className="text-xl"></FaUserGear>
                      </Link>
                    )}
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
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "py-1 shadow-lg px-3 rounded-lg border-b-2 border-cyan-500 text-cyan-800 font-medium bg-white md:text-lg text-base md:hidden flex items-center gap-1 text-nowrap"
                      : "py-1 px-3 rounded-lg border-b-2 border-transparent font-medium hover:text-gray-600 duration-300 md:text-lg text-base md:hidden flex items-center gap-1 text-nowrap"
                  }
                  to={"/login"}
                >
                  <IoMdLogIn className="text-2xl"></IoMdLogIn>
                </NavLink>
                <div className="md:flex hidden items-center gap-2">
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "py-1 shadow-lg px-3 rounded-lg border-b-2 border-cyan-500 text-cyan-800 font-medium bg-white md:text-lg text-base flex items-center gap-1 text-nowrap"
                        : "py-1 px-3 rounded-lg border-b-2 border-transparent font-medium hover:text-gray-600 duration-300 md:text-lg text-base flex items-center gap-1 text-nowrap"
                    }
                    to={"/login"}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "py-1 shadow-lg px-3 rounded-lg border-b-2 border-cyan-500 text-cyan-800 font-medium bg-white md:text-lg text-base flex items-center gap-1 text-nowrap"
                        : "py-1 px-3 rounded-lg border-b-2 border-transparent font-medium hover:text-gray-600 duration-300 md:text-lg text-base flex items-center gap-1 text-nowrap"
                    }
                    to={"/register"}
                  >
                    Register
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="sm:max-w-md w-full flex flex-col items-center gap-3">
          {isShowSearch && (
            <form
              onSubmit={searchNavigate}
              className="w-full bg-white sm:hidden flex items-center border-2 rounded-lg gap-1"
            >
              <input
                name="searchNav"
                className="w-full px-2 py-1 placeholder:font-medium text-lg focus:outline-0"
                type="text"
                placeholder="Search Product"
              />
              <button className="px-2 py-1 border-l border-black hover:text-emerald-500 duration-300">
                <FaSearch className="text-2xl"></FaSearch>
              </button>
            </form>
          )}
          {/* Search Products Box */}
          <div className="w-full flex flex-col items-center gap-3 max-h-80"></div>
        </div>
        <Swiper
          className="w-full mx-auto"
          slidesPerView={3}
          spaceBetween={10}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 8 },
          }}
        >
          {categories.map((c) => (
            <SwiperSlide key={c._id}>
              <NavLink
                to={`category/${c.name}`}
                className={({ isActive }) =>
                  isActive
                    ? "flex flex-col items-center justify-center border-2 rounded-md bg-black text-white hover:bg-gray-300 duration-300"
                    : "flex flex-col items-center justify-center border-2 rounded-md hover:bg-gray-300 duration-300"
                }
              >
                <p className="lg:text-base font-semibold py-2">{c.name}</p>
              </NavLink>
            </SwiperSlide>
          ))}
        </Swiper>

        <Tooltip id="my-tooltip"></Tooltip>
      </div>
    </ClickAwayListener>
  );
};

export default MainNavbar;
