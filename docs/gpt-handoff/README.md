# GPT-handoff — RepoMix-paket för extern arkitekturgranskning

Fem kuraterade RepoMix-exportfiler för GPT (eller annan extern granskare). Fokus: **arkitektur, navigation, silos och AI-koppling** — inte dekorativa UI-komponenter.

**Senast uppdaterad:** 2026-06-15  
**Levande status:** [`docs/external-ai/LIFE-OS-BUILD-STATE.md`](../external-ai/LIFE-OS-BUILD-STATE.md) · CHECKPOINT CP-1–CP-4 PASS  
**Körplan:** [`docs/evaluations/2026-06-15-fas19-masterplan-v2.md`](../evaluations/2026-06-15-fas19-masterplan-v2.md)  
**Nav-analys (Våg A klar):** [`docs/evaluations/2026-06-15-arkitektur-nav-analys.md`](../evaluations/2026-06-15-arkitektur-nav-analys.md)

---

## Nuläge (kort)

| Område | Status 2026-06-15 |
|--------|-------------------|
| WORM + Valv-säkerhet | **LOCK** (CP-1, `smoke:valv-security`) |
| Locked UX §11–17 | **LOCK** (`smoke:locked-ux`) |
| G10 Inkast backend + UI | **LOCK** (CP-3, CP-4) |
| Nav Våg A (F1, F2, F4, F5) | **Implementerad + deployad** |
| Nav Våg B (H1–H4) | **Öppen** — kräver PMIR |
| Upload unified (Valv DirectPanel) | **WIP** — defer till steg 2 |
| Fas 19.2–19.6 (MåBra hybrid-8, hex→tokens, …) | **Planerad** — se masterplan |

---

## Läsordning

| Steg | Pack | Fil | När |
|------|------|-----|-----|
| 1 | Arkitektur | `exports/gpt-handoff/repomix/gpt-pack-01-arkitektur.md` | **Börja här** |
| 2 | Valvet | `gpt-pack-02-valvet.md` | Efter pack 1 |
| 3 | Planering | `gpt-pack-03-planering.md` | Efter pack 2 |
| 4 | Hjärtat | `gpt-pack-04-hjartat.md` | Senare |
| 5 | Familjen | `gpt-pack-05-familjen.md` | Senare |

Efter pack 01: använd [03-GPT-FORTSATTNING-PROMPT.md](./03-GPT-FORTSATTNING-PROMPT.md) för **Våg B**-beslut (PMIR).

---

## Generera packs

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0

# Endast arkitektur (rekommenderat först)
npm run gpt-handoff:pack:01

# Valvet eller planering
npm run gpt-handoff:pack:02
npm run gpt-handoff:pack:03

