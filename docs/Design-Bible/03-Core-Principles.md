# Chapter 03 — Core Principles

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Previous chapter:** [02-Design-Philosophy.md](./02-Design-Philosophy.md)  
> **Next chapter:** [04-Color-System.md](./04-Color-System.md)

---

## Purpose

Vision (Ch. 01) defines the destination. Philosophy (Ch. 02) defines how to think. **Core Principles** define what must **never break**—the invariants that survive refactors, theme experiments, and AI-generated code.

If a pull request violates a principle here, it **does not merge** unless PMIR + explicit product approval updates this chapter.

Principles are ordered by severity: **Security & data integrity → Locked UX → Design system → Performance**.

---

## Philosophy

Core principles exist because Livskompassen operates in **high-stakes life contexts**: custody documentation, child logs, recovery from chronic stress, and evidence that may be scrutinized legally. The UI is not neutral—it either ** reinforces trust** or ** erodes it**.

Three philosophical commitments underpin every principle:

1. **Integrity over convenience** — Never cross silos, never fake WORM, never leak vault state for UX shortcuts.
2. **Stability over novelty** — Locked chrome (Header, Dock, Compass, Home hero) anchors a dysregulated nervous system.
3. **Tokens over taste** — Visual decisions compile to CSS variables and Tailwind semantic classes, not developer preference.

Principles are **few and enforced**. Prefer one clear rule over ten ambiguous guidelines.

---

## Visual Rules

Principles with direct visual enforcement:

| ID | Principle | Visual enforcement |
|----|-----------|-------------------|
| P1 | **Executive Midnight only in prod** | No light-mode surfaces; no Material primary colors |
| P2 | **Token-only color** | `text-accent`, `bg-surface-2` — never `#d4af37` in features |
| P3 | **Compass centrality** | Compass ≥ 2× dock icon size; centered in dock |
| P4 | **Max 3 visual levels** | Hub: header → toolbar → content — no fourth nested chrome row |
| P5 | **Gold focal restraint** | One primary gold glow per viewport |
| P6 | **No shame UI** | No streak-loss red badges on home |
| P7 | **Plausible deniability** | Vault never labeled in public header when locked |
| P8 | **Glass material language** | Cards use calm-card / exec-surface patterns — not flat white |

### Principle hierarchy (conflict resolution)

When principles conflict, resolve in this order:

```
1. WORM / silo / Zero Footprint (data)
2. Locked UX (Header, Dock, Compass, Barnfokus, Valv tabs)
3. Accessibility (AA, touch 44px, reduced motion)
4. Executive Midnight material language
5. Performance (blur budget, bundle size)
6. Aesthetic polish
```

---

## Sizing

Principle-driven sizing constraints (tokens in Ch. 06–08):

| Principle | Constraint |
|-----------|------------|
| Touch integrity | `--ds-touch-target` ≥ 44px for all primary chrome |
| Dock clearance | Content respects `--app-dock-clearance` / `--ds-space-dock-clearance` |
| Compass lock | Hero compass `5.15rem`; never below `2.65rem` in dock |
| Readable evidence | Journal/evidence body ≥ 14px (16px preferred) |
| Capacity reduction | Hide modules, not minimum touch sizes |

---

## Spacing

| Principle | Constraint |
|-----------|------------|
| Island calm | Hubs use `calm-scroll-island` — background fixed |
| View lock | `hub-view-lock` prevents horizontal layout shift |
| Chrome margin | Fixed header/dock never overlap scrollable main |
| Progressive density | Low capacity reduces **module count**, not **padding within modules** |

---

## States

Principles govern **state semantics** across the app:

| State domain | Principle |
|--------------|-----------|
| **Auth** | Anonymous allowed; vault requires PIN; no vault hint when locked |
| **WORM write** | Append-only UI — no edit/delete affordances on evidence rows |
| **Offline** | Inform via chip; never block SOS or journal draft locally |
| **Capacity** | System adapts density; user never punished with shame copy |
| **Kill switch / panic** | `clearSynapseState` — no sensitive RAM after trigger |
| **Child mode** | Barnporten shell isolates adult evidence surfaces |

