import useAxiosPublic from "../Hooks/useAxiosPublic";
import { useEffect, useState } from "react";
import MainContext from "./MainContext";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import auth from "../Firebase/firebase.config";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const MainContextProvider = ({ children }) => {
  const AxiosPublic = useAxiosPublic();

  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [loading, setLoading] = useState(true);

  // Handle Registration
  const handleRegisterEmailPassword = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  // Handle Login
  const handleLoginEmailPassword = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Handle Google Provider
  const handleGoogle = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Handle Logout
  const handleLogout = () => {
    setLoading(true);
    return AxiosPublic.post("/logout")
      .then(() => {
        signOut(auth);
      })
      .then(() => {
        toast.warn(`Logout Successful`, {
          position: "top-center",
          autoClose: 2000,
          closeButton: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        toast.error(`${error.message}`, {
          position: "top-right",
          autoClose: 2000,
          closeButton: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  // User Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserName(currentUser.displayName);
        setUserImage(currentUser.photoURL);
        // get token and store it via httpOnly cookie
        await AxiosPublic.post(
          "/jwt",
          { email: currentUser?.email },
          { withCredentials: true }
        );
      } else {
        setUser(null);
        setUserName(null);
        setUserImage(null);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, [AxiosPublic]);

  // Cart Management
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  // Save in localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add product
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove product
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
    toast.info("Item removed from cart!", {
      position: "top-right",
      autoClose: 2000,
      draggable: true,
    });
  };

  // Increase product quantity
  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease product quantity
  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
    );
  };

  const contextNames = {
    user,
    setUser,
    userName,
    setUserName,
    userImage,
    setUserImage,
    loading,
    setLoading,
    handleRegisterEmailPassword,
    handleLoginEmailPassword,
    handleGoogle,
    handleLogout,
    cart,
    setCart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  };

  return (
    <MainContext.Provider value={contextNames}>{children}</MainContext.Provider>
  );
};

MainContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainContextProvider;
