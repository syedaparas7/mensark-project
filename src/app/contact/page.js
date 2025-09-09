"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import Loader from "../loader/page";

export default function ContactUsSection() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  // Use formData directly
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.success) {
      toast.success('Form submitted successfully!');
    }
  } catch (error) {
    toast.error('Something went wrong');
    console.error('Error submitting form:', error);
  }

  setIsLoading(false);
  toast("Thank you for contacting us!");
  setFormData({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
};



  return (
    <>
      {isLoading && <Loader />}
      <section
        className="relative w-full bg-cover bg-center py-20 px-4 sm:px-8"
        style={{
          backgroundImage:
            "url('https://cdn.sanity.io/images/vxy259ii/production/15f7db48a676b281efea321fd8b33d7496baf067-2560x1707.jpg?auto=format&crop=entropy&fit=crop&h=810&q=80&w=1440')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-start pt-30 gap-12">
          {/* Left - Info */}
          <div className="lg:w-1/2 text-white">
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              Contact Us
            </h2>
            <p className="text-lg text-white mb-6 max-w-md">
              We'd love to hear from you! Whether you have a question about our
              products, pricing, or anything else — our team is ready to help.
            </p>
            <ul className="text-white/90 text-md space-y-1">
              <li>📧 Email: support@yourstore.com</li>
              <li>📞 Phone: +923083503598</li>
              <li>🏢 B-75 Street 11 Mubarak Housing Society Jail Road Hyderabad Pakistan</li>
            </ul>
          </div>

          {/* Right - Form */}
          <div className="lg:w-1/2 bg-white/90 backdrop-blur-sm p-10 rounded-lg shadow-2xl w-full">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 text-gray-900 text-sm"
            >
              {/* Name */}
              <div className="flex flex-col sm:col-span-2">
                <label className="mb-1 font-semibold">Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-500 focus:ring-2 focus:ring-gray-800 outline-none transition"
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col sm:col-span-2">
                <label className="mb-1 font-semibold">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-500 focus:ring-2 focus:ring-gray-800 outline-none transition"
                  required
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col sm:col-span-2">
                <label className="mb-1 font-semibold">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 placeholder-gray-500 focus:ring-2 focus:ring-gray-800 outline-none transition"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col sm:col-span-2">
                <label className="mb-1 font-semibold">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none placeholder-gray-500 focus:ring-2 focus:ring-gray-800 outline-none transition"
                  required
                ></textarea>
              </div>

              {/* Submit */}
              <div className="sm:col-span-2 text-right">
                <button
                  type="submit"
                  className="bg-black text-white px-8 py-3 font-semibold transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.02]"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
