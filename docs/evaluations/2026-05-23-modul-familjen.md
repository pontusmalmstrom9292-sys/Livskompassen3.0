# Modulutvärdering — Familjen — 2026-05-23

**Modul:** `barnens_livsloggar`  
**Route:** `/familjen` (redirect `/barnen`)  
**Kontext:** `.context/modules/barnens_livsloggar.md`, `docs/design/FAMILJEN-HUB-SPEC.md`

---

## Sammanfattning

Familjen-hubben är **MVP-klart** med fem flikar (Reflektion, Livslogg, Tillsammans, Mönster, Kunskap). Barnfokus-frågor är **locked UX** och passerar `smoke:locked-ux`. `childrenLogsQuery` (G8) ger barn-silo RAG. **partial:** D12–D14-komponenter (profilkort, minnesankare, footer) finns som untracked filer; `constants.ts` har ostaged ändringar.

---

## Flikar

| Flik | Komponent | Status |
|------|-----------|--------|
| Reflektion | `FamiljenReflektionTab`, `BarnfokusFraganPanel` | **PASS** |
| Livslogg | `FamiljenLivsloggTab`, fysiologi, bevis-val | **PASS** |
| Tillsammans | `FamiljenTillsammansTab` | **PASS** |
| Mönster | `FamiljenMonsterTab` (deterministisk) | **PASS** |
| Kunskapshub | `FamiljenKunskapHubTab` — tre silo-sök + fil | **PASS** |

---

## Locked UX — Barnfokus

| Krav | Status | Bevis |
|------|--------|-------|
| `BARNFOKUS_QUESTIONS` pool | **PASS** | `constants.ts` |
| Optimistisk minneslista | **PASS** | `handleSaveBarnfokus` |
| `category: 'barnfokus'` | **PASS** | `useFamiljenShell.ts` |
| Knapp **Spara till {barn}s logg** | **PASS** | `BarnfokusFraganPanel` |
| **Annan fråga** | **PASS** | panel |

---

## Data & silo

| Collection | Regel | Status |
|------------|-------|--------|
| `children_logs` | WORM, owner-bound | **PASS** |
| RAG | `childrenLogsQuery` — **MUST NOT** valv/kampspar | **PASS** |
| Bevis-promotion | HITL till Valv — ej auto | **PASS** |

---

## Design D11–D14

| ID | Komponent | Status |
|----|-----------|--------|
| D11 | Barnfokus | **PASS** |
| D12 | `ChildProfileCards` | **partial** (untracked) |
| D13 | `PositivaMinnesankare` | **partial** (untracked) |
| D14 | `ParentReminderFooter` | **partial** (untracked) |

---

## GAP

| GAP | Allvar | Åtgärd |
|-----|--------|--------|
| Untracked D12–D14 | Medel | Commit + mount i `FamiljenPage` |
| Barnporten PWA | Design lock | Spec finns — separat `kör barnporten` |
| Manuell smoke #19 | Prod | SMOKE_CHECKLIST |

---

## Rekommenderat nästa steg

Commit Familjen polish-filer och kör `npm run smoke:locked-ux` + `smoke:children`.

---

## Blocker

Ingen kodblockerare.
