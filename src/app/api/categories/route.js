import { NextResponse } from "next/server";
import { adminDb, verifyToken } from "@/lib/firebaseAdmin";

const categoriesRef = adminDb.collection("categories");

// ==========================
// ✅ GET all categories (public)
// ==========================
// ✅ GET all categories (public)
export async function GET() {
  try {
    const snapshot = await categoriesRef.get();
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories", details: error.message },
      { status: 500 }
    );
  }
}

// ==========================
// ✅ POST (Admin Only)
// ==========================
export async function POST(req) {
  try {
    const user = await verifyToken(req);
    if (!user || !user.admin) {
      return NextResponse.json({ error: "Unauthorized ❌" }, { status: 403 });
    }

    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const docRef = await categoriesRef.add({
      name: body.name,
      image: body.image || "",
      createdAt: new Date(),
    });

    return NextResponse.json({ id: docRef.id, ...body }, { status: 201 });
  } catch (error) {
    console.error("POST Category Error:", error);
    return NextResponse.json(
      { error: "Failed to add category" },
      { status: 500 }
    );
  }
}

// ==========================
// ✅ PUT (Admin Only) → Update Category
// ==========================
export async function PUT(req) {
  try {
    const user = await verifyToken(req);
    if (!user || !user.admin) {
      return NextResponse.json({ error: "Unauthorized ❌" }, { status: 403 });
    }

    const body = await req.json();
    if (!body.id || !body.name) {
      return NextResponse.json(
        { error: "ID and Name are required" },
        { status: 400 }
      );
    }

    await categoriesRef.doc(body.id).update({
      name: body.name,
      image: body.image || "",
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("PUT Category Error:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// ==========================
// ✅ DELETE (Admin Only)
// ==========================
export async function DELETE(req) {
  try {
    const user = await verifyToken(req);
    if (!user || !user.admin) {
      return NextResponse.json({ error: "Unauthorized ❌" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID required" }, { status: 400 });
    }

    await categoriesRef.doc(id).delete();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
