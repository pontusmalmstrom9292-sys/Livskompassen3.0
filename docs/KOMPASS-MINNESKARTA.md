# Livskompassen — minneskarta (1 sida · utskrift)

**Version:** 2026-05-24 · **Gren:** `main` · **GitHub:** Livskompassen3.0

---

## 1. Var sanningen bor (läs detta först)

| Fråga | Fil |
|-------|-----|
| Var är vi i projektet? | `docs/evaluations/SENASTE-SAMMANFATTNING.md` |
| Git / push / grenar? | `docs/GIT-LATHUND.md` |
| Vilken modul gör vad? | `docs/MODUL-FUNKTIONS-REGISTER.md` |
| Rörigt / analys? | `docs/SYSTEMKONTROLL.md` |
| Teman & designbilder? | `docs/design/DESIGN-LATHUND.md` |
| Cursor-menyer (kub, …, Actions)? | `docs/CURSOR-MENY-LATHUND.md` |
| Merge / stäng gren? | `docs/MERGE-IMPACT-RAPPORT.md` (mall) |
| Grenstatus | `docs/BRANCH-KARTA.md` |

**Kod på Mac:** `~/StudioProjects/Livskompassen2.0` · **Moln:** `origin` = Livskompassen3.0 · **Aldrig pusha:** `origin-old`

---

## 2. Daglig rutin (3 steg)

1. `git checkout main` → `git pull --ff-only origin main`
2. Jobba i Cursor · spara (`Cmd + S`) · `npm run dev` → http://localhost:5173
3. Klart → *"Committa och pusha main"* (eller `npm run check:main-trunk`)

---

## 3. Undvik sidogrenar

| Gör | Gör inte |
|-----|----------|
| Alltid **`main`** | Ny branch för vardagsfix |
| Push **`origin`** (3.0) | Push `origin-old` · force push |
| Agent: *"Synka main — PMIR"* | Klicka "Publish Branch" utan att förstå |
| Stäng gren efter merge + ditt OK | Lämna `cursor/*` kvar på GitHub |

**Parked (rör ej utan beslut):** `feat/mabra-fragekort` m.fl. — se `BRANCH-KARTA.md`

---

## 4. Agenten hjälper dig

| Du säger | Agent gör |
|----------|-----------|
| *Synka main — PMIR* | Inventerar · följer med / försvinner · väntar på OK |
| *godkänn merge* | Merge · smoke · push |
| *Jobba med Familjen* | Fokus `src/modules/barnens_livsloggar/` |
| *check:main-trunk* | Branch + smoke (ingen push) |

**Regel (alltid i Cursor):** `.cursor/rules/git-main-trunk.mdc`

---

## 5. Öppet just nu (ej kod-städning)

| Punkt | Var |
|-------|-----|
| Manuell smoke #1–7, #18–22 | `docs/SMOKE_CHECKLIST.md` |
| Opt-in minne-ingest | `.context/system-plan.md` |
| Barnporten full PWA | `docs/design/BARNPORTEN-SPEC.md` |
| Mabra frågekort (beslut) | `feat/mabra-fragekort` — parked |

**Klart i kod:** G1–G16 · låst UX · `/planering` · Theme I · tre silos · Drive-sortering

---

## 6. Jobba med EN sida / modul

**Mönster:** Route → modulmapp → hub/flikar → en komponent per funktion

| Sida | Mapp | Route | Smoke |
|------|------|-------|-------|
| **Familjen / Barnen** | `src/modules/barnens_livsloggar/` | `/familjen` | `smoke:locked-ux`, `smoke:children` |
| Valv / bevis | `verklighetsvalvet/` + `valv_chatt/` | `/dagbok?tab=bevis` | `smoke:locked-ux`, `smoke:valv` |
| Hamn / BIFF | `safe_harbor/` | `/hamn` | `analyzeMessage` |
| Planering | `planering/` | `/planering` | `smoke:locked-ux` |
| MåBra | `mabra/` | `/mabra` | `smoke:mabra` |
| Kunskap / Kompis | `kompis/` | `/vardagen?tab=kunskap` | `smoke:kunskap` |
| Dagbok / Hjärtat | `dagbok/` + speglar | `/dagbok` | `smoke:speglar` |
| Hem / tema | `core/` | `/`, `/dev/themes` | `smoke:design-modules` |

**Innan du kodar en modul:** läs `src/modules/<namn>/README.md` + `docs/specs/modules/<Namn>-SPEC.md`

---

## 7. Tre silos (aldrig blanda AI-minne)

| Silo | Data | Backend |
|------|------|---------|
| Kunskap | `kampspar`, `kb_docs` | `knowledgeVaultQuery` |
| Valv | `reality_vault` | `valvChatQuery`, `analyzeMessage` |
| Barnen | `children_logs` | `childrenLogsQuery` |

**Drive →** `notifyNewFile` → självsortering → `kb_docs` (Kunskap-silo)

---

## 8. Låst UX (får inte tas bort)

Barnfokus (lära känna m.fl.) · Valv **Mönster** + **Orkester** · Planering kanban · Fyren widget · Barnporten-agents · sidomeny

Verifiera: `npm run smoke:locked-ux` · Register: `.context/locked-ux-features.md`

---

## 9. Sacred (säkerhet)

Verklighetsvalvet · Sanningens Sköld · Morgonkompassen · Dossier · Speglar · Zero Footprint · Kill Switch

`.context/security.md` — agent ändrar **inte** utan din explicit order.

---

## 10. Snabbkommandon

```bash
cd ~/StudioProjects/Livskompassen2.0
git checkout main && git pull --ff-only origin main
npm run dev
npm run check:main-trunk    # branch + smoke, ingen push
npm run smoke:locked-ux   # låst UX
```

---

**Alla lathundar:** [`LATHUND-INDEX.html`](./LATHUND-INDEX.html) · utskrift: [`KOMPASS-MINNESKARTA.html`](./KOMPASS-MINNESKARTA.html)

**Snygg visning:** Preview i Cursor (`⌘⇧V`) · utskrift: [`KOMPASS-MINNESKARTA.html`](./KOMPASS-MINNESKARTA.html) · alla: [`LATHUND-INDEX.html`](./LATHUND-INDEX.html)

*Skriv ut · lägg vid skärmen · börja varje session med rad 1 i §2*
