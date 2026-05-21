# Dagbokshubben

**Route:** `/dagbok` · **AuthGate:** ja  
**Design:** [`docs/specs/design-master.md`](../../docs/specs/design-master.md) (Obsidian Calm, Riktning A)  
**Incoming spec:** [`docs/specs/incoming/Dagbok-SPEC.md`](../../docs/specs/incoming/Dagbok-SPEC.md)

---

## 1. Syfte och användarbehov

Lager 1 — tacksamhets- och reflektionsdagbok med låg kognitiv belastning. Appens lugna "ansikte utåt", skild från Verklighetsvalvet (Lager 2).

## 2. Route och ingång

| Variant | Ingång |
|---------|--------|
| **A (aktiv)** | FloatingDock BookOpen, HomePage bento |
| **B (planerad)** | Samma + long-press 3s på BookOpen → `/valv` |

## 3. UX-flöde

Progressive disclosure — ett steg i taget. Arkiv synligt endast på steg 1 (humör).

1. Humör — pills: Lugn, Trött, Spänd, Hoppfull, Låg  
2. Text — fritext (+ planerad röst sv-SE)  
3. Bekräfta — preview  
4. Sparad — bekräftelse, Ny post, bro till `/speglar`

## 4. Visuell design

- Bakgrund `#020617`, glass `#0f172a/60`
- Guld `#FDE68A` — aktiv pill, steg
- Indigo `#818CF8` — Fortsätt (polish kvar: ReflectionStep använder idag guld-accent)
- Emerald `#2DD4BF` — spara/klar
- Outfit + Inter

## 5. Datamodell

| Collection | Fält | WORM |
|------------|------|------|
| `journal` | mood, text, userId, ownerId, createdAt | ja (append-only) |

## 6. Backend

- `weaveJournalEntry` (callable) → `reality_vault`, `category: vävaren_metadata`
- Ingen blockerande agent i UI

## 7. Säkerhet

- AuthGate på route
- CMEK (drift)
- Zero Footprint: global vault/session; wizard cleanup vid unmount **planerad**

## 8. Status idag vs planerat

| Klart | Delvis | Planerat |
|-------|--------|----------|
| Wizard 4 steg | Bro `/speglar` (copy) | Röst-till-text sv-SE |
| journal + Firestore | Fortsätt indigo | Full tidslinje (>5 poster) |
| Humör-pills, stegindikator | | Wizard unmount cleanup |
| weaveJournalEntry | | Variant B long-press→valv |
| Arkiv max 5 | | DCAP→Speglings-Coachen |

## 9. Acceptanskriterier

| # | Kriterium | Kod-status |
|---|-----------|------------|
| 1 | Web Speech sv-SE i text-steg | **planned** |
| 2 | Gaslighting-länk efter sparad | **partial** — länk finns, copy ska matcha spec |
| 3 | Obegränsad tidslinje | **planned** |
| 4 | State reset vid unmount | **planned** |
| 5 | Long-press dagbok→valv (B) | **planned** |

## 10. Kopplingar

- **Verklighetsvalvet** — Vävaren async; Variant B dold route
- **Speglings-Systemet** — bro från SavedStep
- **Kunskap/Kampspår** — RAG via vävaren_metadata (indirekt)

## 11. Navigation

Se [`docs/specs/navigation-master.md`](../../docs/specs/navigation-master.md): Variant A aktiv.

## Kod

`src/modules/dagbok/` · plan: `src/modules/dagbok/module_plan.md`

## Gap — minimal nästa implementationsdiff

1. `hooks/useSpeechToText.ts` + mikrofon i `ReflectionStep`
2. `SavedStep` — spec-copy för speglar
3. `JournalArchive` — pagination eller ta bort limit 5
4. `useJournalFlow` — cleanup on unmount
5. `FloatingDock` — long-press BookOpen (endast vid Variant B-beslut)
