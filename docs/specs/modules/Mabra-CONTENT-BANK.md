# MåBra — Content Bank (kuraterad)

**Datum:** 2026-05-27 (senast kuraterat: 2026-05-27, pass `values_rsd_recovery`)  
**Kurator:** `.cursor/agents/specialist-mabra-curator.md`  
**Syfte:** Godkänd grund för frågekort, milda quiz och utvecklingslekar — **inte** medicinsk rådgivning.

**Källor (läs före utökning):** [`Mabra-SPEC.md`](Mabra-SPEC.md) · [`Mabra-RESEARCH-BRIEF.md`](Mabra-RESEARCH-BRIEF.md) · [`MABRA-PROJEKT-VIT-HUB-SPEC.md`](../../design/MABRA-PROJEKT-VIT-HUB-SPEC.md) · **register:** [`INNEHALL-REGISTER.md`](../../INNEHALL-REGISTER.md)

---

## Så använder du banken

| Steg | Vem | Vad |
|------|-----|-----|
| 1 | Du / Cursor | `kör mabra curator` + tema (t.ex. “RSD frågekort”) |
| 2 | `specialist-mabra-curator` | Lins → grind → append här med `status: KEEP` |
| 3 | Implementation P1 | `vit_entries` / frågekort-UI — **deterministisk** lista från banken |
| 4 | AI | Endast **parafras** av KEEP-rader i coach — **ingen** ny “fakta” utan bank |

`source_tier`: **product_copy** = redan i app-spec · **psychoeducation_general** = etablerad självhjälp/KBT/ACT-språk (ej diagnos) · **user_story_opt_in** = användarens egna svar i Vit hub.

---

## Fakta att lita på (kort, inåtvänd)

| # | Fakta (sv) | Tier | Användning |
|---|------------|------|------------|
| F1 | Hyperarousal är en **kroppsreaktion**, inte karaktär eller svaghet. | product_copy | Panik/RSD hub, AkutLanding |
| F2 | 4–7–8 andning **kan** långsamma nervsystemet; inget att prestera. | psychoeducation_general | Andning |
| F3 | 5-4-3-2-1 grounding återkopplar uppmärksamhet till **nu** — offline möjlig. | product_copy | Hitta mig |
| F4 | RSD = **stark smärta vid upplevd avvisning**; kroppen reagerar som hot. | psychoeducation_general | Panik/RSD copy (ej DSM-etikett i UI) |
| F5 | Självkritik är ofta en **inre röst**, inte sanningen om dig. | product_copy | Reframing steg 1 |
| F6 | ACT-värden beskriver **vad du vill stå för** — inte prestation. | product_copy | ValuesCompass |
| F7 | MåBra-data går **inte** till Kunskap-RAG — din Vit hub är separat. | product_copy | Integritet, lugn |
| F8 | Konflikt med ex / gaslighting → **Speglar**, inte MåBra-coach. | product_copy | Guardrail |

**Ej i bank:** medicinering, diagnoslista, “heala trauma på X veckor”, hjärn-myter.

---

## Utvecklingslekar (micro, ≤ 2 min, ingen streak)

| id | Lek | Regel | Projekt |
|----|-----|-------|---------|
| G1 | **Ett kort** | Dra/visa ett frågekort; svara med ett ord eller kroppsdel | alla |
| G2 | **Kropp-bingo** | Markera 3 zoner (fot, mage, axel) — “finns spänning?” ja/nej/neutral | emotional_memory |
| G3 | **Värde-idag** | Välj **ett** ACT-värde från listan; “en liten handling som passar idag?” | who_am_i |
| G4 | **Milt eller hårt** | Läs inre kritiker-mening → “milt svar på 1 mening” (reframing light) | self_esteem |
| G5 | **Ljud-jakt** | Hitta 4 ljud (från grounding) — tidsgräns valfri, ingen poäng | find_self |
| G6 | **Glädje-miniatyr** | “En sak som var lugnt eller kul senaste dygnet” — en rad | who_am_i |
| G7 | **Andnings-runda** | En 4-7-8-cykel räknas som “klar” — ingen cykel-räknare vid panik | panic_rsd |

**Avvisat:** streak, veckoutmaning, leaderboard, “rätt svar” som skuld.

---

## Frågekort (KEEP — reflektion, inget fel svar)

### Identitet (`who_am_i` / Vit)

| id | text_sv |
|----|---------|
| C-identity-01 | Vem är jag när ingen tittar — ett ord räcker. |
| C-identity-02 | Vad är jag stolt över som **inte** handlar om att bevisa något för andra? |
| C-identity-03 | En egenskap jag vill ha mer av i vardagen — inte perfekt, bara mer. |

### Känsla (`emotional_memory`)

