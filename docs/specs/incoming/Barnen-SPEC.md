# Barnen-SPEC

Källa: extern planerings-AI. Konsoliderad till `.context/modules/barnens_livsloggar.md`.

## 1. Syfte och användarbehov

Den trygga hamnen — strukturerad, neutral dokumentation av mående och händelser för **Kasper** och **Arvid**. Balansmätare synliggör mönster utan grafer. Vid behov: formell, tidsstämplad juridisk rapport (PDF) för att skydda barnen.

## 2. Route och ingång

- **Route:** `/barnen` (AuthGate)
- **Variant A (aktiv):** FloatingDock Heart, HomePage bento
- **Variant B (planerad):** taggning från Dagbok triggar barn-specifik Balansmätare

## 3. UX-flöde (Progressive Disclosure)

**Spec (målbild):**

1. Välj barn — Kasper eller Arvid (guld-markerade kort)
2. Logga — guidat steg-för-steg (vad hände, hur mår barnet)
3. Balansmätare — diskret färgkodad indikator (inga count-ups)
4. Aktion — spara eller "Skapa juridisk rapport" (PDF)

**Idag (kod):** PIN → barn-flikar → Balansmätare + fysiologi + livslogg-formulär + tidslinje. JSON-export finns; PDF och full wizard saknas.

## 4. Visuell design (Obsidian Calm)

Canonical: [`docs/specs/design-master.md`](../design-master.md)

- Bakgrund `#020617`, yta `#0f172a` + glass blur
- Guld `#FDE68A` — aktivt barn / Balansmätare
- Indigo `#818CF8` — sekundär accent (Balansmätare-kontext)
- Emerald `#2DD4BF` — spara
- Outfit + Inter
- Förbjudet: lila, turkos, regnbåge, naturteman, count-up

## 5. Datamodell (Firestore, WORM)

Collection `children_logs`: append-only via Security Rules + `serverTimestamp`.

| Fält | Användning |
|------|------------|
| `childAlias` | Kasper / Arvid |
| `action` | `fysiologi` \| `livslogg` |
| `signals` | sömn, ångest, aptit (1–5) vid fysiologi |
| `observation`, `truth`, `category`, `childrenImpact` | livslogg |
| `userId`, `ownerId`, `createdAt` | ägarskap + WORM |

Klient: `saveChildrenLog`, `getChildrenLogs` i [`firestore.ts`](../../../src/modules/core/firebase/firestore.ts).

## 6. Backend och agenter

- **Idag:** klient-skrivning till Firestore (ingen separat callable för logg)
- **Planerat:** Dossier-agent (Genkit) för formell PDF över vald period

## 7. Säkerhet

- AuthGate på route
- Separat PIN (lokal hash) + lås vid `visibilitychange` (Zero Footprint partial)
- Kill Switch global (`useShakeToKill` → `/`)
- CMEK (drift)
- Grey Rock-neutral lagring — ingen partisk tolkning i fält

## 8. Status idag vs planerat

**Idag:** BarnensPage, Kasper/Arvid, fysiologi, livslogg, Balansmätare 7 dagar, tidslinje, JSON-export.

**Planerat:** PDF juridisk rapport, steg-wizard, unmount cleanup, auto-koppling allvarliga incidenter → valv, Dagbok-tagg Variant B.

*(Extern spec sa "route finns översiktligt" — det är **fel**; modulen är i stort sett implementerad.)*

## 9. Acceptanskriterier

| # | Kriterium | Kod-status |
|---|-----------|------------|
| 1 | Logga händelse per barn med serverTimestamp | **done** |
| 2 | WORM — ingen update/delete | **done** (rules) |
| 3 | PDF-export objektiv med tidsstämplar | **planned** |
| 4 | Balansmätare uppdateras utan grafer/count-up | **done** |
| 5 | Formulär nollställs vid navigering bort (ej sparat) | **partial** — fält rensas efter save; unmount cleanup planerad |

## 10. Kopplingar

- **Verklighetsvalvet** — allvarliga incidenter kan kopieras/sparas som bevis (planerad)
- **Dossier** — delad PDF-infrastruktur med samlad export (planerad)
- **Dagbok** — Variant B taggning → Balansmätare (planerad)

## 11. Navigation

- **Variant A (aktiv):** Heart i dock + bento
- **Variant B (planerad):** närmare Dagbok via taggning
