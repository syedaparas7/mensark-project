"use client";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import Link from "next/link";

export default function LargeEcommerceFooter() {
  return (
    <footer className="w-screen max-w-screen overflow-x-hidden bg-[#1b1b1b] text-gray-300 pt-16 px-4 sm:px-6">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 overflow-x-hidden">

        {/* About Us */}
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-white text-2xl font-bold mb-5">Our Brand Story</h3>
          <p className="text-gray-400 max-w-md mb-6">
            At Mensark, we craft premium Shirts
            blending timeless style with unmatched comfort. Trusted by
            thousands of customers worldwide.
          </p>

          <div className="flex space-x-6 text-gray-400 text-lg">
            <Link href="https://www.facebook.com/profile.php?id=61577716630042" aria-label="Facebook" className="hover:text-white transition">
              <FaFacebookF />
            </Link>
             <Link href="https://www.instagram.com/mensark.pk?utm_source=qr&igsh=ZzJiNGtiY2Ewd3Zr" aria-label="Instagram" className="hover:text-white transition">
              <FaInstagram />
            </Link>
            <Link href="#" aria-label="Twitter" className="hover:text-white transition">
              <FaTwitter />
            </Link>
            <Link href="#" aria-label="LinkedIn" className="hover:text-white transition">
              <FaLinkedinIn />
            </Link>
          </div>
        </div>

        {/* Shop Categories */}
        <div>
          <h4 className="text-white text-xl font-semibold mb-5">Shop</h4>
          <ul className="space-y-3 text-gray-400">
            <li><Link href="all-products" className="hover:text-white transition">All Products</Link></li>
            <li><Link href="shirts" className="hover:text-white transition">Shirts</Link></li>
            <li><Link href="trouser" className="hover:text-white transition">Trousers</Link></li>
            <li><Link href="new-arrivals" className="hover:text-white transition">New Arrivals</Link></li>
            <li><Link href="sale" className="hover:text-white transition">Sale</Link></li>
            {/* <li><Link href="contact" className="hover:text-white transition">Contact Us</Link></li> */}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white text-xl font-semibold mb-5">Support</h4>
          <ul className="space-y-3 text-gray-400">
            <li><Link href="/about" className="hover:text-white transition">Customer Service</Link></li>
            <li><Link href="/track" className="hover:text-white transition">Shipping Info</Link></li>
            <li><Link href="/return-exchange" className="hover:text-white transition">Returns & Exchanges</Link></li>
            <li><Link href="/faqs" className="hover:text-white transition">FAQs</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact Support</Link></li>
            <li><Link href="about" className="hover:text-white transition">About Us</Link></li>
          </ul>
        </div>

        {/* Contact & Newsletter */}
        <div>
          {/* <h4 className="text-white text-xl font-semibold mb-5">Contact Us</h4> */}

          <ul className="text-gray-400 space-y-4 mb-6">
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-gray-500" />
              <span>B-75 Street 11 Mubarak Housing Society Jail Road Hyderabad Pakistan</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-gray-500" />
              <Link href="tel:+923083503598" className="hover:text-white transition">+923083503598</Link>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-gray-500" />
              <Link href="mailto:support@yourstore.com" className="hover:text-white transition">
                support@yourstore.com
              </Link>
            </li>
          </ul>

          <h4 className="text-white text-xl font-semibold">Follow us for Newsletter</h4>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-md text-gray-900 focus:outline-none"
              required
            />
          </form>

          <div className="flex items-center space-x-6 text-gray-400">
            <FaCcVisa size={40} />
            <FaCcMastercard size={40} />
            <FaCcPaypal size={40} />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t py-4 border-gray-700 mt-12 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Mensark. All rights reserved.
      </div>
    </footer>
  );
}
