import { Link, useSearchParams } from "react-router";
import useAxiosPublic from "../../../../../Hooks/useAxiosPublic";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "jspdf-autotable";
import MainContext from "../../../../../Context/MainContext";

const OrderSuccess = () => {
  const { setCart } = useContext(MainContext);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const AxiosPublic = useAxiosPublic();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      AxiosPublic.get(`/orders/${orderId}`)
        .then((res) => setOrder(res.data))
        .catch(() => toast.error("Failed to fetch order info"));
    }
  }, [orderId]);

  useEffect(() => {
    if (order) {
      setCart([]);
    }
  }, [order]);

  // 📄 PDF Generator
  const downloadInvoice = () => {
    if (!order) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("SKS Payment Invoice", 70, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, 14, 35);
    doc.text(`Customer: ${order.customer?.name || "N/A"}`, 14, 42);
    doc.text(`Email: ${order.customer?.email || "N/A"}`, 14, 49);
    doc.text(
      `Transaction ID: ${order.paymentInfo?.transactionId || "N/A"}`,
      14,
      56
    );
    doc.text(
      `Created At: ${new Date(order.createdAt).toLocaleString()}`,
      14,
      63
    );

    const cartData = order.cart.map((item, index) => [
      index + 1,
      item.name,
      item.quantity,
      item.price,
      item.quantity * item.price,
      item.discount,
      item.quantity * item.discountedPrice,
    ]);

    autoTable(doc, {
      startY: 75,
      head: [["#", "Product", "Qty", "Price", "Total", "Discount %", "Net"]],
      body: cartData,
    });

    const finalY = doc.lastAutoTable?.finalY || 100;
    doc.text(`Net Total: ${order.netTotal}`, 14, finalY + 10);
    doc.text(`Payment Method: ${order.method}`, 14, finalY + 17);
    doc.text(`Payment Status: ${order.paymentStatus}`, 14, finalY + 24);

    doc.save(`SKS-invoice-${order._id}.pdf`);
  };

  return (
    <div className="px-5 py-10 text-center flex flex-col items-center gap-5">
      <div>
        <h2 className="text-3xl font-bold mb-1 text-green-600">
          Order Successful!
        </h2>
        <p className="mb-3">
          {order?.method === "SSL"
            ? "Your payment was successful."
            : "Your order has been posted"}
        </p>
      </div>
      {order && (
        <div className="border p-5 rounded-lg inline-block text-left">
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
          <p>
            <strong>Total:</strong> ৳{order.netTotal}
          </p>
          <p>
            <strong>Payment Method:</strong> {order?.method}
          </p>
          <p>
            <strong>Status:</strong> {order.paymentInfo?.status || "Pending"}
          </p>
        </div>
      )}
      {/* Download PDF Button */}
      <button
        onClick={downloadInvoice}
        className="mt-4 bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-800 duration-300"
      >
        Download Invoice (PDF)
      </button>
      <div className="mt-5">
        <Link to="/cart" className="text-blue-600 underline font-medium">
          Back to Cart
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
