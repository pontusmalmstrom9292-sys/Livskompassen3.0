# Pre-Merge Impact Report (PMIR)

**Datum:** 2026-05-28  
**Gren:** `cursor/module-cluster-restructure` → **`main`**  
**Agent / session:** Cursor — modulkluster + TabRegistry

---

## Viktigt — nuläge på GitHub

| Ref | Commit | Innehåll |
|-----|--------|----------|
| **`origin/main`** | `7d1aeaa9` | `refactor(modules): cluster evidence, diary, wellbeing, admin, and family` |
| **`origin/cursor/module-cluster-restructure`** | `61e6c284` | Samma **filträd** som `7d1aeaa9` (identiskt innehåll, annat commit-id) |

**Konsekvens:** En merge `cursor/module-cluster-restructure` → `main` är **ingen ny kod** idag. PMIR gäller innehållet i committen och **stängning av feature-grenen** efter ditt OK — inte en andra merge av samma diff.

Bas före refactor: `46e2095a` (Capacitor 8-dokumentation på main).

---

## Följer med till main (vid merge från `46e2095a`)

- [x] **Mappstruktur** under `src/modules/`:
  - `evidence/` — `vault/` (verklighetsvalvet + dossier), `knowledge/` (Kunskapsbank-panel), `vaultChat/`
  - `diary/` — `diary/`, `mirror/`
  - `wellbeing/` — `mabra/`, `compasses/`
  - `admin/` — `planning/`, `projects/`
  - `family/` — `children/`
  - `shared/` — README (tom tills tvärgående behov)
- [x] **TabRegistry** — `src/modules/core/navigation/tabRegistry.ts`, `useHjartatHub.ts`, drawer-livsområden i `DrawerHubAccordion.tsx`
- [x] **Legacy-shims** — `modules/dagbok`, `verklighetsvalvet`, `kompasser`, m.fl. → tunna `index.ts` som re-exporterar nya paths
- [x] **Migrering** — `scripts/fix-module-imports.mjs`, `scripts/fix-relative-depth.mjs`
- [x] **Docs** — `docs/design/TAB-REGISTRY.md`, uppdaterad `src/modules/README.md`
- [x] **URL:er oförändrade** — `/dagbok`, `/vardagen`, `/mabra`, `/planering`, `/familjen`, `/dossier`, Valv `?tab=bevis&vaultTab=…`
- [x] Låst UX — `npm run smoke:locked-ux`: **PASS** (på `main` med `7d1aeaa9`)

**Rot kvar oförändrad i mapp:** `core`, `kompis`, `ekonomi`, `safe_harbor`, `arbetsliv`, `drogfrihet`, `inkast`, `widgets`, `barnporten`, `valv_ekonomi`, `stampla`.

---

## Försvinner (vid gren-radering)

| Vad | Detalj |
|-----|--------|
| Gren (remote) | `cursor/module-cluster-restructure` |
| Commits unika på grenen | `61e6c284` (samma träd som redan på `main` som `7d1aeaa9`) |
| Kod kvar **endast** på grenen | **inget** (efter att `main` redan har trädet) |
| Gamla importsökvägar | Fungerar via shims tills all kod uppdaterat; nya imports ska använda `evidence/vault`, `diary/diary`, … |

---

## Regelanalys (läst — inte gissad)

| Lager | Källor | Status |
|-------|--------|--------|
| **System U1–U6** | Tre silos oförändrade; inga nya RAG-routes; Kunskap kvar bakom Valv `kunskapsbank` | **PASS** |
| **Design / låst UX** | Barnfokus, Valv Mönster/Orkester/Kunskapsbank, Planering P3, drawer Vardag/Valv — smoke verifierar paths | **PASS** |
| **Säkerhet** | `firestore.rules` **ej** ändrad; `sharedRules.ts` **ej** ändrad; DCAP/auth oförändrat | **PASS** |

**Ej gjort (medvetet):**

- Nya URL:er (`/dagbok/evidence/…`) — nej (låst UX / bokmärken)
- Copilot `hallucinationGuard.ts` — nej (se [`2026-05-28-copilot-hallucination-branch-rejected.md`](./2026-05-28-copilot-hallucination-branch-rejected.md))
- Flytt av `kompis`, `ekonomi`, `safe_harbor` till kluster — senare produktbeslut

---

## Smoke (verifierat på `main` @ `7d1aeaa9`)

| Kommando | Resultat |
|----------|----------|
| `npm run smoke:locked-ux` | **PASS** |
| `npm run smoke:orkester` | **PASS** |
| `npm run build` | **PASS** |

---

## Risker / uppföljning

| Risk | Åtgärd |
|------|--------|
| Dokumentation med gamla sökvägar (`docs/`, `.context/`) | Uppdatera vid behov; kod + smoke pekar på nya paths |
| Importer via legacy-shim (`modules/dagbok`) | OK kort sikt; nya filer ska använda klusterpaths |
| Dublett-commit på main vs feature-gren | Ingen funktionell skada; radera feature-gren efter OK |

---

## Rekommendation

- [x] Merge till `main` + push `origin` — **`7d1aeaa9` på `origin/main`**
- [x] **Stäng** `cursor/module-cluster-restructure` (lokal + remote) — utfört efter godkännande
- [ ] Cherry-pick — —
- [ ] **Avbryt** — —

Efter godkännande: uppdatera [`docs/BRANCH-KARTA.md`](../BRANCH-KARTA.md) med rad för `cursor/module-cluster-restructure` → merged/stängd.

---

## Godkännande

**Användaren:** ☑ godkänn merge · ☑ stängning av gren  
**Datum:** 2026-05-28
