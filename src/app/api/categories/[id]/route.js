import { NextResponse } from "next/server";
import { adminDb, verifyToken } from "@/lib/firebaseAdmin";

const categoriesRef = adminDb.collection("categories");

// ==========================
// ✅ UPDATE Category (PUT - Admin only)
// ==========================
export async function PUT(req, { params }) {
  try {
    const user = await verifyToken(req);
    if (!user || !user.admin) {
      return NextResponse.json({ error: "Unauthorized ❌" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    if (!id || !body.name) {
      return NextResponse.json(
        { error: "ID and Name are required" },
        { status: 400 }
      );
    }

    await categoriesRef.doc(id).update({
      name: body.name,
      image: body.image || "",
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { id, ...body, message: "Category updated ✨" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Category Error:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// ==========================
// ✅ DELETE Category (DELETE - Admin only)
// ==========================
export async function DELETE(req, { params }) {
  try {
    const user = await verifyToken(req);
    if (!user || !user.admin) {
      return NextResponse.json({ error: "Unauthorized ❌" }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: "Category ID required" },
        { status: 400 }
      );
    }

    await categoriesRef.doc(id).delete();

    return NextResponse.json(
      { id, message: "Category deleted 🗑️" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
