# Inkorg — Barnfokus: profilkort (Arvid & Kasper)

**Status:** Inkorg — **lås intent, bygg ut**  
**Datum:** 2026-05-23  
**Källa:** Användare (klistrad `ChildFocus.tsx`)  
**Kod:** [`artifacts/gemini-child-focus-ChildFocus.tsx`](./artifacts/gemini-child-focus-ChildFocus.tsx)  
**Skärmdump (dashboard):** [`dashboard-04-barn-profilkort-arvid-kasper.png`](./artifacts/screenshots-inkorg-2026-05-23/dashboard-04-barn-profilkort-arvid-kasper.png) (Gemini batch)  
**Modul:** `/familjen` · Barnen-silo · koppling **F-04** i [`Gemini-Dashboard-FUNKTIONSLOCK.md`](../specs/incoming/Gemini-Dashboard-FUNKTIONSLOCK.md)

**Relaterat (samma modul, annat flöde):** [`2026-05-23-inkorg-barnen-fragekort.md`](./2026-05-23-inkorg-barnen-fragekort.md) — slumpfrågor + livslogg (**F-B11**).

---

## Användarens intent

> Barnfokus-vy: **Den trygga hamnen** — stabila profilkort för Arvid och Kasper (observationer + fokus-rad), neutral ton utan vuxenkonflikt.

---

## Mock-komponent — innehåll

| Del | Innehåll |
|-----|----------|
| Banner | *Barnfokus: Den Trygga Hamnen* + stödjande copy |
| **Arvid** | Klättring/teckning; rutiner; Fokus: lyssna, bekräfta, kravlös tid |
| **Kasper** | Sånger i bilen; trygghet vid överlämning; Fokus: lekfulla minnen utan skuld |

**Design (mock):** emerald — **ej låst**. Repo: Obsidian Calm + guld accent per `Barnen-SPEC` §4.

---

## Utkast funktionslås (F-B12 — profilkort)

| ID | Krav | Detalj |
|----|------|--------|
| F-B12.1 | Två barn | Endast **Arvid** och **Kasper** (`childAlias`) |
| F-B12.2 | Profilkort | Avatar-bokstav, undertitel, 2 observationer, **Fokus**-rad |
| F-B12.3 | Copy | Ingen ex-konflikt, inga juridiska termer — yttre lugnet-ton |
| F-B12.4 | Data | Observationer från `children_logs` eller manuellt underhållna profiler — specialist väljer |
| F-B12.5 | Route | `/familjen?tab=barnfokus` eller översikt — ej Valv |

---

## Snabb GAP mot repo (preliminär)

| Mock | Repo idag | Label |
|------|-----------|-------|
| Barnfokus banner | Delvis `FamiljenOversiktPanel` | **DELVIS** |
| Profilkort Arvid/Kasper | — | **GAP** (F-04) |
| `ChildFocus.tsx` | Ej i `src/` | **GAP** (inkorg artifact) |

---

## Relaterat

- [`Barnen-SPEC.md`](../specs/modules/Barnen-SPEC.md)  
- Master: [`2026-05-22-inkorg-ux-navigation.md`](./2026-05-22-inkorg-ux-navigation.md)

## Analys 2026-05-23

| Beslut | Detalj |
|--------|--------|
| **Behåll** | F-B12 + mock `ChildFocus.tsx` som referens |
| **PASS** | F-04 UI — `ChildProfileCards.tsx`, `FamiljenPage.tsx:44-45` |
| **P1** | Koppla observationer till `children_logs` (idag statisk seed) |

**Nästa:** P2 i analys — efter F-B11.
