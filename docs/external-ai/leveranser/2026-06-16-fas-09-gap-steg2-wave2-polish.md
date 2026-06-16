# LIFE-OS-VISION-GAP-2026 — steg 2

**Datum:** 2026-06-16  
**Typ:** Wave-2 UI-polish (wireframe-text, ej prod-kod)  
**Källor:** ChatBox PHASE-09 · granskad mot COLOR-POLICY + locked UX

---

## Granskningsnyckel

| Etikett | Betydelse |
|---------|-----------|
| **KEEP** | OK att planera / redan i linje |
| **DEFER** | Wave-2 polish — implementera senare i Cursor |
| **REJECT** | Får inte in i prod utan nytt beslut |

---

## Zon 1: Idé & modulpresentation

- Progressiva avslöjanden (expanders) per modul — **DEFER**
- Små ikonindikatorer vid modulnamn (status) — **DEFER**
- Tydligare «Endast för mig»-badge — **DEFER**

---

## Zon 2: UX-flöde

- Animerade flödespilar (Start→Fokus→Planera …) — **DEFER**
- Aktuell flödesposition med guld/cream-highlight (ej teal) — **DEFER**
- Hover-tooltip per steg — **DEFER**
- Diskret «dagens röda tråd»-banner — **DEFER**

---

## Zon 3: UI-design — visuell stil

- Subtila gradienter i kort/knappar (mörk navy → mid-teal ton) — **REJECT** (teal som visuell accent i gradient bryter COLOR-POLICY; använd obsidian→surface tokens)
- Guldaccent i ikoner vid aktivt läge och notifieringar — **DEFER**
- `font-display-serif` + tracking på sektionstitlar — **KEEP**
- Dim gray i microcopy och disabled states — **DEFER**

---

## Zon 4: Wireframes / skärmdesign

- Fler knappstates (pressed, focus, transitions) — **DEFER**
- Kanban-kort som «flip cards» på hover/tap — **DEFER** (P3 Kanban låst — ingen ny interaktionsmodell utan PMIR)
- Visuell markering för bildinlägg i dagbok — **DEFER**
- Förhöjd skugga på nav i dark mode — **DEFER**

---

## Zon 5: Designsystem / komponenter

- Mjuk glow på sekundära knappar vid hover — **DEFER**
- Ikonknappar för snabbåtgärder på kort — **DEFER**
- Konsekvent mikrocopy (kort, professionell) — **DEFER**
- Loading-state i kort (guld spinner) — **DEFER**

---

## Zon 6: Navigation

- Kompass-emblem med rotation vid appstart — **REJECT** (D1 `LivskompassMark` låst — kräver explicit godkännande)
- Aktiva flikar med tunn guldbaserad linje — **KEEP**
- Notifieringsbadge på «Mer» (cream på navy) — **DEFER**
- Utökad touch-yta runt ikoner — **DEFER**

---

## Zon 7: Sammanfattning

- Checklista med guldiga check-ikoner — **DEFER**
- Kontrasterande bakgrund (mid-teal) bakom text — **REJECT** (teal-bakgrund; använd `bg-surface-2` + guld accent)
- «Wow-faktor»-animation vid landning — **DEFER** (kognitiv belastning / ADHD-säkerhet)
- Liten kompassikon vid punktlista — **DEFER** (ej ändra D1 utan godkännande)

---

## Sammanfattning för merge

| Status | Antal | Exempel |
|--------|-------|---------|
| REJECT | 4 | mid-teal gradient/bakgrund, kompass-rotation, flip cards (ny UX), wow-animation |
| DEFER | övrigt | guld-highlight, expanders, badges, touch-ytor, mikrocopy |
| KEEP | 2 | serif-rubriker, guld aktiv flik-linje |

**Nästa:** Merge DEFER-rader till `docs/external-ai/imports/gap-matrix-2026-06-16.md` under BUILD #5 — implementera inte REJECT-rader i prod.
