# Kladd-2026-05-21-PERSONAL-MASTER

**Källa:** Notebook-sammanfattningar #1–#7 + Master Extraction (2026-05-21).  
**Konsoliderad:** Cursor Agent — ingen kod i denna pass.  
**Integritet:** Innehåller känslig medicinsk/juridisk data. Committa inte till publikt git utan redigering.

**Relaterat:** [`Kladd-2026-05-21-kampspar-kandidater.md`](Kladd-2026-05-21-kampspar-kandidater.md) · Prompter: [`ai-prompts-kladd-kampspar.md`](../ai-prompts-kladd-kampspar.md)

---

## A. Aktörer och kontext

| Aktör | Roll | Notering |
|-------|------|----------|
| Pontus (pappa) | Användare | Född nov 1992. ADHD (F90.0B), GAD (F41.1). F155 substansutlöst psykos feb 2026 (engång, stressdriven). Sjukskrivning stegvis våren 2026. |
| Isabelle | Ex / barnens mor | Vårdnadskonflikt. Orosanmälan mot hemmiljö (farmor). |
| Kasper | Barn, f. 2018-08-19 | Autism nivå 1 + ADHD (komb.). Utagerande i skola; trött/hungrig mammaveckor (skola). |
| Arvid | Barn, f. 2021-06-02 | Regression/emotionell smitta enligt observationer. |
| Elisabeth Franck | Farmor | Orosanmälan 2026-03-05. |
| Anna Fagergren | Soc, Mölndal | Samordning mars 2026. [OSÄKERT: även "Fallgren" i källa] |
| Ann (skola), Lena Törning | Skolresurs / rektor | Tredjepart — Kasper beteende, mammaveckor. |
| Szczecinska, Pietruczuk, Spano, Djalali | Vård | Slutenvård, GAD, medicinjustering. |

**[OSÄKERT]** Theodor (11 år) i Family Link-guide — ej bekräftat i vårdnadskonflikt-scope.

---

## B. Tidslinje (kronologisk)

| Datum | Händelse |
|-------|----------|
| 2018-08-19 | Kasper föds |
| 2021-06-02 | Arvid föds |
| 2025-06-08 | Insikt: ifrågasätter att "Isabelle har rätt i allt" |
| 2025-10-18 02:28 | Anteckning: alkohol/stress — "Tappa inte bort dig själv" |
| 2025-11–12 | Kasper neuropsykiatrisk utredning (Autism/ADHD) |
| 2026-02-15 | Anteckning: identitet / "ordbajs" |
| 2026-02-23–26 | Slutenvård, F155, sjukskrivning 100% |
| 2026-03-02 | Soc-möte (pappa); drogtester via Neuropsykiatri Öster |
| 2026-03-05 | Orosanmälan farmor |
| 2026-03-10 | Soc + psykiatri samordning; mamma: "kameleont", farmor "medberoende" |
| 2026-03-12 | Kasper biter i skola; barnsamtal (arg smiley mamma); Ann larmar soc |
| 2026-03-25 | GAD (F41.1) fastställt; stegvis sjukskrivning |
| 2026-03-27 | Planerad 50/50 umgänge |
| 2026-04-01 | 1177 — Alimemazin-biverkningar (somnolens) |
| 2026-04-02 | Behandlingskonferens (Spano) |
| 2026-04-14 | Distanskontakt neuropsykiatri |

**Sjukskrivning:** 100% (23 feb – 12 apr) → 75% (13 apr – 26 apr) → 50% (27 apr – 24 maj 2026).

---

## C. Mönster (bevaras i produkt/minne)

- Gaslighting / crazymaking: "Det har aldrig hänt", "Din hjärna är trasig"
- Silent treatment, hot mot barn (flytt till pappa)
- DARVO / projektion / syndabock (Kasper i skola)
- Social kameleont (facad utåt vs privat)
- **Strategi mot soc/rätt:** Säg inte "narcissist" — barnets bästa + fakta + tredjepart

---

## D. Beviskandidater → `reality_vault` (prioritet)

1. Orosanmälan farmor (2026-03-05) — PDF/bilaga
2. Skolans observationer (Ann, Lena) — Kasper beteende, trötthet mammaveckor
3. Barnsamtal 2026-03-12 — arg smiley mamma (neutral logg + ev. valv)
4. Läkarintyg / slutenvård / GAD-bedömning (miljödriven dekompensation)
5. SMS/mejl tvåspalt — förnekade överenskommelser, patologisering
6. Skärmdumpar / röstmemo / PDF-export sms-tråd (iMazing/Decipher — ej skärmdumpslängd)

