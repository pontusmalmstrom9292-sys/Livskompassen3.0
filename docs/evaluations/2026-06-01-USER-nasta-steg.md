# Ditt nästa steg — manuell smoke (ett ark)

**Prod:** https://gen-lang-client-0481875058.web.app  
**Före test:** Cmd+Shift+R  
**Statusplan:** [`SENASTE-SAMMANFATTNING.md`](./SENASTE-SAMMANFATTNING.md)

Agent har kört kod + statisk smoke. **Du** bekräftar i riktig app.

---

## A — Valv (#3)

**Viktigt:** Valvet använder **biometri via Fyren** (3 s håll på Kompis-ögat) — **ingen numerisk PIN** i prod.

1. Logga in med Google (Konto-fliken)
2. **Håll Kompis-ögat 3 s** i headern → följ Touch ID / Face ID / Windows Hello  
   *Alternativ:* Gå till `/valvet` → tryck **Lås upp Valvet (biometri)**
3. Fliken **Arkiv** (logga) → spara en enkel post
4. Firestore Console: rad i `reality_vault` (valfritt)

**PASS / FAIL:** **FAIL** (2026-06-15) — kunde inte låsa upp / komma in.  
**Om FAIL igen:** notera exakt felmeddelande på skärmen (t.ex. «WebAuthn verifiering misslyckades»).

---

## B — Barnen (#4)

1. `/familjen?tab=livslogg` eller Barnporten-fliken
2. Spara en loggrad

**PASS / FAIL:** **FAIL** (2026-06-15) — scroll låste sig (halva sidan rörde sig). Fix deployad: en scroll-yta per flik.

---

## C — Dagbok bilaga (#2d)

1. Dagbok → Reflektera → liten bilaga (&lt;5 MB)

**PASS / FAIL:** **PASS** (2026-06-15)

---

## D — Superhub (snabb)

| Test | PASS? |
|------|-------|
| Drawer: Hem · Liv · Familj · Inställningar | **PASS** |
| `/liv` → MåBra / Planering | **PASS** |
| `/familjen` → Barnfokus-känsla | **PASS** |
| Legacy `/mabra` redirectar | **PASS** |

---

## E — Göra

**PASS** (2026-06-07)

---

## F — Projekt regler

**PASS** (2026-06-07)

---

## Rapportera till Cursor

Efter ny test: `USER smoke: A PASS/FAIL, B PASS/FAIL` — agent uppdaterar [`SMOKE_RESULTS.md`](../SMOKE_RESULTS.md).
