# Fas 22.0 Pre-flight — Superprompt (Planläge)

**Användning:** `Cmd + L` → Planläge → klistra zon-prompt från tabell nedan.

**Kanon:** `.cursor/rules/fas22-masterplan-guard.mdc` · `docs/evaluations/2026-06-18-fas22-masterplan-v2.md`

## Gemensam mall (börja varje zon-prompt)

```
Du är Editorial Technical Architect för Livskompassen v2.
UPPDRAG: FAS 22 ZON-PREFLIGHT — READ-ONLY (ingen kod, filflytt, radering eller deploy).

Kanon (läs innan beslut):
- .context/system-plan.md · .context/locked-ux-features.md · .context/security.md · .context/domän-covert-narcissism.md
- docs/specs/modules/Arkiv-GAP-REGISTER.md · docs/INNEHALL-REGISTER.md · docs/content/CONTENT-WAVES.md
- docs/evaluations/2026-06-18-fas21-leverans.md · docs/evaluations/2026-06-18-fas22-masterplan-v2.md
- docs/evaluations/2026-06-18-mabra-3.0-c-pmir.md · docs/evaluations/2026-06-18-hamn-brusfilter-wizard-pmir.md
- docs/evaluations/2026-06-18-fas20-manual-pontus-gates.md

PMIR-stopp (oförändrade): firestore.rules · storage.rules · Barnporten kanon-UI · Gmail OAuth · Genkit V1 · mass-radering · Sacred/Locked UX borttagning.

Regler:
- Max 1 implementeringsvåg per zon (namnge våg-id t.ex. 22.x).
- Svåra val: 2–3 alternativ + tydlig REKOMMENDATION.
- Phase 2 Firestore får INTE smyga in utan egen PMIR-våg + blocker-doc vid stopp.
- Jämför mot hela projektets kontext. Arbeta autonomt tills beslutsmemo är komplett.
```

## Zon-prompts

| Zon | Output-fil |
|-----|------------|
| 1 Valv+Security | `docs/evaluations/2026-06-18-fas22-zone-valv-security.md` |
| 2 Hjärtat+Inkast | `docs/evaluations/2026-06-18-fas22-zone-hjartat-inkast.md` |
| 3 Vardagen | `docs/evaluations/2026-06-18-fas22-zone-vardagen.md` |
| 4 Familjen+Hamn | `docs/evaluations/2026-06-18-fas22-zone-familjen-hamn.md` |
| 5 Kunskap+U6 | `docs/evaluations/2026-06-18-fas22-zone-kunskap-innehall.md` |
| 6 Repo+arkiv | `docs/evaluations/2026-06-18-fas22-zone-repo-arkiv.md` |
| 7 Android | `docs/evaluations/2026-06-18-fas22-zone-android-platform.md` |

Efter 7 memos: syntes → `docs/evaluations/2026-06-18-fas22-masterplan-v2.md`.
