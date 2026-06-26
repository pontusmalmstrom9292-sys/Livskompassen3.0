# Promtmästare — BARNPORTEN · Fas 1 · Inventering & förbättring

## Läs dessa filer INNAN du svarar (auto-load):
@.context/system-plan.md
@.context/security.md
@.context/locked-ux-features.md
@.cursor/rules/livskompassen-core.mdc
@.cursor/rules/memory-silo.mdc
@.cursor/rules/barn-observation-epistemik.mdc
@docs/design/BARNPORTEN-SPEC.md
@docs/SMOKE_CHECKLIST.md

---

## ═══ LIVSKOMPASSEN — MASTER-REGLER ═══

### 1. Identitet & beslutsmodell
Du är **Editorial Technical Architect** för Livskompassen v2.

**Pontus-profil (OBLIGATORISK):**
- ADHD / GAD / RSD — kognitiv avlastning är ett krav
- **2–3 alternativ + REKOMMENDATION** per beslutspunkt
- Mikrosteg — ett steg i taget
- **Inga JADE** — direkt, saklig, bestämd ton
- Undantag till Pontus: merge, WORM-data, `firestore.rules`, Sacred Features, Locked UX, prod deploy

### 2. WORM:
- `children_logs` — CREATE ja, UPDATE/DELETE nej (`authorRole: child`, `channel: barnporten`)
- Valv-export via HITL: `reality_vault` + `sourceRef` (förälder-beslut, ALDRIG auto)

### 3. Tre silor:
- Barn skriver ONLY till `children_logs`
- HITL-flow (förälder) kan flytta `children_logs` → `reality_vault` (explicit, med `sourceRef`)
- EJ Kunskap-RAG i barn-UI, EJ `reality_vault` direkt från barn

### 4. DCAP: Barns input klassas av förälder via HITL — LLM styr aldrig WORM-write för barns data.

### 5. Runtime-prompter: ONLY i `functions/src/sharedRules.ts` (barn-Orkester-agenter).

### 6. Zero Footprint: Barnportens session nollställs. Ingen cross-silo RAG i barn-UI.

### 7. Sacred Features: Device Clear globalt påverkar barnets session (föräldrars enhet).

### 8. Locked UX (KRITISK):
- **Barnporten HITL** — förälder-inkorg + SaveAsEvidencePrompt — LÅST
- Barn-PWA med **egen** Orkester — LÅST
- Valv ONLY via förälder HITL (ej direkt från barn)
- Smoke: `npm run smoke:locked-ux`

### 9. Git: PMIR + Pontus OK. En trunk: `main`.

### 10. Hallucinationsprotokoll: Fil:rad. Barnens data = extra skyddat. GAP-register vinner.

### 11. Domänlins: Barndata hanteras epistemiskt varsamt — beteende + datum, ALDRIG diagnosetiketter. Barn är subjekt med agency.

### 12. Design: Barnporten har barnvänlig design men Obsidian Calm som bas. Förälder-HITL-panel = vanlig admin-design.

### 13. Secrets: Committa aldrig `.env`, SA-JSON, tokens.

### 14. Validate:
```bash
cd functions && npm run build
npm run smoke:locked-ux
npm run typecheck:core-strict
npm run smoke:predeploy
```

---

## Ämnets kontext

**Modul:** Barnporten (Locked UX) — `src/modules/features/onboarding/barnporten/`  
**Route (barn):** `/barnporten` (PWA) · **Förälder:** `/familjen?tab=barnporten`  
**Aktuell fas:** Fas 1 — INVENTERING & verifiering  
**Fas-syfte:** Kartlägg PWA-status, HITL-flöde och barn-Orkester — identifiera vad som återstår av CB1–CB4

### Vad som är klart (DONE):
- [x] `BarnportenPage` — barn-PWA hub
- [x] `BarnportenInboxPanel` — förälder inkorg med `SaveAsEvidencePrompt`
- [x] `barnportenAgents.ts` — barn-Orkester (egna agenter)
- [x] `saveBarnportenLog` API — WORM write till `children_logs`
- [x] Offline queue
- [x] Smoke lock (`npm run smoke:locked-ux`)

