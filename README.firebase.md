# WoningVry Firebase & Authenticatie

- **Firebase Project voor live en development:** `woningvry-dev`
- **Ontwikkeling Firebase Project:** `woningvry-dev`
- **Gekoppeld beheeraccount:** `info@woningvry.nl` (en `info@jamaldrenthe.com`)
- **Live website:** [https://www.woningvry.nl](https://www.woningvry.nl) (Vercel)
- **GitHub Repository:** [JamalDrenthe/WoningVry](https://github.com/JamalDrenthe/WoningVry.git)

---

## 🔐 Authenticatie & Rollen

### 1. Hoofdbeheerder (Admin)
- **Account:** `info@woningvry.nl` (primair) / `info@jamaldrenthe.com`
- **Inlogmethode:** Google OAuth (Single Sign-On) of E-mail/Wachtwoord
- **Rechten:** Automatisch toegekende rol `admin` in Firestore met toegang tot het **WoningVrij Beheerpaneel** op `account.html`. Kan alle woningzoekenden, woningaanbieders en reserveringen inzien.

### 2. Demo Account: Woningzoekende
- **E-mail:** `zoekende@woningvry.nl`
- **Wachtwoord:** `Demo1234!`
- **Rol:** `zoekende` ("Woningzoekende")
- **Dashboard:** Toont zoekprofiel (€ 450.000 max, tussenwoning/appartement) en status voor Ronde 1.

### 3. Demo Account: Woningaanbieder
- **E-mail:** `aanbieder@woningvry.nl`
- **Wachtwoord:** `Demo1234!`
- **Rol:** `aanbieder` ("Woningaanbieder")
- **Dashboard:** Toont Vastgoed Partners BV, geverifieerde partnerstatus, en mogelijkheid om woningen/kavels aan te melden.

### 4. Demo Account: Beheerder (Admin)
- **E-mail:** `admin@woningvry.nl`
- **Wachtwoord:** `Demo1234!`
- **Rol:** `admin` ("Hoofdbeheerder")
- **Dashboard:** 1-klik toegang tot het complete WoningVrij beheerpaneel, statistieken en gebruikersoverzicht.

---

## 🚀 Deployment & CI/CD
- **Website (Vercel):** Wijzigingen gepusht naar `main` op GitHub worden automatisch live gebouwd en uitgerold op `https://www.woningvry.nl`.
- **Firestore Rules:**
  ```bash
  firebase deploy --only firestore:rules
  ```
