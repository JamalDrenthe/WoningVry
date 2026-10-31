// Gedeelde Firebase-config en helpers voor WoningVry auth-pagina's
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
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export const ADMIN_EMAILS = [
  "info@woningvry.nl",
  "admin@woningvry.nl",
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
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  GoogleAuthProvider,
  signInWithPopup,
};

// Profiel synchroniseren met Firestore (rol toekennen, admin toewijzen bij info@woningvry.nl of info@jamaldrenthe.com)
export async function syncUserProfile(user, preferredRole = "zoekende", options = {}) {
  if (!user) return null;
  const userRef = doc(db, "users", user.uid);
  const isSuperAdmin = isAdminEmail(user.email);

  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      const role = isSuperAdmin ? "admin" : (preferredRole || "zoekende");
      const defaultAccountType = role === "admin" 
        ? "hoofdbeheerder" 
        : (role === "aanbieder" ? (options.accountType || "ontwikkelaar") : (options.accountType || "starter"));

      const profile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || options.name || (user.email ? user.email.split("@")[0] : "Gebruiker"),
        role: role,
        accountType: defaultAccountType,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        authProvider: user.providerData?.[0]?.providerId || "password",
      };

      if (role === "zoekende") {
        profile.woonvorm = options.woonvorm || "beide";
        profile.woningType = options.woningType || "Tussenwoning / Appartement";
        profile.budgetMax = options.budgetMax || "€ 450.000";
        profile.huurBudgetMax = options.huurBudgetMax || "€ 1.450 /mnd";
        profile.locatieVoorkeur = options.locatieVoorkeur || "Randstad & Midden-Nederland";
        profile.status = "Dossier geregistreerd | Toewijzingsronde 1";
        profile.dossierNotitie = options.dossierNotitie || "";
        profile.dossierStatus = "In voorbereiding";
        profile.favorieten = [];
      } else if (role === "aanbieder") {
        profile.bedrijfsnaam = options.bedrijfsnaam || user.displayName || "Woningaanbieder";
        profile.status = "Actief woningaanbieder";
        profile.aangebodenWoningen = [];
      } else if (role === "admin") {
        profile.status = "Hoofdbeheerder";
      }

      // Merge additional fields if provided
      if (options.phone) profile.phone = options.phone;
      if (options.woonplaats) profile.woonplaats = options.woonplaats;

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
      if (options.accountType && !existing.accountType) updateData.accountType = options.accountType;
      if (options.woonvorm && !existing.woonvorm) updateData.woonvorm = options.woonvorm;
      if (options.phone && !existing.phone) updateData.phone = options.phone;
      if (options.woonplaats && !existing.woonplaats) updateData.woonplaats = options.woonplaats;

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
      accountType: preferredRole === "aanbieder" ? "ontwikkelaar" : "starter",
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

// Sla aangepaste profieldata op in Firestore
export async function saveUserProfile(uid, data) {
  if (!uid) return false;
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    return true;
  } catch (err) {
    console.error("Fout bij opslaan gebruikersprofiel:", err);
    return false;
  }
}

// Favorieten opslaan en synchroniseren in Firestore
export async function saveUserFavorites(uid, favorites) {
  if (!uid || !Array.isArray(favorites)) return false;
  return await saveUserProfile(uid, { favorieten: favorites });
}

export async function getUserFavorites(uid) {
  const profile = await getUserProfile(uid);
  return profile?.favorieten || [];
}

// Bezichtiging opslaan in Firestore (/users/{uid}/bezichtigingen en root /bezichtigingen)
export async function addUserViewing(uid, viewingData) {
  try {
    const payload = {
      ...viewingData,
      userId: uid,
      uid: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: viewingData.status || "In aanvraag",
    };

    // Schrijf naar subcollectie van gebruiker
    const userViewingsRef = collection(db, "users", uid, "bezichtigingen");
    const docRef = await addDoc(userViewingsRef, payload);

    // Schrijf ook naar algemene bezichtigingen collectie voor platform-overzicht
    try {
      await setDoc(doc(db, "bezichtigingen", docRef.id), { ...payload, id: docRef.id });
    } catch (e) {
      console.warn("Root bezichtiging opslaan (optioneel):", e);
    }

    return { id: docRef.id, ...payload };
  } catch (err) {
    console.error("Fout bij opslaan bezichtiging in Firestore:", err);
    return null;
  }
}