| id | text_sv |
|----|---------|
| C-feel-01 | Hur känns den här upplevelsen i kroppen — plats eller temperatur? |
| C-feel-02 | Vad behöver känslan **inte** att du fixar just nu? |
| C-feel-03 | Om känslan fick en färg idag — vilken, ungefär? |

### Mål / handling (kravlöst)

| id | text_sv |
|----|---------|
| C-goal-01 | Ett litet mål denna vecka — **inte** prestation, max en mening. |
| C-goal-02 | Vad skulle “tillräckligt bra” se ut idag? |

### Glädje / lugn

| id | text_sv |
|----|---------|
| C-joy-01 | Vad tycker jag är kul, lugnt eller meningsfullt just nu? |
| C-joy-02 | En aktivitet utan krav — simma, klättra, vila — vad lockar idag? |

### RSD / panik (validering, inte analys av andra)

| id | text_sv |
|----|---------|
| C-rsd-01 | Vad triggade känslan av avvisning — **din** upplevelse, inte deras avsikt. |
| C-rsd-02 | Vad behöver kroppen: långsam utandning, vatten, eller paus? |
| C-rsd-03 | En mening till dig: “Det här är en reaktion, inte hela jag.” |

### Självkritik (KBT light)

| id | text_sv |
|----|---------|
| C-kbt-01 | Vad säger den kritiska rösten — en kort mening? |
| C-kbt-02 | Vilken förvrängning **kanske** det liknar: allt-eller-inget, “borde”, läsa tankar? (välj eller hoppa) |
| C-kbt-03 | En mildare mening en trygg vän **kunde** säga — du behöver inte tro den fullt. |

### Självkänsla (`self_esteem` — Vit hub)

Kurator-pass 2026-05-25 · linser: **identitet** (5) + **KBT light** (5). Ej duplicerar `C-identity-*` / `C-kbt-*` (generella); vinklar mot [`MABRA_PROJECTS`](../../../src/modules/mabra/constants/mabraProjects.ts) `self_esteem`.

| id | format | lens | text_sv | why | source_tier |
|----|--------|------|---------|-----|-------------|
| C-se-01 | reflection_card | identitet | Vad respekterar jag hos mig själv när ingen applåderar — ett ord räcker. | Inåtvänd identitet utan prestation eller publik | psychoeducation_general |
| C-se-02 | reflection_card | identitet | När behandlade jag mig senast som någon värd omsorg — inte som belöning? | Självkänsla som vardagshandling, inte “förtjäna” | psychoeducation_general |
| C-se-03 | reflection_card | identitet | En gräns jag höll nyligen, liten som helst — vad var den? | Stärker gräns = identitet utan ex-konflikt | product_copy |
| C-se-04 | reflection_card | identitet | Vad betyder “tillräcklig” för mig idag — ungefär, utan att jämföra med andra? | Motverkar people-pleasing/jämförelse (Mabra-SPEC §12) | psychoeducation_general |
| C-se-05 | reflection_card | identitet | En egenskap som är min även när andra inte ser den — vad är det? | Identitet inåt, ett steg | product_copy |
| C-se-06 | reflection_card | kbt_light | Vilken “borde”-mening är högst just nu — skriv den; du behöver inte lyda den. | KBT light: externalisera krav utan skuld | psychoeducation_general |
| C-se-07 | reflection_card | kbt_light | Ett kort skäl **för** och ett **mot** den kritiska rösten — valfritt, en rad vardera. | Balanserad evidens, inget rätt/fel | psychoeducation_general |
| C-se-08 | reflection_card | kbt_light | Om samma tanke gällde en trygg vän — skulle jag säga lika hårt? Vad skulle vara mildare? | Parallell till reframing “milt perspektiv”, ny vinkel | product_copy |
| C-se-09 | reflection_card | kbt_light | Vilken förvrängning **kanske** det liknar — allt-eller-inget, katastrof, läsa tankar? Hoppa över går bra. | Samma ord som C-kbt-02 men kopplat till Vit-projekt | product_copy |
| C-se-10 | reflection_card | kbt_light | En självmedkännande omformulering du **inte** behöver tro fullt ut — en mening. | Alignar med REFRAMING anchor; kravlöst | product_copy |

**P1-koppling:** `vit_entries` med `projectId: self_esteem`, `kind: card`, `bankId: C-se-01` … `C-se-10`.

---

## Kurator-logg (pass `self_esteem` 2026-05-25)

| id (utkast) | status | why |
|-------------|--------|-----|
| “Lista 10 saker du älskar med dig själv” | **REJECT** | För många steg; kognitiv belastning |
| “Bygg självkänsla genom att imponera på andra” | **REJECT** | Prestation/jämförelse |
| “Skriv hur din ex-partner förstörde din självkänsla” | **ROUTE_SPEGLAR** | Ex-konflikt — Hamn/Speglar |
| “Du är fantastisk — sluta vara negativ” | **REJECT** | Toxic positivity |
| “7-dagars självkänsla-utmaning” | **REJECT** | Gamification / streak (Mabra-SPEC) |
| “Diagnos: låg självkänsla kräver terapi nu” | **REJECT** | Diagnos / medicinsk påstående |

