# Modulutvärdering — Hamn + MåBra — 2026-05-23

**Moduler:** `safe_harbor` (`/hamn`), `mabra` (`/mabra`)  
**Syfte:** Akut trygg hamn (BIFF/Grey Rock) + proaktiv rehab (KBT/ACT/vagus)

---

## Sammanfattning

Hamn levererar **Safe Harbor MVP** med `analyzeMessage`, DCAP, Gräns-Arkitekten (G14) och avlång modulstack. MåBra är **fas 2f klar** (hub, akut, reframing, coach, Web Speech sv-SE). **partial:** `BiffTriagePanel` (D15/D23) untracked; Hamn laddning 1–5 (D7) saknas.

---

## Safe Harbor (`/hamn`)

| Feature | Status | Bevis |
|---------|--------|-------|
| BIFF-analys | **PASS** | `analyzeMessage`, BIFF card |
| Brusfilter | **PASS** | DCAP routing |
| Gräns-Arkitekten | **PASS** | G14, `smoke:grans` |
| HamnModuleStack | **PASS** | kompassråd + BIFF moduler |
| HITL notis | **PASS** | `dcap_alerts` + SafeHarbor UI |
| BiffTriagePanel | **partial** | fil untracked, ej i `SafeHarborPage` |
| Laddning 1–5 | **GAP** | `KOMPASS-MODUL-SPEC` P2 |

---

## MåBra (`/mabra`)

| Feature | Status | Bevis |
|---------|--------|-------|
| Hub (3 övningstyper) | **PASS** | D29 — breathing/grounding/reframing |
| 4-7-8 andning | **PASS** | `smoke:mabra` |
| Akut panic_rsd | **PASS** | `AkutLanding` |
| Reframing 4 steg | **PASS** | fas 2a |
| ACT ValuesCompass | **PASS** | fas 2d, `mabra_progress` |
| Coach callable opt-in | **PASS** | fas 2e, `mabraCoach` |
| Web Speech sv-SE | **PASS** | fas 2f, `SpeechMicRow` |
| Dagbok-bro `?from=mabra` | **PASS** | fas 2c |

---

## Data

| Collection | Regel | Modul |
|------------|-------|-------|
| `mabra_sessions` | WORM create | MåBra |
| `mabra_progress/{uid}` | update tillåten owner | MåBra |
| (ingen egen Hamn-collection) | — | Hamn stateless + DCAP cache |

---

## GAP

| GAP | Allvar | Åtgärd |
|-----|--------|--------|
| D15/D23 triage panel | Medel | Wire `BiffTriagePanel` i Hamn |
| D7 laddningsskala | Låg | P2 implementation |
| Ex-brus i Planering | Design lock | **MUST NOT** route ex-mail till planering |

---

## Rekommenderat nästa steg

Integrera `BiffTriagePanel` i `SafeHarborPage` under BIFF-modulen — ett UI-steg.

---

## Blocker

Ingen.
