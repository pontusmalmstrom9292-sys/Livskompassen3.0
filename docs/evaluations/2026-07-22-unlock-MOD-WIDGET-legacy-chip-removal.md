---
title: Unlock MOD-WIDGET — Legacy chip removal (Kap. 6)
module: MOD-WIDGET
locked_ux: §23
date: 2026-07-22
approved: yes
approver: Pontus
via: plan Widget Kap6 Polish + Chip-rensning (default A)
---

# Unlock — Legacy chip widget removal

## Scope

Tillåt borttagning från Android widget-picker av **legacy `WidgetViews.chip()`-dubbletter** som ersatts av Companion rich RemoteViews:

1. `CompassWidgetProvider` (WH3 chip) — ersatt av `CompanionCompassWidgetProvider`
2. `HamnWidgetProvider` (WH4 chip) — ersatt av `CompanionHarborWidgetProvider`
3. `NoteWidgetProvider` (chip) — ersatt av `CompanionNoteWidgetProvider` + `RecordWidgetProvider` (discreet)

Inkluderar: provider Java, `res/xml/*_info.xml`, Manifest-registrering, och drawables/strings som **endast** chippen använder.

## Also allowed (same wave)

Kap. 6 ×10 visual polish på Companion 10-pack (web `src/widgets/pack/**` + Android `widget_companion_*.xml` / drawables) — ingen WIS-beteendeändring.

## Forbidden (fortfarande)

- Ta bort Companion 10-pack / Studio / HomeRail / WIS-stack
- Ta bort `RecordWidgetProvider`, WH7 ActionDashboard, WH8 Moduler, WH9 Utvecklingskort, DrogfrihetAkut
- Sacred `android/.../core/**`
- Nya pack-widgets utan separat unlock

## Smoke

```bash
npm run smoke:companion-widgets
npm run smoke:locked-ux
npm run smoke:module-lock
```

Smoke-asserts som kräver `NoteWidgetProvider` / legacy chips ska uppdateras till Companion-equivalents.
