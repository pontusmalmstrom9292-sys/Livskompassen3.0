# Grunder — utvärderingsunderagenter (read-only)

**Datum:** 2026-05-22  
**Källor:** Sorterade slides i [`grunder-slides/`](../grunder-slides/) (efter Fas A) · kanon [`GRUNDER-SYSTEMET-ANALYS.md`](./GRUNDER-SYSTEMET-ANALYS.md) (efter Fas C)  
**Syfte:** Mäta *var Livskompassen är* mot Grunder-materialet — **ingen implementation** i U1–U5, ingen deploy, inga secrets.

---

## GATE — starta inte U1–U5 förrän Fas A är klar

**Parent (Master Architect) ska ha levererat:**

| # | Leverans | Fil |
|---|----------|-----|
| A1 | Alla PNG + PDF analyserade och kategoriserade | [`grunder-slides/INVENTAR.md`](../grunder-slides/INVENTAR.md) |
| A2 | Filer flyttade till `grunder-slides/01-…` … `10-design/` | Fysiska mappar |
| A3 | Archive-stub med pekare | [`docs/archive/Grunder systemet för analys/README.md`](../../archive/Grunder%20systemet%20f%C3%B6r%20analys/README.md) |
| A4 | Användaren har sagt **OK** (explicit) | — |

Underagenter får **endast** läsa filer i sin tilldelade mapp + listade kodfiler — **inte** sortera om arkivet igen.

**Trigger Parent Fas A:** `kör grunder Fas A`  
**Trigger underagent:** `kör grunder U1` … `kör grunder U5` (en i taget)

---

## Underagent U1 — Hotvektorer

**Mapp (endast):** [`grunder-slides/05-hotvektorer/`](../grunder-slides/05-hotvektorer/)  
**Relaterat:** [`04-granssattning-mindmap/`](../grunder-slides/04-granssattning-mindmap/) om INVENTAR pekar dit

**Mål:** Bekräfta att manipulation/JADE/DARVO och injection-paritet är täckta i runtime (DCAP, Gräns-Arkitekten, Hamn).

**Filer (läs):**

- `functions/src/agents/DCAP.ts`
- `functions/src/sharedRules.ts` (`GRANS_ARKITEKTEN_SYSTEM_PROMPT`)
- `functions/src/agents/cards/index.ts` (Brusfiltret, BIFF-Skölden, Gräns-Arkitekten)
- Hamn/BIFF callable (t.ex. `analyzeMessage` i `functions/src/index.ts`)
- [`docs/specs/incoming/Valv-Chat-SPEC.md`](./Valv-Chat-SPEC.md) (om relevant)

**Kontroller:**

| # | Kriterium | PASS om |
|---|-----------|---------|
| U1.1 | DCAP körs före LLM-routing i Kompis | `kompis-supervisor.ts` anropar `analyzeDcap` före `adkOrchestrator` |
| U1.2 | Hög risk → BIFF/Grey Rock deterministiskt | `routeFromDcap` vid ALERT / riskScore ≥ 70 |
| U1.3 | Gräns-Arkitekten prompt nämner JADE/DARVO/gaslighting | `GRANS_ARKITEKTEN_SYSTEM_PROMPT` |
| U1.4 | Produktroller Brusfiltret + BIFF mappas till executor | `resolveExecutorId` → `grans_arkitekten` |
| U1.5 | Grunder-slide “indirect prompt injection ↔ projektion” dokumenterad | Notis i output (ej nödvändigtvis egen agent) |

**Output-format:**

```markdown
## U1 — Hotvektorer
- U1.1: PASS|FAIL — [fil:rad]
- ...
- GAP-lista: [korta punkter]
- Sammanfattning: [1 mening]
```

---

## Underagent U2 — Systemförsvar

**Mapp (endast):** [`grunder-slides/06-systemforsvar/`](../grunder-slides/06-systemforsvar/)

**Mål:** Circuit breaker, akut fara, human fallback — vad finns i DCAP/Kill Switch vs Grunder-slide.

**Filer (läs):**

- `functions/src/agents/DCAP.ts`
- `functions/src/agents/cards/index.ts` (`routeFromDcap`)
- `functions/src/agents/kompis-supervisor.ts`
- `functions/src/adk/synapses/synapseBus.ts` (`dcap_alert` stub)
- Zero Footprint / Kill Switch i frontend + [`security-firestore.mdc`](../../../.cursor/rules/security-firestore.mdc)

**Kontroller:**

| # | Kriterium | PASS om |
|---|-----------|---------|
| U2.1 | Akut hög risk bypassar “vanlig” coaching-väg | `routeFromDcap` ALERT → BIFF intent |
| U2.2 | Inga LLM-beslut om auth/data-ägarskap | Ingen prompt som “bestämmer åtkomst” |
| U2.3 | `dcap_alert` synaps status dokumenterad | stub vs live i synapseBus |
| U2.4 | Kill Switch / session clear dokumenterat | kompis `invalidateUserSession` + Zero Footprint-regel |
| U2.5 | Grunder “human fallback” vs prod | GAP-notis om eskalering saknas |

**Output-format:** prefix `U2`, samma struktur som U1.

---

## Underagent U3 — Life-OS och lager

**Mappar (endast):**

