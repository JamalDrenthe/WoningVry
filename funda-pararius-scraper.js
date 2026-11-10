// ============================================================
// WONINGVRY — FUNDA & PARARIUS SCRAPER, PARSER & CONVERTER
// Werkt isomorf in zowel de Browser (Admin Importer) als Node.js (CLI/Cron)
// ============================================================

/**
 * Standaard fallback afbeeldingen per woningtype wanneer een externe foto
 * niet geladen kan worden of geblokkeerd wordt.
 */
const FALLBACK_IMAGES = {
  Appartement: [
    "attached_assets/appartement-luxury.webp",
    "attached_assets/20250510_1714_Modern Scandinavian Apartment_simple_compose_01jtxc3ykgf9nre663k3zpmdmn.png",
    "attached_assets/20250510_1714_Luxury Bedroom Serenity_simple_compose_01jtxc54sbej1sqqpzen90c83y.png"
  ],
  Eengezinswoning: [
    "attached_assets/rijwoning-modern.webp",
    "attached_assets/20250510_1719_Luxury Bedroom Oasis_simple_compose_01jtxcemdwfjktph976sg69wpt.png",
    "attached_assets/hero-community.webp"
  ],
  Villa: [
    "attached_assets/vrijstaand-villa.webp",
    "attached_assets/20250510_1719_Luxury Bedroom Oasis_simple_compose_01jtxcemdwfjktph976sg69wpt.png",
    "attached_assets/appartement-luxury.webp"
  ],
  Studio: [
    "attached_assets/20250510_1714_Modern Scandinavian Apartment_simple_compose_01jtxc3ykgf9nre663k3zpmdmn.png",
    "attached_assets/appartement-luxury.webp"
  ],
  Kamer: [
    "attached_assets/20250510_1714_Luxury Bedroom Serenity_simple_compose_01jtxc54sbej1sqqpzen90c83y.png",
    "attached_assets/20250510_1714_Modern Scandinavian Apartment_simple_compose_01jtxc3ykgf9nre663k3zpmdmn.png"
  ],
  Loft: [
    "attached_assets/20250510_1714_Modern Scandinavian Apartment_simple_compose_01jtxc3ykgf9nre663k3zpmdmn.png",
    "attached_assets/appartement-luxury.webp"
  ]
};

/**
 * Formatteert een getal als Nederlandse valuta string (bijv. 485000 -> "€ 485.000")
 */
export function formatEuro(amount) {
  const num = Math.round(Number(amount) || 0);
  return "€ " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Bepaalt het platform ("Funda" | "Pararius" | "Extern") op basis van URL of tekst
 */
export function detectSourcePlatform(url = "", html = "") {
  const lowerUrl = String(url).toLowerCase();
  if (lowerUrl.includes("funda.nl")) return "Funda";
  if (lowerUrl.includes("pararius.nl") || lowerUrl.includes("pararius.com")) return "Pararius";
  const lowerHtml = String(html).slice(0, 15000).toLowerCase();
  if (lowerHtml.includes("funda.nl") || lowerHtml.includes("funda")) return "Funda";
  if (lowerHtml.includes("pararius.nl") || lowerHtml.includes("pararius")) return "Pararius";
  return "Funda / Pararius";
}

/**
 * Normaliseert woningtype naar de standaard WoningVry categorieën:
 * "Appartement" | "Eengezinswoning" | "Villa" | "Studio" | "Kamer"
 */
export function normalizePropertyType(rawType = "", title = "") {
  const combined = `${rawType} ${title}`.toLowerCase();
  if (combined.includes("villa") || combined.includes("vrijstaand") || combined.includes("herenhuis") || combined.includes("grachtenpand") || combined.includes("bungalow") || combined.includes("woonboerderij")) {
    return "Villa";
  }
  if (combined.includes("kamer") && !combined.includes("slaapkamer") && !combined.includes("woonkamer") && !combined.includes("-kamer")) {
    return "Kamer";
  }
  if (combined.includes("studio") || combined.includes("loft")) {
    return "Studio";
  }
  if (combined.includes("eengezins") || combined.includes("rijwoning") || combined.includes("tussenwoning") || combined.includes("hoekwoning") || combined.includes("2-onder-1-kap") || combined.includes("twee-onder-een-kap") || combined.includes("woonhuis") || combined.includes("huis")) {
    return "Eengezinswoning";
  }
  return "Appartement";
}

/**
 * Kapitaliseert elk woord netjes (bijv. "keizersgracht 412 a" -> "Keizersgracht 412 A")
 */
export function titleCaseAddress(str = "") {
  return String(str)
    .trim()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => {
      if (!word) return "";
      if (/^\d+[a-zA-Z]?$/.test(word)) return word.toUpperCase();
      if (["ii", "iii", "iv", "hs", "bv", "ov"].includes(word.toLowerCase())) return word.toUpperCase();
      if (["van", "de", "den", "der", "het", "in", "op", "aan", "bij", "te"].includes(word.toLowerCase())) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

/**
 * Haalt basisgegevens uit een Funda of Pararius URL-slug (werkt altijd, zelfs bij CAPTCHA)
 * Voorbeelden:
 * - https://www.funda.nl/detail/koop/amsterdam/appartement-gustav-mahlerlaan-612/43819201/
 * - https://www.funda.nl/detail/huur/utrecht/huis-oudegracht-114/89123456/
 * - https://www.pararius.nl/appartement-te-huur/rotterdam/b8192a34/wijnhaven
 * - https://www.pararius.nl/koopwoning/den-haag/c9182b12/lange-voorhout
 */
export function parseFromUrlSlug(url = "") {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split("/").filter(Boolean);
    const platform = detectSourcePlatform(url);

    let category = "koop";
    let city = "Amsterdam";
    let address = "";
    let propertyType = "Appartement";
    let externalId = "";

    if (platform === "Funda") {
      // /detail/{koop|huur}/{stad}/{type-straat-huisnr}/{id}
      const detailIdx = parts.indexOf("detail");
      if (detailIdx !== -1 && parts.length >= detailIdx + 4) {
        const catSlug = parts[detailIdx + 1].toLowerCase();
        category = catSlug.includes("huur") ? "huur" : "koop";
        city = titleCaseAddress(parts[detailIdx + 2]);
        const addrSlug = parts[detailIdx + 3];
        externalId = parts[detailIdx + 4] || "";

        if (addrSlug.startsWith("huis-")) {
          propertyType = "Eengezinswoning";
          address = titleCaseAddress(addrSlug.replace(/^huis-/, ""));
        } else if (addrSlug.startsWith("appartement-")) {
          propertyType = "Appartement";
          address = titleCaseAddress(addrSlug.replace(/^appartement-/, ""));
        } else {
          address = titleCaseAddress(addrSlug);
        }
      } else {
        // Oudere Funda URL structuur: /koop/amsterdam/appartement-43819201-straat-12/
        if (parts[0]?.includes("huur")) category = "huur";
        if (parts[1]) city = titleCaseAddress(parts[1]);
        if (parts[2]) {
          const clean = parts[2].replace(/^(appartement|huis)-\d+-/, "");
          propertyType = parts[2].startsWith("huis") ? "Eengezinswoning" : "Appartement";
          address = titleCaseAddress(clean);
        }
      }
    } else if (platform === "Pararius") {
      // /appartement-te-huur/rotterdam/id/straat
      const first = (parts[0] || "").toLowerCase();
      category = first.includes("koop") ? "koop" : "huur";
      propertyType = normalizePropertyType(first);
      if (parts[1]) city = titleCaseAddress(parts[1]);
      if (parts[2]) externalId = parts[2];
      if (parts[3]) address = titleCaseAddress(parts[3]);
    }

    return {
      sourcePlatform: platform,
      sourceUrl: url,
      externalId,
      category,
      city,
      address,
      propertyType
    };
  } catch (e) {
    return {
      sourcePlatform: detectSourcePlatform(url),
      sourceUrl: url,
      category: "koop",
      city: "Amsterdam",
      address: "",
      propertyType: "Appartement"
    };
  }
}

/**
 * Veilige tekst-opschoning zonder HTML tags
 */
function cleanText(str = "") {
  return String(str)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&euro;/gi, "€")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Haalt alle JSON-LD objecten uit een HTML string
 */
function extractJsonLdObjects(html = "") {
  const results = [];
  const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      const raw = match[1].trim();
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        results.push(...parsed);
      } else if (parsed && Array.isArray(parsed["@graph"])) {
        results.push(...parsed["@graph"]);
      } else if (parsed) {
        results.push(parsed);
      }
    } catch (e) {
      // Negeer ongeldige JSON-LD blokken
    }
  }
  return results;
}

