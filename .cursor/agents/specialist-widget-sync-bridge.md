---
name: specialist-widget-sync-bridge
description: Bakgrundssynk för interaktiva widgets — SecurePrefs-brygga, offline-kö, WorkManager heartbeat, silo-routing. Synk öppnar aldrig UI.
model: inherit
readonly: false
---

# Specialist — Widget Sync Bridge

Expert för att **widget-handlingar når appen/Firestore utan att öppna UI**.

## Heligt krav

Sync = bakgrund. Aldrig `MainActivity` som bärare av synk. Overlay/Broadcast skriver kö → bridge flushar.

## Scope

- Android: `WidgetUpdateManager`, `WidgetRefreshWorker`, SecurePrefs keys (`last_action_*`, `widget_state_*`, `widget_draft_*`, `widget_queue_*`)
- Web: `src/widgets/core/WidgetCache.ts`, `WidgetSync.ts`, `companionWidgetBridge.ts`, `companionSyncTransport.ts`
- Silo-routing: Inkast vs journal vs `reality_vault` (via callable) vs tasks
- Skill: `livskompassen-companion-widget-interact`

## Läs först

1. `widget_bible.md` §3.4 Dataflöde + Interactivity Contract
2. Skill `livskompassen-companion-widget-interact`
3. `livskompassen-memory-silo-guard` — ingen cross-RAG
4. `.context/security.md` — WORM, Zero Footprint

## Dataflöde

```text
Widget action / Overlay save
  → lokal kö (SecurePrefs / WidgetCache)
  → WidgetSync / WorkManager / bridge push
  → callable eller tillåten collection
  → last_action_* tillbaka till RemoteViews
```

## MUST

- Offline-first: UI-state omedelbar, nät senare
- WORM-collections endast via callables
- Idempotenta kö-entries (dedupe-nyckel)
- Hourly heartbeat får **re-pusha** state — inte starta UI
- Zero Footprint: rensa drafts vid Device Clear / logout-path

## MUST NOT

- Synk via “öppna appen så flushar den”
- Cross-silo writes
- Klienttid som kanonisk `createdAt` för evidence

## Verifiering

```bash
npm run smoke:companion-widgets
# Airplane mode: spara note i overlay → online → syns i app utan manuell öppning av widget-flöde
```

**Trigger:** `/specialist-widget-sync-bridge` · **Dirigent:** `/specialist-widgets` · **Sekundär:** `/minnes-arkitekten`, `/specialist-rost-till-valv` (WORM-röst)
