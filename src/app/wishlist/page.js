'use client'

import React, { useState, useEffect, useContext } from "react";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import toast from "react-hot-toast";
import Loader from "../loader/page";
import CartContext from "../cartcontext/cartcontext";

const Wishlist = () => {
 const [isLoading, setIsLoading] = useState(false);
 const { wishlist, setWishList, setCartItems } = useContext(CartContext)

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter((product) => product.id !== id);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishList(updatedWishlist);
  };

 const addToCartHandler = (product) => {
  const color = product.color;
  const size = product.size;
  const image = product.image;
 
  if (!size) {
    toast.error("Please select a size before adding to cart.");
    return;
  }

  const uniqueId = `${product.id}-${color}-${size}`;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingIndex = cart.findIndex((item) => item.uniqueId === uniqueId);

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: uniqueId,
      title: product.title,
      price: product.price,
      color,
      size,
      image,
      quantity: 1,
    });
  }

  // Save cart and update context
  localStorage.setItem("cart", JSON.stringify(cart));
  setCartItems(cart);

  // Remove from wishlist
  removeFromWishlist(product.id);

  toast.success("Product added to cart!");
};

  return (
   <>
  {isLoading && <Loader />}
  <div className="bg-gray-100 min-h-screen pt-28 px-4 py-10 text-gray-900">
    <div className="container mx-auto max-w-6xl">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

        {!Array.isArray(wishlist) || wishlist.length === 0 ? (
          <p className="text-gray-500">Your wishlist is empty.</p>
        ) : (
          <>
            {/* Headings - visible only on md and up */}
            <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700 border-b pb-2 mb-4">
              <div className="col-span-5">Product</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Stock</div>
              <div className="col-span-3">Actions</div>
            </div>

            {/* Product List */}
            <div className="space-y-6">
              {wishlist?.map((product) => (
                <div
                  key={product.id + product.size + product.color}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-gray-300 pb-4"
                >
                  {/* Image & Info */}
                  <div className="md:col-span-5 flex gap-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{product.title}</h3>
                      <p className="text-sm text-gray-600">{product.category}</p>
                      <p className="text-sm text-gray-600">
                        Size: {product.size} | Color: {product.color}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 text-sm text-gray-900">
                    <div className="md:hidden font-medium">Price:</div>
                    Rs{Number(product.price).toFixed(2)}
                  </div>

                  {/* Stock */}
                  <div className="md:col-span-2 text-sm">
                    <div className="md:hidden font-medium">Stock:</div>
                    {product.quantity >= 1 ? (
                      <span className="text-green-600 font-medium">Available</span>
                    ) : (
                      <span className="text-red-500 font-medium">Out of Stock</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-3 flex flex-col sm:flex-row gap-2">
                    <button
                      className="flex items-center justify-center px-3 py-1 bg-[#333333] text-white rounded hover:bg-[#1f1f1f] transition text-sm"
                      onClick={() => {
                        addToCartHandler(product);
                      }}
                    >
                      <FiShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="flex items-center justify-center px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition text-sm"
                    >
                      <FiHeart className="h-4 w-4 mr-1 text-red-500" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  </div>
</>


  );
};

export default Wishlist;
