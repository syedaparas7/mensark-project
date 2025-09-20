"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import Image from "next/image";
import Loader from "@/app/loader/page";
import toast, { Toaster } from "react-hot-toast";
import { getAuth } from "firebase/auth";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", image: "" });
  const [editingCategory, setEditingCategory] = useState(null);

  // ✅ Load categories (GET - public)
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Get Auth Token helper
  const getToken = async () => {
    const auth = getAuth();
    const currUser = auth.currentUser;
    if (!currUser) {
      toast.error("Please login first!");
      return null;
    }
    return await currUser.getIdToken();
  };

  // ✅ Add new category (POST)
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return toast.error("Category name required");

    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) return;

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔑 send token
        },
        body: JSON.stringify(newCategory),
      });

      if (!res.ok) throw new Error("Failed to add category");

      toast.success("Category added successfully 🎉");
      setNewCategory({ name: "", image: "" });
      fetchCategories();
    } catch (error) {
      toast.error("Error adding category");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Delete category (DELETE)
  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete category");

      toast.success("Category deleted 🗑️");
      fetchCategories();
    } catch (error) {
      toast.error("Error deleting category");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Update category (PUT)
  const handleUpdateCategory = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      if (!token) return;

      const res = await fetch(`/api/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingCategory.name,
          image: editingCategory.image || "",
        }),
      });

      if (!res.ok) throw new Error("Failed to update category");

      toast.success("Category updated ✨");
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error("Error updating category");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      {isLoading && <Loader />}

      <div className="p-6 mt-10">
        <h1 className="text-2xl font-bold mb-4">📂 Categories</h1>

        {/* ✅ Add Category Form */}
        <form onSubmit={handleAddCategory} className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Category name"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            className="border p-2 rounded w-1/3"
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={newCategory.image}
            onChange={(e) =>
              setNewCategory({ ...newCategory, image: e.target.value })
            }
            className="border p-2 rounded w-1/3"
          />
          <button
            type="submit"
            className="bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-1"
          >
            <Plus size={18} /> Add
          </button>
        </form>

        {/* ✅ Categories List */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 border rounded shadow-sm flex flex-col items-center gap-2 bg-white"
            >
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={100}
                  height={100}
                  className="rounded object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded">
                  No Image
                </div>
              )}

              {/* ✅ Editing Mode */}
              {editingCategory?.id === cat.id ? (
                <div className="w-full">
                  <input
                    type="text"
                    value={editingCategory.name}
                    className="border p-1 rounded w-full mb-2"
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        name: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    value={editingCategory.image}
                    className="border p-1 rounded w-full mb-2"
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        image: e.target.value,
                      })
                    }
                  />
                  <button
                    onClick={handleUpdateCategory}
                    className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-medium">{cat.name}</h2>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setEditingCategory(cat)}
                      className="text-blue-600 flex items-center gap-1"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-red-600 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
