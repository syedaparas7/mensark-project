"use client";

import React, { useState, useEffect } from "react";
import {db,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
// import { db } from "@/lib/firebase";

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      const querySnapshot = await getDocs(collection(db, "videos"));
      setVideos(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchVideos();
  }, []);

  const addVideo = async () => {
    if (!newVideo) return;
    const docRef = await addDoc(collection(db, "videos"), { url: newVideo });
    setVideos([...videos, { id: docRef.id, url: newVideo }]);
    setNewVideo("");
  };

  const deleteVideo = async (id) => {
    await deleteDoc(doc(db, "videos", id));
    setVideos(videos.filter((video) => video.id !== id));
  };

  return (
    <div className="p-6 mt-25">
      <h1 className="text-2xl font-bold mb-4">Videos</h1>

      {/* Upload Button + Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newVideo}
          onChange={(e) => setNewVideo(e.target.value)}
          placeholder="Enter video URL"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={addVideo}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload Video
        </button>
      </div>

      {/* Video List */}
      <ul className="space-y-2">
        {videos.map((video) => (
          <li
            key={video.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {video.url}
            </a>
            <button
              onClick={() => deleteVideo(video.id)}
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
