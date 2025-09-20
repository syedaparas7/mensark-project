import { NextResponse } from "next/server";
import { db } from "@/app/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

// ✅ GET - fetch all videos
export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "videos"));
    const videos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST - add new video
export async function POST(req) {
  try {
    const body = await req.json();
    await addDoc(collection(db, "videos"), body);
    return NextResponse.json({ message: "Video added successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT - update video
export async function PUT(req) {
  try {
    const { id, ...updatedData } = await req.json();
    const videoRef = doc(db, "videos", id);
    await updateDoc(videoRef, updatedData);
    return NextResponse.json({ message: "Video updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE - delete video
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await deleteDoc(doc(db, "videos", id));
    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
