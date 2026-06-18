# FP-TI-S7 — Valv deniability + röd logout (INSTÄLLNINGAR)

| Fält | Värde |
|------|-------|
| **Tag** | `FP-TI-S7` |
| **Datum** | 2026-06-18 |
| **Scope** | Sandbox endast — säkerhetsbeteende speglar prod-regler |
| **Specialist** | `specialist-security-auditor` |
| **Kanonbild** | [`docs/design/references/FP-TI-REF-executive-5screen-canonical.png`](../../../design/references/FP-TI-REF-executive-5screen-canonical.png) (skärm 5) |
| **Prod-smoke** | `npm run smoke:plausible-deniability`, `npm run smoke:valv-gate` |

---

## 1. INSTÄLLNINGAR-skärm — visuell spec

### 1.1 Header

| Egenskap | Värde |
|----------|-------|
| Titel | «INSTÄLLNINGAR» |
| Font | Cinzel `1.75rem`, `#d4af37`, `letter-spacing: 0.22em` |
| Under-titel | saknas i ref |

### 1.2 Grupp «Konto & Profil»

| # | Rad | Ikon |
|---|-----|------|
| 1 | Profil | `User` |
| 2 | Säkerhet & Valv | `Shield` |
| 3 | Notiser | `Bell` |
| 4 | Konton | `CreditCard` |
| 5 | Data & Synk | `RefreshCw` |

### 1.3 Grupp «Support»

| # | Rad | Ikon |
|---|-----|------|
| 1 | Support | `HelpCircle` |
| 2 | Om Livskompassen | `Info` |

| Grupp-spec | Värde |
|------------|-------|
| Gruppetikett | `0.625rem`, `#78716c`, `letter-spacing: 0.2em`, uppercase |
| Radhöjd | `52px` |
| Gruppavstånd | `24px` |
| Rad-klass | `.design-freeport__exec-list-row` |

---

## 2. Logga ut — röd knapp (mätbar)

```css
.design-freeport__exec-btn-danger {
  width: calc(100% - 32px);
  margin: 24px 16px;
  min-height: 52px;
  border-radius: 14px;
  border: 2px solid rgba(127, 29, 29, 0.65);
  background: linear-gradient(180deg, #7f1d1d 0%, #000000 100%);
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 6px 20px rgba(127, 29, 29, 0.35);
}
```

| Egenskap | Värde |
|----------|-------|
| Text | «Logga ut» |
| Hover | `background: linear-gradient(180deg, #991b1b 0%, #0a0a0a 100%)` |
| Focus ring | `2px solid rgba(239, 68, 68, 0.55)` offset `2px` |
| Avstånd till nav | `24px` |

**Syfte:** visuell separation från guld-UI — irreversibel session-åtgärd.

---

## 3. Plausible deniability i ny chrome

### 3.1 Regler (prod → sandbox)

| Regel | Implementation |
|-------|----------------|
| Valv-ord dold i publikt läge | Inga «valv», «bevis», «arkiv» i RESURSER utan `vaultSessionOpen` |
| Valv endast via Fyren/PIN | Sandbox mock: `useState vaultSessionOpen` |
| Hjärtat ≠ Valv | Dagbok-rad → `/hjartat`, inte `/valvet` |
| Separata silos | Ingen cross-RAG i sandbox delegates |

### 3.2 DOM-test (sandbox)

```javascript
// vaultSessionOpen === false
document.querySelectorAll('[data-fp-valv]').length === 0
document.body.textContent.match(/valv|bevis|arkiv/i) === null

// vaultSessionOpen === true
document.querySelector('[data-fp-valv="samla"]') !== null
```

### 3.3 Säkerhet & Valv-rad

| Tillstånd | Klick |
|-----------|-------|
| Ej inloggad | Redirect mock login |
| Inloggad, valv låst | PIN-modal mock |
| Valv öppet | Navigera till valv-overlay |

---

## 4. Kill Switch + Zero Footprint

| Händelse | Sandbox-beteende |
|----------|------------------|
| Logga ut | Rensa `sessionStorage` keys `fp-*`; `vaultSessionOpen=false` |
| Blur 30s | Dölj speglar-innehåll (ej dagbok WORM) |
| Panic (dev) | `location.reload()` + rensa session |

Prod: `valvFyrenGate.ts`, `performVaultWebAuthnForSession`.

---

## 5. WORM — ej i inställningar-UI

Inställningar visar **inte** raderingsknapp för:
- `reality_vault`
- `children_logs`
- `journal`
- `evolution_ledger`

«Data & Synk» = export-only copy, ingen «radera allt».

---

## 6. Acceptans

1. Logout-knapp `52px` höjd, gradient `#7f1d1d` → `#000`.
2. Valv-rad absent utan `vaultSessionOpen`.
3. `smoke:plausible-deniability` PASS (prod, orörd).
4. Logout triggar mock session-rens i sandbox.
5. Ingen guld-bevel på danger-knapp.
