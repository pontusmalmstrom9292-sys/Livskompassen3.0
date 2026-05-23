# Modulutvärdering — Core — 2026-05-23

**Modul:** `src/modules/core/` (+ `widgets/`)  
**Roll:** App-shell, auth, navigation, Zero Footprint, Kill Switch, design tokens

---

## Sammanfattning

Core bär **hela appens infrastruktur** och är stabil: BrowserRouter, AuthProvider, AuthGate, FloatingDock/classic triad, Fyren widget bar, widget routes. Sacred mekanismer (Zero Footprint, Kill Switch, WebAuthn) är monterade i `App.tsx`. **GAP:** `NavigationDrawer.tsx` (D24) saknas trots `drawerNav.ts`; Planering-länk i drawer utan mål-route.

---

## Komponenter

| Område | Status | Bevis |
|--------|--------|-------|
| Routing | **PASS** | `AppRoutes.tsx` — alla huvudmoduler |
| Auth Anonymous + Gate | **PASS** | `AuthProvider`, `AuthGate` |
| Zero Footprint | **PASS** | `useZeroFootprint` i `App.tsx` |
| Kill Switch | **PASS** | `useShakeToKill`, `killSwitch.ts` |
| Design tokens | **PASS** | `tokens.ts`, Obsidian Calm CSS |
| FloatingDock / classic triad | **PASS** | `DockClassicTriad`, `ValvArchIcon` |
| Fyren 3s + WebAuthn | **PASS** | long-press → valv |
| SubSynapticBackground | **PASS** | layout |
| Widget routes | **PASS** | `/widget/*`, Capacitor Android WH1–WH4 |
| Sidomeny kanon | **partial** | `drawerNav.ts` — ingen drawer UI |
| Planering nav-länk | **GAP** | path `/planering` utan route |

---

## Store / UI

| Feature | Status |
|---------|--------|
| Zustand vault unlock | **PASS** |
| `activeDrawer` (BIFF/vault/emotion) | **PASS** |
| `CognitiveLoadStrip` D18 | **partial** (untracked) |
| `PinGate` | **PASS** |
| `ElongatedModule` | **PASS** |

---

## Widgets (under core-kluster)

| Feature | Status | Bevis |
|---------|--------|-------|
| WH1 tyst inspelning | **partial** | `useWidgetVaultRecording`, `ingestWidgetRecording` |
| Android native widgets | **PASS** | Capacitor commit `3296de92` |
| Kill switch i widget | **PASS** | `KILL_SWITCH_EVENT` listener |

---

## GAP

| GAP | Allvar | Åtgärd |
|-----|--------|--------|
| NavigationDrawer | Medel | P1 enligt MENU-DRAWER-KANON |
| `/planering` route | Medel | `kör planering` |
| iOS PWA shake test | Låg | `module_plan.md` planned |

---

## Rekommenderat nästa steg

Implementera `NavigationDrawer.tsx` enligt `MENU-DRAWER-KANON.md` — eller tillfälligt dölj Planering-raden tills route finns.

---

## Blocker

Ingen för övrig app-start (`npm run dev`).