// Bezichtigingen ophalen voor gebruiker uit Firestore
export async function getUserViewings(uid) {
  if (!uid) return [];
  try {
    const userViewingsRef = collection(db, "users", uid, "bezichtigingen");
    const snap = await getDocs(userViewingsRef);
    const viewings = [];
    snap.forEach((d) => viewings.push({ id: d.id, ...d.data() }));
    return viewings;
  } catch (err) {
    console.warn("Fout bij ophalen bezichtigingen uit Firestore:", err);
    return [];
  }
}

// Aanbieder woning listing toevoegen
export async function addAanbiederListing(uid, listingData) {
  try {
    const payload = {
      ...listingData,
      aanbiederUid: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: "Actief gepubliceerd",
    };

    // Sla op in subcollectie
    const userListingsRef = collection(db, "users", uid, "listings");
    const docRef = await addDoc(userListingsRef, payload);

    // En in centrale listings collectie
    try {
      await setDoc(doc(db, "listings", docRef.id), { ...payload, id: docRef.id });
    } catch (e) {
      console.warn("Root listing opslaan (optioneel):", e);
    }

    // Update profiel array van aangeboden woningen
    try {
      const profile = await getUserProfile(uid);
      const existing = profile?.aangebodenWoningen || [];
      existing.unshift({ id: docRef.id, titel: listingData.titel, stad: listingData.stad, prijs: listingData.prijs, type: listingData.type });
      await saveUserProfile(uid, { aangebodenWoningen: existing.slice(0, 50) });
    } catch (e) {
      console.warn("Profiel aangeboden woningen updaten:", e);
    }

    return { id: docRef.id, ...payload };
  } catch (err) {
    console.error("Fout bij opslaan listing in Firestore:", err);
    return null;
  }
}

// Aanbieder listings ophalen
export async function getAanbiederListings(uid) {
  if (!uid) return [];
  try {
    const userListingsRef = collection(db, "users", uid, "listings");
    const snap = await getDocs(userListingsRef);
    const listings = [];
    snap.forEach((d) => listings.push({ id: d.id, ...d.data() }));
    return listings;
  } catch (err) {
    console.warn("Fout bij ophalen aanbieder listings:", err);
    return [];
  }
}

// Haal alle gebruikers op voor het Admin Dashboard
export async function getAllUsersForAdmin() {
  try {
    const usersRef = collection(db, "users");
    const snap = await getDocs(usersRef);
    const users = [];
    snap.forEach((d) => users.push({ id: d.id, ...d.data() }));
    return users;
  } catch (err) {
    console.error("Fout bij ophalen gebruikers voor admin:", err);
    throw err;
  }
}

// Admin actie: status of rol van een gebruiker aanpassen
export async function updateUserStatusByAdmin(targetUid, status, newRole = null) {
  try {
    const update = { status, updatedAt: serverTimestamp() };
    if (newRole) update.role = newRole;
    return await saveUserProfile(targetUid, update);
  } catch (err) {
    console.error("Fout bij bijwerken gebruikersstatus:", err);
    return false;
  }
}

// Inloggen via Google OAuth popup
export async function signInWithGoogle(preferredRole = "zoekende", options = {}) {
  const result = await signInWithPopup(auth, googleProvider);
  await syncUserProfile(result.user, preferredRole, options);
  return result.user;
}

// Inloggen met vaste demo-accounts (zoekende, aanbieder, admin) - met auto-create fallback
export async function signInDemo(type) {
  let email;
  let defaultName;
  let accountType;
  if (type === "aanbieder") {
    email = "aanbieder@woningvry.nl";
    defaultName = "Vastgoed Partners BV";
    accountType = "ontwikkelaar";
  } else if (type === "admin") {
    email = "admin@woningvry.nl";
    defaultName = "WoningVry Directie";
    accountType = "hoofdbeheerder";
  } else {
    email = "zoekende@woningvry.nl";
    defaultName = "Sander de Zoeker";
    accountType = "starter";
  }
  const pw = "Demo1234!";

  try {
    const cred = await signInWithEmailAndPassword(auth, email, pw);
    await syncUserProfile(cred.user, type, { name: defaultName, accountType });
    return cred.user;
  } catch (err) {
    // Indien demo account nog niet bestaat in dit project, maak het automatisch aan
    if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
      try {
        const newCred = await createUserWithEmailAndPassword(auth, email, pw);
        await updateProfile(newCred.user, { displayName: defaultName });
        await syncUserProfile(newCred.user, type, { name: defaultName, accountType });
        return newCred.user;
      } catch (createErr) {
        console.error("Fout bij automatische demo aanmaak:", createErr);
        throw err;
      }
    }
    throw err;
  }
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