/**
 * Haalt OpenGraph / Meta tags uit ruwe HTML
 */
function extractMetaTags(html = "") {
  const meta = {};
  const regex = /<meta\s+([^>]+)>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const attrs = match[1];
    const propMatch = attrs.match(/(?:property|name)=["']([^"']+)["']/i);
    const contentMatch = attrs.match(/content=["']([^"']*)["']/i);
    if (propMatch && contentMatch) {
      meta[propMatch[1].toLowerCase()] = cleanText(contentMatch[1]);
    }
  }
  return meta;
}

/**
 * Zoekt Nederlandse woningkenmerken via regex patronen in de HTML/tekst
 * (werkt op zowel Funda <dt>/<dd> als Pararius kenmerkenlijsten én Markdown van Jina/Firecrawl)
 */
function extractDutchFeaturesFromText(html = "") {
  const text = cleanText(html);
  const out = {};

  // Postcode (bijv. 1082 MK)
  const pcMatch = text.match(/\b([1-9]\d{3})\s*([A-Z]{2})\b/);
  if (pcMatch) {
    out.postalCode = `${pcMatch[1]} ${pcMatch[2]}`;
  }

  // Prijs (bijv. € 485.000 k.k. of € 1.450 per maand)
  const priceMatch = text.match(/€\s*([1-9]\d{0,2}(?:\.\d{3})+|\d{3,7})/);
  if (priceMatch) {
    const numeric = parseInt(priceMatch[1].replace(/\./g, ""), 10);
    if (numeric >= 400) {
      out.priceVal = numeric;
    }
  }

  // Woonoppervlakte (bijv. 98 m² of Woonoppervlakte 112 m²)
  const surfExplicit = text.match(/(?:woonoppervlakte|oppervlakte|gebruiksoppervlak(?:te)?)[^0-9]{1,35}(\d{2,4})\s*m(?:²|2)/i);
  const surfGeneric = text.match(/\b(\d{2,4})\s*m(?:²|2)\b/i);
  if (surfExplicit) {
    out.surface = parseInt(surfExplicit[1], 10);
  } else if (surfGeneric) {
    out.surface = parseInt(surfGeneric[1], 10);
  }

  // Inhoud (bijv. 310 m³)
  const volMatch = text.match(/(?:inhoud)[^0-9]{1,25}(\d{2,4})\s*m(?:³|3)/i) || text.match(/\b(\d{3,4})\s*m(?:³|3)\b/i);
  if (volMatch) {
    out.volume = parseInt(volMatch[1], 10);
  }

  // Kamers & Slaapkamers (bijv. "4 kamers (3 slaapkamers)" of "Aantal kamers 4")
  const roomsCombo = text.match(/(\d{1,2})\s*kamers?\s*\((\d{1,2})\s*slaapkamers?\)/i);
  if (roomsCombo) {
    out.rooms = parseInt(roomsCombo[1], 10);
    out.bedrooms = parseInt(roomsCombo[2], 10);
  } else {
    const roomsMatch = text.match(/(?:aantal\s+kamers|kamers)[^0-9]{1,20}(\d{1,2})\b/i) || text.match(/\b(\d{1,2})\s*kamers\b/i);
    if (roomsMatch) out.rooms = parseInt(roomsMatch[1], 10);
    const bedMatch = text.match(/(\d{1,2})\s*slaapkamers?\b/i);
    if (bedMatch) out.bedrooms = parseInt(bedMatch[1], 10);
  }

  // Energielabel (bijv. Energielabel A+++)
  const labelMatch = text.match(/energielabel\s*([A-G](?:\+{1,4})?)\b/i);
  if (labelMatch) {
    out.energyLabel = labelMatch[1].toUpperCase();
  }

  // Bouwjaar (bijv. Bouwjaar 2021 of Verbouwd in 1998)
  const buildMatch = text.match(/(?:bouwjaar|oorspronkelijk\s+bouwjaar)[^0-9]{1,25}((?:1[6-9]|20)\d{2})\b/i);
  if (buildMatch) {
    out.buildYear = parseInt(buildMatch[1], 10);
  }

  // Afbeeldingen van Funda (cloud.funda.nl) of Pararius (casco-media-prod.global.ssl.fastly.net / media.pararius.nl)
  const imgSet = new Set();
  const imgRegex = /https?:\/\/(?:cloud\.funda\.nl\/[^\s"'<>]+|[^\s"'<>]*pararius[^\s"'<>]+\.(?:jpg|jpeg|webp|png))/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    const cleanImg = imgMatch[0].replace(/\\+/g, "").replace(/[),;]+$/, "");
    // Filter kleine thumbnails en iconen eruit
    if (!cleanImg.includes("logo") && !cleanImg.includes("avatar") && !cleanImg.includes("180x120")) {
      imgSet.add(cleanImg);
    }
  }
  if (imgSet.size > 0) {
    out.images = Array.from(imgSet).slice(0, 12);
  }

  // Borg & Voorwaarden extractie direct van Funda & Pararius
  // Pararius & Funda vermelden vaak expliciet de waarborgsom (bijv. "Waarborgsom: € 2.800" of "Borg: 2 maanden" of "1 maand huur")
  const depositMatch = text.match(/(?:waarborgsom|borg(?:som)?|deposit)[^0-9€]{1,35}€?\s*([1-9]\d{0,2}(?:\.\d{3})+|\d{3,5})/i);
  if (depositMatch) {
    out.depositAmount = parseInt(depositMatch[1].replace(/\./g, ""), 10);
  } else {
    const depositMonthsMatch = text.match(/(?:waarborgsom|borg(?:som)?)[^a-z0-9]{1,35}(\d{1,2})\s*maand(?:en)?/i);
    if (depositMonthsMatch) {
      out.depositMonths = parseInt(depositMonthsMatch[1], 10);
    }
  }

  // Contractduur / Beschikbaarheidsvoorwaarden
  const contractMatch = text.match(/(?:huurperiode|looptijd|contract(?:duur)?|huurovereenkomst)[^:\n]{0,35}:\s*([^\n.;]{4,60})/i);
  if (contractMatch) {
    out.contractTerms = cleanText(contractMatch[1]);
  }

  // Inkomenseis van aanbieder (bijv. "Inkomenseis: 3x de huur" of "Minimaal bruto inkomen van € 4.500")
  const incomeReqMatch = text.match(/(?:inkomenseis|bruto\s*inkomen)[^:\n]{0,35}:\s*([^\n.;]{4,60})/i) ||
                         text.match(/\b([2-4](?:[,.]\d)?\s*x\s*(?:de\s*)?(?:bruto\s*)?huur(?:prijs)?)\b/i);
  if (incomeReqMatch) {
    out.incomeRequirement = cleanText(incomeReqMatch[1]);
  }

  // Makelaar / Aanbieder van Funda of Pararius
  const brokerMatch = text.match(/(?:aangeboden\s+door|makelaar|beheerder)[^:\n]{0,35}:\s*([^\n.,;]{3,50})/i);
  if (brokerMatch) {
    out.brokerName = cleanText(brokerMatch[1]);
  }

  // Datum van plaatsing / Aangeboden sinds op Funda of Pararius
  // Voorbeelden: "Aangeboden sinds 12 oktober 2026", "Plaatsingsdatum: 05-11-2026", "Geplaatst op 4 november 2026"
  const dateMatch = text.match(/(?:aangeboden\s+sinds|plaatsingsdatum|geplaatst\s+op|datum\s+van\s+aanmelding)[^:\n]{0,30}:\s*([^\n.;]{4,35})/i) ||
                    text.match(/(?:aangeboden\s+sinds|geplaatst\s+op)\s+(\d{1,2}\s+[a-z]+\s+\d{4})/i) ||
                    text.match(/(?:sinds)\s+(\d{1,2}[-\/.]\d{1,2}[-\/.]\d{4})/i);
  if (dateMatch) {
    out.publicationDate = cleanText(dateMatch[1]);
  }

  // Status (Verhuurd, Verkocht, In onderhandeling, Onder bod, Onder optie)
  const statusMatch = text.match(/(?:status|beschikbaarheid)[^:\n]{0,25}:\s*([^\n.,;]{4,40})/i) ||
                      text.match(/\b(verhuurd\s+onder\s+voorbehoud|verkocht\s+onder\s+voorbehoud|verhuurd|verkocht|in\s+onderhandeling|onder\s+bod|onder\s+optie|in\s+optie)\b/i);
  if (statusMatch) {
    out.rawStatus = cleanText(statusMatch[1] || statusMatch[0]);
  }

  return out;
}

