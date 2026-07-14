# B40 — Integration dry-run (innehåll + seed)

**Datum:** 2026-07-14 · **Agent:** marathon-arkiv (livskompassen-arkiv-master)  
**Wave:** v40 INTEGRATION · **Task:** `b40-build`  
**Typ:** integration dry-run — ingen live ingest, ingen `--apply`

---

## Beslut: **GO**

Obligatoriska innehålls-smokes **PASS**. Dry-run seed klar utan skrivning. Preflight **PARTIAL** — sync-källa saknas (icke-blockerande för build-gate).

---

## 1. Vad som ändrades

**Produktionskod:** inget.

| Fil | Ändring |
|-----|---------|
| `docs/evaluations/2026-07-14-integration-v40.md` | Ny eval — smoke-matrix, dry-run, preflight, verdict **GO** |
| `.orkester/cursor-yolo-state-v40.json` | `b40-build` → completed, nästa → `b40-gate` |

**Sidoeffekt (preflight sync, ej committad):** repomix-packs, `docs/system_sync/package_CURRENT.json`, chatbot-handoff exports uppdaterades av `integration:sync:all` före exit 1.

---

## 2. Smoke-resultat

| Script | Resultat | Sammanfattning |
|--------|----------|----------------|
| `npm run smoke:innehall` | **PASS** | Register + kanon, content banks, daglig mix (mount, bank parity, no RAG/streak), Cursor rules + grunder U6, kurator agents, functions lock (mabraCoach), Mabra no Kunskap RAG, domän-specialister (5 agenter) |
| `npm run smoke:content-waves` | **PASS** | Register + vågar, curriculum catalog, VitCurriculumPanel, Kunskap manifest, Barn PLAY bank, våg 9–16 (vit_hub, Valv Mitt Vit P2, Vit chat P3, export + minnes-UI, minnes-filter Valv, copy polish, översikt P4, spec + utveckling P5) |

---

## 3. Dry-run

### seed_kampspar_profile (`--dry-run`)

| Fält | Värde |
|------|-------|
| Manifest | profil v2026-05-21 |
| Poster | 47 (profil, insikt, diagnos, medicin, coping, strategi, myndighet, barn, värdering, metod, varning) |
| Skrivning | **Ingen** — `[seed] DRY-RUN klar — inget skrivet.` |
| Exit | 0 |

### integration:preflight

| Steg | Resultat |
|------|----------|
| `integration:sync:all` → gemini/chatbot/research packs | **PASS** (repomix + sync:system) |
| `gemini:sync:kunskap` | **PARTIAL** — exit 1, saknad källa |
| `smoke:mdc` (ej nådd i kedja; kör separat) | **PASS** — 71 MDC-filer, 1 alwaysApply |
| `smoke:projekt-regler` (ej nådd i kedja; kör separat) | **PASS** — route, API, rules, nav, offline allowlist |

**Preflight-fel:**

```
[gemini:sync:kunskap] Saknade källor (hoppades över):
   docs/external-ai/bifoga/03-prompter/GEMINI-DEEP-RESEARCH-SYSTEM-AUDIT-MASTER.md
```

48 filer synkades till `docs/external-ai/gemini-kunskap/` innan exit 1. Tier-2 post `20-SYSTEM-AUDIT-MASTER-PROMPT.md` hoppades över.

---

## 4. Tre silos + PMIR

| Kontroll | Status |
|----------|--------|
| Kunskap · Valv · Barnen — ingen cross-RAG | **PASS** (smoke:innehall) |
| FACT vs REFLECTION vs PLAY | **PASS** (register + banks) |
| Live Kunskap-ingest (`--apply`) | **SKIP** — aldrig körd |
| `firestore.rules`, `storage.rules`, `sharedRules.ts` | **SKIP** — PMIR |
| AppRoutes, Barnporten kanon-UI | **SKIP** — PMIR |
| `b40-deploy` | **SKIP** — PMIR, ingen explicit deploy-OK |

---

## 5. Blocker / SKIP

**Ingen blocker för b40-build → b40-gate.**

| Item | Typ | Orsak |
|------|-----|-------|
| Saknad GEMINI-DEEP-RESEARCH-SYSTEM-AUDIT-MASTER.md | INFO | Preflight PARTIAL — tier-2 valfritt, 47/48 källor OK |
| Live seed / Kunskap ingest | SKIP | Dry-run only per wave-spec |
| Deploy | SKIP | PMIR |

---

**Nästa i kön:** `b40-gate` (specialist-verifier — task-smoke + wave-gate eval). **Ej körd i denna task.**
