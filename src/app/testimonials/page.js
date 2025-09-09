"use client";

import { useRef, useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
//import Loader from "../loader/page";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Customer",
    avatar:
      "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png",
    rating: 5,
    feedbackTitle: "Excellent",
    quote: "This jacket kept me warm even in sub-zero temperatures!",
    productImage:
      "https://weavewardrobe.com/cdn/shop/files/formalshirt-black-3_900x.jpg?v=1713597712",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Customer",
    avatar:
      "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png",
    rating: 4,
    feedbackTitle: "Excellent",
    quote: "This jacket kept me warm even in sub-zero temperatures!",
    productImage:
      "https://weavewardrobe.com/cdn/shop/files/formalshirt-black-3_900x.jpg?v=1713597712",
  },
  {
    id: 10,
    name: "Sarah Johnson",
    role: "Customer",
    avatar:
      "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png",
    rating: 5,
    feedbackTitle: "Excellent",
    quote: "This jacket kept me warm even in sub-zero temperatures!",
    productImage:
      "https://weavewardrobe.com/cdn/shop/files/formalshirt-black-3_900x.jpg?v=1713597712",
  },
  {
    id: 20,
    name: "Sarah Johnson",
    role: "Customer",
    avatar:
      "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png",
    rating: 4,
    feedbackTitle: "Excellent",
    quote: "This jacket kept me warm even in sub-zero temperatures!",
    productImage:
      "https://weavewardrobe.com/cdn/shop/files/formalshirt-black-3_900x.jpg?v=1713597712",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Customer",
    avatar:
      "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png",
    rating: 3,
    feedbackTitle: "Excellent",
    quote: "This jacket kept me warm even in sub-zero temperatures!",
    productImage:
      "https://weavewardrobe.com/cdn/shop/files/formalshirt-black-3_900x.jpg?v=1713597712",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    role: "Customer",
    avatar:
      "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png",
    rating: 4,
    feedbackTitle: "Excellent",
    quote: "This jacket kept me warm even in sub-zero temperatures!",
    productImage:
      "https://weavewardrobe.com/cdn/shop/files/formalshirt-black-3_900x.jpg?v=1713597712",
  },
  {
    id: 5,
    name: "Sarah Johnson",
    role: "Customer",
    avatar:
      "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png",
    rating: 4,
    feedbackTitle: "Excellent",
    quote: "This jacket kept me warm even in sub-zero temperatures!",
    productImage:
      "https://weavewardrobe.com/cdn/shop/files/formalshirt-black-3_900x.jpg?v=1713597712",
  },
];

const TESTIMONIAL_WIDTH = 340 + 16;

