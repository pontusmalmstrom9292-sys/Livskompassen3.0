# Livskompassen Premium UI Design System

**Location:** `src/design-system/`  
**Theme:** Executive Midnight (`ME-basta-design`)  
**Principle:** No redesign — token-driven primitives preserving layouts, navigation, and functionality.

## Quick start

```tsx
import { Card, Button, Modal, Sheet, tokens, cn } from '@/design-system';
```

Legacy: `import { BentoCard, Button } from '@/shared/ui'`

## Tokens

| Category | CSS | TS |
|----------|-----|-----|
| Colors | `--ds-color-*` | `tokens.colors` |
| Spacing | `--ds-space-*` | `tokens.spacing` |
| Typography | `--ds-font-*` | `tokens.typography`, `textStyles` |
| Radius | `--ds-radius-*` | `tokens.radius` |
| Blur | `--ds-blur-*` | `tokens.blur` |
| Glass | `--ds-glass-*` | `tokens.glass` |
| Elevation | `--ds-elevation-*` | `tokens.elevation` |
| Shadow | `--ds-shadow-*` | `tokens.shadow` |
| Animation | `--ds-duration-*` | `tokens.animation` |

## Components

Card, GlassPanel, Banner, Button, Input, Modal, Sheet, Badge, Avatar, Icon, Section, Header, Dock, Navigation

See `src/design-system/components/index.ts` for exports.

## Docs

- [Design Bible](../Design-Bible/README.md)
- [UI Audit](../UI-Audit.md)
