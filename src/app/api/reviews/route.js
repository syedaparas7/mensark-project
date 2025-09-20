
import { db } from "@/app/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

// 🔹 GET → Fetch all reviews

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "reviews"));
    const reviews = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id, // 👈 Firestore document id
      ...docSnap.data(),
    }));

    return new Response(JSON.stringify(reviews), { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch reviews" }), { status: 500 });
  }
}


// 🔹 DELETE → Delete a review
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ error: "Review ID is required" }), { status: 400 });
    }

    await deleteDoc(doc(db, "reviews", id));
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response(JSON.stringify({ error: "Failed to delete review" }), { status: 500 });
  }
}
