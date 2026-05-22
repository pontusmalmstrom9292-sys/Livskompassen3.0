# Safe Harbor (Hamn)

**Sacred Feature.** **Route:** `/hamn` · **AuthGate:** ja · **Dock:** Anchor  
**Design:** [`docs/specs/design-master.md`](../../docs/specs/design-master.md) (Obsidian Calm, Riktning A)  
**Incoming spec:** [`docs/specs/modules/SafeHarbor-SPEC.md`](../../docs/specs/modules/SafeHarbor-SPEC.md)

---

## 1. Syfte och användarbehov

Känslomässig brandvägg för ex-kommunikation. BIFF + Grey Rock utan JADE. Kognitiv avlastning vid högkonflikt.

## 2. Route och ingång

| Variant | Ingång |
|---------|--------|
| **A (aktiv)** | FloatingDock Anchor, HomePage bento |
| **B (done)** | Bro från `/speglar` med `prefilledMessage` |

## 3. UX-flöde

**Målbild (progressive disclosure):** inmatning → Brusfilter → mål → BIFF-svar → kopiera + Klar.

**Idag:** en sida — textarea → Generera BIFF-svar → kopiera (ingen Brusfilter-vy, mål-fält, Klar, valv-export).

## 4. Visuell design

Obsidian Calm enligt design-master. Guld/indigo/emerald. Fortsätt-knapp idigo i flerstegs-flöde (planerat).

## 5. Datamodell

| Lagring | Standard | WORM |
|---------|----------|------|
| Hamn UI | Zero Footprint — inget sparas | — |
| "Spara som bevis" | **done** → `reality_vault` (`action: hamn_biff`) | ja |

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
| analyzeMessage + BIFF-svar | | Visuellt Brusfilter |
| Kopiera svar + spara bevis | | "Klar" + state reset |
| riskScore i UI | | Dölj sms tills "har energi" |
| Bro Speglar→Hamn | | |
| AuthGate, dock, bento | | |
| Spara som bevis → valv | | |
| Speglar-bro (`prefilledMessage`) | | |

## Kladd 2026-05-21

- **Kladd:** Grey Rock 10/90, logistik vs brus, inga JADE-svar.
- **Soc-strategi:** Kort, faktabaserat — barnets behov.
- **Gap:** Brusfilter som synligt UI-steg; Zero Footprint unmount på råtext.
- **Ej planerat nu:** Auto-dölj inkommande sms (fas 2).

## 9. Acceptanskriterier

Se incoming SPEC — rad 1–2 delvis klara, 3–4 planerade.

## 10. Kopplingar

- **Speglings-Systemet** — bro vid gaslighting (**done**, `prefilledMessage`)
- **Verklighetsvalvet** — valfri WORM-export av ex-meddelande (**done**, `saveVaultLog`)

## 11. Navigation

Se [`docs/specs/navigation-master.md`](../../docs/specs/navigation-master.md): Variant A aktiv.

## Kod

`src/modules/safe_harbor/` · plan: `src/modules/safe_harbor/module_plan.md`

## Gap — minimal nästa implementationsdiff

1. Flerstegs-flöde: Brusfilter-vy + mål-fält  
2. "Klar"-knapp + unmount cleanup (Zero Footprint)  
3. Link/state från `SpeglingsSystem` → `/hamn`  
4. "Spara som bevis" → `saveVaultLog`
