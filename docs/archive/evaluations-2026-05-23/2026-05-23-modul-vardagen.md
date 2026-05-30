# Modulutvärdering — Vardagen — 2026-05-23

**Kluster:** Vardagen (`/vardagen`)  
**Moduler:** `kompasser`, `kompis`, `ekonomi`  
**Redirects:** `/kompasser`, `/kunskap`, `/ekonomi` → `/vardagen?tab=…`

---

## Sammanfattning

Vardagen samlar **daglig orientering** (kompasser), **kunskap/RAG** (kompis) och **ekonomi-MVP** (Firestore WORM). Kunskap har live Vector ANN (G2/G3 PASS). Ekonomi är doc-synkad men manuell smoke #18 återstår. **partial:** `KompassradPanel` (D3) untracked — Hamn har egen råd-text i `HamnModuleStack`.

---

## Modulstatus

| Modul | Tab / route | Data | Status |
|-------|-------------|------|--------|
| **kompasser** | default `/vardagen` | `checkins` WORM | **PASS** — `smoke:compass` |
| **kompis** | `?tab=kunskap` | `kampspar`, `kb_docs`, Tidshjul | **PASS** — `smoke:kunskap`, `smoke:tidshjul` |
| **ekonomi** | `?tab=ekonomi` | `transactions`, `economy_profiles` | **PASS** (kod) — smoke #18 öppen |

---

## Kompis / Kunskap

| Feature | Status | Bevis |
|---------|--------|-------|
| Tidshjulet live | **PASS** | G13, `subscribeKampsparEntries` |
| Entity registry G9 | **PASS** | `EntityRegistryCard`, `smoke:entities` |
| Inkorg G10 | **PASS** | `InboxQueueCard`, `smoke:inbox` |
| Context cache G12 | **PASS** | `smoke:cache` |
| Mock Kampspar isolerad G11 | **PASS** | `KompisUiKampsparTrack` UI-only |
| Fil-ingest | **PASS** | `KunskapsvalvFileIngest` |

---

## Kompasser

| Feature | Status | Bevis |
|---------|--------|-------|
| Morgon/Dag/Kväll | **PASS** | `CompassModuleStrip`, `compassFlows` |
| Paralys, KASAM | **PASS** | `ParalysPanel`, `KasamEvening` |
| Avlånga moduler (design) | **PASS** | `ElongatedModule`, `KOMPASS-MODUL-SPEC.md` |
| AuthGate | **PASS** | `VardagenPage` |

---

## Ekonomi

| Feature | Status | Bevis |
|---------|--------|-------|
| Snabbknappar (veckopeng m.fl.) | **PASS** | `EconomyPage` |
| WORM `transactions` | **PASS** | rules + retention allowlist |
| Ingen RAG/LLM i silo | **PASS** | ej i `index.ts` exports för ekonomi |
| Payslip vendor Fas 2 | **GAP** (avsiktlig) | `functions/src/economy/vendor/` ej UI |

---

## GAP

| GAP | Allvar | Åtgärd |
|-----|--------|--------|
| Manuell smoke #18 | Prod | SMOKE_CHECKLIST |
| Opt-in minne-ingest | Produkt | system-plan `[ ]` |
| D3 KompassradPanel | Låg | Commit eller merge med Hamn |

---

## Rekommenderat nästa steg

Kör manuell smoke #18: veckopeng → verifiera `transactions` i Firestore Console.

---

## Blocker

Ingen för daglig Vardagen-användning.
