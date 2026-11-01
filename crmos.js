// CRMos REST API — Bi-directionele Client voor WoningVry Ecosysteem
// Base URL: https://crmos.one/api/v1
// Auth: X-CRMOS-API-KEY of Bearer token

export const CRMOS_CONFIG = {
  baseUrl: "https://crmos.one/api/v1",
  devUrl: "http://localhost:5173/api/v1",
  apiKey: "crm_live_master_jamaldrenthe_2026_all_ecosystem",
};

/**
 * Generieke CRMos fetch wrapper met API-key authenticatie
 */
async function crmosFetch(endpoint, options = {}) {
  const url = `${CRMOS_CONFIG.baseUrl}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    "X-CRMOS-API-KEY": CRMOS_CONFIG.apiKey,
    "Authorization": `Bearer ${CRMOS_CONFIG.apiKey}`,
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const contentType = res.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } else {
      const text = await res.text();
      return { ok: res.ok, status: res.status, rawText: text };
    }
  } catch (err) {
    console.warn(`[CRMos API] Netwerkfout bij call naar ${endpoint}:`, err);
    return { ok: false, error: err.message || err };
  }
}

// ===============================================================
// 1. DATA OPHALEN & REALTIME ZOEKEN (GET)
// ===============================================================

/**
 * Universeel zoeken in CRMos over contacten, deals, kandidaten en teams
 * GET /api/v1/search?q={zoekterm}
 */
export async function crmosSearch(query) {
  if (!query) return { ok: false, error: "Geen zoekterm opgegeven" };
  return await crmosFetch(`/search?q=${encodeURIComponent(query)}`);
}

/**
 * Contacten ophalen of filteren
 * GET /api/v1/contacts?q={query}&company_tag={tag}&tag={tag}
 */
export async function crmosGetContacts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const endpoint = qs ? `/contacts?${qs}` : "/contacts";
  return await crmosFetch(endpoint);
}

/**
 * Enkel contact op ID ophalen
 * GET /api/v1/contacts/{id}
 */
export async function crmosGetContactById(id) {
  if (!id) return { ok: false, error: "Geen contact-ID opgegeven" };
  return await crmosFetch(`/contacts/${encodeURIComponent(id)}`);
}

/**
 * Referral Teams & Kernleiders ophalen
 * GET /api/v1/teams
 */
export async function crmosGetTeams() {
  return await crmosFetch("/teams");
}

/**
 * Bedrijven & Pipelines ophalen
 * GET /api/v1/companies
 */
export async function crmosGetCompanies() {
  return await crmosFetch("/companies");
}

/**
 * Deals ophalen
 * GET /api/v1/deals?company={bedrijf}
 */
export async function crmosGetDeals(company = "") {
  const endpoint = company ? `/deals?company=${encodeURIComponent(company)}` : "/deals";
  return await crmosFetch(endpoint);
}

/**
 * Sollicitaties & No Cure No Pay profielen ophalen
 * GET /api/v1/candidates
 */
export async function crmosGetCandidates() {
  return await crmosFetch("/candidates");
}

// ===============================================================
// 2. DATA TERUGSCHRIJVEN & VERRIJKEN (POST, PUT, PATCH)
// ===============================================================

/**
 * Contact inschrijven of slim verrijken (Upsert)
 * POST /api/v1/contacts/upsert
 */
export async function crmosUpsertContact(contact) {
  return await crmosFetch("/contacts/upsert", {
    method: "POST",
    body: JSON.stringify(contact),
  });
}

/**
 * Nieuw contact aanmaken
 * POST /api/v1/contacts
 */
export async function crmosCreateContact(contact) {
  return await crmosFetch("/contacts", {
    method: "POST",
    body: JSON.stringify(contact),
  });
}

/**
 * Bestaand contact bijwerken
 * PATCH /api/v1/contacts/{id}
 */
export async function crmosUpdateContact(id, updates) {
  if (!id) return { ok: false, error: "Geen contact-ID opgegeven" };
  return await crmosFetch(`/contacts/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

/**
 * Deal / Verkoopkans inschrijven in Sales Pipeline
 * POST /api/v1/deals
 */
export async function crmosCreateDeal(deal) {
  return await crmosFetch("/deals", {
    method: "POST",
    body: JSON.stringify(deal),
  });
}

/**
 * Activiteit / Gespreksnotitie loggen
 * POST /api/v1/activities
 */
export async function crmosLogActivity(activity) {
  return await crmosFetch("/activities", {
    method: "POST",
    body: JSON.stringify(activity),
  });
}

/**
 * No Cure No Pay Sollicitant inschrijven
 * POST /api/v1/candidates
 */
export async function crmosCreateCandidate(candidate) {
  return await crmosFetch("/candidates", {
    method: "POST",
    body: JSON.stringify(candidate),
  });
}

// ===============================================================
// 3. WONINGVRY SPECIFIEKE AUTOMATISCHE SYNC-ADAPTERS
// ===============================================================

/**
 * Synchroniseert een WoningVry gebruiker automatisch naar CRMos
 * Wordt getriggerd bij registratie, profielupdate of dossierwijziging
 */
export async function syncWoningVryUserToCRMos(profile) {
  if (!profile || !profile.email) return null;

  const names = (profile.displayName || profile.name || "").trim().split(" ");
  const firstName = names[0] || (profile.email ? profile.email.split("@")[0] : "Deelnemer");
  const lastName = names.slice(1).join(" ") || "WoningVry";

  const tags = ["#woningvry", "WoningVry Deelnemer"];
  if (profile.role) tags.push(profile.role === "aanbieder" ? "Woningaanbieder" : "Woningzoekende");
  if (profile.accountType) tags.push(profile.accountType);
  if (profile.woonvorm) tags.push(`woonvorm:${profile.woonvorm}`);

  const notesParts = [
    `WoningVry Rol: ${profile.role || "zoekende"} (${profile.accountType || "starter"})`,
    profile.woonvorm ? `Gewenste woonvorm: ${profile.woonvorm}` : null,
    profile.budgetMax ? `Max koopbudget: ${profile.budgetMax}` : null,
    profile.huurBudgetMax ? `Max huurbudget: ${profile.huurBudgetMax}` : null,
    profile.locatieVoorkeur ? `Voorkeurslocatie: ${profile.locatieVoorkeur}` : null,
    profile.status ? `Dossierstatus: ${profile.status}` : null,
    profile.dossierNotitie ? `Toelichting: "${profile.dossierNotitie}"` : null,
  ].filter(Boolean);

  const contactPayload = {
    first_name: firstName,
    last_name: lastName,
    email: profile.email,
    phone: profile.phone || profile.phoneNumber || "",
    company: profile.bedrijfsnaam || (profile.role === "aanbieder" ? "Vastgoedpartner" : "WoningVry Deelnemer"),
    company_tags: ["#woningvry"],
    tags: tags,
    notes: notesParts.join(" | "),
    status: profile.role === "admin" ? "admin" : "qualified",
  };

  try {
    const res = await crmosUpsertContact(contactPayload);

    // Als de gebruiker een koopbudget heeft, registreer optioneel een deal
    if (profile.budgetMax && profile.role === "zoekende") {
      const budgetNum = parseInt(String(profile.budgetMax).replace(/[^0-9]/g, ""), 10) || 350000;
      await crmosCreateDeal({
        name: `WoningVry Toewijzing: ${firstName} ${lastName}`,
        value: budgetNum,
        stage: "proposal",
        company_name: "WoningVry Ecosysteem",
        contact_id: profile.uid || profile.email,
        probability: 75,
      }).catch(() => {});
    }

    return res;
  } catch (err) {
    console.warn("[CRMos Sync] Kon gebruiker niet synchroniseren naar CRMos:", err);
    return null;
  }
}

/**
 * Synchroniseert een bezichtigingsaanvraag naar CRMos als activiteit & lead
 */
export async function syncViewingToCRMos(viewing) {
  if (!viewing || !viewing.email) return null;

  const names = (viewing.fullName || "").trim().split(" ");
  const firstName = names[0] || "Kandidaat";
  const lastName = names.slice(1).join(" ") || "";

  // 1. Zorg dat contact bestaat in CRMos
  await crmosUpsertContact({
    first_name: firstName,
    last_name: lastName,
    email: viewing.email,
    phone: viewing.phone || "",
    company: "WoningVry Bezichtigingen",
    company_tags: ["#woningvry"],
    tags: ["#woningvry", "Bezichtiging Aangevraagd"],
    notes: `Bezichtiging aangevraagd voor: ${viewing.propertyTitle || "Woning"} (Datum: ${viewing.preferredDate || "In overleg"} ${viewing.preferredTime || ""}). Bericht: "${viewing.message || "-"}"`,
    status: "qualified",
  }).catch(() => {});

  // 2. Log de activiteit in CRMos
  try {
    return await crmosLogActivity({
      contact_id: viewing.email,
      type: "meeting",
      title: `Bezichtigingsafspraak: ${viewing.propertyTitle || "Woning"}`,
      description: `Voorkeursdatum: ${viewing.preferredDate || "In overleg"} (${viewing.preferredTime || "Flexibel"}). Kandidaat: ${viewing.fullName} (${viewing.phone}). Bericht: ${viewing.message || "Geen"}`,
      performed_by: "WoningVry Web Platform",
    });
  } catch (err) {
    console.warn("[CRMos Sync] Kon bezichtiging niet loggen in CRMos:", err);
    return null;
  }
}
