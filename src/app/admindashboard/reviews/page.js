
'use client';
import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import uploadFileOnCloudinary from '../../../utils/cloudinary';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
// import Loader from '@/app/loader/page';

import {
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
// import { db } from "@/lib/firebase";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      const querySnapshot = await getDocs(collection(db, "reviews"));
      setReviews(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchReviews();
  }, []);

  const addReview = async () => {
    if (!newReview || !userName) return;
    const docRef = await addDoc(collection(db, "reviews"), {
      review: newReview,
      user: userName,
    });
    setReviews([...reviews, { id: docRef.id, review: newReview, user: userName }]);
    setNewReview("");
    setUserName("");
  };

  const deleteReview = async (id) => {
    await deleteDoc(doc(db, "reviews", id));
    setReviews(reviews.filter((review) => review.id !== id));
  };

  return (
    <div className="p-6 mt-25">
      <h1 className="text-2xl font-bold mb-4">Client Reviews</h1>

      {/* Review Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="border p-2 rounded w-1/3"
        />
        <input
          type="text"
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Enter review"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={addReview}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Review
        </button>
      </div>

      {/* Review List */}
      <ul className="space-y-2">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <div>
              <p className="font-semibold">{review.user}</p>
              <p className="text-gray-600">{review.review}</p>
            </div>
            <button
              onClick={() => deleteReview(review.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
