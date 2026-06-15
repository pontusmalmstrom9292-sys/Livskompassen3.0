# Fas 24 — polish-våg (ej P0) — 2026-06-15

**Status:** **done** (kod + smoke 2026-06-15) · App Check Console = **USER**

## Scope levererat

| Spår | Leverans | Smoke |
|------|----------|-------|
| **24.1 Hex P2** | Barnporten zon-gradient → CSS tokens (`barnporten.css`) | `smoke:design-modules` **PASS** |
| **24.1 Hex P2** | Dossier print-HTML → `DOSSIER_PRINT_STYLES` + `exportDossierPrint.ts` | static guards **PASS** |
| **24.2 typecheck** | `tsconfig.core-strict.json` + `archive/`, `lifeJournal/diary/`, `features/diary/` | `typecheck:core-strict` **0 fel** |
| **24.3 App Check** | Kod redan fail-closed (Fas 14B/18) — Console Enforce kvar USER | se nedan |

## Kodändringar

### Barnporten zon-gradient
- `barnporten.css` — `--barnporten-bg-top`, `--barnporten-bg-bottom`, `--barnporten-surface`, `--barnporten-qr-dark`, `--barnporten-qr-light`, `.barnporten-qr-panel`; tokens på `.barnporten-page` + `.barnporten-zone`
- `BarnportenPage.tsx` — borttagen inline `from-[#1a1410] to-[#0a1614]`
- `BarnportenQrPanel.tsx` — QR-färger via CSS tokens (`getComputedStyle`), panel `barnporten-qr-panel` (Familjen-fliken)
- Theme override: `J-barnporten-ljus`

### Dossier print (Valv-zon)
- `secureExport.ts` — `DOSSIER_PRINT_STYLES` (centraliserad juridisk utskrift)
- `dossier/utils/exportDossierPrint.ts` — `buildDossierPrintHtml`, `printDossierFallback`
- `DossierPage.tsx` — fallback använder util (ingen inline hex i komponenten)

### typecheck:core-strict steg 3
Utökad `include`:
- `src/modules/features/archive/**`
- `src/modules/features/lifeJournal/diary/**`
- `src/modules/features/diary/**`

## App Check Console Enforce (USER)

Kod + `APP_CHECK_ENFORCE=true` redan på plats. Extra lager i Console:

1. [Firebase Console → App Check](https://console.firebase.google.com/project/gen-lang-client-0481875058/appcheck)
2. Cloud Functions → **Enforce**
3. Manuell prod-smoke: inloggning → MåBra / Kunskap / Valv (inga `failed-precondition`)

Se [`docs/evaluations/2026-06-15-fas14b-appcheck-enforce.md`](./2026-06-15-fas14b-appcheck-enforce.md).

## MUST NOT (efterlevnad)

- M3.0-C Fitness/Näring — ej påbörjad
- cross-RAG — ej rört
- Sacred / locked UX — `smoke:locked-ux` **PASS**

## Verifiering

```bash
npm run typecheck:core-strict   # 0 fel
npm run build                   # PASS
npm run smoke:design-modules    # PASS (Fas 24 P2 guards)
npm run smoke:locked-ux         # PASS
```

**Deploy:** frontend-only — `firebase deploy --only hosting` efter Pontus OK.
