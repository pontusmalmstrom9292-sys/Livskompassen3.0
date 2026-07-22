# YOLO-vakt — Read-only audit

| Fält | Värde |
|------|-------|
| **Datum** | 2026-07-13 |
| **Plattform** | Cursor (YOLO-vakt read-only) |
| **Scope** | `main` ≡ working tree · Locked UX · WORM · tre silos · PMIR-stopp · smoke-baseline |
| **Commit** | `1641939f5` — `chore(prompts): synka prompt-speglar med sharedRules.ts` |
| **Branch** | `fix/appcheck-native-debug-g85` (identisk SHA med `main`) |
| **Working tree** | Ren — inga staged/unstaged ändringar |

---

## Sammanfattning

Kodbasen på nuvarande `main`/HEAD uppfyller säkerhetskanon för merge och lokal smoke-baseline. Alla kritiska statiska och live-smokes passerade 2026-07-13. Inga PMIR-områden är modifierade i working tree. Kvarvarande luckor är operativa (G85 daily driver) och governance-hygien (extern-AI sync), inte säkerhetsregressioner.

**Dom: GO**

---

## PASS / GAP-tabell

| # | Kontroll | Resultat | Bevis |
|---|----------|----------|-------|
| 1 | **Tre silos — ingen cross-RAG** | **PASS** | `masterManifest.ts` — K/V/F har `allowedCrossReads: []`; `assertSiloIsolation` i `manifestGuards.ts` + `firestore.ts`; `smoke:manifest` stoppar kunskap→valv |
| 2 | **LLM styr inte auth/WORM** | **PASS** | `smoke:valv-gate` — `valvChatQuery`/`getEntityProfileRegistry` nekas utan vault-session; WORM-skrivning client-side nekad (`smoke:vault-worm`) |
| 3 | **Prompts endast `sharedRules.ts`** | **PASS** | `smoke:prompts` — mirror sync OK, runtime scan OK, governance-filer validerade |
| 4 | **Locked UX intakt** | **PASS** | `smoke:locked-ux`, `smoke:e2e-locked-ux` (10/10 Playwright), `smoke:plausible-deniability`, `smoke:locked-icons`, `smoke:module-lock` (21/22 locked) |
| 5 | **Plausible deniability** | **PASS** | `smoke:plausible-deniability` — Fyren/handoff, `private_child`-filter, dossier kräver Valv-unlock |
| 6 | **Zero Footprint** | **PASS** | `useZeroFootprint` i `App.tsx`; blur/idle via G17 (`visibilitychange`/`pagehide`); `invalidateSession` vid logout; smoke valv-security session hardening |
| 7 | **Ingest HITL trauma/osäker** | **PASS** | `smoke:weaver-hitl`, `smoke:inbox` — trauma→review, bevis→`reality_vault`, aldrig `kb_docs` för bevis |
| 8 | **Bevis → `reality_vault`, inte `kb_docs`** | **PASS** | `firestore.rules` WORM på `reality_vault`; `driveIngestSynapse.ts` + `sharedRules.ts` routing-kanon; `smoke:inbox` bevis-routing OK |
| 9 | **WORM collections** | **PASS** | `journal`, `reality_vault`, `children_logs`, `dcap_alerts`, `dossier_snapshots`, `evolution_ledger` — `update/delete: if false` (client); live verifierat |
| 10 | **PMIR-stopp** | **PASS** | Ren working tree; inga diff mot `main`; inga pågående ändringar i `firestore.rules`, locked UX eller `sharedRules.ts` |
| 11 | **Smoke-baseline (build + tier1)** | **PASS** | `npm run build` OK · `npm run smoke:predeploy` OK (alla delsteg) |
| 12 | **Smoke-baseline (live/prod-gate)** | **PASS** | `npm run smoke:predeploy:live` OK — vault-worm, dcap-alerts-worm, inbox, valv-gate |
| 13 | **Orkester / ADK wiring** | **PASS** | `npm run smoke:orkester` — journal_woven opt-in, dcap_alert WORM, functions build |
| 14 | **Governance docs** | **PASS** | `npm run smoke:governance` — 20 filer, module-lock register OK |
| 15 | **Kostnadsvakt** | **PASS** | `smoke:cost-guard` — inga dyra tjänster i kod |
| 16 | **Arkiv-GAP-register** | **GAP (info)** | G1–G17 + F8 **done**; V1 Genkit **wait** (dokumenterad defer, ej migrera) |
| 17 | **Fas 24 P0 — G85 daily driver** | **GAP (operativ)** | `PROJECT_STATE.md` — smoke grön men 7-dagars G85 daily driver ej slutförd |
| 18 | **Extern-AI integration packs** | **GAP (hygien)** | `INTEGRATION-SAFETY-MANIFEST.md` senast 2026-06-21; hook varnar >24h stale — kör `npm run integration:sync:all` |
| 19 | **Executive home screenshot** | **GAP (låg)** | `smoke:executive-home-visual` PASS med skip — dev server ej igång på :5174 |

