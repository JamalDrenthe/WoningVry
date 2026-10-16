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
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export const ADMIN_EMAILS = [
  "info@woningvry.nl",
  "info@jamaldrenthe.com",
];
export const ADMIN_EMAIL = "info@woningvry.nl";

export function isAdminEmail(email) {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((admin) => admin.toLowerCase() === normalized);
}

export const firebaseConfig = {
  apiKey: "AIzaSyB5JglCyZQ8MJbZAK55VAVEBTDqGDfp3Rg",
  authDomain: "woningvry-dev.firebaseapp.com",
  projectId: "woningvry-dev",
  storageBucket: "woningvry-dev.firebasestorage.app",
  messagingSenderId: "646933889467",
  appId: "1:646933889467:web:31d034e49f4137c15dc49e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

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
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  GoogleAuthProvider,
  signInWithPopup,
};

// Profiel synchroniseren met Firestore (rol toekennen, admin toewijzen bij info@woningvry.nl of info@jamaldrenthe.com)
export async function syncUserProfile(user, preferredRole = "zoekende") {
  if (!user) return null;
  const userRef = doc(db, "users", user.uid);
  const isSuperAdmin = isAdminEmail(user.email);

  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      const role = isSuperAdmin ? "admin" : (preferredRole || "zoekende");
      const profile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || (user.email ? user.email.split("@")[0] : "Gebruiker"),
        role: role,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        authProvider: user.providerData?.[0]?.providerId || "password",
      };
      if (role === "zoekende") {
        profile.woningType = "Tussenwoning / Appartement";
        profile.budgetMax = "€ 450.000";
        profile.locatieVoorkeur = "Randstad & Midden-Nederland";
        profile.status = "Ingeschreven - Wacht op ronde toewijzing";
      } else if (role === "aanbieder") {
        profile.bedrijfsnaam = user.displayName || "Woningaanbieder";
        profile.status = "Actief woningaanbieder";
      } else if (role === "admin") {
        profile.status = "Hoofdbeheerder";
      }
      await setDoc(userRef, profile);
      return profile;
    } else {
      const existing = snap.data();
      const role = isSuperAdmin ? "admin" : (existing.role || preferredRole || "zoekende");
      const updateData = {
        email: user.email,
        displayName: user.displayName || existing.displayName || user.email.split("@")[0],
        role: role,
        lastLoginAt: serverTimestamp(),
      };
      await setDoc(userRef, updateData, { merge: true });
      return { ...existing, ...updateData };
    }
  } catch (err) {
    console.warn("Fout bij synchroniseren gebruikersprofiel:", err);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split("@")[0],
      role: isSuperAdmin ? "admin" : (preferredRole || "zoekende"),
    };
  }
}

// Haal profiel op uit Firestore
export async function getUserProfile(uid) {
  if (!uid) return null;
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) return snap.data();
  } catch (err) {
    console.warn("Fout bij ophalen gebruikersprofiel:", err);
  }
  return null;
}

// Inloggen via Google OAuth popup
export async function signInWithGoogle(preferredRole = "zoekende") {
  const result = await signInWithPopup(auth, googleProvider);
  await syncUserProfile(result.user, preferredRole);
  return result.user;
}

// Inloggen met vaste demo-accounts
export async function signInDemo(type) {
  const email = type === "aanbieder" ? "aanbieder@woningvry.nl" : "zoekende@woningvry.nl";
  const pw = "Demo1234!";
  const cred = await signInWithEmailAndPassword(auth, email, pw);
  await syncUserProfile(cred.user, type);
  return cred.user;
}

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
  "auth/popup-closed-by-user": "Inloggen met Google is geannuleerd.",
  "auth/popup-blocked": "Het pop-upvenster is geblokkeerd. Sta pop-ups toe om in te loggen met Google.",
  "auth/cancelled-popup-request": "Er is al een inlogvenster geopend.",
  "auth/account-exists-with-different-credential": "Er bestaat al een account met dit e-mailadres via een andere aanmeldmethode.",
};

export function foutTekst(err) {
  return foutmeldingen[err?.code] || err?.message || "Er ging iets mis. Probeer het opnieuw.";
}

// Toon melding onder een formulier
export function toonMelding(el, tekst, type = "error") {
  el.textContent = tekst;
  el.className = "form-melding form-melding--" + type;
  el.hidden = false;
}
