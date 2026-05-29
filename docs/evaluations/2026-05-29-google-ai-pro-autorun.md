# Google AI Pro — repo autorun (2026-05-29)

**Typ:** Orkester-liknande batch (repo only)  
**Hoppade över:** NotebookLM-uppladdning, Deep Research, Flow (webb)  
**Git:** `main` · orkester @ 2026-05-29T20:23Z

---

## Steg 1 — `npm run google-ai-pro:pack`

**Status:** PASS (2× — före och efter INNEHALL-REGISTER-uppdatering)

| Mål | Innehåll |
|-----|----------|
| `exports/google-ai-pro/notebooklm/` | repomix-dagbok, ai-prompts-moduler-master, INNEHALL-REGISTER, arkiv-minne, dagbok-vertex-plan |
| `exports/google-ai-pro/drive-pack/Livskompassen/` | samma + DESIGN-LATHUND |

Manuell uppladdning till NotebookLM/Drive sker utanför repot.

---

## Steg 2 — `specialist-kunskap-seed` (FACT, U6)

**Fil:** [`docs/specs/modules/Kunskap-CONTENT-SEED.md`](../specs/modules/Kunskap-CONTENT-SEED.md)

| Åtgärd | Resultat |
|--------|----------|
| Granskning 001–020 + df-* | KEEP — inga REJECT |
| Ny batch **021–025** (autorun) | RSD, Zero Footprint, tre silor, delat schema, dagbok-taggar |
| [`INNEHALL-REGISTER.md`](../INNEHALL-REGISTER.md) | Tabell utökad 001–025 + df-* |

**Duplicat-notering (ej borttaget):** 005/006 ↔ 011/012 (BIFF/Grey Rock) — medveten komplettering IA Valv vs originalbatch.

**Ej gjort:** Ingest till `kampspar` — kräver mänsklig granskning + `seed_kampspar_profile.mjs`.

---

## Steg 3 — `npm run orkester:night`

**Status:** PASS (obligatoriska faser)

| Fas | Status |
|-----|--------|
| UX Guardian | PASS |
| Innehall U6 | PASS |
| Locked icons | PASS |
| ADK Weaver | PASS |
| Functions build | PASS |
| Frontend build | PASS |
| ESLint | SKIP_FAIL (optional) |

**Fix under körning (pre-existing):**

- `LivskompassMark.tsx` — borttagen korrupt URL på rad 1 (TS1344)
- `MainLayout.tsx` — `FyrenSmartWidgetBar` monterad (smoke:locked-ux)

Detaljer: [`2026-05-29-orkester-natt.md`](./2026-05-29-orkester-natt.md)

---

## Sammanfattning mot projektet

| Kanon | Verifierat |
|-------|------------|
| U1 tre silor | Seed 023 dokumenterar; smoke:orkester PASS |
| U6 FACT vs REFLECTION | 25 KEEP + df-*; smoke:innehall PASS |
| Locked UX / D1 | smoke:locked-ux + smoke:locked-icons PASS |
| Sacred / Zero Footprint | Seed 022; ej runtime-ändring |

---

## Nästa steg (1)

Exportera `kunskap-fact-001`–`025` till JSON-manifest och kör `node scripts/seed_kampspar_profile.mjs --dry-run` efter manuell granskning.

**Deploy:** Ej krävd denna batch (endast docs + minimal UX-fix).