---

## Smoke-körning (2026-07-13)

| Kommando | Exit | Notering |
|----------|------|----------|
| `npm run build` | 0 | Frontend byggd på 16.5s |
| `npm run smoke:locked-ux` | 0 | Barnfokus, Valv-baksida, Planering, Widget, Barnporten |
| `npm run smoke:orkester` | 0 | SynapseBus, dcap_alert WORM, functions build |
| `npm run smoke:governance` | 0 | AI governance + module-lock |
| `npm run smoke:predeploy` | 0 | Full tier1 + valv-security + plausible-deniability + e2e-locked-ux (10/10) + cost-guard |
| `npm run smoke:predeploy:live` | 0 | vault-worm, dcap-alerts-worm, inbox live |
| `npm run smoke:vault-worm` | 0 | create OK; update/delete/shadow field nekad live |
| `npm run smoke:valv-gate` | 0 | Callable gate utan vault-session nekad |
| `npm run smoke:children` | 0 | childrenLogsQuery, ingen private_child-läcka |

---

## Detaljgranskning per fokusområde

### Locked UX

Verifierat via statisk smoke + Playwright e2e (g85-mobile):

- Barnfokus ej exponerat utan auth (`/familjen`)
- Valvet/Mönster-flik kräver inloggning
- `/hjartat?tab=bevis` omdirigerar till Valv (ej publik bevis-flik)
- Valv-drawer blockeras utan upplåst session
- SOS i main chrome, executive premium header/dock låst
- Modulregister: 22 moduler, 21 locked — inga otillåtna diff i ren tree

### WORM

`firestore.rules` — append-only på sacred collections:

- `journal`, `reality_vault`, `children_logs` — client `update, delete: if false`
- `dcap_alerts`, `dossier_snapshots` — endast Admin SDK (client create/update/delete nekad)
- `evolution_ledger` — client create nekad

Live-prober (`smoke:vault-worm`, `smoke:dcap-alerts-worm`) bekräftar PERMISSION_DENIED på förbjudna operationer.

Retention: G5 done — WORM allowlist i `retentionJob.ts` (dokumenterat i GAP-register).

### Tre silos

| Silo | Firestore | RAG / agent | Cross-read |
|------|-----------|-------------|------------|
| Kunskap | `kampspar`, `kb_docs` | `knowledgeVaultQuery` | `[]` |
| Valv | `reality_vault` | `valvChatQuery` | `[]` |
| Barnen | `children_logs` | `childrenLogsQuery` | `[]` |

Core-domänen tillåter synapse-koordinering (`allowedCrossReads: ['kunskap','valv','barnen','vardag']`) — metadata only, inte cross-RAG data.

Inkast (G10): bevis→valv, kunskap→kb_docs, barnen→children_logs, trauma→review-kö.

### PMIR-stopp

Inga aktiva kodändringar i PMIR-zoner:

- `firestore.rules` / `storage.rules` — oförändrade i tree
- Locked UX (Barnporten, Valv Mönster/Orkester, Planering-widget) — smoke-gröna, ingen diff
- `sharedRules.ts` — senaste commit är prompt-mirror sync (godkänd kanon)
- Prod deploy kräver fortfarande explicit Pontus OK per `.cursor/index.mdc`

### Smoke-baseline vs kanon

YOLO smoke-gate (`build && smoke:locked-ux && smoke:orkester`) — **PASS**.

Utökad merge-gate (`smoke:predeploy` + `smoke:predeploy:live`) — **PASS** 2026-07-13.

`smoke:predeploy:build` kördes inte som ett kommando men `build` + `smoke:predeploy` (som inkluderar `smoke:orkester` med functions build) täcker samma yta.

---

## Git / trunk-status

```
HEAD  = main = 1641939f55d4b4dd6413b7ffa9e7cdd46d3c9de6
diff main...HEAD = 0 filer
working tree = clean
```

Branch-namnet `fix/appcheck-native-debug-g85` pekar på tidigare arbete men innehållet är redan trunk-ekvivalent med `main`.

---

## GO / NO-GO

### **GO**

Säkerhetskanon uppfylld. Merge till `main` blockeras inte av kod eller smoke. Prod-deploy kan påbörjas efter PMIR-rutin (Pontus OK) — ingen ny säkerhetsregression identifierad i denna audit.

---

## Nästa steg (exakt ett)

**Fortsätt Fas 24 P0: logga G85 7-dagars daily driver** (Motorola G85, Android/Capacitor) — smoke är grön men operativ prod-mognad kräver avslutad 7-dagars fältlogg enligt `docs/PROJECT_STATE.md` innan prod-push behandlas som slutgiltig GO.
