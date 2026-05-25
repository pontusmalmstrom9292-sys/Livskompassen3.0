# Typografi-skala (runtime)

**Version:** 2026-05-25 · **Kod:** `src/modules/core/ui/typeScale.ts`

## Roller

| Token | Storlek | Font | Användning |
|-------|---------|------|------------|
| `eyebrow` | 10px, caps | Inter | Zonnamn (MåBra, Planering, …) |
| `titleHub` | xl, light | Outfit | Hub-rubrik |
| `leadHub` | sm | Inter | En mening under rubrik |
| `titleSection` | sm semibold | Outfit | Bento / sektionsrubrik |
| `body` | sm | Inter | Brödtext |
| `label` | xs caps | Inter | Kanban, mikrolabels |

## Hub-sidor

Använd `HubPageShell` eller `hubHeaderClasses()` — **inte** ad hoc `text-xl` / `text-xs` på samma element som `home-page__*`.

## Legacy

`design-master.md` §3 beskriver font-val; denna fil är **runtime-sanning** för storlekar.
