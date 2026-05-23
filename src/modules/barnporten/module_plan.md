# Barnporten — modulplan

**Spec:** [`docs/design/BARNPORTEN-SPEC.md`](../../../docs/design/BARNPORTEN-SPEC.md)  
**Låst:** `.context/locked-ux-features.md` §3–5

## P1 — BYGGS

- [ ] `BarnportenPage.tsx` — barn-UI hub (4 kort)
- [ ] `BarnportenWidget.tsx` — CB1 stjärn-prick
- [ ] `BarnportenKompisPanel.tsx` — barn-Orkester
- [ ] `saveBarnportenLog` → `children_logs` (`authorRole: 'child'`, `channel: 'barnporten'`)
- [ ] Familjen: flik **Barnporten** + inkorg + `promoteChildLogToVault` (HITL)
- [ ] `BarnportenOrkesterPanel.tsx` (förälder) → länk Valv
- [ ] PWA manifest `public/barnporten-manifest.webmanifest`
- [ ] `npm run smoke:locked-ux`

## P2 — IDÉ

- QR enhetskoppling, push, CB2–CB4, offline-kö

## Data

- Primär: `children_logs` (WORM, silo 3)
- Valv: endast via HITL `reality_vault` + `sourceRef`
