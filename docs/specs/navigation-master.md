# Navigation Master — Livskompassen v2

**Status:** Variant C aktiv (Modulhub + kluster). Variant A/B arkiverade.

**Kod:** [`src/modules/core/navigation/appNavigation.ts`](../../src/modules/core/navigation/appNavigation.ts)

---

## Variant C (nuvarande — aktiv)

### L1 — Primär navigation

| Ingång | Komponent | Route |
|--------|-----------|-------|
| Hem | Header `Home`-knapp | `/` |
| Modulhub | [`FloatingDock`](../../src/modules/core/layout/FloatingDock.tsx) → [`ModuleHubPanel`](../../src/modules/core/layout/ModuleHubPanel.tsx) | Öppnas från kompass-centrum; navigerar till livsområde |

**FloatingDock:** en kompass-hub (inte 8 ikoner). På `/dagbok` visar hubben Hjärtat-ikon; annars Kompass.

### Livsområden (L1)

| Område | Route | AuthGate | Hub-position |
|--------|-------|----------|--------------|
| Hjärtat | `/dagbok` | ja | centrum (Fyren 3s → `?tab=bevis`) |
| Hamn | `/hamn` | ja | topp vänster |
| Familjen | `/familjen` | ja | topp höger |
| Vardagen | `/vardagen` | ja | botten vänster |
| Måbra | `/mabra` | ja | botten höger |
| Dossier | `/dossier` | ja | ej i hub — canonical export |

**Hem:** [`ClusterGrid`](../../src/modules/core/ui/ClusterGrid.tsx) listar samma livsområden + djup-länkar till kluster-flikar.

### L2 — Kluster-flikar (`?tab=`)

| Kluster | Route | Flikar |
|---------|-------|--------|
| Hjärtat | `/dagbok` | `reflektion` (default), `bevis`, `speglar` |
| Vardagen | `/vardagen` | `kompasser` (default), `ekonomi`, `kunskap` |

**Regel:** URL speglar livsområde + kluster-flik. Wizard-steg hålls lokalt.

### L3 — Modul-läge (lokal state)

| Modul | Flikar | Mekanism |
|-------|--------|----------|
| Verklighetsvalvet (inuti Bevis) | `logga`, `sok`, `dossier` | lokal state; `dossier` → bro till `/dossier` |
| Kompasser (inuti Vardagen) | morgon / dag / kväll | lokal `FlowTabs` i Dashboard |

### Fyren (Sacred)

- **3s long-press** på Hjärtat-rutan i Modulhub → WebAuthn/PIN → `/dagbok?tab=bevis`
- Vault unlock rensas vid byte från Bevis-flik ([`HjartatPage.tsx`](../../src/modules/dagbok/components/HjartatPage.tsx))

### Legacy-redirects

| Gammal route | Ny destination |
|--------------|----------------|
| `/kompasser`, `/ekonomi`, `/kunskap` | `/vardagen?tab=…` |
| `/valv`, `/speglar` | `/dagbok?tab=bevis` / `speglar` |
| `/barnen` | `/familjen` |

Definieras i [`AppRoutes.tsx`](../../src/modules/core/routing/AppRoutes.tsx) + `LEGACY_REDIRECTS` i `appNavigation.ts`.

---

## Variant A (arkiv — 2025)

Åtta ikoner i dock (Hem, Kompasser, Valv, Hamn, Dagbok, Kunskap, Barnen, Ekonomi). Ersatt av Variant C.

---

## Variant B (arkiv — blueprint)

Fyra–fem ikoner; long-press Dagbok → valv. Delar av idén finns i Variant C (Fyren på Hjärtat, inte separat Shield-ikon).

---

## AuthGate-routes

`/dagbok`, `/hamn`, `/familjen`, `/vardagen`, `/mabra`, `/dossier`

---

## Beslut

| Fråga | Status |
|-------|--------|
| A vs B vs C | **C aktiv** |
| Speglar i dock | **Nej** — Hjärtat-flik + Hem-chips |
| Dossier canonical | **`/dossier`** — Valv-flik är bro, inte embedded wizard |
| Config single source | **`appNavigation.ts`** för hub, hem, kluster-flikar |