- [`grunder-slides/02-life-os-moduler/`](../grunder-slides/02-life-os-moduler/)
- [`grunder-slides/08-lager-offentligt-dolt/`](../grunder-slides/08-lager-offentligt-dolt/)
- [`grunder-slides/01-vision-os/`](../grunder-slides/01-vision-os/) (positionering)

**Mål:** Offentligt vs dolt lager, moduler, silo, WORM — stämmer mot routes och arkiv-minne.

**Filer (läs):**

- [`.context/arkiv-minne.md`](../../../.context/arkiv-minne.md)
- [`docs/specs/ai-prompts-moduler-master.md`](../ai-prompts-moduler-master.md)
- `firestore.rules` (WORM collections)
- `functions/src/lib/kampsparQueryRag.ts`, `functions/src/agents/valvChatAgent.ts`

**Kontroller:**

| # | Kriterium | PASS om |
|---|-----------|---------|
| U3.1 | Tre silor i kod (Kunskap / Valv / Barnen) | Separata query-vägar |
| U3.2 | WORM collections append-only | `firestore.rules` |
| U3.3 | Offentliga moduler (MåBra, vardagen) läser inte valv-RAG som standard | Route/module map |
| U3.4 | Automatiserat arkiv → `kb_docs` (ej reality_vault) | `driveIngestSynapse.ts` |
| U3.5 | Grunder-gamification (planta, flow-cirkel) | **avvisat** i spec — notera, implementera inte |

**Output-format:** prefix `U3`.

---

## Underagent U4 — Orkester och agenter

**Mappar (endast):**

- [`grunder-slides/03-multi-agent-vision/`](../grunder-slides/03-multi-agent-vision/)
- [`grunder-slides/04-granssattning-mindmap/`](../grunder-slides/04-granssattning-mindmap/)
- [`grunder-slides/07-governance/`](../grunder-slides/07-governance/) (Cursor/AI-styrning)

**Mål:** Kartlägg Grunder (Genkit-vision) vs runtime ADK + cards + sharedRules; lista konkreta GAP.

**Filer (läs):**

- `functions/src/agents/cards/index.ts`
- `functions/src/agents/kompis-supervisor.ts`
- `functions/src/adk/orchestrator.ts`
- `functions/src/adk/executors/runExecutor.ts`
- `functions/src/sharedRules.ts` (`AGENT_IDS`, `AGENT_SYSTEM_PROMPTS`)
- [`Vision-UTVARDERING-RESULTAT.md`](./Vision-UTVARDERING-RESULTAT.md) § B (jämför, duplicera inte)

**Kontroller:**

| # | Kriterium | PASS om |
|---|-----------|---------|
| U4.1 | ≥8 produktroller i `AvailableAgents` | Räkna cards |
| U4.2 | Exakt 2 executors i `resolveExecutorId` | livs_arkivarien, grans_arkitekten |
| U4.3 | Varje produktroll har dedikerad prompt i sharedRules | Ej fallback till KOMPIS utan motivering |
| U4.4 | Inga `.prompt`-filer i `functions/` | Grep = 0 |
| U4.5 | Genkit/Dotprompt från Grunder | **vision-only** — dokumenterat, ej migrerat |

**Output-format:** prefix `U4` + **prioriterad GAP-lista** (input till Fas C runtime).

---

## Underagent U5 — Barn och domän

**Mapp (endast):** [`grunder-slides/09-barn-domän/`](../grunder-slides/09-barn-domän/)

**Mål:** Parental alienation / barn-innehåll → Barnen-modul och Dossier — **ingen** cross-RAG till Kunskap/Valv.

**Filer (läs):**

- [`docs/specs/incoming/Barnen-SPEC.md`](./Barnen-SPEC.md)
- `firestore.rules` (`children_logs`)
- `src/modules/barnens_livsloggar/` (struktur)
- [`.cursor/skills/livskompassen-memory-silo-guard/SKILL.md`](../../../.cursor/skills/livskompassen-memory-silo-guard/SKILL.md)

**Kontroller:**

| # | Kriterium | PASS om |
|---|-----------|---------|
| U5.1 | `children_logs` WORM / owner-bound | `firestore.rules` |
| U5.2 | Ingen agent-RAG läser `children_logs` + `kampspar` i samma anrop | Grep/callable-granskning |
| U5.3 | Grunder PA-innehåll → spec/referens, inte ny autonom agent | Dokumentations-GAP |
| U5.4 | Dossier kan aggregera barn-data enligt spec | `generateDossier` / Barnen-SPEC |
| U5.5 | Barnfrågor i Kompis → rätt modul, inte Valv-ton | Routing-notis |

**Output-format:** prefix `U5`.

---

## Sammanställning (Parent — Fas C)

När U1–U5 klara:

1. Skapa/uppdatera [`GRUNDER-SYSTEMET-ANALYS.md`](./GRUNDER-SYSTEMET-ANALYS.md) (kanon per slide G01–Gxx).
2. Skapa [`GRUNDER-UTVARDERING-RESULTAT.md`](./GRUNDER-UTVARDERING-RESULTAT.md) (sammanfogat U1–U5).
3. Uppdatera [`Arkiv-GAP-REGISTER.md`](./Arkiv-GAP-REGISTER.md) endast om ny sanning.
4. Runtime-ändringar **endast** från U4/U2 GAP (t.ex. RSD-prompt, DCAP-trösklar).
5. **Ej** starta Genkit-migrering.

**Trigger Parent Fas C:** `kör grunder Fas C`
