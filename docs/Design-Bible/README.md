# Livskompassen Design Bible

**Status:** Official source of truth for all UI decisions  
**Authority:** Supersedes informal notes, sandbox experiments, and agent drafts unless explicitly promoted via PMIR  
**Theme:** Executive Midnight (Design Authority Decision v1.0)  
**Last updated:** 2026-06-28

---

## What this is

The Design Bible is not supplementary documentation. It is the canonical specification for Livskompassen's visual language, interaction patterns, and implementation contracts. An experienced developer should be able to recreate the application's look, feel, and behavior from these chapters alone, cross-referenced with route and data specs elsewhere.

Every future UI decision must trace back to a chapter here—or trigger a Bible amendment with explicit approval.

---

## Relationship to other sources

| Source | Role |
|--------|------|
| **This Design Bible** | Canonical visual + interaction specification |
| `.cursor/rules/design-calm.mdc` | Locked DAD decisions (Header, Dock, Compass, Home) |
| `src/styles/obsidian-calm-2.css` | Runtime CSS for glass, cards, hub chrome |
| `src/styles/executive-chrome.css` | Executive Midnight production skin |
| `src/modules/core/theme/themeRegistry.ts` | Theme pack tokens (I-stone default) |
| `src/modules/core/ui/tokens.ts` | TypeScript token export for components |
| `/dev/theme-lab` | Experiment sandbox — not production canon until promoted |

When code and Bible diverge, **fix the code** unless a deliberate design change is approved.

---

## Chapter index

| # | File | Title | Status |
|---|------|-------|--------|
| 01 | [01-Vision.md](./01-Vision.md) | Vision | Complete |
| 02 | [02-Design-Philosophy.md](./02-Design-Philosophy.md) | Design Philosophy | Planned |
| 03 | [03-Core-Principles.md](./03-Core-Principles.md) | Core Principles | Planned |
| 04 | [04-Color-System.md](./04-Color-System.md) | Color System | Planned |
| 05 | [05-Typography.md](./05-Typography.md) | Typography | Planned |
| 06 | [06-Spacing-System.md](./06-Spacing-System.md) | Spacing System | Planned |
| 07 | [07-Grid-System.md](./07-Grid-System.md) | Grid System | Planned |
| 08 | [08-Elevation.md](./08-Elevation.md) | Elevation | Planned |
| 09 | [09-Glass-System.md](./09-Glass-System.md) | Glass System | Planned |
| 10 | [10-Lighting.md](./10-Lighting.md) | Lighting | Planned |
| 11 | [11-Shadow-System.md](./11-Shadow-System.md) | Shadow System | Planned |
| 12 | [12-Animation-System.md](./12-Animation-System.md) | Animation System | Planned |
| 13 | [13-Icons.md](./13-Icons.md) | Icons | Planned |
| 14 | [14-Illustrations.md](./14-Illustrations.md) | Illustrations | Planned |
| 15 | [15-Banners.md](./15-Banners.md) | Banners | Planned |
| 16 | [16-Cards.md](./16-Cards.md) | Cards | Planned |
| 17 | [17-Header.md](./17-Header.md) | Header | Planned |
| 18 | [18-Dock.md](./18-Dock.md) | Dock | Planned |
| 19 | [19-Compass.md](./19-Compass.md) | Compass | Planned |
| 20 | [20-Buttons.md](./20-Buttons.md) | Buttons | Planned |
| 21 | [21-Inputs.md](./21-Inputs.md) | Inputs | Planned |
| 22 | [22-Sheets.md](./22-Sheets.md) | Sheets | Planned |
| 23 | [23-Modals.md](./23-Modals.md) | Modals | Planned |
| 24 | [24-Lists.md](./24-Lists.md) | Lists | Planned |
| 25 | [25-Journal.md](./25-Journal.md) | Journal | Planned |
| 26 | [26-Planning.md](./26-Planning.md) | Planning | Planned |
| 27 | [27-Dashboard.md](./27-Dashboard.md) | Dashboard | Planned |
| 28 | [28-Accessibility.md](./28-Accessibility.md) | Accessibility | Planned |
| 29 | [29-Dark-Mode.md](./29-Dark-Mode.md) | Dark Mode | Planned |
| 30 | [30-Performance.md](./30-Performance.md) | Performance | Planned |
| 31 | [31-Code-Standards.md](./31-Code-Standards.md) | Code Standards | Planned |
| 32 | [32-AI-Rules.md](./32-AI-Rules.md) | AI Rules | Planned |

---

## Required chapter structure

Every chapter includes: Purpose, Philosophy, Visual Rules, Sizing, Spacing, States, Examples, Accessibility, Animations, Code Examples, Do, Don't, Future Improvements.

---

## Reading order

**Foundation:** 01 → 03 → 04 → 06 → 09 → 12  
**Chrome (locked UX):** 17 → 18 → 19  
**Components:** 16 → 20 → 21 → 22 → 23  
**Domains:** 25 → 26 → 27  
**Governance:** 28 → 31 → 32  

---

*Livskompassen Design Bible*
