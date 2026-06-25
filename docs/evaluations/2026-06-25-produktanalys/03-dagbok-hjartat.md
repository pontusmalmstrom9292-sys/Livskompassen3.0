# Prompt 3 — Dagbok/Hjärtat som framtida system

**Datum:** 2026-06-25  
**Plattform:** Cursor (Composer)  
**Typ:** Analys — inga kodändringar  
**Perspektiv:** Terapeutiskt UX · låg arousal · integritet · ingen toxisk productivity · ingen social feed · ingen wellness-klysch

---

## Nuläge (kort)

**Route:** `/hjartat?tab=reflektion` (Dagbok) + `/hjartat?tab=speglar` (Speglar)

**DagbokInputSuperModule** — fyra lägen (`dagbokInputModes.ts`):

| Läge | Syfte | Persistens |
|------|-------|------------|
| **Reflektera** | Humör → text → bekräfta → spara | `journal` WORM |
| **Snabb spegling** | Känsla + rad + `journalQuickMirror` | WORM + ephemeral spegling |
| **Minneslista** | Arkiv läs | read-only |
| **Bränn** | Ventilera | Zero Footprint (ingen DB) |

**Befintliga stöd:** `MOOD_REFLECTION_PROMPTS` (statiska, ingen LLM) · `useSpeechToText` · `validateOnly` · MåBra **lowEnergyBridge** · **lowCapacity** döljer arkiv · `HandoffBox` → Valv · `SavedStep` → Speglar + `WeaverApprovalPanel` · `journal_woven` / Vävaren HITL · `diaryStore` draft · `JournalArchive` filter + fästa poster · `matchVaultEvidence` i Speglar · `journalSilentReflection` callable.

**Gräns:** Dagbok = Lager 1 (privat reflektion). Valv = Lager 2 (bevis). Ingen auto-promote.

---

## 20 framtida förbättringar

### 1. Dissociations-läge (ultraminimal vy)

**Syfte:** Minska sensorisk och kognitiv input när nervsystemet är avstängt eller overbelastat.

**Smärta:** Vanliga flöden (arkiv, taggar, Vävaren) känns för stora vid dissociation/utmattning.

**Arkitektur:** Utöka befintlig `isLowHomeCapacity` / `lowCapacity` i `DagbokInputSuperModule` — ny client-flagga `?capacity=minimal` eller auto från capacity gate. Endast humör + "spara bara humör" + Bränn.

**Risk AI/ för mycket:** Låg — inga nya AI-svar.

**MVP:** Dölj arkiv, detaljer, weave-opt-in; en skärm, två knappar.

---

### 2. Kroppsankare före skriv (15 sek)

**Syfte:** Interoception vänlig start — fot på golvet, ett andetag — innan text.

**Smärta:** Hoppa direkt in i kognitiv produktion ökar arousal för GAD/ADHD.

**Arkitektur:** Valfritt steg före `MoodStep` i `useJournalFlow`; statisk copy, ingen timer-streak.

**Risk:** Medel — kan kännas långsamt; måste vara **hoppa över** alltid synlig.

**MVP:** En rad + "Fortsätt" / "Hoppa över".

---

### 3. Tre-ord-läge som default vid låg kapacitet

**Syfte:** Skrivbarhet utan tom bläddra.

**Smärta:** `ReflectionStep` har redan `WriteMode: 'tre-ord'` — men inte prioriterat vid trötthet.

**Arkitektur:** När `lowCapacity` → default mode `tre-ord`; placeholders från `QUICK_WRITE_PROMPTS`.

**Risk:** Låg.

**MVP:** Auto-select write mode + en hint-rad.

---

### 4. Tyst reflektion (utökad bank)

**Syfte:** En mild skrivfråga när användaren vill ha nudge — inte coaching.

**Smärta:** Tom textarea är blockerande; LLM-coach känns för "fixande".

**Arkitektur:** `journalSilentReflection` + fallback till `MOOD_REFLECTION_PROMPTS`; en fråga i taget, dismiss permanent per session.

**Risk AI:** Medel — håll prompts korta, `toneCheck`-liknande guard i callable; PMIR vid prompt.

**MVP:** "Föreslå en fråga" knapp — max 1 gång per post.

---

### 5. Quick Mirror med synlig ton-varning

**Syfte:** Spegling som validerar utan att moralisera.

**Smärta:** `journalQuickMirror` returnerar `toneCheck: too_fixing` — användaren ser det inte.

**Arkitektur:** `DagbokQuickMirrorDelegate` visar fallback om `too_fixing`; `journalQuickMirrorFallback` redan finns.

**Risk AI:** Medel — annars känns speglingen som terapeut.

**MVP:** Dölj AI-rad vid `too_fixing`; visa statisk validering istället.

---

### 6. Post-save "Klart — inget mer krävs"

**Syfte:** Avsluta utan skuld att öppna Speglar/Valv.

