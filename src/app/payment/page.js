'use client';

import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Loader from '../loader/page';
import CartContext from '../cartcontext/cartcontext';

export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState('jazzcash');
  const [totalAmount, setTotalAmount] = useState(0);
  const [openSuccessModel, setOpenSuccessModel] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { cartItems, setCartItems } = useContext(CartContext);


  useEffect(() => {
    let storedCart = [];

    try {
      storedCart = cartItems ? cartItems : [];
    } catch (error) {
      console.error('Failed to parse cart:', error);
    }

    setCartItems(storedCart);

const subtotal = storedCart.reduce((acc, item) => {
  const price = Number(item.price) || 0;
  const quantity = Number(item.quantity) || 0;
  return acc + price * quantity;
}, 0);

    const discount = subtotal * 0.1;
    const shipping = storedCart.length > 0 ? 200 : 0;
    const tax = (subtotal - discount) * 0.07;
    const total = subtotal - discount + shipping + tax;

    setTotalAmount(Math.round(total));
  }, [cartItems]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    jazzcashNumber: '',
    jazzcashPin: '',
    easypaisaNumber: '',
    easypaisaPin: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const { fullName, email, phone, address } = formData;

    // Basic shipping info validation
    if (!fullName || !email || !phone || !address ) {
      toast.error('Please fill out all shipping fields.');
      return false;
    }

    // ✅ Email must contain @ and be valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return false;
    }E

    // ✅ Pakistani phone number|E validation (11 digits, starts with 03)
    const phoneRegex = /^(03[0-9]{9}|\+923[0-9]{9})$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Phone number must contain 11 digits.');
      return false;
    }


    // ✅ Payment method-specific validation
    if (selectedMethod === 'jazzcash') {
      if (!formData.jazzcashNumber || !formData.jazzcashPin) {
        toast.error('Please fill JazzCash number and PIN.');
        return false;
      }
    } else if (selectedMethod === 'easypaisa') {
      if (!formData.easypaisaNumber || !formData.easypaisaPin) {
        toast.error('Please fill EasyPaisa number and PIN.');
        return false;
      }
    } else if (selectedMethod === 'card') {
      if (!formData.cardNumber || !formData.expiry || !formData.cvv || !formData.cardName) {
        toast.error('Please complete all card details.');
        return false;
      }
    }

    return true; // ✅ All checks passed
  };

