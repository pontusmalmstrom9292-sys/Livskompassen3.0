# Prompt 1 — Navigationsarkitekt

**Modell:** Claude Sonnet 4.6  
**Status:** ✅ Klar  
**Datum:** 2026-06-18

---

## Råsvar

### Informationsarkitektur med maximal enkelhet

För att användaren aldrig ska behöva mer än två klick från Hem till en vanlig handling skapar vi en layout med en Hem-sida som zon-nav + upptäcktskort som direkt leder till en vald funktion i rätt zon och rätt läge i supermodulen.

**Steg 1:** Välj zon från en tydlig översikt (Hjärtat, Vardagen, Familjen) med stora och lättgreppade zon-ikoner.

**Steg 2:** Välj en upptäcktskort för att navigera inuti zonens Chameleon Supermodule till önskad funktion (t.ex. "Skriv dagbok", "Planera dag", "Ekonomikoll", "Barnaktiviteter").

Därefter visas funktionen direkt i supermodulen utan att lämna sidan. All navigation sker alltså inuti zone-hubben och supermodulen, inga sidbyten eller flikrader.

### Zonen med Chameleon Supermodule och Upptäcktskort

Varje zon består av:

**En zon-hub** — en sida med:
- Tydlig zon-titel
- Max 12 dynamiska upptäcktskort, filtrerade efter aktuell stressnivå
- Kortens klick laddar supermodulen i rätt läge inom zonen

**Chameleon Supermodule:**
- Byter innehåll och struktur helt inom zonen (lista, anteckning, ekonomikoll, tracker)
- Inga sidbyten, inga nya flikar — intern byten i samma UI-element
- Progressiva avslöjanden vid behov

**Exempel:** I Vardagen: Planering, MåBra, Ekonomi som lägen. Klick på "Planera dag" växlar supermodulen till planeringsläget.

### Tre navigationsmodeller

#### A. Vertikal zonlista + upptäcktskort (standardnav) — REKOMMENDERAD för ADHD
- Fördelar: rent, få val per steg, bra för ADHD
- Nackdelar: kräver läsning av korttext; OSÄKER vid extrem stress

#### B. Bottom nav + modal för kort
- Fördelar: välkänt mobil-mönster, färre sidbyten
- Nackdelar: modal kan kännas påträngande; OSÄKER för hypervigilans

#### C. Horisontell swipe-zonswitch
- Fördelar: minimalt klickande
- Nackdelar: sämre rumslig orientering; OSÄKER motorik

### Valv och Barnlogg
1. Dölj från huvudvy/kort i normalt läge
2. Dubbeltryck/långtryck för åtkomst
3. PIN — stäng direkt vid miss
4. Dämpade färger, liten ikon
