# Unlock — UI Polish V4 ×10 (refine-only, hela appen)

```yaml
approved: yes
date: 2026-07-22
scope: ui-polish-v4-x10
authority: Pontus plan-approve «UI Polish × 10 — hela appen»
iterations: 10
waves_per_iteration: 12
```

## Purpose

Standing unlock for **visual/a11y refine only** across locked UI modules for ten full circuits (W0–W11 × I1–I10):

- Contrast: `text-text-dim` → `text-text-muted` on body/lead/labels (navy/glass AA)
- Touch ≥ 44px, `:focus-visible`, `:focus-within`
- `prefers-reduced-motion` / `prefers-reduced-transparency`
- aria-label on icon buttons; 320px scroll; token rhythm; empty/loading; motion tokens; micro-typography
- Overlay debt → DS Modal/Sheet where prod (no flow change)

## MUST NOT in this unlock

- No layout/route/flow redesign
- No dock/compass/header structure change
- No WORM / firestore.rules / Sacred logic / deploy
- No removal of locked UX features

## Modules covered (diff guard)

MOD-CORE-NAV · MOD-CORE-CHROME · MOD-CORE-UTV · MOD-CORE-MINNE · MOD-HJ-DAGBOK · MOD-HJ-SPEGLAR · MOD-HJ-INPUT · MOD-VALV-HUB · MOD-VALV-ORKESTER · MOD-VALV-INKAST · MOD-VARD-PLAN · MOD-VARD-MABRA · MOD-VARD-LAUNCH · MOD-VARD-EKO · MOD-VARD-ARB · MOD-FAM-HUB · MOD-FAM-BARN · MOD-FAM-INCIDENT · MOD-FAM-HAMN · MOD-FAM-DROG · MOD-WIDGET · MOD-SHARED-MEDIA

## Wave geography (fixed each iteration)

| Wave | Surface |
|------|---------|
| W0 | Baseline smoke:design-debt |
| W1 | Chrome (Header/Dock/Drawer/Resurser/Fyren) — CSS/a11y only |
| W2 | Hem |
| W3 | Vardagen (Kompasser + Ekonomi) |
| W4 | MåBra depth + SOS |
| W5 | Planering + Projekt |
| W6 | Arbetsliv |
| W7 | Hjärtat |
| W8 | Familjen (all 6 tabs) |
| W9 | Valvet UI only |
| W10 | Widgets + Companion |
| W11 | Inställningar / Barnporten / Kompis / overlay residual |

## Depth ladder

I1 contrast+44px · I2 focus-visible · I3 focus-within · I4 reduced-motion/transparency · I5 aria · I6 320px · I7 tokens · I8 empty/loading · I9 motion · I10 micro-typography

## Re-lock

Modules remain `locked`; this doc authorizes refine-only diffs until program Done after I10.

## Verification (per wave minimum)

```bash
npm run build
npm run smoke:locked-ux
npm run smoke:design-modules
```

Plus zone smokes; W0 + end of each iteration: `smoke:design-debt`.
