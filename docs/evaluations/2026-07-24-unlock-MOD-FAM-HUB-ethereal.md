# Unlock MOD-FAM-HUB — Ethereal Blue utan glow

Date: 2026-07-24
approved: yes
Pontus OK: Cursor-chatt «Familjen kategori guldig → samma blå utan glow» 2026-07-24

## Scope

- `familjen.css` — guldrim/bloom → Ethereal `#7BA3C9`, ingen yttre glow
- `FamiljenKunskapHubTab.tsx` / `ChildMomentStunderPanel.tsx` — gold → ethereal tokens
- Shared (utanför MOD-FAM-HUB): `obsidian-depth-mockup.css` pills, `gold-standard-hub-card.css`

## MUST NOT

- Locked UX borttagning (Barnfokus, flöden)
- WORM / rules / Sacred
- Redesign — endast färg/glow-polish

## Smoke

```bash
npm run smoke:locked-ux
npm run smoke:design-modules
npm run smoke:obsidian-depth
```

## Follow-up 2026-07-24 — bort dekorativa avatar-ringar

- `FamiljenZoneIntro`: tre `gs-hub-card__avatar` schema-ringar borttagna
- approved: yes (Pontus: «ta bort dem»)
