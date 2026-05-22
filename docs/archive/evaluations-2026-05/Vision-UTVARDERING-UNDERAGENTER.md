# Vision — utvärderingsunderagenter (read-only)

**Datum:** 2026-05-21  
**Syfte:** Mäta *var Livskompassen är* mot [`Vision-AI-Native-Blueprint.md`](./Vision-AI-Native-Blueprint.md) — **ingen implementation**, ingen deploy, inga secrets.

Kör en agent i taget. Rapportera PASS/FAIL per kriterium.

---

## Underagent A — Silo & WORM audit

**Mål:** Bekräfta att kod och rules inte bryter tre silor eller WORM.

**Filer (läs):**

- `firestore.rules`
- `functions/src/lib/kampsparQueryRag.ts`
- `functions/src/agents/valvChatAgent.ts` (eller valv RAG-väg)
- `.context/arkiv-minne.md` § Tre kunskapsytor
- `functions/src/index.ts` (exports: `knowledgeVaultQuery`, `valvChatQuery`)

**Kontroller:**

| # | Kriterium | PASS om |
|---|-----------|---------|
| A1 | `knowledgeVaultQuery` läser **inte** `reality_vault` som standard | Endast `kampspar` + `kb_docs` i RAG-lib |
| A2 | `valvChatQuery` läser **inte** `kampspar` | Endast `reality_vault` |
| A3 | WORM collections har `update/delete: false` | `reality_vault`, `journal`, `children_logs` |
| A4 | `retentionJob.ts` allowlist WORM | Kommentar/kod listar children_logs, reality_vault, journal, dossier |
| A5 | Drive ingest → `kb_docs` not `reality_vault` | `driveIngestSynapse.ts` |

**Output-format:**

```markdown
## A — Silo & WORM
- A1: PASS|FAIL — [fil:rad eller notis]
- ...
- Sammanfattning: [1 mening]
```

---

## Underagent B — Orkester & agenter

**Mål:** Kartlägg vision (Genkit Flow) vs runtime (ADK + callables + cards).

**Filer:**

- `functions/src/agents/cards/index.ts`
- `functions/src/agents/kompis-supervisor.ts`
- `functions/src/adk/orchestrator.ts`
- `functions/src/adk/synapses/synapseBus.ts`
- `functions/src/sharedRules.ts` (endast struktur, inte hela filen)
- [`Vision-AI-Native-Blueprint.md`](./Vision-AI-Native-Blueprint.md) § Orkester

**Kontroller:**

| # | Kriterium | PASS om |
|---|-----------|---------|
| B1 | ≥8 produktroller i `AvailableAgents` | Räkna cards |
| B2 | Exakt 2 executors i `resolveExecutorId` | livs_arkivarien, grans_arkitekten |
| B3 | `routeFromDcap` finns och anropas från supervisor | Deterministisk routing |
| B4 | Inga `.prompt`-filer i `functions/` | Grep `.prompt` = 0 |
| B5 | Synapser: 2 live, 2 stub dokumenterat | Matchar synapseBus |

**Output-format:** som A, prefix `B`.

---

## Underagent C — Infrastruktur sanning

**Mål:** Jämför docs mot molnet (eller instruera användaren om logg saknas).

**Filer:**

- `docs/archive/GCP-INVENTORY-2026-05-21.md`
- `.context/system-plan.md` § Permanent minne
- `functions/.env.gen-lang-client-0481875058` (om finns — **inga värden i rapport**)

**Kommandon (kör om åtkomst finns):**

```bash
firebase functions:list --project gen-lang-client-0481875058
gcloud ai index-endpoints list --region=europe-west1 --project=gen-lang-client-0481875058
```

**Om ingen logg:** skriv `BLOCKED — användaren kör inventeringsblocket från grund-plan` och lista vad som måste verifieras (valvChatQuery deployad, VECTOR env, endpoint count).

**Kontroller:**

| # | Kriterium | PASS om |
|---|-----------|---------|
| C1 | `valvChatQuery` i functions:list | Namn finns |
| C2 | ≥1 index-endpoint west1 | gcloud list ≥1 |
| C3 | system-plan och arkiv-minne **samma** G1/G2-status | Ingen motsägelse |
| C4 | Legacy Python fn noteras | 4 fn us-central1 eller avvecklade |

**Output:** skapa eller peka på `docs/GCP-INVENTORY-LATEST.md` om C körs fullt.

---

## Underagent D — Röda tråden i `.context/` och Cursor rules

**Mål:** Finns grundregler i rules/skills som agent träffar automatiskt?

**Filer:**

- `.cursor/rules/*.mdc`
- `.cursor/skills/livskompassen-*`
- `AGENTS.md` (skills-tabell)
- `.context/arkiv-minne.md` § Röda tråden (peka på Vision-doc)

**Kontroller:**

| # | Kriterium | PASS om |
|---|-----------|---------|
| D1 | `livskompassen-core.mdc` alwaysApply | Finns |
| D2 | Dedikerad regel för **synapser** (`functions/src/adk/**`) | Finns `.mdc` med glob |
| D3 | Dedikerad regel för **silo/RAG** (`*Rag*`, valv) | Finns `.mdc` med glob |
| D4 | `AGENTS.md` länkar skills för RAG/silo/synapser | Tabell eller lista |
| D5 | Vision-doc länkad från `arkiv-minne.md` | Rad finns |

**Output:** lista **saknade** regler (filnamn-förslag), inte implementera.

---

## Sammanställning (parent-agent)

När A–D klara:

1. Uppdatera [`MIND-SAFE-vs-Livskompassen-DIFF.md`](./MIND-SAFE-vs-Livskompassen-DIFF.md) § Status utvärdering.
2. Uppdatera [`Arkiv-GAP-REGISTER.md`](./Arkiv-GAP-REGISTER.md) endast om C hittar ny sanning.
3. **Ej** starta Genkit-migrering.

**Trigger:** `kör vision-utvärdering A` (en bokstav i taget).
