# Systemkontroll — A — 2026-05-31

**Trigger:** Projektgranskning — doc-synk enligt plan (helhetsstatus + kanon-uppdatering)  
**Källor lästa:** `.context/system-plan.md`, `.context/security.md`, `.context/arkiv-minne.md`, `docs/GCP-INVENTORY-LATEST.md`, `docs/specs/modules/Arkiv-GAP-REGISTER.md`, `docs/SMOKE_RESULTS.md`, `docs/BRANCH-KARTA.md`, `docs/evaluations/2026-05-31-pmir-session-rniv.md`, `AGENTS.md`

---

## Sammanfattning (3–5 rader)

Livskompassen är i **Fas 4 (verifiering + polish)** på `main`. Backend G1–G16 är **done**; tre silos och WORM-regler följer kanon. Automatiserade smokes **PASS**. Manuell smoke: #1, #2, #18 **PASS** (2026-05-27); #3, #4, #2d **USER**. Vävaren HITL mergad 2026-05-31; moln-functions live. Doc-drift synkad i denna omgång.

---

## PASS

| Område | Bevis |
|--------|-------|
| Tre silos (Kunskap / Valv / Barnen) | `knowledgeVaultQuery`, `valvChatQuery`, `childrenLogsQuery` — separata RAG-moduler |
| WORM permanent minne | `firestore.rules` + `retentionJob.ts` allowlist |
| G1–G16 backend | `Arkiv-GAP-REGISTER.md` — alla done |
| Låst UX | `smoke:locked-ux` PASS 2026-05-29 |
| Orkester wiring | `smoke:orkester` + `orkester:night` PASS |
| Git trunk | `main` på Livskompassen3.0; PMIR före merge |
| Moln (2026-05-31 audit) | 33 functions west1; **173 vectors**; Vävaren callables deployade |
| Innehåll U6 | `INNEHALL-REGISTER.md` ↔ `.cursor/rules/innehall-register.mdc` |

---

## GAP / risk

| ID | Beskrivning | Status |
|----|-------------|--------|
| Manuell smoke app | #3 Valv, #4 Barnen, #2d bilaga, projektbild | **USER** — se `SMOKE_RESULTS.md` Current truth |
| Zero Footprint logout | `signOutUser()` anropar inte `invalidateSession` | Dokumenterat i `security.md` §Zero Footprint |
| U2.5 HITL exports | Känsliga exports | **open** — produktbacklog |
| Barnen PLAY bank | `specialist-barn-lek` | **planerad** — INNEHALL-REGISTER |
| Kunskap våg 8 ingest | Efter mänsklig granskning | **open** — content-autorun-vag-8 |
| Doc-drift (före synk) | Gamla smoke/GCP-datum | **åtgärdat** 2026-05-31 i hub-dokument |

---

## Rekommenderat nästa steg (max 1)

**Manuell smoke #3 + #4** (15 min i app) — bekräfta `reality_vault` och `children_logs` i Firestore Console.

---

## Blocker

Ingen kod-blocker. Prod UI för Vävaren badge/panel: verifiera att hosting + rules matchar `main` efter senaste merge.
