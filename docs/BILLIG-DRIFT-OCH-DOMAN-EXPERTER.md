# Billig drift + domänexperter (kunskapskarta)

**Datum:** 2026-05-23  
**Syfte:** Samla kunskap och hjälpmedel för flikar/funktioner (ADHD, ångest, känslor, föräldraskap, återhämtning/substans) utan att bränna GCP-krediter.  
**Regel:** Cursor-lager = gratis. Ny Cloud Function / ny LLM-rutt = kostar — kräv `kör [GAP]` eller explicit godkännande.

---

## Tre lager (billigast först)

| Lager | Vad | Kostnad | När |
|-------|-----|---------|-----|
| **1 — Cursor** | Underagenter U11–U15 + skills + denna fil | $0 moln | Utveckling, idéer, UX, copy |
| **2 — Befintlig runtime** | Moduler + callables som redan finns | Endast vid användning | Prod idag |
| **3 — Ny backend** | Ny agent, synaps, deploy | Per anrop + cold start | Efter `kör [GAP]` |

**Princip:** Bygg minne och hjälp i **lager 1–2** tills plånboken tillåter lager 3.

---

## Domän → modul → minne → Cursor-expert

| Domän | Route / modul | Runtime (PASS) | Minne (silo) | Cursor U# |
|-------|---------------|----------------|--------------|-----------|
| **ADHD / exekutiv** | `/vardagen` Kompasser | Paralys-Brytaren, `breakDownResponse`, `user_overwhelm` synapse | `kampspar` (kunskap) | **U12** `livskompassen-kompasser` |
| **Ångest / GAD / RSD** | `/mabra` | `mabraCoach`, 4-7-8, hubs `panic_rsd` | `mabra_sessions`, `mabra_progress` | **U11** `livskompassen-mabra` |
| **Känslor / reflektion** | `/dagbok`, `/speglar` | Speglings-Coachen, Vävaren, humör | `journal` (WORM), valfritt `journal_woven` → kampspar | **U14** `livskompassen-hjartat` |
| **Föräldraskap** | `/familjen` | `childrenLogsQuery`, BBIC-logg | `children_logs` (WORM) | **U13** `livskompassen-barnen` |
| **Återhämtning / substans / F155** | *(ingen dedikerad flik)* | Policy: trauma → HITL; F155 i profil-seed | Opt-in `ingestKampsparEntry` only | **U15** `livskompassen-aterhamtning` |
| **Ex / gränser** | `/hamn` | `analyzeMessage`, Gräns-Arkitekten | `reality_vault` via inkorg | **U9** (finns) |

**Tre silor — blanda aldrig RAG:** Kunskap (`kampspar`/`kb_docs`) · Valv (`reality_vault`) · Barnen (`children_logs`). Se [`.context/arkiv-minne.md`](../.context/arkiv-minne.md).

---

## Billigaste molnkostnader (låst drift)

Från [`GCP-INVENTORY-LATEST.md`](GCP-INVENTORY-LATEST.md) och [`GCP-KONSOLIDERING-BESLUT.md`](GCP-KONSOLIDERING-BESLUT.md):

- **Region:** `europe-west1` — Functions, Firestore, Vector endpoint.
- **Scale-to-zero:** Cloud Functions utan trafik ≈ $0.
- **Vector Search:** Endpoint kan stå kvar; kostnad växer med index-storlek och queries — minimera onödiga `knowledgeVaultQuery` i dev.
- **Embeddings:** En per manuell `ingestKampsparEntry` — batcha texter, skriv inte om samma post.
- **Drive ingest:** Gratis webhook-väg; LLM vid klassificering — undvik spam-testfiler i inkorgen.
- **Legacy Python us-central1:** Borta — använd inte gamla endpoints.

### Kostnad per användarhandling (ungefärlig prioritet)

| Handling | Typisk kostnad | Billigare alternativ |
|----------|----------------|----------------------|
| Spara journal / barnlogg | Firestore write only | Gör det — bygger WORM utan LLM |
| `mabraCoach` / Kompis | 1× Gemini | Kort prompt; undvik långa trådar i dev |
| `knowledgeVaultQuery` | RAG + ev. ANN | Sök sällan under utveckling; använd Tidshjulet UI |
| `notifyNewFile` / inkorg | Klassificering + ev. ingest | Manuell `confirmInboxItem` för känsligt |
| Ny synaps med LLM | Samma som callable | **GAP** — dokumentera först |

