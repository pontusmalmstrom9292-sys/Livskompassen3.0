# Dagbok-SPEC

Källa: extern planerings-AI. Konsoliderad till `.context/modules/dagbokshubben.md`.

## 1. Syfte och användarbehov

En tacksamhets- och reflektionsdagbok med låg kognitiv belastning. Fungerar som appens "ansikte utåt" (Lager 1) och erbjuder en lugn, officiell yta för reflektion. Trygg zon, helt skild från det tyngre, dolda bevisvalvet.

## 2. Route och ingång

- **Route:** `/dagbok` (AuthGate)
- **Ingång:** FloatingDock (BookOpen-ikon) eller HomePage bento-grid

## 3. UX-flöde (Progressive Disclosure)

Wizarden visar ett steg i taget. Arkivet döljs under steg 2–4.

1. **Humör** — piller: Lugn, Trött, Spänd, Hoppfull, Låg
2. **Text** — fritext eller röst-till-text (sv-SE)
3. **Bekräfta** — granska inlägget
4. **Sparad** — bekräftelse + bro: *"Känns det som gaslighting? → /speglar"*

## 4. Visuell design (Obsidian Calm)

Canonical: [`docs/specs/design-master.md`](../design-master.md)

- Bakgrund `#020617`, yta `#0f172a` + glass blur
- Stegindikator: guld `#FDE68A` aktiv, emerald `#2DD4BF` spara/klar
- Fortsätt: indigo `#818CF8`
- Typografi: Outfit + Inter
- Förbjudet: ljusa bakgrunder, lila, turkos, naturbilder

## 5. Datamodell (Firestore, WORM)

Collection `journal`: fält `mood`, `text`, `userId`, `ownerId`, `createdAt`. Append-only (WORM).

Async efter save: `weaveJournalEntry` → `reality_vault` (`category: vävaren_metadata`) — inte direkt till Kampspår-collection.

## 6. Backend och agenter

Ingen blockerande agent i UI. Callable `weaveJournalEntry` (fire-and-forget) efter save.

## 7. Säkerhet

- AuthGate
- Zero Footprint: wizard-state nollställs efter save och vid unmount/kill switch

## 8. Status idag vs planerat

**Idag:** Wizard humör→text→bekräfta→sparad, journal, humör-pills, weaveJournalEntry, arkiv max 5, bro till `/speglar` (copy avviker något från spec).

**Planerat:** Röst-till-text, full tidslinje, exakt gaslighting-copy, Variant B long-press dagbok→valv, wizard cleanup unmount, Fortsätt-knapp indigo.

## 9. Acceptanskriterier

1. Web Speech API (sv-SE) i text-steg
2. Efter sparad: "Känns det som gaslighting? → Gå till Speglings-systemet"
3. Obegränsad kronologisk tidslinje (pagination vid >5)
4. Wizard-state nollställs vid unmount
5. Variant B: long-press dagbok-ikon → `/valv`

## 10. Kopplingar

- **Verklighetsvalvet** — Vävaren-metadata i bakgrunden; Variant B dold ingång
- **Speglings-Systemet** — direktlänk från sparad-steg

## 11. Navigation

- **Variant A (aktiv):** separata ikoner Dagbok + Valv (Shield 3s)
- **Variant B (planerad):** endast Dagbok i dock; long-press → valv
