# Chapter 02 — Design Philosophy

> **Design Bible · Livskompassen 3.0**  
> **Theme:** Executive Midnight  
> **Previous chapter:** [01-Vision.md](./01-Vision.md)  
> **Next chapter:** [03-Core-Principles.md](./03-Core-Principles.md)

---

## Purpose

Chapter 01 states **what** Livskompassen is. This chapter explains **how to think** when making design decisions— the reasoning layer between vision and tokens.

Every designer, engineer, and AI agent must be able to answer: *"Why this surface, this hierarchy, this motion?"* using the frameworks here. Philosophy is not taste. It is a **repeatable decision method** that produces consistent results across Hjärtat, Vardagen, and Familjen without collapsing into generic patterns.

If Vision is the constitution, Design Philosophy is the jurisprudence.

---

## Philosophy

### Craft over template

Livskompassen interfaces should feel **handcrafted**, as if assembled by a small team of senior craftspeople—not generated from a component library catalog. This is not an invitation to redesign. The app is approximately **90% correct**. Philosophy demands **refinement**: polish surfaces that exist, elevate hierarchy, remove noise, deepen materials.

Inspired by (spirit, not imitation):

| Reference | What we borrow |
|-----------|----------------|
| Apple Human Interface Guidelines | Clarity, deference, depth — content leads, chrome supports |
| Apple Vision Pro spatial UI | Layered depth, glass, ambient light |
| Arc Browser | Restrained chrome, premium typography |
| Linear | Precision spacing, no visual clutter |
| Scandinavian product design | Warmth within minimalism, honest materials |

Explicitly **not** inspired by:

| Anti-reference | Why rejected |
|----------------|--------------|
| Material Design 3 | Generic shapes, ripple semantics, "Google app" feel |
| Bootstrap / admin templates | Flat cards, predictable grids, no soul |
| Notion / Airtable | White workspace, sidebar-first, SaaS density |
| Gaming HUD / cyberpunk | Neon, angular aggression, breaks safety |
| Duolingo / streak apps | Shame mechanics, dopamine badges |

### Deference to the person, not the software

The interface **serves** the user's nervous system. It never performs urgency the user did not ask for. Chrome is present but quiet. Content—reflection, evidence, family moments— receives the visual weight.

Three deference rules:

1. **Content first** — Hero cards, journal text, and evidence previews outrank decorative chrome.
2. **Chrome second** — Header and dock frame the experience; they do not compete with it.
3. **System last** — Sync status, network chips, and debug surfaces stay peripheral.

### Neuro-adaptive by default

The primary user profile includes ADHD (F90.0B), GAD (F41.1), hypervigilance, RSD, and recovery from allostatic overload. Design philosophy treats these not as edge cases but as **design drivers**:

| Cognitive reality | Design response |
|-------------------|-----------------|
| Working memory limits | One primary action per surface; max 3 open visual levels |
| Decision fatigue | Progressive disclosure; Chameleon morph instead of new menus |
| Time blindness | Gentle temporal cues (Fyren, dagens riktning)—never punitive countdowns |
| Rejection sensitivity | No red shame badges; neutral empty states |
| Hypervigilance | Predictable chrome positions; no surprise full-screen takeovers |
| Low-capacity days | Capacity-aware density reduction without hiding compass or SOS |
| Need for safety | WORM stability visually communicated; vault plausible deniability |

Neuro-adaptation is **not** dumbing down. It is **respecting bandwidth**.

### Premium calm, not luxury spectacle

"Premium" in Livskompassen means **trustworthy craftsmanship**—tactile glass, gold accents with restraint, layered shadow—not conspicuous consumption. Gold highlights **direction and identity** (compass, wordmark, primary CTA). It never decorates every border.

Calm and premium coexist:

```
Calm  = low frequency of change, muted palette, slow motion
Premium = material quality, typographic care, depth, intentional spacing
```

If a surface feels "exciting" but not "safe," it fails philosophy regardless of aesthetic polish.

### Life domains, not feature silos

