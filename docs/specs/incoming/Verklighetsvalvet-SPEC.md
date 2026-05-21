# Verklighetsvalvet-SPEC

Källa: extern planerings-AI. Konsoliderad till `.context/modules/verklighetsvalvet.md`.

## 1. Syfte och användarbehov

Sacred Feature — säker bevisbank (Lager 2). WORM-skydd (Write Once, Read Many) mot gaslighting: append-only, tidsstämplade sanningar. Komplexa bevis och känslomässiga observationer för att skydda verklighetsuppfattning.

## 2. Route och ingång

- **Route:** `/valv` (AuthGate)
- **Variant A (aktiv):** Shield/Fyren i FloatingDock — 3s long-press + PIN (WebAuthn planerat i prod)
- **Variant B (planerad):** Dold gest — long-press på Dagbok-ikon → `/valv`

## 3. UX-flöde (Progressive Disclosure)

Ett steg i taget vid stress/ångest:

1. **Ingång & auth** — 3s long-press → PIN
2. **Inmatningstyp** — Enkel, Tvåspalt, Trestegs-sköld, Magkänsel
3. **Trestegs-sköld** — vad händer / vad känner jag / hur vill jag att det ska vara
4. **Tvåspalt** — hens version vs min verklighet/fakta
5. **Magkänsel** — knappar (tunga axlar, klump i magen, svårt att andas) + valfri notering
6. **Spara** — append-only till `reality_vault`
7. **Stäng** — tillbaka till Lager 1 (`/dagbok` i kod idag)
8. **Panik** — shake (`useShakeToKill`) → `/`

**Planerat:** Bifoga media (skärmdump), röst-memo, PDF-export (Dossier).

## 4. Visuell design (Obsidian Calm)

Canonical: [`docs/specs/design-master.md`](../design-master.md)

- Bakgrund `#020617`, yta `#0f172a` + glass blur
- Guld `#FDE68A`, Fortsätt indigo `#818CF8`, spara emerald `#2DD4BF`
- Outfit + Inter
- Förbjudet: lila, turkos, regnbåge, naturteman, ljusa bakgrunder, count-up

## 5. Datamodell (Firestore, WORM)

Collection `reality_vault`: append-only via Security Rules + `assertWormPayload`.

Fält (utökade): `action`, `truth`, `category`, `entryType`, `theirVersion`, `myReality`, `bodySignals`, `shieldWhat`, `shieldFeeling`, `shieldBoundary`, `isLocked`, `serverTimestamp`, `weaverTags` (async).

Async från Dagbok: `weaveJournalEntry` → `category: vävaren_metadata`.

## 6. Backend och agenter

- **Callable:** `notifyNewFile` — Drive/webhook för inkommande skärmdumpar (webhook **planerad**)
- **Agenter:** Gemini/Genkit bearbetar bevis asynkront (planerat)

## 7. Säkerhet

- Kill Switch + shake → rensa state, navigera hem
- Zero Footprint: formulär rensas vid timeout/bakgrund (delvis — vault session via store)
- CMEK (drift)
- Auth: PIN dev; WebAuthn prod (**partial** — client MVP)

## 8. Status idag vs planerat

**Idag:** VaultPage, PIN, Fyren 3s, VaultEntryForm (enkel/tvåspalt/tresteg/magkänsel), VaultLogList, WORM client guard, Stäng → `/dagbok`, shake → `/`.

**Planerat:** Media-uppladdning, röst-memo, PDF/Dossier-export, `notifyNewFile`-webhook, Variant B (long-press Dagbok), full WebAuthn prod.

*(Extern spec listade tvåspalt/tresteg/magkänsel som "ska byggas" — det är **implementerat** i `VaultEntryForm.tsx`.)*

## 9. Acceptanskriterier

1. Firestore Rules blockerar `update`/`delete` på `reality_vault`
2. Shake rensar formulär och navigerar till `/` under ~500 ms
3. Tvåspalt + skärmdump/röst-memo sparbar (media **planerat**)
4. PDF-export med tidsstämpel, text och mediareferenser (**planerat**)

## 10. Kopplingar

- **Dagbok** — Vävaren async metadata; Variant B dold ingång
- **Speglings-Systemet** — EvidenceCompare hämtar WORM-bevis härifrån
- **Kunskap/Kampspår** — RAG via valvdata (indirekt, ej egen collection-write från valv-UI)

## 11. Navigation

- **Variant A (aktiv):** Egen Shield-ikon, 3s long-press
- **Variant B (planerad):** Shield bort; long-press Dagbok → `/valv`
