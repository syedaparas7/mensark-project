'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import CardPage from '../card/page';
import Loader from '../loader/page';
import CartContext from '../cartcontext/cartcontext';

export default function ApparelPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [selectedImages, setSelectedImages] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [selectedColor, setSelectedColor] = useState({});
  // const [filterSize, setFilterSize] = useState('');
  const [filterColor, setFilterColor] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState({});
  // const [minPrice, setMinPrice] = useState(0);
  // const [maxPrice, setMaxPrice] = useState(200000);
  const [products, setProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setCartItems, setWishList } = useContext(CartContext);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = products ? Math.ceil(products.length / itemsPerPage) : 1;
  const currentItems = products ? products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])


  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/product');
        const all = await res.json();
        setAllProducts(all);
        setProducts(all);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

  const applyFilters = () => {
    const filtered = allProducts.filter((product) => {
      const price = parseFloat(product.price);
      const sizeCheck = filterSize ? product.sizes.includes(filterSize) : true;
      const colorCheck = filterColor ? Object.keys(product.colors).includes(filterColor) : true;
      const catCheck = filterCategory ? product.category === filterCategory : true;
      // const min = Number(minPrice);
      // const max = Number(maxPrice);
      // const minCheck = minPrice !== '' ? price >= min : true;
      // const maxCheck = maxPrice !== '' ? price <= max : true;

      return sizeCheck && colorCheck && catCheck && minCheck && maxCheck;
    });

    setProducts(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const toggleFavorite = (product) => {
    const color = selectedColor[product.id] || Object.keys(product.colors)[0];
    const size = selectedSize[product.id];
    const image = product.colors[color][0];
    const discountedPrice = (parseFloat(product.price) * (1 - product.discount / 100)).toFixed(2);
    const uniqueId = `${product.id}-${color}-${size}`;
    const isAlreadyFav = favorites.includes(uniqueId);
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let updatedFavorites;

    if (isAlreadyFav) {
      const filtered = wishlist.filter((item) => item.id !== uniqueId);
      localStorage.setItem('wishlist', JSON.stringify(filtered));
      setWishList(filtered);
      toast('Product removed from wishlist.');
      updatedFavorites = favorites.filter((id) => id !== uniqueId);
    } else {
      if (!size) {
        toast.error('Please select a size before adding to wishlist.');
        return;
      }

      const alreadyExists = wishlist.find((item) => item.id === uniqueId && item.color === color && item.size === size);

      if (!alreadyExists) {
        wishlist.push({
          id: uniqueId,
          title: product.title,
          price: product.discount !== null ? discountedPrice : product.price,
          color,
          size,
          image,
          quantity: 1,
        });

        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        setWishList(wishlist);
        toast.success('Product added to wishlist!');
      }

      updatedFavorites = [...favorites, uniqueId];
    }

    setFavorites(updatedFavorites);
  };

  const changeColor = (id, color) => {
    setSelectedColor((prev) => ({ ...prev, [id]: color }));
    setSelectedImages((prev) => ({ ...prev, [id]: 0 }));
  };

  const nextImage = (id, total) => {
    setSelectedImages((prev) => ({
      ...prev,
      [id]: (prev[id] + 1) % total,
    }));
  };

  const prevImage = (id, total) => {
    setSelectedImages((prev) => ({
      ...prev,
      [id]: (prev[id] - 1 + total) % total,
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


  return (
    <>
      {isLoading && <Loader />}
      <section className="bg-gray-50 mt-4 min-h-screen py-10" style={{ backgroundImage: 'linear-gradient(to right,rgb(230, 227, 227) 0%,rgb(255, 255, 255) 100%)' }}>
        {/* Hero Banner */}
        <section className="relative w-full h-[50vh] overflow-hidden">
          <Image
            src="https://miro.medium.com/v2/resize:fit:1070/1*VZthCXMgjR1EnGDhxdR3sQ.jpeg"
            alt="Men's Collection Banner"
            fill
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute z-50 inset-y-0 right-0 lg:pr-20 flex flex-col justify-center max-w-lg w-full text-right px-4 md:pr-10">
            <h2 className="text-3xl sm:text-5xl md:text-6xl mb-8 leading-tight whitespace-pre-line drop-shadow-xl">
              <span className="text-white">ALL MEN'S</span>
            </h2>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Filters */}
          <div className="w-full lg:w-auto bg-transparent border border-gray-300 text-black p-4 flex flex-col flex-wrap items-start gap-6 rounded-md">  {/* Size Filter */}
            <div className="flex flex-col mt-10">
              {/* <h3 className="mb-2 font-semibold">Size</h3>
              <div className="flex flex-wrap gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFilterSize(size === filterSize ? '' : size)}
                    className={`px-3 py-1 rounded border text-sm ${filterSize === size ? 'bg-black text-white border-black' : 'border-gray-400'}`}
                  >
                    {size}
                  </button>
                ))}
              </div> */}
            </div>

            {/* Color Filter */}
            <div className="flex flex-col w-[320px]">
              {/* <h3 className="mb-2 font-semibold">Color</h3>
              <div className="flex flex-wrap gap-3">
                {products &&
                  [...new Set(products.flatMap((p) => (p?.colors ? Object.keys(p.colors) : [])))].map((color) => (
                    <div
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer ${filterColor === color ? 'border-black' : 'border-gray-400'}`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => setFilterColor(color === filterColor ? '' : color)}
                    >
                      {filterColor === color && (
                        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ))}
              </div> */}
            </div>

            {/* Price Filter */}
            {/* <div className="flex flex-col w-[220px]">
              <h3 className="mb-2 font-semibold">Price Range</h3>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full px-3 py-1 border border-gray-400 rounded" />
                <span>-</span>
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full px-3 py-1 border border-gray-400 rounded" />
              </div>
            </div> */}

            {/* Category Filter */}
            <div className="flex flex-col">
              <h3 className="mb-2 font-semibold">Category</h3>
              <select className="w-[180px] px-3 py-2 border border-gray-400 rounded" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="">All Categories</option>
                {products && [...new Set(products.map((p) => p.category))].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-3">
              <button onClick={applyFilters} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
                Apply Filters
              </button>
              <button
                onClick={() => {
                  setFilterSize('');
                  setFilterColor('');
                  setFilterCategory('');
                  // setMinPrice('');
                  // setMaxPrice('');
                  setProducts(allProducts);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Product Cards */}
          <div className="flex flex-wrap justify-center items-center py-8 w-full">
            {!products ? (
              <p className="text-center mt-10">Loading products...</p>
            ) : (
              currentItems.map((product) => {
                const color = selectedColor[product.id] || Object.keys(product.colors)[0];
                const images = product.colors[color];
                const currentImage = selectedImages[product.id] || 0;
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
              })
            )}
          </div>
        </div>
        {/* Pagination */}
        {products && products.length > itemsPerPage && (
          <div className="flex justify-center mt-10">
            <nav className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-full font-medium transition duration-200 ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-black text-white hover:bg-gray-800'
                  }`}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-full font-medium transition duration-200 ${currentPage === index + 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-full font-medium transition duration-200 ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-black text-white hover:bg-gray-800'
                  }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </section>
    </>
  );
}