import { db } from '../../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;

    // === Handle Create Coupon ===
    if (action === 'create') {
      const { code, discount, type } = body;

      if (!code || !discount || !type) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
      }

      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 2); // Expires in 2 months

      const couponData = {
        code: code.trim().toUpperCase(),
        action: "create",
        discount: Number(discount),
        type, // "percentage" or "fixed"
        createdAt: serverTimestamp(),
        expiresAt: expiresAt.toISOString(),
        used: false,
      };

      await addDoc(collection(db, 'coupons'), couponData);

      return new Response(JSON.stringify({ message: 'Coupon created' }), { status: 200 });
    }

    // === Handle Apply Coupon ===
    else if (action === 'apply') {
      const { code } = body;

      if (!code) {
        return new Response(JSON.stringify({ error: 'Coupon code required' }), { status: 400 });
      }

      const q = query(collection(db, 'coupons'), where('code', '==', code.trim().toUpperCase()));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return new Response(JSON.stringify({ error: 'Invalid coupon code' }), { status: 404 });
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      const now = new Date();
      const expiresAt = new Date(data.expiresAt);

      if (data.used) {
        return new Response(JSON.stringify({ error: 'Coupon already used' }), { status: 400 });
      }

      if (expiresAt < now) {
        return new Response(JSON.stringify({ error: 'Coupon expired' }), { status: 400 });
      }

      return new Response(
        JSON.stringify({
          id: doc.id,
          discount: data.discount,
          type: data.type,
          code: data.code,
        }),
        { status: 200 }
      );
    }

    // === Invalid Action ===
    else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
    }
  } catch (error) {
    console.error('Coupon API Error:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'coupons'));
    const coupons = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return new Response(JSON.stringify(coupons), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch coupons.' }), {
      status: 500,
    });
  }
}


export async function PUT(req) {
  try {
    const { id } = await req.json();
    if (!id) return new Response(JSON.stringify({ error: 'Coupon ID is required' }), { status: 400 });

    const couponRef = doc(db, 'coupons', id);
    await updateDoc(couponRef, { used: true });

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Coupon ID is required." }), {
        status: 400,
      });
    }

    const couponRef = doc(db, "coupons", id);
    const docSnap = await getDoc(couponRef);

    if (!docSnap.exists()) {
      return new Response(JSON.stringify({ error: "Coupon not found." }), {
        status: 404,
      });
    }

    await deleteDoc(couponRef);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Failed to delete coupon:", error);
    return new Response(JSON.stringify({ error: "Failed to delete coupon." }), {
      status: 500,
    });
  }
}
