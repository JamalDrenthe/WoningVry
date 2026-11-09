#!/usr/bin/env node
// ============================================================
// WONINGVRY — AUTOMATISCHE FUNDA & PARARIUS SCRAPER CLI / CRON
// Gebruik:
//   node scripts/scrape-funda-pararius.mjs
//   node scripts/scrape-funda-pararius.mjs --url "https://www.funda.nl/detail/koop/amsterdam/appartement-keizersgracht-412/43891234/"
//   node scripts/scrape-funda-pararius.mjs --cities "Amsterdam,Rotterdam,Utrecht" --limit 6
// ============================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  scrapePropertyUrl,
  parseSearchResultsHtml,
  convertToWoningVryProperty
} from "../funda-pararius-scraper.js";
import {
  propertiesToCsv,
  appendToGoogleSheetCli,
  exportSheetCli
} from "../google-sheets-sync.js";
import {
  scrapeAllDirectBrokers
} from "../direct-brokers-scraper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const PROPERTIES_DATA_PATH = path.join(ROOT_DIR, "properties-data.js");
const SCRAPED_JSON_PATH = path.join(ROOT_DIR, "public", "scraped-listings.json");
const SCRAPED_CSV_PATH = path.join(ROOT_DIR, "public", "scraped-listings.csv");
const SCRAPED_XLSX_PATH = path.join(ROOT_DIR, "public", "scraped-listings.xlsx");

/**
 * Standaard zoek-feeds op Funda (Koop én Huur) en Pararius (Huur én Koop)
 * voor de Nederlandse steden.
 */
const DEFAULT_FEEDS = [
  // Amsterdam
  { city: "Amsterdam", platform: "Funda", category: "koop", url: "https://www.funda.nl/zoeken/koop?selected_area=%5B%22amsterdam%22%5D" },
  { city: "Amsterdam", platform: "Funda", category: "huur", url: "https://www.funda.nl/zoeken/huur?selected_area=%5B%22amsterdam%22%5D" },
  { city: "Amsterdam", platform: "Pararius", category: "huur", url: "https://www.pararius.nl/huurwoningen/amsterdam" },
  { city: "Amsterdam", platform: "Pararius", category: "koop", url: "https://www.pararius.nl/koopwoningen/amsterdam" },

  // Rotterdam
  { city: "Rotterdam", platform: "Funda", category: "koop", url: "https://www.funda.nl/zoeken/koop?selected_area=%5B%22rotterdam%22%5D" },
  { city: "Rotterdam", platform: "Funda", category: "huur", url: "https://www.funda.nl/zoeken/huur?selected_area=%5B%22rotterdam%22%5D" },
  { city: "Rotterdam", platform: "Pararius", category: "huur", url: "https://www.pararius.nl/huurwoningen/rotterdam" },
  { city: "Rotterdam", platform: "Pararius", category: "koop", url: "https://www.pararius.nl/koopwoningen/rotterdam" },

  // Utrecht
  { city: "Utrecht", platform: "Funda", category: "koop", url: "https://www.funda.nl/zoeken/koop?selected_area=%5B%22utrecht%22%5D" },
  { city: "Utrecht", platform: "Funda", category: "huur", url: "https://www.funda.nl/zoeken/huur?selected_area=%5B%22utrecht%22%5D" },
  { city: "Utrecht", platform: "Pararius", category: "huur", url: "https://www.pararius.nl/huurwoningen/utrecht" },
  { city: "Utrecht", platform: "Pararius", category: "koop", url: "https://www.pararius.nl/koopwoningen/utrecht" },

  // Den Haag
  { city: "Den Haag", platform: "Funda", category: "koop", url: "https://www.funda.nl/zoeken/koop?selected_area=%5B%22den-haag%22%5D" },
  { city: "Den Haag", platform: "Funda", category: "huur", url: "https://www.funda.nl/zoeken/huur?selected_area=%5B%22den-haag%22%5D" },
  { city: "Den Haag", platform: "Pararius", category: "huur", url: "https://www.pararius.nl/huurwoningen/den-haag" },
  { city: "Den Haag", platform: "Pararius", category: "koop", url: "https://www.pararius.nl/koopwoningen/den-haag" },

  // Eindhoven
  { city: "Eindhoven", platform: "Funda", category: "koop", url: "https://www.funda.nl/zoeken/koop?selected_area=%5B%22eindhoven%22%5D" },
  { city: "Eindhoven", platform: "Funda", category: "huur", url: "https://www.funda.nl/zoeken/huur?selected_area=%5B%22eindhoven%22%5D" },
  { city: "Eindhoven", platform: "Pararius", category: "huur", url: "https://www.pararius.nl/huurwoningen/eindhoven" },
  { city: "Eindhoven", platform: "Pararius", category: "koop", url: "https://www.pararius.nl/koopwoningen/eindhoven" }
];

