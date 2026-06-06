# Ditt nästa steg — manuell smoke (ett ark)

**Prod:** https://gen-lang-client-0481875058.web.app  
**Före test:** Cmd+Shift+R  
**Statusplan:** [`2026-06-01-master-yolo-status.md`](./2026-06-01-master-yolo-status.md) (kö done · Fas 5D PMIR SKIP)

Agent har kört kod + statisk smoke. **Du** bekräftar i riktig app.

---

## A — Valv (#3)

1. Shield 3 s → PIN → Dagbok bevis  
2. Spara en enkel post  
3. Firestore Console: rad i `reality_vault` (valfritt)

**PASS / FAIL:** ___________

---

## B — Barnen (#4)

1. `/familjen` eller `/barnporten`  
2. Spara en loggrad  

**PASS / FAIL:** ___________

---

## C — Dagbok bilaga (#2d)

1. Dagbok → Reflektera → liten bilaga (&lt;5 MB)  

**PASS / FAIL:** ___________

---

## D — Superhub (snabb)

| Test | PASS? |
|------|-------|
| Drawer: Hem · Liv · Familj · Inställningar | **PASS** |
| `/liv` → MåBra / Planering | **PASS** |
| `/familjen` → Barnfokus-känsla | **PASS** |
| Legacy `/mabra` redirectar | **PASS** |

Kanon: [`2026-06-01-superhub-leverans.md`](./2026-06-01-superhub-leverans.md)

---

## E — Göra (efter deploy)

1. Liv → Planering → **Handling** (kanban)  
2. Länkar **Fokus / Framsteg / Regler** (inte dubbel TabBar för Handling/Inkorg)

**PASS / FAIL:** **PASS** (2026-06-07)

---

## F — Projekt regler (ny 2026-06-01)

1. `/projekt/regler` — logga in  
2. **+ Lägg till regel** → spara → ladda om sidan (regeln kvar)  

**PASS / FAIL:** **PASS** (2026-06-07)

---

## Rapportera till Cursor

Skriv: `Fas 5A: #3 PASS, #4 PASS` (eller vilka som FAIL) — agent uppdaterar [`SMOKE_RESULTS.md`](../SMOKE_RESULTS.md).

Detaljer: [`2026-05-31-fas5a-user-checklist.md`](./2026-05-31-fas5a-user-checklist.md)
