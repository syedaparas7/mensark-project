import { db } from '../../../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req) {
  try {
    const body = await req.json();
    const { formData, cartItems, amount, paymentMethod, paymentStatus } = body;
    console.log(formData)

    await addDoc(collection(db, 'orders'), {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      cartItems,
      amount,
      paymentMethod,
      paymentStatus,
      status: 'Order Placed',
      createdAt: serverTimestamp(),
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error('Error saving COD order:', err);
    return Response.json({ success: false, error: 'Failed to save order' }, { status: 500 });
  }
}
