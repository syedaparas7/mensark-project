"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectFade } from "swiper/modules";
import { useRouter } from "next/navigation";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import Link from "next/link";

const slides = [
  {

    image: "https://fastarz.com/wp-content/uploads/2024/10/Shop-from-the-best-mens-casual-clothing-brand.jpg",
    heading: "Fine Quality\nFair Pricing",
    buttons: ["Explore Men"],
    link: "/apparel"
  },
  {
    image: "https://cdn.shopify.com/s/files/1/0649/3474/0225/files/mensbanner4.png?v=1739814405",
    heading: "Style & Comfort\nEvery Season",
    buttons: ["Sale"],
    link: "/sale"
  },
  {
    image: "https://static.vecteezy.com/system/resources/thumbnails/048/870/366/small/professional-man-in-white-shirt-posing-in-modern-office-environment-photo.jpeg",
    heading: "Latest Trends\nTop Designs",
    buttons: ["New Arrivals"],
    link: "/new-arrival"
  },
];

const belowTexts = [
  "Free Shipping On Orders Over $100",
  "Limited Edition Designs Now Live",
  "New Summer Collection Available",
  "Members Get Early Access to New Drops",
  "Hurry! Sale Ends This Weekend",
  "Sustainable Fashion That Feels Good",
  "New Colors Just Landed – Shop Now",
  "Back in Stock: Best-Selling Jackets",
  "Buy 1 Get 1 Free – Today Only",
  "Complimentary Gift on Orders Over $150",
  "Stay Cool – Lightweight Styles for Summer",
  "Rated 5 Stars by 10,000+ Customers",
  "Secure Checkout & Fast Delivery",
  "Join Our Loyalty Club & Earn Rewards",
  "Upgrade Your Look with Premium Fits",
];


export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % belowTexts.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="relative group w-full h-[80vh] md:h-screen overflow-hidden">
        {/* Swiper Slides */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Swiper
            modules={[Navigation, Autoplay, EffectFade]}
            loop
            effect="fade"
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            onBeforeInit={(swiper) => {
              if (typeof swiper.params.navigation !== "boolean") {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
            }}
            onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            className="w-full h-full"
          >
            {slides.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <div
                  className="w-full h-full bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div
                    className="absolute inset-0"
                  //   style={{
                  //     background:
                  //       "linear-gradient(to left, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.05) 100%)",
                  //   }}
                 />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Text Content */}
        {/* <div className="absolute z-50 lg:mr-40 md:mr-15 inset-y-0 right-0 flex flex-col justify-center max-w-lg w-full px-4 md:pr-10">
          <h2 className="text-3xl sm:text-5xl md:text-6xl mb-8 leading-tight text-left drop-shadow-xl">
            <div className="text-white">
              {slides[currentIndex].heading.split("\n")[0]}
            </div>
            <div className="text-white">
              {slides[currentIndex].heading.split("\n")[1]}
            </div>
          </h2>
          <div className="flex justify-start gap-4 flex-wrap">
            {slides[currentIndex].buttons.map((label, idx) => (
              <button
                key={idx}
                className="min-w-[150px] text-center px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold border border-white bg-transparent text-white hover:bg-white hover:text-black transition"
                onClick={() => router.push(slides[currentIndex].link)}
              >
                {label}
              </button>
            ))}
          </div>
        </div> */}


        {/* Custom Arrows */}
        <button
          ref={prevRef}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/40 hover:bg-black/70 hover:scale-110 
      transition-all duration-300 p-3 rounded-full z-30 shadow-lg 
      opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          ref={nextRef}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/40 hover:bg-black/70 hover:scale-110 
      transition-all duration-300 p-3 rounded-full z-30 shadow-lg 
      opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      {/* Below Text Strip */}
      <div className="w-full bg-white py-4 overflow-hidden relative">
        {/* <div className="animate-marquee whitespace-nowrap text-base sm:text-lg md:text-xl font-medium text-gray-800 text-center tracking-wide italic">
          {belowTexts.map((text, idx) => (
            <span key={idx} className="mx-8 inline-block">
              {text}
            </span>
          ))}
        </div> */}
      </div>

      {/* WhatsApp Floating Icon */}
      <Link
        href="https://wa.me/+923083503598"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="w-6 h-6" />
      </Link>
    </>
  );
}