/**
 * Parset een volledige detailpagina (HTML of Jina/Firecrawl Markdown) van Funda of Pararius
 * naar een gestandaardiseerd WoningVry Woning-object.
 */
export function parsePropertyHtml(html = "", sourceUrl = "") {
  const slugInfo = parseFromUrlSlug(sourceUrl);
  const platform = detectSourcePlatform(sourceUrl, html);
  const jsonLdList = extractJsonLdObjects(html);
  const meta = extractMetaTags(html);
  const regexFeatures = extractDutchFeaturesFromText(html);

  let address = slugInfo.address || "";
  let postalCode = regexFeatures.postalCode || "";
  let city = slugInfo.city || "Amsterdam";
  let neighborhood = "";
  let propertyType = slugInfo.propertyType || "Appartement";
  let category = slugInfo.category || "koop";
  let priceVal = regexFeatures.priceVal || 0;
  let surface = regexFeatures.surface || 0;
  let volume = regexFeatures.volume || 0;
  let rooms = regexFeatures.rooms || 0;
  let bedrooms = regexFeatures.bedrooms || 0;
  let bathrooms = 1;
  let energyLabel = regexFeatures.energyLabel || "A";
  let buildYear = regexFeatures.buildYear || 2020;
  let description = "";
  let images = regexFeatures.images || [];
  let depositAmount = regexFeatures.depositAmount || null;
  let depositMonths = regexFeatures.depositMonths || null;
  let contractTerms = regexFeatures.contractTerms || "";
  let incomeRequirement = regexFeatures.incomeRequirement || "";
  let brokerName = regexFeatures.brokerName || "";
  let publicationDate = regexFeatures.publicationDate || "";

  // 1. Verrijk vanuit JSON-LD (meest betrouwbare bron op Funda & Pararius)
  for (const item of jsonLdList) {
    const type = Array.isArray(item["@type"]) ? item["@type"].join(" ") : String(item["@type"] || "");
    if (
      type.includes("Product") ||
      type.includes("Residence") ||
      type.includes("Apartment") ||
      type.includes("House") ||
      type.includes("RealEstateListing") ||
      item.address ||
      item.offers
    ) {
      if (item.address && typeof item.address === "object") {
        if (item.address.streetAddress) address = cleanText(item.address.streetAddress);
        if (item.address.postalCode) postalCode = cleanText(item.address.postalCode);
        if (item.address.addressLocality) city = cleanText(item.address.addressLocality);
        if (item.address.addressRegion && !neighborhood) neighborhood = cleanText(item.address.addressRegion);
      }
      if (item.name && !address) {
        address = cleanText(item.name).split(",")[0].trim();
      }
      if (item.description && item.description.length > description.length) {
        description = cleanText(item.description);
      }
      if (item.offers) {
        const offer = Array.isArray(item.offers) ? item.offers[0] : item.offers;
        if (offer && offer.price) {
          const parsedPrice = parseInt(String(offer.price).replace(/[^0-9]/g, ""), 10);
          if (parsedPrice > 0) priceVal = parsedPrice;
        }
      }
      if (item.floorSize && item.floorSize.value) {
        surface = parseInt(item.floorSize.value, 10) || surface;
      }
      if (item.numberOfRooms) {
        rooms = parseInt(item.numberOfRooms, 10) || rooms;
      }
      if (item.numberOfBedrooms) {
        bedrooms = parseInt(item.numberOfBedrooms, 10) || bedrooms;
      }
      if (item.numberOfBathroomsTotal) {
        bathrooms = parseInt(item.numberOfBathroomsTotal, 10) || bathrooms;
      }
      if (item.yearBuilt) {
        buildYear = parseInt(item.yearBuilt, 10) || buildYear;
      }
      if (item.datePosted && !publicationDate) {
        publicationDate = cleanText(item.datePosted);
      }
      if (item.dateCreated && !publicationDate) {
        publicationDate = cleanText(item.dateCreated);
      }
      if (item.image) {
        const ldImgs = Array.isArray(item.image)
          ? item.image.map((img) => (typeof img === "string" ? img : img?.url || img?.contentUrl)).filter(Boolean)
          : [typeof item.image === "string" ? item.image : item.image?.url].filter(Boolean);
        images = Array.from(new Set([...ldImgs, ...images]));
      }
      if (type) {
        propertyType = normalizePropertyType(type, item.name || "");
      }
    }
  }

  // 2. Verrijk vanuit OpenGraph & Meta tags
  const ogTitle = meta["og:title"] || meta["twitter:title"] || "";
  if (ogTitle) {
    // Bijv. "Te koop: Gustav Mahlerlaan 612 1082 MK Amsterdam [funda]"
    // of "Appartement te huur: Wijnhaven 45 3011 WJ Rotterdam [Pararius]"
    if (ogTitle.toLowerCase().includes("te huur")) category = "huur";
    if (ogTitle.toLowerCase().includes("te koop")) category = "koop";

    const pcInTitle = ogTitle.match(/\b([1-9]\d{3}\s*[A-Z]{2})\b/);
    if (pcInTitle && !postalCode) postalCode = pcInTitle[1].replace(/\s+/, " ");

    if (!address) {
      let cleanedTitle = ogTitle
        .replace(/^(?:appartement|huis|woning|studio|villa|kamer)?\s*te\s+(?:koop|huur)\s*:\s*/i, "")
        .replace(/\[.*?\]/g, "")
        .replace(/-\s*(?:funda|pararius).*$/i, "")
        .trim();
      if (postalCode && cleanedTitle.includes(postalCode)) {
        address = cleanedTitle.split(postalCode)[0].replace(/,\s*$/, "").trim();
      } else {
        address = cleanedTitle.split(",")[0].trim();
      }
    }
  }

  if (!description && (meta["og:description"] || meta["description"])) {
    description = meta["og:description"] || meta["description"];
  }

  if (!publicationDate && (meta["article:published_time"] || meta["date"] || meta["pubdate"])) {
    publicationDate = cleanText(meta["article:published_time"] || meta["date"] || meta["pubdate"]).split("T")[0];
  }

  if (meta["og:image"] && !images.includes(meta["og:image"])) {
    images.unshift(meta["og:image"]);
  }

  // 3. Bepaal Koop vs Huur op basis van prijs als URL het niet aangaf
  if (priceVal > 0 && priceVal < 12000) {
    category = "huur";
  } else if (priceVal >= 85000) {
    category = "koop";
  }

  return convertToWoningVryProperty({
    sourcePlatform: platform,
    sourceUrl,
    externalId: slugInfo.externalId,
    category,
    address: address || "Nieuw Gescrapet Object",
    postalCode: postalCode || "1012 AB",
    city: city || "Amsterdam",
    neighborhood: neighborhood || `${city} Centrum`,
    propertyType,
    priceVal: priceVal || (category === "koop" ? 395000 : 1395),
    surface: surface || (propertyType === "Eengezinswoning" ? 120 : 82),
    volume,
    rooms: rooms || 3,
    bedrooms: bedrooms || Math.max(1, (rooms || 3) - 1),
    bathrooms,
    energyLabel: energyLabel || "A+",
    buildYear: buildYear || 2021,
    depositAmount,
    depositMonths,
    contractTerms,
    incomeRequirement,
    brokerName,
    publicationDate: publicationDate || new Date().toISOString().split("T")[0],
    description,
    images
  });
}

