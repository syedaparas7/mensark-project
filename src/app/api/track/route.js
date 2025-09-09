import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '../../firebase';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  console.log('Querying orders for email:', email);

  try {
    const q = query(
      collection(db, 'orders'),
      where('email', '==', email.toLowerCase())
    );
    const snapshot = await getDocs(q);
    console.log('Order documents found:', snapshot.size);

    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return Response.json(orders);
  } catch (err) {
    console.error('Fetch error:', err);
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
