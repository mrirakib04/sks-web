import { HeadProvider, Title } from "react-head";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BounceLoader } from "react-spinners";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const Orders = () => {
  const AxiosSecure = useAxiosSecure();
  const [filterType, setFilterType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const {
    data: orders = [],
    isLoading,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await AxiosSecure.get("/admin/orders");
      return res.data;
    },
    retry: 2,
    retryDelay: 1500,
  });

  // 🔹 Filtering + Sorting Logic
  const filteredOrders = [...orders]
    .filter((o) => {
      if (filterType === "cod") return o.method === "COD";
      if (filterType === "ssl") return o.method === "SSL";
      return true;
    })
    .filter((o) => {
      if (statusFilter) {
        return o?.orderStatus?.toLowerCase() === statusFilter.toLowerCase();
      }
      return true;
    })
    .sort((a, b) => {
      if (filterType === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  useEffect(() => {
    console.log("Filter:", filterType, "Status:", statusFilter);
  }, [filterType, statusFilter]);

  console.log(orders);

  // controls btn

  // Status Update
  const handleStatusUpdate = async (orderId, newStatus) => {
    const result = await Swal.fire({
      title: `Mark order as ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const res = await AxiosSecure.patch(`/admin/orders/${orderId}`, {
          orderStatus: newStatus,
        });
        if (res.data.modifiedCount > 0) {
          toast.success(`Order marked as ${newStatus}`);
          refetchOrders();
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to update order status");
      }
    }
  };

  // Mark Paid
  const handleMarkPaid = async (orderId) => {
    const result = await Swal.fire({
      title: `Mark payment as PAID?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        const res = await AxiosSecure.patch(`/admin/orders/${orderId}`, {
          paymentStatus: "VALID",
        });
        if (res.data.modifiedCount > 0) {
          toast.success("Payment marked as PAID");
          refetchOrders();
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to mark as paid");
      }
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId) => {
    const result = await Swal.fire({
      title: `Are you sure to delete this order?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await AxiosSecure.delete(`/admin/orders/delete/${orderId}`);
        if (res.data.deletedCount > 0) {
          toast.success("Order deleted successfully");
          refetchOrders();
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete order");
      }
    }
  };

  return (
    <div className="w-full sm:px-10 px-5 flex flex-col items-center gap-5 py-10">
      <HeadProvider>
        <Title>Orders || Admin || SKS</Title>
      </HeadProvider>
      <h2 className="lg:text-4xl md:text-3xl text-2xl font-bold text-start w-full">
        All Orders
      </h2>

      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 w-full">
        {/* Filters */}
        <div className="col-span-1 flex flex-col gap-3 items-center justify-start font-medium border p-5 rounded-lg h-full">
          <h4 className="text-xl font-semibold text-start w-full italic">
            Filters
          </h4>
          <button
            onClick={() => setFilterType("latest")}
            className={`px-3 py-2 rounded-lg border w-full ${
              filterType === "latest"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setFilterType("cod")}
            className={`px-3 py-2 rounded-lg border w-full ${
              filterType === "cod"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            COD Orders
          </button>
          <button
            onClick={() => setFilterType("ssl")}
            className={`px-3 py-2 rounded-lg border w-full ${
              filterType === "ssl"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            SSL Orders
          </button>

          <h4 className="text-lg font-semibold mt-4 w-full">Status</h4>
          {["Pending", "Shipping", "Rejected", "Delivered"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg border w-full ${
                statusFilter === status
                  ? "bg-green-600 text-white"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
          <button
            onClick={() => {
              setFilterType("");
              setStatusFilter("");
            }}
            className={`px-3 py-2 rounded-lg border w-full ${
              filterType === "" && statusFilter === ""
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            All Orders
          </button>
        </div>

        {/* Orders Card */}
        <div className="lg:col-span-3 md:col-span-2 col-span-1 grid grid-cols-1 gap-5">
          {isLoading ? (
            <BounceLoader className="mx-auto" color="#000" size={50} />
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                data-aos="zoom-in"
                key={order._id}
                className={`border-2 rounded-lg shadow hover:shadow-lg duration-300 p-5 flex flex-col gap-3 bg-white`}
              >
                <div className="w-full flex items-end flex-wrap-reverse justify-between gap-5">
                  {/* info */}
                  <div className="w-fit flex flex-col items-start gap-4">
                    <h3 className="font-bold text-lg flex items-center gap-1 flex-wrap w-fit">
                      Order ID:
                      <span className="text-gray-600">{order._id}</span>
                    </h3>
                    <div className="w-fit flex flex-col items-start gap-2">
                      <p className="flex items-center gap-1 flex-wrap w-fit">
                        <strong>Customer:</strong>{" "}
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
                        <strong>Date:</strong>{" "}
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {/* status controls */}
                  <div className="flex md:flex-col flex-wrap gap-3 w-fit items-center justify-start font-medium">
                    {order.orderStatus === "pending" ? (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(order._id, "shipping")
                          }
                          className="px-3 py-1 rounded bg-sky-600 text-white hover:bg-sky-800 duration-300 w-full"
                        >
                          Shipping
                        </button>
                        {order.paymentInfo?.status !== "VALID" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(order._id, "rejected")
                            }
                            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-800 duration-300 w-full"
                          >
                            Reject
                          </button>
                        )}
                      </>
                    ) : order.orderStatus === "shipping" ? (
                      <button
                        onClick={() =>
                          handleStatusUpdate(order._id, "delivered")
                        }
                        className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-800 duration-300 w-full"
                      >
                        Delivered
                      </button>
                    ) : order.orderStatus === "delivered" &&
                      order.paymentStatus === "pending" &&
                      order.method === "COD" ? (
                      <button
                        onClick={() => handleMarkPaid(order._id)}
                        className="px-3 py-1 rounded bg-purple-600 text-white hover:bg-purple-800 duration-300 w-full"
                      >
                        Paid
                      </button>
                    ) : (
                      order.paymentInfo?.status !== "VALID" &&
                      order.orderStatus === "rejected" && (
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="px-3 py-1 rounded bg-gray-400 text-white hover:bg-gray-800 duration-300 w-full"
                        >
                          Delete
                        </button>
                      )
                    )}
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
            ))
          ) : (
            <p className="py-10 text-center font-medium">No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
