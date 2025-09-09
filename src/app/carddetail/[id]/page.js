'use client'
import { useParams } from "next/navigation";
import { useEffect, useState, useContext} from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";
import Loader from "@/app/loader/page";
import CartContext from "@/app/cartcontext/cartcontext";


export default function CardDetail() {
    const params = useParams();
    const { id } = params;

    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {setCartItems} = useContext(CartContext)
    



    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (!id) return;
                setIsLoading(true)

                const res = await fetch("/api/product");
                const allProducts = await res.json();

                const foundProduct = allProducts.find((p) => p.id === id);
                if (foundProduct) {
                    setProduct(foundProduct);

                    const firstColor = Object.keys(foundProduct.colors || {})[0];
                    setSelectedColor(firstColor);
                    setCurrentImageIndex(0);
                } else {
                    console.log("Product not found");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            }
            setIsLoading(false)
        };

        fetchProduct();
    }, [id]);


    if (!product) {
        return <div className="p-8 text-center text-gray-700">Loading product details...</div>;
    }

    const images = product.colors[selectedColor];

    function prevImage() {
        setCurrentImageIndex(i => (i === 0 ? images.length - 1 : i - 1));
    }

    function nextImage() {
        setCurrentImageIndex(i => (i === images.length - 1 ? 0 : i + 1));
    }

    const addToCartHandler = (product) => {
        if (!selectedSize) {
            toast.error("Please select a size before adding to cart.");
            return;
        }

        const color = selectedColor || Object.keys(product.colors)[0];
        const size = selectedSize;
        const image = product.colors[color][0];
        const discountedPrice = (parseFloat(product.price) * (1 - product.discount / 100)).toFixed(2);

        const uniqueId = `${product.id}-${color}-${size}`;

        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingIndex = cart.findIndex(item => item.id === uniqueId);

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

        localStorage.setItem("cart", JSON.stringify(cart));
        setCartItems(cart)
        toast.success("Product added to cart!");
    };


    return (
        <>
            {isLoading && <Loader />}
            <div className="w-full bg-gray-100">
                <div className="max-w-7xl shadow-2xl lg:pr-20 lg:pl-20 mx-auto pt-50 pb-20 px-6 flex flex-col md:flex-row gap-10 bg-white rounded shadow-lg">
                    {/* Left: Images */}
                    <div className="relative w-full md:w-1/2 rounded border border-gray-200 overflow-hidden">
                        {/* 🔴 Discount Badge */}
                        {product.discount !== "0" && (
                            <div className="absolute top-0 right-0 z-20 bg-red-600 text-white text-xs px-2 py-1 shadow-lg font-semibold rounded-bl-2xl">
                                {product.discount}% OFF
                            </div>
                        )}
                        <div className="w-full h-[600px] bg-gray-100 relative">
                            <Image
                                src={images[currentImageIndex]}
                                alt={`${product.title} - ${selectedColor}`}
                                fill
                                className="object-cover rounded"
                            />
                        </div>

                        {/* Arrows */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    aria-label="Previous Image"
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white p-2 rounded-full"
                                >
                                    <FiChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    aria-label="Next Image"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white p-2 rounded-full"
                                >
                                    <FiChevronRight size={24} />
                                </button>
                            </>
                        )}

                        {/* Dots */}
                        {images.length > 1 && (
                            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
                                {images.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-3 h-3 rounded-full transition ${currentImageIndex === index ? "bg-black" : "bg-gray-400"
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>


                    {/* Right: Details */}
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-4 text-gray-900">{product.title}</h1>

                            <p className="text-gray-700 mb-2 text-lg">{product.description}</p>
                            <p className="text-gray-600 mb-4 text-sm">
                                This designed to keep you comfortable in the harshest conditions with a stylish edge.
                                Made from eco-friendly materials with advanced insulation.
                            </p>

                            {/* Features */}
                            <ul className="mb-6 text-sm text-gray-600 list-disc pl-5 space-y-1">
                                <li>Washable fabric</li>
                                <li>Adjustable fitting</li>
                                <li>Inner fleece lining</li>
                                <li>Machine washable</li>
                            </ul>

                            {/* Color Selector */}
                            <div className="mb-6">
                                <label className="block text-gray-800 mb-1 font-semibold">Color:</label>
                                <select
                                    className="border border-gray-400 rounded px-3 py-2 bg-gray-100 text-gray-900 focus:outline-none focus:ring-2"
                                    value={selectedColor}
                                    onChange={e => {
                                        setSelectedColor(e.target.value);
                                        setCurrentImageIndex(0);
                                    }}
                                >
                                    {Object.keys(product.colors).map(color => (
                                        <option key={color} value={color}>
                                            {color}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Size Selector */}
                            <div className="mb-8">
                                <label className="block text-gray-800 mb-1 font-semibold">Size:</label>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map(sz => (
                                        <button
                                            key={sz}
                                            onClick={() => setSelectedSize(sz)}
                                            className={`px-4 py-2 rounded border font-medium transition ${selectedSize === sz
                                                ? "bg-black text-white border-black"
                                                : "bg-transparent text-black border-gray-400"
                                                }`}
                                        >
                                            {sz}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom: Price & Button */}
                        <div className="mt-auto flex items-center justify-between border-t pt-6">
                            {product.discount !== "0" ? <>
                                <p className="text-xl text-gray-400 line-through">
                                    Rs{parseFloat(product.price).toFixed(2)}
                                </p>
                                <p className="text-lg font-semibold text-black mr-50">
                                    Rs
                                    {(
                                        parseFloat(product.price) *
                                        (1 - product.discount / 100)
                                    ).toFixed(2)}
                                </p>
                            </>
                                :
                                <span className="text-3xl font-semibold text-gray-900"> Rs{parseFloat(product.price).toFixed(2)}</span>
                            }
                            <button
                                disabled={!selectedSize}
                                onClick={() => addToCartHandler(product)}
                                className={`px-6 py-3 rounded text-white font-semibold transition 
    ${selectedSize
                                        ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                                        : "bg-red-500 cursor-pointer"
                                    }`}
                            >
                                Add to Cart
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
