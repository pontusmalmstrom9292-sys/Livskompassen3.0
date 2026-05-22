# Måbra — Research Brief (Fas 0)

**Datum:** 2026-05-21  
**Källor:** 6 parallella expert-underagenter + [`Mabra-SPEC.md`](Mabra-SPEC.md) §14  
**Syfte:** Låst copy och flödesbeslut innan fas 2-implementation.

---

## Låsta UX-regler (alla hubs)

- Ett steg per vy; knappar **Gå vidare** / **Avsluta nu** — aldrig **Avbryt**
- Obsidian Calm; ingen streak, natur-tema, poäng
- Fritext i RAM — sparas **inte** i `mabra_sessions` (metadata only)
- AI opt-in; ingen Kunskap RAG; länk (inte auto) Dagbok/Kompasser
- Ex/gaslighting → Speglar (inte Måbra)

---

## 1. Panik / RSD → Akut + 4-7-8 (fas 2b)

**Flöde:** hub → akut → duration → breathing → complete

**AkutLanding copy:**
- Rubrik: *Det här är en reaktion i kroppen — inte ett misslyckande.*
- Brödtext: *Nervsystemet kör på högvarv. Det är biologiskt, inte karaktär. Du behöver inte förklara eller fixa något nu.*
- CTA: **Gå vidare** / **Avsluta nu**
- Hint: *En minut räcker om det känns tungt att börja.*

**Andning (panic_rsd):**
- Subtitle: *Kroppen får sakta ner. Följ cirkeln — inget att prestera.*
- Faser: *Andas in, 4* / *Stilla, 7* / *Ut långsamt, 8*
- Dölj cykel-räknare vid panik; visa *Tid kvar*
- Default 3 min; tips om 1 min utan skam

---

## 2. Självkritik → Reframing light (fas 2a — IMPLEMENTERAS)

**Flöde:** hub → reframing (4 steg) → valfri 1-min andning → complete

**Hub-hint:** *Tungt självprat — ett steg i taget, bara för dig.*

| Steg | Label | Prompt | Detail |
|------|-------|--------|--------|
| 1 | Rösten | Vad säger den kritiska rösten just nu? | Skriv en kort mening — eller bara ett ord. Inget behöver vara snyggt. |
| 2 | Kroppen | Var märker du det i kroppen? | Bröst, mage, hals, spänning — eller "vet inte". Det räcker. |
| 3 | Milt perspektiv | Om en trygg vän såg samma situation — vad *kunde* hen säga? | En mildare mening, inte sanningen. Du behöver inte tro den fullt ut. |
| 4 | Till dig | En mening du vill ha med dig nu. | Till dig själv — inte till någon annan. Kort räcker. |

**Valfri andning efter steg 4:**
- *Vill du landa kroppen en minut?*
- *4–7–8, valfritt. Hoppa över om du redan känner dig lugn.*

**Complete (reframing):**
- *Du har landat.*
- *Du gav dig ett ögonblick — inget att prestera.*

**Metadata:** `exerciseType: 'reframing'`, `hubSymptom: 'self_critical'`

---

## 3. Hitta mig → 5-4-3-2-1 (fas 1.5 + förbättringar)

**Behåll:** användarstyrd takt, offline.

**Förbättringar (senare):** intro *Landar här och nu*; **Hoppa över** på lukt/smaka; hub-subtitle.

---

## 4. ACT värderingar (fas 2d)

- Länk under hub — **inte** fjärde akut-knapp
- `mabra_progress/{uid}` mutable (skilt från WORM sessions)
- 3–5 värden från kuraterad lista (10–12 svenska ACT-värden)

---

## 5. Måbra-coach (fas 2e)

- Callable `mabraCoach`; prompt i `sharedRules.ts`
- Opt-in på complete; bubblor `#6366F1`
- DCAP/heuristik → `/speglar` vid ex-konflikt
- Ingen RAG; ingen auto dagbok-läsning

---

## 6. Dagbok-bro (fas 2c)

- URL: `/dagbok?from=mabra&hub=<hub>&energy=low`
- Hub-specifik complete-copy
- Lågenergi: valfri kort insikt eller humör-only

---

## Implementationsordning

1. **2a** Reframing (denna brief §2)
2. **2b** Akut-landning (§1)
3. Grounding-förbättringar (§3)
4. **2c** Complete + Dagbok (§6)
5. **2d** ACT (§4)
6. **2e** Coach (§5)
