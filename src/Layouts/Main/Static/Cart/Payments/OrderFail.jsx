import { Link } from "react-router";

const OrderFail = () => {
  return (
    <div className="px-5 py-10 text-center">
      <h2 className="text-3xl font-bold mb-5 text-red-600">Payment Failed!</h2>
      <p className="mb-3">
        Your payment could not be processed. Please try again.
      </p>
      <Link to="/cart" className="text-blue-600 underline">
        Back to Cart
      </Link>
    </div>
  );
};

export default OrderFail;
