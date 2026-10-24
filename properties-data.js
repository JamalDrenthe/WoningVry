// ============================================================
// WONINGVRY GEDEELDE WONINGENDATABASE & HELPERS
// Ondersteunt Koop (Non-Hypotheek) en Flexibele Huur
// ============================================================

export const propertiesData = [
  // ------------------------------------------------------------
  // ACTIEF & BESCHIKBAAR / IN TOEWIJZING (RONDE 1)
  // ------------------------------------------------------------
  {
    id: "koop-actief-1",
    category: "koop",
    status: "beschikbaar",
    statusLabel: "Direct Beschikbaar",
    isFeatured: true,
    address: "Gustav Mahlerlaan 612",
    postalCode: "1082 MK",
    city: "Amsterdam",
    neighborhood: "Zuidas / Buitenveldert",
    propertyType: "Appartement",
    priceVal: 485000,
    priceDisplay: "€ 485.000 k.k.",
    priceSub: "Non-hypotheek inleg ca. <strong>€ 1.455 /mnd</strong> • Borg 10% (€ 48.500)",
    surface: 98,
    volume: 295,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    energyLabel: "A+++",
    buildYear: 2022,
    heating: "Stadsverwarming & WTW-installatie",
    insulation: "Volledig geïsoleerd, driedubbel glas HR+++",
    garden: "Riant inpandig balkon op het zuiden (12 m²)",
    parking: "Eigen overdekte parkeerplaats in garage",
    vveCost: "€ 175,- per maand",
    image: "attached_assets/appartement-luxury.webp",
    images: [
      "attached_assets/appartement-luxury.webp",
      "attached_assets/20250510_1714_Luxury Bedroom Serenity_simple_compose_01jtxc54sbej1sqqpzen90c83y.png",
      "attached_assets/20250510_1714_Modern Scandinavian Apartment_simple_compose_01jtxc3ykgf9nre663k3zpmdmn.png",
      "attached_assets/locatie-amsterdam.webp"
    ],
    transactedDate: "Nu beschikbaar voor Ronde 1 toewijzing",
    description: "Uitzonderlijk luxueus 3-kamer appartement op de 9e verdieping van een prestigieus complex aan de Gustav Mahlerlaan. De woning beschikt over kamerhoge raampartijen met adembenemend uitzicht, een hoogwaardige Bulthaup keuken met Miele apparatuur, een master bedroom met en-suite dressing en een zonnig inpandig balkon. Uitgerust met vloerverwarming en -koeling.",
    advantage: "Beschikbaar via de non-hypotheekregeling van WoningVry. Geen afwijzing op BKR of ontbrekende jaarcijfers voor ondernemers. Toewijzing geschiedt op basis van solvabiliteit en 10% borginleg.",
    features: [
      "Energielabel A+++ met minimale energielasten",
      "Kamerhoge ramen met panoramisch uitzicht over Amsterdam",
      "Luxe eiken visgraat parketvloer met vloerkoeling",
      "Eigen parkeerplaats en berging in de onderbouw",
      "Directe oplevering mogelijk binnen Ronde 1"
    ],
    neighborhoodInfo: "De Zuidas biedt een kosmopolitische leefomgeving met toprestaurants, luxe sportscholen en directe verbindingen naar Schiphol (6 min) en Amsterdam Centraal."
  },
  {
    id: "koop-actief-2",
    category: "koop",
    status: "in-toewijzing",
    statusLabel: "In toewijzing (Ronde 1)",
    isFeatured: true,
    address: "Hoge Weide Park 34",
    postalCode: "3541 RX",
    city: "Utrecht",
    neighborhood: "Leidsche Rijn / Hoge Weide",
    propertyType: "Eengezinswoning",
    priceVal: 420000,
    priceDisplay: "€ 420.000 k.k.",
    priceSub: "Non-hypotheek inleg ca. <strong>€ 1.260 /mnd</strong> • Borg 10% (€ 42.000)",
    surface: 132,
    volume: 430,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    energyLabel: "A++++",
    buildYear: 2023,
    heating: "Bodemwarmtepomp & 14 zonnepanelen",
    insulation: "Nul-op-de-meter isolatiestandaard",
    garden: "Fraai aangelegde achtertuin (55 m²) op het zuidwesten met achterom",
    parking: "Eigen oprit met laadpaal-aansluiting",
    vveCost: "Niet van toepassing (volle eigendom)",
    image: "attached_assets/rijwoning-modern.webp",
    images: [
      "attached_assets/rijwoning-modern.webp",
      "attached_assets/20250510_1719_Luxury Bedroom Oasis_simple_compose_01jtxcemdwfjktph976sg69wpt.png",
      "attached_assets/hero-community.webp",
      "attached_assets/locatie-utrecht.webp"
    ],
    transactedDate: "Selectie kandidaten actief in Ronde 1",
    description: "Moderne, energie-neutrale gezinswoning met vier ruime slaapkamers, twee moderne badkamers en een zonnige achtertuin grenzend aan het groene park Hoge Weide. Uitgerust met een bodemwarmtepomp en 14 zonnepanelen waardoor de energienota nagenoeg nul bedraagt.",
    advantage: "Geschikt voor gezinnen en doorstromers die vastlopen in de reguliere leennormen. Flexibele waarborgregeling en notariële zekerheid zonder tussenkomst van een commerciële bank.",
    features: [
      "Nul-op-de-meter (NOM) gezinswoning",
      "14 zonnepanelen en bodemwarmtepomp in eigendom",
      "Luxe open leefkeuken met composiet werkblad en inductie",
      "Diepe tuin met veranda en houten berging",
      "Kindvriendelijke straat zonder doorgaand verkeer"
    ],
    neighborhoodInfo: "Gelegen op enkele minuten van Leidsche Rijn Centrum met winkels, bioscoop en NS-station, en op 12 minuten fietsen van de historische Utrechtse binnenstad."
  },
  {
    id: "huur-actief-1",
    category: "huur",
    status: "beschikbaar",
    statusLabel: "Direct Beschikbaar",
    isFeatured: true,
    address: "Binnenrotte 142",
    postalCode: "3011 HC",
    city: "Rotterdam",
    neighborhood: "Stadsdriehoek / Markthal",
    propertyType: "Appartement",
    priceVal: 1290,
    priceDisplay: "€ 1.290 /mnd",
    priceSub: "Waarborgsom: <strong>€ 1.290 (1 maand)</strong> • Géén 4x bruto inkomenseis",
    surface: 72,
    volume: 215,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    energyLabel: "A+",
    buildYear: 2020,
    heating: "Vloerverwarming via stadswarmte",
    insulation: "Optimaal geïsoleerd met geluidswering",
    garden: "Loggia met uitzicht op de Binnenrotte en Markthal",
    parking: "Vergunning direct verkrijgbaar of huur in parkeerkelder",
    vveCost: "Inclusief servicekosten",
    image: "attached_assets/locatie-rotterdam.webp",
    images: [
      "attached_assets/locatie-rotterdam.webp",
      "attached_assets/appartement-luxury.webp",
      "attached_assets/20250510_1714_Modern Scandinavian Apartment_simple_compose_01jtxc3ykgf9nre663k3zpmdmn.png",
      "attached_assets/photo-output(2).png"
    ],
    transactedDate: "Nieuw geplaatst voor toewijzing",
    description: "Instapklaar, modern 3-kamer appartement met loggia in het bruisende hart van Rotterdam, direct naast station Blaak en de iconische Markthal. Voorzien van strakke gietvloer, moderne inbouwkeuken en royale badkamer met inloop regendouche.",
    advantage: "WoningVry stelt géén onredelijke 4x bruto inkomenseis. Toewijzing is gebaseerd op werkelijke betaalcapaciteit en een eerlijke waarborg van slechts 1 maand.",
    features: [
      "Midden in het centrum naast station Blaak",
      "Géén 4x bruto inkomenseis",
      "Slechts 1 maand waarborgsom",
      "Mogelijkheid tot doorgroei naar Huur-naar-Koop",
      "Fietsenstalling in afgesloten kelder"
    ],
    neighborhoodInfo: "Het Laurenskwartier en de Oude Haven bieden ontelbare terrassen, boetieks en culturele voorzieningen letterlijk voor de deur."
  },
  {
    id: "huur-actief-2",
    category: "huur",
    status: "in-toewijzing",
    statusLabel: "In toewijzing (Ronde 1)",
    isFeatured: true,
    address: "Nobelstraat 89",
    postalCode: "1341 BL",
    city: "Almere",
    neighborhood: "Nobelhorst / Hout",
    propertyType: "Eengezinswoning",
    priceVal: 1420,
    priceDisplay: "€ 1.420 /mnd",
    priceSub: "Waarborgsom: <strong>€ 1.420 (1 maand)</strong> • BKR-vrijgesteld",
    surface: 110,
    volume: 360,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 1,
    energyLabel: "A++",
    buildYear: 2021,
    heating: "Warmtepomp met warmteterugwinning",
    insulation: "Uitstekend geïsoleerd",
    garden: "Zonnige achtertuin (48 m²) op het zuiden met houten berging",
    parking: "Vrij parkeren voor de deur",
    vveCost: "Niet van toepassing",
    image: "attached_assets/locatie-almere.webp",
    images: [
      "attached_assets/locatie-almere.webp",
      "attached_assets/rijwoning-modern.webp",
      "attached_assets/hero-community.webp",
      "attached_assets/photo-output(1).png"
    ],
    transactedDate: "Kandidatenselectie gaande",
    description: "Sfeervolle en duurzame tussenwoning in het gemoedelijke tuindorp Nobelhorst. Ruime living met openslaande deuren naar de tuin, open keuken met inductie en vaatwasser, drie volwaardige slaapkamers en een grote bergzolder.",
    advantage: "Flexibele huurovereenkomst met optie om na 12 maanden de woning over te nemen via het WoningVry koopmodel zonder traditionele bankhypotheek.",
    features: [
      "Dorps en groen wonen met Amsterdam op 25 minuten",
      "Zonnige achtertuin op het zuiden",
      "Optie tot Huur-naar-Koop zonder herbeoordeling",
      "Toegankelijk voor zzp'ers en flexwerkers",
      "Lage stookkosten dankzij energielabel A++"
    ],
    neighborhoodInfo: "Nobelhorst staat bekend als 'het dorp van Almere': kindvriendelijk, omringd door bos en water, met basisscholen en buurtcafés op loopafstand."
  },

  // ------------------------------------------------------------
  // 10 KOOP WONINGEN (TRANSACTIES / GEREALISEERD)
  // ------------------------------------------------------------
  {
    id: "koop-1",
    category: "koop",
    status: "verkocht-ov",
    statusLabel: "Verkocht o.v.",
    address: "Keizersgracht 512",
    postalCode: "1017 EK",
    city: "Amsterdam",
    neighborhood: "Centrum / Grachtengordel",
    propertyType: "Appartement",
    priceVal: 445000,
    priceDisplay: "€ 445.000 k.k.",
    priceSub: "Non-hypotheek inleg ca. <strong>€ 1.340 /mnd</strong> • Borg 10% (€ 44.500)",
    surface: 84,
    volume: 260,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    energyLabel: "A+",
    buildYear: 1895,
    heating: "Hybride warmtepomp & vloerverwarming",
    insulation: "Monumentaal gerenoveerd met HR++ achterzetbeglazing",
    garden: "Gemeenschappelijke binnentuin",
    parking: "Parkeervergunning centrum",
    vveCost: "€ 142,- per maand",
    image: "attached_assets/appartement-luxury.webp",
    images: [
      "attached_assets/appartement-luxury.webp",
      "attached_assets/20250510_1714_Luxury Bedroom Serenity_simple_compose_01jtxc54sbej1sqqpzen90c83y.png",
      "attached_assets/locatie-amsterdam.webp"
    ],
    transactedDate: "Recent toegewezen in Ronde 1",
    description: "Prachtig gerenoveerd monumentaal grachtenappartement met uitzicht over de Keizersgracht. Voorzien van luxe visgraat parketvloer, design woonkeuken met marmeren blad en twee goed bemeten slaapkamers. Volledig gasloos en voorzien van hoogwaardige achterzetbeglazing.",
    advantage: "Toegewezen aan zelfstandig ondernemer zonder jaarcijfers of bankhypotheek via het WoningVry non-hypotheekmodel. Borg 10% voldaan bij toewijzing.",
    features: [
      "Monumentale allure aan de Keizersgracht",
      "Volledig gasloos gerenoveerd",
      "Visgraat parketvloer en marmeren afwerking",
      "Hoge plafonds met originele ornamenten"
    ],
    neighborhoodInfo: "Midden in de historische Amsterdamse Grachtengordel nabij de Leidsestraat en Spiegelkwartier."
  },
  {
    id: "koop-2",
    category: "koop",
    status: "verkocht",
    statusLabel: "Verkocht",
    address: "Vleutenseweg 248",
    postalCode: "3532 HV",
    city: "Utrecht",
    neighborhood: "Lombok / West",
    propertyType: "Eengezinswoning",
    priceVal: 385000,
    priceDisplay: "€ 385.000 k.k.",
    priceSub: "Non-hypotheek inleg ca. <strong>€ 1.160 /mnd</strong> • Borg 10% (€ 38.500)",
    surface: 118,
    volume: 385,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 1,
    energyLabel: "A+++",
    buildYear: 2021,
    heating: "Warmtepomp en zonnepanelen",
    insulation: "Volledig geïsoleerd HR++ glas",
    garden: "Zonnige achtertuin op het zuidwesten (42 m²)",
    parking: "Openbaar met vergunning",
    vveCost: "N.v.t.",
    image: "attached_assets/rijwoning-modern.webp",
    images: [
      "attached_assets/rijwoning-modern.webp",
      "attached_assets/20250510_1719_Luxury Bedroom Oasis_simple_compose_01jtxcemdwfjktph976sg69wpt.png",
      "attached_assets/locatie-utrecht.webp"
    ],
    transactedDate: "Verkocht binnen 14 dagen",
    description: "Moderne, energie-neutrale tussenwoning in de populaire wijk Lombok. Voorzien van zonnepanelen, vloerverwarming op alle verdiepingen en een zonnige achtertuin op het zuidwesten met stenen berging en achterom.",
    advantage: "Koper had een historische BKR-codering die elke bank weigerde. WoningVry heeft het dossier beoordeeld op actuele financiële draagkracht en direct groen licht gegeven.",
    features: [
      "Energielabel A+++ met 10 zonnepanelen",
      "Vloerverwarming op alle 3 de woonlagen",
      "Achtertuin op het zuidwesten met achterom",
      "Dichtbij Utrecht Centraal"
    ],
    neighborhoodInfo: "Lombok is geliefd om zijn levendige Kanaalstraat, boetieks, speciaalzaken en ligging t.o.v. Utrecht Centraal."
  },
  {
    id: "koop-3",
    category: "koop",
    status: "verkocht-ov",
    statusLabel: "Verkocht o.v.",
    address: "Kralingse Plaslaan 34",
    postalCode: "3062 DA",
    city: "Rotterdam",
    neighborhood: "Kralingen",
    propertyType: "Appartement",
    priceVal: 525000,
    priceDisplay: "€ 525.000 k.k.",
    priceSub: "Non-hypotheek inleg ca. <strong>€ 1.580 /mnd</strong> • Borg 10% (€ 52.500)",
    surface: 135,
    volume: 420,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    energyLabel: "A++",
    buildYear: 2018,
    heating: "Vloerverwarming & stadswarmte",
    insulation: "Optimaal geïsoleerd",
    garden: "Royaal dakterras van 42 m²",
    parking: "Twee overdekte parkeerplaatsen",
    vveCost: "€ 215,- per maand",
    image: "attached_assets/locatie-rotterdam.webp",
    images: [
      "attached_assets/locatie-rotterdam.webp",
      "attached_assets/appartement-luxury.webp",
      "attached_assets/photo-output(3).png"
    ],
    transactedDate: "In optie Ronde 1",
    description: "Exclusief penthouse met adembenemend uitzicht over de Kralingse Plas en de skyline van Rotterdam. Ruim dakterras van 42 m², privélift naar het penthouse en twee eigen overdekte parkeerplaatsen in de ondergelegen garage.",
    advantage: "Gefinancierd via familieborgstelling binnen de 5-15% borgregeling van WoningVry.",
    features: [
      "Privélift rechtstreeks in het penthouse",
      "Royaal dakterras met uitzicht over de plas",
      "Twee eigen parkeerplaatsen",
      "Luxe master suite met inloopkast"
    ],
    neighborhoodInfo: "Kralingen staat bekend als een van Rotterdams meest begeerde woonwijken, direct aan het groen van het Kralingse Bos."
  },
  {
    id: "koop-4",
    category: "koop",
    status: "verkocht",
    statusLabel: "Verkocht",
    address: "Duinvallei 78",
    postalCode: "1363 TZ",
    city: "Almere",
    neighborhood: "Almere Poort / DUIN",
    propertyType: "Villa",
    priceVal: 495000,
    priceDisplay: "€ 495.000 k.k.",
    priceSub: "Non-hypotheek inleg ca. <strong>€ 1.490 /mnd</strong> • Borg 10% (€ 49.500)",
    surface: 165,
    volume: 540,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    energyLabel: "A++++",
    buildYear: 2023,
    heating: "Bodemwarmtepomp en triple glas",
    insulation: "Passiefhuis standaard",
    garden: "Tuin rondom (220 m²) met veranda",
    parking: "Eigen oprit voor 2 auto's",
    vveCost: "N.v.t.",
    image: "attached_assets/villa-luxury.webp",
    images: [
      "attached_assets/villa-luxury.webp",
      "attached_assets/locatie-almere.webp",
      "attached_assets/photo-output(1).png"
    ],
    transactedDate: "Verkocht in selectieronde",
    description: "Vrijstaande luxe duinvilla op loopafstand van het strand en het IJmeer. Uitgerust met een geavanceerde bodemwarmtepomp, driedubbel glas en een prachtig aangelegde tuin rondom met veranda.",
    advantage: "Nieuwbouwproject direct toegewezen via onze aangesloten partner-ontwikkelaar zonder lotingsstress of bankgarantie.",
    features: [
      "Wonen in het duinlandschap op loopafstand van strand",
      "A++++ energielabel, nagenoeg nulverbruik",
      "Vier royale slaapkamers en twee badkamers",
      "Ruime oprit met dubbele laadpaal"
    ],
    neighborhoodInfo: "Almere DUIN biedt wonen in een kustlandschap met duinen, jachthaven en snelle verbinding naar Amsterdam (20 min)."
  },
  {
    id: "koop-5",
    category: "koop",
    status: "verkocht",
    statusLabel: "Verkocht",
    address: "Stratumsedijk 62",
    postalCode: "5611 ND",
    city: "Eindhoven",
    neighborhood: "Centrum / Stratum",
    propertyType: "Loft",
    priceVal: 310000,
    priceDisplay: "€ 310.000 k.k.",
    priceSub: "Non-hypotheek inleg ca. <strong>€ 930 /mnd</strong> • Borg 10% (€ 31.000)",
    surface: 76,
    volume: 250,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    energyLabel: "A",
    buildYear: 2019,
    heating: "Vloerverwarming",
    insulation: "Volledig geïsoleerd",
    garden: "Balkon op het zuiden (8 m²)",
    parking: "Eigen parkeerplek in afgesloten parkeerhof",
    vveCost: "€ 110,- per maand",
    image: "attached_assets/locatie-eindhoven.webp",
    images: [
      "attached_assets/locatie-eindhoven.webp",
      "attached_assets/appartement-luxury.webp"
    ],
    transactedDate: "Definitief toegewezen",
    description: "Strakke design loft met plafondhoogte van maar liefst 3,40 meter, industriële betonlook vloer en luxe open kookeiland. Gelegen op loopafstand van het centrum van Eindhoven en het bruisende De Bergen.",
    advantage: "Toegewezen aan expat-techconsultant zonder vast contract op basis van aantoonbaar inkomen en WoningVry borg.",
    features: [
      "Plafondhoogte van 3,40m",
      "Industriële loft-esthetiek",
      "Eigen parkeerplek op afgesloten terrein",
      "Loopafstand van Stratumseind en centrum"
    ],
    neighborhoodInfo: "Brainport Eindhoven: bruisend technologiehart met internationale dynamiek en hoogwaardige voorzieningen."
  },
  {
    id: "koop-6",
    category: "koop",
    status: "verkocht-ov",
    statusLabel: "Verkocht o.v.",
    address: "Hereweg 114",
    postalCode: "9725 AJ",
    city: "Groningen",
    neighborhood: "Helpman / Zuid",
    propertyType: "Villa",
    priceVal: 375000,
    priceDisplay: "€ 375.000 k.k.",
    priceSub: "Non-hypotheek inleg ca. <strong>€ 1.120 /mnd</strong> • Borg 10% (€ 37.500)",
    surface: 142,
    volume: 450,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 1,
    energyLabel: "B",
    buildYear: 1932,
    heating: "CV-combiketel & zonnepanelen",
    insulation: "Dak- en glasisolatie",
    garden: "Diepe achtertuin op het oosten (95 m²)",
    parking: "Openbaar voor de deur",
    vveCost: "N.v.t.",
    image: "attached_assets/locatie-groningen.webp",
    images: [
      "attached_assets/locatie-groningen.webp",
      "attached_assets/hero-community.webp"
    ],
    transactedDate: "Onder voorbehoud Ronde 1",
    description: "Karakteristiek vooroorlogs herenhuis met authentieke glas-in-loodramen, en-suite deuren en diepe achtertuin op het oosten. Dichtbij het Stadspark en het Hoofdstation.",
    advantage: "Aankoop met flexibele borginleg van 8% gerealiseerd via overwaarde-doorschuif.",
    features: [
      "Authentieke jaren '30 elementen en glas-in-lood",
      "Diepe achtertuin van 95 m²",
      "Vier royale slaapkamers",
      "Helpman: een van Groningens meest geliefde wijken"
    ],
    neighborhoodInfo: "Helpman combineert vooroorlogse allure met winkelstraten, scholen en snelle ontsluiting naar de A28."
  },
  {
    id: "koop-7",
    category: "koop",
    status: "verkocht",
    statusLabel: "Verkocht",
    address: "Javastraat 88-2",
    postalCode: "1094 HP",
    city: "Amsterdam",
    neighborhood: "Indische Buurt / Oost",
    propertyType: "Appartement",
    priceVal: 340000,
    priceDisplay: "€ 340.000 k.k.",
    priceSub: "Non-hypotheek inleg ca. <strong>€ 1.020 /mnd</strong> • Borg 10% (€ 34.000)",
    surface: 72,
    volume: 220,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    energyLabel: "A",
    buildYear: 1912,
    heating: "Individuele CV-combiketel HR",
    insulation: "Dubbel glas en gevelisolatie",
    garden: "Balkon aan de binnentuin",
    parking: "Parkeervergunning Oost",
    vveCost: "€ 125,- per maand",
    image: "attached_assets/appartement-luxury.webp",
    images: [
      "attached_assets/appartement-luxury.webp",
      "attached_assets/locatie-amsterdam.webp"
    ],
    transactedDate: "Verkocht in toewijzingsronde",
    description: "Stijlvol gerenoveerde etagewoning in de bruisende Javastraat met lichte living, open keuken en zonnig balkon op het zuiden.",
    advantage: "Toegewezen aan startend ondernemersechtpaar via ons flexibele borgmodel.",
    features: ["Balkon op het zuiden", "Energielabel A", "Visgraatvloer"],
    neighborhoodInfo: "De Indische Buurt in Oost is hip, multicultureel en vol koffiebars en boetieks."
  },
  {
    id: "koop-8",
    category: "koop",
    status: "verkocht-ov",
    statusLabel: "Verkocht o.v.",
    address: "Wilhelminapark 12",
    postalCode: "3581 ND",
    city: "Utrecht",
    neighborhood: "Oost / Wilhelminapark",
    propertyType: "Villa",
    priceVal: 625000,
    priceDisplay: "€ 625.000 k.k.",
    priceSub: "Non-hypotheek inleg ca. <strong>€ 1.875 /mnd</strong> • Borg 10% (€ 62.500)",
    surface: 185,
    volume: 590,
    rooms: 6,
    bedrooms: 5,
    bathrooms: 2,
    energyLabel: "B",
    buildYear: 1908,
    heating: "Hybride warmtepomp",
    insulation: "Dak- en vloerisolatie",
    garden: "Stadstuin van 60 m²",
    parking: "Vergunning Oost",
    vveCost: "N.v.t.",
    image: "attached_assets/hero-community.webp",
    images: [
      "attached_assets/hero-community.webp",
      "attached_assets/locatie-utrecht.webp"
    ],
    transactedDate: "Onder voorbehoud Ronde 1",
    description: "Imposant herenhuis aan het Wilhelminapark met originele marmeren schouwen, hoge geornamenteerde plafonds en royale stadstuin.",
    advantage: "Aangekocht zonder ontbindende voorwaarde van hypotheek door gebruik van WoningVry toewijzingscertificaat.",
    features: ["Direct aan het Wilhelminapark", "185 m² woonoppervlakte", "Vijf slaapkamers"],
    neighborhoodInfo: "Utrecht Oost is traditioneel de meest gewilde woonomgeving van Utrecht."
  },
  {
    id: "koop-9",
    category: "koop",
    status: "verkocht",
    statusLabel: "Verkocht",
    address: "Strijpsestraat 145",
    postalCode: "5616 GM",
    city: "Eindhoven",
    neighborhood: "Strijp-S / Trudo",
    propertyType: "Eengezinswoning",
    priceVal: 325000,
    priceDisplay: "€ 325.000 k.k.",
    priceSub: "Non-hypotheek inleg ca. <strong>€ 975 /mnd</strong> • Borg 10% (€ 32.500)",
    surface: 104,
    volume: 340,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 1,
    energyLabel: "A",
    buildYear: 2016,
    heating: "Stadswarmte",
    insulation: "Volledig geïsoleerd",
    garden: "Achtertuin op het oosten (38 m²)",
    parking: "Openbaar voor de deur",
    vveCost: "N.v.t.",
    image: "attached_assets/rijwoning-modern.webp",
    images: [
      "attached_assets/rijwoning-modern.webp",
      "attached_assets/locatie-eindhoven.webp"
    ],
    transactedDate: "Definitief verkocht",
    description: "Moderne eengezinswoning op steenworp afstand van de creatieve hotspot Strijp-S met zonnige tuin en drie fijne slaapkamers.",
    advantage: "Direct gematcht via het account centrum op basis van geregistreerd voorkeurstype en budget.",
    features: ["Om de hoek van Strijp-S", "Energielabel A", "Fijne achtertuin"],
    neighborhoodInfo: "Strijp-S is het creatieve en culturele epicentrum van Eindhoven."
  },
  {
    id: "koop-10",
    category: "koop",
    status: "verkocht-ov",
    statusLabel: "Verkocht o.v.",
    address: "Koninginnegracht 45",
    postalCode: "2514 AB",
    city: "Den Haag",
    neighborhood: "Archipelbuurt",
    propertyType: "Villa",
    priceVal: 580000,
    priceDisplay: "€ 580.000 k.k.",
    priceSub: "Non-hypotheek inleg ca. <strong>€ 1.740 /mnd</strong> • Borg 10% (€ 58.000)",
    surface: 178,
    volume: 560,
    rooms: 6,
    bedrooms: 4,
    bathrooms: 2,
    energyLabel: "B",
    buildYear: 1905,
    heating: "CV-combiketel en zonneboiler",
    insulation: "Gevel- en glasisolatie",
    garden: "Zonnige stadstuin (50 m²)",
    parking: "Vergunning Archipel",
    vveCost: "N.v.t.",
    image: "attached_assets/hero-community.webp",
    images: [
      "attached_assets/hero-community.webp",
      "attached_assets/villa-luxury.webp"
    ],
    transactedDate: "Onder voorbehoud Ronde 1",
    description: "Statig herenhuis met uitzicht over de Koninginnegracht. Karakteristieke hoge plafonds van 3,60 meter, originele marmeren schouwen en een zonnige stadstuin.",
    advantage: "Toegewezen zonder de vereiste van een traditionele banktaxatie of afsluitprovisies van duizenden euro's.",
    features: ["Uitzicht over de Koninginnegracht", "Plafonds van 3,60 meter", "Vier ruime slaapkamers"],
    neighborhoodInfo: "De Archipelbuurt kenmerkt zich door statige 19e-eeuwse herenhuizen, ambassades en groen."
  },

  // ------------------------------------------------------------
  // 10 HUUR WONINGEN (TRANSACTIES / GEREALISEERD)
  // ------------------------------------------------------------
  {
    id: "huur-1",
    category: "huur",
    status: "verhuurd",
    statusLabel: "Verhuurd",
    address: "Prinsengracht 342-H",
    postalCode: "1016 HX",
    city: "Amsterdam",
    neighborhood: "Jordaan / Negen Straatjes",
    propertyType: "Appartement",
    priceVal: 1450,
    priceDisplay: "€ 1.450 /mnd",
    priceSub: "Waarborgsom: <strong>€ 1.450 (1 maand)</strong> • Géén 4x bruto inkomenseis",
    surface: 68,
    volume: 210,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    energyLabel: "A",
    buildYear: 1905,
    heating: "CV-installatie HR",
    insulation: "Monumentaal gerenoveerd",
    garden: "Rustige patiotuin",
    parking: "Vergunning Jordaan",
    vveCost: "Inclusief servicekosten",
    image: "attached_assets/locatie-amsterdam.webp",
    images: [
      "attached_assets/locatie-amsterdam.webp",
      "attached_assets/20250510_1714_Luxury Bedroom Serenity_simple_compose_01jtxc54sbej1sqqpzen90c83y.png"
    ],
    transactedDate: "Verhuurd binnen 48 uur",
    description: "Sfeervol appartement aan de iconische Prinsengracht nabij de Negen Straatjes. Volledig gemeubileerd met design meubilair, eiken vloer en een rustige patiotuin aan de achterzijde.",
    advantage: "Huurder voldeed niet aan de reguliere Amsterdamse 4x bruto eis, maar toonde gezonde solvabiliteit en spaargeld via WoningVry dossier.",
    features: ["Aan de Prinsengracht bij 9 Straatjes", "Slechts 1 maand waarborgsom", "Patiotuin"],
    neighborhoodInfo: "De Jordaan biedt een ongeëvenaarde mix van grachtenromantiek, cultuur en boetieks."
  },
  {
    id: "huur-2",
    category: "huur",
    status: "verhuurd-ov",
    statusLabel: "Verhuurd o.v.",
    address: "Oudegracht 215-A",
    postalCode: "3511 NL",
    city: "Utrecht",
    neighborhood: "Binnenstad / Werf",
    propertyType: "Loft",
    priceVal: 1250,
    priceDisplay: "€ 1.250 /mnd",
    priceSub: "Waarborgsom: <strong>€ 1.250 (1 maand)</strong> • BKR-vrijgesteld",
    surface: 74,
    volume: 230,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    energyLabel: "B",
    buildYear: 1780,
    heating: "Vloerverwarming",
    insulation: "Vochtwerende gewelfisolatie",
    garden: "Direct terras aan de werf aan het water",
    parking: "Openbaar / Q-Park Springweg",
    vveCost: "Inclusief",
    image: "attached_assets/locatie-utrecht.webp",
    images: [
      "attached_assets/locatie-utrecht.webp",
      "attached_assets/appartement-luxury.webp"
    ],
    transactedDate: "Onder optie Ronde 1",
    description: "Unieke werfkelder-loft met directe toegang tot het water van de Oudegracht. Prachtige gewelven, moderne vloerverwarming en een complete design keuken met inbouwapparatuur.",
    advantage: "Geaccepteerd met 1 maand waarborgsom zonder bemiddelingskosten of administratiekosten.",
    features: ["Historische werfkelder met eigen terras aan het water", "Vloerverwarming onder plavuizen", "Uniek monumentaal erfgoed"],
    neighborhoodInfo: "De Oudegracht vormt het kloppend hart van de monumentale Utrechtse binnenstad."
  },
  {
    id: "huur-3",
    category: "huur",
    status: "verhuurd",
    statusLabel: "Verhuurd",
    address: "Witte de Withstraat 94-B",
    postalCode: "3012 BT",
    city: "Rotterdam",
    neighborhood: "Centrum / Cool",
    propertyType: "Appartement",
    priceVal: 1150,
    priceDisplay: "€ 1.150 /mnd",
    priceSub: "Waarborgsom: <strong>€ 1.150 (1 maand)</strong> • Géén 4x bruto eis",
    surface: 65,
    volume: 195,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    energyLabel: "A+",
    buildYear: 2017,
    heating: "Stadswarmte",
    insulation: "HR++ glas en geluidswerend",
    garden: "Balkon op het zuidwesten",
    parking: "In onderbouw optioneel",
    vveCost: "Inclusief",
    image: "attached_assets/locatie-rotterdam.webp",
    images: [
      "attached_assets/locatie-rotterdam.webp",
      "attached_assets/photo-output(2).png"
    ],
    transactedDate: "Verhuurd via toewijzing",
    description: "Modern stadsappartement midden in de bruisende culturele as van Rotterdam. Uitstekend geïsoleerd met energielabel A+, balkon op het zuidwesten en lift in het complex.",
    advantage: "Verhuurd aan jonge startende professional op basis van werkcontract en borgstelling via familie.",
    features: ["Balkon op het zuidwesten", "Lift in het gebouw", "Energielabel A+"],
    neighborhoodInfo: "De Witte de Withstraat is bekend om musea, kunstgaleries en toonaangevende horeca."
  },
  {
    id: "huur-4",
    category: "huur",
    status: "verhuurd-ov",
    statusLabel: "Verhuurd o.v.",
    address: "Stadhuispromenade 31",
    postalCode: "1315 XP",
    city: "Almere",
    neighborhood: "Centrum / Stadhuisplein",
    propertyType: "Appartement",
    priceVal: 980,
    priceDisplay: "€ 980 /mnd",
    priceSub: "Met <strong>Huur-naar-Koop optie</strong> • Waarborg: € 980",
    surface: 70,
    volume: 210,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    energyLabel: "A",
    buildYear: 2018,
    heating: "Stadswarmte",
    insulation: "Volledig geïsoleerd",
    garden: "Loggia",
    parking: "Gemeentelijke garage abonnement",
    vveCost: "Inclusief",
    image: "attached_assets/locatie-almere.webp",
    images: [
      "attached_assets/locatie-almere.webp",
      "attached_assets/appartement-luxury.webp"
    ],
    transactedDate: "Onder optie Ronde 1",
    description: "Fraai afgewerkt 3-kamer appartement in het centrum van Almere Stad met uitzicht op het Weerwater. Moderne open keuken en nette laminaatvloer.",
    advantage: "Huurder maakt gebruik van de Huur-naar-Koop regeling: deel van de maandelijkse huur wordt opgespaard als toekomstige aankoopborg.",
    features: ["Huur-naar-Koop traject", "Uitzicht op het Weerwater", "Twee slaapkamers"],
    neighborhoodInfo: "Centrum Almere met alle winkels, schouwburg en station Almere Centrum binnen 3 minuten."
  },
  {
    id: "huur-5",
    category: "huur",
    status: "verhuurd",
    statusLabel: "Verhuurd",
    address: "Torenallee 45-6",
    postalCode: "5617 BB",
    city: "Eindhoven",
    neighborhood: "Strijp-S / Anton",
    propertyType: "Loft",
    priceVal: 1050,
    priceDisplay: "€ 1.050 /mnd",
    priceSub: "Waarborgsom: <strong>€ 1.050 (1 maand)</strong> • BKR-vrijgesteld",
    surface: 62,
    volume: 220,
    rooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    energyLabel: "A",
    buildYear: 2015,
    heating: "Vloerverwarming en koeling",
    insulation: "Optimaal geïsoleerd industrieel erfgoed",
    garden: "Gezamenlijk dakterras",
    parking: "Mobiliteitshub Strijp-S",
    vveCost: "Inclusief",
    image: "attached_assets/locatie-eindhoven.webp",
    images: [
      "attached_assets/locatie-eindhoven.webp",
      "attached_assets/photo-output(2).png"
    ],
    transactedDate: "Verhuurd in 3 dagen",
    description: "Industriële Philips erfgoed loft in het markante gebouw Anton op Strijp-S. Grote ramen met overvloedig daglicht, strakke epoxy vloer en toegang tot het gezamenlijke dakterras met panorama.",
    advantage: "Toegewezen aan zelfstandige ontwerper zonder vaste werkgeversverklaring.",
    features: ["Gezamenlijk dakterras met uitzicht over Eindhoven", "Hoge ramen", "Strijp-S community"],
    neighborhoodInfo: "Strijp-S is de hotspot voor creatieven, tech-startups en urban life in Zuid-Nederland."
  },
  {
    id: "huur-6",
    category: "huur",
    status: "verhuurd",
    statusLabel: "Verhuurd",
    address: "Oosterstraat 52-B",
    postalCode: "9711 NX",
    city: "Groningen",
    neighborhood: "Binnenstad / Grote Markt",
    propertyType: "Appartement",
    priceVal: 890,
    priceDisplay: "€ 890 /mnd",
    priceSub: "Waarborgsom: <strong>€ 890 (1 maand)</strong> • Géén 4x bruto eis",
    surface: 54,
    volume: 165,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    energyLabel: "A",
    buildYear: 2019,
    heating: "CV-combiketel",
    insulation: "Dubbel glas",
    garden: "Geen (wel frans balkon)",
    parking: "Openbaar",
    vveCost: "Inclusief",
    image: "attached_assets/locatie-groningen.webp",
    images: [
      "attached_assets/locatie-groningen.webp",
      "attached_assets/appartement-luxury.webp"
    ],
    transactedDate: "Toegewezen via lotingvrije selectie",
    description: "Strak en compact 2-kamer appartement op loopafstand van de Grote Markt en het Forum Groningen. Voorzien van moderne open keuken en frans balkon.",
    advantage: "Geen onzinnige makelaarskosten of wachtlijsten van 8 jaar via het WoningVry matchingportaal.",
    features: ["Om de hoek van de Grote Markt en Forum", "Lage energielasten", "Ideaal voor jonge professional"],
    neighborhoodInfo: "Groningen centrum is een levendige stad met de hoogste fietsdichtheid en horecadynamiek van Nederland."
  },
  {
    id: "huur-7",
    category: "huur",
    status: "verhuurd-ov",
    statusLabel: "Verhuurd o.v.",
    address: "Ceintuurbaan 210-3",
    postalCode: "1072 GC",
    city: "Amsterdam",
    neighborhood: "De Pijp / Zuid",
    propertyType: "Appartement",
    priceVal: 1550,
    priceDisplay: "€ 1.550 /mnd",
    priceSub: "Waarborgsom: <strong>€ 1.550</strong> • Géén onredelijke inkomenseis",
    surface: 72,
    volume: 220,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    energyLabel: "A",
    buildYear: 2015,
    heating: "Individuele CV",
    insulation: "Dubbel glas en vloerisolatie",
    garden: "Balkon op het zuiden (6 m²)",
    parking: "Vergunning De Pijp",
    vveCost: "Inclusief",
    image: "attached_assets/20250510_1719_Luxury Bedroom Oasis_simple_compose_01jtxcemdwfjktph976sg69wpt.png",
    images: [
      "attached_assets/20250510_1719_Luxury Bedroom Oasis_simple_compose_01jtxcemdwfjktph976sg69wpt.png",
      "attached_assets/locatie-amsterdam.webp"
    ],
    transactedDate: "Onder voorbehoud toewijzing",
    description: "Luxe bovenwoning in de populaire wijk De Pijp om de hoek van de Albert Cuypmarkt en het Sarphatipark. Twee ruime slaapkamers, luxe badkamer met inloopdouche en balkon op het zuiden.",
    advantage: "Verhuurder accepteerde de huurder via WoningVry platformzekerheid zonder bureaucratische makelaarsdrempels.",
    features: ["Balkon op het zuiden", "Om de hoek van Sarphatipark", "Twee ruime slaapkamers"],
    neighborhoodInfo: "De Pijp is befaamd om de Albert Cuypmarkt, boutique eettentjes en levendige terrassen."
  },
  {
    id: "huur-8",
    category: "huur",
    status: "verhuurd",
    statusLabel: "Verhuurd",
    address: "Wilhelminapier 55",
    postalCode: "3072 AP",
    city: "Rotterdam",
    neighborhood: "Kop van Zuid",
    propertyType: "Appartement",
    priceVal: 1650,
    priceDisplay: "€ 1.650 /mnd",
    priceSub: "Met <strong>Huur-naar-Koop optie</strong> • Waarborg: € 1.650",
    surface: 92,
    volume: 285,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    energyLabel: "A++",
    buildYear: 2021,
    heating: "Stadswarmte & koeling",
    insulation: "Optimaal geïsoleerd torencomplex",
    garden: "Inpandige serre met panoramaraam",
    parking: "Eigen parkeerplek in ondergrondse garage",
    vveCost: "Inclusief",
    image: "attached_assets/appartement-luxury.webp",
    images: [
      "attached_assets/appartement-luxury.webp",
      "attached_assets/locatie-rotterdam.webp"
    ],
    transactedDate: "Verhuurd via toewijzing",
    description: "Luxe torenappartement op de 16e verdieping met spectaculair panoramisch uitzicht over de Nieuwe Maas. Inclusief eigen parkeerplek en toegang tot gezamenlijke wellness in het gebouw.",
    advantage: "Huurder stroomt na 24 maanden door naar aankoop met behulp van opgebouwde spaartegoeden.",
    features: ["16e verdieping uitzicht over de Maas", "Eigen parkeerplaats inbegrepen", "Doorgroei naar koop mogelijk"],
    neighborhoodInfo: "De Kop van Zuid en Wilhelminapier worden wel het 'Manhattan aan de Maas' genoemd met Hotel New York en Luxor Theater."
  },
  {
    id: "huur-9",
    category: "huur",
    status: "verhuurd-ov",
    statusLabel: "Verhuurd o.v.",
    address: "Nachtegaalstraat 67-A",
    postalCode: "3581 AD",
    city: "Utrecht",
    neighborhood: "Buiten Wittevrouwen",
    propertyType: "Appartement",
    priceVal: 1380,
    priceDisplay: "€ 1.380 /mnd",
    priceSub: "Waarborgsom: <strong>€ 1.380 (1 maand)</strong> • BKR-vrijgesteld",
    surface: 85,
    volume: 260,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    energyLabel: "A",
    buildYear: 2018,
    heating: "CV-combiketel HR",
    insulation: "Volledig geïsoleerd",
    garden: "Riant zonnig dakterras van 20 m²",
    parking: "Vergunning Oost",
    vveCost: "Inclusief",
    image: "attached_assets/rijwoning-modern.webp",
    images: [
      "attached_assets/rijwoning-modern.webp",
      "attached_assets/locatie-utrecht.webp"
    ],
    transactedDate: "Onder voorbehoud Ronde 1",
    description: "Royale bovenwoning met een riant zonnig dakterras van 20 m² in de populaire wijk Buiten Wittevrouwen. Grote woonkeuken, luxe badkamer en twee ruime slaapkamers.",
    advantage: "Geen automatische BKR-afwijzing: de huurder had een herstelde notering en werd op basis van actuele liquide middelen direct verwelkomd.",
    features: ["Dakterras van 20 m²", "Luxe badkamer met ligbad en inloopdouche", "Buiten Wittevrouwen"],
    neighborhoodInfo: "De Nachtegaalstraat en Burgemeester Reigerstraat bieden de fijnste speciaalzaken van Utrecht Oost."
  },
  {
    id: "huur-10",
    category: "huur",
    status: "verhuurd",
    statusLabel: "Verhuurd",
    address: "Lange Voorhout 38-B",
    postalCode: "2514 EJ",
    city: "Den Haag",
    neighborhood: "Centrum / Hofkwartier",
    propertyType: "Appartement",
    priceVal: 1850,
    priceDisplay: "€ 1.850 /mnd",
    priceSub: "Met <strong>Huur-naar-Koop optie</strong> • Waarborg: € 1.850",
    surface: 110,
    volume: 340,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    energyLabel: "A",
    buildYear: 2016,
    heating: "Vloerverwarming",
    insulation: "Geluids- en warmte-isolerend",
    garden: "Patiotuin",
    parking: "Parkeergarage Museumkwartier",
    vveCost: "Inclusief",
    image: "attached_assets/20250510_1714_Luxury Bedroom Serenity_simple_compose_01jtxc54sbej1sqqpzen90c83y.png",
    images: [
      "attached_assets/20250510_1714_Luxury Bedroom Serenity_simple_compose_01jtxc54sbej1sqqpzen90c83y.png",
      "attached_assets/appartement-luxury.webp"
    ],
    transactedDate: "Definitief toegewezen",
    description: "Exclusief gerenoveerd appartement aan de beroemde lindelaan van het Lange Voorhout. Marmeren badkamers, gashaard, visgraat vloer en een serene patiotuin.",
    advantage: "Toegewezen op basis van internationale vermogenstoets via het WoningVry acceptatiesysteem.",
    features: ["Aan het historische Lange Voorhout", "Twee luxe marmeren badkamers", "Hoogste afwerkingsniveau"],
    neighborhoodInfo: "Het Hofkwartier en Lange Voorhout vormen de diplomatieke en culturele parel van Den Haag."
  }
];