const handlePayment = async () => {
  if (!validateForm()) return;
  setIsLoading(true);

  if (selectedMethod === 'cod') {
    try {
      const res = await fetch('/api/payment/cod', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          cartItems,
          amount: totalAmount,
          paymentStatus: 'pending',
          paymentMethod: 'Cash on Delivery',
        }),
      });

      const data = await res.json();

      if (data.success) {
        const coupon = JSON.parse(localStorage.getItem('appliedCoupon'));
        if (coupon && coupon.id && !coupon.used) {
          await fetch('/api/coupon', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: coupon.id }),
          });
        }

        localStorage.removeItem('cart');
        localStorage.removeItem('appliedCoupon');
        setCartItems([]);
        setOpenSuccessModel(true);
        toast.success('Order placed with Cash on Delivery!');
      } else {
        toast.error('Failed to place COD order.');
      }
    } catch (err) {
      console.error('COD error:', err);
      toast.error('Failed to place order.');
    }
    setIsLoading(false);
    return;
  }

  if (['card', 'easypaisa', 'jazzcash'].includes(selectedMethod)) {
    try {
      const res = await fetch('/api/payment/redirect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          cartItems,
          amount: totalAmount,
          method: selectedMethod,
        }),
      });

      const data = await res.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        toast.error('Failed to redirect to payment gateway.');
      }
    } catch (err) {
      console.error(`${selectedMethod} payment error:`, err);
      toast.error('Payment failed. Please try again.');
    }
  }

  setIsLoading(false);
};


  return (
    <>
      {isLoading && <Loader />}
      <div className="min-h-60vh pt-45 bg-[#f3f4f6] text-gray-900 py-12 px-4 md:px-10 lg:px-20">
        <h1 className="text-3xl font-bold mb-10 text-center">Secure Checkout</h1>
        <div className="flex flex-col lg:flex-row gap-8 shadow-lg">
          {/* Shipping Address */}
          <div className="bg-[#f9fafb] p-6 shadow w-full lg:w-1/2">
            <h2 className="text-xl font-semibold mb-6 border-b pb-3">Shipping Address</h2>
            <form className="space-y-5">
              {['fullName', 'email', 'phone', 'address'].map((field, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium mb-1">
                    {field === 'fullName' ? 'Full Name' : field[0].toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    name={field}
                    type="text"
                    placeholder={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full border rounded-sm border-gray-300 text-gray-900 placeholder-gray-400 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              ))}
            </form>
          </div>

          {/* Payment Methods */}
          <div className="bg-[#f9fafb] p-6 shadow w-full lg:w-1/2">
            <h2 className="text-xl font-semibold mb-6 border-b pb-3">Payment Method</h2>

            <div className="flex flex-wrap gap-3 mb-6">
              {['card', 'cod'].map((method) => (
                <button
                  key={method}
                  className={`px-4 py-2 text-sm border transition duration-150 ${selectedMethod === method
                    ? 'bg-red-600 text-white border-red-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  style={{ borderRadius: '0px' }}
                  onClick={() => setSelectedMethod(method)}
                >
                  {method === 'card' && 'Debit/Credit Card'}
                  {method === 'cod' && 'Cash on Delivery'}
                </button>
              ))}
            </div>

            {/* {selectedMethod === 'jazzcash' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mobile Number</label>
                  <input
                    name="jazzcashNumber"
                    value={formData.jazzcashNumber}
                    onChange={handleChange}
                    placeholder="03XXXXXXXXX"
                    className="w-full rounded-sm border border-gray-300 px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">PIN</label>
                  <input
                    name="jazzcashPin"
                    type="password"
                    value={formData.jazzcashPin}
                    onChange={handleChange}
                    placeholder="****"
                    className="w-full rounded-sm border border-gray-300 px-4 py-2"
                  />
                </div>
              </div>
            )}

            {selectedMethod === 'easypaisa' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mobile Number</label>
                  <input
                    name="easypaisaNumber"
                    value={formData.easypaisaNumber}
                    onChange={handleChange}
                    placeholder="03XXXXXXXXX"
                    className="w-full rounded-sm border border-gray-300 px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">PIN</label>
                  <input
                    name="easypaisaPin"
                    type="password"
                    value={formData.easypaisaPin}
                    onChange={handleChange}
                    placeholder="****"
                    className="w-full rounded-sm border border-gray-300 px-4 py-2"
                  />
                </div>
              </div>
            )} */}

            {selectedMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <input
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    className="w-full rounded-sm border border-gray-300 px-4 py-2"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">Expiry Date</label>
                    <input
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="w-full rounded-sm border border-gray-300 px-4 py-2"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className="w-full rounded-sm border border-gray-300 px-4 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                  <input
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full rounded-sm border border-gray-300 px-4 py-2"
                  />
                </div>
              </div>
            )}

            {selectedMethod === 'cod' && (
              <div className="text-sm text-gray-700 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-sm">
                <p><strong>Note:</strong> You will pay in cash upon receiving the order at your address.</p>
              </div>
            )}

            <button
              className="mt-6 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm uppercase tracking-wide"
              onClick={handlePayment}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
      {openSuccessModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white shadow-lg p-8 rounded-lg text-center max-w-md w-full mx-4 relative">
            <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Order Placed!</h1>
            <p className="mb-6 text-sm text-gray-700">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2 bg-red-600 text-white font-semibold text-sm rounded hover:bg-red-700 transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}

    </>
  );
}