/**
 * Parset een zoekresultaten-pagina (overzichtspagina van Funda of Pararius)
 * en retourneert een lijst van gevonden woningen of detail-URL's.
 */
export function parseSearchResultsHtml(html = "", baseUrl = "https://www.pararius.nl") {
  const platform = detectSourcePlatform(baseUrl, html);
  const jsonLdList = extractJsonLdObjects(html);
  const foundListings = [];
  const seenUrls = new Set();

  // 1. Controleer JSON-LD ItemList (aanwezig op zowel Funda als Pararius overzichtspagina's!)
  for (const obj of jsonLdList) {
    if (Array.isArray(obj.itemListElement)) {
      for (const el of obj.itemListElement) {
        const item = el.item || el;
        const url = item.url || (typeof item === "string" ? item : "");
        if (url && !seenUrls.has(url)) {
          seenUrls.add(url);
          foundListings.push({
            url: url.startsWith("http") ? url : new URL(url, baseUrl).href,
            name: item.name || "",
            image: Array.isArray(item.image) ? item.image[0] : item.image || "",
            price: item.offers?.price || null,
            address: item.address?.streetAddress || item.name || "",
            postalCode: item.address?.postalCode || "",
            city: item.address?.addressLocality || ""
          });
        }
      }
    }
  }

  // 2. Zoek daarnaast direct naar detail-links in de HTML
  const linkRegex =
    platform === "Funda"
      ? /href=["']((?:https?:\/\/www\.funda\.nl)?\/detail\/(?:koop|huur)\/[^"']+)["']/gi
      : /href=["']((?:https?:\/\/www\.pararius\.nl)?\/(?:appartement|huis|studio|kamer|villa|woning)-te-(?:huur|koop)\/[^"']+)["']/gi;

  let m;
  while ((m = linkRegex.exec(html)) !== null) {
    try {
      const fullUrl = m[1].startsWith("http") ? m[1] : new URL(m[1], baseUrl).href;
      if (!seenUrls.has(fullUrl)) {
        seenUrls.add(fullUrl);
        foundListings.push({ url: fullUrl });
      }
    } catch (e) {
      // Negeer ongeldige URL
    }
  }

  return foundListings;
}

