# Unlock — UI Polish v3 (refine-only, all zones)

```yaml
approved: yes
date: 2026-07-22
scope: ui-polish-v3
authority: Pontus plan-approve «UI Polish v3 — alla zoner (refine-only)»
```

## Purpose

Temporary unlock for **visual/a11y refine only** across locked modules touched by UI Polish v3:

- Contrast: `text-text-dim` → `text-text-muted` on body/lead/labels (navy/glass AA)
- Touch ≥ 44px, `:focus-visible`, `prefers-reduced-motion` / `prefers-reduced-transparency`
- QuickCaptureOverlay → DS Sheet (no flow change)
- Hem touch/focus/SOS discoverability (no dock/compass structure change)

## MUST NOT in this unlock

- No layout/route/flow redesign
- No WORM / rules / deploy
- No removal of locked UX features

## Modules touched (diff guard)

MOD-CORE-NAV · MOD-CORE-UTV · MOD-CORE-MINNE · MOD-HJ-DAGBOK · MOD-HJ-SPEGLAR · MOD-VALV-ORKESTER · MOD-VARD-PLAN · MOD-FAM-HUB · MOD-FAM-BARN · MOD-FAM-INCIDENT · MOD-FAM-HAMN · MOD-FAM-DROG · MOD-WIDGET · MOD-SHARED-MEDIA

## Re-lock

After smoke PASS on touched areas, leave modules `locked`; this doc covers the polish diff until commit.

## Verification

- `smoke:design-debt` — adHocDialog **2** (QuickCapture migrated)
- `smoke:locked-ux` · `smoke:design-modules` · `smoke:mabra` · `smoke:planering-superhub` · `smoke:children` · `smoke:widgets`