---

## Minne som växer billigt (för dig + barnen)

1. **WORM först (gratis writes):** `journal`, `children_logs`, `reality_vault` — appen glömmer aldrig; ingen Vector-kostnad.
2. **Kunskap (RAG):** Manuell ingest enligt [`MINNE-MANUELL-INGEST-DOMANER.md`](MINNE-MANUELL-INGEST-DOMANER.md) — en post i taget, kategori `profil` / `insikt` / `medicin` / `barn`.
3. **Trauma / substans / F155:** **Opt-in only** — checkbox i UI eller `confirmInboxItem`; aldrig auto från Drive (G10 `traumaSensitive` → `review`).
4. **Barnen:** Neutrala observationer i Familjen — mönster-RAG senare via `childrenLogsQuery` (redan PASS).
5. **Framtid billigt:** `journal_woven` synaps (G7 done) — endast när användaren kryssar i Dagbok.

Profil-start: [`specs/modules/Kampspar-PROFIL-SEED.json`](specs/modules/Kampspar-PROFIL-SEED.json) (redan seed — duplicera inte i prod utan script).

---

## Runtime-gap (kräver `kör [GAP]` + budget)

| Gap | Beskrivning | Billig väg |
|-----|-------------|------------|
| Kompis → Paralys/RSD | Cards finns; `routeFromDcap` når bara Livs + Gräns | Använd `/mabra`, `breakDownResponse`, Kompasser UI |
| Dedikerad substans-agent | Ingen prompt/callable | U15 Cursor + manuellt minne tills GAP |
| G19–G21 Orkestern | Batch SMS-mönster | U14 + manuell valv-export |
| Ny synaps `wellness_checkin` | Skulle trigga LLM | **Spec only** — se [`Doman-Agenter-GAP.md`](specs/modules/Doman-Agenter-GAP.md) |

**DCAP-notis:** "missbruk" i DCAP = psykologiskt/manipulativt missbruk — **inte** substans. Substans → U15 + människa vid akut risk.

---

## Synapser idag (använd, lägg inte till i onödan)

| Trigger | Fil | Kostar LLM? |
|---------|-----|-------------|
| `drive_file_ingested` | `driveIngestSynapse.ts` | Vid klassificering |
| `journal_woven` | `journalWovenSynapse.ts` | Opt-in |
| `dcap_alert` | `dcapAlertSynapse.ts` | Nej (WORM alert) |
| `user_overwhelm` | `paralysBrytarenSynapse.ts` | Nej (mikrosteg) |

Planerade (ej implementerade): se [`specs/modules/Doman-Agenter-GAP.md`](specs/modules/Doman-Agenter-GAP.md).

---

## Cursor-triggers (kopiera i chat)

| Säg | Agent |
|-----|-------|
| `kör mabra` eller ångest/panik | U11 livskompassen-mabra |
| `kör kompasser` eller ADHD/paralys | U12 livskompassen-kompasser |
| `kör barnen` (operativ, inte audit) | U13 livskompassen-barnen |
| `kör hjärtat` eller dagbok humör | U14 livskompassen-hjartat |
| `kör återhämtning` eller F155/substans | U15 livskompassen-aterhamtning |
| `kör grunder U5` | Audit Barnen-silo (readonly) |

---

## Nästa steg när krediter finns

Prioritet efter kostnad/NYTTA:

1. Wire `routeFromDcap` → `agent_paralys_brytaren` vid overwhelm (liten kod, stor ADHD-nytta).
2. `agent_rsd_kylaren` callable eller Kompis-rutt (återanvänd executor-mönster).
3. Valfri **Återhämtning**-hub i `/mabra` (länk, inte ny backend) — harm reduction copy från SPEC.
4. G19–G21 endast om valv-data finns att batcha.

Tills dess: **U11–U15 + manuellt minne + befintliga flikar.**

---

## Relaterade filer

- [AGENTS.md](../AGENTS.md) — U11–U15 tabell
- [Arkiv-GAP-REGISTER.md](specs/modules/Arkiv-GAP-REGISTER.md) — G17, G19–G21 öppna
- [ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md](specs/ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md)
- [Mabra-SPEC.md](specs/modules/Mabra-SPEC.md) · [Barnen-SPEC.md](specs/modules/Barnen-SPEC.md)
