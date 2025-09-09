import { NextResponse } from 'next/server';
import { auth } from '@/app/firebase';
import { sendPasswordResetEmail } from 'firebase/auth'; 

export async function POST(req) {
  try {
    const { resetEmail } = await req.json();

    if (!resetEmail) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    await sendPasswordResetEmail(auth, resetEmail);

    return NextResponse.json({ message: 'Password reset email sent successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to send reset email.' },
      { status: 500 }
    );
  }
}
