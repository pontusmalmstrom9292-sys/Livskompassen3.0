# Companion Android — rich RemoteViews (Gold Standard)

Date: 2026-07-22  
Scope: `android/.../widgets/` only — **no** Sacred `core/**`  
Bible: Kap 1–6 · Unlock: `docs/evaluations/2026-07-21-unlock-MOD-WIDGET-companion-android-interact.md`

## G85 — fäst på hemskärmen

1. Långtryck på hemskärmen → **Widgets** → **Livskompassen**.
2. Dra ut t.ex. **Hemlig inspelning** (Capture).
3. **Capture:** ett tryck på mic → inspelning startar (`?autostart=1`). Inget andra «spela in»-steg.
4. Efter APK-uppdatering: ta bort widgeten och fäst igen så rich-layout gäller.

Studio (Inställningar → Widget Studio) = guided preview · **inte** samma flöde som Android-pin.

## Rich 10-pack

| # | Widget | Layout | Storlek | Intents |
|---|--------|--------|---------|---------|
| 1 | Capture | `widget_companion_capture` | Small **250×110** | Mic → `?autostart=1` |
| 2 | Compass | `widget_companion_compass` | Large **250×250** | Disc/CTA → `?focus=1` |
| 3 | Note | `widget_companion_note` | Small **250×110** | Foto/röst/compose multi-PI |
| 4 | Inbox | `widget_companion_inbox` | Small **250×110** (NOT XS) | Text/Röst/Foto/Länk |
| 5 | Anchor | `widget_companion_anchor` | XS **110×110** | Klar → `?focus=1` |
| 6 | Child | `widget_companion_child` | Medium **250×180** | Svara → `?focus=1` (§12 additiv) |
| 7 | Beacon | `widget_companion_beacon` | Medium **250×180** | Ring/CTA → `?focus=1` |
| 8 | Tasks | `widget_companion_tasks` | Small **250×110** | max 3 rader + Visa alla |
| 9 | Journal | `widget_companion_journal` | Small **250×110** | Skriv → `?write=1` |
| 10 | Harbor | `widget_companion_harbor` | Small **250×110** | Lotus + 4 quick |

Alla `info.xml`: `initialLayout` + `previewLayout` = rich (inte `widget_dock_tile`).

## Routing

- **voice** (Capture) → lokal kö / Valv WORM via bakgrundssynk (overlay hold-to-record)
- **text** → Inkast-kö via overlay (ingen full app)
- **toggle** → BroadcastReceiver in-place
- Photo still secondary deep-link (system picker)
- Ingen Sacred `core/**`-omstrukturering

## WIS (2026-07-22)

Primary path: `WidgetInteract` → overlay | broadcast. See `widget_bible.md` §7 · skill `livskompassen-companion-widget-interact`.

## Gate A–H

| Gate | Status |
|------|--------|
| A autostart one-tap | Capture mic ✅ |
| B last_action_* | scoped per widget ✅ |
| C Smart/AI | **DEFER** Våg 5+ |
| D Kap 6 Gold + signatur | Studio + Android guldring/ethereal ✅ |
| E gyllene regel | Shared OS, ingen fork ✅ |
| F ≥56 dp | mic/inbox/note ✅ |
| G offline cache-first | WidgetCache ✅ |
| H Shared OS + Android PI | WidgetLaunch Stamp ✅ |

## Gate C — Smart Time + Widget AI (Våg 5)

| Feature | Status |
|---------|--------|
| Smart Time 07/12/18/22 | `smartTimeContext` + Hem-rail period badge |
| Night dim | `cw-home-rail--dim` when period=night |
| Widget AI modes | harbor / single_task / family / anchor_only |
| pauseProactive | max 1 featured på Hem |
| Studio demos | låg energi · stress · många uppgifter · barnvecka |
| No setInterval | timeout on period boundary only |

Studio toggles: Inställningar → Widget Studio → Smarta lager.