Component-level states (hover, focus) inherit from these domain rules.

---

## Examples

### Example A — ✅ Token-compliant card

```tsx
<div className="calm-card p-4 border-border/30 bg-surface-2/60">
  <p className="text-text-muted">Dagens reflektion</p>
</div>
```

**Principles satisfied:** P2 (tokens), P8 (glass material).

### Example B — ❌ Hex in feature module

```tsx
<div style={{ borderColor: '#d4af37' }}>...</div>
```

**Violated:** P2. Must use `border-accent/30` or `var(--border)`.

### Example C — ✅ Silo-correct query UI

Kunskap search only calls `knowledgeVaultQuery` — results labeled "Kunskap". No "search everywhere" toggle.

**Principles satisfied:** U1 tre silos (see Security Principles below).

### Example D — ❌ Compass demoted to menu item

Compass moved to hamburger-only navigation, dock shows five equal icons.

**Violated:** P3, Locked UX (Ch. 01, DAD). Rejected without PMIR.

### Example E — ✅ Locked Barnfokus delegate

`FamiljenBarnfokusDelegate` with `BARNFOKUS_QUESTIONS` pool intact, optimistic save feedback.

**Principles satisfied:** Locked UX, ADHD-safe feedback.

---

## Accessibility

Core accessibility principles (detail in Ch. 28):

| ID | Principle |
|----|-----------|
| A1 | WCAG 2.1 AA contrast minimum on all body text |
| A2 | `prefers-reduced-motion` disables stagger and hero motion |
| A3 | All dock/header controls have accessible names (Swedish) |
| A4 | Touch targets ≥ 44px — non-negotiable on G85 |
| A5 | Cognitive accessibility = one primary action per surface |
| A6 | Crisis flows (SOS) never gated behind animation delays |

Accessibility violations are **P0** — same severity as silo breach for merge purposes.

---

## Animations

| ID | Principle |
|----|-----------|
| M1 | Easing `[0.45, 0, 0.55, 1]` for executive surfaces — no bounce |
| M2 | Chameleon morph ~350ms — orientation, not entertainment |
| M3 | No infinite pulse on home unless SOS/network critical |
| M4 | Reduced motion = static but fully styled (not broken layout) |
| M5 | Evidence save = subtle feedback — no confetti |

---

## Code Examples

### Security & data principles (U1–U4)

```typescript
// U1 — Silo-scoped query ONLY
await knowledgeVaultQuery({ query, uid }); // Kunskap
await valvChatQuery({ query, uid });     // Valv — PIN gated
// NEVER merge results from both into one UI list
```

```typescript
// U3 — WORM: server timestamp, append-only
await addDoc(journalRef, {
  content,
  createdAt: serverTimestamp(), // MUST — never client-only time on evidence
});
```

```typescript
// U4 — Zero Footprint on logout
clearSynapseState();
// No vault content in sessionStorage after kill switch
```

### Design system principles

```typescript
// P2 — tokens.ts for programmatic color (not hex scatter)
import { DESIGN } from '@/core/ui/tokens';
const border = DESIGN.border; // rgba(212, 175, 55, 0.12)
```

```tsx
// P3 — Compass size lock
<ExecutiveDecorCompass size="hero" /> // dock center only
```

```tsx
// Chameleon layer separation (Philosophy + Principle)
// Logic in hook — skin in className
const { mode, setMode } = useDagbokMode();
return (
  <ChameleonInputShell mode={mode} onModeChange={setMode}>
    {(m) => <DagbokDelegate mode={m} />}
  </ChameleonInputShell>
);
```

### Tailwind semantic colors (required)

```tsx
// ✅
className="bg-surface-2 text-text border-border/30"

// ❌
className="bg-[#1a1a1a] text-[#f8fafc]"
```

---

## Do

### Security & architecture
- Enforce **tre silos** in every RAG/search UI — Kunskap, Valv, Barnen separate
- Route via **DCAP in code** before LLM (`routeFromDcap`, `classifyInboxDocument`)
- Use **server timestamps** on all WORM writes
- Call **`clearSynapseState`** on logout, blur, panic
- Run **`npm run smoke:locked-ux`** before merging chrome/locked module changes

