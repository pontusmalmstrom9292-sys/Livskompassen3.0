# Systemkontroll — F — Design-moduler D1–D29 — 2026-05-23

**Trigger:** Read-only design-gap mot tema E/F och locked UX.

**Källor lästa:** `docs/design/themes/THEME-COMPARISON.md`, `docs/design/themes/index.html`, kodkommentarer `/** D* —`, `scripts/smoke_locked_ux.mjs`, `src/modules/*/components/`, `docs/design/*.md`.

**Register:** Design-ID enligt tema-galleri (7 skärmar → D1–D29 fördelning). Status: **PASS** = kod + spec; **partial** = MVP utan full visuell kanon; **GAP** = saknas i kod.

---

## D1–D29 — status

| ID | Modul / krav | Bevis (kod/spec) | Status |
|----|--------------|------------------|--------|
| **D1** | Kompis AI-livsarkitekt | `KunskapPage`, `KnowledgeVaultChat`, `KompisAvatar` | **PASS** |
| **D2** | Livskompass-hero (hem) | `HomePage`, `HomeActionHub`, `CompassModuleStrip` | **PASS** |
| **D3** | Kompassråd Hamn/Hem | `KompassradPanel.tsx` (untracked — D3 comment) | **partial** — fil finns, ej committad |
| **D4** | Avlånga kompassmoduler (M/D/K) | `CompassModuleStrip`, `ElongatedModule` | **PASS** |
| **D5** | Hamn modulstack | `HamnModuleStack.tsx` | **PASS** |
| **D6** | BIFF i egen modul Hamn | `SafeHarborPage` + `HamnModuleStack` | **PASS** |
| **D7** | Laddning 1–5 (Hamn P2) | `module_plan` — planned | **GAP** |
| **D8** | Gräns-Arkitekten i Hamn | G14 routing + `smoke:grans` | **PASS** |
| **D9** | Hjärtat hub (3 flikar) | `HjartatPage.tsx` reflektion/bevis/speglar | **PASS** |
| **D10** | Dagbok journal-flow | `DagbokPage`, stegindikator, humör | **PASS** |
| **D11** | Barnfokus roterande frågor | `BarnfokusFraganPanel`, `BARNFOKUS_QUESTIONS` | **PASS** |
| **D12** | Barnprofilkort (Arvid/Kasper) | `ChildProfileCards.tsx` (untracked) | **partial** |
| **D13** | Positiva minnesankare | `PositivaMinnesankare.tsx` (untracked) | **partial** |
| **D14** | Föräldrapåminnelse footer | `ParentReminderFooter.tsx` (untracked) | **partial** |
| **D15** | BIFF-triage (logistik vs bete) | `BiffTriagePanel.tsx` (untracked) | **partial** |
| **D16** | Pansaret-rubrik Mönster | `PansaretHeader.tsx` (untracked) | **partial** |
| **D17** | Orkester agent-trio | `OrkesterAgentTrio.tsx` (untracked) | **partial** |
| **D18** | Kognitiv belastning (1 fält) | `CognitiveLoadStrip.tsx` (untracked) | **partial** |
| **D19** | Valv frekvens Mönster | `VaultMonsterPanel`, `vaultPatternScan.ts` | **PASS** |
| **D20** | Valv Orkester + WORM logg | `VaultOrkesterPanel`, `VaultLogList` | **PASS** |
| **D21** | Valv-Chat Sök-flik | `ValvChatPanel`, `valvChatQuery` | **PASS** |
| **D22** | BIFF-Detektor (Safe Harbor) | `analyzeMessage`, Brusfilter card | **PASS** |
| **D23** | BIFF-Triage UX | Överlapp D15 — panel ej wired i `SafeHarborPage` | **partial** |
| **D24** | Sidomeny hamburger kanon | `drawerNav.ts` — **`NavigationDrawer.tsx` saknas** | **GAP** |
| **D25** | Planering P3 Kanban | Spec + PNG; **ingen `/planering` route** | **GAP** |
| **D26** | Widget WH1 tyst inspelning | `ingestWidgetRecording`, Android widgets, `/widget/*` | **partial** — E2E manuell |
| **D27** | Speglings ACT/VIVIR | `SpeglingsSystem`, evidence compare | **PASS** |
| **D28** | Dossier wizard export | `DossierPage`, `generateDossier` | **PASS** |
| **D29** | KBT-Transformatorn (3 kort) | `MabraPage` hub: andning/grounding/reframing | **PASS** |

---

## Sammanfattning per kluster

| Kluster | PASS | partial | GAP |
|---------|------|---------|-----|
| D1–D2 Hem/Kompis | 2 | 0 | 0 |
| D3–D8 Hamn | 4 | 1 | 1 |
| D9–D10 Hjärtat | 2 | 0 | 0 |
| D11–D14 Familjen | 1 | 3 | 0 |
| D15–D23 Valv/Hamn BIFF | 4 | 4 | 0 |
| D24–D26 Shell/Plan/Widget | 0 | 1 | 2 |
| D27–D29 MåBra/Speglar/Dossier | 3 | 0 | 0 |
| **Totalt** | **16** | **9** | **4** |

---

## Locked UX-koppling

| Design-ID | Locked register | Smoke |
|-----------|-----------------|-------|
| D11 | Barnfokus §1 | `smoke:locked-ux` |
| D19–D20 | Mönster/Orkester §2 | `smoke:locked-ux` |
| D25 | Planering §3–4 | spec + PNG |
| D26 | Fyren widget §5 | spec + key strings |
| D24 | Sidomeny §6 | kanon PNG finns |

---

## Rekommenderat nästa steg

Committa D12–D18 + wire `BiffTriagePanel` i Hamn **eller** ta bort untracked filer — annars förblir 9 **partial** i nästa utvärdering.

---

## Blocker

Ingen för MVP-navigation. Planering (D25) och sidomeny (D24) kräver `kör planering` / `kör meny`.
