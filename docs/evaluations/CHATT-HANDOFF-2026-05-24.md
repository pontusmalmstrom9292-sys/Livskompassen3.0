# Chatt-handoff — session 2026-05-24

**Syfte:** Fortsätt samma arbete i **Livskompassen3.0** (kanonisk trunk `main`).  
**Cursor-transkript:** `c044d1b6-ef60-445c-bde8-87d90c204cb9` (agent-transcripts)

---

## Vad som gjordes i sessionen

| Del | Resultat |
|-----|----------|
| **Del A — Git** | En trunk `main`; PMIR + `check:main-trunk`; `GIT-LATHUND`, `BRANCH-KARTA`, `MERGE-IMPACT-RAPPORT`; Fyren fix cherry-pick; städade grenar |
| **Del B — Docs** | `MODUL-FUNKTIONS-REGISTER`, `SENASTE-SAMMANFATTNING`, `DOC-DRIFT-RAPPORT`; arkiverade dubletter under `docs/archive/specs-incoming-duplicates-2026-05/` |
| **Lathundar** | `LATHUND-INDEX.html`, styled HTML via `npm run build:lathund-html`, `CURSOR-MENY-LATHUND` |
| **Senaste commit** | `2eab1273` — Preview/print-hints i HTML-lathundar (kan vara ahead av `origin` tills push) |

**Remote:** `origin` = Livskompassen3.0 · **Använd inte** `origin-old` (Livskompassen2.0) för push.

---

## Öppet (produkt, ej git-städ)

- Manuell smoke: `docs/SMOKE_CHECKLIST.md` #1–7, #18–22
- Opt-in minne-ingest (trauma policy)
- Barnporten full PWA-route
- Beslut: `feat/mabra-fragekort` vs KBT på main

---

## Nästa steg i 3.0 (för agent)

1. Öppna workspace **Livskompassen3.0** (inte 2.0-mappen).
2. Läs [`SENASTE-SAMMANFATTNING.md`](./SENASTE-SAMMANFATTNING.md) + [`../LATHUND-INDEX.html`](../LATHUND-INDEX.html).
3. Vid kod: `npm run build`, `npm run smoke:locked-ux`, `npm run smoke:orkester`.
4. Vid git: `npm run check:main-trunk` före merge/delete.

---

## Prompt för Cursor (kopiera vid behov)

```
Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.

Fortsätt från docs/evaluations/CHATT-HANDOFF-2026-05-24.md och SENASTE-SAMMANFATTNING.md. Repo: Livskompassen3.0, gren main. Bevara låst UX och tre silor.
```
