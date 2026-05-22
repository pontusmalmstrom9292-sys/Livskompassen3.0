# Grunder — systemanalys (kanon G01–G52)

**Datum:** 2026-05-22 (Fas C)  
**Register:** [`grunder-slides/INVENTAR.md`](./grunder-slides/INVENTAR.md) — full slide-tabell  
**Runtime-audit:** [`GRUNDER-UTVARDERING-RESULTAT.md`](./GRUNDER-UTVARDERING-RESULTAT.md)

---

## Statusfördelning

| Status | Antal | Regel |
|--------|------:|-------|
| implementerat | 2 | G35, G48 — live i prod |
| delvis | 18 | MVP/backlog — se GAP-register |
| vision-only | 30 | Dokumentera; **ej migrera Genkit** |
| avvisat | 2 | G05, G42 — **implementera aldrig** |
| design | 1 | G00 PDF — Obsidian Calm referens |

---

## Implementerat (bekräftat i kod)

| G | Slide | Runtime-bevis |
|---|-------|---------------|
| G35 | RBAC / custom claims | Firebase Auth + Firestore `isOwner` |
| G48 | Tre silos | `kampsparQueryRag`, `vaultRag`, `children_logs` isolering |

---

## Delvis — prioritet för backlog

| G | Område | GAP / nästa steg |
|---|--------|------------------|
| G08, G40, G43 | Offentligt/dolt lager | Verklighetsvalvet MVP live; full portal polish |
| G09, G14, G50 | Hotvektorer | DCAP + Gräns-Arkitekten live; G10 parity saknas |
| G32, G47 | Systemförsvar | BIFF routing live; G38 HITL saknas |
| G17, G21, G34 | Life-OS moduler | SynapseBus delvis; G9 EntityProfile |
| G18, G19 | Multi-agent | 10 cards + 2 executors; ej Genkit |
| G44 | Sanningens väktare | `reality_vault` WORM + Valv-Chat |
| G46 | BBIC / Dossier | `generateDossier` live |
| G16, G20 | MåBra | MVP hub + coach live |

---

## Vision-only (MUST NOT migrera utan beslut)

G01, G02–G04, G06–G07, G10–G15, G20–G29, G31, G36–G38, G41, G45, G51–G52 m.fl. — se INVENTAR.

**Genkit/Dotprompt (G01, G28, G29):** V1 **wait** — kanon = [`sharedRules.ts`](../../../functions/src/sharedRules.ts).

---

## Avvisat

- **G05** — cirkulär MåBra flow-vy / gamification  
- **G42** — digital växt / plant-gamification  

---

## U1–U5 sammanfattning

Se [`GRUNDER-UTVARDERING-RESULTAT.md`](./GRUNDER-UTVARDERING-RESULTAT.md). Kritiska runtime-GAP:

1. G10 injection-parity → kanon-docs  
2. RSD dedikerad prompt (U4.3)  
3. G52 PA → `Barnen-SPEC.md` (U5.3)  
4. Kompis barn-routing (U5.5)

---

## Relaterade GCP-beslut

Legacy stack avvecklas enligt [`docs/GCP-KONSOLIDERING-BESLUT.md`](../../GCP-KONSOLIDERING-BESLUT.md) — **ingen** Grunder-slide kräver legacy Python KB.
