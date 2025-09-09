'use client'

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiTrash } from "react-icons/fi";
import Loader from "../loader/page";
import CartContext from "../cartcontext/cartcontext";

export default function Cart() {
  const [isLoading, setIsLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState(null);
  const [couponError, setCouponError] = useState('');
  const { cartItems, setCartItems } = useContext(CartContext)
  const router = useRouter();

  const handleQuantityChange = (id, delta) => {
    setCartItems((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, quantity: Math.max(1, product.quantity + delta) }
          : product
      )
    );
  };

  const handleRemove = (id) => {
    const updatedProducts = cartItems?.filter((product) => product.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedProducts));
    setCartItems(updatedProducts);
  };

  const applyCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    setIsLoading(true)
    try {
      const res = await fetch('/api/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'apply',
          code,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.used) {
          // Coupon already used
          setDiscountType(null);
          setDiscountValue(0);
          setCouponError('This coupon has already been used.');
          localStorage.removeItem('appliedCoupon');
          return;
        }

        // Coupon is valid and unused
        setDiscountType(data.type);
        setDiscountValue(data.discount);
        setCouponError('');
        localStorage.setItem('appliedCoupon', JSON.stringify(data));
      } else {
        setDiscountType(null);
        setDiscountValue(0);
        setCouponError(data.error || 'Invalid coupon');
      }
    } catch (err) {
      console.error('Coupon apply failed', err);
      setCouponError('Invalid Coupon');
    }
    setIsLoading(false)
  };



  const totalItems = cartItems?.reduce((acc, p) => acc + p.quantity, 0);
  const subtotal = cartItems?.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const discount =
    discountType === 'percentage'
      ? (subtotal * discountValue) / 100
      : discountType === 'fixed'
        ? discountValue
        : 0;
  const shipping = cartItems?.length > 0 ? 200 : 0;
  const tax = (subtotal - discount) * 0.07;
  const total = subtotal - discount + shipping + tax;

  return (
    <>
      {isLoading && <Loader />}
      <div className="bg-gray-100 min-h-screen pt-28 text-gray-900 py-10 px-4">
        <div className="container mx-auto flex flex-col md:flex-row shadow-lg space-y-6 md:space-y-0 md:space-x-4">

          {/* Cart Section */}
          <div className="w-full md:w-3/4 bg-white p-6 rounded-md">
            <div className="flex justify-between border-b border-gray-300 pb-4">
              <h1 className="text-2xl font-bold">Shopping Cart</h1>
              <h2 className="text-2xl font-semibold">{totalItems} Items</h2>
            </div>

            <div className="hidden md:flex text-sm text-gray-600 mt-6 mb-2 font-semibold">
              <h3 className="w-2/6 uppercase">Product</h3>
              <h3 className="w-1/6 text-center uppercase">Size</h3>
              <h3 className="w-1/6 text-center uppercase">Color</h3>
              <h3 className="w-1/6 text-center uppercase">Quantity</h3>
              <h3 className="w-1/6 text-center uppercase">Total</h3>
              <h3 className="w-1/6 text-center uppercase"></h3>
            </div>

            {cartItems?.length > 0 && cartItems.map((product) => (
              <div key={product.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0 hover:bg-gray-100 transition-all duration-200 px-4 py-4 rounded-md">
                <div className="flex w-full md:w-2/6 items-start justify-between gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={70}
                      height={70}
                      className="object-contain rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{product.title}</p>
                    <p className="text-gray-600 text-xs">{product.category}</p>
                    <p className="text-sm text-gray-800 font-semibold mt-1">
                      Rs{Number(product.price)?.toFixed(2)}
                    </p>
                  </div>
                  <FiTrash
                    className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer md:hidden"
                    onClick={() => handleRemove(product.id)}
                  />
                </div>

                <div className="w-full md:w-1/6 text-sm text-gray-700 md:text-center">
                  <span className="md:hidden font-medium">Size: </span>{product.size}
                </div>

                <div className="w-full md:w-1/6 text-sm text-gray-700 md:text-center">
                  <span className="md:hidden font-medium">Color: </span>{product.color}
                </div>

                <div className="w-full md:w-1/6 flex justify-start md:justify-center">
                  <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(product.id, -1)}
                      className="px-2 py-1 text-base text-gray-700 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <div className="px-3 py-1 bg-white text-sm text-gray-900 border-x border-gray-300">
                      {product.quantity}
                    </div>
                    <button
                      onClick={() => handleQuantityChange(product.id, 1)}
                      className="px-2 py-1 text-base text-gray-700 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-1/6 text-sm text-gray-900 font-medium md:text-center">
                  <span className="md:hidden font-medium">Total: </span>Rs{(Number(product.price) * product.quantity)?.toFixed(2)}
                </div>

                <div className="hidden md:flex w-full md:w-1/6 justify-center text-sm text-gray-900 font-medium">
                  <FiTrash
                    className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => handleRemove(product.id)}
                  />
                </div>
              </div>
            ))}

            <Link href="/" className="inline-block mt-8 text-red-600 hover:text-red-400 text-sm">
              ← Continue Shopping
            </Link>
          </div>

          {/* Summary Section */}
          <div className="w-full md:w-1/4 bg-gray-50 text-gray-900 p-6 rounded-md">
            <h2 className="text-2xl font-bold border-b border-gray-300 pb-4">Order Summary</h2>

            {/* Coupon Section */}
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-700">Have a Coupon?</label>
              <div className="flex mt-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter Coupon Code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring focus:border-red-500"
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-red-600 text-white rounded-r-md hover:bg-red-700 text-sm font-semibold"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
              {discount > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  {discountType === 'percentage'
                    ? `Coupon applied: ${discountValue}% off`
                    : `Coupon applied: Rs${discountValue} off`}
                </p>
              )}
            </div>

            {/* Summary Details */}
            <div className="flex justify-between mt-6 mb-2 text-sm">
              <span>Subtotal</span>
              <span>Rs{subtotal?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Discount</span>
              <span className="text-green-600">-Rs{discount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Shipping</span>
              <span>Rs{shipping?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-sm">
              <span>Estimated Tax (7%)</span>
              <span>Rs{tax?.toFixed(2)}</span>
            </div>

            <div className="border-t border-gray-300 pt-4">
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>Rs{total?.toFixed(2)}</span>
              </div>
              <button
                className="bg-red-600 hover:bg-red-700 w-full mt-4 py-3 text-sm uppercase text-white font-semibold"
                onClick={() => router.push('/payment')}
              >
                Proceed to Checkout
              </button>
            </div>

            {/* Payment Logos */}
            <div className="mt-8 border-t border-gray-300 pt-6">
              <p className="mb-4 text-gray-700 font-semibold">We accept:</p>
              <div className="flex space-x-6 items-center">
                <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png" alt="Master Card" width={50} height={50} className="object-contain" />
                 <Image src="https://static.vecteezy.com/system/resources/thumbnails/030/740/487/small_2x/cash-on-delivery-logo-free-png.png" alt="EasyPaisa" width={50} height={50} className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
