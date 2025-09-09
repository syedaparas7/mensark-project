'use client'

import { RefreshCcw, Repeat, CheckCircle, Info } from 'lucide-react'

export default function ExchangeReturnPolicy() {
  return (
    <section className="bg-[#f9f9f9] py-16 mt-16 px-4 md:px-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Exchange & Return Policy
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4 text-blue-600">
              <RefreshCcw size={28} />
              <h3 className="text-xl font-semibold text-gray-800">Return Policy</h3>
            </div>
            <p className="text-gray-600">
              You can return items within <strong>14 days</strong> of delivery if they’re
              unused, unwashed, and in their original packaging. Please ensure the tags
              are intact. Refunds will be processed once the item is received and inspected.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4 text-green-600">
              <Repeat size={28} />
              <h3 className="text-xl font-semibold text-gray-800">Exchange Process</h3>
            </div>
            <p className="text-gray-600">
              If you received the wrong size or a defective item, you may request an exchange
              within <strong>7 days</strong>. Products must be in original condition and
              exchange is subject to availability. We'll ship the replacement after inspecting
              the returned product.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition mb-10">
          <div className="flex items-center gap-3 mb-4 text-orange-500">
            <Info size={26} />
            <h3 className="text-xl font-semibold text-gray-800">Conditions for Return & Exchange</h3>
          </div>
          <ul className="list-disc pl-6 text-gray-600 space-y-1">
            <li>Items must be returned in unused and original condition.</li>
            <li>Returns must include all original tags and packaging.</li>
            <li>Products marked as final sale are not eligible.</li>
            <li>Returns based on change of mind are not accepted.</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-3 mb-4 text-purple-600">
            <CheckCircle size={26} />
            <h3 className="text-xl font-semibold text-gray-800">How to Initiate a Return or Exchange</h3>
          </div>
          <ol className="list-decimal pl-6 text-gray-600 space-y-1">
            <li>Log in to your account and navigate to “My Orders”.</li>
            <li>Select the item and choose “Return” or “Exchange” via contact us page.</li>
            <li>Follow the instructions and submit your request.</li>
            <li>Print the return label and securely pack the item.</li>
            <li>Drop off at your nearest courier point.</li>
            <li>Track the return status directly from your account dashboard.</li>
          </ol>
        </div>

        <p className="text-center text-gray-500 text-sm mt-10">
          Need more help? Visit our{' '}
          <a href="/contact" className="text-blue-600 hover:underline">Contact Page</a> and our team will assist you.
        </p>
      </div>
    </section>
  )
}
