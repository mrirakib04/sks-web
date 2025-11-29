import { MdOutlineErrorOutline } from "react-icons/md";
import { Link } from "react-router";

const ErrorPage = () => {
  return (
    <div className="mt-28 flex flex-col w-full items-center justify-center gap-5 px-2">
      <MdOutlineErrorOutline className="text-5xl text-red-700"></MdOutlineErrorOutline>
      <p className="sm:text-2xl text-xl font-medium text-center">
        Oops! This page was not Found.
      </p>
      <Link
        to={"/"}
        className="py-2 px-5 mx-auto rounded bg-cyan-600 text-center font-bold transition hover:bg-cyan-500 text-white"
      >
        Go To Homepage
      </Link>
    </div>
  );
};

export default ErrorPage;
