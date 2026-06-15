# GPT-handoff — RepoMix-paket för extern arkitekturgranskning

Fem kuraterade RepoMix-exportfiler för GPT (eller annan extern granskare). Fokus: **arkitektur, navigation, silos och AI-koppling** — inte dekorativa UI-komponenter.

## Läsordning

| Steg | Pack | Fil | När |
|------|------|-----|-----|
| 1 | Arkitektur | `exports/gpt-handoff/repomix/gpt-pack-01-arkitektur.md` | **Börja här** |
| 2 | Valvet | `gpt-pack-02-valvet.md` | Efter pack 1 |
| 3 | Planering | `gpt-pack-03-planering.md` | Efter pack 2 |
| 4 | Hjärtat | `gpt-pack-04-hjartat.md` | Senare |
| 5 | Familjen | `gpt-pack-05-familjen.md` | Senare |

## Generera packs

```bash
# Endast arkitektur (rekommenderat först)
npm run gpt-handoff:pack:01

# Valvet eller planering
npm run gpt-handoff:pack:02
npm run gpt-handoff:pack:03

# Alla fem
npm run gpt-handoff:pack:all
```

Genererade filer hamnar i `exports/gpt-handoff/repomix/` (gitignored).

### Ungefärlig storlek (tokens)

| Pack | Tokens | Filer |
|------|--------|-------|
| 01 Arkitektur | ~133k | 103 |
| 02 Valvet | ~116k | 101 |
| 03 Planering | ~71k | 83 |
| 04 Hjärtat | ~21k | 74 |
| 05 Familjen | ~33k | 99 |

## Kartläggning: GPT-termer → Livskompassen

| GPT förväntar | Faktiskt i repo |
|---|---|
| `BottomNav` | `FloatingDock.tsx` + `DockNavButton.tsx` |
| `AppShell` | Inline i `App.tsx` |
| `Router` | `AppRoutes.tsx` |
| `/features/vault` | `src/modules/features/lifeJournal/evidence/vault/` |
| `/planering` | `src/modules/features/admin/planning/` |
| Zon-paths | `navTruth.ts` → `/hjartat`, `/vardagen`, `/familjen`, `/valvet` |

## Vad GPT ska verifiera (översikt)

### Pack 1 — Arkitektur
- Tre produktzoner + Valv-silo (`NAV_PATHS`, `AppRoutes`)
- Plausible deniability: Valv i drawer endast när `isVaultUnlocked` / `hasVaultGate()`
- Tre silos: `knowledgeVaultQuery`, `valvChatQuery`, `childrenLogsQuery`
- WORM-signaler i types + `firestore.rules`
- Ingen cross-RAG: separata RAG-libs + route guards

### Pack 2 — Valvet
- PIN + WebAuthn + server session
- WORM `reality_vault` — append-only
- HITL: `SaveAsEvidencePrompt` — aldrig auto-promote barn→valv
- Låsta paneler: Mönster, Orkester, Aktörskarta, Kunskapsbank

### Pack 3 — Planering
- P3 Kanban fast på `/planering`
- Kognitiv grind via `evolution_hub` + `useCapacityGate`
- Paralys-panel vid låg kapacitet

## Klistra-in-prompter

| Pack | Prompt-fil |
|------|------------|
| 01 | [01-ARKITEKTUR-PROMPT.md](./01-ARKITEKTUR-PROMPT.md) |
| 02 | [02-VALVET-PROMPT.md](./02-VALVET-PROMPT.md) |
| 03 | [03-PLANERING-PROMPT.md](./03-PLANERING-PROMPT.md) |
| 04 | [04-HJARTAT-PROMPT.md](./04-HJARTAT-PROMPT.md) |
| 05 | [05-FAMILJEN-PROMPT.md](./05-FAMILJEN-PROMPT.md) |
| Fortsättning GPT | [03-GPT-FORTSATTNING-PROMPT.md](./03-GPT-FORTSATTNING-PROMPT.md) · eval: [`2026-06-15-arkitektur-nav-analys.md`](../evaluations/2026-06-15-arkitektur-nav-analys.md) |

## Relation till gemini-handoff

Parallell pipeline — `npm run gemini:pack` påverkas inte. GPT-handoff är arkitektur-först; gemini-handoff är modulvis design/innehåll.
