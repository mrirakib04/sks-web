import { HeadProvider, Title } from "react-head";
import { useContext, useEffect, useState } from "react";
import MainContext from "../../../../Context/MainContext";
import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { Button, MenuItem, TextField } from "@mui/material";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { toast } from "react-toastify";

const Cart = () => {
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart, user } =
    useContext(MainContext);
  const AxiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // Calculate total price
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.discountedPrice * item.quantity,
    0
  );

  const [deliveryFee, setDeliveryFee] = useState(0);

  const netTotal = totalPrice + deliveryFee;

  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    address: "",
    district: "Dhaka",
    postcode: 1100,
    country: "Bangladesh",
    notes: "",
    orderStatus: "pending",
  });

  useEffect(() => {
    if (formData.district === "Dhaka") {
      setDeliveryFee(70);
    } else {
      setDeliveryFee(120);
    }
  }, [formData.district]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // COD order (anyone can place)
  const handleCOD = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    const { name, email, phone, address, district, postcode } = formData;
    if (!name || !email || !phone || !address || !district || !postcode) {
      toast.error("Please fill all required fields!");
      return;
    }
    const orderDetails = {
      ...formData,
      cart,
      totalPrice,
      deliveryFee,
      netTotal,
      method: "COD",
      city: formData.district,
      state: formData.district,
    };

    AxiosPublic.post("/orders/cod", orderDetails)
      .then((res) => {
        toast.success("Order placed successfully (Cash on Delivery)!");
        const orderId = res.data.orderId;
        navigate(`/order-success?orderId=${orderId}`); // redirect
      })
      .catch(() => toast.error("Failed to place order!"));
  };

  // SSL order (only if logged in)
  const handleSSL = () => {
    if (!user) {
      toast.warn("Please login to continue with SSL Payment");
      navigate("/login");
      return;
    }
    const { name, email, phone, address, district, postcode } = formData;
    if (!name || !email || !phone || !address || !district || !postcode) {
      toast.error("Please fill all required fields!");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    const orderDetails = {
      ...formData,
      cart,
      totalPrice,
      deliveryFee,
      netTotal,
      method: "SSL",
      city: formData.district,
      state: formData.district,
    };

    AxiosPublic.post("/orders/ssl", orderDetails)
      .then((res) => {
        if (res.data?.redirectUrl) {
          window.location.href = res.data.redirectUrl; // redirect to SSLCommerz gateway
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("SSL Payment initiation failed!");
      });
  };

  return (
    <div className="sm:px-10 px-5 py-10 w-full">
      <HeadProvider>
        <Title>Cart || Sinthia Kitchen Shop</Title>
      </HeadProvider>
      <h2 className="md:text-3xl text-2xl font-bold mb-5">Your Cart</h2>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 w-full">
        <form
          onSubmit={handleCOD}
          className="lg:col-span-3 md:col-span-2 col-span-1 border p-5 rounded-lg flex flex-col gap-3 h-fit w-full"
        >
          <h3 className="text-xl font-semibold mb-2">Checkout Information</h3>
          {/* customer info */}
          <TextField
            autoComplete="name"
            id="name"
            name="name"
            label="Full Name"
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <div className="flex md:flex-row flex-col gap-3">
            <TextField
              autoComplete="email"
              id="email"
              name="email"
              type="email"
              label="Email Address"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              autoComplete="tel"
              name="phone"
              type="tel"
              label="Phone Number"
              variant="outlined"
              value={formData.phone}
              onChange={handleChange}
              required
              fullWidth
            />
          </div>
          {/* address */}
          <TextField
            autoComplete="address"
            id="address"
            name="address"
            label="Shipping Address"
            variant="outlined"
            multiline
            rows={3}
            value={formData.address}
            onChange={handleChange}
            required
            fullWidth
          />
          {/* district-postcode */}
          <div className="flex md:flex-row flex-col gap-3">
            <TextField
              autoComplete="district"
              id="district"
              select
              name="district"
              label="District"
              value={formData.district}
              onChange={handleChange}
              defaultValue={"Dhaka"}
              required
              fullWidth
            >
              <MenuItem value="Bagerhat">Bagerhat</MenuItem>
              <MenuItem value="Bandarban">Bandarban</MenuItem>
              <MenuItem value="Barguna">Barguna</MenuItem>
              <MenuItem value="Barishal">Barishal</MenuItem>
              <MenuItem value="Bhola">Bhola</MenuItem>
              <MenuItem value="Bogura">Bogura</MenuItem>
              <MenuItem value="Brahmanbaria">Brahmanbaria</MenuItem>
              <MenuItem value="Chandpur">Chandpur</MenuItem>
              <MenuItem value="Chattogram">Chattogram</MenuItem>
              <MenuItem value="Chuadanga">Chuadanga</MenuItem>
              <MenuItem value="Cox's Bazar">Cox's Bazar</MenuItem>
              <MenuItem value="Cumilla">Cumilla</MenuItem>
              <MenuItem value="Dhaka">Dhaka</MenuItem>
              <MenuItem value="Dinajpur">Dinajpur</MenuItem>
              <MenuItem value="Faridpur">Faridpur</MenuItem>
              <MenuItem value="Feni">Feni</MenuItem>
              <MenuItem value="Gaibandha">Gaibandha</MenuItem>
              <MenuItem value="Gazipur">Gazipur</MenuItem>
              <MenuItem value="Gopalganj">Gopalganj</MenuItem>
              <MenuItem value="Habiganj">Habiganj</MenuItem>
              <MenuItem value="Jamalpur">Jamalpur</MenuItem>
              <MenuItem value="Jashore">Jashore</MenuItem>
              <MenuItem value="Jhalokati">Jhalokati</MenuItem>
              <MenuItem value="Jhenaidah">Jhenaidah</MenuItem>
              <MenuItem value="Joypurhat">Joypurhat</MenuItem>
              <MenuItem value="Khagrachhari">Khagrachhari</MenuItem>
              <MenuItem value="Khulna">Khulna</MenuItem>
              <MenuItem value="Kishoreganj">Kishoreganj</MenuItem>
              <MenuItem value="Kurigram">Kurigram</MenuItem>
              <MenuItem value="Kushtia">Kushtia</MenuItem>
              <MenuItem value="Lakshmipur">Lakshmipur</MenuItem>
              <MenuItem value="Lalmonirhat">Lalmonirhat</MenuItem>
              <MenuItem value="Madaripur">Madaripur</MenuItem>
              <MenuItem value="Magura">Magura</MenuItem>
              <MenuItem value="Manikganj">Manikganj</MenuItem>
              <MenuItem value="Meherpur">Meherpur</MenuItem>
              <MenuItem value="Moulvibazar">Moulvibazar</MenuItem>
              <MenuItem value="Munshiganj">Munshiganj</MenuItem>
              <MenuItem value="Mymensingh">Mymensingh</MenuItem>
              <MenuItem value="Naogaon">Naogaon</MenuItem>
              <MenuItem value="Narail">Narail</MenuItem>
              <MenuItem value="Narayanganj">Narayanganj</MenuItem>
              <MenuItem value="Narsingdi">Narsingdi</MenuItem>
              <MenuItem value="Natore">Natore</MenuItem>
              <MenuItem value="Netrokona">Netrokona</MenuItem>
              <MenuItem value="Nilphamari">Nilphamari</MenuItem>
              <MenuItem value="Noakhali">Noakhali</MenuItem>
              <MenuItem value="Pabna">Pabna</MenuItem>
              <MenuItem value="Panchagarh">Panchagarh</MenuItem>
              <MenuItem value="Patuakhali">Patuakhali</MenuItem>
              <MenuItem value="Pirojpur">Pirojpur</MenuItem>
              <MenuItem value="Rajbari">Rajbari</MenuItem>
              <MenuItem value="Rajshahi">Rajshahi</MenuItem>
              <MenuItem value="Rangamati">Rangamati</MenuItem>
              <MenuItem value="Rangpur">Rangpur</MenuItem>
              <MenuItem value="Satkhira">Satkhira</MenuItem>
              <MenuItem value="Shariatpur">Shariatpur</MenuItem>
              <MenuItem value="Sherpur">Sherpur</MenuItem>
              <MenuItem value="Sirajganj">Sirajganj</MenuItem>
              <MenuItem value="Sunamganj">Sunamganj</MenuItem>
              <MenuItem value="Sylhet">Sylhet</MenuItem>
              <MenuItem value="Tangail">Tangail</MenuItem>
              <MenuItem value="Thakurgaon">Thakurgaon</MenuItem>
            </TextField>
            <TextField
              inputMode="numeric"
              type="number"
              name="postcode"
              label="Postcode"
              variant="outlined"
              value={formData.postcode}
              onChange={handleChange}
              required
              fullWidth
            ></TextField>
          </div>
          {/* notes */}
          <TextField
            autoComplete="notes"
            id="notes"
            name="notes"
            label="Order Notes (Optional)"
            variant="outlined"
            multiline
            rows={2}
            value={formData.notes}
            onChange={handleChange}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="mt-3"
          >
            <p className="font-semibold py-1">Cash On Delivery</p>
          </Button>
          <p className="font-semibold py-1 text-center">OR</p>
          <Button
            type="button"
            onClick={handleSSL}
            variant="contained"
            color="secondary"
            fullWidth
          >
            <p className="font-semibold py-1">SSL Payment</p>
          </Button>
        </form>
        {cart.length === 0 ? (
          <p className="text-center text-gray-600 col-span-1 w-full">
            Your cart is empty.
          </p>
        ) : (
          <div className="flex flex-col gap-5 col-span-1 p-5 border rounded-xl">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col items-start gap-3 border rounded p-3 shadow"
              >
                <div className="flex items-center gap-3">
                  <Link to={`/product/${item._id}`}>
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </Link>
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-600 font-medium">
                      ৳{item.discountedPrice}
                    </p>
                  </div>
                </div>
                <div className="flex items-center w-full justify-between gap-5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decreaseQuantity(item._id)}
                      className="p-1 border rounded"
                    >
                      <FaMinus></FaMinus>
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item._id)}
                      className="p-1 border rounded"
                    >
                      <FaPlus></FaPlus>
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 text-2xl"
                  >
                    <FaTrashAlt></FaTrashAlt>
                  </button>
                </div>
              </div>
            ))}

            <div className="text-right text-lg mt-5 flex items-center gap-1 flex-wrap justify-between">
              <span className="font-bold text-emerald-600">Total:</span>
              <span className="font-medium">{totalPrice} (BDT)</span>
            </div>
            <div className="text-right text-lg mt-1 flex items-center gap-1 flex-wrap justify-between">
              <span className="font-bold text-orange-600">
                Delivery: ({formData.district})
              </span>
              <span className="font-medium">{deliveryFee} (BDT)</span>
            </div>
            <div className="text-right text-lg mt-1 flex items-center gap-1 flex-wrap justify-between">
              <span className="font-bold text-sky-600">Net:</span>
              <span className="font-medium">{netTotal} (BDT)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