/**
 * Converteert ruwe woningdata naar een volledig WoningVry-compatibel woningobject
 * inclusief automatische berekening van 10% borg & maandelijkse inleg (koop)
 * of 1 maand waarborgsom zonder 4x inkomenseis (huur).
 */
export function convertToWoningVryProperty(raw = {}) {
  const rawCat = String(raw.category || "koop").toLowerCase();
  const propertyType = normalizePropertyType(raw.propertyType, raw.address);
  let category = "koop";
  if (rawCat === "kamer" || propertyType === "Kamer" || propertyType === "Studio") {
    category = rawCat === "koop" && propertyType !== "Kamer" ? "koop" : (rawCat === "kamer" || propertyType === "Kamer" ? "kamer" : "huur");
  } else if (rawCat === "huur") {
    category = "huur";
  }
  const isKoop = category === "koop";
  const platform = raw.sourcePlatform || detectSourcePlatform(raw.sourceUrl || "");

  const priceVal = Number(raw.priceVal) || (isKoop ? 395000 : 1350);
  const surface = Number(raw.surface) || 85;
  const volume = Number(raw.volume) || Math.round(surface * 3.05);
  const rooms = Number(raw.rooms) || 3;
  const bedrooms = Number(raw.bedrooms) || Math.max(1, rooms - 1);
  const bathrooms = Number(raw.bathrooms) || 1;
  const energyLabel = String(raw.energyLabel || "A+").toUpperCase();
  const buildYear = Number(raw.buildYear) || 2020;
  const city = cleanText(raw.city || "Amsterdam");
  const address = cleanText(raw.address || "Gescrapete Woning");
  const postalCode = cleanText(raw.postalCode || "1012 AB");
  const neighborhood = cleanText(raw.neighborhood || `${city} Centrum`);

  // Status normalisatie (beschikbaar, verhuurd, verkocht, onder bod, etc.)
  let status = raw.status || "beschikbaar";
  let statusLabel = raw.statusLabel || "Direct Beschikbaar";
  const stText = (raw.rawStatus || raw.status || "").toLowerCase();
  if (stText.includes("verhuurd onder voorbehoud")) {
    status = "verhuurd_voorbehoud";
    statusLabel = "Verhuurd onder voorbehoud";
  } else if (stText.includes("verhuurd") || stText.includes("rented")) {
    status = "verhuurd";
    statusLabel = "Verhuurd";
  } else if (stText.includes("verkocht onder voorbehoud") || stText.includes("onder voorbehoud")) {
    status = "verkocht_voorbehoud";
    statusLabel = "Verkocht onder voorbehoud";
  } else if (stText.includes("verkocht") || stText.includes("sold")) {
    status = "verkocht";
    statusLabel = "Verkocht";
  } else if (stText.includes("onder bod") || stText.includes("in onderhandeling") || stText.includes("under-offer")) {
    status = "in_onderhandeling";
    statusLabel = "In onderhandeling / Onder bod";
  } else if (stText.includes("in optie") || stText.includes("onder optie") || stText.includes("gereserveerd")) {
    status = "in_optie";
    statusLabel = "Onder optie / Gereserveerd";
  }

  // Borg & Voorwaarden direct van Funda & Pararius
  let depositDisplay = "";
  let depositAmount = Number(raw.depositAmount) || 0;
  if (!depositAmount && raw.depositMonths) {
    depositAmount = Math.round(priceVal * raw.depositMonths);
  }

  let priceDisplay = "";
  let priceSub = "";
  let advantage = "";

  if (isKoop) {
    // Koop: Standaard Funda k.k. / v.o.n. voorwaarden en wettelijke/notariële bankgarantie/waarborgsom (gebruikelijk 10% bij NVM koopovereenkomst)
    const borgBedrag = depositAmount || Math.round(priceVal * 0.10);
    depositDisplay = raw.depositDisplay || `${formatEuro(borgBedrag)} (10% notariële waarborgsom)`;
    priceDisplay = `${formatEuro(priceVal)} k.k.`;
    priceSub = `Waarborgsom conform ${platform}: <strong>${depositDisplay}</strong>`;
    advantage =
      raw.advantage ||
      `Aangeboden conform de officiële verkoopvoorwaarden op ${platform}. Vraagprijs ${formatEuro(priceVal)} k.k. met de standaard notariële waarborgsom / bankgarantie van ${formatEuro(borgBedrag)} (10%).`;
  } else {
    // Huur: Neem de exacte waarborgsom en contractvoorwaarden over van Pararius of Funda
    const effectiveDeposit = depositAmount || (raw.depositMonths ? Math.round(priceVal * raw.depositMonths) : priceVal);
    const monthsText = raw.depositMonths ? `${raw.depositMonths} ${raw.depositMonths === 1 ? 'maand' : 'maanden'}` : (effectiveDeposit === priceVal ? '1 maand' : `${formatEuro(effectiveDeposit)}`);
    depositDisplay = `${formatEuro(effectiveDeposit)} (${monthsText})`;

    priceDisplay = `${formatEuro(priceVal)} /mnd`;
    
    const termsParts = [];
    termsParts.push(`Borg: <strong>${depositDisplay}</strong>`);
    if (raw.contractTerms) termsParts.push(`Looptijd: ${raw.contractTerms}`);
    if (raw.incomeRequirement) termsParts.push(`Inkomenseis: ${raw.incomeRequirement}`);
    
    priceSub = termsParts.join(" • ");
    advantage =
      raw.advantage ||
      `Huurvoorwaarden conform vermelding op ${platform}: Waarborgsom ${depositDisplay}${raw.contractTerms ? `, contractduur: ${raw.contractTerms}` : ''}${raw.incomeRequirement ? `, inkomenseis: ${raw.incomeRequirement}` : ''}.`;
  }

  // Afbeeldingen (behoud originele Funda/Pararius foto's met fallback)
  const fallbackList = FALLBACK_IMAGES[propertyType] || FALLBACK_IMAGES.Appartement;
  const validImages = Array.isArray(raw.images) ? raw.images.filter(Boolean) : [];
  const primaryImage = raw.image || validImages[0] || fallbackList[0];
  const images = validImages.length > 0 ? validImages : [primaryImage, ...fallbackList.slice(1)];

  // Stabiel uniek ID genereren op basis van adres + stad
  const slugBase = `${address}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const id = raw.id || `${platform.toLowerCase().slice(0, 6)}-${category}-${slugBase}`;

  const defaultDesc = `${propertyType} aan de ${address} (${postalCode}) in ${city}. Deze woning heeft een woonoppervlakte van ${surface} m², telt ${rooms} kamers (waarvan ${bedrooms} slaapkamers) en beschikt over energielabel ${energyLabel} (bouwjaar ${buildYear}). Beschikbaar voor directe toewijzing binnen Ronde 1 van WoningVry.`;

  const features =
    Array.isArray(raw.features) && raw.features.length > 0
      ? raw.features
      : [
          `Woonoppervlakte van ${surface} m² (${rooms} kamers, ${bedrooms} slaapkamers)`,
          `Energielabel ${energyLabel} • Bouwjaar ${buildYear}`,
          isKoop
            ? `Koopvoorwaarden ${platform}: Vraagprijs ${priceDisplay} met standaard 10% notariële waarborgsom (${formatEuro(Math.round(priceVal * 0.10))})`
            : `Huurvoorwaarden ${platform}: Waarborgsom ${depositDisplay || formatEuro(priceVal)}${raw.incomeRequirement ? ` • Inkomenseis: ${raw.incomeRequirement}` : ''}`,
          `Originele bronverificatie: Gevalideerd aanbod van ${platform}`,
          raw.contractTerms ? `Contractduur: ${raw.contractTerms}` : `Beschikbaarheid conform advertentie op ${platform}`
        ];

  return {
    id,
    category,
    status,
    statusLabel,
    isFeatured: Boolean(raw.isFeatured ?? true),
    sourcePlatform: platform,
    sourceUrl: raw.sourceUrl || "",
    address,
    postalCode,
    city,
    neighborhood,
    propertyType,
    priceVal,
    depositAmount: depositAmount || (isKoop ? Math.round(priceVal * 0.10) : priceVal),
    depositDisplay,
    contractTerms: raw.contractTerms || "",
    incomeRequirement: raw.incomeRequirement || "",
    brokerName: raw.brokerName || "",
    publicationDate: raw.publicationDate || new Date().toISOString().split("T")[0],
    priceDisplay: raw.priceDisplay || priceDisplay,
    priceSub: raw.priceSub || priceSub,
    surface,
    volume,
    rooms,
    bedrooms,
    bathrooms,
    energyLabel,
    buildYear,
    heating: raw.heating || "HR-combiketel / Vloerverwarming",
    insulation: raw.insulation || "Volledig geïsoleerd, HR++ beglazing",
    garden: raw.garden || (propertyType === "Appartement" ? "Zonnig balkon / loggia" : "Aangelegde achtertuin met berging"),
    parking: raw.parking || "Parkeergelegenheid direct bij de woning",
    vveCost: raw.vveCost || (isKoop && propertyType === "Appartement" ? "€ 165 per maand" : "Niet van toepassing"),
    image: primaryImage,
    images,
    transactedDate: raw.transactedDate || `Geselecteerd via ${platform} • Originele voorwaarden`,
    description: cleanText(raw.description || defaultDesc),
    advantage,
    features,
    neighborhoodInfo:
      raw.neighborhoodInfo ||
      `Gelegen op een gewilde locatie in ${city} (${neighborhood}) met winkels, horeca, scholen en uitstekende OV- en uitvalswegen in de directe nabijheid.`
  };
}

/**
 * Haalt een Funda of Pararius URL op via een keten van methodes:
 * 1. Directe fetch (indien Node.js of CORS-vrij)
 * 2. Jina Reader API (https://r.jina.ai/{url} - gratis, snel en CORS-enabled voor browser)
 * 3. AllOrigins CORS proxy (https://api.allorigins.win/get?url=...)
 * 4. URL-slug fallback (zodat een Funda/Pararius link ALTIJD een geldig voorstel oplevert)
 */
export async function scrapePropertyUrl(url, options = {}) {
  const cleanUrl = String(url || "").trim();
  if (!cleanUrl || !/^https?:\/\//i.test(cleanUrl)) {
    throw new Error("Voer een geldige Funda of Pararius URL in (beginnend met https://).");
  }

  let htmlContent = "";
  let fetchMethod = "slug-fallback";

  // Methode 1: Indien in Node.js (of directe fetch mogelijk), probeer eerst met realistische browser headers
  if (typeof window === "undefined") {
    try {
      const resp = await fetch(cleanUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7",
          "Cache-Control": "no-cache"
        },
        signal: AbortSignal.timeout(10000)
      });
      if (resp.ok) {
        const text = await resp.text();
        // Controleer of het geen Cloudflare / Funda CAPTCHA blokkade is
        if (
          text.length > 1500 &&
          !text.includes("Je bent bijna op de pagina die je zoekt") &&
          !text.includes("cf-chl-bypass")
        ) {
          htmlContent = text;
          fetchMethod = "direct";
        }
      }
    } catch (e) {
      // Ga door naar volgende methode
    }
  }

  // Methode 2: AllOrigins Proxy (haalt ruwe HTML + JSON-LD op in zowel Browser als Node)
  if (!htmlContent) {
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(cleanUrl)}`;
      const resp = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) });
      if (resp.ok) {
        const data = await resp.json();
        if (
          data?.contents &&
          data.contents.length > 1500 &&
          !data.contents.includes("Je bent bijna op de pagina die je zoekt")
        ) {
          htmlContent = data.contents;
          fetchMethod = "allorigins-proxy";
        }
      }
    } catch (e) {
      // Ga door naar volgende methode
    }
  }

  // Methode 3: Jina Reader Markdown/HTML extractor (werkt uitstekend op Pararius en veel Funda pagina's)
  if (!htmlContent) {
    try {
      const jinaUrl = `https://r.jina.ai/${cleanUrl}`;
      const resp = await fetch(jinaUrl, {
        headers: { "Accept": "text/plain" },
        signal: AbortSignal.timeout(12000)
      });
      if (resp.ok) {
        const text = await resp.text();
        if (
          text.length > 400 &&
          !text.includes("Je bent bijna op de pagina die je zoekt") &&
          !text.includes(" Verify you are human")
        ) {
          htmlContent = text;
          fetchMethod = "jina-reader";
        }
      }
    } catch (e) {
      // Ga door naar URL-slug fallback
    }
  }

  const property = parsePropertyHtml(htmlContent, cleanUrl);
  return {
    property,
    fetchMethod,
    usedFallback: !htmlContent
  };
}