---

## Mild quiz (sanning = produkt + välmående, inte medicin)

**Regel:** Max 3 påståenden per session; feedback alltid validerande.

| id | påstående | “Svar” (copy) |
|----|-----------|----------------|
| Q1 | Andning 4-7-8 ska kännas perfekt varje gång. | **Nej** — följ cirkeln, prestation behövs inte. |
| Q2 | RSD betyder att du överreagerar och borde sluta. | **Nej** — kroppen reagerar starkt; det är en erfarenhet, inte karaktär. |
| Q3 | MåBra sparar streak om du missar en dag. | **Nej** — ingen streak i produkten (Mabra-SPEC). |
| Q4 | Självkritik är alltid sann. | **Nej** — ofta en inre röst (reframing). |
| Q5 | Du måste skriva långt i reframing för att det ska räknas. | **Nej** — ett ord räcker (constants). |
| Q6 | Ex-konflikt ska bearbetas här med coach. | **Nej** — Speglar (guardrail). |

**Preferera:** reflektionskort (C-*) framför Q-* när användaren är lågenergi.

---

## Koppling till befintliga specialister (runtime)

| Produktroll | MåBra-användning | Content bank |
|-------------|------------------|--------------|
| **Måbra-coach** | Efter övning, opt-in | Parafrasera KEEP, max 2–3 meningar |
| **KBT-Transformator** | Självkritik-panel | Förvrängningsord från C-kbt-02 |
| **RSD-Kylaren** | Inspiration till C-rsd-* (ej auto-routing) | Manuell kurering |
| **Speglings-Coachen** | **Ej** quiz här | ROUTE_SPEGLAR |
| **Paralys-Brytaren** | Kompasser, länk “Fastnat?” | Ej duplicera |

---

## REJECT-exempel (spara tid)

| Innehåll | Varför |
|----------|--------|
| “Du har borderline om du känner RSD” | Diagnos / fel fakta |
| “Tänk positivt så försvinner ångesten” | Toxic positivity |
| “Svara BIFF på mammas sms här” | Hamn/Speglar |
| “7 dagars utmaning — dag 1/7” | Gamification avvisad |
| “Din amygdala är skadad” | Pseudovetenskap |
| 20 frågor i rad | Kognitiv överbelastning |

---

## Daglig mix (daglig_mix) — KEEP 2026-05-27

**Kurator:** `specialist-mabra-curator` · **Dirigent:** U6 Vit · **Klass:** REFLECTION + PLAY (en kort + ett mikrospel per kalenderdag).

| bankId | content_class | source_tier | status | Användning |
|--------|---------------|-------------|--------|------------|
| DM-CARD-01 | REFLECTION | P1 | KEEP | Rotationspool (parafras C-joy-01) |
| DM-CARD-02 | REFLECTION | P1 | KEEP | Rotationspool (parafras C-rsd-03) |
| DM-CARD-03 | REFLECTION | P1 | KEEP | Rotationspool (parafras C-se-01) |
| DM-CARD-04 | REFLECTION | P1 | KEEP | Rotationspool (parafras C-se-04) |
| DM-CARD-05 | REFLECTION | P1 | KEEP | Rotationspool (parafras C-feel-01) |
| DM-CARD-06 | REFLECTION | P1 | KEEP | Rotationspool (parafras C-identity-01) |
| DM-CARD-07 | REFLECTION | P1 | KEEP | Rotationspool (parafras C-kbt-03) |
| DM-CARD-08 | REFLECTION | P1 | KEEP | Rotationspool (parafras C-goal-02) |
| DM-PLAY-01 | PLAY | P1 | KEEP | Mikrospel (parafras G1) |
| DM-PLAY-02 | PLAY | P1 | KEEP | Mikrospel (parafras G3) |
| DM-PLAY-03 | PLAY | P1 | KEEP | Mikrospel (parafras G6) |

**Kanon i kod:** `src/modules/mabra/content/dagligMixCatalog.ts` — prod-coach och UI ska referera `bankId`, inte fri LLM-text.

**MUST NOT:** streak, XP, “missad dag”, Kunskap-RAG (`knowledgeVaultQuery`), veckoutmaning.

**Beteende:** Deterministisk daglig nyckel (`YYYY-MM-DD` + valfritt `uid`) — samma kort+spel hela dagen; ny mix vid midnatt lokal tid. Valfri rad i `mabra_sessions` med `exerciseType: daglig_mix` (WORM metadata, ingen gamification).

---

## 2026-05-27 curator batch