The three zones (Hjärtat, Vardagen, Familjen) map to **how life is lived**, not how code is foldered. Visual design may use subtle bento accent coding (gold, indigo, mint) but zones must feel like **one product** under Executive Midnight—not three different apps stitched together.

Knowledge silos (Kunskap, Minne, Bevis) are **backend boundaries**. UI never exposes cross-silo RAG or leaks vault content into casual surfaces. Philosophy: **show the right door, never the wrong archive**.

### The Chameleon principle

> *The user chooses what they want to do; the interface adapts its tools—not the other way around.*

Instead of proliferating routes and top-level menus, Livskompassen morphs input shells in place (~350 ms fade). Philosophy:

- **One shell, many delegates** — Dagbok, Inkast, Ekonomi input share morph patterns
- **Mode lists capped at 4–6** visible choices; overflow via drawer or step 2
- **Logic ≠ skin** — Hooks and services never entangle with hex colors in JSX

Chameleon reduces **navigation anxiety**—the user stays oriented while the tool changes shape beneath them.

### Evidence as sacred object

Journal entries, vault documents, and WORM writes are **immutable evidence**. UI philosophy treats them differently from editable settings:

| Evidence UI | Settings UI |
|-------------|-------------|
| Stable typography, archival feel | Lighter, reversible affordances |
| Timestamp visible, edit restrictions clear | Inline edit expected |
| No gamification overlays | Toggles and sliders acceptable |
| Calm confirmation, never celebratory confetti | Standard save feedback |

The person must feel: *"This is held safely."*

---

## Visual Rules

Philosophy translates to these **non-negotiable visual postures**:

| Posture | Rule |
|---------|------|
| **Horizon** | Dark base recedes; foreground floats forward |
| **Warmth** | Gold accent on cold navy—never sterile blue-gray SaaS |
| **Softness** | Rounded corners (see Ch. 06–07); no sharp corporate rectangles |
| **Restraint** | Max one gold glow focal point per viewport |
| **Continuity** | Header, dock, compass positions fixed across zones |
| **Honesty** | Loading and empty states say what is true—no fake data |
| **Deniability** | Vault presence never advertised on shared/glance surfaces |

### Visual decision tree

When evaluating any mockup or PR screenshot, ask in order:

```
1. Does it increase felt safety?
   └─ No → reject

2. Does it reduce or increase cognitive load?
   └─ Increases → reject unless legally required

3. Does it strengthen compass / direction identity?
   └─ Neutral → acceptable if 1–2 pass

4. Does it feel handcrafted vs template?
   └─ Template → refine before ship

5. Does it preserve Executive Midnight material language?
   └─ No → sandbox only until promoted
```

### Aesthetic boundaries

**Allowed expression:**

- Glass panels with inner top highlight
- Ambient blobs (gold, indigo) at low opacity
- Scenic home background with gradient overlay
- Cinzel display labels with wide letter-spacing
- Custom SVG compass rose (never icon-font compass)

**Forbidden expression:**

- Material ripple effects as primary feedback
- Pulsing notification dots on home
- Gradient buttons in saturated purple/pink
- Dense data grids as default module layout
- Comic sans, system default without intent

---

## Sizing

Philosophy of scale—numeric tokens in Ch. 06–08.

| Principle | Rationale |
|-----------|-----------|
| **Thumb zone** | Primary actions within bottom 40% on mobile (G85) |
| **Compass prominence** | Largest interactive nav element—see Ch. 19 |
| **Reading measure** | Journal body ~65–75 characters per line ideal |
| **Compact ≠ cramped** | Low-capacity mode removes modules, not padding within kept modules |
| **Touch ≥ 44 pt** | Philosophy of respect—fingers are not mouse cursors |

Scale hierarchy (conceptual):

```
Display (Cinzel labels)  →  Title (Outfit)  →  Body (Inter)  →  Caption (Inter muted)
     largest                      ↓                  ↓                smallest
```

Never invert hierarchy for decoration (e.g., tiny wordmark, huge secondary label).

---

## Spacing

Spacing philosophy: **rhythm creates calm**.

