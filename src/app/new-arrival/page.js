'use client'

import { useState, useEffect, useContext } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import CardPage from '../card/page'
import Loader from '../loader/page'
import CartContext from '../cartcontext/cartcontext'

export default function SalePage() {
  const [selectedImages, setSelectedImages] = useState({})
  const [favorites, setFavorites] = useState([])
  const [selectedColor, setSelectedColor] = useState({})
  const [selectedSize, setSelectedSize] = useState({})
  const [products, setProducts] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { setCartItems, setWishList } = useContext(CartContext)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 10

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/product')
        const allProducts = await res.json()
        const newArrivals = allProducts.slice(0, 20)
        setProducts(newArrivals)
      } catch (err) {
        console.error('Failed to fetch products:', err)
      }
      setIsLoading(false)
    }

    fetchProducts()
  }, [])

  // Pagination logic
  const totalPages = Math.ceil((products?.length || 0) / productsPerPage)
  const paginatedProducts = products?.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

  const toggleFavorite = (product) => {
    const color = selectedColor[product.id] || Object.keys(product.colors)[0]
    const size = selectedSize[product.id]
    const image = product.colors[color][0]
    const discountedPrice = (parseFloat(product.price) * (1 - product.discount / 100)).toFixed(2)

    const uniqueId = `${product.id}-${color}-${size}`
    const isAlreadyFav = favorites.includes(uniqueId)
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
    let updatedFavorites

    if (isAlreadyFav) {
      const filtered = wishlist.filter(item => item.id !== uniqueId)
      localStorage.setItem("wishlist", JSON.stringify(filtered))
      setWishList(filtered)
      toast("Product removed from wishlist.")
      updatedFavorites = favorites.filter(id => id !== uniqueId)
    } else {
      if (!size) {
        toast.error("Please select a size before adding to wishlist.")
        return
      }

      const alreadyExists = wishlist.find(item =>
        item.id === uniqueId && item.color === color && item.size === size
      )

      if (!alreadyExists) {
        wishlist.push({
          id: uniqueId,
          title: product.title,
          price: product.discount !== null ? discountedPrice : product.price,
          color,
          size,
          image,
          quantity: 1,
        })

        localStorage.setItem("wishlist", JSON.stringify(wishlist))
        setWishList(wishlist)
        toast.success("Product added to wishlist!")
      }

      updatedFavorites = [...favorites, uniqueId]
    }

    setFavorites(updatedFavorites)
  }

  const changeColor = (id, color) => {
    setSelectedColor((prev) => ({ ...prev, [id]: color }))
    setSelectedImages((prev) => ({ ...prev, [id]: 0 }))
  }

  const nextImage = (id, total) => {
    setSelectedImages((prev) => ({
      ...prev,
      [id]: (prev[id] + 1) % total,
    }))
  }

  const prevImage = (id, total) => {
    setSelectedImages((prev) => ({
      ...prev,
      [id]: (prev[id] - 1 + total) % total,
    }))
  }

  const handleSizeSelect = (product, size) => {
    setSelectedSize((prev) => ({ ...prev, [product.id]: size }))
  }

  const addToCartHandler = (product) => {
    const color = selectedColor[product.id] || Object.keys(product.colors)[0];
    const size = selectedSize[product.id];
    const image = product.colors[color][0];
    const discountedPrice = (parseFloat(product.price) * (1 - product.discount / 100)).toFixed(2);

    if (!size) {
      toast.error('Please select a size before adding to cart.');
      return;
    }

    const uniqueId = `${product.id}-${color}-${size}`;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex((item) => item.id === uniqueId);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: uniqueId,
        title: product.title,
        price: product.discount !== null ? discountedPrice : product.price,
        color,
        size,
        image,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setCartItems(cart);
    toast.success('Product added to cart!');
  };


  return (
    <>
      {isLoading && <Loader />}
      <section
        className="bg-gray-50 min-h-screen py-10"
        style={{
          backgroundImage: "linear-gradient(to right,rgb(230, 227, 227) 0%,rgb(255, 255, 255) 100%)",
        }}
      >
        {/* Banner */}
        <section className="relative w-full mt-4 h-[50vh] overflow-hidden">
          <Image
            src="https://naturalselectionlondon.com/wp-content/uploads/2022/07/How-To-Wear-The-Smart-Casual-Dress-Code-For-Men-copy-2.jpg"
            alt="Men's Collection Banner"
            fill
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-black/40 bg-opacity-40" />
          <div className="absolute z-50 inset-y-0 right-0 lg:pr-20 flex flex-col items-start justify-center max-w-lg w-full text-right px-4 md:pr-10">
            <h2 className="text-left text-3xl sm:text-5xl md:text-6xl mb-8 leading-tight whitespace-pre-line drop-shadow-xl">
              <span className="text-white">NEW ARRIVALS</span>
            </h2>
          </div>
        </section>

        {/* Product Grid */}
        <div className="flex flex-wrap justify-center items-center py-8">
          {paginatedProducts?.length > 0 &&
            paginatedProducts.map((product) => {
              const color = selectedColor[product.id] || Object.keys(product.colors)[0]
              const images = product.colors[color]
              const currentImage = selectedImages[product.id] || 0
              const selected = selectedSize[product.id]

              const currentColor = color
              const currentSize = selected
              const uniqueId = `${product.id}-${currentColor}-${currentSize}`
              const isFav = favorites.includes(uniqueId)

              return (
                <CardPage
                  key={`${product.id}-${selectedSize[product.id] || ''}-${selectedColor[product.id] || Object.keys(product.colors)[0]}`}
                  product={product}
                  color={color}
                  images={images}
                  currentImage={currentImage}
                  isFav={isFav}
                  changeColor={changeColor}
                  selected={selected}
                  prevImage={prevImage}
                  nextImage={nextImage}
                  toggleFavorite={toggleFavorite}
                  handleSizeSelect={handleSizeSelect}
                  addToCartHandler={addToCartHandler}
                />
              )
            })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <nav className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-full font-medium transition duration-200 ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-black text-white'
                  }`}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-full font-medium transition duration-200 ${currentPage === index + 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-full font-medium transition duration-200 ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-black text-white'
                  }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </section>
    </>
  )
}