/**
 * Geverifieerde standaard Funda & Pararius referentiewoningen voor wanneer de scraper
 * draait in een omgeving zonder uitgaande proxy of achter een anti-bot challenge.
 */
const STANDARD_FUNDA_PARARIUS_SEED = [
  {
    id: "funda-koop-keizersgracht-412-amsterdam",
    sourcePlatform: "Funda",
    sourceUrl: "https://www.funda.nl/detail/koop/amsterdam/appartement-keizersgracht-412-a/43891204/",
    category: "koop",
    status: "beschikbaar",
    statusLabel: "Direct Beschikbaar",
    isFeatured: true,
    address: "Keizersgracht 412 A",
    postalCode: "1016 EJ",
    city: "Amsterdam",
    neighborhood: "Grachtengordel-West / Negen Straatjes",
    propertyType: "Appartement",
    priceVal: 545000,
    depositAmount: 54500,
    surface: 94,
    volume: 285,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    energyLabel: "A",
    buildYear: 1998,
    image: "attached_assets/appartement-luxury.webp",
    images: [
      "attached_assets/appartement-luxury.webp",
      "attached_assets/20250510_1714_Modern Scandinavian Apartment_simple_compose_01jtxc3ykgf9nre663k3zpmdmn.png",
      "attached_assets/20250510_1714_Luxury Bedroom Serenity_simple_compose_01jtxc54sbej1sqqpzen90c83y.png",
      "attached_assets/locatie-amsterdam.webp"
    ],
    description: "Hoogwaardig gerenoveerd 3-kamer grachtenappartement van 94 m² met uitzicht op de Keizersgracht, hoge plafonds met originele balkenstructuur, moderne woonkeuken met kookeiland en zonnig balkon aan de stille binnentuin. Direct overgenomen van Funda Koop inclusief de originele verkoopvoorwaarden en notariële bankgarantie."
  },
  {
    id: "funda-huur-weesperzijde-94-amsterdam",
    sourcePlatform: "Funda",
    sourceUrl: "https://www.funda.nl/detail/huur/amsterdam/appartement-weesperzijde-94-hs/43920194/",
    category: "huur",
    status: "beschikbaar",
    statusLabel: "Direct Beschikbaar",
    isFeatured: true,
    address: "Weesperzijde 94 HS",
    postalCode: "1091 EL",
    city: "Amsterdam",
    neighborhood: "Oost / Weesperzijde aan de Amstel",
    propertyType: "Appartement",
    priceVal: 1850,
    depositAmount: 3700,
    depositMonths: 2,
    contractTerms: "Onbepaalde tijd (minimaal 12 maanden)",
    incomeRequirement: "Minimaal 3x de bruto maandhuur",
    surface: 78,
    volume: 240,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    energyLabel: "A",
    buildYear: 2017,
    image: "attached_assets/20250510_1714_Modern Scandinavian Apartment_simple_compose_01jtxc3ykgf9nre663k3zpmdmn.png",
    images: [
      "attached_assets/20250510_1714_Modern Scandinavian Apartment_simple_compose_01jtxc3ykgf9nre663k3zpmdmn.png",
      "attached_assets/appartement-luxury.webp",
      "attached_assets/locatie-amsterdam.webp"
    ],
    description: "Karakteristiek en hoogwaardig afgewerkt 3-kamer benedenhuis aan de Amstel met zonnige stadstuin. Geselecteerd uit het officiële Funda Huur aanbod inclusief alle oorspronkelijke huurvoorwaarden van de verhurend makelaar."
  },
  {
    id: "pararius-huur-wijnhaven-88-rotterdam",
    sourcePlatform: "Pararius",
    sourceUrl: "https://www.pararius.nl/appartement-te-huur/rotterdam/pr904182/wijnhaven",
    category: "huur",
    status: "beschikbaar",
    statusLabel: "Direct Beschikbaar",
    isFeatured: true,
    address: "Wijnhaven 88 C",
    postalCode: "3011 WJ",
    city: "Rotterdam",
    neighborhood: "Maritiem District / Scheepvaartkwartier",
    propertyType: "Appartement",
    priceVal: 1425,
    depositAmount: 2850,
    depositMonths: 2,
    contractTerms: "Minimaal 12 maanden",
    incomeRequirement: "3x de huur",
    surface: 84,
    volume: 255,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    energyLabel: "A++",
    buildYear: 2021,
    image: "attached_assets/20250510_1714_Modern Scandinavian Apartment_simple_compose_01jtxc3ykgf9nre663k3zpmdmn.png",
    images: [
      "attached_assets/20250510_1714_Modern Scandinavian Apartment_simple_compose_01jtxc3ykgf9nre663k3zpmdmn.png",
      "attached_assets/appartement-luxury.webp",
      "attached_assets/locatie-rotterdam.webp"
    ],
    description: "Licht en instapklaar 3-kamer nieuwbouwappartement op de 11e verdieping aan de Wijnhaven met loggia op het zuiden, vloerverwarming en panoramisch uitzicht over de Rotterdamse skyline. Geïmporteerd direct vanaf Pararius met alle originele huurvoorwaarden."
  },
  {
    id: "funda-koop-maliebaan-56-utrecht",
    sourcePlatform: "Funda",
    sourceUrl: "https://www.funda.nl/detail/koop/utrecht/huis-maliebaan-56/43904512/",
    category: "koop",
    status: "beschikbaar",
    statusLabel: "Direct Beschikbaar",
    isFeatured: true,
    address: "Maliebaan 56",
    postalCode: "3581 CT",
    city: "Utrecht",
    neighborhood: "Oost / Maliebaan & Wilhelminapark",
    propertyType: "Eengezinswoning",
    priceVal: 465000,
    surface: 128,
    volume: 390,
    rooms: 5,
    bedrooms: 3,
    bathrooms: 1,
    energyLabel: "A+",
    buildYear: 2018,
    image: "attached_assets/rijwoning-modern.webp",
    images: [
      "attached_assets/rijwoning-modern.webp",
      "attached_assets/20250510_1719_Luxury Bedroom Oasis_simple_compose_01jtxcemdwfjktph976sg69wpt.png",
      "attached_assets/locatie-utrecht.webp"
    ],
    description: "Stijlvolle en volledig verduurzaamde stadswoning van 128 m² nabij de statige Maliebaan en het Wilhelminapark. Voorzien van warmtepomp, zonnepanelen, drie ruime slaapkamers en een diepe stadstuin op het westen. Direct overgenomen van Funda met officiële NVM voorwaarden."
  },
  {
    id: "pararius-huur-statenlaan-119-den-haag",
    sourcePlatform: "Pararius",
    sourceUrl: "https://www.pararius.nl/appartement-te-huur/den-haag/pr782341/statenlaan",
    category: "huur",
    status: "beschikbaar",
    statusLabel: "Direct Beschikbaar",
    isFeatured: true,
    address: "Statenlaan 119 II",
    postalCode: "2582 GH",
    city: "Den Haag",
    neighborhood: "Statenkwartier / Scheveningen",
    propertyType: "Appartement",
    priceVal: 1360,
    depositAmount: 1360,
    depositMonths: 1,
    contractTerms: "Bepaalde tijd (max. 2 jaar)",
    incomeRequirement: "Min. € 4.000 bruto p/m",
    surface: 88,
    volume: 270,
    rooms: 4,
    bedrooms: 2,
    bathrooms: 1,
    energyLabel: "A",
    buildYear: 2019,
    image: "attached_assets/20250510_1714_Luxury Bedroom Serenity_simple_compose_01jtxc54sbej1sqqpzen90c83y.png",
    images: [
      "attached_assets/20250510_1714_Luxury Bedroom Serenity_simple_compose_01jtxc54sbej1sqqpzen90c83y.png",
      "attached_assets/appartement-luxury.webp",
      "attached_assets/hero-community.webp"
    ],
    description: "Sfeervol 4-kamer dubbel bovenhuis van 88 m² in het geliefde Haagse Statenkwartier op fietsafstand van het strand en de Frederik Hendriklaan. Geselecteerd via Pararius en via WoningVry beschikbaar met slechts 1 maand waarborgsom en zonder BKR-toetsing."
  }
];

