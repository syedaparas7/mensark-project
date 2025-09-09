import { db } from '../../firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
  where,
} from 'firebase/firestore';

export async function POST(req) {
  try {
    const body = await req.json();

    const reviewData = {
      fullName: body.fullName,
      email: body.email,
      productId: body.productId,
      productTitle: body.productTitle,
      image: body.image,
      rating: body.rating,
      comment: body.comment,
      note: body.note,
      createdAt: serverTimestamp(),
    };

    const reviewRef = await addDoc(collection(db, 'reviews'), reviewData);

    return new Response(JSON.stringify({ message: 'Review submitted', id: reviewRef.id }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return new Response(JSON.stringify({ message: 'Error submitting review' }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const productId = searchParams.get('productId');

    // 🔍 If email and productId are present, check if review exists
    if (email && productId) {
      const reviewsRef = collection(db, 'reviews');
      const q = query(reviewsRef, where('email', '==', email), where('productId', '==', productId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return new Response(JSON.stringify({ exists: false }), { status: 200 });
      }

      const data = querySnapshot.docs[0].data();
      return new Response(JSON.stringify({ exists: true, review: data }), { status: 200 });
    }

    // 🔁 Otherwise, return all reviews
    const allSnapshot = await getDocs(collection(db, 'reviews'));
    const allReviews = allSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(allReviews), {
      status: 200,
    });

  } catch (error) {
    console.error('Error in GET /api/review:', error);
    return new Response(JSON.stringify({ message: 'Error in GET /api/review' }), {
      status: 500,
    });
  }
}