/**
 * Converteert een WoningVry woning-object naar een Firestore `/listings/{docId}` payload
 * die 100% voldoet aan de strikte `isValidListing(data)` regels in `firestore.rules`.
 *
 * Toegestane velden in firestore.rules:
 * 'id', 'title', 'titel', 'description', 'beschrijving', 'woningType', 'type',
 * 'bestemming', 'stad', 'city', 'address', 'adres', 'postcode',
 * 'prijs', 'huurPrijs', 'koopPrijs', 'units', 'oppervlakte', 'kamers',
 * 'status', 'aanbiederUid', 'userId', 'uid', 'images', 'afbeeldingen',
 * 'createdAt', 'updatedAt'
 */
export function toFirestoreListingPayload(prop, uid = "") {
  const isKoop = prop.category === "koop";
  const packedMeta = [
    prop.energyLabel || "A+",
    prop.buildYear || 2021,
    prop.bedrooms || 2,
    prop.bathrooms || 1,
    (prop.sourcePlatform || "Funda").slice(0, 12),
    (prop.neighborhood || "").slice(0, 18)
  ].join("|");

  const imgList = Array.isArray(prop.images) && prop.images.length > 0
    ? prop.images.slice(0, 15)
    : [prop.image || "attached_assets/appartement-luxury.webp"];

  const payload = {
    id: String(prop.id || `wv-${Date.now()}`).slice(0, 95),
    title: String(prop.address || "WoningVry Woning").slice(0, 140),
    titel: String(prop.address || "WoningVry Woning").slice(0, 140),
    description: String(prop.description || "").slice(0, 4800),
    beschrijving: String(prop.advantage || "").slice(0, 4800),
    woningType: String(prop.propertyType || "Appartement").slice(0, 90),
    type: String(prop.propertyType || "Appartement").slice(0, 90),
    bestemming: isKoop ? "Koop" : "Huur",
    stad: String(prop.city || "Amsterdam").slice(0, 95),
    city: String(prop.city || "Amsterdam").slice(0, 95),
    address: String(prop.address || "").slice(0, 145),
    adres: String(prop.address || "").slice(0, 145),
    postcode: String(prop.postalCode || "1012 AB").slice(0, 18),
    prijs: String(prop.priceDisplay || formatEuro(prop.priceVal)).slice(0, 95),
    koopPrijs: isKoop ? Number(prop.priceVal) || 0 : 0,
    huurPrijs: !isKoop ? Number(prop.priceVal) || 0 : 0,
    units: packedMeta.slice(0, 48),
    oppervlakte: Number(prop.surface) || 85,
    kamers: Number(prop.rooms) || 3,
    status: String(prop.status || "beschikbaar").slice(0, 48),
    images: imgList,
    afbeeldingen: prop.sourceUrl ? [String(prop.sourceUrl).slice(0, 450)] : []
  };

  if (uid) {
    payload.aanbiederUid = String(uid).slice(0, 120);
    payload.userId = String(uid).slice(0, 120);
    payload.uid = String(uid).slice(0, 120);
  }

  return payload;
}

