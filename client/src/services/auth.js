import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";


export function registerUser( email, pass) {
  return createUserWithEmailAndPassword(auth, email, pass);
}

export function loginUser(email, pass) {
    return signInWithEmailAndPassword(auth, email, pass);
}

export function logout() {
    return signOut(auth);
}

export async function sendVerification(email) {
  return await sendEmailVerification(auth,email)
}

export async function sendPassResetEmail(email) {
  return await sendPasswordResetEmail(auth, email);
}

export async function Another(email) {
  return await sendPasswordResetEmail(auth, email);
}