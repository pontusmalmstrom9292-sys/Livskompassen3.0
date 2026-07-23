# Unlock — MOD-WIDGET Smart Time / Widget AI (Våg 5–7)

Date: 2026-07-23
approved: yes
Pontus OK: Cursor Agent «Implement the plan» Fas24 Companion Waves 2026-07-23

## Modules

| Modul | Scope |
|-------|--------|
| MOD-WIDGET | Android Smart Time periods 07/12/18/22 + night dim on Companion RemoteViews; heuristic Widget AI modes (harbor/single_task/family/anchor_only) via SecurePrefs/WidgetCache bridge; Studio demos; WidgetViews circadian without ThemeManager(null) |

## Syfte

Aktivera Gate C (bible 5.3–5.4) på hemskärm efter Gold Våg 1–4 — lokala heuristiker endast.

## MUST NOT

- Cloud LLM / Vertex / Gemini för widget-yta
- Cross-RAG (kunskap ↔ valv ↔ barn)
- Auto-write till reality_vault / journal / children_logs
- setInterval i WidgetSync / Smart Time
- Regress WIS → WidgetLaunch→MainActivity som primärväg
- Blanda Sacred android/.../core/** omstrukturering i samma Companion-våg

## Smoke

```bash
npm run smoke:companion-widgets
npm run smoke:widgets
npm run smoke:locked-ux
npm run smoke:module-lock
```

## Efter merge

`node scripts/lock_module.mjs MOD-WIDGET --smoke smoke:companion-widgets`
