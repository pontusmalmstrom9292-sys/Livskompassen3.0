# Improvement Waves Autorun — Fas 24 → färdig

**Syfte:** Ett kommando som kör nästa förbättringsvåg säkert (smoke → yolo-vakt → branch-commit).  
**Aktiv:** v49–v63 (Evigt Minne v55–v62 · **QA Harden v63**) · Manifest: [`.orkester/cursor-yolo-build-manifest.json`](../.orkester/cursor-yolo-build-manifest.json)  
**State:** [`.orkester/wave-machine-state.json`](../.orkester/wave-machine-state.json)

QA Harden (gratis UI-loop): [`docs/QA-HARDEN-LOOP.md`](./QA-HARDEN-LOOP.md) · `npm run qa:harden`

---

## Tryck Build

```bash
npm run minne:yolo:build          # Evigt Minne auto v55→v60
npm run waves:autorun -- --phrase="OK rules"
npm run waves:autorun -- --dry-run    # visa nästa våg (ska vara 49 första gången)
npm run waves:autorun                 # kör nästa ofullständiga våg (kräver CURSOR_API_KEY)
npm run waves:autorun:night           # max 1 våg
npm run smoke:wave-machine            # offline integrity
```

Efter manuell Agent-körning av en våg:

```bash
npm run waves:autorun -- --mark-done=49
```

Rollback vid FAIL:

```bash
npm run waves:rollback -- --version=49
```

---

## Säkerhetskedja (per våg)

1. `wave.lock` — en våg i taget  
2. Git-tag `pre-wave-vN` före start  
3. Scaffold kö/state från manifest  
4. SDK-agent (eller manuell Agent + `--mark-done`)  
5. `sdk-yolo-wave-gate` (default `static` för v49+; `full` på v54)  
6. Markera `status: completed` + uppdatera wave-machine-state  
7. Unattended: **commit på branch** — **ingen** auto-merge main, **ingen** deploy utan `OK deploy`

PMIR (`firestore.rules`, Barnporten kanon, `--apply`, …) → SKIP + blocker-eval. Se [`.orkester/sdk-pmir-register.json`](../.orkester/sdk-pmir-register.json).

---

## Vågor v49–v54

| V | ID | Agent | Fokus |
|---|-----|--------|--------|
| 49 | SOFT-DEBT | beslutsstod | Orphan UI, PDF-CTA, SPEC/hygien |
| 50 | ZONE-VALV-HJARTAT-FINISH | valv-builder | Verify + minimal fix |
| 51 | ZONE-VARDAGEN-FAMILJEN-FINISH | vardagen-builder | Widgets, HITL, Hamn |
| 52 | BACKEND-HARDEN | adk-weaver | Weaver U1, manifest, functions-diff |
| 53 | UX-POLISH-ANDROID-SYNC | ux-guardian | Polish + cap sync |
| 54 | SLUTGATE-FARDIG | yolo-vakt | predeploy:build GO/NO-GO |


## Vågor v63+ (Fas 24 Android + Companion Smart) — 2026-07-23

| V | ID | Status | Fokus |
|---|-----|--------|--------|
| W0 | WIDGETS-GOLD | DONE (main) | Companion Våg 1–4 already merged |
| 63 | CI-PREDEPLOY | DONE | language-id + unlock hygiene |
| 65–66 | SACRED-GHOST | DONE | deep-lock, escapeJs, ghost exit-after-unlock |
| 67–68 | EDGE-AURA | DONE | Mind/Aura bridges + WORM consumer (`edgeTags`) |
| 5–7 | COMPANION-SMART | DONE (kod) | Smart Time + Widget AI heuristics + Studio opt-in |
| HUMAN | G85-P0 | OPEN | device-ready pack — Pontus phone pass |

## Vågor v55–v62 (Evigt Minne)

| V | ID | Auto? | Fokus |
|---|-----|-------|--------|
| 55 | MINNE-G0-MACHINE | JA | Wave machine + phrase-gate + Vertex skill lock |
| 56 | MINNE-M1-RRF | JA | Hybrid RRF + citations |
| 57 | MINNE-M2-EMBED | JA | embedStatus + contentHash + FACT |
| 58 | MINNE-M3-GATES | JA | confirm→kunskap + HITL promote |
| 59 | MINNE-M4-ARCHIVE | JA | GCS archive dry-run |
| 60 | MINNE-GATE | JA | readyForRules hard stop |
| 61 | MINNE-RULES | **DONE** 2026-07-18 | Admin-only create (`OK rules` → deploy PASS) |
| 62 | MINNE-DEPLOY | **DONE** 2026-07-18 | functions + firestore (`OK deploy` → PASS) |

Historik v34–v48: `npm run sdk:yolo:full` (klar).

---

## Parallelspår G85 (människa)

Fas 24 P0: 7 dagars daily driver på telefon. Maskinen blockerar **inte** på detta, men v54-slut kräver att enhetsgate loggats. Checklista: [`docs/G85-DAILY-DRIVER-CHECKLIST.md`](./G85-DAILY-DRIVER-CHECKLIST.md).

---

## Relaterat

- [`ORKESTER-AUTORUN.md`](./ORKESTER-AUTORUN.md) — nattverifierare (ingen produkt-LLM)  
- [`FAS24-SPRINT-AUTORUN.md`](./FAS24-SPRINT-AUTORUN.md) — §24.4 zon-färdig via dessa vågor  
- [`PROJECT_STATE.md`](./PROJECT_STATE.md) — aktiv fas
