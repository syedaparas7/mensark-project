'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

const faqs = [
  {
    question: "How can I track my order?",
    answer:
      "You can track your order by logging into your account and visiting the 'My Orders' section. Real-time tracking details are available once your order has been shipped.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 14 days of delivery, provided the item is unused, unwashed, and in its original packaging. Refunds are issued after quality checks.",
  },
  {
    question: "Can I exchange an item I purchased?",
    answer:
      "Yes, items can be exchanged within 7 days if they are in their original condition. Exchange requests can be made from your account under 'My Orders'.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Standard delivery usually takes 3–5 business days depending on your location. Delays may occur during holidays or sale events.",
  },
  {
    question: "Is cash on delivery available?",
    answer:
      "Yes, we offer Cash on Delivery across Pakistan. Please make sure your shipping information is correct before placing the order.",
  },
]

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-[#f9f9f9] py-16 mt-16 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6 text-blue-600">
          <HelpCircle size={28} />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-gray-800 font-medium text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="text-gray-600" />
                ) : (
                  <ChevronDown className="text-gray-600" />
                )}
              </button>
              <div
                className={`px-6 pb-4 text-gray-600 transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'block' : 'hidden'
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-10">
          Still have questions? Reach out via our{' '}
          <a href="/contact" className="text-blue-600 hover:underline">Contact Page</a> for assistance.
        </p>
      </div>
    </section>
  )
}
