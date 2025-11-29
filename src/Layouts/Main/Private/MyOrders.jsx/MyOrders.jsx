import { useContext } from "react";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import MainContext from "../../../../Context/MainContext";
import { useQuery } from "@tanstack/react-query";
import { HeadProvider, Title } from "react-head";
import { BounceLoader } from "react-spinners";

const MyOrders = () => {
  const AxiosSecure = useAxiosSecure();
  const { user } = useContext(MainContext);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders", user?.email],
    queryFn: async () => {
      const res = await AxiosSecure.get(`/orders/my/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
    retry: 3,
    retryDelay: 2000,
  });

  return (
    <div className="px-5 py-10 w-full flex flex-col gap-5 items-center">
      <HeadProvider>
        <Title>My Orders || SKS</Title>
      </HeadProvider>

      <h2 className="md:text-3xl text-2xl font-bold mb-5">My Orders</h2>

      {isLoading ? (
        <BounceLoader size={50} color="#000"></BounceLoader>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="w-full max-w-5xl flex flex-col gap-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className={`border-2 rounded-lg shadow hover:shadow-lg duration-300 p-5 flex flex-col gap-3 bg-white`}
            >
              {/* Details */}
              <div className="w-full flex items-end flex-wrap-reverse justify-between gap-5">
                <div className="w-fit flex flex-col items-start gap-4">
                  <h3 className="font-bold text-lg flex items-center gap-1 flex-wrap w-fit">
                    Order ID:
                    <span className="text-gray-600">{order._id}</span>
                  </h3>
                  <div className="w-fit flex flex-col items-start gap-2">
                    <p className="flex items-center gap-1 flex-wrap w-fit">
                      <strong>Customer:</strong>
                      {order.customer?.name || "Unknown"}
                    </p>
                    <p className="flex items-center gap-1 flex-wrap w-fit">
                      <strong>Email:</strong> {order.customer?.email || "N/A"}
                    </p>
                    <p className="flex items-center gap-1 flex-wrap w-fit">
                      <strong>Phone:</strong> {order.customer?.phone || "N/A"}
                    </p>
                    <p className="flex items-center gap-1 flex-wrap w-fit">
                      <strong>Address:</strong>{" "}
                      <span>{order.customer?.address},</span>
                      <span>{order.customer?.district},</span>
                      {order.customer?.postcode}
                    </p>
                    <p className="flex items-center gap-1 flex-wrap w-fit">
                      <strong>Payment Method:</strong>
                      <span
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={
                          order.method === "COD"
                            ? "Cash On Delivery"
                            : "SSL Payment"
                        }
                        className={`px-2 py-1 rounded-full text-white text-sm font-medium ${
                          order.method === "SSL"
                            ? "bg-blue-500"
                            : "bg-orange-500"
                        }`}
                      >
                        {order.method}
                      </span>
                    </p>
                    <p className="flex items-center gap-1 flex-wrap w-fit">
                      <strong>Payment:</strong>
                      <span
                        className={`px-2 py-1 rounded-full text-white text-sm font-medium ${
                          order.paymentInfo?.status === "pending"
                            ? "bg-yellow-600"
                            : order.paymentInfo?.status === "VALID"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {order.paymentInfo?.status || "Pending"}
                      </span>
                    </p>
                    <p className="flex items-center gap-1 flex-wrap w-fit">
                      <strong>Payment Status:</strong>
                      <span
                        className={`px-2 py-1 rounded-full text-white text-sm font-medium ${
                          order.paymentStatus === "pending"
                            ? "bg-yellow-600"
                            : order.paymentStatus === "paid" && "bg-green-600"
                        }`}
                      >
                        {order.paymentStatus || "Pending"}
                      </span>
                    </p>
                    <p className="flex items-center gap-1 flex-wrap w-fit">
                      <strong>Order Status:</strong>
                      <span
                        className={`px-2 py-1 rounded-full text-white text-sm font-medium ${
                          order?.orderStatus === "pending"
                            ? "bg-orange-700"
                            : order?.orderStatus === "shipping"
                            ? "bg-sky-600"
                            : order?.orderStatus === "delivered"
                            ? "bg-purple-600"
                            : "bg-red-600"
                        }`}
                      >
                        {order?.orderStatus || "Pending"}
                      </span>
                    </p>
                    <p className="flex items-center gap-1 flex-wrap w-fit">
                      <strong>Order Date:</strong>{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Products Table inside order card */}
              <div className="overflow-x-auto mt-3">
                <table className="w-full border rounded text-sm">
                  <thead className="bg-sky-700 text-white">
                    <tr>
                      <th className="p-2 border-2 border-black">#</th>
                      <th className="p-2 border-2 border-black">Product</th>
                      <th className="p-2 border-2 border-black">Qty</th>
                      <th className="p-2 border-2 border-black">Price</th>
                      <th className="p-2 border-2 border-black">Total</th>
                      <th className="p-2 border-2 border-black">Discount</th>
                      <th className="p-2 border-2 border-black">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.cart.map((item, i) => (
                      <tr key={i} className="text-center">
                        <td className="p-2 border-2">{i + 1}</td>
                        <td className="p-2 border-2">{item.name}</td>
                        <td className="p-2 border-2">{item.quantity}</td>
                        <td className="p-2 border-2">৳{item.price}</td>
                        <td className="p-2 border-2">
                          ৳{item.quantity * item.price}
                        </td>
                        <td className="p-2 border-2">{item.discount}%</td>
                        <td className="p-2 border-2 text-green-600 font-semibold">
                          ৳{item.quantity * item.discountedPrice}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className="font-bold text-lg text-green-600">
                  Net Total: ৳{order.netTotal}
                </span>
                <span className="text-gray-600 italic font-medium">
                  {order.cart.length} items
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
