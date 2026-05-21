# Safe Harbor (Hamn)

**Sacred Feature.** **Route:** `/hamn` · **AuthGate:** ja · **Dock:** Anchor  
**Design:** [`docs/specs/design-master.md`](../../docs/specs/design-master.md) (Obsidian Calm, Riktning A)  
**Incoming spec:** [`docs/specs/incoming/SafeHarbor-SPEC.md`](../../docs/specs/incoming/SafeHarbor-SPEC.md)

---

## 1. Syfte och användarbehov

Känslomässig brandvägg för ex-kommunikation. BIFF + Grey Rock utan JADE. Kognitiv avlastning vid högkonflikt.

## 2. Route och ingång

| Variant | Ingång |
|---------|--------|
| **A (aktiv)** | FloatingDock Anchor, HomePage bento |
| **B (planerad)** | Bro från `/speglar` med meddelande/kontext |

## 3. UX-flöde

**Målbild (progressive disclosure):** inmatning → Brusfilter → mål → BIFF-svar → kopiera + Klar.

**Idag:** en sida — textarea → Generera BIFF-svar → kopiera (ingen Brusfilter-vy, mål-fält, Klar, valv-export).

## 4. Visuell design

Obsidian Calm enligt design-master. Guld/indigo/emerald. Fortsätt-knapp idigo i flerstegs-flöde (planerat).

## 5. Datamodell

| Lagring | Standard | WORM |
|---------|----------|------|
| Hamn UI | Zero Footprint — inget sparas | — |
| "Spara som bevis" | planerad → `reality_vault` | ja |

## 6. Backend

- `analyzeMessage` callable → KompisSupervisor + DCAP
- `biffService.ts` — klient-wrapper, `extractGreyRockReply`
- Ingen separat `generateBiffResponse` callable

## 7. Säkerhet

- AuthGate
- Ex-text endast via server-side callable
- Zero Footprint: Klar/unmount **planerat**; global `useShakeToKill` finns

## 8. Status idag vs planerat

| Klart | Delvis | Planerat |
|-------|--------|----------|
| SafeHarborPage + formulär | Brusfilter (backend DCAP, ej UI-steg) | Flerstegs-wizard |
| analyzeMessage + BIFF-svar | JADE-kvalitet via supervisor | Visuellt Brusfilter |
| Kopiera svar | | Användarens mål-fält |
| riskScore i UI | | Bro Speglar→Hamn |
| AuthGate, dock, bento | | "Klar" + state reset |
| | | "Spara som bevis" → valv |

## 9. Acceptanskriterier

Se incoming SPEC — rad 1–2 delvis klara, 3–4 planerade.

## 10. Kopplingar

- **Speglings-Systemet** — naturlig bro vid gaslighting (planerad)
- **Verklighetsvalvet** — valfri WORM-export av ex-meddelande (planerad)

## 11. Navigation

Se [`docs/specs/navigation-master.md`](../../docs/specs/navigation-master.md): Variant A aktiv.

## Kod

`src/modules/safe_harbor/` · plan: `src/modules/safe_harbor/module_plan.md`

## Gap — minimal nästa implementationsdiff

1. Flerstegs-flöde: Brusfilter-vy + mål-fält  
2. "Klar"-knapp + unmount cleanup (Zero Footprint)  
3. Link/state från `SpeglingsSystem` → `/hamn`  
4. "Spara som bevis" → `saveVaultLog`
