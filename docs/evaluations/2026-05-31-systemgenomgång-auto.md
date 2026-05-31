# Systemgenomgång auto — 2026-05-31

**Kört:** agent batch enligt plan `auto_systemgenomgång`  
**Git:** `main` · dirty efter smoke-fixar (se diff)

---

## Sammanfattning

| Fas | Resultat |
|-----|----------|
| Baseline build | **PASS** (functions + frontend) |
| ESLint | **SKIP_FAIL** — 0 errors, 4 warnings (`--max-warnings 0`) |
| check:main-trunk | **PASS** |
| Statiska smokes (9) | **PASS** |
| Nätverks-smokes (14) | **PASS** |
| Säkerhetsaudit | **PASS** (1 operativ notering) |
| Kodfixar | 6 filer + smoke-skript |

**Inga blockerande buggar kvar efter triage.**

---

## Baseline

| Kommando | Status | Notering |
|----------|--------|----------|
| `cd functions && npm run build` | PASS | |
| `npm run build` | PASS | Chunk >500 kB varning (känd) |
| `npx eslint . --max-warnings 0` | SKIP_FAIL | 4 warnings — se nedan |
| `npm run check:main-trunk` | PASS | branch main, origin OK |

### ESLint warnings (ej blockerande)

| Fil | Regel |
|-----|-------|
| `RoutinesPanel.tsx` | react-hooks/exhaustive-deps |
| `useMaterialShortcuts.ts` | unnecessary dependency `version` |
| `useDrogfrihetCounter.ts` | unnecessary dependency `revision` |
| `WidgetRecordPage.tsx` | missing dependency `rec` |

---

## Statiska smokes

| Kommando | Status |
|----------|--------|
| `smoke:locked-ux` | PASS |
| `smoke:design-modules` | PASS |
| `smoke:locked-icons` | PASS |
| `smoke:innehall` | PASS |
| `smoke:orkester` | PASS |
| `smoke:arbetsliv` | PASS (efter smoke-skript-fix) |
| `smoke:tidshjul` | PASS |
| `smoke:child-moment` | PASS |
| `smoke:content-waves` | PASS |

---

## Nätverks-smokes (prod callables)

| Kommando | Status | Notering |
|----------|--------|----------|
| `smoke:kunskap` | PASS | embedding 768, citation match |
| `smoke:speglar` | PASS | speglingsMirror AI |
| `smoke:dossier` | PASS | PDF fallback base64 — signBlob IAM saknas i GCP |
| `smoke:compass` | PASS | checkins WORM + Paralys |
| `smoke:mabra` | PASS | guardrail + coach |
| `smoke:valv` | PASS | valvChatQuery |
| `smoke:children` | PASS | childrenLogsQuery |
| `smoke:grans` | PASS | G14 Gräns-Arkitekten |
| `smoke:entities` | PASS | 7 profiles, 3 synapses |
| `smoke:inbox` | PASS | G10 classification |
| `smoke:cache` | PASS | G12 invalidateSession |
| `smoke:stampla` | PASS | time_entries in/out |

---

## Säkerhetsaudit (read-only)

| Kontroll | Status | Bevis |
|----------|--------|-------|
| WORM `journal` | PASS | `firestore.rules` update/delete: false |
| WORM `reality_vault` | PASS | samma |
| WORM `children_logs` | PASS | samma |
| WORM `dossier_snapshots` | PASS | samma |
| WORM `dcap_alerts` | PASS | client create/update/delete: false |
| `journal_woven` optIn | PASS | `index.ts:732`, `journalWovenSynapse.ts:24` |
| SynapseBus handlers | PASS | 4 triggers wired i `synapseBus.ts` |
| Callable auth | PASS | `unauthenticated` på prod-callables |
| Prompts centraliserade | PASS | agents importerar `sharedRules.ts` |
| Zero Footprint | PASS | `useZeroFootprint.ts`, `killSwitch.ts`, `invalidateSession` |
| Kill Switch | PASS | `useShakeToKill.ts` → `executeKillSwitch` |

### GAP (operativ, ej säkerhet)

| Punkt | Allvar | Åtgärd |
|-------|--------|--------|
| Dossier signed URL | Låg | `smoke:dossier` använder pdfBase64-fallback — IAM `signBlob` saknas |

---

## Fixar under triage

| Fil | Problem | Fix |
|-----|---------|-----|
| `functions/src/index.ts` | ESLint useless-assignment | `let content: string` |
| `functions/src/lib/submitInkastLite.ts` | ESLint useless-assignment | `let analysisText: string` |
| `ProjektNyPage.tsx` | Hook before declare | `useCallback` + useEffect ordning |
| `ArbetslivHubPage.tsx` | useMemo efter early return | Flyttade useMemo före Navigate |
| `firestoreNetworkStatus.ts` | prefer-const | `const pollId = setInterval(...)` |
| `scripts/smoke_arbetsliv_hub.mjs` | Stale wiring (VaultZoneGate i hub) | Matchar Valv-redirect + navTruth |
| `.context/locked-ux-features.md` | Saknade `arbetsliv_forensic` | Zon i §8 |

**Deploy krävs inte** för dessa fixar (frontend-only + smoke-skript). Functions-ändringar är lint-only (ingen beteendeförändring).

---

## Nästa steg (1) — manuell USER

Följ [`2026-05-31-fas5a-user-checklist.md`](./2026-05-31-fas5a-user-checklist.md):

1. **Fas 5A Vävaren HITL** — Godkänn/Avvisa i Dagbok
2. **#3** Valv PIN → post i `reality_vault`
3. **#4** Barnen/Familjen → `children_logs`
4. **#2d** Dagbok bilaga &lt;5 MB → `journal_memories`

Rapportera `PASS` eller `FAIL` + kort fel — agent uppdaterar `SMOKE_RESULTS.md`.
