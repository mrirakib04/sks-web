import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const OrdersStat = () => {
  const AxiosSecure = useAxiosSecure();
  const { data: ordersStat = [] } = useQuery({
    queryKey: ["ordersStat"],
    queryFn: async () => {
      const res = await AxiosSecure.get(`/admin/home/order/stats`);
      return res.data;
    },
    retry: 3,
    retryDelay: 2000,
  });

  return (
    <div className="w-full h-[400px] bg-white p-5">
      <h2 className="lg:text-3xl md:text-2xl text-xl font-bold mb-3 text-center">
        Last 10 Days Orders
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={ordersStat}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="cod" name="COD Orders" fill="#C24100" />
          <Bar dataKey="ssl" name="SSL Orders" fill="#2B7FFF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersStat;
