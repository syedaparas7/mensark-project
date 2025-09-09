'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Loader from '../loader/page';
import { useRouter } from 'next/navigation';

export default function TrackPage() {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState({});
  const [currUser, setCurrUser] = useState(null);
  const [submitted, setSubmitted] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrUser(user)
  }, [])


  useEffect(() => {

    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.email) return;
      setIsLoading(true)

      try {

        const res = await fetch(`/api/track?email=${encodeURIComponent(user.email)}`);
        const userOrders = await res.json();
        setOrders(userOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
      setIsLoading(false)
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.email || orders.length === 0) return;

    orders.forEach(order => {
      order.cartItems?.forEach((item, index) => {
        const productId = item.id || item.title;
        const key = `${order.id}_${index}`;
        checkReviewExists(user.email, productId, key);
      });
    });
  }, [orders]);

  const checkReviewExists = async (email, productId, key) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/review?email=${encodeURIComponent(email)}&productId=${encodeURIComponent(productId)}`);
      const result = await res.json();

      if (result.exists) {
        console.log(`✅ Review exists for ${productId}`);
        setSubmitted(prev => ({ ...prev, [key]: true }));
      } else {
        console.log(`ℹ️ No review found for ${productId}`);
      }
    } catch (error) {
      console.error("Error checking review existence:", error);
    }
    setIsLoading(false)
  };

  const handleReviewChange = (orderId, itemIndex, field, value) => {
    const key = `${orderId}_${itemIndex}`;
    setReviews(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const handleReviewSubmit = async (orderId, itemIndex, item) => {
    const key = `${orderId}_${itemIndex}`;
    const review = reviews[key];
    const user = JSON.parse(localStorage.getItem('user'));

    if (!review?.rating || !review?.comment) {
      alert("Please select a rating and comment.");
      return;
    }

    const fullReview = {
      fullName: user?.fullName || "Anonymous",
      email: user?.email,
      productId: item.id || item.title,
      productTitle: item.title,
      image: item.image,
      rating: review.rating,
      comment: review.comment,
      note: review.note || "",
      createdAt: new Date().toISOString()
    };

    setIsLoading(true)
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullReview)
      });

      if (!res.ok) throw new Error('Failed to submit review');
      setSubmitted(prev => ({ ...prev, [key]: true }));
      console.log("✅ Review submitted:", fullReview);
    } catch (error) {
      console.error("Error submitting review:", error);
      setIsLoading(false)
      toast.error("Failed to submit review. Please try again.");
    }
    setIsLoading(false)
  };

  return (
    <>
      {isLoading && <Loader />}
      {currUser === null ? (
        <div className="min-h-screen flex items-center justify-center text-center bg-[#f3f4f6] text-gray-700 px-4">
          <div>
            <h2 className="text-2xl font-semibold mb-4">🔐 Please login to track your orders</h2>
            <p className="text-sm text-gray-600 mb-4">You need to be signed in to view your order history and leave reviews.</p>
            {/* <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
            >
              Go to Login
            </button> */}
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-[#f3f4f6] text-gray-900 py-12 px-4 md:px-10 lg:px-40">
          <h1 className="text-3xl font-bold mb-10 text-center">📦 Track Your Orders</h1>

          {orders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
          ) : (
            <div className="space-y-10">
              {orders.map(order => (
                <div key={order.id} className="bg-white shadow rounded-lg p-6 border border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between gap-6 text-sm md:text-base">
                    <div className="space-y-1">
                      <p><strong>Order ID:</strong> <span className="text-gray-600">{order.id}</span></p>
                      <p><strong>Placed on:</strong> {order?.createdAt?.seconds
                        ? new Date(order.createdAt.seconds * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                        : 'N/A'}
                      </p>
                      <p><strong>Status:</strong> <span className="text-green-600 font-semibold">{order.status}</span></p>
                      <p><strong>Payment:</strong> {order.paymentMethod} - {order.paymentStatus}</p>
                      <p><strong>Total:</strong> PKR {order.amount}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Shipping Info</p>
                      <p>{order.fullName}</p>
                      <p>{order.address}</p>
                      <p>{order.city}, {order.postalCode}</p>
                      <p>{order.phone}</p>
                    </div>
                  </div>

                  <div className="mt-6 border-t pt-4">
                    <h3 className="font-semibold text-lg mb-4">Ordered Items:</h3>
                    <div className="mt-6 space-y-6">
                      {order.cartItems?.map((item, index) => {
                        const key = `${order.id}_${index}`;
                        const review = reviews[key] || {};
                        const isSubmitted = submitted[key];

                        return (
                          <div
                            key={index}
                            className="flex flex-col md:flex-row items-start gap-4 border border-gray-200 rounded-lg p-4 bg-[#fafafa] shadow-sm"
                          >
                            <div className="w-full md:w-40 h-40 relative flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>

                            <div className="flex-1 w-full">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-base font-semibold text-gray-800">{item.title}</h4>
                                  <p className="text-sm text-gray-500">Color: <span className="capitalize">{item.color}</span></p>
                                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                  <p className="text-sm text-gray-700 mt-1 font-medium">
                                    Price: PKR {item.price} × {item.quantity} = <span className="text-green-600 font-bold">PKR {item.price * item.quantity}</span>
                                  </p>
                                </div>
                              </div>

                              {order.status.toLowerCase() === 'delivered' && (
                                <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
                                  {isSubmitted ? (
                                    <p className="text-green-700 text-sm font-medium">🎉 Thank you for your feedback!</p>
                                  ) : (
                                    <>
                                      <p className="text-sm font-medium text-green-700 mb-2">Leave a review:</p>

                                      <div className="flex items-center gap-1 mb-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                          <button
                                            key={star}
                                            onClick={() => handleReviewChange(order.id, index, 'rating', star)}
                                            className={`text-xl transition ${review.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                          >
                                            ★
                                          </button>
                                        ))}
                                      </div>

                                      <div className="flex gap-2 mb-2 flex-wrap">
                                        {[
                                          "Excellent Service",
                                          "High Quality",
                                          "Well Packed",
                                          "Average",
                                          "Delayed",
                                          "Poor Service"
                                        ].map(label => (
                                          <button
                                            key={label}
                                            onClick={() => handleReviewChange(order.id, index, 'comment', label)}
                                            className={`px-3 py-1 text-xs rounded ${review.comment === label
                                              ? 'bg-green-600 text-white'
                                              : 'bg-gray-200 hover:bg-gray-300'
                                              }`}
                                          >
                                            {label}
                                          </button>
                                        ))}
                                      </div>

                                      <textarea
                                        rows={2}
                                        placeholder="Your feedback..."
                                        className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                                        onChange={e => handleReviewChange(order.id, index, 'note', e.target.value)}
                                      />

                                      <button
                                        onClick={() => handleReviewSubmit(order.id, index, item)}
                                        className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                                      >
                                        Submit Review
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {order.status.toLowerCase() === 'delivered' && (
                    <div className="bg-green-50 border border-green-300 rounded p-4 mt-6">
                      <p className="text-green-800 text-sm font-medium">✅ Your order has been delivered. We'd love your feedback on each item above.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>)
      }
    </>
  );
}
