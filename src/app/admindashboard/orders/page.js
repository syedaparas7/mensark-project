'use client';
import Loader from "@/app/loader/page";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function OrdersTable() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("All");
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const res = await fetch("/api/order");
                const allOrders = await res.json();
                setOrders(allOrders);
            } catch (error) {
                console.error("Failed to fetch Orders:", error);
            }
            setIsLoading(false);
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        if (selectedOrder) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [selectedOrder]);

    const updateStatus = async (id, status) => {
        setIsLoading(true);
        try {
            const paymentStatus = status.toLowerCase() === "delivered" ? "Paid" : undefined;

            await fetch("/api/order", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status, ...(paymentStatus && { paymentStatus }) }),
            });

            setOrders((prev) =>
                prev.map((order) =>
                    order.id === id ? { ...order, status, ...(paymentStatus && { paymentStatus }) } : order
                )
            );
        } catch (err) {
            console.error("Error updating status:", err.message);
        }
        setIsLoading(false);
    };

    const deleteOrder = async (id) => {
        if (!confirm("Are you sure you want to delete this order?")) return;
        setIsLoading(true);
        try {
            await fetch("/api/order", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            setOrders((prev) => prev.filter((o) => o.id !== id));
        } catch (err) {
            console.error("Failed to delete order:", err.message);
        }
        setIsLoading(false);
    };

    const filteredOrders = statusFilter === "All"
        ? orders
        : orders.filter((order) => order.status === statusFilter);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <>
            {isLoading && <Loader />}
            <div className="w-full pb-20 overflow-x-auto pt-30 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-gray-200">
                <h2 className="mb-6 text-2xl font-semibold text-gray-800">Orders</h2>

                {/* Status Filter */}
                <div className="mb-4 flex items-center gap-4 flex-wrap">
                    <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1); // reset page on filter change
                        }}
                        className="rounded border border-gray-700 px-3 py-1 text-sm bg-white text-gray-900"
                    >
                        <option value="All">All</option>
                        <option value="Order Placed">Order Placed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Dispatch">Dispatch</option>
                        <option value="Delivered">Delivered</option>
                    </select>

                </div>

                {/* Table */}
                <table className="min-w-full divide-y divide-gray-300 text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-500">
                        <tr>
                            <th className="px-4 py-3">Order #</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Contact</th>
                            <th className="px-4 py-3">Address</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">View</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Payment</th>
                            <th className="px-4 py-3">Update</th>
                            <th className="px-4 py-3">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 text-sm">
                                <td className="px-4 py-2 font-medium text-gray-900">{order.id}</td>
                                <td className="px-4 py-2">{order?.fullName}</td>
                                <td className="px-4 py-2">{order?.phone}</td>
                                <td className="px-4 py-2">{order?.address}, {order?.city}</td>
                                <td className="px-4 py-2">{order?.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        View Details
                                    </button>
                                </td>
                                <td className="px-4 py-2 font-semibold text-gray-800">Rs{order?.amount}</td>
                                <td className="px-4 py-2">
                                    <span className={
                                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold " +
                                        (order.status === "order Placed"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : order.status === "Processing"
                                                ? "bg-blue-100 text-blue-700"
                                                : order.status === "Shipped"
                                                    ? "bg-indigo-100 text-indigo-700"
                                                    : order.status === "Delivered"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700")
                                    }>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {order?.paymentStatus}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    <select
                                        value={order?.status}
                                        onChange={(e) => updateStatus(order?.id, e.target.value)}
                                        className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                                    >
                                        {['Order Placed', 'Shipped', 'Out for Delivery', 'Delivered'].map((status) => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-4 py-2">
                                    {order.status === "Delivered" ? (
                                        <button onClick={() => deleteOrder(order?.id)} className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700">
                                            Delete
                                        </button>
                                    ) : (
                                        <span className="text-gray-400 italic text-sm">N/A</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded text-gray-800 bg-white hover:bg-gray-100 disabled:opacity-40"
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 border rounded ${currentPage === i + 1
                                ? 'bg-red-600 text-white'
                                : 'bg-white text-black hover:bg-gray-100'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded text-gray-800 bg-white hover:bg-gray-100 disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
                    <div className="bg-white text-gray-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative scrollbar-hide">
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-black"
                        >
                            ✕
                        </button>

                        <h3 className="text-2xl font-bold mb-6">Order Details</h3>

                        <div className="space-y-2 text-sm">
                            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                            <p><strong>Customer:</strong> {selectedOrder.fullName}</p>
                            <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                            <p><strong>Address:</strong> {selectedOrder.address}, {selectedOrder.city}</p>
                            <p><strong>Status:</strong> {selectedOrder.status}</p>
                            <p><strong>Payment:</strong> {selectedOrder.paymentStatus}</p>
                            <p><strong>Date:</strong> {selectedOrder.createdAt?.seconds
                                ? new Date(selectedOrder.createdAt.seconds * 1000).toLocaleDateString()
                                : 'N/A'}</p>
                        </div>

                        <hr className="my-4" />

                        <h4 className="text-xl font-semibold mb-2">Items</h4>
                        <div className="space-y-4">
                            {selectedOrder.cartItems.map((item, i) => (
                                <div key={i} className="flex gap-4 items-start border p-3 rounded-md bg-gray-50">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={60}
                                        height={80}
                                        className="rounded object-cover border w-16 h-16"
                                    />
                                    <div className="text-sm flex-1">
                                        <p className="font-medium">{item.title}</p>
                                        <p><strong>Color:</strong> {item.color}</p>
                                        <p><strong>Size:</strong> {item.size}</p>
                                        <p><strong>Quantity:</strong> {item.quantity}</p>
                                        <p><strong>Price:</strong> Rs{item.price}</p>
                                        <p><strong>Subtotal:</strong> Rs{item.quantity * item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <hr className="my-6" />

                        <div className="text-right text-lg font-semibold">
                            Total Amount: Rs{selectedOrder.amount}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
