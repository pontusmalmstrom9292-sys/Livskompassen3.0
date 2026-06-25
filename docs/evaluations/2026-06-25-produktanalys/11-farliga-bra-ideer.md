# Prompt 11 — "Farliga bra idéer" vi inte borde bygga

**Datum:** 2026-06-25  
**Plattform:** Cursor (Composer)  
**Typ:** Analys — inga kodändringar  
**Perspektiv:** Kritisk produktstrateg · integritetsarkitekt

**Syfte:** Idéer som *låter* rätt för Life OS / coping / vårdnad — men som skadar Livskompassens kärna (tre silos, WORM, Zero Footprint, lågaffektiv recovery, juridisk känslighet).

---

## 25 farliga idéer

### 1. AI «Bevisdomare» som avgör vem som har rätt

| Fält | Innehåll |
|------|----------|
| **Idé** | Modell som efter SMS/journal säger «du har rätt / motparten ljuger» |
| **Lockande** | Validering efter gaslighting; känns som rättvisa |
| **Farligt** | Juridiskt ogiltigt; förstärker affekt; hallucinerar «sanning»; eskalerar konflikt |
| **Principer** | U1 silos · DCAP · epistemicGuard · ingen diagnos på motpart |
| **Alternativ** | Brusfiltret (fakta vs affekt) + Sannings-Analytikern med citations från *egna* WORM-poster |

---

### 2. Auto-promote barnlogg → Valv

| Fält | Innehåll |
|------|----------|
| **Idé** | «Smart» flagga som flyttar barnobservation till bevis automatiskt |
| **Lockande** | Spar tid inför LVU/soc; känns proaktivt |
| **Farligt** | Förorenar beviskedja; barndata blir processmaterial utan HITL; motpart kan weaponize |
| **Principer** | Tre silos · HITL · barn ≠ Valv default |
| **Alternativ** | Barn-EVIDENCE-klassificerare (read-only) → explicit HITL «dokumentera som bevis?» |

---

### 3. Daglig AI-sammanfattning pushad klockan 07:00

| Fält | Innehåll |
|------|----------|
| **Idé** | «God morgon — igår hände X, Y, Z» i notis |
| **Lockande** | Struktur för ADHD-hjärna |
| **Farligt** | Känslig text i OS notification center; skuld om man ignorerar; hypervigilans |
| **Principer** | Zero Footprint · ingen push med innehåll (prompt 08 X4) |
| **Alternativ** | Opt-in öppna app → kort sammanfattning *inuti* app efter auth |

---

### 4. Streaks för dagbok / MåBra / drogfrihet

| Fält | Innehåll |
|------|----------|
| **Idé** | «12 dagar i rad»-badges |
| **Lockande** | Vanor; dopamin; «motivation» |
| **Farligt** | RSD vid brutet streak; skam efter krasch (F155); wellness-optimering |
| **Principer** | MåBra-SPEC · krävlöst · ingen gamification |
| **Alternativ** | Neutral «aktivitet per vecka» utan streak (finns i `vitHubStats`) |

---

### 5. Universal-Kompis med minne över alla silos

| Fält | Innehåll |
|------|----------|
| **Idé** | En chat som «minns allt» — journal, Valv, barn, ekonomi |
| **Lockande** | En ingång; mindre friktion |
| **Farligt** | Cross-RAG; läckage; omöjlig audit; fel råd i fel kontext |
| **Principer** | Tre silos · agent L-layer · mabraCoachGuard |
| **Alternativ** | Tunn supervisor + silo-specifika agenter (prompt 09) |

---

### 6. Automatisk BIFF-svar skickat till ex

| Fält | Innehåll |
|------|----------|
| **Idé** | AI skriver och skickar SMS/mejl direkt |
| **Lockande** | Slipp öppna affekt; snabb Grey Rock |
| **Farligt** | JADE-risk; fel ton; juridiskt bindande; ingen paus |
| **Principer** | Hamn Zero Footprint · användaren skickar själv |
| **Alternativ** | Kopiera-svar + Safety-Review + HITL send (Hamn våg 1) |

---

### 7. «Riskscore» för motparten synlig på Hem

| Fält | Innehåll |
|------|----------|
| **Idé** | Dashboard: «Manipulationsrisk 73%» |
| **Lockande** | Känns som skydd och kontroll |
| **Farligt** | Pseudovetenskap; fixation; false security; diagnos på tredje part |
| **Principer** | DCAP för *input*, inte person-profil · ingen diagnos |
| **Alternativ** | DCAP på *meddelande du klistrat in* + mönster over tid i Valv (batch, HITL) |

---

### 8. Publik Kunskap-hub utan PIN

| Fält | Innehåll |
|------|----------|
| **Idé** | Öppna `/kunskap` med HCF/föräldraskap-artiklar |
| **Lockande** | SEO; «hjälpsam» app; lägre tröskel |
| **Farligt** | Förstör plausible deniability; exponerar ämnesval |
| **Principer** | Kunskap bakom Valv PIN · locked UX |
| **Alternativ** | Kunskapsbank endast i Valv (`VaultKunskapsbankPanel`) |

