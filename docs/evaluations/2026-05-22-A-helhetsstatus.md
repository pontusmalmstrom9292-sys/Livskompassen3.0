# Systemkontroll — A — 2026-05-22

**Trigger:** 2-timmars byggpass audit-byggpass-2026-05-22  
**Källor lästa:** `.context/system-plan.md`, `.context/security.md`, `.context/arkiv-minne.md`, `docs/GCP-INVENTORY-LATEST.md`, `docs/specs/modules/Arkiv-GAP-REGISTER.md`, `AGENTS.md`, `functions/src/index.ts`

## Sammanfattning

Fas 1–2 och större delen av Fas 3 är **klara**. G1–G15 och G9–G14 i detalj är **implementerade** (live smoke PASS 2026-05-22). Öppet: manuell smoke i app, opt-in minne-ingest, dokumentdrift (GAP-tabellhuvud + `.context/security.md`), och fyra P0-säkerhetsgap i runtime (client RAG, webhook ownerId, client-PIN, prompts utanför sharedRules).

## 1) Aktuell fas — öppna `[ ]`

| Sektion | Öppna punkter |
|---------|---------------|
| Kladd-konsolidering | Manuell ingest minne-poster (opt-in trauma-policy) |
| Fas 3 | Manuell smoke valv + barnen; `SMOKE_CHECKLIST.md` |
| system-plan L64–75 | Duplicerade/äldre notify-rader (G6 **done** i live-sektion) |
| Kommande fas | Minneloggning delvis (ingest + ANN klar) |

## 2) Röda tråden — runtime vs dokumentation

| Princip | Runtime | Docs |
|---------|---------|------|
| DCAP före LLM | `analyzeMessage` → supervisor + DCAP | PASS |
| Tre silor | Separata callables (`knowledgeVaultQuery`, `valvChatQuery`, `childrenLogsQuery`) | PASS |
| WORM | `firestore.rules` update/delete:false på bevis | PASS |
| Zero Footprint | `invalidateSession` + idle timeout; **inte** visibilitychange | **GAP** — system-plan L26 säger visibilitychange |
| G9–G14 | Kod **done** | Arkiv-tabellrad L17 säger **open** — drift |

## 3) Sacred Features

| Feature | Status | Verifiering |
|---------|--------|-------------|
| Verklighetsvalvet | **GAP** | WORM OK; gate client-PIN/WebAuthn |
| Sanningens Sköld | **PASS** | `reality_vault` create-only |
| Morgonkompassen | **PASS** | `/kompasser`, `checkins` |
| Dossier-Generator | **PASS** | `generateDossier`, smoke PASS |
| Speglings-Systemet | **PASS** | `speglingsMirror`, session-only |
| Zero Footprint | **PARTIAL** | Idle + invalidate; PIN i localStorage |
| Kill Switch | **PASS** | Shake ≥15 m/s² |

## 4) Top 3 öppna GAP

1. **P0** — `analyzeMessage` accepterar client `ragContext` (`functions/src/index.ts` L86–100).
2. **P0** — `notifyNewFile` `ownerId` från obunden body (L181–186).
3. **Doc + smoke** — `.context/security.md` G7–G14 **open** trots kod **done**; manuell smoke #2/#4 ej körda ikväll.

## 5) Rekommenderat nästa steg

**Ett steg:** Ta bort client `ragContext` från `analyzeMessage` och hämta Kunskap-RAG server-side per uid (P0).

## Blocker

Ingen deploy-blocker för build. Smoke mot moln kräver ADC.