### Design system
- Use **CSS variables** and Tailwind semantic tokens exclusively in `src/modules/features/**`
- Preserve **Header → Ögat → Hero → Compass** hierarchy on home
- Keep **logic / shell / skin** in separate files
- Prototype visual changes in **Theme Lab** before prod CSS
- Respect **`--app-dock-clearance`** on all scrollable pages

### Process
- Update this chapter when a new invariant is approved via PMIR
- Cite principle ID in PR descriptions when enforcing rules
- Fix code when Bible and implementation diverge (unless deliberate DAD change)

---

## Don't

### Security & architecture (hard stop)
- **Don't** create a fourth RAG silo or cross-read silos "for convenience"
- **Don't** let LLM decide auth, silo routing, or WORM mutations
- **Don't** allow `update`/`delete` on WORM collections from UI
- **Don't** auto-promote child logs to Valv without HITL
- **Don't** store vault content in client RAM after kill switch
- **Don't** merge `firestore.rules` / `storage.rules` changes without PMIR

### Locked UX (hard stop without PMIR)
- **Don't** remove Barnfokus, Valv Mönster/Orkester, Barnporten HITL, Planering P3 Kanban
- **Don't** move compass off-center or into hamburger-only nav
- **Don't** replace Executive Midnight with light/Material theme in prod
- **Don't** add Valv toggle to public drawer (plausible deniability)
- **Don't** delete `ChameleonInputShell` / SuperModule pattern without approval

### Design system
- **Don't** hardcode hex in feature modules (P0 tech debt)
- **Don't** add gamification streaks/shame to home
- **Don't** expose vault metadata on glance surfaces
- **Don't** ship Theme Lab experiments to prod routes without Bible update
- **Don't** use hover-only paths for critical actions on mobile

---

## Future Improvements

| Item | Priority |
|------|----------|
| Automated principle linter (hex in features/, compass size) | P1 |
| PR template with principle checklist | P1 |
| Principle violation catalog linked to smoke tests | P2 |
| Cross-reference matrix: principle ↔ smoke test ↔ rule file | P2 |
| Child-mode principle appendix (Barnporten) | P2 |
| Visual regression suite for locked chrome | P3 |

---

## Principle register (quick reference)

### U1–U6 (architecture — from grunder-kanon)

| ID | Principle |
|----|-----------|
| **U1** | Tre silos — never cross-RAG |
| **U2** | DCAP before LLM — routing in code |
| **U3** | WORM append-only — server timestamp |
| **U4** | Zero Footprint — clear state on logout/panic |
| **U5** | ADK orchestration — extend executors without silo blend |
| **U6** | Content class FACT/REFLECTION/PLAY/EVIDENCE — correct zone |

### P1–P8 (visual — this chapter)

See Visual Rules table above.

### L1–L6 (locked UX — summary)

| ID | Feature |
|----|---------|
| **L1** | Header executive premium — LIVSKOMPASSEN + Ögat |
| **L2** | Dock + center compass |
| **L3** | Home hero — Dagens Reflektion |
| **L4** | Barnfokus delegate + question pool |
| **L5** | Valv tabs — Mönster, Orkester, Kunskapsbank, Aktörskarta |
| **L6** | Planering P3 Kanban at `/planering` |

Full locked UX: `.cursor/rules/locked-ux-features.mdc` · `.context/locked-ux-features.md`

---

## Cross-references

| Topic | Chapter |
|-------|---------|
| Vision & mantra | [01-Vision.md](./01-Vision.md) |
| Decision philosophy | [02-Design-Philosophy.md](./02-Design-Philosophy.md) |
| Color tokens | [04-Color-System.md](./04-Color-System.md) |
| Header (locked) | [17-Header.md](./17-Header.md) |
| Dock (locked) | [18-Dock.md](./18-Dock.md) |
| Compass (locked) | [19-Compass.md](./19-Compass.md) |
| Code standards | [31-Code-Standards.md](./31-Code-Standards.md) |
| AI agent rules | [32-AI-Rules.md](./32-AI-Rules.md) |

---

*End of Chapter 03 — Core Principles*
