"use client";
import { useEffect, useState } from "react";
import { LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FiTrash2 } from "react-icons/fi";
import Loader from "../loader/page";

export default function AdminDashboardWelcome() {
  const [revenue, setRevenue] = useState(0);
  const [openCreateCouponModel, setOpenCreateCouponModel] = useState(false)
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [couponType, setCouponType] = useState("percentage");
  const [expireIn, setExpireIn] = useState("2");
  const [expirationDate, setExpirationDate] = useState("");
  const [coupons, setCoupons] = useState(null);
  const [couponCreated, setCouponCreated] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/order');
        const allOrders = await res.json()
        setOrders(allOrders)
      } catch (error) {
        console.error('Failed to fetch Orders:', error);
      }
      setIsLoading(false)
    }

    fetchOrders()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/product');
        const allProducts = await res.json()
        setProducts(allProducts)
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
      setIsLoading(false)
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/users');
        const allUsers = await res.json()
        setUsers(allUsers)
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
      setIsLoading(false)
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    const fetchCoupons = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/coupon');
        const data = await res.json();
        setCoupons(data);
      } catch (err) {
        console.error('Failed to load coupons:', err);
      }
      setIsLoading(false)
    };

    fetchCoupons();
  }, [couponCreated]);

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    setIsLoading(true);

    const totalRevenue = orders.reduce((total, order) => {
      if (order.paymentStatus === "paid") {
        return total + Number(order.amount || 0);
      }
      return total;
    }, 0);

    setRevenue(totalRevenue);
    setIsLoading(false);
  }, [orders]);


  useEffect(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + parseInt(expireIn));
    setExpirationDate(date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }));
  }, [expireIn]);

  return (
    <> {isLoading && <Loader />}
      <section className="relative w-full min-h-screen bg-gray-900 overflow-hidden">
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1950&q=80"
          alt="Admin Dashboard Background"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          fill
          priority
        />

        {/* Top-left Icon */}
        <div className="absolute top-5 pt-30 left-5 z-20 flex items-center space-x-2">
          <LayoutDashboard className="w-8 h-8 text-white" />
          <span className="text-white text-xl font-semibold hidden sm:block">Dashboard</span>
        </div>

        <button className="absolute top-5 mt-30 right-5 z-20 bg-white text-gray-800 font-semibold px-4 py-2 rounded-md shadow hover:bg-gray-100 transition duration-200 flex items-center space-x-2"
          onClick={() => setOpenCreateCouponModel(true)}>
          <span className="text-sm sm:text-base">Create Coupon</span>
        </button>


        {/* Overlay Welcome Content */}
        <div className="relative z-10 flex pt-60 flex-col items-center justify-center h-full px-4 text-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 sm:p-12 max-w-2xl mx-auto mb-10">
            <h1 className="text-white text-4xl sm:text-5xl font-bold mb-4">
              Welcome, Admin!
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl">
              Manage your products, orders, users, and more in one place.
            </p>
          </div>

          {/* Stats Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl px-4">
            {/* Products Card */}
            <Link href="/admindashboard/products">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow text-left hover:bg-white transition cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-800 font-semibold text-lg">Products</h3>
                  <Package className="text-gray-700 w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{products && products?.length}</p>
                <p className="text-sm text-gray-600">Active items</p>
              </div>
            </Link>

            {/* Orders Card */}
            <Link href="/admindashboard/orders">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow text-left hover:bg-white transition cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-800 font-semibold text-lg">Orders</h3>
                  <ShoppingCart className="text-gray-700 w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{orders && orders?.length}</p>
                <p className="text-sm text-gray-600">Total orders</p>
              </div>
            </Link>

            {/* Customers Card */}
            <Link href="/admindashboard/users">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow text-left hover:bg-white transition cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-800 font-semibold text-lg">Users</h3>
                  <Users className="text-gray-700 w-6 h-6" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{users && users?.length}</p>
                <p className="text-sm text-gray-600">Registered users</p>
              </div>
            </Link>

            {/* Revenue Card */}
            <Link href="">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow text-left hover:bg-white transition cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-800 font-semibold text-lg">Revenue</h3>
                  <span className="text-gray-700 font-bold text-lg">PKR</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">Rs{revenue}</p>
                <p className="text-sm text-gray-600">This month</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
      {openCreateCouponModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="relative mt-10 w-full max-w-lg max-h-[80vh] scrollbar-hide overflow-y-auto bg-white text-gray-900 rounded-lg shadow-xl p-6 space-y-6">
            {/* Close Button */}
            <button
              onClick={() => setOpenCreateCouponModel(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-gray-800">
              Create a One-Time Coupon
            </h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setMessage("");

                const expirationDateObj = new Date();
                expirationDateObj.setMonth(
                  expirationDateObj.getMonth() + parseInt(expireIn)
                );

                try {
                  const res = await fetch("/api/coupon", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      action: "create",
                      code,
                      discount: parseFloat(discount),
                      type: couponType,
                      used: false,
                      expiresAt: expirationDateObj.toISOString(),
                    }),
                  });

                  const data = await res.json();

                  if (res.ok) {
                    setMessage("Coupon created successfully!");
                    setCode("");
                    setDiscount("");
                    setCouponType("percentage");
                    setExpireIn("2");

                    setCouponCreated(prev => !prev);
                  } else {
                    setMessage(data.error || "Something went wrong.");
                  }
                } catch (error) {
                  setMessage("Error creating coupon.");
                } finally {
                  setLoading(false);
                }
              }}
              className="space-y-4"
            >
              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="e.g. SUMMER25"
                  className="w-full border border-gray-300 rounded-md p-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Coupon Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={couponType}
                  onChange={(e) => setCouponType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (PKR)</option>
                </select>
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  required
                  min="1"
                  placeholder={couponType === "percentage" ? "e.g. 20" : "e.g. 50"}
                  className="w-full border border-gray-300 rounded-md p-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Expiration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expires In
                </label>
                <select
                  value={expireIn}
                  onChange={(e) => setExpireIn(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="1">1 Month</option>
                  <option value="2">2 Months</option>
                </select>
                <p className="text-sm text-gray-600 mt-1">
                  Will expire on: <strong>{expirationDate}</strong>
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-150 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Coupon"}
              </button>

              {/* Message */}
              {message && (
                <p
                  className={`text-sm font-medium ${message.startsWith("✅") ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {message}
                </p>
              )}


              {coupons && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Existing Coupons</h3>

                  {coupons.length > 0 ? (
                    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                      {coupons.map((coupon) => (
                        <li key={coupon.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-800">{coupon.code}</p>
                              <p className="text-sm text-gray-600">
                                {coupon.type === "percentage"
                                  ? `${coupon.discount}% off`
                                  : `PKR ${coupon.discount} off`}
                              </p>
                              <p className="text-sm text-gray-500">
                                Expires: {new Date(coupon.expiresAt).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-500">
                                Used: {coupon.used ? "Yes" : "No"}
                              </p>
                            </div>

                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch(`/api/coupon`, {
                                    method: "DELETE",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ id: coupon.id }),
                                  });

                                  if (res.ok) {
                                    setCouponCreated(prev => !prev);
                                  } else {
                                    const data = await res.json();
                                    alert(data.error || "Failed to delete coupon.");
                                  }
                                } catch (err) {
                                  console.error("Error deleting coupon", err);
                                }
                              }}
                              className="text-red-500 hover:text-red-700 text-sm ml-4"
                              title="Delete coupon"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </li>
                      ))}

                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No coupons available.</p>
                  )}
                </div>
              )}

            </form>
          </div>
        </div>
      )}
    </>
  );
}
