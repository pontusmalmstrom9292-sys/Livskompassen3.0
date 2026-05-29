# Barnporten — genomförbarhetsplan (Cursor, utan Vertex)

**Datum:** 2026-05-29  
**Metod:** Direkt läsning av repo + design-lock  
**Kanon:** [`docs/design/BARNPORTEN-SPEC.md`](../design/BARNPORTEN-SPEC.md) · [`docs/specs/modules/Barnen-SPEC.md`](../specs/modules/Barnen-SPEC.md)  
**Kod:** `src/modules/barnporten/` · `src/modules/family/children/`  
**Mall:** [`MALL-cursor-plan.md`](./MALL-cursor-plan.md)

---

## Slutsats

**Barnporten P1 är i stort sett live** — barn-hub 2×2, route `/barnporten`, Familjen-flik + inkorg + HITL, Orkester-panel, PWA manifest.

**Kvar:** Manuell smoke #3 · QR/Push CB2–CB4 = **P2+ idé**.

---

## REASONS (kort)

| | |
|---|---|
| **Requirements** | Barn egen hub; förälder inkorg; Valv endast HITL |
| **Entities** | `children_logs` WORM (silo 3); `authorRole: child` |
| **Approach** | Utöka widget P2; rör inte Barnfokus locked UX |
| **Structure** | `/barnporten` + `/familjen?tab=barnporten` |
| **Operations** | `saveChildrenLog`; `promoteChildLogToVault` HITL |
| **Norms** | Varm skymning; ingen juridisk monospace för barn |
| **Safeguards** | Aldrig auto-promote till Valv; ingen cross-RAG |

---

## Vad som redan fungerar

| Krav | Kod |
|------|-----|
| Barn-hub 4 kort | `BarnportenPage.tsx` |
| Route `/barnporten` | `AppRoutes.tsx` |
| children_logs WORM | `saveChildrenLog` |
| Familjen inkorg + HITL | Familjen Barnporten-flik, `SaveAsEvidencePrompt` |
| Orkester → Valv | `BarnportenOrkesterPanel` |
| PWA manifest | `public/barnporten-manifest.webmanifest` |
| Locked UX smoke | `smoke:locked-ux` PASS |

---

## Gap-analys (P1 vs kod)

| BARNPORTEN-SPEC P1 | Kod idag | Gap |
|--------------------|----------|-----|
| BarnportenPage 2×2 | Ja | **Ingen** |
| BarnportenWidget CB1 | Ja | **Ingen** (P2 done) |
| Familjen inkorg + HITL | Ja | **Ingen** |
| Barnporten-Orkester | Ja | Polish valfritt |
| QR enhetskoppling | Nej | **P2** |
| Push-notiser | Nej | **P2** |

---

## Bevaras (MUST NOT regress)

- Barnfokus på Familjen (`BarnfokusFraganPanel`) — locked UX
- Barn text **korsar aldrig** Kunskap-RAG eller Hamn
- Valv endast via förälder HITL
- `children_logs` append-only

---

## Fas 1.5 — Polish (ingen rules)

| # | Leverans |
|---|----------|
| 1 | Manuell test: barn-flöde → rad i `children_logs` |
| 2 | HITL: promote till `reality_vault` endast efter explicit godkännande |
| 3 | Orkester-panel copy/länk till Valv Mönster (locked tabs) |

---

## Fas 2 — Widget + enhet

- [x] `BarnportenWidget.tsx` CB1 stjärn-prick + `/widget/barnporten`
- QR-koppling, CB2–CB4, offline-kö

**Blocker:** produktbeslut widget-variant; manuell PWA-test på barnenhet.

---

## Acceptans (P1 stängning)

- [x] Hub + route + inkorg + HITL i kod
- [x] CB1 widget + saveBarnportenLog (`authorRole: child`)
- [ ] Manuell smoke Barnen (#3 i checklista)
- [x] `npm run smoke:locked-ux` PASS vid merge

---

## Acceptans (P2 CB1)

- [x] `BarnportenWidget` enkeltryck → `/barnporten`, långtryck snabb avsig
- [x] `/widget/barnporten` hemskärms-genväg
- [x] `npm run smoke:locked-ux` PASS

---

## Nästa steg

Svara **`kör manuell smoke #3`** för verifiering, eller **`kör Barnporten QR/P2+`** för enhetskoppling.
