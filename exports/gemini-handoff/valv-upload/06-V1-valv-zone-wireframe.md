# V1 — Valv zon-navigation (wireframe)

**Status:** Integrerad — `vaultTabs.ts`, `VaultPage.tsx`, `getVaultZoneTabBarItems()`  
**Gemini-svar:** [`V1-valv-gemini-svar.md`](./V1-valv-gemini-svar.md)

## Zon-flöde

```
Valv (PIN)
├── [Samla]     logga · sok
├── [Analysera] monster · orkester  ← LÅST UX
├── [Kunskap]   kunskapsbank · aktorskarta
├── [Exportera] dossier
└── [Forensik]  hamn_analys · speglar_fordjupat · …
```

Max 5 zoner i tab bar; underflikar per aktiv zon.

## Ingress (`VALV_ZONE_INGRESS`)

| Zon | Copy |
|-----|------|
| Samla | Samla in bevis och sök i loggen. |
| Analysera | Mönster och Orkester — över tid, inte i stunden. |
| Kunskap | Fakta bakom PIN: Kunskapsbank och Aktörskarta. |
| Exportera | Dossier för export och översikt. |
| Forensik | Hamn och fördjupad analys — ett steg i taget. |

## Handoff Hamn vs Valv

| Situation | UI |
|-----------|-----|
| Första Grey Rock / BIFF | `/hamn` (ingen PIN) |
| Spara bevis, triage | Valv → Samla |
| Mönster över tid | Valv → Analysera |
| RAG fakta | Valv → Kunskapsbank (PIN) |
| Djup Hamn-analys | Valv → Forensik → hamn_analys |
| /hamn?tab=analys | Redirect + PIN → hamn_analys |

**MUST NOT:** PIN för första `/hamn`; ta bort Mönster/Orkester.

## Vävaren polish

- **DONE:** zon-ingress, breadcrumb, villkorsstyrd panel-render
- **DONE:** sms-tråd bekräftelse i `VaultEntryForm`
- **DONE:** BBIC selectable i `DossierPage`
