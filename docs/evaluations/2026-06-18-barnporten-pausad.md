# Beslut — Barn-PWA pausad (2026-06-18)

**Status:** Godkänd av Pontus  
**Flagga:** `BARNPORTEN_CHILD_PWA_ROLLOUT_ENABLED = false` i `barnportenRollout.ts`

## Vad det betyder

- Barnen får **ingen** aktiv PWA/widget på surfplattor just nu.
- **Familjen → Barnfokus + Livslogg** är kanalen för barnobservationer.
- **Ingen extra kostnad** — inga QR-kopplingar, **BP-PUSH byggs inte**.

## Vad som behålls (locked UX)

Kod raderas **inte**: HITL, inkorg, `/barnporten` visar paus-panel.

## Aktivera senare

Sätt `BARNPORTEN_CHILD_PWA_ROLLOUT_ENABLED = true` + smoke:locked-ux.
