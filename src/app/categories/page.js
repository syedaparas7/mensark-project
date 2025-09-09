import React from "react";
import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Men's Collection",
    image: "https://miro.medium.com/v2/resize:fit:1070/1*VZthCXMgjR1EnGDhxdR3sQ.jpeg",
    href: "/all-products",
  },
  {
    id: 2,
    name: "New Arrivals",
    image: "https://naturalselectionlondon.com/wp-content/uploads/2022/07/How-To-Wear-The-Smart-Casual-Dress-Code-For-Men-copy-2.jpg",
    href: "/new-arrival",
  },
  {
    id: 3,
    name: "T-Shirts",
    image:
      "https://media.istockphoto.com/id/1211952975/photo/portrait-of-confidence-thoughtful-young-man-in-full-suit-looking-away-while-sitting-on-the.jpg?s=612x612&w=0&k=20&c=nl3zCH4Tih2tqSgC2gViQgVNkkJgNvXZgfTtlN0srgs=",
    href: "/shirts",
  },
  {
    id: 4,
    name: "Shirts",
    image:
      "https://static.vecteezy.com/system/resources/thumbnails/032/454/862/small_2x/five-men-in-different-colors-of-polo-shirts-ai-generated-free-photo.jpg",
    href: "/shirts",
  },
  {
    id: 5,
    name: "Trousers",
    image:

      "https://hips.hearstapps.com/hmg-prod/images/mhl-tank-tops-carhartt-2397-lead-68069b90b9875.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=1200:*",
    href: "/trouser",
  },
  {
    id: 6,
    name: "Sale",
    image: "https://i.pinimg.com/236x/83/25/c1/8325c10606a59e1e5339df087c7ba268.jpg",
    href: "/sale",
  },
];

export default function CategoriesPage() {
  return (
    <section className="max-w-full mx-auto pb-6 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top 2 large boxes */}
        {categories.slice(0, 2).map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="relative group h-96 sm:h-[28rem] rounded-sm overflow-hidden shadow-lg border border-gray-200"
            style={{
              backgroundImage: `url(${cat.image})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition duration-300" />
            <span className="absolute inset-0 flex items-center justify-center text-white text-2xl sm:text-4xl font-bold tracking-wide cursor-pointer">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:text-3xl lg:grid-cols-4 gap-6">
        {/* 4 medium boxes */}
        {categories.slice(2, 6).map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="relative group h-56 sm:h-64 rounded-sm overflow-hidden shadow-md border border-gray-200"
            style={{
              backgroundImage: `url(${cat.image})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition duration-300" />
            <span className="absolute inset-0 flex items-center justify-center text-white text-lg sm:text-xl font-semibold cursor-pointer">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
