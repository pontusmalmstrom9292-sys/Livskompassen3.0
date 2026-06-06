# Safe Harbor (Hamn)

**Kanonisk kod:** `src/modules/features/family/safeHarbor/`  
**Sacred Feature.** **Route:** `/familjen?tab=hamn` · **Legacy:** `/hamn` → redirect · **AuthGate:** ja  
**Design:** [`docs/specs/design-master.md`](../../docs/specs/design-master.md) (Obsidian Calm, Riktning A)  
**Spec:** [`docs/specs/modules/SafeHarbor-SPEC.md`](../../docs/specs/modules/SafeHarbor-SPEC.md)

---

## 1. Syfte och användarbehov

Känslomässig brandvägg för ex-kommunikation. BIFF + Grey Rock utan JADE. Kognitiv avlastning vid högkonflikt.

## 2. Route och ingång

| Variant | Ingång |
|---------|--------|
| **A (aktiv)** | Familjen → Trygg hamn (`?tab=hamn`), HomePage bento |
| **B (done)** | Bro från `/hjartat?tab=speglar` med `prefilledMessage` |
| **Legacy** | `/hamn` → `/familjen?tab=hamn` |

## 3. UX-flöde

**Idag:** en sida — textarea → Generera BIFF-svar → kopiera (ingen Brusfilter-vy, mål-fält, Klar, valfri valv-export).

## 4. Datamodell

| Lagring | Standard | WORM |
|---------|----------|------|
| Hamn UI | Zero Footprint — inget sparas | — |
| "Spara som bevis" | **done** → `reality_vault` (`action: hamn_biff`) | ja |

## 5. Backend

- `analyzeMessage` callable → KompisSupervisor + DCAP
- `biffService.ts` — klient-wrapper, `extractGreyRockReply`

## 6. Status idag vs planerat

| Klart | Planerat |
|-------|----------|
| SafeHarborPage + formulär, analyzeMessage + BIFF-svar, kopiera + spara bevis, Bro Speglar→Hamn, AuthGate | Flerstegs-wizard, Brusfilter-vy, "Klar" + state reset |

## 7. Kopplingar

- **Speglings-Systemet** — bro vid gaslighting (**done**, `prefilledMessage`)
- **Verklighetsvalvet** — valfri WORM-export av ex-meddelande (**done**, `saveVaultLog`)

Kod: `src/modules/features/family/safeHarbor/` · Plan: [`src/modules/features/family/safeHarbor/module_plan.md`](../../src/modules/features/family/safeHarbor/module_plan.md)
