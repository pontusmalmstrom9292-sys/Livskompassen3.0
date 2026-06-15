# Planering — supermodul-research (2026-06-06)

**Källa:** [2026-05-31-hub-gora-analys.md](./2026-05-31-hub-gora-analys.md) · kanon [PLANERING-PROJEKT-HYBRID.md](../design/PLANERING-PROJEKT-HYBRID.md)

## Beslut

- **GoraModulValjare** — 5–6 kort med `ExamplePreviewCard` före första riktiga session
- **GoraSuperModule** — live Handling / Fokus / Framsteg (P3 Kanban orörd)
- **InkorgSuperModule** — `PlaneringSuperModule` + `InkorgPreviewSheet` (paste → granska → skapa)
- **VerktygDrawer** — Fokus, Framsteg, Regler, Inköpslista, Rutiner, Hub-layout

## Modulkarta (kort)

| Modul | Supermodul | Fas |
|-------|------------|-----|
| Kanban P3 | GoraSuperModule | P0 |
| Fokus / Framsteg | GoraSuperModule | P0 |
| Inkorg | PlaneringSuperModule + preview | P0–P1 |
| Projekt | `/projekt` (separat hub) | P0 länk |
| Regler | VerktygDrawer / pasteClassifier | P1–P2 |
| OAuth Gmail/Kalender | — | P3 separat eval |

## Faser

- **P0:** Modulväljare + previews + koppla live paneler
- **P1:** VerktygDrawer, URL:er `/planering`, Inkorg vs Inköpslista, preview sheet
- **P2:** microStep på kort, projectId-bro, regler utan mock, deterministisk matcher
- **P3:** OAuth — [2026-06-06-planering-oauth-eval.md](./2026-06-06-planering-oauth-eval.md)

## MUST NOT

- P3 Kanban / hybrid / widget lock
- LLM/RAG i planering
- Parallell SPEC utan kanonreferens

## Smoke

```bash
npm run build && npm run smoke:locked-ux && npm run smoke:design-modules
```
