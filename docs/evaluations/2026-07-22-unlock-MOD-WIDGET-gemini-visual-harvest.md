---
title: Unlock MOD-WIDGET — Gemini visual harvest (emblems)
module: MOD-WIDGET
locked_ux: §23
date: 2026-07-22
approved: yes
approver: Pontus
via: plan Gemini → Companion visual harvest
---

# Unlock — Gemini visual harvest

## Scope

Tillåt endast visuell dekoration från Gemini-mocken in i React Companion-pack:

1. src/widgets/art/ — FacetedCompassRose, LighthouseArtwork, LotusEmblem, Anchor3DEmblem
2. Wire in Compass / Beacon / SafeHarbor / DailyAnchor
3. Specular edge på .cw-card (tokeniserad)

## Not allowed

- Ersätta WIS / synk / galleri-App.tsx
- Nya pack-widgets
- Android RemoteViews SVG i denna våg
- Beteendeändringar

## Done when

- npm run smoke:companion-widgets
- npm run smoke:module-lock
- npm run smoke:locked-ux

## Applied

Visual harvest staged 2026-07-22 — art module + pack wire + specular.
