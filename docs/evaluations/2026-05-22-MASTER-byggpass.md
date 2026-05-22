# MASTER — 2-timmars byggpass — 2026-05-22

**Gren:** `audit-byggpass-2026-05-22`  
**Trigger:** Stärka mappstruktur, system, säkerhet; modul- och callable-audit

## Sammanfattning (5 rader)

Projektet är **deploybart och grönt** på build + 6 smoke-scripts. G1–G16 Life OS är **implementerat**; dokumentation synkad (GAP-tabell, security.md, NATT-CI). **Fyra P0-säkerhetsgap** kvar i runtime — viktigast: client `ragContext` i `analyzeMessage`. Struktur: frontend modulärt, backend `index.ts` monolit — REFACTOR planerad till `functions/src/callables/`.

## Rapporter (index)

| Fil | Innehåll |
|-----|----------|
| [A-helhetsstatus](2026-05-22-A-helhetsstatus.md) | Fas, Sacred, top GAP |
| [B-sacred-security](2026-05-22-B-sacred-security.md) | Layered Defense L1–L7 |
| [C-gcp-drift](2026-05-22-C-gcp-drift.md) | Docs vs moln |
| [E-kaos](2026-05-22-E-kaos.md) | Orientering |
| [F-callables-agents](2026-05-22-F-callables-agents.md) | 22 exports |
| [BUILD-LOG](2026-05-22-BUILD-LOG.md) | Build + smoke |
| Modul (11) | `2026-05-22-modul-*.md` |

## Top 5 GAP (prioritet)

| # | GAP | Prioritet |
|---|-----|-----------|
| 1 | ~~`analyzeMessage` client `ragContext`~~ | **done** 2026-05-22 |
| 2 | `notifyNewFile` obunden `ownerId` | **P0** |
| 3 | Valv/Barnen client-PIN (ej server/WebAuthn) | **P0** |
| 4 | DCAP prompt utanför `sharedRules.ts` | **P1** |
| 5 | Manuell smoke app #2/#4 + doc README "ej deployad" i moduler | **P2** |

## Moduler — PASS (11/11 runtime)

Alla moduler har MVP-kod + WORM/silo där relevant. README-drift ("ej deployad") i valv_chatt/verklighetsvalvet — kosmetiskt.

## Build / smoke

**Alla PASS** — se [BUILD-LOG](2026-05-22-BUILD-LOG.md).

## Doc-synk (utfört)

- `Arkiv-GAP-REGISTER.md` — G9–G14 **done**, G16 **done**
- `.context/security.md` — G7–G14 done, P0-tabell, Zero Footprint notis
- `scripts/README.md` — smoke-matris
- `docs/NATT-CI.md` — G6 blocker borttagen

## REFACTOR (pass 2, ej ikväll)

- `functions/src/callables/*.ts` — split `index.ts`
- Root-artefakter → `docs/archive/artifacts/`
- Uppdatera modul-README deploy-status

## Exakt ETT nästa implementeringssteg

**Säg i Cursor:** `kör P0-notifyOwnerId` — bind `notifyNewFile` `ownerId` till verifierad Drive/service identity (deploy `analyzeMessage` efter P0-ragContext).

---

**Prompt för Cursor:**

```
Implementera P0: I functions/src/index.ts analyzeMessage — ta bort data.ragContext från klienten. Hämta RAG server-side via kampsparQueryRag för uid. Uppdatera frontend som skickar ragContext. Kör functions build + smoke:grans + smoke:kunskap.

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
```
