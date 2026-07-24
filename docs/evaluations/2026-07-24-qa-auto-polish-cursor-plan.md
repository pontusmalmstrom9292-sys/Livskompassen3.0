# Cursor-plan: QA Harden auto-laga + UI polish per runda

**Datum:** 2026-07-24  
**Ägare:** Pontus  
**Status:** Fas 1 DONE — polish-pass inkopplad i qa:harden

## REASONS (kort)

| | |
|--|--|
| **R** | Efter varje QA-runda: auto-laga säkra fel + UI-polish, så flera rundor blir bättre — inte bara samma upptäckt igen |
| **E** | `qa_harden.mjs`, Tier A recipes, polish-pass, agent-kö (sync-*), smoke gates |
| **A** | Deterministiska recipes först; sedan begränsad polish-pass (CSS/tokens); agent-kö för det som kräver Cursor |
| **S** | `scripts/lib/qa_harden_polish_pass.mjs` + utöka recipes + hook i loop |
| **O** | Gratis, lokal, max N filändringar/runda, ingen deploy |
| **N** | Fas 24, Locked UX, Lead UI (polish ≠ redesign) |
| **S** | Tier B/C orörda; dock/chrome-lock orörd; Valv/biometri orörd; ingen blind CSS på hub-scroll |

## Fas 1 (MVP) — vad som byggs vid `Kör Fas 1`

1. **`qa_harden_polish_pass.mjs`** efter recipes varje runda:
   - Token-säker polish: `--ds-touch-target` / `min-height` på **icke-dock** ytor som flaggats TOUCH_TOO_SMALL (allowlist CSS, ej BastaDesign-dock)
   - Spacing/kontrast-småfixar endast i filer som redan nämns i findings (ingen bred redesign)
   - Max t.ex. 5 filer/runda
2. **Utöka Tier A recipes** där det finns känd säker patch (smoke/contentIsland redan finns)
3. **Loop-beteende:** runda N → detect → classify → recipes → **polish-pass** → smoke → om Tier A kvar och något ändrades → runda N+1; annars stopp
4. **Agent-kö** kvar (Cursor synkar manuellt eller via separat chat) — Fas 1 startar **inte** Cursor-agenter automatiskt från npm
5. Uppdatera `docs/QA-HARDEN-LOOP.md`

## Utanför Fas 1

- Auto-start av Cursor sync-agenter från shell  
- Ändra Locked UX / dock-etiketter / Valv  
- Generell “gör hela appen snyggare”-AI utan findings

## Safeguards

- Tier C: aldrig  
- Tier B: bara rapport till Pontus  
- `QA_AUTO_POLISH=0` stänger polish-pass  
- Diff ska gå att granska i git innan commit
