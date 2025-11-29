import AdminNavbar from "./AdminComponents/AdminNavbar";
import { Outlet } from "react-router";

const AdminMain = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <AdminNavbar></AdminNavbar>
      <div className="w-full sm:py-12 py-10"></div>
      <Outlet></Outlet>
    </div>
  );
};

export default AdminMain;