| Concept | Guideline |
|---------|-----------|
| **Macro rhythm** | Section gaps larger than intra-card gaps (≥ 1.5×) |
| **Micro rhythm** | 4 px base grid; consistent padding inside cards |
| **Chrome isolation** | Fixed header/dock never overlap scroll content |
| **Island scrolling** | `calm-scroll-island` — content scrolls, world stays still |
| **Breathing hero** | Home hero card gets extra top/bottom margin—it's the emotional anchor |
| **Hub lock** | `hub-view-lock` prevents horizontal drift on zone landing |

Whitespace is **functional silence**. Do not fill it because the screen is dark.

---

## States

Philosophy of **interaction states**—component specs in later chapters.

### Emotional state mapping

| State | Design stance |
|-------|---------------|
| **Oriented** | Full hierarchy visible; gentle stagger on home |
| **Focused** | Reduced peripheral modules; journal fullscreen modes |
| **Depleted** | Capacity gate hides non-essential home cards; compass + SOS remain |
| **Protective** | Vault locked; Grey Rock tools available in Speglar without alarm UI |
| **Crisis** | SOS path short; high contrast on emergency numbers; no animation blocking exit |
| **Child (Barnporten)** | Playful within Familjen palette; adult evidence invisible |

### Feedback philosophy

| Action type | Feedback level |
|-------------|----------------|
| WORM save | Subtle confirm—"Sparat" or quiet check—never fireworks |
| Destructive | Explicit modal with plain Swedish copy |
| Navigation | Immediate visual active state on dock; no page-flash |
| Error | SystemErrorBanner—human language, one recovery action |
| Offline | FirestoreNetworkChip—inform, don't block |

States should **inform without interrogating** the user.

---

## Examples

### Example A — Progressive disclosure on home

**Pattern:** `exec-snabbstart-hub` collapsible quick-start

Philosophy demonstrated:

- Snabbstart hidden by default → reduces first-load anxiety
- Toggle uses Cinzel micro-label, gold border—premium but quiet
- Chevron rotation 250 ms—orienting, not playful

**Verdict:** ✅ Aligns with calm + clarity.

### Example B — Chameleon dagbok input

**Pattern:** `DagbokInputSuperModule` + delegates

Philosophy demonstrated:

- User picks mode (text, röst, tyst); shell morphs
- Low capacity forces minimal delegate via `isLowHomeCapacity`
- No new route per mode

**Verdict:** ✅ Chameleon + neuro-adaptive.

### Example C — Mabra capacity level 1

**Pattern:** `MabraGoalPanel` — "Låg kapacitet — max ett mikromål"

Philosophy demonstrated:

- Copy validates state without shame
- UI reduces choices, keeps module reachable

**Verdict:** ✅ Deference to bandwidth.

### Example D — Rejected pattern: streak leaderboard

Hypothetical: weekly journal streak ranking with flame icon.

Philosophy violations:

- Gamification → breaks safety for RSD profile
- Competes with reflection hero
- Introduces social comparison foreign to Life OS

**Verdict:** ❌ Never ship.

---

## Accessibility

Philosophy treats accessibility as **inclusive calm**, not compliance checkbox.

| Pillar | Philosophy |
|--------|------------|
| **Perceivable** | AA contrast minimum; never gold-on-gold body text |
| **Operable** | Touch targets, no timed-only interactions on critical paths |
| **Understandable** | Swedish plain language; icons always paired with labels in chrome |
| **Robust** | Semantic landmarks; compass alt text via aria-label on button |

Cognitive accessibility **is** accessibility here—WCAG plus bandwidth respect.

Reduced motion is not "less premium." Static compass with full material treatment is equally crafted.

Full spec: [28-Accessibility.md](./28-Accessibility.md).

---

## Animations

Motion philosophy: **orient, never perform**.

| Allowed | Forbidden |
|---------|-----------|
| Opacity fades | Bounce easing |
| Subtle Y translate (≤ 14 px) | Parallax scroll chains |
| Scale press ≤ 0.985 on card tap | Slot-machine number rolls |
| Stagger ≤ 80 ms on home | Infinite pulsing badges |
| 350 ms Chameleon morph | Auto-playing carousel |

Executive home easing: `[0.45, 0, 0.55, 1]` — symmetric calm curve.