**Metod (Kladd #3):** Exportera hela sms-trådar till PDF med tidsstämpel. Sms ensamt = lägre bevisvärde; tredjepart (skola, BVC, soc) starkare.

---

## E. Kampspår-kandidater → `kampspar` / Kunskap

Se [`Kladd-2026-05-21-kampspar-kandidater.md`](Kladd-2026-05-21-kampspar-kandidater.md).

**Policy (låst 2026-05-21):** Trauma, LVU, missbruk, kriminalitet → **opt-in manuell ingest** per post. Ingen auto-RAG från rå Kladd-filer.

---

## F. Modul-routing (strikt separation)

| Innehåll | Primär modul | Sekundär |
|----------|--------------|----------|
| Ex-sms, BIFF, lockbeten | Hamn | Valv (bevis) |
| Forensiska fakta, PDF, sms-export | Valv | Dossier |
| Känsla vs fakta, ACT, VIVIR | Speglar | Hamn |
| Daglig reflektion, humör | Dagbok | Måbra (bro) |
| Kasper/Arvid, skola, fysiologi | Barnen | Valv (incident explicit) |
| Vagus, panik, självkritik, coping | Måbra | — |
| Metodartiklar (gaslighting, BBIC-tips) | Kunskap (kb_docs) | — |
| Morgon/dag/kväll, KASAM | Kompasser | Måbra/Barnen (länk) |
| Samlad export ombud | Dossier | Valv, Barnen |
| Budget, veckopeng | Ekonomi | — |

**INTE:** VIVIR i Måbra (→ Speglar). Livs-Coachen → Kunskap/Kompis, inte Ekonomi.

---

## G. Idéer från notebooks — status mot kod

| Idé | Status |
|-----|--------|
| WORM `allow update, delete: if false` | **[IMPLEMENTERAT]** |
| Fyren 3s → valv | **[IMPLEMENTERAT]** |
| Shake-to-Kill 15 m/s² | **[IMPLEMENTERAT]** — testa iOS PWA; dold nödknapp **planerat** |
| Tvåspalt, tresteg, magkänsel (text-chips) | **[IMPLEMENTERAT]** |
| Firebase Storage bevis | **[IMPLEMENTERAT]** — Drive → kb_docs, ej auto valv |
| Hamn BIFF + DCAP + spara bevis | **[IMPLEMENTERAT]** |
| Speglar ACT/VIVIR/compare | **[IMPLEMENTERAT]** |
| Barnen fysio 1–5 + balans 7d | **[IMPLEMENTERAT]** |
| Måbra hub routing (andning/grounding) | **[IMPLEMENTERAT]** fas 1.5 |
| Dossier generateDossier + hash | **[IMPLEMENTERAT]** |
| Vävaren → valv utan godkännande | **[DELVIS]** — auto `vävaren_metadata`; godkännande **planerat** |
| BBIC dossier-mall | **Planerat** fas 2 |
| Stjärnbilder / gamification | **[AVVISAT]** |
| Nordisk skymning grön / natur-UI | **[MOTSÄGER KOD]** — Obsidian Calm |
| GAS / Kalkylark / FastAPI backend | **[MOTSÄGER KOD]** — Firebase Functions |
| Synaps personregister (Aktörer) | **Planerat** |
| Auto Storage → Agentic Vision → valv | **Planerat** |
| Paralys UI i Kompasser | **Planerat** (*kör kompasser*) |
| Ekonomi vinst-knapp / veckopeng | **Planerat** |
| Tredjepart-tagg Barnen | **Planerat** — idag `category: skola` |
| Hamn "dölj tills jag har energi" | **Planerat** fas 2 |
| Sanningens Ankare först i valv | **Planerat** |

---

## H. Låsta produktbeslut (2026-05-21)

1. **Kunskap:** Trauma/beroende-historia endast opt-in manuella Kampspår-poster.
2. **Ingen gamification** (streak, stjärnor, frö/löv).
3. **Obsidian Calm** — inga natur/grön-paletter.
4. **Drive → valv:** manuellt godkännande; Drive → Kunskap auto (webhook).
5. **Blaze/GCP** för LLM — inte AI Studio gratis (sekretess).
6. **Soc-strategi:** Fakta + barnets bästa; undvik diagnostiserande etiketter mot motpart.

---

## I. Öppna beslut (väntar användare)

| # | Fråga | Rekommendation |
|---|--------|----------------|
| 1 | Paralys auto vid lågt humör? | **Nej** — manuell "överväldigad"-knapp |
| 2 | Vävaren-godkännande före valv? | **Ja** fas 2 |
| 3 | Sanningens Ankare som landning i valv? | Senaste + "Ny post"; Ankare = pin-vy fas 2 |
| 4 | BBIC-kategorier dossier? | Barnets utveckling, föräldraförmåga, skydd, relationer — bekräfta med ombud |
| 5 | Theodor i scope? | **[OSÄKERT]** — ignorera tills bekräftat |

---

## J. Citat att bevara (max 10, Grey Rock)

1. "Min hjärna är inte trasig. Den reagerar helt normalt på en onormal situation."
2. "Andas. Vänta. Svara inte. Sanningen behöver inte försvaras i affekt."
3. "Hennes ilska är inte bevis på att jag gjort fel. Det är bevis på att jag satt en gräns."
4. "Det där har alldrig hänt" [sic källa]
5. "Din hjärna är trasig"
6. "Svara, reagera inte. Håll dialogen strikt logistisk."
7. "Barnen behöver en pappa som stannar kvar i verkligheten."
8. "Sanningen brinner inte upp, den väntar på dig."
9. "Sluta förklara. Sätt gränsen. Bygg skyddet."
10. "Fakta ändras inte för att hon höjer rösten."

---

## K. Nästa steg (ingen kod i denna pass)

1. Läs gap-tabeller i `.context/modules/*.md` och `src/modules/*/module_plan.md`.
2. Använd appen: valv (bevis §D), Hamn (sms), Barnen (efter umgänge).
3. Säg *kör [modul]* när implementation ska starta.