**Kurator:** `specialist-mabra-curator` · **Teman:** värden (ACT), RSD-säkert, låg energi, landning efter inre uppvaknande (ej ex/konflikt med andra). **Ej duplicerar:** `DM-*`, `C-*`, `G*` — separat pool för Vit hub / framtida rotation utöver Daglig mix.

### REFLECTION (`MB-REF-*`)

| bankId | content_class | source_tier | status | lens | hub | text_sv | why |
|--------|---------------|-------------|--------|------|-----|---------|-----|
| MB-REF-01 | REFLECTION | product_copy | KEEP | act | who_am_i | Vilket värde är **lättast att bära** idag — inte det svåraste, bara det som finns nära? | ACT utan prestation; ett steg |
| MB-REF-02 | REFLECTION | product_copy | KEEP | act | who_am_i | En handling under fem minuter som stämmer med ett värde du redan valt — vad skulle den vara? | Committed action, kravlöst tak |
| MB-REF-03 | REFLECTION | psychoeducation_general | KEEP | rsd | panic_rsd | Om kroppen fortfarande reagerar på en upplevelse av “nej” — vilken **behovssignal** kan den bära, utan att du måste agera? | RSD utan skam eller analys av andras avsikt |
| MB-REF-04 | REFLECTION | psychoeducation_general | KEEP | rsd | panic_rsd | Tre neutrala fakta om **din** upplevelse just nu — inga domar om dig eller någon annan. | RSD-Kylaren-ljus: fakta vs tolkning, inåtvänd |
| MB-REF-05 | REFLECTION | product_copy | KEEP | vagus | find_self | Vad är det **minsta** som räknas som “nog” idag — ett andetag, en paus, en rad? | Låg energi; motverkar allt-eller-inget |
| MB-REF-06 | REFLECTION | psychoeducation_general | KEEP | vagus | find_self | Efter att pulsen legat högt — var i kroppen känns det **lugnast** just nu, även lite? | Landning efter hyperarousal; ej ex/Speglar-ämne |

**P1-koppling:** `vit_entries` / hub-rotation med `bankId: MB-REF-01` … `MB-REF-06` · prod-coach parafras endast via `bankId`.

### PLAY (`MB-PLAY-*`)

| bankId | content_class | source_tier | status | format | title_sv | rule_sv | why |
|--------|---------------|-------------|--------|--------|----------|---------|-----|
| MB-PLAY-01 | PLAY | product_copy | KEEP | micro_game | Paus-streck | Mellan två utandningar: föreställ dig ett kort streck — inget att rita perfekt, inget mål. | Kropp före tanke; offline; ≠ G7 cykel-räknare |
| MB-PLAY-02 | PLAY | product_copy | KEEP | micro_game | Värde-touch | Peka på ett föremål i rummet som påminner om ett värde — säg ett ord högt eller tyst. | ACT-handling ≤2 min; ≠ G3 (redan “välj värde”) |
| MB-PLAY-03 | PLAY | psychoeducation_general | KEEP | micro_game | Utandning fyra | Räkna bara **utandningar** till fyra — om du tappar räkningen, börja om utan kommentar. | Låg energi; ingen poäng/streak |
| MB-PLAY-04 | PLAY | product_copy | KEEP | micro_game | Ett ord, vik | Skriv **ett** ord som beskriver dagens tyngd; vik ihop pappret eller markera “klar” på skärmen — symboliskt släpp. | Känsloutlopp utan lång journaling; ≠ DM-PLAY/G6 glädje-miniatyr |

**MUST NOT:** streak, XP, “missad dag”, veckoutmaning, Kunskap-RAG.

### Kurator-logg (batch 2026-05-27)

| id (utkast) | status | why |
|-------------|--------|-----|
| “Skriv vad din ex sa som triggade dig” | **ROUTE_SPEGLAR** | Ex/konflikt — Hamn/Speglar |
| “Räkna dagar sedan du landade lugnt” | **REJECT** | Streak / gamification |
| “Du borde ha valt annorlunda i konflikten” | **REJECT** | Skuld, JADE |
| “Lista 5 värden och rangordna dem” | **REJECT** | För många steg (kognitiv belastning) |
| MB-REF-* / MB-PLAY-* ovan | **KEEP** | Grind OK; ej DM-duplikat |

---

## Nästa implementation (P1)

- Firestore `vit_hub` / `vit_entries` med `kind: card | memory | chat_turn` *(efter Daglig mix P0 — client-bank klar)*
- Komponent: ett frågekort i taget från `MABRA_PROJECTS` + bank-id (projektflöde, utöver Daglig mix)
- Deterministisk rotation — **ingen** LLM som genererar nya fakta i prod utan curator-pass

**Smoke:** `npm run smoke:mabra` · `npm run smoke:innehall` (bankId DM-*)
