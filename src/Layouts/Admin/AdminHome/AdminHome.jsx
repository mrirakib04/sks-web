import { HeadProvider, Title } from "react-head";
import OrdersStat from "./AdminHomeComponents/OrdersStat";
import { useContext } from "react";
import MainContext from "../../../Context/MainContext";

const AdminHome = () => {
  const { userName } = useContext(MainContext);
  return (
    <div className="w-full flex flex-col items-center">
      <HeadProvider>
        <Title>Home || Admin || SKS</Title>
      </HeadProvider>
      <div
        className="w-full sm:px-10 px-5 flex flex-col items-center text-center md:py-20 py-10 bg-gradient-to-r from-purple-100 via-white to-purple-100
      "
      >
        <h2 className="flex flex-wrap items-center gap-1 lg:text-4xl md:text-3xl text-2xl font-semibold italic">
          Welcome,<span>{userName}</span>
        </h2>
        <p className="font-medium md:text-lg text-base text-green-600 mt-2">
          Let's start managing customers.
        </p>
      </div>
      <OrdersStat></OrdersStat>
    </div>
  );
};

export default AdminHome;