# Alla fem
npm run gpt-handoff:pack:all
```

Genererade filer hamnar i `exports/gpt-handoff/repomix/` (gitignored). Kör `pack:all` efter större arkitekturändringar så token-storlek i tabellen nedan stämmer.

Pack 01 inkluderar sedan 2026-06-15 även: `capture/`, `inkast/`, Fas-19-eval, arkitektur-nav-analys och `LIFE-OS-BUILD-STATE`.

### Ungefärlig storlek (tokens)

| Pack | Tokens (ca) | Filer (ca) | Notering |
|------|-------------|------------|----------|
| 01 Arkitektur | ~170k | 129 | + inkast/capture + eval-docs |
| 02 Valvet | ~133k | 110 | + inkast callables + upload SPEC |
| 03 Planering | ~71k | 83 | oförändrad kärna |
| 04 Hjärtat | ~21k | 74 | komprimerad |
| 05 Familjen | ~33k | 99 | komprimerad |

---

## Kartläggning: GPT-termer → Livskompassen

| GPT förväntar | Faktiskt i repo |
|---|---|
| `BottomNav` | `FloatingDock.tsx` + `DockNavButton.tsx` |
| `AppShell` | Inline i `App.tsx` |
| `Router` | `AppRoutes.tsx` |
| `/features/vault` | `src/modules/features/lifeJournal/evidence/vault/` |
| `/planering` | `src/modules/features/admin/planning/` |
| Zon-paths | `navTruth.ts` → `/hjartat`, `/vardagen`, `/familjen`, `/valvet` |
| Inkast / Smart capture | `src/modules/capture/` + `src/modules/inkast/` + `submitInkastLite` |

### Dock (efter Våg A 2026-06-15)

| Slot | Label | Route |
|------|-------|-------|
| 1 | Liv och göra | `/vardagen` |
| 2 | Familjen | `/familjen` |
| 3 | **Hjärtat** (tidigare "Dagbok") | `/hjartat` |
| 4 | Handling | `/planering?tab=handling&picked=1` |

Launcher (`LivLauncherGrid`): **5 kort** — Handling borttagen (F1); Kanban nås via dock.

---

## Vad GPT ska verifiera (översikt)

### Pack 1 — Arkitektur
- Tre produktzoner + Valv-silo (`NAV_PATHS`, `AppRoutes`)
- Plausible deniability: Valv i drawer endast när `vaultSessionOpen`; Fyren visar **"Lås upp"** i publikt läge (F4)
- Tre silos: `knowledgeVaultQuery`, `valvChatQuery`, `childrenLogsQuery`
- WORM-signaler i types + `firestore.rules`
- Ingen cross-RAG: separata RAG-libs + route guards
- G10 Inkast: `CapturePanel` → `submitInkastLite` → DCAP-routing (ej auto-promote till Valv)

### Pack 2 — Valvet
- PIN + WebAuthn + server session (`unlockVault` P0 — CP-1)
- WORM `reality_vault` — append-only
- HITL: `SaveAsEvidencePrompt` + `InkastBarnenValvBridge` — aldrig auto-promote barn→valv
- Låsta paneler: Mönster, Orkester, Aktörskarta, Kunskapsbank

### Pack 3 — Planering
- P3 Kanban fast på `/planering?tab=handling`
- Kognitiv grind via `evolution_hub` + `useCapacityGate`
- Paralys-panel vid låg kapacitet
- `picked=1` hoppar över modulväljare (F5)

### Pack 4 — Hjärtat
- Hub `/hjartat` — reflektion + speglar (legacy `/dagbok` redirect)
- Zero Footprint för speglar

### Pack 5 — Familjen
- Barnfokus låst (`BARNFOKUS_QUESTIONS`)
- Barnporten inkorg → Valv HITL
- `children_logs` WORM

---

## Klistra-in-prompter

| Pack | Prompt-fil |
|------|------------|
| 01 | [01-ARKITEKTUR-PROMPT.md](./01-ARKITEKTUR-PROMPT.md) |
| 02 | [02-VALVET-PROMPT.md](./02-VALVET-PROMPT.md) |
| 03 | [03-PLANERING-PROMPT.md](./03-PLANERING-PROMPT.md) |
| 04 | [04-HJARTAT-PROMPT.md](./04-HJARTAT-PROMPT.md) |
| 05 | [05-FAMILJEN-PROMPT.md](./05-FAMILJEN-PROMPT.md) |
| Våg B (efter 01) | [03-GPT-FORTSATTNING-PROMPT.md](./03-GPT-FORTSATTNING-PROMPT.md) |

---

## Relation till andra handoffs

| Pipeline | Syfte | Kommando |
|----------|-------|----------|
| **gpt-handoff** (denna) | Arkitektur, nav, silos, säkerhet | `npm run gpt-handoff:pack:all` |
| **gemini-handoff** | Modulvis design/innehåll | `npm run gemini:pack` |
| **chatbot-handoff** | UI-design + Obsidian Calm | `npm run chatbot:pack` |

Gemini påverkas inte av GPT-handoff. Delad kanon: `.context/locked-ux-features.md`, `docs/design/references/MENU-DRAWER-KANON.md`.
