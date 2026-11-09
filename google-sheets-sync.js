// ============================================================
// WONINGVRY — GOOGLE SHEETS SYNC MODULE (Funda & Pararius)
// Synchroniseert gescrapete woningen naar Google Sheets via:
// 1. Google Sheets CLI (gsheets mutate append)
// 2. Google Apps Script Web App Endpoint (Directe POST/Webhook zonder OAuth issues)
// 3. Downloadbare CSV / Directe export
// ============================================================

import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

/**
 * Kolomheaders voor de WoningVry Google Sheet
 */
export const GOOGLE_SHEETS_COLUMNS = [
  "ID",
  "Bron",
  "Plaatsingsdatum (Funda/Pararius)",
  "Scrapedatum",
  "Categorie",
  "Woningtype",
  "Adres",
  "Postcode",
  "Stad",
  "Wijk",
  "Prijs",
  "Prijs Numeriek (€)",
  "Borg / Waarborgsom",
  "Borg Numeriek (€)",
  "Contractduur / Looptijd",
  "Inkomenseis",
  "Oppervlakte (m²)",
  "Kamers",
  "Slaapkamers",
  "Energielabel",
  "Bouwjaar",
  "Makelaar / Aanbieder",
  "Bron URL",
  "Status"
];

/**
 * Zet een WoningVry woning-object om naar een enkele rij (array van strings/nummers) voor Google Sheets
 */
export function propertyToSheetRow(prop) {
  const isKoop = (prop.category || "koop") === "koop";
  const scrapedAt = new Date().toISOString().replace("T", " ").slice(0, 19);
  const pubDate = prop.publicationDate || "Niet vermeld";
  const platform = prop.sourcePlatform || "Funda / Pararius";
  const catText = isKoop ? "Koop" : (prop.category === "kamer" ? "Kamer / Studio" : "Huur");

  return [
    prop.id || "",
    platform,
    pubDate,
    scrapedAt,
    catText,
    prop.propertyType || "Appartement",
    prop.address || "",
    prop.postalCode || "",
    prop.city || "",
    prop.neighborhood || "",
    prop.priceDisplay || `€ ${prop.priceVal}`,
    prop.priceVal || 0,
    prop.depositDisplay || (isKoop ? `€ ${Math.round(prop.priceVal * 0.10)} (10% NVM)` : `€ ${prop.priceVal}`),
    prop.depositAmount || (isKoop ? Math.round(prop.priceVal * 0.10) : prop.priceVal),
    prop.contractTerms || (isKoop ? "Kosten koper (k.k.)" : "Onbepaalde tijd"),
    prop.incomeRequirement || (isKoop ? "Solvabiliteit / Eigen middelen" : "Conform aanbieder"),
    prop.surface || 0,
    prop.rooms || 0,
    prop.bedrooms || 0,
    prop.energyLabel || "A+",
    prop.buildYear || 2021,
    prop.brokerName || "Aanbieder via " + platform,
    prop.sourceUrl || "",
    prop.statusLabel || "Direct Beschikbaar"
  ];
}

/**
 * Exporteert een lijst van woningen naar een kant-en-klaar CSV-bestand met UTF-8 BOM
 * (Direct te openen in Excel en Google Sheets via Bestand > Importeren)
 */
export function propertiesToCsv(propertiesList = []) {
  const delimiter = ",";
  const escapeCell = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headerLine = GOOGLE_SHEETS_COLUMNS.map(escapeCell).join(delimiter);
  const rows = propertiesList.map((p) => propertyToSheetRow(p).map(escapeCell).join(delimiter));

  // UTF-8 BOM voor probleemloze opening in Excel / Google Drive
  return "\uFEFF" + [headerLine, ...rows].join("\r\n");
}

/**
 * Schrijft woningen weg naar een Google Sheet via de `gsheets` CLI
 * @param {string} spreadsheetId - Het ID van de Google Sheet
 * @param {Array} propertiesList - Lijst van WoningVry woning-objecten
 * @param {string} sheetName - Optionele tabbladnaam (standaard "Sheet1")
 */
export async function appendToGoogleSheetCli(spreadsheetId, propertiesList = [], sheetName = "Sheet1") {
  if (!spreadsheetId) {
    throw new Error("Geen spreadsheetId opgegeven. Maak een Google Sheet aan of geef het ID op.");
  }
  if (!Array.isArray(propertiesList) || propertiesList.length === 0) {
    return { success: true, count: 0, message: "Geen woningen om toe te voegen." };
  }

  const rows = [GOOGLE_SHEETS_COLUMNS, ...propertiesList.map(propertyToSheetRow)];
  const formatted = rows
    .map((r) => r.map((c) => String(c ?? "").replace(/,/g, "\\,").replace(/\|/g, "/")).join(","))
    .join("|");

  const range = `${sheetName}!A1:X${rows.length}`;
  const command = `gsheets mutate write "${spreadsheetId}" "${range}" ${JSON.stringify(formatted)}`;

  try {
    const { stdout, stderr } = await execAsync(command);
    return {
      success: true,
      count: propertiesList.length,
      stdout,
      stderr
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || String(err)
    };
  }
}

/**
 * Haalt een overzicht op van spreadsheets in Google Drive via de actieve sessie
 * @param {string} [query] - Optionele zoekterm
 */
export async function listDriveSheetsCli(query = "") {
  const cmd = query ? `gsheets readonly list "${query}"` : `gsheets readonly list`;
  const { stdout, stderr } = await execAsync(cmd);
  return { stdout, stderr };
}

/**
 * Leest gegevens uit een Google Sheet
 * @param {string} spreadsheetId 
 * @param {string} range (bijv. "Sheet1!A1:Z50")
 */
export async function readSheetCli(spreadsheetId, range = "Sheet1!A1:Z50") {
  const cmd = `gsheets readonly read "${spreadsheetId}" "${range}"`;
  const { stdout, stderr } = await execAsync(cmd);
  return { stdout, stderr };
}

/**
 * Exporteert een Google Sheet direct naar CSV, Excel (xlsx), PDF of PNG
 * @param {string} spreadsheetId 
 * @param {string} outputFile 
 * @param {string} format ('csv' | 'xlsx' | 'pdf' | 'png')
 */
export async function exportSheetCli(spreadsheetId, outputFile, format = "csv") {
  const cmd = `gsheets readonly export "${spreadsheetId}" "${outputFile}" --format "${format}"`;
  const { stdout, stderr } = await execAsync(cmd);
  return { stdout, stderr, outputFile };
}

/**
 * Stuurt gescrapete woningen naar een Google Apps Script Web App Webhook (voor browser & serverloze sync)
 * De Google Apps Script hoeft slechts 10 regels code te bevatten:
 * function doPost(e) {
 *   var data = JSON.parse(e.postData.contents);
 *   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Woningen") || SpreadsheetApp.getActiveSheet();
 *   data.rows.forEach(function(r) { sheet.appendRow(r); });
 *   return ContentService.createTextOutput("OK");
 * }
 */
export async function sendToGoogleSheetWebhook(webhookUrl, propertiesList = []) {
  if (!webhookUrl || !/^https:\/\/script\.google\.com\//i.test(webhookUrl)) {
    throw new Error("Voer een geldige Google Apps Script Web App URL in.");
  }

  const rows = propertiesList.map(propertyToSheetRow);
  const payload = {
    action: "append_listings",
    timestamp: new Date().toISOString(),
    columns: GOOGLE_SHEETS_COLUMNS,
    rows
  };

  const resp = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return {
    ok: resp.ok,
    status: resp.status,
    count: rows.length
  };
}
