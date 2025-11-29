import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import ErrorPage from "./ErrorPage";
import App from "../App";
import MainHome from "../Layouts/Main/MainHome";
import Home from "../Layouts/Main/Static/Home/Home";
import Login from "../Layouts/Auth/Login";
import Register from "../Layouts/Auth/Register";
import TrackOrder from "../Layouts/Main/Static/TrackOrder/TrackOrder";
import Products from "../Layouts/Main/Static/Products/Products";
import SearchProducts from "../Layouts/Main/Static/SearchProducts/SearchProducts";
import ProductDetails from "../Layouts/Main/Static/ProductDetails/ProductDetails";
import AdminMain from "../Layouts/Admin/AdminMain";
import AdminHome from "../Layouts/Admin/AdminHome/AdminHome";
import Orders from "../Layouts/Admin/Orders/Orders";
import AddProduct from "../Layouts/Admin/AddProduct/AddProduct";
import Settings from "../Layouts/Admin/Settings/Settings";
import Cart from "../Layouts/Main/Static/Cart/Cart";
import Me from "../Layouts/Main/Private/Me/Me";
import MyOrders from "../Layouts/Main/Private/MyOrders.jsx/MyOrders";
import AllProducts from "../Layouts/Admin/AllProducts/AllProducts";
import Users from "../Layouts/Admin/Users/Users";
import OrderSuccess from "../Layouts/Main/Static/Cart/Payments/OrderSuccess";
import OrderFail from "../Layouts/Main/Static/Cart/Payments/OrderFail";
import OrderCancel from "../Layouts/Main/Static/Cart/Payments/OrderCancel";
import EditProduct from "../Layouts/Admin/EditProduct/EditProduct";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ErrorPage></ErrorPage>}></Route>
        <Route path="/" element={<App></App>}>
          {/* Customer Layout Routes */}
          <Route path="/" element={<MainHome></MainHome>}>
            {/* Home */}
            <Route index element={<Home></Home>}></Route>
            <Route path="home" element={<Navigate to={"/"}></Navigate>}></Route>
            {/* Auth Routes */}
            <Route path="login" element={<Login></Login>}></Route>
            <Route path="register" element={<Register></Register>}></Route>
            {/* Track Order */}
            <Route
              path="track"
              element={<Navigate to={"/track-order"}></Navigate>}
            ></Route>
            <Route
              path="trackorder"
              element={<Navigate to={"/track-order"}></Navigate>}
            ></Route>
            <Route
              path="track-order"
              element={<TrackOrder></TrackOrder>}
            ></Route>
            {/* Category */}
            <Route
              path="category/:name"
              element={<Products></Products>}
            ></Route>
            {/* Search */}
            <Route
              path="search/:key"
              element={<SearchProducts></SearchProducts>}
            ></Route>
            {/* Product */}
            <Route
              path="product/:id"
              element={<ProductDetails></ProductDetails>}
            ></Route>
            {/* Cart */}
            <Route path="cart" element={<Cart></Cart>}></Route>
            <Route
              path="order-success"
              element={<OrderSuccess></OrderSuccess>}
            ></Route>
            <Route path="order-fail" element={<OrderFail></OrderFail>}></Route>
            <Route
              path="order-cancel"
              element={<OrderCancel></OrderCancel>}
            ></Route>

            {/* Private Routes */}
            {/* My Profile */}
            <Route path="me" element={<Me></Me>}></Route>
            {/* My Orders */}
            <Route path="my-orders" element={<MyOrders></MyOrders>}></Route>
            <Route
              path="myorders"
              element={<Navigate to={"/my-orders"}></Navigate>}
            ></Route>
          </Route>

          {/* Admin Layout Routes */}
          <Route path="/admin" element={<AdminMain></AdminMain>}>
            {/* Admin Home */}
            <Route
              index
              element={<Navigate to={"/admin/home"}></Navigate>}
            ></Route>
            <Route path="home" element={<AdminHome></AdminHome>}></Route>
            {/* Orders */}
            <Route path="orders" element={<Orders></Orders>}></Route>
            {/* All Products */}
            <Route
              path="products"
              element={<AllProducts></AllProducts>}
            ></Route>
            {/* Edit Product */}
            <Route
              path="product/edit/:id"
              element={<EditProduct></EditProduct>}
            ></Route>
            {/* Add Product */}
            <Route
              path="add"
              element={<Navigate to={"/admin/add-product"}></Navigate>}
            ></Route>
            <Route
              path="add-product"
              element={<AddProduct></AddProduct>}
            ></Route>
            {/* Users */}
            <Route path="users" element={<Users></Users>}></Route>
            {/* Settings */}
            <Route path="settings" element={<Settings></Settings>}></Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
