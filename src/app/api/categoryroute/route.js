// import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// import { db } from '../../firebase';

// // GET all categories
// export async function GET() {
//   try {
//     const querySnapshot = await getDocs(collection(db, 'categories'));
//     const categories = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     return new Response(JSON.stringify(categories), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Failed to fetch categories.' }), {
//       status: 500,
//     });
//   }
// }

// // POST (Add new category)
// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { name } = body;

//     if (!name) {
//       return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
//     }

//     const newCategory = {
//       name,
//       createdAt: new Date(),
//     };

//     const docRef = await addDoc(collection(db, 'categories'), newCategory);

//     return new Response(JSON.stringify({ id: docRef.id, ...newCategory }), { status: 201 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Failed to create category.' }), { status: 500 });
//   }
// }

// // PUT (Update category)
// export async function PUT(req) {
//   try {
//     const body = await req.json();
//     const { id, ...rest } = body;

//     if (!id) {
//       return new Response(JSON.stringify({ error: 'Category ID required' }), { status: 400 });
//     }

//     const categoryRef = doc(db, 'categories', id);
//     await updateDoc(categoryRef, rest);

//     return new Response(JSON.stringify({ message: 'Category updated successfully' }), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Failed to update category.' }), { status: 500 });
//   }
// }

// // DELETE (Remove category)
// export async function DELETE(req) {
//   try {
//     const { id } = await req.json();

//     if (!id) {
//       return new Response(JSON.stringify({ error: 'Category ID required' }), { status: 400 });
//     }

//     const categoryRef = doc(db, 'categories', id);
//     await deleteDoc(categoryRef);

//     return new Response(JSON.stringify({ success: true }), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: 'Failed to delete category.' }), { status: 500 });
//   }
// }
