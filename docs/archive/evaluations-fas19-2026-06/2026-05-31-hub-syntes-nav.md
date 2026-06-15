# Hub-syntes — navigering (2026-05-31)

**Input:** 8 hub-analyser `2026-05-31-hub-*-analys.md`  
**Kanon:** `MENU-DRAWER-KANON.md`, `.context/locked-ux-features.md`

---

## 1. Kors-hub nav-konflikter

| Namn | Var | Syfte | Risk |
|------|-----|-------|------|
| **Reflektion** | Dagbok, Familjen | Journal vs barnfokus | OK om header visar hub |
| **Speglar** | Dagbok, Hamn (bro) | Full ACT vs länk-stub | Hamn-flik → «Till Speglar» |
| **Inkorg** | Göra, Planering, G10 | Mejl vs självsortering | GoraHubTabBar + work tabs — förenkla |
| **Projekt** | Göra, `/projekt` | Hub vs sida | En URL `/projekt/ny` i Fyren |
| **Logg** | Arbetsliv, Dagbok, Barnen | Ekonomiledger vs journal vs barnlogg | «Ekonomilogg» i Arbetsliv |
| **Stöd** | Drogfrihet ×2 flikar | 113 vs FACT | `resurser`→«Akut & stöd», `kunskap`→«Kunskap» |
| **Valv / Dagbok** | Header | Alltid «Valv» på `/dagbok` | Header: Dagbok vs Arkiv |
| **Planering / Göra** | Header, drawer | Hybrid lock | Header: «Göra» |

---

## 2. Rekommenderad tab-ordning (ADHD progressive disclosure)

| Hub | Ordning | Default |
|-----|---------|---------|
| Dagbok | Reflektion → Speglar → (Bevis dold) | reflektion |
| Familjen | Reflektion → Livslogg → Tillsammans → Barnporten | reflektion |
| Vardagen | Kompasser → Ekonomi | kompasser |
| Göra | Handling → Projekt → Inkorg | **handling** (kanban) |
| Arbetsliv | Stämpel → Tid & flex → Ekonomilogg | stampla |
| Hamn | BIFF (default) → Översikt → Till Speglar → Barnfokus | biff |
| Drogfrihet | Idag → Akut & stöd → Reflektion → Kunskap | idag |
| Valv | Zon-TabBar i VaultPage; drawer 5 platta rader | samla/logga |

---

## 3. Implementeringskö P1–P8

| Prio | Hub | P1 (Fas 1 — auto) | Smoke |
|------|-----|-------------------|-------|
| P1 | Göra | Default `/planering` → kanban; header «Göra»; verktyg `?tab=hub` | locked-ux |
| P2 | Kompass | Header Dagbok/Arkiv; Fyren `/projekt/ny`; drawer footer copy | locked-ux, design-modules |
| P3 | Trygghet | Drogfrihet tab-labels; Hamn «Till Speglar»; pageContextSummary | design-modules |
| P4 | Arbetsliv | Ikoner; «Ekonomilogg»; Tid utan dubbel stämpel | arbetsliv, stampla |
| P5 | Valv | Weaver-badge på `valv_samla`; Monster empty «Arkiv» | locked-ux, valv |
| P6 | Familjen | Barnporten i hubContextBar | locked-ux, children |
| P7 | Dagbok | Wizard unmount cleanup; flikordning sync (navTruth) | speglar, orkester |
| P8 | Vardag | Doc-only + copy vardagen pageContext (ingen kunskap-flik) | compass, mabra |

---

## 4. Kräver PMIR / explicit OK

- Barnporten kanon-UI (tvåkorts inkorg) — ändrar smoke-strängar
- Familje-PIN på `/familjen`
- G18 dölj Bevis-flik
- Gmail e-post Fas 2 / nya callables
- Flytta privat ledger från Arbetsliv till Vardagen
- Drawer-struktur utöver kanon

---

## 5. Auto-implementerade i Fas 1 (denna körning)

Se git diff — UI/nav/copy only, inga `firestore.rules`.

---

## Nästa steg

Manuell Fas 5A (#3, #4, #2d) kvar enligt `SMOKE_RESULTS.md`. Deploy: **hosting only** efter build PASS.
