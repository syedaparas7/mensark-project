"use client";
import { useState } from "react";
import { makeAdmin } from "@/utils/makeAdmin";

export default function AdminPanel() {
  const [uid, setUid] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uid) return alert("Please enter UID");
    await makeAdmin(uid);
    setUid("");
  };

  return (
    <div className="p-6 bg-white text-black max-w-md mx-auto mt-10 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Set Admin User</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Enter User UID"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          className="px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Make Admin
        </button>
      </form>
    </div>
  );
}
