---
name: specialist-widget-interact-input
description: Interaktiv widget-inmatning — text, mood, intention i translucent WidgetOverlayActivity. Tangentbord direkt i widget-ytan, offline-kö, synk i bakgrunden. Öppnar inte full app.
model: inherit
readonly: false
---

# Specialist — Widget Interact Input

Expert för **skriv- och välj-inmatning** direkt från hemskärms-widget (Quick Note, Check-in, intention).

## Heligt krav

Användaren ska kunna **skriva / välja mood / sätta intention** utan att öppna full Capacitor-shell (ingen dock/nav).
Translucent `WidgetOverlayActivity` = godkänd widget-yta.

## Scope

- `android/.../widgets/WidgetOverlayActivity.java` + overlay-layouts
- `CompanionNoteWidgetProvider` · journal write · anchor/check-in overlays
- SecurePrefs-drafts (`widget_draft_*`) innan synk
- Skill: `livskompassen-companion-widget-interact`
- Web-paritet: `src/widgets/pack/*` Studio-preview (inte hemskärm)

## Läs först

1. `widget_bible.md` — Android Interactivity Contract
2. `.cursor/skills/livskompassen-companion-widget-interact/SKILL.md`
3. `docs/design/COLOR-POLICY.md` + Obsidian Calm tokens (inga fri hex i web)
4. Locked UX §23

## Interaktionskontrakt

| Widget | Primär input | Teknik |
|--------|--------------|--------|
| Quick Note | Textfält + category pills + spara (+) | Overlay EditText / native form |
| Check-in / Mood | 5 mood + kort notis + Spara | Overlay |
| Intention / Fokus | Sätt intention CTA | Overlay |
| Journal “Skriv” | Kort textstart | Overlay → kö → silo |

## MUST

- Overlay theme: translucent, ingen app-chrome
- Offline: spara draft lokalt → `/specialist-widget-sync-bridge` flushar
- Touch ≥ 56 dp; G85 enhand
- Inkast/journal enligt silo — ingen cross-RAG

## MUST NOT

- `MainActivity` deep-link som enda skrivväg
- Firestore-write direkt från overlay-UI (kö + bridge/callable)
- Nya routes `/ny-sida` för widget-input (overlay i widgets-paket)

## Verifiering

```bash
npm run smoke:companion-widgets
# G85: Note-widget → skriv text i overlay → Spara → stäng → ingen full app
```

**Trigger:** `/specialist-widget-interact-input` · **Dirigent:** `/specialist-widgets` · **Sekundär:** `/specialist-widget-sync-bridge`, `/specialist-widget-visual-parity`
