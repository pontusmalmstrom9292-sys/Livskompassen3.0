# shared/

Cross-cutting UI, hooks, and utils. Prefer **`@/shared`** or **`@/shared/ui`**, **`@/shared/hooks`**, **`@/shared/utils`**.

## Exports

| Barrel | Contents |
|--------|----------|
| `ui/` | `Button`, `Card`, `BentoCard`, `Input`, `Modal` |
| `hooks/` | `useDebounce`, `useForm` |
| `utils/` | `dateHelpers`, `formatters` (re-exports) |

## Migration

```tsx
// Before
import { BentoCard } from '@/modules/core/ui/BentoCard';
import { formatDateLocal } from '@/modules/core/utils/timeMath';

// After
import { BentoCard } from '@/shared/ui/BentoCard';
import { formatDateLocal } from '@/shared/utils/dateHelpers';
```

Legacy: `core/ui/BentoCard.tsx` and `core/utils/timeMath.ts` re-export from here until removed.
