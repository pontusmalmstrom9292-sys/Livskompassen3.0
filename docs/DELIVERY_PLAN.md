# DELIVERY PLAN — snabb leverans med låg risk

**Datum:** 2026-06-28  
**Scope:** Fas 24 + aktivt program Premium UI Polish (Phase 0)

## 1) Prioriterade milstolpar

1. **Stabilisera kvalitetssignal (nu)**
   - Baseline-körning för build/test/smoke dokumenterad.
   - PR-gate validerar smoke + typning + befintliga enhetstester.
2. **Färdigställ Phase 0-baseline**
   - Metrics i `docs/DASHBOARD.md` uppdaterade med faktiska värden.
   - Visual baseline (6 nyckelrutter) sparad för regressionskontroll.
3. **Minska designskuld i små batchar**
   - Fortsätt med in-flight Planering/Valv innan ny stor våg.
   - Batchvis migrering och verifiering enligt `docs/TODO.md`.
4. **Inför release-rytm**
   - Små PR:er med tydlig checklista och verifieringslogg i `docs/PROGRESS.md`.

## 2) Next up (konkret lista)

1. Kör `npm run quality:baseline` lokalt innan varje större wave.
2. Slutför TODO Phase 0-punkter för smoke + screenshots + dashboard-metrics.
3. Driv nästa UI-wave som separata PR:er (max 1–2 delområden per PR).
4. Kör `npm run smoke:predeploy:build` före merge till `main`.

## 3) Risker / blockers

- **Hög lint-skuld i repot:** nuvarande lint innehåller många legacyfel; hanteras i separata städ-PR:er för att undvika stor risk i feature-PR.
- **Stora diffar i UI-migrering:** risk för merge-konflikter och regressionsbrus; motverkas med små batchar + frekvent sync mot `main`.
- **Locked UX / PMIR-gränser:** förändringar i känsliga områden kräver explicit godkännande före merge.

## 4) Rekommenderad implementation-ordning

1. Governance + kvalitetssignal (smoke/test/typecheck)  
2. Baseline-mätning (Phase 0)  
3. In-flight Planering/Valv polish (små, isolerade PR:er)  
4. Design-system migration i batchar  
5. Release-candidate med full predeploy smoke

## 5) Definition of Done per steg

### Steg A — Kvalitetsgrund
- [ ] CI kör smoke + test + typecheck på PR mot `main`
- [ ] Lokal baseline-rutin är dokumenterad och körbar

### Steg B — Baseline Phase 0
- [ ] `docs/DASHBOARD.md` har uppdaterade baseline-metrics
- [ ] `docs/PROGRESS.md` innehåller verifieringsresultat (inte uppskattningar)

### Steg C — Batchleverans
- [ ] PR omfattar tydligt avgränsat område
- [ ] Relevanta smoke/checks är gröna
- [ ] Risker och uppföljning är dokumenterade i PR-beskrivning

### Steg D — Merge redo
- [ ] `npm run smoke:predeploy:build` passerar
- [ ] PMIR-känsliga ändringar (om några) har explicit godkännande
