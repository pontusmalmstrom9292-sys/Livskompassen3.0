# Multitask MT-2 γ — kompass-widget + ICS (2026-06-11)

**Trigger:** MT-2 agent γ (efter MT-1 commit `fe6e342`)  
**Gren:** `main` (lokal, ej pushad)

---

## Leverans

| Del | Status | Detalj |
|-----|--------|--------|
| **Kompass-widget P3** | **done** | `CompassQuickWidgetRail` i `HamnModuleStack` under Kompassråd |
| **Kompass-widget P4** | **done** | `CompassQuickWidgetRail` + `forcedFlow` på `/vardagen` (`LivLauncherPage`) |
| **ICS export** | **ready** | `exportPlaneringIcs.ts` oförändrad — smoke utökad; hosting deploy väntar |
| **smoke:compass** | **fix** | App Check debug token parity (`smoke_compass.mjs`) |

---

## Filer ändrade

- `src/modules/shell/LivLauncherPage.tsx`
- `src/modules/features/family/safeHarbor/components/HamnModuleStack.tsx`
- `scripts/smoke_design_modules.mjs`
- `scripts/smoke_planering_gora_e.mjs`
- `scripts/smoke_compass.mjs`

---

## Gate (ε delvis)

| Kommando | Resultat |
|----------|----------|
| `npm run build` | **PASS** |
| `smoke:design-modules` | **PASS** |
| `smoke:planering-gora-e` | **PASS** (inkl. ICS static) |
| `smoke:compass` | **PASS** |
| `smoke:hamn` | **PASS** |
| `smoke:locked-ux` | **PASS** |
| `smoke:orkester` | **PASS** |

---

## Nästa (MT-2 δ)

1. DCAP semantic → `functions/src/sharedRules.ts`
2. Legacy `vault` rules cleanup (efter Console-koll)
3. Hosting deploy (denna γ-batch)
4. MT-4: `npm run google-ai-pro:pack`
