"use client";

import { useState, useRef, useEffect, useContext } from "react";
import CardPage from "../card/page";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";
import Loader from "../loader/page";
import CartContext from "../cartcontext/cartcontext";

export default function FeaturedProducts() {
  const [favorites, setFavorites] = useState([]);
  const [selectedColor, setSelectedColor] = useState({});
  const [selectedSize, setSelectedSize] = useState({});
  const [imageIndex, setImageIndex] = useState({});
  const [products, setProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setCartItems, setWishList } = useContext(CartContext)

  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/product');
        const allProducts = await res.json();
        setProducts(allProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  const toggleFavorite = (product) => {
    const color = selectedColor[product.id] || Object.keys(product.colors)[0]
    const size = selectedSize[product.id]
    const image = product.colors[color][0]
    const discountedPrice = (parseFloat(product.price) * (1 - product.discount / 100)).toFixed(2)

    const uniqueId = `${product.id}-${color}-${size}`;

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

      const alreadyExists = wishlist.find(
        item =>
          item.id === uniqueId &&
          item.color === color &&
          item.size === size
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

  const changeColor = (productId, color) => {
    setSelectedColor((prev) => ({ ...prev, [productId]: color }));
    setImageIndex((prev) => ({ ...prev, [productId]: 0 }));
  };

  const nextImage = (id, total) => {
    setImageIndex((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % total,
    }));
  };

  const prevImage = (id, total) => {
    setImageIndex((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) - 1 + total) % total,
    }));
  };

  const handleSizeSelect = (product, size) => {
    setSelectedSize((prev) => ({ ...prev, [product.id]: size }));
  };

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

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <>
      {isLoading && <Loader />}
      <section
        className="w-full px-0 sm:px-6 py-20 bg-gray-50 border-t border-b border-gray-700 relative"
        style={{
          backgroundImage: "linear-gradient(to right, #f9fafb 0%, #f3f4f6 40%, #ffffff 100%)",
        }}
      >
        <div className="px-2 sm:px-4 md:px-6 lg:px-10 mx-auto text-center">
          <h2 className="text-4xl font-bold text-black mb-4">Featured Products</h2>
          <p className="text-black mb-10">
            Hand-picked jackets for winter comfort and style.
          </p>

          <div className="relative">
            {/* Arrows */}
            <button
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 shadow-md p-2 rounded-full hover:bg-gray-300"
              onClick={scrollLeft}
            >
              <FiChevronLeft className="w-5 h-5 text-gray-800" />
            </button>

            <button
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 shadow-md p-2 rounded-full hover:bg-gray-300"
              onClick={scrollRight}
            >
              <FiChevronRight className="w-5 h-5 text-gray-800" />
            </button>

            <div className="overflow-x-auto scrollbar-hide px-0 sm:px-2 md:px-4" ref={scrollRef}>
              <div className="flex flex-row gap-2 mt-4">
                {products?.length > 0 &&
                  products.map((product) => {
                    const color = selectedColor[product.id] || Object.keys(product?.colors || {})[0];
                    const images = product?.colors?.[color] || [];
                    const currentImage = imageIndex[product.id] || 0;
                    const isFav = favorites.includes(product.id);
                    const selected = selectedSize[product.id];

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
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
