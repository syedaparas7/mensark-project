'use client';
import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import Image from 'next/image';
import uploadFileOnCloudinary from '../../../utils/cloudinary';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Loader from '@/app/loader/page';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    category: '',
    sizes: '',
    discount: '',
  });
  const [colors, setColors] = useState({});
  const [colorInput, setColorInput] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);


  // ✅ Fetch products based on search term from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/product${searchTerm ? `?title=${encodeURIComponent(searchTerm)}` : ''}`);
        const allProducts = await res.json();
        setProducts(allProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
      setIsLoading(false);
    };
    fetchProducts();
  }, [searchTerm]);

  useEffect(() => {
    if (showModal) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [showModal]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleAddColor = async () => {
    if (!colorInput.trim() || imageFiles.length === 0) return;
    const urls = await uploadFileOnCloudinary(imageFiles);
    setColors({ ...colors, [colorInput]: urls });
    setColorInput('');
    setImageFiles([]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const entry = {
      ...newProduct,
      sizes: newProduct.sizes.split(',').map((s) => s.trim()),
      discount: newProduct.discount || '0',
      colors,
      titleLower: newProduct.title.toLowerCase(),
    };
    try {
      if (editingProductId) {
        const res = await fetch('/api/product', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProductId, ...entry }),
        });

        const updatedProducts = products.map((p) =>
          p.id === editingProductId ? { ...p, ...entry } : p
        );
        setProducts(updatedProducts);
      } else {
        const docRef = await addDoc(collection(db, 'products'), entry);
        setProducts([...products, { id: docRef.id, ...entry }]);
      }
    } catch (err) {
      console.error('Error saving product:', err);
    }

    setNewProduct({ title: '', price: '', category: '', sizes: '', discount: '' });
    setColors({});
    setColorInput('');
    setImageFiles([]);
    setShowModal(false);
    setEditingProductId(null);
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      const res = await fetch('/api/product', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error(await res.text());

      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete product:', err.message);
    }
    setIsLoading(false);
  };

  const handleUpdate = (product) => {
    setIsLoading(true);
    setEditingProductId(product.id);
    setNewProduct({
      title: product.title,
      price: product.price,
      category: product.category,
      sizes: product.sizes.join(', '),
      discount: product.discount,
    });
    setColors(product.colors);
    setShowModal(true);
    setIsLoading(false);
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {isLoading && <Loader />}
      <div className="w-full pb-20 bg-white pt-30 text-black p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Product Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* new block */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:max-w-sm px-4 py-2 border rounded"
          />

          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-sm font-medium">
              Items per page:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border rounded text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
          </div>
        </div>


        <div className="overflow-auto">
          <table className="min-w-full bg-gray-100 border border-gray-300 rounded-lg text-sm">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Sizes</th>
                <th className="px-4 py-3">Images</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product, idx) => (
                <tr key={idx} className="border-t border-gray-300 text-center">
                  <td className="px-4 py-3">{product.title}</td>
                  <td className="px-4 py-3">Rs{product.price}</td>
                  <td className="px-4 py-3">{product.discount}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">{product.sizes.join(', ')}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {Object.entries(product.colors).flatMap(([color, urls]) =>
                        urls.map((url, idx) => (
                          <Image
                            key={`${color}-${idx}`}
                            src={url}
                            alt={`${product.title}-${color}`}
                            className="w-12 h-12 object-cover rounded"
                            height={48}
                            width={48}
                          />
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => handleUpdate(product)} className="p-2 rounded hover:bg-green-200">
                        <Pencil className="w-4 h-4 text-green-600" />
                      </button>
                      <button onClick={() => handleDelete(product?.id)} className="p-2 rounded hover:bg-red-200">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${currentPage === i + 1
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-black hover:bg-gray-100'
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="relative w-full max-w-lg m-4 bg-white rounded-lg shadow-lg text-black max-h-[90vh] overflow-y-auto p-6 scrollbar-none">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                <X />
              </button>
              <h2 className="text-xl font-semibold mb-4">
                {editingProductId ? 'Update Product' : 'Add New Product'}
              </h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {['title', 'price', 'discount', 'sizes'].map((field) => (
                  <input
                    key={field}
                    name={field}
                    required
                    placeholder={field === 'sizes' ? 'Sizes (comma-separated)' : field}
                    value={newProduct[field]}
                    onChange={(e) => setNewProduct({ ...newProduct, [field]: e.target.value })}
                    className="w-full px-3 py-2 border rounded placeholder:text-gray-400"
                  />

                ))}
                <select
                  name="category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-gray-700 placeholder:text-gray-400"
                >
                  <option value="" disabled className="text-gray-400">
                    Select Category
                  </option>
                  <option value="Shirt">Shirt</option>
                  {/* <option value="T-Shirts & Polos">T-Shirts & Polos</option> */}
                  <option value="Trousers">Trousers</option>
                </select>

                <div className="border rounded p-4 bg-gray-50">
                  <h3 className="font-semibold mb-2">Add Color & Images</h3>
                  <input
                    placeholder="Color Name (e.g., Navy)"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    className="w-full mb-2 px-3 py-2 border rounded placeholder:text-gray-400"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImageFiles(Array.from(e.target.files))}
                    className="w-full mb-2 px-3 py-2 border rounded text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700"
                  >
                    Save Color
                  </button>
                  {Object.entries(colors).length > 0 && (
                    <div className="mt-4 text-sm">
                      <p className="font-medium">Preview:</p>
                      {Object.entries(colors).map(([color, imgs]) => (
                        <div key={color}>
                          <p className="font-semibold">{color}:</p>
                          <div className="flex gap-1 flex-wrap mb-2">
                            {imgs
                              .filter((url) => url.match(/\.(jpg|jpeg|png|gif|webp)$/i))
                              .map((url, i) => (
                                <Image
                                  key={i}
                                  src={url}
                                  alt={`${color}-${i}`}
                                  className="w-12 h-12 object-cover rounded"
                                  height={48}
                                  width={48}
                                />
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
                >
                  {editingProductId ? 'Update Product' : 'Add Product'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