// ============================================================
// HELPER FUNCTIES
// ============================================================

export function getAllProperties() {
  return propertiesData;
}

export function getPropertyById(id) {
  if (!id) return null;
  return propertiesData.find(item => item.id === id) || null;
}

// Favorieten beheer (localStorage + optioneel account sync)
const FAVORITES_KEY = "woningvry_favorites";

export function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function isFavorite(id) {
  const favs = getFavorites();
  return favs.includes(id);
}

export function toggleFavorite(id) {
  let favs = getFavorites();
  let added = false;
  if (favs.includes(id)) {
    favs = favs.filter(item => item !== id);
    added = false;
  } else {
    favs.push(id);
    added = true;
  }
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    window.dispatchEvent(new CustomEvent("woningvry:favorites-changed", { detail: { favorites: favs, id, added } }));
  } catch (e) {
    console.error("Fout bij opslaan favorieten:", e);
  }
  return added;
}

export function getFavoriteProperties() {
  const favIds = getFavorites();
  return propertiesData.filter(item => favIds.includes(item.id));
}

// Bezichtigingsaanvragen beheer
const VIEWINGS_KEY = "woningvry_viewings";

export function getViewings() {
  try {
    const raw = localStorage.getItem(VIEWINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveViewing(viewingData) {
  const list = getViewings();
  const entry = {
    id: "bezichtiging-" + Date.now(),
    createdAt: new Date().toISOString(),
    status: "In behandeling",
    ...viewingData
  };
  list.unshift(entry);
  try {
    localStorage.setItem(VIEWINGS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("woningvry:viewings-changed", { detail: { viewings: list, newEntry: entry } }));
  } catch (e) {
    console.error("Fout bij opslaan bezichtiging:", e);
  }
  return entry;
}

// Woningalert beheer
const ALERT_KEY = "woningvry_alert_prefs";

export function getAlertPrefs() {
  try {
    const raw = localStorage.getItem(ALERT_KEY);
    return raw ? JSON.parse(raw) : { active: false, cities: ["Amsterdam", "Utrecht"], types: ["koop", "huur"], maxPrice: 500000 };
  } catch (e) {
    return { active: false, cities: ["Amsterdam", "Utrecht"], types: ["koop", "huur"], maxPrice: 500000 };
  }
}

export function saveAlertPrefs(prefs) {
  try {
    localStorage.setItem(ALERT_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent("woningvry:alert-changed", { detail: prefs }));
    return true;
  } catch (e) {
    console.error("Fout bij opslaan alert voorkeuren:", e);
    return false;
  }
}
