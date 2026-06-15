# Superhub v2 — leveransrapport

**Datum:** 2026-06-01  
**Scope:** Supersidor, capture, Draft Layer, Kill Switch bort, domänanalys

---

## Levererat

| Område | Status |
|--------|--------|
| PMIR | [`2026-06-01-superhub-PMIR.md`](2026-06-01-superhub-PMIR.md) |
| Domänanalys covert narcissism | [`2026-06-01-superhub-domän-covert-narcissism.md`](2026-06-01-superhub-domän-covert-narcissism.md) |
| IA-deep (4 st) | `2026-06-01-superhub-{liv,familj,hem-capture,arkiv}-deep.md` |
| IA-spec | [`2026-06-01-superhub-IA-spec.md`](2026-06-01-superhub-IA-spec.md) |
| Capture modul | `src/modules/capture/` — `submitCaptureDraft` + DraftQueue |
| Wire capture | Hem · Planering inkorg dual-write · Hamn BIFF · Dagbok snabb (känsligt) |
| VaultOverviewPanel | `VaultSamlaHub` — granskning + lokala utkast |
| Shell-sidor | `/liv`, `/familj` |
| Drawer 4 rader | Hem · Liv och göra · Familj och gränser · Inställningar — [`MENU-DRAWER-KANON.md`](../design/references/MENU-DRAWER-KANON.md) |
| Gren | `feat/superhub-v2` (referens; implementation på `main`) |
| Kill Switch bort | Filer raderade; `clearDeviceSession` + Inställningar; Speglar localStorage + Rensa |
| Draft Layer | IndexedDB + Device Clear |
| Logout → invalidateSession | `authService.ts` |
| inboxClassifier heuristik | sourceModule hamn/familj, barn/ex-signaler |

---

## Smoke

| Kommando | Resultat |
|----------|----------|
| `npm run build` | PASS |
| `functions npm run build` | PASS |
| `npm run smoke:locked-ux` | PASS |
| `npm run smoke:orkester` | PASS |
| `npm run smoke:design-modules` | PASS |
| `npm run smoke:arbetsliv` | PASS (efter script-uppdatering) |

---

## Domän-checklista (manuell)

- [ ] Hem → CapturePanel → sortering till rätt silo
- [ ] `/familj` default Reflektion / Barnfokus
- [ ] Hamn under Familj-flik → BIFF + spara bevis
- [ ] Barnlogg utan konflikttext i Barnen-silo
- [ ] Inställningar → Rensa enheten
- [ ] Utloggning rensar server-cache
- [ ] Legacy `/mabra`, `/hamn`, `/familjen` redirectar korrekt

---

## Deploy

```bash
cd functions && npm run build
cd .. && npm run build
firebase deploy --only hosting,functions:submitInkastLite
```

---

## Oförändrat låst

Barnfokus · Mönster · Orkester · P3 Kanban · Barnporten HITL · tre silos · WORM · Fyren-gate
