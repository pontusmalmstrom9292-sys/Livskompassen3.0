# Chapter 32 — AI Rules

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight (DAD v1.0)  
> **Previous chapter:** [31-Code-Standards.md](./31-Code-Standards.md)  
> **Next chapter:** [README.md](./README.md)

---

## Purpose

Canonical specification for **ai rules** in Livskompassen. Dad forbidden changes, agent decision tree, smoke:locked-ux, locked ux hard stops, pmir gates.

## Philosophy

Aligns with Ch. 01 Vision and Ch. 03 Core Principles — calm, premium, neuro-adaptive Life OS.

## Visual Rules

Executive Midnight material language applies. Token-based styling only (`var(--accent)`, `bg-surface-2`).

## Sizing

Follow `--ds-*` tokens and touch target minimums from Ch. 06.

## Spacing

Use spacing scale from Ch. 06; dock clearance on all scroll surfaces.

## States

All interactive states must be perceivable without relying on color alone.

## Examples

See production components cited in Code Examples and Cross-references.

## Accessibility

Cross-ref Ch. 28. Swedish primary copy; reduced motion respected.

## Animations

Cross-ref Ch. 12. Calm easing `[0.45, 0, 0.55, 1]`; no bounce.

## Code Examples

```tsx
// Token-compliant pattern
<div className="rounded-3xl border border-border/30 bg-surface-2/60 backdrop-blur-xl" />
```

## Do

- Follow DAD and locked UX registers
- Use Theme Lab before prod CSS changes
- Run `npm run smoke:locked-ux` after chrome edits

## Don't

- Hardcode hex in `src/modules/features/**`
- Ship sandbox experiments without Bible update
- Violate silo or WORM principles (Ch. 03)

## Future Improvements

Expand with automated lint gates and visual regression tests.

---

## Detail — AI Rules

**Focus:** DAD forbidden changes, agent decision tree, smoke:locked-ux, locked UX hard stops, PMIR gates

### Cross-references

| Topic | Chapter |
|-------|---------|
| Vision | [01-Vision.md](./01-Vision.md) |
| Core Principles | [03-Core-Principles.md](./03-Core-Principles.md) |
| Color | [04-Color-System.md](./04-Color-System.md) |
| Animation | [12-Animation-System.md](./12-Animation-System.md) |
| Code Standards | [31-Code-Standards.md](./31-Code-Standards.md) |

---

*End of Chapter 32 — AI Rules*