---

### 9. LLM-coach som svarar barn i Barnporten

| Fält | Innehåll |
|------|----------|
| **Idé** | «AI kompis» för pojkarna |
| **Lockande** | Skalbar tröst; modern |
| **Farligt** | LVU/soc-känsligt; ingen kontroll; fel råd; data som bevis |
| **Principer** | Barnporten HITL · locked UX |
| **Alternativ** | Signal → förälder granskar → mänskligt svar |

---

### 10. Hela journal auto-weaved till Kunskap-RAG

| Fält | Innehåll |
|------|----------|
| **Idé** | All dagbok blir sökbar i kampspar automatiskt |
| **Lockande** | «Appen lär sig dig» |
| **Farligt** | Privat ventil blir retrieval-foder; cross-use i fel coach |
| **Principer** | G7 opt-in only · journal_woven synapse |
| **Alternativ** | Per-post opt-in + tydlig «väv till Minne» |

---

### 11. Widget med senaste journal/Valv-text

| Fält | Innehåll |
|------|----------|
| **Idé** | Hemskärmswidget visar preview av senaste anteckning |
| **Lockande** | Snabb påminnelse |
| **Farligt** | Låsskärmsläckage; delad enhet; barn ser |
| **Principer** | Zero Footprint · widget X1 (prompt 08) |
| **Alternativ** | Neutral chip «Anteckning» utan preview |

---

### 12. «AI terapeut» i MåBra med full historik

| Fält | Innehåll |
|------|----------|
| **Idé** | Terapeutisk dialog som minns månader av humör |
| **Lockande** | Billig terapi; stöd dygnet runt |
| **Farligt** | Fel domän (konflikt → Speglar); dependency; medicinsk gråzon |
| **Principer** | MåBra bank parafras · inåtvänd recovery · mabraCoachGuard |
| **Alternativ** | Frågekort + parafras + bro till Dagbok/Speglar |

---

### 13. Automatisk dossier till soc varje månad

| Fält | Innehåll |
|------|----------|
| **Idé** | AI genererar och mailar myndighetsrapport |
| **Lockande** | Mindre admin; känns «professionellt» |
| **Farligt** | Fel fakta i formal process; ingen review; WORM-förorening |
| **Principer** | HITL · WORM · PMIR |
| **Alternativ** | Dossier BBIC export *efter* manuell granskning i Valv |

---

### 14. Emotionell «health score» 0–100

| Fält | Innehåll |
|------|----------|
| **Idé** | Daglig poäng: mental hälsa 62 → 58 |
| **Lockande** | En siffra att följa |
| **Farligt** | Skambeläggning; RSD; falsk precision; wellness-app |
| **Principer** | Ingen gamification · Obsidian Calm lågaffekt |
| **Alternativ** | Subjektiv check-in utan poäng · valfri trend i privat vy |

---

### 15. Gmail/Kalender-sync för smart planering

| Fält | Innehåll |
|------|----------|
| **Idé** | Importera möten, umgängeskalender automatiskt |
| **Lockande** | Mindre manuellt; «smart Life OS» |
| **Farligt** | OAuth-träsk; kostnad; tredje part; metadata-läckage |
| **Principer** | Governance «gratis först» · manuell inkast |
| **Alternativ** | Inkast / widget / P3 manuell uppgift |

---

### 16. LLM klassificerar *utan* HITL till Valv

| Fält | Innehåll |
|------|----------|
| **Idé** | «AI är säker nog» — direkt WORM vid confidence >0.9 |
| **Lockande** | Färre klick; snabbare arkiv |
| **Farligt** | Fel silo; trauma i fel collection; juridiskt |
| **Principer** | DCAP före LLM · HITL · applyInkastConfidenceGate |
| **Alternativ** | Queue + confirm; downgrade till review under tröskel |

---

### 17. «Paranoia-läge» som loggar allt motparten gör

| Fält | Innehåll |
|------|----------|
| **Idé** | Tidslinje med AI-taggar på varje interaktion |
| **Lockande** | Kontroll; «bevis» |
| **Farligt** | Fixering; hypervigilans; ökar stress; unhealthy surveillance |
| **Principer** | Recovery-focused · kognitiv avlastning |
| **Alternativ** | Neutral WORM-logg *när du väljer* + batch mönster (Valv, HITL) |

---

### 18. Dela Valv-export via publik länk

| Fält | Innehåll |
|------|----------|
| **Idé** | «Dela med advokat» — URL utan login |
| **Lockande** | Enkel delning |
| **Farligt** | Länkläckage; indexering; ingen återkallning |
| **Principer** | Zero Footprint · WORM access control |
| **Alternativ** | Krypterad export fil · manuell överföring · advokat läser offline |

---

### 19. Nudging: «Du har inte journalerat på 3 dagar»

