const OrderCancel = () => {
  return (
    <div className="px-5 py-10 text-center">
      <h2 className="text-3xl font-bold mb-5 text-yellow-600">
        Payment Cancelled!
      </h2>
      <p className="mb-3">You cancelled the payment.</p>
      <Link to="/cart" className="text-blue-600 underline">
        Back to Cart
      </Link>
    </div>
  );
};

export default OrderCancel;
