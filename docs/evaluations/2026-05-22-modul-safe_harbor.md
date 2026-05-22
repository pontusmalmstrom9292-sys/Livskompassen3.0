# Modul — safe_harbor

**Route:** `/hamn` | **Callable:** `analyzeMessage` (preferGransArkitekten)

## PASS

- BIFF-formulär via `analyzeMessage`
- G14 Gräns-Arkitekten routing `module: safe_harbor`
- Brusfilter + BIFF produktkort i A2A
- smoke:grans

## GAP

- **P0:** `analyzeMessage` client `ragContext` — påverkar Hamn
- DCAP prompt delvis utanför sharedRules

## Sacred / säkerhet

Grey Rock/BIFF via Gräns-Arkitekten. DCAP före LLM **PASS**; injection **GAP**.

## Rekommenderat

`npm run smoke:grans`. P0 ragContext-fix.
