# Inkorg — Orkestern / Analys-hub (bakom skölden · Valvet)

**Status:** **Analyserad** — F-V11 **behålls** → G19–G21  
**Datum:** 2026-05-23  
**Källa:** Användare (skärmdump + chatt)  
**Skärmdump:** [`artifacts/screenshots-inkorg-2026-05-23/20-orkestern-analys-hub-valvet.png`](./artifacts/screenshots-inkorg-2026-05-23/20-orkestern-analys-hub-valvet.png)

---

## Användarens intent

> Typ av **analys-hub** för att analysera i **kunskapsbanken/arkivet**. Funktionen ska **låsas** men **byggas ut** — och finnas **bakom skölden**, dvs i det **låsta Valvet** (inte på öppna hem/vardagen).

---

## Placering (låst i inkorg — ej på Kunskapsvalvet-UI)

| Plats | Route / gate | Tillåtet |
|-------|----------------|----------|
| **JA — Inre försvaret** | `/dagbok?tab=bevis` efter **Fyren** (3s + WebAuthn/PIN) | Orkestern, dokumentanalys, WORM-lista |
| **NEJ — Yttre lugnet** | `/`, `/vardagen?tab=kunskap`, `/mabra`, Barnen glada vyer | Ingen gaslighting-taggar, ingen SMS-lista med `#VÅLD-HOS-MAMMA` |

**Terminologi:** Användaren säger *kunskapsbank/arkiv* = i kanon oftast **Hela arkivet** / bevisarkiv (`reality_vault`, Drive-ingest, Dossier) — **inte** Kunskapsvalvet-RAG (`kampspar`/`kb_docs`) på `/vardagen`.

**Silo:** Orkestern **MUST NOT** blanda Valv-svar med `knowledgeVaultQuery` eller Barnen-RAG. Se [`.context/arkiv-minne.md`](../../.context/arkiv-minne.md) · [`ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md`](../specs/ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md) §4–5.

---

## Skärmdump — ORKESTERN AV AI-AGENTER

| UI-del | Innehåll |
|--------|----------|
| Rubrik | **ORKESTERN AV AI-AGENTER** |
| Underrad | Externa dokument dekonstrueras, sorteras, säkras i dolda arkiv utan kognitiv belastning |
| **Vävaren** | Indexerar PDF & OCR |
| **Spejaren** | Söker beteendemönster |
| **Säkraren** | Sätter WORM-sigill (sköld-ikon) |
| Primär CTA | **Kör mönstersökning i arkivet** |
| Lista | **REGISTRERADE DOKUMENT** med filnamn, typ, storlek, AI-taggar |

**Exempel i mock:**

| Fil | Metadata | Taggar |
|-----|----------|--------|
| `Sms_Export_Maj_2026.txt` | SMS-Tråd · 48 KB | `#GASLIGHTING`, `#PROJEKTION` |
| `Orosanmälan_Skola_Kasper_2…` | Myndighet · 1.4 MB | `#VÅLD-HOS-MAMMA`, `#FYSISK-SÄKERHET` |

---

## Utkast funktionslås (F-V11 — kopplas till G19–G21)

| ID | Krav | Detalj |
|----|------|--------|
| F-V11.1 | Gate | Panel synlig **endast** med `hasVaultGate()` / upplåst bevis-flik |
| F-V11.2 | Tre agenter | Vävaren · Spejaren · Säkraren — status/indikator per agent (ej bara dekoration) |
| F-V11.3 | Dokumentlista | Registrerade filer (SMS, PDF, myndighet) med deterministiska taggar + käll-id |
| F-V11.4 | Mönstersökning | CTA → trend/filter över tid (gaslighting, lojalitetspress, projektion) |
| F-V11.5 | WORM | Säkraren = create-only `reality_vault` — **ingen** redigerbar tagg utan HITL om krav |
| F-V11.6 | Copy | Forensisk, kall ton — **ingen** KBT/Måbra på samma vy |

**Befintliga GAP (repo):**

| GAP | Mappning mot mock |
|-----|-------------------|
| **G19** | Orkestern-flik + agentpanel (Vävaren/Spejaren/Säkraren) |
| **G20** | Batch SMS / orosanmälan / inkorg → WORM |
| **G21** | Mönstersökaren + frekvenstrender |

Kanon vid `kör [GAP]`: [`Arkiv-GAP-REGISTER.md`](../specs/modules/Arkiv-GAP-REGISTER.md) · [`Verklighetsvalvet-SPEC.md`](../specs/modules/Verklighetsvalvet-SPEC.md) §16.

---

## Snabb runtime mot repo (preliminär — full analys vid `kör UX-inkorg-analys`)

| Mock | Repo idag | Label |
|------|-----------|-------|
| Vävaren indexerar | `weaverAgent.ts`, `vävaren_metadata` | **PASS** (delvis UI) |
| Inkorg → struktur | `inboxClassifier`, Drive ingest | **DELVIS** |
| WORM-sigill | `assertWormPayload`, `firestore.rules` | **PASS** |
| Orkestern-flik UI | — | **GAP** G19 |
| Mönstersökning-knapp | — | **GAP** G21 |
| Dokumentlista med #taggar | — | **GAP** G20/G21 |

---

## Relaterat

- Master-inkorg: [`2026-05-22-inkorg-ux-navigation.md`](./2026-05-22-inkorg-ux-navigation.md)  
- Yttre/inre: [`ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md`](../specs/ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md)

## Analys 2026-05-23

| Beslut | Detalj |
|--------|--------|
| **Behåll** | Placering bakom Fyren, tre agenter, dokumentlista, CTA — bild 20 |
| **PASS** | Gate, WORM, `weaverAgent.ts:1-16` |
| **GAP** | UI → **G19** (flik), **G20** (batch), **G21** (mönstersökning) |
| **Ej** | `/vardagen?tab=kunskap` — oförändrat |

**Nästa:** `kör G19` eller P1 #4 i analys.
