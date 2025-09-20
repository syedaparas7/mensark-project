'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiHeart, FiChevronLeft, FiChevronRight, FiShoppingCart, FiEye } from 'react-icons/fi'

function CardPage({
  product,
  color,
  images,
  currentImage,
  isFav,
  selected,
  changeColor,
  prevImage,
  nextImage,
  toggleFavorite,
  handleSizeSelect,
  addToCartHandler,
}) {
  const [isZoomed, setIsZoomed] = useState(false) // ✅ state for zoom toggle

  if (!product || !product.colors || !product.sizes) return null

  console.log(isFav)

  return (
    // <div
    //   className="relative bg-transparent 
    //      sm:w-[48%] md:w-[36%] lg:w-[28%] xl:w-[22%] 2xl:w-[19.2%]
    //      shadow-lg flex mx-1 gap-4 no-scrollbar
    //      scroll-smooth pb-1 group flex-shrink-0 flex flex-col justify-between
    //      transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl
    //      border border-gray-600 rounded-md mt-6 mb-6"
    // >
    //  <div
    //     className="relative bg-transparent 
    // w-full max-w-[200px] sm:max-w-[220px] md:max-w-[240px] lg:max-w-[260px] xl:max-w-[280px] 
    // h-[400px] sm:h-[420px] md:h-[440px] lg:h-[460px] xl:h-[560px]
    // shadow-lg flex flex-col justify-between mx-auto
    // transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl
    // border border-gray-600 rounded-md overflow-hidden mt-6 mb-6"
    //   > 
<div
  className="relative bg-transparent 
    w-full max-w-[200px] sm:max-w-[220px] md:max-w-[240px] lg:max-w-[260px] xl:max-w-[280px]
    h-[480px] sm:h-[500px] md:h-[520px] lg:h-[540px] xl:h-[560px]
    shadow-lg flex flex-col justify-between
    transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl
    border border-gray-300 rounded-md overflow-hidden
    min-h-[480px] mt-2 mb-4 mx-auto"
>


      <Link href={`/carddetail/${product?.id}`}>

        {/* 🔴 Discount Badge */}
        {Number(product?.discount) > 0 && (
          <div className="absolute top-0 right-0 z-20 bg-red-600 text-white text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 shadow-lg font-semibold rounded-bl-2xl">
            {`${Number(product?.discount)}% OFF`}
          </div>
        )}


        {/* 📸 Image */}
        <div className="relative h-60 sm:h-72 group">
          <div className="w-full h-full overflow-hidden">
            {Array.isArray(images) && images.length > 0 && (
              <Image
                src={images[currentImage] || '/fallback.jpg'}
                alt={product?.title || 'Product image'}
                fill
                className={`object-cover w-full h-full rounded-tl-md rounded-tr-md cursor-pointer transition-transform duration-500 ${isZoomed ? 'scale-125' : 'scale-100'
                  }`}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div
            className="absolute top-1.5 right-1.5 z-10 flex mt-6 flex-col items-center gap-2 
        lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300"
          >
            {/* ❤️ Favorite Button */}
            <div className="bg-black/60 p-1 rounded-tr-md rounded-bl-md">
              <button onClick={() => toggleFavorite(product)} aria-label="Toggle favorite">
                <FiHeart
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${isFav ? 'text-red-600 fill-red-600' : 'text-white'
                    }`}
                />
              </button>
            </div>

            {/* 👁️ Eye Button → Zoom Toggle */}
            <div className="bg-black/60 p-1 rounded-tr-md rounded-bl-md">
              <button
                onClick={(e) => {
                  e.preventDefault() // ✅ stops navigation
                  setIsZoomed((prev) => !prev) // ✅ toggle zoom
                }}
                aria-label="Toggle zoom"
              >
                <FiEye
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300 ${isZoomed ? 'scale-125' : 'scale-100'
                    }`}
                />
              </button>
            </div>
          </div>

          {/* Image Navigation */}
          {images?.length > 1 && (
            <>
              {/* Left Arrow */}
              <button
                onClick={() => prevImage(product?.id, images?.length)}
                className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 
  bg-black/60 p-1 rounded-full z-20"
              >
                <FiChevronLeft className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={() => nextImage(product?.id, images?.length)}
                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 
  bg-black/60 p-1 rounded-full z-20"
              >
                <FiChevronRight className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </>
          )}
        </div>

        {/* 📌 Title */}
        <div className="text-black px-2 sm:px-4 text-left mt-2">
          <h3 className="text-[11px] sm:text-lg font-semibold sm:font-bold truncate">
            {product?.title}
          </h3>
        </div>

        {/* 🧾 Content */}
        <div className="px-2 sm:px-4 pb-4 text-left space-y-3 text-black flex flex-col justify-between">
          {/* 🌈 Color Selector */}
          <select
            className="w-full px-1 py-1 sm:px-2 sm:py-1.5 
         rounded-tr-md rounded-bl-md sm:rounded-tr-xl sm:rounded-bl-xl
         text-[10px] sm:text-sm 
         bg-transparent border border-gray-400 text-black 
         appearance-none focus:outline-none focus:ring-1 focus:ring-black"
            onChange={(e) => changeColor(product?.id, e.target.value)}
            value={color}
          >
            {product?.colors &&
              Object.keys(product.colors).map((clr) => (
                <option key={clr} value={clr} className="text-black bg-transparent">
                  {clr}
                </option>
              ))}
          </select>

          {/* 📏 Size Selector */}
          <div>
            <p className="text-[10px] w-[140px] sm:text-sm text-gray-600 mb-1">Select Size:</p>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {Array.isArray(product?.sizes) &&
                product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => handleSizeSelect(product, sz)}
                    className={`px-1.5 sm:px-3 py-[1px] sm:py-1 rounded border text-[10px] sm:text-sm transition-all duration-200 ${selected === sz
                      ? 'bg-black text-white border-black'
                      : 'bg-transparent text-black border-gray-400'
                      }`}
                  >
                    {sz}
                  </button>
                ))}
            </div>
          </div>

          {/* 💰 Price & Add to Cart */}
          <div className="flex justify-between items-center pt-1">
            <div className="min-h-[38px] sm:min-h-[44px] flex flex-col justify-center">
              {Number(product?.discount) > 0 ? (
                <>
                  {/* Original Price */}
                  <p className="text-[10px] sm:text-sm text-gray-500 line-through">
                    Rs{Number(product?.price || 0).toFixed(2)}
                  </p>

                  {/* Discounted Price */}
                  <p className="text-[13px] sm:text-lg font-semibold text-black">
                    Rs
                    {(
                      Number(product?.price || 0) *
                      (1 - Number(product?.discount || 0) / 100)
                    ).toFixed(2)}
                  </p>
                </>
              ) : (
                <>
                  {/* Empty line to align height visually */}
                  <div className="h-[14px] sm:h-[18px]"></div>
                  <p className="text-[13px] sm:text-lg font-semibold text-black">
                    Rs{Number(product?.price || 0).toFixed(2)}
                  </p>
                </>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCartHandler(product)}
            className="text-black border border-black 
     rounded-tr-md rounded-bl-md sm:rounded-tr-xl sm:rounded-bl-xl
     transition-all duration-300 hover:bg-black hover:text-white 
     flex items-center justify-center
     w-10 h-10 sm:min-w-[120px] sm:h-12
     text-xs sm:text-sm font-medium"
          >
            <span className="block sm:hidden">
              <FiShoppingCart className="w-4 h-4" />
            </span>
            <span className="hidden sm:block cursor-pointer">Add to Cart</span>
          </button>
        </div>
      </Link >
    </div >
  )
}

export default CardPage
