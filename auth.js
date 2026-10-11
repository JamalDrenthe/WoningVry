// Gedeelde Firebase-config en helpers voor WoningVrij auth-pagina's
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyB0_cbCa22cnBcs5deRXT00dI6t6gKApow",
  authDomain: "woningvry-prod.firebaseapp.com",
  projectId: "woningvry-prod",
  storageBucket: "woningvry-prod.firebasestorage.app",
  messagingSenderId: "445042161749",
  appId: "1:445042161749:web:079683f6d6c38409d77cdc",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
};

// Nederlandse foutmeldingen
const foutmeldingen = {
  "auth/email-already-in-use": "Dit e-mailadres is al geregistreerd. Log in of gebruik een ander adres.",
  "auth/invalid-email": "Dit is geen geldig e-mailadres.",
  "auth/weak-password": "Het wachtwoord moet minimaal 6 tekens bevatten.",
  "auth/invalid-credential": "Onjuiste combinatie van e-mailadres en wachtwoord.",
  "auth/wrong-password": "Onjuiste combinatie van e-mailadres en wachtwoord.",
  "auth/user-not-found": "Er is geen account met dit e-mailadres.",
  "auth/too-many-requests": "Te veel pogingen. Probeer het later opnieuw.",
  "auth/network-request-failed": "Geen verbinding. Controleer je internet.",
};
export function foutTekst(err) {
  return foutmeldingen[err?.code] || "Er ging iets mis. Probeer het opnieuw.";
}

// Toon melding onder een formulier
export function toonMelding(el, tekst, type = "error") {
  el.textContent = tekst;
  el.className = "form-melding form-melding--" + type;
  el.hidden = false;
}
