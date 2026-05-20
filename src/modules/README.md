# Module Map — Livskompassen v2

Function-based frontend modules under `src/modules/`. Each module owns its UI, hooks, and local API wrappers; shared infrastructure lives in `core`.

```
src/modules/
├── core/                 # Layout, UI primitives, store, Firebase init, shared types
├── kompis/               # Kompis Agent — avatar, chat, Knowledge Vault API
├── verklighetsvalvet/    # Sacred Vault — WORM evidence, Fyren 3s + WebAuthn
├── kompasser/            # Dagens fokus, Morgon/Dag/Kväll-kompass UI
├── safe_harbor/          # BIFF / Grey Rock, VIVIR, micro-steps
├── ekonomi/              # Budget, likviditet, sparmål
├── dagbok/               # Progressive journal + Vävaren async tagging
├── barnens_livsloggar/   # Kasper/Arvid, Balansmätare, fysiologi
└── speglings_system/     # ACT + VIVIR + valvjämförelse (/speglar)
```

## Import convention

```tsx
import { MainLayout, BentoCard, useStore } from './modules/core';
import { KompisAvatar, KnowledgeVaultChat } from './modules/kompis';
import { VaultPage } from './modules/verklighetsvalvet';
```

## Backend (not moved)

Cloud Functions, Agent Cards, and DCAP live in `functions/` — frontend modules call them via Firebase callable functions in `kompis/api/`.
