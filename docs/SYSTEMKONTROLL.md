# Systemkontroll — röda tråden, säkerhet och fas

**Syfte:** När det känns rörigt — ett ställe att starta, färdiga analysprompter, och var sanningen bor. Du behöver inte minnas hela projektet; kör en analys och spara resultatet.

**Senast uppdaterad:** 2026-05-23

---

## När ska du använda detta?

| Situation | Kör analys |
|-----------|------------|
| "Har vi tappat något viktigt?" | **A** Helhetsstatus |
| Deploy eller mycket kod ändrats | **B** Sacred Features + säkerhet |
| Osäker på moln vs dokumentation | **C** GCP live-synk |
| Grunder / Life OS / silos känns oklara | **D** Grunder (U1–U5) |
| Många filer, kladd, flera chattar | **E** Kaos → samlad rapport |

**Ett steg i taget:** Välj **en** bokstav. Klistra in prompten i Cursor (`Cmd + I`). Spara svaret enligt [Var sparas resultat?](#var-sparas-resultat) nedan.

---

## Start här — kanon (läs inte allt, peka bara)

| Tier | Fil | Vad den säger |
|------|-----|----------------|
| **0 — Fas & prioritering** | [`.context/system-plan.md`](../.context/system-plan.md) | Vilken fas, vad som är klart / öppet |
| **1 — Säkerhet & Sacred** | [`.context/security.md`](../.context/security.md) | Layered Defense, WORM, silos, Kill Switch |
| **1b — Yttre lugnet / Inre försvaret** | [`specs/ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md`](./specs/ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md) | UI-skiljning Lager 1 vs 2, Orkestern, Mönstersökaren (G18–G21) |
| **2 — Minne & silos** | [`.context/arkiv-minne.md`](../.context/arkiv-minne.md) | Permanent minne, tre kunskapsytor |
| **2b — Drive → Kunskap** | [`DRIVE_AUTOMATION.md`](./DRIVE_AUTOMATION.md), `npm run drive:wireup` | Inbox/Vault webhook, `DRIVE_INGEST_OWNER_UID` |
| **3 — Live moln** | [`GCP-INVENTORY-LATEST.md`](./GCP-INVENTORY-LATEST.md) | Functions, indexes, secrets (ersätter arkiv) |
| **4 — Implementation kö** | [`specs/modules/Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md) | `kör [GAP]` — vad som är open/done |
| **5 — Senaste grunder** | [`archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md`](./archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md) | U1–U5 PASS/GAP (2026-05-22) |
| **6 — Manuell smoke** | [`SMOKE_CHECKLIST.md`](./SMOKE_CHECKLIST.md) | 17 tester efter deploy |
| **7 — Dokumentindex** | [`README.md`](./README.md) | Alla länkar tier 1–4 |

**Röda tråden i en mening:** DCAP före LLM · tre silor (Kunskap / Valv / Barnen) · WORM på bevis · Zero Footprint + Kill Switch · inga LLM-beslut om auth eller ägarskap.

---

## Sacred Features — snabbregister

Verifiera mot kod + [`SMOKE_CHECKLIST.md`](./SMOKE_CHECKLIST.md). Detaljer i [`.context/security.md`](../.context/security.md).

| Feature | Route / mekanism | Collection / callable |
|---------|------------------|------------------------|
| Verklighetsvalvet | Shield 3s → PIN/WebAuthn → `/valv` | `reality_vault` WORM |
| Sanningens Sköld | Samma som valv — create-only | Firestore rules |
| Morgonkompassen | `/kompasser` | `checkins` |
| Dossier-Generator | wizard + export | `generateDossier` → `dossier_snapshots` |
| Speglings-Systemet | `/speglar` | `speglingsMirror`, Zero Footprint session |
| Zero Footprint | blur / timeout / logout | `invalidateSession`, synapse clear |
| Kill Switch | skaka ≥15 m/s² | → `/`, session rensad |

**Permanent minne (får inte raderas av retention):** `children_logs`, `reality_vault`, `journal`, `dossier_snapshots`.

---

## Var sparas resultat?

Efter varje analys: spara en **ny** fil (lägg inte över gamla utvärderingar).

```
docs/evaluations/YYYY-MM-DD-[A|B|C|D|E]-kort-namn.md
```

**Mall för rapportfil:**

```markdown
# Systemkontroll — [A/B/C/D/E] — YYYY-MM-DD

**Trigger:** (varför du körde)
**Källor lästa:** (lista filer)

## Sammanfattning (3–5 rader)

## PASS

## GAP / risk

## Rekommenderat nästa steg (max 1)

## Blocker
```

Skapa mappen `docs/evaluations/` vid behov. Historik: [`archive/evaluations-2026-05/`](./archive/evaluations-2026-05/).

---

## Färdiga prompter för Cursor

Kopiera **hela** blocket inklusive källistan. Använd `Cmd + I` (inline) eller `Cmd + L` (agent).

---

### A — Helhetsstatus (fas, röda tråden, vad som är öppet)

```
Du är Editorial Technical Architect för Livskompassen v2.

Läs och jämför (read-only):
- .context/system-plan.md
- .context/security.md
- .context/arkiv-minne.md
- docs/GCP-INVENTORY-LATEST.md
- docs/specs/modules/Arkiv-GAP-REGISTER.md
- AGENTS.md

Leverera en rapport på svenska:
1) Aktuell fas enligt system-plan (checkboxar som fortfarande är [ ])
2) Röda tråden — stämmer runtime (DCAP, silos, WORM, Zero Footprint) mot dokumentation?
3) Sacred Features — finns alla sju kvar i kod/routes/rules? (tabell PASS/GAP)
4) Top 3 öppna GAP (G9–G14 eller system-plan [ ])
5) Ett enda rekommenderat nästa steg

