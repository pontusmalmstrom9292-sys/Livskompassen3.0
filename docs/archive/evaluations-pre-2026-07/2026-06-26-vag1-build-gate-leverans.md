# Våg 1 — Build-gate leverans

**Datum:** 2026-06-26  
**Scope:** Core — build + e2e + smoke sync (ingen rules, ingen locked UX-borttagning)

## Ändringar

| Fil | Vad |
|-----|-----|
| `VaultLogList.tsx:92` | Ref-typ fix |
| `e2e/locked-ux-public.spec.ts` | Basta Design hero + meny-regex |
| `e2e/obsidian-calm-tokens.spec.ts` | `.home-page--basta-design` |
| `scripts/smoke_chrome_header.mjs` | Dock `Hjärtat` (DAD kanon) |

## Smoke (verifierat 2026-06-26)

| Gate | Resultat |
|------|----------|
| `npm run build` | **PASS** |
| `smoke:predeploy` | **PASS** |
| `smoke:e2e-locked-ux` | **PASS** (10/10) |

## Kvar

- Dirty tree: executive home-motion (9 filer)
- Fas 22.3 rules — PMIR
- P0 G85 7-dagars test

## Nästa

Våg 2: read-only backend audit (WORM, silos, DCAP).