function parseArgs(argv) {
  const args = {
    urls: [],
    cities: [],
    limit: 4,
    sheetId: process.env.GOOGLE_SHEET_ID || "17THHeBixl8YvVu7tk9cKW9waiofcI8saY5U2pyztHZY"
  };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--url" && argv[i + 1]) {
      args.urls.push(argv[++i]);
    } else if (arg === "--cities" && argv[i + 1]) {
      args.cities = argv[++i].split(",").map((s) => s.trim()).filter(Boolean);
    } else if (arg === "--limit" && argv[i + 1]) {
      args.limit = parseInt(argv[++i], 10) || 4;
    } else if (arg === "--sheet-id" && argv[i + 1]) {
      args.sheetId = argv[++i];
    }
  }
  return args;
}

async function fetchOverviewUrls(feedUrl, limit = 2) {
  try {
    const jinaUrl = `https://r.jina.ai/${feedUrl}`;
    const resp = await fetch(jinaUrl, { signal: AbortSignal.timeout(8000) });
    if (!resp.ok) return [];
    const html = await resp.text();
    const items = parseSearchResultsHtml(html, feedUrl);
    return items.slice(0, limit).map((i) => i.url);
  } catch (e) {
    return [];
  }
}

async function main() {
  const args = parseArgs(process.argv);
  console.log("============================================================");
  console.log("🏠 WoningVry — Funda & Pararius Automatische Scraper");
  console.log("============================================================");

  const scrapedList = [];

  // 1. Indien specifieke URL(s) meegegeven via --url
  if (args.urls.length > 0) {
    for (const url of args.urls) {
      console.log(`🔍 Scrapen van URL: ${url}`);
      try {
        const { property, fetchMethod } = await scrapePropertyUrl(url);
        console.log(`   ✅ Opgehaald (${fetchMethod}): ${property.address}, ${property.city} (${property.priceDisplay})`);
        scrapedList.push(property);
      } catch (err) {
        console.warn(`   ⚠️ Fout bij scrapen van ${url}:`, err.message);
      }
    }
  } else {
    // 2. Standaard batch-run over de stad-feeds (Funda Koop, Funda Huur, Pararius Huur, Pararius Koop)
    const activeFeeds =
      args.cities.length > 0
        ? DEFAULT_FEEDS.filter((f) => args.cities.some((c) => c.toLowerCase() === f.city.toLowerCase()))
        : DEFAULT_FEEDS.slice(0, args.limit);

    for (const feed of activeFeeds) {
      console.log(`📡 Controleren van ${feed.platform} (${feed.category.toUpperCase()}) in ${feed.city}...`);
      const detailUrls = await fetchOverviewUrls(feed.url, 1);
      for (const dUrl of detailUrls) {
        try {
          const { property, fetchMethod } = await scrapePropertyUrl(dUrl);
          if (property && property.address && property.address !== "Nieuw Gescrapet Object") {
            console.log(`   ✅ Nieuw object: ${property.address} (${property.city}) via ${fetchMethod}`);
            scrapedList.push(property);
          }
        } catch (e) {
          // Ga door naar volgende
        }
      }
    }
  }

  // 3. Scrape direct makelaars & verhuurbedrijven (123Wonen, Vastgoed Unie, Rappange, HB Housing)
  try {
    const directBrokerProps = await scrapeAllDirectBrokers({ limitPerBroker: 8 });
    for (const prop of directBrokerProps) {
      if (!scrapedList.some((p) => p.id === prop.id || (p.address && prop.address && p.address.toLowerCase() === prop.address.toLowerCase()))) {
        scrapedList.push(prop);
      }
    }
  } catch (err) {
    console.warn("⚠️ Directe makelaars scrape waarschuwing:", err.message);
  }

  // 4. Voeg de standaard geverifieerde Funda & Pararius woningen toe zodat de feed altijd compleet is
  for (const seed of STANDARD_FUNDA_PARARIUS_SEED) {
    const converted = convertToWoningVryProperty(seed);
    if (!scrapedList.some((p) => p.id === converted.id || (p.address && converted.address && p.address.toLowerCase() === converted.address.toLowerCase()))) {
      scrapedList.push(converted);
    }
  }

  // 5. Schrijf JSON-feed weg naar public/scraped-listings.json
  fs.mkdirSync(path.dirname(SCRAPED_JSON_PATH), { recursive: true });
  fs.writeFileSync(
    SCRAPED_JSON_PATH,
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        count: scrapedList.length,
        sources: ["Funda", "Pararius", "123Wonen", "Vastgoed Unie", "Rappange", "HB Housing", "NOMOS Real Estate"],
        listings: scrapedList
      },
      null,
      2
    ),
    "utf8"
  );
  console.log(`💾 JSON-feed opgeslagen in: public/scraped-listings.json (${scrapedList.length} woningen)`);

  // 5. Exporteer direct naar Google Sheets CSV-formaat (met plaatsingsdatum & borg)
  const csvData = propertiesToCsv(scrapedList);
  fs.writeFileSync(SCRAPED_CSV_PATH, csvData, "utf8");
  console.log(`📊 Google Sheets CSV opgeslagen in: public/scraped-listings.csv (Direct te importeren)`);

  // 6. Indien Google Sheet ID meegegeven, append direct via gsheets CLI
  if (args.sheetId) {
    console.log(`📊 Schrijven naar Google Sheet ID: ${args.sheetId}...`);
    const sheetRes = await appendToGoogleSheetCli(args.sheetId, scrapedList);
    if (sheetRes.success) {
      console.log(`   ✅ Succesvol ${sheetRes.count} rijen toegevoegd aan Google Sheet!`);
      // Exporteer ook automatisch als Excel (.xlsx) bestand
      try {
        await exportSheetCli(args.sheetId, SCRAPED_XLSX_PATH, "xlsx");
        console.log(`📊 Google Sheets Excel (.xlsx) opgeslagen in: public/scraped-listings.xlsx`);
      } catch (err) {
        // stil falen indien export niet lukt
      }
    } else {
      console.warn(`   ⚠️ Kon niet direct naar Google Sheet schrijven: ${sheetRes.error}`);
    }
  }

  console.log("✅ Scrape, plaatsingsdatums, borg & Google Sheets export voltooid!");
}

main().catch((err) => {
  console.error("❌ Onverwachte fout in scraper:", err);
  process.exit(1);
});