Spara inte filer själv — ge markdown jag kan klistra in i docs/evaluations/YYYY-MM-DD-A-helhetsstatus.md

Jämför mot hela projektets kontext. Arbeta autonomt och sluta inte förrän rapporten är komplett och verifierad mot kod (grep/read), inte bara docs.
```

---

### B — Sacred Features + Layered Defense (efter deploy eller stor ändring)

```
Du är Editorial Technical Architect. Read-only säkerhetsaudit.

Källor:
- .context/security.md
- firestore.rules
- functions/src/index.ts (callables, auth)
- src: Zero Footprint, Kill Switch, AuthGate, Verklighetsvalvet, Safe Harbor
- docs/SMOKE_CHECKLIST.md

Rapport:
1) Layered Defense lager 1–7 — PASS/GAP per lager med fil:rad
2) Sacred Features-tabell (7 st) — PASS/GAP + hur verifiera (smoke #)
3) Tre silor — någon cross-RAG eller fel collection i callables?
4) WORM — vilka collections har update/delete:false i rules?
5) Förbjudet som hittats (mock auth, LLM auth, prompts utanför sharedRules.ts)

Ingen kodändring. Markdown för docs/evaluations/YYYY-MM-DD-B-sacred-security.md

Jämför mot hela projektets kontext. Arbeta autonomt och sluta inte förrän alla sju Sacred Features är kontrollerade i kod.
```

---

### C — GCP live vs dokumentation (drift)

```
Read-only GCP-drift audit för Livskompassen.

Jämför:
- docs/GCP-INVENTORY-LATEST.md
- docs/GCP-KONSOLIDERING-BESLUT.md
- docs/specs/modules/Arkiv-GAP-REGISTER.md (G1–G14 status)
- firebase.json, .firebaserc
- functions/src/index.ts exports

Om möjligt: firebase functions:list / gcloud (beskriv kommando, kör om du har åtkomst).

Rapport:
1) Functions i docs vs deployad lista — match/mismatch
2) GAP-register G1–G14 — stämmer status med inventering?
3) Secrets/env som dokumentation säger saknas men kod-defaults använder
4) En drift-lista: "dokument säger X, kod/moln säger Y"
5) Ett rekommenderat steg (uppdatera doc ELLER deploy ELLER inget)

Markdown för docs/evaluations/YYYY-MM-DD-C-gcp-drift.md