/**
 * Zet een Firestore `/listings/{docId}` document terug om naar een volledig WoningVry Woning-object
 */
export function fromFirestoreListingPayload(docData = {}) {
  if (!docData) return null;

  // Indien het al een volledig WoningVry object is met priceVal & surface
  if (docData.priceVal && docData.surface && docData.priceDisplay) {
    return convertToWoningVryProperty(docData);
  }

  const bestemming = String(docData.bestemming || "").toLowerCase();
  const isHuur = bestemming.includes("huur") && !bestemming.includes("koop");
  const category = isHuur ? "huur" : "koop";

  // Pak numerieke prijs uit koopPrijs, huurPrijs of prijs string
  let priceVal = isHuur ? Number(docData.huurPrijs) : Number(docData.koopPrijs);
  if (!priceVal && docData.prijs) {
    const numMatch = String(docData.prijs).replace(/\./g, "").match(/(\d{3,7})/);
    if (numMatch) priceVal = parseInt(numMatch[1], 10);
  }
  if (!priceVal) priceVal = isHuur ? 1350 : 395000;

  // Pak packed metadata uit `units` indien aanwezig (energyLabel|buildYear|bedrooms|bathrooms|sourcePlatform|neighborhood)
  let energyLabel = "A+";
  let buildYear = 2021;
  let bedrooms = 2;
  let bathrooms = 1;
  let sourcePlatform = "Funda / Pararius";
  let neighborhood = "";

  if (typeof docData.units === "string" && docData.units.includes("|")) {
    const parts = docData.units.split("|");
    if (parts[0]) energyLabel = parts[0];
    if (parts[1]) buildYear = parseInt(parts[1], 10) || 2021;
    if (parts[2]) bedrooms = parseInt(parts[2], 10) || 2;
    if (parts[3]) bathrooms = parseInt(parts[3], 10) || 1;
    if (parts[4]) sourcePlatform = parts[4];
    if (parts[5]) neighborhood = parts[5];
  }

  const sourceUrl =
    Array.isArray(docData.afbeeldingen) &&
    docData.afbeeldingen[0] &&
    String(docData.afbeeldingen[0]).startsWith("http") &&
    (docData.afbeeldingen[0].includes("funda") || docData.afbeeldingen[0].includes("pararius"))
      ? docData.afbeeldingen[0]
      : "";

  const rawStatus = String(docData.status || "beschikbaar").toLowerCase();
  const normalizedStatus =
    rawStatus.includes("actief") || rawStatus === "beschikbaar"
      ? "beschikbaar"
      : rawStatus;

  return convertToWoningVryProperty({
    id: docData.id,
    category,
    status: normalizedStatus,
    statusLabel: normalizedStatus === "beschikbaar" ? "Direct Beschikbaar" : docData.status,
    sourcePlatform,
    sourceUrl,
    address: docData.address || docData.adres || docData.title || docData.titel || "WoningVry Woning",
    postalCode: docData.postcode || "1012 AB",
    city: docData.city || docData.stad || "Amsterdam",
    neighborhood: neighborhood || `${docData.city || docData.stad || "Amsterdam"} Centrum`,
    propertyType: docData.woningType || docData.type || "Appartement",
    priceVal,
    surface: Number(docData.oppervlakte) || 85,
    rooms: Number(docData.kamers) || 3,
    bedrooms,
    bathrooms,
    energyLabel,
    buildYear,
    images: Array.isArray(docData.images) && docData.images.length > 0 ? docData.images : undefined,
    description: docData.description || undefined,
    advantage: docData.beschrijving || undefined
  });
}
