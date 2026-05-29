# V1 — Valv zon-navigation (wireframe)

**Status:** Referens — kod: `vaultTabs.ts`, `VaultPage.tsx`, `getVaultZoneTabBarItems()`  
**Datum:** 2026-05-30

## Zon-flöde

```
Valv (PIN)
├── [Samla]     logga · sok
├── [Analysera] monster · orkester  ← LÅST UX
├── [Kunskap]   kunskapsbank · aktorskarta
├── [Exportera] dossier
└── [Forensik]  hamn_analys · speglar_fordjupat · …
```

Max 5 zoner synliga i tab bar; underflikar per zon (befintligt).

## Handoff-copy

| Situation | UI pekar till |
|-----------|----------------|
| Första Grey Rock / BIFF-svar | `/hamn` (ingen PIN) |
| Spara som bevis, DCAP, triage | Valv → Samla |
| Mönster över tid | Valv → Analysera |
| RAG fakta | Valv → Kunskapsbank (PIN) |
| Djup Hamn-analys | Valv → Forensik → hamn_analys |

**MUST NOT:** kräva PIN för första `/hamn`-svar; ta bort Mönster/Orkester.

## Vävaren polish (nästa Cursor-pass)

- Kort ingress på `VaultPage` zon-byte (1 rad lågaffektiv copy)
- Breadcrumb: `VaultValvBreadcrumb` — redan synkad
