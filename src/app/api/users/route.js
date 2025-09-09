import { db } from '@/app/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch users.' }), { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const { userId, newRole } = body;

    if (!userId || !newRole) {
      return new Response(JSON.stringify({ error: "Missing userId or newRole" }), { status: 400 });
    }

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: newRole });

    return new Response(JSON.stringify({ message: "Role updated successfully." }), { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return new Response(JSON.stringify({ error: 'Failed to update role.' }), { status: 500 });
  }
}
