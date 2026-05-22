# STADPASS-MANIFEST — 2026-05-22

**Pass:** Barnläggnings-pass (dokumentstäd + sanningssynk)  
**Utfört:** Tier A + säker ARCHIVE. Tier B DELETE **godkänd och utförd** 2026-05-22.

---

## KEEP (kanon — rör inte)

| Sökväg | Roll |
|--------|------|
| `.context/*` | Systemlagar |
| `docs/specs/modules/Arkiv-GAP-REGISTER.md` | Implementation queue (kanon) |
| `docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md` | Grunder U1–U5 (låst) |
| `docs/archive/repomix/KONSOLIDERING-2026-05-21.md` | Låsta beslut |
| `docs/evaluations/2026-05-22-MASTER-byggpass.md` | Senaste syntes |
| `docs/evaluations/2026-05-22-A-helhetsstatus.md` | Helhetsstatus |
| `docs/evaluations/2026-05-22-E-kaos.md` | Kaos-orientering |
| Alla `docs/evaluations/2026-05-22-modul-*.md` | Modul-audits (värdefulla) |
| `docs/specs/modules/grunder-slides/**` | Produktreferens |
| `system_plan.md` | Pekare → `.context/system-plan.md` |

---

## ARCHIVE (utfört 2026-05-22)

| Från | Till | Motivering |
|------|------|------------|
| `docs/specs/incoming/*.md` | `docs/archive/evaluations-2026-05/incoming-stash/` | Duplicat; kanon i modules + archive |
| `AUTOPILOT_PHASE_2_BLUEPRINT.md` (root) | `docs/archive/AUTOPILOT_PHASE_2_BLUEPRINT.md` | Superseded Fas 4-utkast (fel UI-terminologi) |
| 25 Cursor-planer (alla todos completed eller duplicerad grunder) | `~/.cursor/plans/archive/2026-05/` | Se lista nedan |

### Cursor-planer arkiverade (25)

`2h_byggpass_audit`, `rent_github-repo`, `parallellt_obevakat_pass`, `grunder_gcp_masterplan`, `grunder_systemet_genomgång`, `multitask_grund_gap`, `repomix_och_gcp_audit`, `fyll_kunskapsvalvet`, `additiv_modulbyggplan`, `nästa_steg_roadmap`, `smoke_dossier_e2e`, `kunskap_notebook-granskning`, `modul-prompter_måbra`, `appgrund_kampspår_kladd`, `deploy_och_våg2-spec`, `design_audit_obsidian`, `dokumentation_och_helhetsplan`, `dagbok_design_komponenter`, `kalkylark_till_react`, `nattplan_livskompassen`, `firebase_synk_fas_3`, `fas_2_moduler`, `drive_automation_wire-up`, `fas_1_monorepo-konsolidering`, `livskompassen_inventering`

### Cursor-planer KEEP (10 kvar i `~/.cursor/plans/`)

| Plan | Anledning KEEP |
|------|----------------|
| `barnläggning_städpass` | Aktivt pass |
| `grunder_och_systemordning` | 2 öppna todos |
| `grund_sdk_synapser` | in_progress |
| `hela_arkivet_minne` | Framtida minne-arbete |
| `måbra_hub_utbyggnad` | Delvis öppen |
| `fix_agentengine_stack` | Öppen |
| `dokumentstädning_projekt` | Legacy project/-städ (in_progress) |
| `steg1_och_telefon-preview` | 1 öppen todo |
| `cursor_gemini_setup` | in_progress |
| `cursor_rules_setup` | in_progress |

---

## DELETE (utfört 2026-05-22 — `godkänn städ`)

| Kandidat | Status |
|----------|--------|
| `dist/` (lokal) | **Raderad** |
| `functions/lib/` (lokal) | **Raderad** |
| `incoming-stash/Arkiv-GAP-REGISTER.md` | **Raderad** (kanon: `specs/modules/`) |
| `incoming-stash/GRUNDER-UTVARDERING-RESULTAT.md` | **Raderad** (identisk med arkiv-kanon) |
| `incoming-stash/` mapp | **Borttagen** (tom) |

| Kandidat | Status |
|----------|--------|
| `~/.cursor/plans/archive/2026-05/*` | **Behållen** — historik kvar tills du säger `radera plan-arkiv` |

**Ej DELETE:** WORM-data, GCP buckets/index, `.context/`, repomix KONSOLIDERING, evaluations MASTER/A/E.

---

## Tier A — utfört (sanningssynk)

| Mål | Status |
|-----|--------|
| `docs/NATT-CI.md` FAS4 steg 3–7 | Uppdaterad → **done** |
| `.context/system-plan.md` notify/G6 | Uppdaterad → **done** |
| `Arkiv-GAP-REGISTER.md` G9–G14 | Redan **done** i tabell |
| `.context/security.md` G7–G14 | Redan **done** |
| Modul-README valv deploy | Uppdaterad → deployad + smoke PASS |
| `docs/specs/incoming/` | Flyttad + README-pekare |
| Root `AUTOPILOT_*` | Flyttad till archive |

---

## Öppna P0 (ej städ — separat pass)

Från `.context/security.md`: `notifyNewFile` ownerId, client-PIN/WebAuthn, DCAP prompt i `sharedRules.ts`.
