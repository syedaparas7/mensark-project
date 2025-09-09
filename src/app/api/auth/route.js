import { NextResponse } from 'next/server';
import { auth, db } from '@/app/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { setDoc, getDoc, doc } from 'firebase/firestore';


export async function POST(req) {
  function mapFirebaseError(error) {
    const code = error.code || '';
    switch (code) {
      case 'auth/email-already-in-use': return 'This email is already registered.';
      case 'auth/invalid-email': return 'The email address is not valid.';
      case 'auth/weak-password': return 'Password should be at least 6 characters.';
      case 'auth/wrong-password': return 'Incorrect password.';
      case 'auth/user-not-found': return 'No account found with this email.';
      default: return error.text || 'Authentication failed. Please try again.';
    }
  }

  try {
    const { fullName, email, password, isSignUp, role = 'user' } = await req.json();
    let userCredential;

    if (isSignUp) {
      try {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);

        if (fullName) {
          await updateProfile(userCredential.user, { displayName: fullName });
        }

        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          fullName,
          role,
        });

      } catch (err) {
        console.error('Firebase Signup Error:', err.code);
        return NextResponse.json({ message: mapFirebaseError(err) }, { status: 400 });
      }
    } else {
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        console.error('Firebase Login Error:', err.code);
        return NextResponse.json({ message: mapFirebaseError(err) }, { status: 400 });
      }
    }

    const user = userCredential.user;

    const docSnap = await getDoc(doc(db, 'users', user.uid));
    const userData = docSnap.exists() ? docSnap.data() : {};

    if (userData.role !== 'admin') {
      return NextResponse.json({ message: 'You are not allowed to sign in here.' }, { status: 403 });
    }

    return NextResponse.json({
      user: {
        email: user.email,
        uid: user.uid,
        fullName: user.displayName || '',
        role: userData.role || 'user',
      },
    });
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json(
      { message: 'Server error. Please try again later.' },
      { status: 500 }
    );
  }
}




