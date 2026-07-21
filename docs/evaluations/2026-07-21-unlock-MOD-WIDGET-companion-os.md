# Unlock — Companion Widget OS (bygge + permanent lås §23)

Date: 2026-07-21
approved: yes
Pontus OK: Cursor-chatt «se till så allt detta är låst och inte går att ta bort i framtiden detta är en låst del av projektet» 2026-07-21

## Modules

| Modul | Scope |
|-------|--------|
| MOD-WIDGET | Companion OS under `src/widgets/**`, Studio, HomeRail, Android Companion-chips, `smoke:companion-widgets` |
| MOD-CORE-NAV | Route `/installningar/widget-studio` + companion widget-routes (endast koppling) |
| MOD-CORE-CHROME | `CompanionHomeRail` på BastaDesign Hem (additiv) |

## Syfte

1. Leverera Companion Widget OS (10-pack + Studio + synk + Android).
2. **Lås permanent** som Locked UX §23 — får inte tas bort utan ny unlock + Pontus OK.

## MUST NOT

- Ta bort Barnfokus (§12), Valv Mönster/Orkester, Sacred `core/`, firestore.rules
- Cross-RAG via widget-transport
- `setInterval`-idle i WidgetSync

## Smoke

```bash
npm run smoke:companion-widgets
npm run smoke:locked-ux
npm run smoke:module-lock
```

## Efter merge

MOD-WIDGET förblir `status: locked`. Ny borttagning/omläggning kräver ny unlock-doc.
