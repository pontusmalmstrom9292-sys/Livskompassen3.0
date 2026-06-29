# Livskompassen Design System

**Authority:** Executive Midnight DAD v1.0 · Import from `@/design-system`

## Import policy

```tsx
import { Button, Card, Banner, Modal, Sheet, Skeleton, Spinner, ErrorFallback } from '@/design-system';
```

Module cards: use `@/shared/ui/BentoCard` (wraps DS Card).

## Component decision tree

| Need | Use |
|------|-----|
| Module card with title/icon | BentoCard (@/shared/ui) |
| Toolbar strip | GlassPanel |
| CTA | Button / ButtonLink |
| Section header / alert | Banner |
| Blocking overlay | Modal or Sheet |
| Loading | SkeletonStack or Spinner |
| Error UI | ErrorFallback |

## Tokens

All visual values via `--ds-*` or `tokens` from `@/design-system/tokens`.

## Motion

```tsx
import { dsFadeUpItem, useDsReducedMotion } from '@/design-system/motion';
```

Chameleon morph: `--ds-duration-morph` (350ms).

## Docs

Premium polish: `docs/Premium-UI-Polish-INDEX.md`