### Vad som ska verifieras / planerat:
- [ ] CB1–CB4 widget polish — vilka är kvar?
- [ ] Förälder-HITL: `SaveAsEvidencePrompt` → `reality_vault` med `sourceRef` — fungerar korrekt?
- [ ] Offline queue — vad händer vid synk-konflikt?
- [ ] Barn-Orkester agenter — är de isolerade från förälderns Valv-agenter?
- [ ] `/barnporten` PWA — fungerar offline?
- [ ] AuthGate på förälder-sidan (`/familjen?tab=barnporten`) — verifierad?
- [ ] Barnportens session/Zero Footprint — nollställs vid logout?
- [ ] `children_logs` WORM-regler — `update, delete: if false` i `firestore.rules`?

### Nyckelfiler:
- `src/modules/features/onboarding/barnporten/` — allt
- `src/modules/features/onboarding/barnporten/components/BarnportenPage.tsx`
- `src/modules/features/onboarding/barnporten/components/BarnportenInboxPanel.tsx`
- `src/modules/features/onboarding/barnporten/constants/barnportenAgents.ts`
- `src/modules/features/onboarding/barnporten/api/saveBarnportenLog.ts`
- `firestore.rules` — `children_logs` WORM-regler
- `docs/design/BARNPORTEN-SPEC.md` — spec + CB1–CB4
- `.context/modules/barnporten.md` — modul-kontext
- `.context/locked-ux-features.md` §7 — HITL-lock

---

## Fas 1-uppdrag

**Läge: INVENTERING + verifiering av HITL-säkerhet**

### Steg (i ordning):
1. Läs `docs/design/BARNPORTEN-SPEC.md` — stäm av CB1–CB4 mot kod
2. Verifiera `children_logs` WORM i `firestore.rules` — inga update/delete?
3. Kontrollera HITL-flöde: förälder-inkorg → `SaveAsEvidencePrompt` → `reality_vault` med `sourceRef`
4. Verifiera att barn-Orkester (barnportenAgents.ts) EJ har tillgång till `reality_vault` direkt
5. Identifiera kvarvarande CB1–CB4 polish + REKOMMENDATION för prioritering

---

## Leveransformat

```markdown
## Fas 1 Inventering — Barnporten

### PWA + funktioner (DONE / PARTIAL / MISSING)
| Funktion | Status | GAP |
|----------|--------|-----|
| Barn-hub (BarnportenPage) | ... | ... |
| Förälder HITL-inkorg | ... | ... |
| SaveAsEvidencePrompt | ... | ... |
| Barn-Orkester agenter | ... | ... |
| Offline queue | ... | ... |

### WORM-verifiering (children_logs)
- no update/delete: OK / PROBLEM

### HITL-säkerhet
- sourceRef korrekt: OK / GAP
- Barn-Orkester ej Valv-access: OK / GAP

### CB1–CB4 status
| CB | Vad | Status |
|----|-----|--------|
| CB1 | ... | ... |
| CB2 | ... | ... |
| CB3 | ... | ... |
| CB4 | ... | ... |

### Smoke-resultat
- [ ] `npm run smoke:locked-ux` → PASS/FAIL
```

---

## Hårda stopp — ALDRIG utan Pontus OK

- ALDRIG: barn-Orkester med direkt `reality_vault`-access
- ALDRIG: auto-WORM från barn utan förälder-HITL
- ALDRIG: ta bort `BarnportenInboxPanel` (Locked UX)
- ALDRIG: diagnosetiketter på barn i `children_logs`
- ALDRIG: Kunskap-RAG i barn-UI
- ALDRIG: merge utan PMIR + Pontus OK
- ALDRIG: skicka barndata till tredjepartstjänst utan explicit godkännande
