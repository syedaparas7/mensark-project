import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
 initializeApp({
   credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // 🔑 Yeh line fix karke likho
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}
 else {
  app = getApps()[0];
 }
export const adminDb = getFirestore(app);
export const adminAuth = getAuth(app);

// ✅ Token verify helper
export async function verifyToken(req) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    return decodedToken;
  } catch (error) {
    console.error("verifyToken Error:", error);
    return null;
  }
}