Jämför mot hela projektets kontext. Arbeta autonomt och sluta inte förrän drift-listan är explicit.
```

---

### D — Grunder / Life OS (U1–U5)

```
Read-only Grunder-utvärdering (uppdatering av U1–U5).

Källor:
- docs/specs/modules/GRUNDER-SYSTEMET-ANALYS.md
- docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md (baseline)
- functions/src/agents/, sharedRules.ts, kompis-supervisor, runExecutor
- .context/arkiv-minne.md

För varje U1–U5: PASS / GAP / fil:rad-bevis.
Jämför mot baseline 2026-05-22 — vad är nytt sedan dess?

Markdown för docs/evaluations/YYYY-MM-DD-D-grunder.md

Jämför mot hela projektets kontext. Arbeta autonomt och sluta inte förrän U1–U5 alla har status.
```

---

### E — Kaos → samlad orientering (många ändringar / flera chattar)

```
Jag känner att projektet är rörigt. Syntetisera UTAN att implementera kod.

Läs:
- .context/system-plan.md
- docs/README.md
- git log -20 --oneline (senaste commits)
- git status / diff --stat (ostadigt arbete)

Leverera ETT orienteringsdokument:
1) Var är vi i fas? (1 mening)
2) Vad ändrades senast (commits + unstaged)?
3) Vad är fortfarande sanning (3–5 filer att lita på)
4) Vad är troligen föråldrat eller duplicerat (max 5 punkter)
5) Sacred Features — snabb PASS/GAP
6) Exakt ETT nästa steg jag ska göra manuellt

Markdown för docs/evaluations/YYYY-MM-DD-E-kaos.md

Jämför mot hela projektets kontext. Arbeta autonomt och sluta inte förrän orienteringen är actionable med ett steg.
```

---

## Manuell koll (utan AI) — 5 minuter

Kör när du vill dubbelkolla utan Cursor:

1. **Bygg:** `cd functions && npm run build && cd .. && npm run build` — ska exit 0.
2. **Fas:** Öppna [`.context/system-plan.md`](../.context/system-plan.md) — sök `[ ]` (öppna punkter).
3. **Smoke:** [`SMOKE_CHECKLIST.md`](./SMOKE_CHECKLIST.md) — minst #1–7 om du använt appen nyligen.
4. **GAP:** [`Arkiv-GAP-REGISTER.md`](./specs/modules/Arkiv-GAP-REGISTER.md) — rader med status **open**.
5. **Resultat:** [`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md) — senaste körning.

---

## Systemplan — vad betyder "vi är fortfarande där"?

| Du menar | Kolla här |
|---------|-----------|
| Fas 1–2 cleanup/moduler | `system-plan.md` — sektionerna Fas 1, Fas 2, Kladd-konsolidering |
| Fas 3 Firebase deploy | `system-plan.md` — Fas 3, `[ ]` smoke / notifyNewFile |
| Arkiv / minne / Vector | `system-plan.md` — "Permanent minne", "Idag (live)" |
| GCP Fas 4 | [`GCP-FAS4-RUNBOOK.md`](./GCP-FAS4-RUNBOOK.md) |
| Produkt-MVP klar per modul | [`src/modules/README.md`](../src/modules/README.md) + respektive `*-SPEC.md` |

**Aktuell huvudfas (2026-05-22):** Fas 2–3 i stort sett klara; öppet: manuell smoke, opt-in minne-ingest, G9–G14 Life OS. Se live-rader i `system-plan.md` under "Idag" och "Kommande fas".

---

## Relaterade kommandon (terminal)

| Syfte | Kommando |
|-------|----------|
| Lokal app | `npm run dev` → http://localhost:5173 |
| Functions build | `cd functions && npm run build` |
| Lint | `npx eslint .` |
| Smoke script (om finns) | se `package.json` scripts + `docs/SMOKE_RESULTS.md` |

---

## Underhåll av detta dokument

Uppdatera **datum överst** när:
- en ny standardanalys (A–E) läggs till,
- Sacred Features eller system-plan ändrar fas,
- `docs/evaluations/` får ny mallbehov.

**Ägare:** du + Cursor — ingen automatisk sync.