**Smärta:** `SavedStep` har flera CTA — bra för power users, tungt efter tung dag.

**Arkitektur:** `SavedStep` — primär "Klart" som default; sekundära länkar i `CalmCollapsible` "Om du vill …".

**Risk:** Låg.

**MVP:** Omordna knappar; collapse valfria nästa steg.

---

### 7. Kontextuell Valv-handoff (smart timing)

**Syfte:** Erbjuda bevis-spar endast när texten faktiskt liknar konflikt/logistik.

**Smärta:** `HandoffBox` visas via `shouldShowValvHandoff` — kan fintrimmas så tacksamhetsposter slipper.

**Arkitektur:** `valvHandoff` trigger + heuristik (relationer-kategori, nyckelord) — **inte** LLM-beslut om WORM.

**Risk:** Medel — false negative (missa handoff) bättre än false positive (stress).

**MVP:** Tightare heuristik + tydlig copy "valfritt".

---

### 8. Speglar-bro med rikare `journalContext`

**Syfte:** Sömlös övergång Dagbok → Speglar vid gaslighting-känsla.

**Smärta:** `SavedStep` skickar redan `journalContext` via router state — Speglar måste ta emot mer (humör, utdrag, ej hela WORM).

**Arkitektur:** `JournalBridgeContext` + `SpeglingsSystem` prefill; Zero Footprint — rensa state vid tab-byte.

**Risk:** Medel — läcka känslig text i URL/history; endast `location.state`.

**MVP:** Förifyll känsla + första mening i Speglar ACT-steg.

---

### 9. Röstflöde med paus-indikator

**Syfte:** Tal-till-text utan stress — se att det lyssnar, pausa naturligt.

**Smärta:** `useSpeechToText` finns men interim UI kan tydliggöras för dissociation/trötthet.

**Arkitektur:** `ReflectionStep` mic-knapp + mjuk pulserande indikator + "Tryck igen för att pausa"; Android WebView-kompat.

**Risk:** Låg.

**MVP:** Bättre interim-rad + felcopy på svenska.

---

### 10. Röst-minne som bilaga (kort clip)

**Syfte:** Fånga känsla när skriv är omöjligt.

**Smärta:** `JournalMemoryPicker` stödjer fil — voice memo som minnesbilaga, inte transkribering automatiskt.

**Arkitektur:** `uploadJournalMemory` + Storage; **ingen** auto-transkription till text (kostnad + integritet).

**Risk:** Medel — användare förväntar sig AI-transkript; sätt förväntan tydligt.

**MVP:** Spela in ≤60 s → bifoga till journal-post.

---

### 11. Arkiv tidslinje (dagsgruppering fördjupad)

**Syfte:** Hitta tillbaka utan oändlig scroll.

**Smärta:** `groupJournalEntriesByDay` finns — visuell tidslinje saknas.

**Arkitektur:** `JournalArchive` — vertikal tidslinje med datumhuvuden; behåll filter toolbar.

**Risk:** Låg.

**MVP:** CSS tidslinje + befintlig gruppering.

---

### 12. Senaste taggar/kategori som chips (snabb filter)

**Syfte:** Återfinna "den veckan med oro" utan sök.

**Smärta:** Filter finns men kräver aktivt val varje gång.

**Arkitektur:** Lokal cache av senaste 5 taggar från `entries`; `JournalArchiveToolbar`.

**Risk:** Låg.

**MVP:** 3 chips under sökfält.

---

### 13. Läs tillbaka (TTS) för arkivpost

**Syfte:** Dissociation — höra sin egen text långsamt istället för läsa.

**Smärta:** Läsning kan trigga överväldigande; TTS är lågaffektivt stöd.

**Arkitektur:** Web Speech Synthesis i `JournalEntryCard`; offline-capable; ingen server.

**Risk:** Medel — fel röst/språk; måste stoppas med ett tryck.

**MVP:** "Läs upp" på expanderad post.

---

### 14. Bränn + valfri grounding efter

**Syfte:** Stänga loopen efter ventilering — inte gamification.

**Smärta:** Efter `DagbokBurnDelegate` tom skärm kan kännas abrupt.

**Arkitektur:** Efter burn-animation: valfri statisk grounding-rad (andning/vatten) — **ingen** loggning.

**Risk:** Medel — wellness-klysch om copy är fel; håll neutralt.

**MVP:** "Ta ett långsamt andetag. Klart." + stäng.

---

### 15. Draft-återkomst (en rad)

**Syfte:** ADHD — tappa inte halvfärdig text.

**Smärta:** `diaryStore.diaryDraft` finns — UI för återupptag saknas tydligt.

**Arkitektur:** Banner i `ReflectionEditor`: "Du har osparad text — fortsätt?" / "Kasta".

**Risk:** Låg — Zero Footprint: rensa draft vid logout/panic.

**MVP:** En banner, två knappar.

