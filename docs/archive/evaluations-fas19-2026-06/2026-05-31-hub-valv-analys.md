# Hub-analys: Valv (Zoner · WORM · PIN/Fyren)

**Datum:** 2026-05-31  
**Git:** `main` (dirty worktree)  
**Scope:** `VaultPage`, Valv-drawer, `reality_vault`, session gate

---

## Syfte & route

**Verklighetsvalvet** (Sacred Feature) lagrar immutable evidence i silo **Valv** (`reality_vault`, U1/U3). Entry alltid via **Fyren** (WebAuthn) → session 1 h (`sessionService.ts` 8–9) → `/dagbok?tab=bevis&vaultTab=…`.

| Valv-drawer rad | vaultTab | Zon |
|-----------------|----------|-----|
| Spara & sök | `logga` (default) | samla |
| Mönster | `monster` | analysera |
| Kunskapsbank | `kunskapsbank` | kunskap |
| Rapporter | `dossier` | exportera |
| Djupare | `hamn_analys` | forensik |

Zon-modell: `vaultTabs.ts` 32–58 (`VALV_ZONE_IDS`, `resolveValvZone`). UI: `VaultPage` 217–234 (zon TabBar + underflikar).

Full dossier-vy: `/dossier` (`AppRoutes.tsx` 109–114, `navTruth` 501–508).

---

## Användarresa ×3

### 1. Logga bevis (WORM)
Fyren → Bevis → zon **Spara & sök** → `logga` → `saveVaultLog` append-only (`VaultPage` 142–166). Offline block via `OfflineWriteBlockedError`.

### 2. Mönster + Orkester (locked)
Zon **Analysera** → `VaultMonsterPanel` + `VaultOrkesterPanel` — **MUST NOT** tas bort (`locked-ux-features.mdc`). Tabs `monster`, `orkester` (`vaultTabs.ts` 9–10).

### 3. Kunskap + Aktörskarta (G9)
Zon **Kunskap** → `VaultKunskapsbankPanel`, `VaultAktorskartaPanel` + `addEntityProfile` — all Kunskap-UI bakom PIN (ingen publik `/vardagen?tab=kunskap`).

---

## Kod vs spec

| Aspekt | Spec | Kod | Match? |
|--------|------|-----|--------|
| Fyren gate, ej direkt-PIN | Sacred | `VaultPage` 180–192, `valvFyrenGate.ts` | ✅ |
| Session 1 h | Zero Footprint | `VAULT_SESSION_IDLE_MS` sessionService 8–9 | ✅ |
| Zon TabBar | Valv redesign | `getVaultZoneTabBarItems` VaultPage 217–221 | ✅ |
| WORM reality_vault | U3 | `saveVaultLog`, rules (arkitektur) | ✅ |
| Drawer platta Valv-rader | MENU-DRAWER | `navTruth` 416–462 | ✅ |
| Stäng → rensa gate | Layered Defense | `handleCloseToLayer1` 169–177 | ✅ |
| Vävare badge | HITL | `WeaverPendingVaultBanner`, drawer badge | ✅ |

---

## Gate & PIN (Fyren)

```180:192:src/modules/evidence/vault/components/VaultPage.tsx
  if (!gateOk) {
    return (
      <BentoCard
        title={embedded ? 'Valv · Baksida' : 'Verklighetsvalvet'}
        description="Sacred Feature — Fyren krävs"
        ...
        <p className="text-sm text-text-dim">
          Håll Hjärtat-ikonen i bottenmenyn i 3 sekunder (Fyren) och verifiera med fingeravtryck
          eller Face ID. Kort tryck eller direktlänk räcker inte.
        </p>
```

```13:28:src/modules/core/auth/valvFyrenGate.ts
/** Fyren 3s-håll → WebAuthn + session gate → Valv (Dagbok bevis). */
export async function openValvViaFyren(...) {
  const ok = await authenticateVaultGate();
  ...
  setVaultGate();
  useStore.getState().setVaultUnlocked(true);
  navigate({ pathname: options?.pathname ?? '/dagbok', search: options?.search ?? '?tab=bevis' });
}
```

---

## Navigationsproblem

1. **Legacy grupp-headers** (`valv_grp_*`) finns i navTruth men ej i drawer — dubbel modell (platta rader vs legacy deep links).
2. **Embedded vs full** — samma VaultPage i Dagbok och teoretiskt standalone; breadcrumb `VaultValvBreadcrumb` måste bära kontext.
3. **Forensik många flikar** — hamn, speglar, dagbok, familj, arbetsliv — hög kognitiv load i zon **Djupare**.
4. **`isVaultUnlocked` i store** vs `hasVaultGate()` — två källor; synkas i `VaultPage` 124–130.

---

## Locked UX

| Panel / beteende | Smoke / register |
|------------------|------------------|
| VaultMonsterPanel | smoke:locked-ux |
| VaultOrkesterPanel | smoke:locked-ux |
| VaultKunskapsbankPanel | locked-ux Pansaret |
| VaultAktorskartaPanel | G9 entity profiles |
| vaultPatternScan | MUST NOT delete |
| Inga publika Kunskap-routes | `/kunskap` redirect AppRoutes 97 |

---

## Smoke

| Script | Kontroller |
|--------|------------|
| `npm run smoke:locked-ux` | Valv, Fyren, Mönster/Orkester/Kunskapsbank |
| `npm run smoke:orkester` | Valv-zoner, synapser |
| `npm run smoke:entities` | Aktörskarta callables |
| `npm run smoke:valv-chat` | valvChatQuery silo |

---

## Ombyggnadsidéer P1–P3

**P1:** Ta bort oanvända legacy `valv_grp_*` från navTruth när inga klienter deep-linkar.  
**P2:** Forensik: grupperad UI (Hamn · Familj · Arbetsliv) med ingress per `FORENSIC_TAB_INGRESS`.  
**P3:** Valv som egen top-level route `/valv` med samma gate (behåll redirect från `/valv` → bevis idag AppRoutes 70).

---

## diff-scope

| Område | Filer |
|--------|-------|
| Vault UI | `VaultPage.tsx`, `PansaretHeader.tsx`, `Vault*Panel.tsx` |
| Zon/tab utils | `vaultTabs.ts`, `valvNavCopy.ts` |
| Gate/session | `valvFyrenGate.ts`, `sessionService.ts`, `useZeroFootprint.ts` |
| Drawer Valv | `navTruth.ts` 416–549, `NavigationDrawer.tsx` |
| Firestore | `firestore.ts` saveVaultLog, `firestore.rules` reality_vault |
| Backend RAG | `valvChatQuery`, `analyzeMessage` (functions) |

**Deploy:** callables + hosting vid Valv-UI-ändring; rules vid WORM-ändring.
