import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return new Response(JSON.stringify(orders), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch orders.' }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const { id, status, paymentStatus } = await req.json();

    const orderRef = doc(db, 'orders', id);
    const updateData = { status };

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    await updateDoc(orderRef, updateData);

    return new Response(JSON.stringify({ message: 'Order updated' }), { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return new Response(JSON.stringify({ message: 'Failed to update order' }), { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Order ID is required for deletion' }), {
        status: 400,
      });
    }

    const docRef = doc(db, 'orders', id);

    await deleteDoc(docRef);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete order.' }), {
      status: 500,
    });
  }
}