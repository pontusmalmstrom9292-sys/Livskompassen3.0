# Fas 14A: Separation av Privatekonomi och Arbetsliv

**Status:** Implementerad (kod + smoke) — 2026-06-15  
**Kanon:** [`Ekonomi-SPEC.md`](../specs/modules/Ekonomi-SPEC.md) · [`2026-05-25-arbetsliv-hub.md`](../evaluations/2026-05-25-arbetsliv-hub.md)

---

## 1. Applikationskarta

| Modul | Syfte | Visuell profil | Firestore |
|-------|--------|----------------|-----------|
| **Privatekonomi** | Utgifter, budget, sparmål, impuls, neuro-kost | Guld — `text-accent`, `glow-bottom-gold` | `transactions`, `economy_profiles`, `budget_savings`, `budgets`, `economy_impulse_queue`, `economy_ledger` (utgifter) |
| **Arbetsliv** | Inkomster, arbetstid, lönespec-rutin | Indigo — `text-accent-secondary`, `glow-bottom-blue` | `time_entries`, `economy_ledger` (inkomst), `payslip_snapshots` (Valv) |

**Route:** Privatekonomi → `/vardagen?tab=ekonomi` · Arbetsliv → `/arbetsliv/input`

---

## 2. Chrome & navigation

### Drawer (sidomeny)

| Hub | Label | Path | Aktiv-state |
|-----|-------|------|-------------|
| Privatekonomi | **Plånbok** | `/vardagen?tab=ekonomi` | Guld — `text-accent`, `bg-accent/10` |
| Arbetsliv | **Arbetsliv** | `/arbetsliv/input` | Indigo — `text-accent-secondary`, `bg-accent-secondary/10` |

Subrader: `stampla`, `tid`, `inkomster` — **ingen** `arbetsliv_logg`.

### Footer-länkar (hub → hub)

- Ekonomi superhub: «Arbetsliv — stämpel & inkomster →»
- Arbetsliv superhub: «Privatekonomi →»

### Legacy redirects

- `/arbetsliv?tab=logg` → `/vardagen?tab=ekonomi&inputMode=logg`
- `?tab=franvaro|lon` → Valv (`arbetsliv_forensic`)

---

## 3. Wireframes

### A) Privatekonomi

| Skärm | Komponent | Status |
|-------|-----------|--------|
| Zontitel (Cinzel, guld) | `EkonomiInputSuperModule` header | ✅ |
| Saldo | `SaldoHero` / `EkonomiSaldoDelegate` | ✅ |
| Logg & fasta räkningar | `EkonomiLoggDelegate` → `EconomyLogPanel scope="vardag"` | ✅ |
| Impuls 24h | `EkonomiImpulsDelegate` | ✅ |
| Neuro-Kost | `EkonomiMatprepDelegate` | ✅ |
| Kuvert / budget | `EkonomiKuvertDelegate`, `EconomyOverviewPanel` budget-flik | ✅ |

**Borttaget:** flik `tid`, stämpel, lönespec i ekonomi.

### B) Sparmål (ADHD-vänligt)

| Skärm | Beteende | Status |
|-------|----------|--------|
| Lista | `BentoCard` per mål, lugn progress (`h-1 bg-surface-3`, `bg-accent/50`) | ✅ |
| Skapa mål | Enkla fält + `btn-pill--secondary` «Skapa sparmål» | ✅ |
| Mikro-belöning | Check + «Sparat. Ett lugnt steg framåt.» — **ingen** streak/XP | ✅ |
| Superhub logg | `EkonomiSparDelegate` — WORM-transaktion | ✅ |

### C) Arbetsliv

| Skärm | Komponent | Status |
|-------|-----------|--------|
| Zontitel (Cinzel, indigo) | `ArbetslivInputSuperModule` | ✅ |
| Stämpel | `ArbetslivStamplaDelegate` → `StampClockPage` | ✅ |
| Inkomster | `ArbetslivInkomstDelegate` (lön, FK, OVB) | ✅ |
| Tid & flex | `ArbetslivFlexDelegate` (read-only, `useWorkStats`) | ✅ |
| Frånvaro (låst) | `ArbetslivValvBroDelegate` → Valv PIN | ✅ |

### D) Lönespec 16:e

| Var | Innehåll | Status |
|-----|----------|--------|
| Arbetsliv-hub | «Nästa spec: 16 [månad]» + knapp till Valv | ✅ |
| Valv (PIN) | `EconomyPayslipCard` + generera spec | ✅ (befintlig) |
| Public ekonomi | **Ingen** lönespec | ✅ |

---

## 4. Designtokens

| Klass | Användning |
|-------|------------|
| `bg-surface`, `bg-surface-2`, `bg-surface-3` | Ytor, kort, hover |
| `text-accent` | Privatekonomi zontitel, aktiv chrome |
| `text-accent-secondary` | Arbetsliv zontitel, knappar |
| `border-border` | Avdelare, `TimelineEntry` |
| `font-display-serif` | Zontitlar (uppercase, tracking) |
| `font-sans` | Brödtext, etiketter |

**MUST NOT:** hårdkodade hex i komponenter · `text-secondary` (finns ej).

---

## 5. Komponentmapping

| Gammalt | Åtgärd | Ersättare |
|---------|--------|-----------|
| `EconomyTidPanel` | RADERAD | — |
| `TimeAndPayPanel` | RADERAD | `ArbetslivStamplaDelegate` |
| `ArbetslivLoggDelegate` | RADERAD | `EkonomiLoggDelegate` |
| `ArbetslivTidDelegate` | RADERAD | `ArbetslivFlexDelegate` |
| `EkonomiArbetslivBroDelegate` | RADERAD | Footer-länk i superhub |
| `EconomyLogPanel` | FLYTTAD | Privatekonomi (`scope="vardag"`) |
| `EconomyPayslipCard` | BEGRÄNSAD | Endast `VaultForensicPanel` |
| — | SKAPAD | `ArbetslivInkomstDelegate` |
| — | SKAPAD | `ArbetslivValvBroDelegate` |

---

## 6. Smoke-checklista

```bash
npm run build                    # ✅
npm run smoke:ekonomi            # ✅
npm run smoke:arbetsliv          # ✅
npm run smoke:arbetsliv-superhub # ✅
npm run smoke:economy-vendor    # ✅
npm run smoke:locked-ux         # ✅
```

**Manuellt (prod-test):**

- [x] Ingen «Tid»-flik på `/vardagen?tab=ekonomi`
- [x] Ingen «Logg» (fasta räkningar) på `/arbetsliv/input`
- [x] Frånvaro/lön kräver Valv-PIN
- [x] Arbetsliv zontitel = indigo, ekonomi = guld
- [x] Sparmål utan streak/XP

---

## Deploy

Frontend-only efter godkänd manuell test:

```bash
firebase deploy --only hosting
```
