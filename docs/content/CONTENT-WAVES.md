# Content Autorun — vågregister

**Kör:** `npm run content:night` · **Kanon:** [`INNEHALL-REGISTER.md`](../INNEHALL-REGISTER.md)

| Våg | Tema | Kunskap ids | MåBra ids | Curriculum | Status |
|-----|------|-------------|-----------|------------|--------|
| 0 | Infrastruktur | export 001–025 | — | — | **done** |
| 1 | ADHD vardag | 016–028 | MB-REF-ADHD-*, MB-PLAY-05/06 | CUR-ADHD-01 | **done** |
| 2 | GAD / ångest | 029–035 | MB-REF-GAD-*, MB-PLAY-GAD-01 | CUR-GAD-01 | **done** |
| 3 | Känslor + ACT | 036–040 | C-feel-04/05, MB-REF-ACT-*, MB-PLAY-08 | CUR-FEEL-01, CUR-ACT-01 | **done** |
| 4 | Föräldraskap | 007–008, 024 (+041–042) | BP-PLAY-01–05 | CUR-PARENT-01 | **done** |
| 5 | Taktiker (referens) | 043–047 | — (Speglar/Valv bro) | CUR-TAKTIK-01 | **done** |
| 6 | Medföräldraskap | 003–015 (befintlig) | — (Hamn bro) | CUR-COPARENT-01 | **done** |
| 7 | Droger / nykterhet | df-001–006 | DF-REF-11/12 | CUR-SOBRIETY-01 | **done** |
| 8 | Ingest RAG | manifest → kampspar | — | — | **done** 2026-06-06 — 53 poster → `fPIXyAxSnKPubEGBSAwUmxDRfiD3` (Admin SDK) |
| 9 | Vit hub P1 | — | C-se-01..10, vit_hub/vit_entries | — | **done** 2026-06-06 — Firestore append-only, frågekort per projekt |
| 10 | Valv Mitt Vit P2 | — | — | — | **done** 2026-06-06 — `vaultTab=mitt_vit`, dashboard + statistik |
| 11 | Vit chat P3 | — | `vit_chat`, `chat_turn` | — | **done** 2026-06-06 — `mabraCoach` + silo-guard → `vit_entries` |
| 12 | Export + minnes-UI | — | `kind: memory`, print-PDF | — | **done** 2026-06-06 — `VitMemoryFlowPanel` + `exportVitHubReport` |
| 13 | Minnes-filter Valv | — | `vitKind` / `vitProject` URL | — | **done** 2026-06-06 — filter chips + projektklick + export per filter |
| 14 | Vit-hub copy polish | — | `vitHubCopy`, ingen streak/skuld | — | **done** 2026-06-06 — kanonisk copy + Valv-länkar + URL-sync filter |
| 15 | Vit översikt P4 | — | `VitRecentOverview`, MåBra→Valv | — | **done** 2026-06-06 — senaste 3 + hub-länk till Mitt Vit |
| 16 | Vit spec + utveckling P5 | — | spec P1–P3 done, `VitDevelopmentPanel` | — | **done** 2026-06-06 — deterministisk veckoaktivitet + humör/pass-polish |
| 17 | Teman / vad jag tycker är kul | — | MB-REF-JOY-01..06, MB-PLAY-JOY-01/02 | — | **done** 2026-06-07 — bank-only (kurator); prod-wire kräver PMIR |
| 18 | Barnen PLAY child bank | — | BP-PLAY-01..21 (`barnfokusCatalog.ts`) | — | **done** 2026-06-11 — MT-1 wire + parent footer |
| 20 | Covert taktik + barn HCF | cn-001–015, bh-001–008 | BP-PLAY-22..24 (barnfokus) | — | **done** 2026-06-14 — bank KEEP; **ingest klar** (76 FACT i `kampspar`) |
| 21 | Covert HCF fördjupning | cn-016–020, ep-001–005, jur-001–004, bh-009–012, vf-001–004 | — | — | **done** 2026-06-14 — bank KEEP; **ingest klar** (98 FACT manifest) |
| 22 | Ekonomisk kontroll + Hamn wire | cn-021 | — (Hamn wire UI) | — | **done** 2026-06-14 — cn-021 ingest; Hamn wire: hoover, smear, ekonomisk_kontroll, maternal_fasad |
| 23 | Epistemic guard + Valv Mönster v3 | cn-* refs (library) | — | — | **done** 2026-06-14 — Hamn theoryWithoutEvidence; pattern_scan_metadata sidecar; Dossier taktikfilter |
| 24 | Juridisk process / vårdnad FACT | jur-005..007, ep-006, cn-022, bh-013 | — | — | **bank KEEP** 2026-06-15 — ingest efter PMIR · [`2026-06-15-content-wave-24-plan.md`](../evaluations/2026-06-15-content-wave-24-plan.md) |

**Aktiv våg:** `24` — **bank KEEP** (ingest efter PMIR) · våg 23 **klar**

**Seed (Google-konto):** `SEED_FIREBASE_EMAIL` i `.env` + `gcloud auth application-default login` → `npm run seed:kunskap-facts`
