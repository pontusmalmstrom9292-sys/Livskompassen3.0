# AI-prompter — Kladd & Minne

Strukturera rörigt material för Livskompassen. **Modulöversikt och arkitektur:** [`ai-prompts-moduler-master.md`](ai-prompts-moduler-master.md).

Kopiera **en prompt** per konversation till extern AI (NotebookLM, Gemini, Apple Notes).  
Spara output som `docs/archive/kladd/Kladd-YYYY-MM-DD-kort-titel.md` och konsolidera i Cursor.

Relaterat: [`ai-prompts-heart.md`](ai-prompts-heart.md), [`ai-prompts-wave2.md`](ai-prompts-wave2.md).

---

## A. Master — Kladd-sanerare

Bifoga filer eller klistra in rörig text efter prompten.

```
Du hjälper mig strukturera rörigt material för Livskompassen v2 (Life OS, ADHD/GAD, vårdnadskonflikt, Grey Rock/BIFF).

INPUT: bifogade filer, klistrad text, eller transkript.
OUTPUT: ETT markdown-dokument med exakt dessa sektioner:
1. Fakta (datum, vem, vad hände — inga tolkningar)
2. Logistik 10% (beslut, tider, leveranser, schema)
3. Brus 90% (anklagelser, projektioner, känslomässiga beten — märk [BRUS])
4. Mönster (upprepning, DARVO, gaslighting — endast om texten stödjer)
5. Beviskandidater (vad bör in i Verklighetsvalvet / reality_vault)
6. Minne-kandidater (miljöer, utmaningar, milstolpar, rutiner)
7. Öppna frågor till mig (max 5)
8. Föreslagen modul i appen (se routing nedan)
9. Citat att bevara ordagrant (max 10 korta)
10. Tidslinje (kronologisk punktlista)
11. Risk/integritet (PII, barn, juridik — flagga [KÄNSLIGT])

Regler: Gissa aldrig datum. Markera osäkerhet [OSÄKERT]. Svenska. Ingen JADE-ton.
Filnamn-förslag: Kladd-[YYYY-MM-DD]-[kort-titel].md
```

---

## B. Per-källtyp (lägg efter master)

### SMS / mejl med ex

```
KÄLLTYP: SMS eller mejl från motpart.
Extrahera: BIFF/Grey Rock-svar (max 3 meningar), logistik ja/nej, beviskandidat → reality_vault.
Modul: hamn (+ ev. valv som bevis).
```

### Juridiska / BO-dokument

```
KÄLLTYP: Juridiskt eller myndighetsdokument.
Extrahera: parter, datum, beslut, deadlines, beviskandidater med sidhänvisning.
Modul: valv, dossier (planerat).
```

### Terapi / coaching / självarbete

```
KÄLLTYP: Terapi, coaching, KBT-anteckningar, självreflektion.
Extrahera: Minne-milstolpar, coping, värderingar, övningsidéer för Måbra-sidan.
Modul: mabra, kunskap (Minne), dagbok.
Flagga [KÄNSLIGT] — inget till motpart.
```

### Dagboksfragment

```
KÄLLTYP: Dagboksanteckning eller journalfragment.
Extrahera: humör, reflektion, vävaren-taggar.
Modul: dagbok.
```

### Barnrelaterat

```
KÄLLTYP: Barn, skola, umgänge, fysiologi.
Extrahera: children_logs (Kasper/Arvid) vs vuxenkonflikt — separera tydligt.
Modul: barnen (+ ev. valv vid allvarlig incident).
```

---

## C. Konsolidering i Cursor

```
Jag laddar upp Kladd-*.md till docs/specs/modules/.
Konsolidera till rätt .context/modules/*.md + module_plan.md gap-tabell.
Extrahera Minne-rader till strukturerad lista (title, date, category, content, source).
Implementera INTE kod förrän jag säger "kör".
Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän dokumentationen är konsekvent.
```

---

## D. Batch — Kompis / Kunskap SPEC

```
Sammanfatta bifogat material till Kunskap-SPEC.md (11 sektioner enligt ai-prompts-moduler-master.md).
Fokus: Minne datamodell, Kunskapsvalvet UX, Tidshjulet, ingest, skilj från Valv-Chat.
Markera: klart / delvis / planerat / motsägelse mot kod.
```

---

## 8. Vilken modul gäller detta? (routing-regler)

| Innehåll | Primär modul | Route | Sekundär |
|----------|--------------|-------|----------|
| Ex-sms, BIFF, Grey Rock | Hamn | `/hamn` | Valv (bevis) |
| Forensiska fakta, gaslighting-bevis | Verklighetsvalvet | `/dagbok?tab=bevis` | Dossier |
| Känsla vs fakta, ACT | Speglar | `/dagbok?tab=speglar` | Hamn |
| Daglig reflektion, humör | Dagbok | `/dagbok` | Speglar |
| Livsminne, mönster, dokument-RAG | Kunskap / Minne | `/vardagen?tab=kunskap` | — |
| Kasper/Arvid, skola, sömn | Barnen | `/familjen` | Valv (incident) |
| KBT, självmedkänsla, värderingar | **Måbra-sidan** | **`/mabra`** | Dagbok |
| Budget, transaktioner | Ekonomi | `/vardagen?tab=ekonomi` | — |
| Samlad export ombud | Dossier | `/dossier` | Valv, Barnen |

---

## Rekommenderat flöde

| Steg | Var | Åtgärd |
|------|-----|--------|
| 1 | Extern AI | Kör prompt A (+ ev. B) |
| 2 | `docs/specs/modules/` | Spara `Kladd-*.md` |
| 3 | Cursor | Kör prompt C |
| 4 | (Valfritt) Drive Inbox | PDF → kb_docs när webhook + ownerId är konfigurerade |

Se [`DRIVE_AUTOMATION.md`](../DRIVE_AUTOMATION.md).
