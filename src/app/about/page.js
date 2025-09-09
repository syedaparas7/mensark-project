"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const tabs = [
  {
    title: "Made for You",
    id: "made-for-you",
    content: {
      text: "Our white-glove bespoke service is where your individuality is our ultimate masterpiece. From bespoke illustrations to the selection of materials, cuts, fabrics, prints, and finishing touches, you become a collaborator with our in-house design consultant team to shape pieces that fit your lifestyle and are unmistakably you.",
      image: "https://creator.nightcafe.studio/jobs/PvYJN4uXpnjSaTs7rzTr/PvYJN4uXpnjSaTs7rzTr--1--ban9z.jpg",
    },
  },
  {
    title: "Made to Fit",
    id: "made-to-fit",
    content: {
      text: "Redefining the standards of fit, we are the pioneers in custom-fitting outerwear, a rarity in the online apparel sphere. With precision at the forefront, we’ve fine-tuned our processes with technology-driven experiences to suggest & build your outerwear according to your measurements, making the perfect fit accessible to everyone.",
      image: "https://blog.thejacketmaker.com/wp-content/uploads/2022/10/Textured-Jackets-and-Coats.jpg",
    },
  },
  {
    title: "Made to Last",
    id: "made-to-last",
    content: {
      text: "At The Jacket Maker, we&apos;re all about longevity. Our expert craftspeople thoughtfully design & handcraft your jackets one at a time with elite attention to detail, using the finest full-grain leathers & suede, durable hardware, and finishings to ensure that with us, durability is not just a promise; it&apos;s a guarantee.",
      image: "https://www.mrporter.com/content/images/cms/ycm/resource/blob/24214774/740fe3a2bef81506bd934df1adfeb40d/1-jpg-data.jpg/w800_q80.jpg",
    },
  },
];

export default function AboutUsTabs() {
  const [activeTab, setActiveTab] = useState("made-for-you");
  const current = tabs.find((tab) => tab.id === activeTab);

  const isImageCompatibleWithNext = (url) => {
    return (
      url.includes("shopifycdn.com") ||
      url.includes("istockphoto.com") ||
      url.includes("thejacketmaker.com") ||
      url.includes("mrporter.com")
    );
  };

  return (
<section
  className="w-full bg-[#1b1b1b] px-4 sm:px-6 py-20 pt-26 border-b border-gray-300"
  style={{
    backgroundImage: "linear-gradient(to right, #f9fafb 0%, #f3f4f6 40%, #ffffff 100%)",
  }}
>
  <div className="max-w-[90rem] mx-auto flex flex-col items-center justify-center text-center mb-16 pt-4 px-4">
    <h2 className="text-gray-900 text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
      About Us
    </h2>
    <p className="text-gray-600 text-sm sm:text-base max-w-2xl">
      We are passionate about crafting high-quality apparel that blends style, comfort, and performance. Our mission is to provide exceptional outerwear designed for urban explorers and modern adventurers alike.
    </p>
  </div>

  <div className="max-w-[90rem] mx-auto min-h-[600px] flex flex-col md:flex-row">
    {/* Left Content */}
    <div className="w-full md:w-1/2 flex flex-col justify-start py-4 space-y-6 pr-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-6 border-b py-14 border-gray-300 pb-3">
        {tabs.map((tab) => (
          <h3
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer text-sm sm:text-base lg:text-lg font-medium transition text-gray-600 hover:text-black border-b-2 pb-1 ${
              activeTab === tab.id ? "border-black text-black" : "border-transparent"
            }`}
          >
            {tab.title}
          </h3>
        ))}
      </div>

      {/* Description */}
      <div className="text-gray-800 pt-4 py-8 text-sm sm:text-base leading-loose">
        {current?.content.text}
      </div>

      {/* Button */}
      <Link
        href="#contact"
        className="inline-block w-[180px] bg-black text-white px-5 py-2.5 text-sm sm:text-base font-medium hover:bg-gray-800 transition text-center"
      >
        Learn More
      </Link>
    </div>

    {/* Right Image */}
    <div className="w-full md:w-1/2 h-64 md:h-auto relative rounded-2 overflow-hidden shadow-md mt-10 md:mt-0">
      {current?.content.image && (
        isImageCompatibleWithNext(current.content.image) ? (
          <Image
            src={current.content.image}
            alt={current.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <Image
            src={current.content.image}
            alt={current.title}
            className="w-full h-full object-cover"
            fill
            priority
          />
        )
      )}
    </div>
  </div>
</section>


  );
}

