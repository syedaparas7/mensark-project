import { collection, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title');

  try {
    let q;

    // If `title` query is present, filter by title
    if (title) {
      const titleLower = title.toLowerCase();
      q = query(
        collection(db, 'products'),
        where('titleLower', '>=', titleLower),
        where('titleLower', '<=', titleLower + '\uf8ff')
      );
    } else {
      q = collection(db, 'products');
    }

    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(products), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch products.' }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, title, ...rest } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing product ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const productRef = doc(db, 'products', id);

    // Add `titleLower` to ensure case-insensitive search support
    const updateData = {
      title,
      ...rest,
      titleLower: title.toLowerCase(),
    };

    await updateDoc(productRef, updateData);

    return new Response(JSON.stringify({ message: 'Product updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Update failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Product ID is required for deletion' }), {
        status: 400,
      });
    }

    const docRef = doc(db, 'products', id);

    await deleteDoc(docRef);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete product.' }), {
      status: 500,
    });
  }
}