Motion answers: *"Where did that come from?"* — never *"Watch this!"*

Implementation: [12-Animation-System.md](./12-Animation-System.md).

---

## Code Examples

### Chameleon shell pattern

```tsx
// Philosophy: one shell, many modes — user stays oriented
<ChameleonInputShell mode={mode} onModeChange={setMode}>
  {(displayed) => <DagbokDelegate mode={displayed} />}
</ChameleonInputShell>
```

### Capacity-aware rendering

```tsx
// Philosophy: reduce choices, not dignity
const lowCapacity = isLowHomeCapacity(evolutionDoc, capacityScore);
if (lowCapacity) return <DagbokTystDelegate />; // minimal surface
```

### Token-based skin (required)

```tsx
// Philosophy: logic layer never owns color
<div className="rounded-3xl border border-border/30 bg-surface-2/60 backdrop-blur-xl">
  <p className="text-text-muted">...</p>
</div>
```

```tsx
// ❌ Philosophy violation — hex in feature JSX
<div style={{ background: '#d4af37' }}>
```

### Executive motion hook

```tsx
// Philosophy: calm easing, respect reduced motion
const { reduced, staggerRoot, staggerChild } = useExecutiveHomeMotion();
return (
  <motion.section {...(reduced ? {} : staggerRoot)}>
    <motion.div {...(reduced ? {} : staggerChild)}>...</motion.div>
  </motion.section>
);
```

### Hub scroll island

```tsx
// Philosophy: world still, content moves
<div className="hub-page-shell--obsidian-bento hub-view-lock">
  <div className="calm-scroll-island flex-1 overflow-y-auto">...</div>
</div>
```

---

## Do

- Ask the five-question visual decision tree before approving any UI change
- Default to progressive disclosure when adding controls
- Use Chameleon morph for multi-mode input—not new top-level routes
- Validate low-capacity paths alongside full layouts
- Keep logic, shell, and skin in separate layers
- Write Swedish user copy; English for builder docs
- Preserve compass and header hierarchy in every mockup review
- Prototype risky ideas in Theme Lab before touching prod CSS
- Choose refinement over redesign when existing surface works

---

## Don't

- Don't add features that increase daily decision count without capacity relief elsewhere
- Don't use shame, streak loss, or red badge urgency on home
- Don't expose vault or evidence metadata on glance surfaces
- Don't mix Material Design interaction patterns as primary language
- Don't hardcode hex colors in `src/modules/features/**`
- Don't create parallel routes for every input mode
- Don't animate for decoration on evidence or crisis flows
- Don't treat sandbox experiments as canon until Bible + PMIR update
- Don't optimize for "engagement metrics" that conflict with calm

---

## Future Improvements

| Item | Notes |
|------|-------|
| **Philosophy scorecard** | Lightweight PR checklist auto-generated from this chapter |
| **Capacity design matrix** | Document all capacity levels (1–3) per zone with screenshots |
| **Barnporten philosophy addendum** | Child-safe design ethics—play without manipulation |
| **BIFF/Speglar UI ethics** | Grey Rock tools—support without JADE-inducing copy |
| **Theme pack philosophy** | When I-skymning mint is allowed vs Executive Midnight strict |
| **Cross-cultural calm** | Guidelines if UI expands beyond Swedish primary audience |

---

## Cross-references

| Topic | Chapter |
|-------|---------|
| Product vision & locked chrome | [01-Vision.md](./01-Vision.md) |
| Hard rules & invariants | [03-Core-Principles.md](./03-Core-Principles.md) |
| Color tokens | [04-Color-System.md](./04-Color-System.md) |
| Motion tokens | [12-Animation-System.md](./12-Animation-System.md) |
| Chameleon inputs | [21-Inputs.md](./21-Inputs.md) |
| Journal surfaces | [25-Journal.md](./25-Journal.md) |
| Accessibility detail | [28-Accessibility.md](./28-Accessibility.md) |
| AI agent rules | [32-AI-Rules.md](./32-AI-Rules.md) |

---

*End of Chapter 02 — Design Philosophy*