| Fält | Innehåll |
|------|----------|
| **Idé** | Påminnelser med skuldkänsla |
| **Lockande** | Habit building |
| **Farligt** | RSD; stress; medicin/utmattning → «failure» |
| **Principer** | Krävlöst · opt-in notis utan räknare (MåBra #19) |
| **Alternativ** | Tyst toggle «påminn mig» utan missad-dag UI |

---

### 20. Cross-RAG: «Hämta Kunskap när jag coachar i Valv-chat»

| Fält | Innehåll |
|------|----------|
| **Idé** | Smidigare svar med FACT + bevis |
| **Lockande** | Rikare svar |
| **Farligt** | Silo-läckage; teorier utan evidence blandas in |
| **Principer** | Tre silos · valvChat endast reality_vault |
| **Alternativ** | Separata sessioner; manuell länk mellan zoner |

---

### 21. Real-time «lyssna på omgivning»-widget

| Fält | Innehåll |
|------|----------|
| **Idé** | Alltid-på inspelning för «säkerhet» |
| **Lockande** | Bevis vid överfall/konflikt |
| **Farligt** | Illegal i många kontexter; etik; batteri; false security |
| **Princier** | WH1 etikgrind · explicit start/stop |
| **Alternativ** | Diskret inspelning med etik + autostart endast efter accept |

---

### 22. AI-genererade «barnens perspektiv»-texter

| Fält | Innehåll |
|------|----------|
| **Idé** | «Så här kanske Kasper känner» |
| **Lockande** | Empati; föräldraskap-stöd |
| **Farligt** | Projection; används som sanning i konflikt; etiskt gränsfall |
| **Principer** | Barnen silo · observation neutral · ingen diagnos |
| **Alternativ** | Barnfokus-frågor → *barnets* ord sparas i logg |

---

### 23. Social «Trygg Hamn»-community

| Fält | Innehåll |
|------|----------|
| **Idé** | Forum för HCF-föräldrar |
| **Lockande** | Gemenskap; delad erfarenhet |
| **Farligt** | Metadata; moderation; triggar; inte Zero Footprint |
| **Principer** | Privat Life OS · ingen social graph |
| **Alternativ** | Kuraterad FACT i Kunskap (PIN) · offline stödlinjer i SOS |

---

### 24. Automatisk «förbättra din kommunikation»-score på utkast

| Fält | Innehåll |
|------|----------|
| **Idé** | Röd/grön meter på hur «bra» ditt svar är |
| **Lockande** | Lära BIFF |
| **Farligt** | Perfektionism; RSD; JADE-trigg (för mycket polish) |
| **Principer** | Grey Rock enkel · lågaffekt |
| **Alternativ** | Safety-Review: «innehåller JADE?» ja/nej — ingen poäng |

---

### 25. Cloud backup av allt okrypterat «för säkerhet»

| Fält | Innehåll |
|------|----------|
| **Idé** | Extra backup så inget går förlorat |
| **Lockande** | Trygghet vid telefonbyte |
| **Farligt** | En breach = allt; motsäger layered defense |
| **Principer** | CMEK · WORM · minimal attack surface |
| **Alternativ** | Firebase auth + WORM som redan finns; export JSON lokalt vid behov |

---

## Mönster — varför idéerna lockar men skadar

| Mönster | Exempel # | Kärnproblem |
|---------|-----------|-------------|
| **För mycket AI** | 1, 5, 12, 16 | Hallucination + fel domän |
| **För mycket automation** | 2, 6, 13, 16 | HITL saknas |
| **Fel gamification** | 4, 14, 24 | Skam/RSD |
| **Övervakning** | 3, 7, 17, 21 | Stress + läckage |
| **Silo-gränser** | 8, 10, 20 | Cross-RAG / plausible deniability |
| **Falsk trygghet** | 1, 7, 21 | Smart yta, farlig verklighet |
| **Aggressiv nudging** | 3, 19 | Kräver energi användaren saknar |
| **Stress-design** | 14, 19, 24 | Wellness-optimering |

---

## Snabb «nej»-checklista (före PMIR)

1. Kräver det **cross-silo RAG**? → Nej  
2. Skriver det **WORM utan HITL**? → Nej  
3. Visar **känslig text utanför app** (widget/push)? → Nej  
4. Ger det **poäng/streak/ranking**? → Nej  
5. **Diagnostiserar motpart** eller barn? → Nej  
6. **Skickar** kommunikation automatiskt? → Nej  
7. Ny **månadskostnad / OAuth**? → Default nej  

---

## Koppling till roadmap

Se [10-roadmap-3-6-12-manader.md](./10-roadmap-3-6-12-manader.md) avsnitt **«Detta borde aldrig byggas»** — denna prompt utvidgar med produktpsykologi och lockelse-fällor.

---

## Källor

- [Grunder U1–U6](../../../.cursor/rules/grunder-kanon.mdc) · [memory-silo](../../../.cursor/skills/livskompassen-memory-silo-guard/SKILL.md) · produktanalys 05–11 · `innehall-register.mdc`
