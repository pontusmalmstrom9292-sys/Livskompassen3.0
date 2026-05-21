# Livskompassen v2 - System Plan (Canonical)

Denna fil ar aktiv systemplan. Root-filen `system_plan.md` ar endast en pekare.

## Fas 1 (Cleanup): Sanering & Mappstruktur
- [x] Git-branch `cleanup-phase-1` - saker arbetskopia
- [x] `.context/` systemlagar (arkitektur, sakerhet, databas, design)
- [x] `.gitignore` - secrets, `dist/`, `functions/lib/`, genererad kod
- [x] Borttaget fran git: `vertex-sa.json`, `server/.env`, `spejaren.js`, `server.js`, build-artefakter
- [x] Frontend merge fran `livskompassen-v2` (`main.tsx`, layout, Kompis)
- [x] Rensat: tomma placeholders, trasig `agentEngine.ts`, session-artefakter -> `docs/archive/`
- [x] Agent Cards: 8 produktroller + deterministisk `routeFromDcap` -> executor
- [x] Sakerhet: auth pa `knowledgeVaultQuery`, webhook-secret pa `notifyNewFile`
- [x] Enhetligt `GCP_PROJECT_ID` via `functions/src/config.ts`
- [x] HOME-klonens unika `src`-integration (firebase, store, vault-chat)
- [x] Vault-sidor portade till `src/modules/` (verklighetsvalvet, kompasser, safe_harbor, ekonomi)
- [x] Aktiv backend konsoliderad till `functions/` (legacy `server/` arkiverad)
- [x] Redundanta projektkartor raderade (v2, PROD, drive-download, cursor-workspace, HOME-klon)

## Fas 2 (Moduler): App-shell + aktivering
- [x] BrowserRouter + routes (`/`, `/kompasser`, `/valv`, `/hamn`, `/ekonomi`, `/dagbok`, `/kunskap`, `/barnen`)
- [x] FloatingDock navigation med aktiv route + long-press Shield (3 sek)
- [x] AuthProvider (Firebase Anonymous) + AuthGate pa kansliga moduler
- [x] Zero Footprint: vault unlock reset vid visibilitychange + timeout + `invalidateSession` callable
- [x] Kunskapsvalv: `/kunskap` + Tidshjulet + auth-felhantering
- [x] Kompasser: morgon/dag/kvall-floden + Firestore checkins
- [x] Safe Harbor: BIFF-formular via `analyzeMessage` callable
- [x] Verklighetsvalvet: long-press gate, PIN (lokal/env), VaultLog WORM
- [x] Dagbok: DagbokPage + journal-persistens
- [x] Barnens livsloggar: `/barnen`, PIN, Firestore `children_logs`
- [x] Telefon-MVP: `vite --host` i dev-script + `manifest.webmanifest` (lägg till på hemskärm)
- [x] Firestore rules: checkins, journal, reality_vault, children_logs

## Aktuell status
- [x] Design-tokens och fargpalett
- [x] Bas-layout med Sub-Synaptic Background
- [x] KompisAvatar
- [x] Bento Grid dashboard
- [x] Floating Dock (routing)
- [x] Interaktivt Tidshjul (bas-UI pa `/kunskap`)
- [x] Mobil-dashboard (`--host`)
- [x] Verklighetsvalv UI (long-press + PIN + VaultLog)

## Fas 3 (Firebase-synk)
- [x] Firestore rules + indexes deployade
- [x] Functions deployade (utom `notifyNewFile` — kräver secret)
- [x] Firebase Hosting: https://gen-lang-client-0481875058.web.app
- [x] Dokumentation: `docs/FIREBASE_SYNC.md`
- [ ] Manuell smoke: spara test i valv + barnen (Firestore Console)
- [ ] `NOTIFY_WEBHOOK_SECRET` + deploy `notifyNewFile` (Drive)

## Drive wire-up (Apps Script → notifyNewFile)
- [x] Kod redo: Script Properties i `sorter.gs`, webhook-secret fail-closed, `docs/DRIVE_AUTOMATION.md`
- [ ] Manuell GCP/Apps Script-konfiguration och verifiering (se `docs/DRIVE_AUTOMATION.md`)

## Firebase Fas 3 (synk)
- [x] `.firebaserc` rättad; Firestore rules + indexes deployade
- [x] Modul-Functions deployade (`europe-west1`); Hosting live — se `docs/DEPLOY.md`, `docs/FIREBASE_SYNC.md`
- [ ] `notifyNewFile` — kräver `NOTIFY_WEBHOOK_SECRET` (användaren sätter secret)
- [ ] Manuell smoke enligt `docs/SMOKE_CHECKLIST.md`

## Data Connect
- Deployat (example-schema); **appmoduler använder Firestore** — DC avvaktas tills ekonomi (se `docs/FIREBASE_SYNC.md`)

## Modulmappning (`.context/modules/`)

| Modul | Route | Kontextfil | Kod |
| --- | --- | --- | --- |
| Verklighetsvalvet | `/valv` (Shield 3s + WebAuthn) | `.context/modules/verklighetsvalvet.md` | `src/modules/verklighetsvalvet/` |
| Dagbokshubben | `/dagbok` | `.context/modules/dagbokshubben.md` | `src/modules/dagbok/` |
| Barnens livsloggar | `/barnen` | `.context/modules/barnens_livsloggar.md` | `src/modules/barnens_livsloggar/` |
| Speglings-Systemet | `/speglar` | `.context/modules/speglingssystemet.md` | `src/modules/speglings_system/` |
| Måbra-sidan | `/mabra` | `.context/modules/mabra_sidan.md` | `src/modules/mabra/` |
| Kompis / Kunskap | `/vardagen?tab=kunskap` | `.context/modules/kompis.md` | `src/modules/kompis/` |

## Kommande fas
- [x] WebAuthn gate + Shake-to-Kill (15 m/s²) + Fyren progress
- [x] Vävaren async tagging (Gemini 1.5 Pro → reality_vault) + kampsparRag
- [x] Barnens: Kasper/Arvid, Balansmätare, fysiologi, JSON export
- [x] Speglings-Systemet: ACT + VIVIR + valvjämförelse (`/speglar`)
- [x] `weaveJournalEntry` + hosting deploy (natt-batch — se `docs/OVERNIGHT_REPORT.md`)
- [ ] Kampspar-loggning (uppladdning, tidsstampel, vektorisering) — **delvis:** `ingestKampsparEntry`, Tidshjulet, Kunskap RAG; Vector Search ANN avvaktar
- [ ] Ekonomi kopplad till Firestore/Data Connect
- [ ] Måbra-sidan — KBT-övningsbibliotek, datamodell, AI-coach (shell `/mabra` + kluster **done**; se `.context/modules/mabra_sidan.md`, prompter i `docs/specs/ai-prompts-moduler-master.md`)