---

### 16. Vävaren metadata inline (förenklad HITL)

**Syfte:** Taggar/kategori-förslag utan att kännas som övervakning.

**Smärta:** `WeaverApprovalPanel` på SavedStep är korrekt men kan förklaras bättre.

**Arkitektur:** `weaverApprovalService` — visa max 3 tag-chips; "Ignorera alla" prominent.

**Risk AI:** Medel — förklara att inget sparas utan godkännande.

**MVP:** Kortare copy + dismiss default.

---

### 17. MåBra-bro utökad (efter session)

**Syfte:** Lågenergi reflektion efter MåBra utan att blanda terapi-zoner.

**Smärta:** `mabraBridge` + `MABRA_MOOD_ONLY_TEXT` finns — post-MåBra kan erbjuda **en** valfri dagboksrad.

**Arkitektur:** `DagbokSuperModule variant="mabra-bridge"` redan finns; utöka med "Nej tack" som lika stor knapp.

**Risk:** Låg.

**MVP:** Symmetrisk CTA-layout.

---

### 18. Bekräftelse-steg: tydlig Lager 1 vs 2

**Syfte:** Användaren förstår vad som sparas var innan WORM.

**Smärta:** `ConfirmStep` + `DAGBOK_REMEMBER_LINES` — kan visualiseras enklare.

**Arkitektur:** Ikonrad: "Privat dagbok" vs collapsible "Bevis? → Valv separat".

**Risk:** Låg.

**MVP:** En rad ikon + text i ConfirmStep footer.

---

### 19. Speglar-evidence hint från dagbok (token-match)

**Syfte:** Koppla känsla i dagbok till befintliga bevis **utan** cross-RAG.

**Smärta:** Användaren minns inte att de dokumenterat liknande i Valv.

**Arkitektur:** Efter spar (valfritt, PIN): `matchVaultEvidence` med kort text — "Du har N poster med liknande ord. Öppna Valv?" Endast om Valv unlocked.

**Risk:** Medel — kan trigga ångest; opt-in + lågaffektiv copy.

**MVP:** Collapsed hint endast om `hasVaultGate()` och score > tröskel.

---

### 20. Kvälls avslut (opt-in, ingen streak)

**Syfte:** Mjuk rutin — "är du klar för idag?" — inte productivity tracking.

**Smärta:** `dagbokReminders` — måste inte bli skuld.

**Arkitektur:** Lokal notis eller hem-widget **endast om** användaren aktiverat; max 1/dag; tyst på helger.

**Risk:** Hög om det blir streak — **undvik räknare**.

**MVP:** Inställning "Påminn mig en gång om kvällen" av default.

---

## Topp 7 idéer

| # | Idé | Varför |
|---|-----|--------|
| 1 | **Dissociations-läge** | Bygger på `lowCapacity`; största avlastningen |
| 2 | **Post-save "Klart" först** | Minskar post-save skuld/valstress |
| 3 | **Kontextuell Valv-handoff** | Rätt bro till Lager 2, inte överallt |
| 4 | **Quick Mirror ton-varning** | Säker AI redan i backend — bara UI |
| 5 | **Tre-ord default vid låg kapacitet** | Skrivhjälp utan AI |
| 6 | **Draft-återkomst** | Konkret ADHD-nytta, infra finns |
| 7 | **Speglar-bro med journalContext** | Naturlig väg vid gaslighting-känsla |

---

## Idéer att undvika (låter bra men skadar tonen)

| Idé | Varför undvika |
|-----|----------------|
| **Dagliga streaks / "X dagar i rad"** | Skuldpress; bryter Obsidian Calm och användarprofil |
| **AI terapeut-chatt i dagboksflödet** | Blir "AIig"; konflikt → Speglar; terapi → MåBra bank |
| **Auto-promote dagbok → Valv** | Bryter Lager 1/2; kräver alltid explicit handoff/HITL |
| **Social delning / feed / familj-vy av dagbok** | Integritetsbrott; ingen social logik i Hjärtat |
| **Wellness-citat / gratitude challenges** | Klysch; konkurrerar med statiska `MOOD_REFLECTION_PROMPTS` |
| **Produktivitetspoäng / "journal completion %"** | Toxisk productivity; motsats till låg arousal |
| **Push som skuldbelägger ("Du har inte skrivit")** | Triggar RSD/GAD; kvällspåminnelse måste vara opt-in och neutral |

---

## Arkitektur-invariants (alla idéer)

- `journal` WORM append-only — ingen auto-promote till `reality_vault`
- Konflikt/gaslighting → **Speglar** (Zero Footprint), inte MåBra-coach
- AI i dagbok: kort, valfritt, HITL där metadata påverkar/minne
- Progressive disclosure — ett steg i taget
- `HandoffBox` / Valv alltid valfritt och manuellt
- Draft/state rensas vid logout/panic (Zero Footprint)
