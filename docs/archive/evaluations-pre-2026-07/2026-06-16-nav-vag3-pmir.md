# PMIR — Nav Våg 3 (H1–H4)

**Datum:** 2026-06-16  
**Gren:** `main`  
**Kanon:** [`2026-06-16-supermodule-ui-masterplan.md`](./2026-06-16-supermodule-ui-masterplan.md) · [`2026-06-15-arkitektur-nav-analys.md`](./2026-06-15-arkitektur-nav-analys.md)

---

## Scope (godkänd implementation)

| ID | Legacy | Ny destination | Risk |
|----|--------|----------------|------|
| **H1** | `/ekonomi`, `/ekonomi/avancerad` | `/vardagen?tab=ekonomi` | Låg — `EkonomiInputSuperModule` redan på Vardagen |
| **H2** | `/mabra` (root) | `/vardagen?tab=mabra` | Låg — `/mabra/*` under-rutter behålls |
| **H3** | `/arkiv` | `/valvet?vaultTab=logga` | Medel — `ArchiveHub` depreceras; Valv WORM kvar |
| **H4** | `/liv?tab=drogfrihet`, launcher | `/familjen?tab=drogfrihet` | Låg — redan i `navTruth` |

**Launcher:** `livLauncherRoutes.ts` — `mabra` pekar nu på Vardagen-flik.

---

## Följer med till main

- `AppRoutes.tsx` — redirect-komponenter, borttagna direkta `/ekonomi` och `/arkiv` routes
- `livLauncherRoutes.ts` — MåBra launcher → Vardagen
- `RedirectLivToVardagen` — drogfrihet-tab till Familjen

---

## Försvinner (beteende)

| Route | Före | Efter |
|-------|------|-------|
| `/ekonomi` | `EconomyDashboard` fullsida | Redirect |
| `/arkiv` | `ArchiveHub` | Redirect till Valv logga |

**KEEP:** `EconomyDashboard` och `ArchiveHub` komponenter finns kvar i kodbas — endast routing ändrad.

---

## Locked UX

| § | Påverkan |
|---|----------|
| §14 Ekonomi SuperModule | **KEEP** — nås via Vardagen |
| §3 Planering hybrid | **KEEP** |
| Valv PIN | **KEEP** — `/arkiv` kräver Valv-upplåsning som övrig Valv-route |

---

## Smoke (obligatorisk)

```bash
npm run build
npm run smoke:locked-ux
npm run smoke:design-modules
npm run smoke:mabra
```

---

## Rekommendation

- [x] Implementera redirects (2026-06-16)
- [x] Smoke PASS (build, locked-ux, design-modules, mabra)
- [x] Uppdatera `LIFE-OS-BUILD-STATE.md` — Våg 3

**Pontus:** godkänn merge när smoke grön.