export default function Testimonials() {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -TESTIMONIAL_WIDTH, behavior: "smooth" });
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      const maxIndex = Math.ceil(testimonials.length / visibleCount) - 1;
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
      containerRef.current.scrollBy({ left: TESTIMONIAL_WIDTH, behavior: "smooth" });
    }
  };

  const scrollToIndex = (index) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        left: index * TESTIMONIAL_WIDTH,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
  const updateVisibleCount = () => {
    const containerWidth = containerRef.current?.offsetWidth || 1;
    setVisibleCount(Math.max(1, Math.floor(containerWidth / TESTIMONIAL_WIDTH)));
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const index = Math.round(scrollLeft / TESTIMONIAL_WIDTH);
      setCurrentIndex(index);
    }
  };

  const container = containerRef.current;

  updateVisibleCount();
  window.addEventListener("resize", updateVisibleCount);
  container?.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("resize", updateVisibleCount);
    container?.removeEventListener("scroll", handleScroll);
  };
}, []);

  return (
    <section className="w-full bg-black-300 py-16 px-4 lg:mr-3.5 border-b border-gray-700">
      <div className="w-full mx-auto px-4 sm:px-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-3">
            What Our Customers Say
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Real stories from jacket lovers. Quality, comfort, and style.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={scrollLeft}
            className="hidden sm:flex absolute -left-6 lg:ml-3.5 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full shadow-lg transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={scrollRight}
            className="hidden sm:flex absolute -right-6 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full shadow-lg transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            ref={containerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth px-2 sm:px-6 py-2 scrollbar-hide snap-x snap-mandatory"
          >
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="min-w-[360px] sm:min-w-[360px]  lg:min-w-[330px]  cursor-pointer flex sm:p-3 p-2 rounded-tr-xl rounded-bl-xl border border-gray-700 shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg snap-start"
                style={{
                  backgroundImage: "linear-gradient(to right, #1c1c1c 40%, #6c6c6c 100%)",
                }}
              >
                <div className="w-1/3 flex justify-center items-start">
                  <Image
                    src={t.productImage}
                    alt="product"
                    width={64}
                    height={64}
                    className="object-cover rounded-md border border-gray-700 shadow"
                    priority
                  />
                </div>


                <div className="w-2/3 pl-2 flex flex-col justify-between">
                  <p className="text-[10px] font-bold text-green-400 mb-1">
                    {t.feedbackTitle}
                  </p>
                  <p className="text-xs text-gray-300 italic mb-2 leading-tight line-clamp-3">
                    “{t.quote}”
                  </p>
                  <div className="flex items-center gap-1 mt-auto">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      width={28}
                      height={28}
                      className="rounded-full object-cover"
                    />

                    <div className="flex flex-col">
                      <p className="text-xs font-medium text-gray-200 leading-tight">
                        {t.name}
                      </p>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-3 h-3 ${i < t.rating ? "text-yellow-400" : "text-gray-600"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {visibleCount > 0 &&
          Array.from({ length: Math.ceil(testimonials.length / visibleCount) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-white" : "bg-gray-500"
                }`}
            ></button>
          ))}
      </div>
    </section>
  );
}

// const TESTIMONIAL_WIDTH = 340 + 16;

// export default function Testimonials() {
//   const containerRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [visibleCount, setVisibleCount] = useState(1);
//   const [testimonials, setTestimonials] = useState([]);
 //  const [isLoading, setIsLoading] = useState(false)
  


//   useEffect(() => {
//     const fetchReviews = async () => {
 // setIsLoading(true)
//       try {
//         const res = await fetch('/api/review');
//         const allReviews = await res.json()
//         setTestimonials(allReviews)
//       } catch (error) {
//         console.error('Failed to fetch reviews:', error);
//       }
// setIsLoading(false)
//     }

//     fetchReviews()
//   }, [])

//   const scrollLeft = () => {
//     if (containerRef.current) {
//       containerRef.current.scrollBy({ left: -TESTIMONIAL_WIDTH, behavior: "smooth" });
//       setCurrentIndex((prev) => Math.max(prev - 1, 0));
//     }
//   };

//   const scrollRight = () => {
//     if (containerRef.current) {
//       const maxIndex = Math.ceil(testimonials.length / visibleCount) - 1;
//       setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
//       containerRef.current.scrollBy({ left: TESTIMONIAL_WIDTH, behavior: "smooth" });
//     }
//   };

//   const scrollToIndex = (index) => {
//     if (containerRef.current) {
//       containerRef.current.scrollTo({
//         left: index * TESTIMONIAL_WIDTH,
//         behavior: "smooth",
//       });
//       setCurrentIndex(index);
//     }
//   };

//   useEffect(() => {
//     const updateVisibleCount = () => {
//       const containerWidth = containerRef.current?.offsetWidth || 1;
//       setVisibleCount(Math.max(1, Math.floor(containerWidth / TESTIMONIAL_WIDTH)));
//     };

//     const handleScroll = () => {
//       if (containerRef.current) {
//         const scrollLeft = containerRef.current.scrollLeft;
//         const index = Math.round(scrollLeft / TESTIMONIAL_WIDTH);
//         setCurrentIndex(index);
//       }
//     };

//     const container = containerRef.current;

//     updateVisibleCount();
//     window.addEventListener("resize", updateVisibleCount);
//     container?.addEventListener("scroll", handleScroll);

//     return () => {
//       window.removeEventListener("resize", updateVisibleCount);
//       container?.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   return (
//<>
//{isLoading && <Loader/>}
//     <section className="w-full bg-[#1b1b1b] py-16 px-4 lg:mr-3.5 border-b border-gray-700">
//       <div className="w-full mx-auto px-4 sm:px-12">
//         <div className="text-center mb-10">
//           <h2 className="text-4xl font-bold text-white mb-3">
//             What Our Customers Say
//           </h2>
//           <p className="text-gray-400 text-lg max-w-xl mx-auto">
//             Real stories from Outfit lovers. Quality, comfort, and style.
//           </p>
//         </div>

//         <div className="relative">
//           <button
//             onClick={scrollLeft}
//             className="hidden sm:flex absolute -left-6 lg:ml-3.5 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full shadow-lg transition-all duration-300"
//           >
//             <ChevronLeft className="w-6 h-6" />
//           </button>

//           <button
//             onClick={scrollRight}
//             className="hidden sm:flex absolute -right-6 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full shadow-lg transition-all duration-300"
//           >
//             <ChevronRight className="w-6 h-6" />
//           </button>

//           <div
//             ref={containerRef}
//             className="flex gap-4 overflow-x-auto scroll-smooth px-2 sm:px-6 py-2 scrollbar-hide snap-x snap-mandatory"
//           >
//             {testimonials?.length > 0 && testimonials.map((t) => (
//               <div
//                 key={t.id}
//                 className="min-w-[360px] sm:min-w-[360px]  lg:min-w-[330px]  cursor-pointer flex sm:p-3 p-2 rounded-tr-xl rounded-bl-xl border border-gray-700 shadow-md transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg snap-start"
//                 style={{
//                   backgroundImage: "linear-gradient(to right, #1c1c1c 40%, #6c6c6c 100%)",
//                 }}
//               >
//                 <div className="w-1/3 flex justify-center items-start">
//                   <Image
//                     src={t.image}
//                     alt="product"
//                     width={64}
//                     height={64}
//                     className="object-cover rounded-md border border-gray-700 shadow"
//                     priority
//                   />
//                 </div>


//                 <div className="w-2/3 pl-2 flex flex-col justify-between">
//                   <p className="text-[10px] font-bold text-green-400 mb-1">
//                     {t.comment}
//                   </p>
//                   <p className="text-xs text-gray-300 italic mb-2 leading-tight line-clamp-3">
//                     “{t.note}”
//                   </p>
//                   <div className="flex items-center gap-1 mt-auto">
//                     <Image
//                       src={"https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"}
//                       alt={"avatar"}
//                       width={28}
//                       height={28}
//                       className="rounded-full object-cover"
//                     />

//                     <div className="flex flex-col">
//                       <p className="text-xs font-medium text-gray-200 leading-tight">
//                         {t.fullName}
//                       </p>
//                       <div className="flex">
//                         {Array.from({ length: 5 }).map((_, i) => (
//                           <FaStar
//                             key={i}
//                             className={`w-3 h-3 ${i < t.rating ? "text-yellow-400" : "text-gray-600"}`}
//                           />
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Dots */}
//       <div className="mt-6 flex justify-center gap-2">
//         {visibleCount > 0 &&
//           Array.from({ length: Math.ceil(testimonials.length / visibleCount) }).map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => scrollToIndex(idx)}
//               className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-white" : "bg-gray-500"
//                 }`}
//             ></button>
//           ))}
//       </div>
//     </section>
//   );
// </>
//}

