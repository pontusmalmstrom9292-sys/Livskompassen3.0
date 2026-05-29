# Barnporten — modulplan

**Spec:** [`docs/design/BARNPORTEN-SPEC.md`](../../../docs/design/BARNPORTEN-SPEC.md)  
**Låst:** `.context/locked-ux-features.md` §3–5

## P1 — BYGGS

**UI-kanon:** `docs/design/references/BARNPORTEN-HUB-KANON.png` (2×2 kort, guldlinjer 2px)

- [x] `BarnportenPage.tsx` — barn-UI hub (4 kort enligt kanon)
- [x] `BarnportenWidget.tsx` — CB1 stjärn-prick (P2)
- [x] `saveChildrenLog` → `children_logs` (`category: barnporten*`)
- [x] Familjen: flik **Barnporten** + inkorg + HITL (`SaveAsEvidencePrompt`)
- [x] `BarnportenOrkesterPanel.tsx` (förälder) → länk Valv
- [x] PWA manifest `public/barnporten-manifest.webmanifest`
- [x] Route `/barnporten`

## P2 — IDÉ

- [x] CB1 widget (`BarnportenWidget` + `/widget/barnporten`)
- QR enhetskoppling, push, CB2–CB4, offline-kö

## Data

- Primär: `children_logs` (WORM, silo 3)
- Valv: endast via HITL `reality_vault` + `sourceRef`
