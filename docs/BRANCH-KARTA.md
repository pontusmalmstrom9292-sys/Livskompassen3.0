# Branch-karta — var sanningen bor

**Syfte:** En aktiv utvecklingsgren (`main`). Inget förstört — historik finns i git.

**Senast:** 2026-05-28 (Copilot-gren `feature/hallucination-guard-and-structure` avvisad + raderad på GitHub)

**Senast merge:** 2026-05-26 (`theme-pack-j` → `main`, drawer Vardag/Valv, Inkast Lite, Life Hub, Theme Pack J)

---

## Aktiv gren

| Branch | Innehåll | Stäng-kriterium |
|--------|----------|-----------------|
| **`main`** | Drawer helhetsindex, Valv-baksida, Inkast Lite, Life Hub Fas A+B, Theme Pack J, Fyren hub-kontextrad, Arbetsliv-hub | `npm run smoke:locked-ux` + `smoke:orkester` före "klart" |

### theme-pack-j — merged 2026-05-26

| Detalj | Värde |
|--------|--------|
| **PMIR** | [`evaluations/2026-05-26-pmir-theme-pack-j.md`](./evaluations/2026-05-26-pmir-theme-pack-j.md) |
| **Gren** | `theme-pack-j` mergad till `main`; remote kan raderas efter verifiering |
| **Smoke** | build + locked-ux + orkester **PASS** på `main` |

### Arbetsliv — kanon på main (2026-05-25)

| Commit | Innehåll |
|--------|----------|
| `9979df47` | Stämpelklocka, `time_entries`, hem-widget |
| `514c8c80` | Hub `/arbetsliv`, frånvaro/lön (PIN `arbetsliv_forensic`), `generatePayslip` |

**Route:** `/arbetsliv` (meny **Arbetsliv**). `/stampla` redirectar hit. Vardagen-ekonomi = enkel veckopeng.

**Tag (återställning):** `arbetsliv-hub-2026-05-25` på `main`.

**OBS:** `feat/valv-inkorg-ui` har *inte* hubben — cherry-pick från main, ingen wholesale-merge (se regel nedan).

**Remote:** `origin` = https://github.com/pontusmalmstrom9292-sys/Livskompassen3.0.git

---

## Stängda grenar (2026-05-24)

| Branch | Status | Anmärkning |
|--------|--------|------------|
| `cursor/planering-kbt-p1` | **Merged + stängd** | PR #2 + Fyren-fix cherry-pick `b82f9ab8` |
| `split/orkester-autorun` | **Stängd** | Innehåll redan på `main` via PR #2 |
| `audit-byggpass-2026-05-22` | **Stängd** | Äldre bas; låst UX fanns på `main` |
| `cursor/stadguide-enkel-svenska` | **Raderad 2026-05-25** | Innehåll ersatt/uppdaterat på `main` (`stadguide_enkel_svenska.md`) |
| `feature/hallucination-guard-and-structure` | **Avvisad + raderad 2026-05-28** | Copilot: oanslutna `hallucinationGuard.ts` / `agentAuditLog.ts` — **ej mergad** till `main`. Se [`evaluations/2026-05-28-copilot-hallucination-branch-rejected.md`](./evaluations/2026-05-28-copilot-hallucination-branch-rejected.md) |

**GitHub remote (3.0):** endast **`main`** (+ tillfälliga `cursor/*` vid behov) — **merga inte** Copilot-säkerhetsgrenar utan PMIR.

---

## Parked — inkorg (lokalt på Mac, ej på GitHub)

| Branch | Innehåll | Beslut |
|--------|----------|--------|
| `feat/mabra-fragekort` | Frågekort / känslokompass (konflikt med KBT på main) | Produktbeslut senare |
| `feat/barnen-fragekort` | Inkorg | Cherry-pick vid behov |
| `feat/broar-inkorg` | Inkorg | Cherry-pick vid behov |
| `feat/design-inkorg` | Inkorg | Cherry-pick vid behov |
| `feat/valv-inkorg-ui` | Valv-inkorg UI (äldre; **ekonomi → main** via stämpel+arbetsliv) | Cherry-pick UI; **arbetstid alltid från `main`** |

**Regel:** Ingen wholesale-merge av `feat/*`. Se [`MERGE-IMPACT-RAPPORT.md`](./MERGE-IMPACT-RAPPORT.md).

---

## Untracked lokalt (committa inte)

| Mapp/fil | Åtgärd |
|----------|--------|
| `.orkester/` | Lokal körlogg |
| `.orkester-backup-cursor-hooks/` | Backup — ignoreras |
| `scripts/google-apps-script/.script-properties.local.txt` | Hemligheter |

---

## Hjälp

- **Lathund:** [`GIT-LATHUND.md`](./GIT-LATHUND.md)
- **Merge-beslut:** [`MERGE-IMPACT-RAPPORT.md`](./MERGE-IMPACT-RAPPORT.md)
- **Git-guide:** [`GITHUB_ANVANDARGUIDE.md`](./GITHUB_ANVANDARGUIDE.md)
