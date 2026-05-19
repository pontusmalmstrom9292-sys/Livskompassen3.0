# safe_harbor — module plan

## Overview

Safe Harbor / BIFF-Skölden surface: cognitive offloading, VIVIR (facts vs noise), Grey Rock reply coaching without JADE.

## Files

| Path | Role |
|------|------|
| `components/SafeHarborPage.tsx` | Static feature list bento card |

## Status

| Area | Status |
|------|--------|
| SafeHarborPage | **partial** — marketing copy only |
| BIFF generator | **missing** — planned in chat UI |
| DCAP / Gräns-Arkitekten | **backend** — Agent Card exists |

## Dependencies

- `core/ui/BentoCard`
- Future: `kompis` chat for BIFF output

## Next steps

1. Add drawer or route from FloatingDock Shield icon.
2. Integrate BIFF response flow via Kompis → BIFF-Skölden agent.
3. Optional: paste ex-sms and get structured Grey Rock reply.

## Security notes

- Ex-message content is sensitive — process via authenticated callable, not client-side LLM keys.
- Do not persist raw messages without user consent and encryption (CMEK).
