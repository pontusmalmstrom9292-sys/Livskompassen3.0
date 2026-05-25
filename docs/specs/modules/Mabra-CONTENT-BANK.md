# MåBra — Content Bank (kuraterad)

**Datum:** 2026-05-25 (senast kuraterat: 2026-05-25, pass `self_esteem`)  
**Kurator:** `.cursor/agents/specialist-mabra-curator.md`  
**Syfte:** Godkänd grund för frågekort, milda quiz och utvecklingslekar — **inte** medicinsk rådgivning.

**Källor (läs före utökning):** [`Mabra-SPEC.md`](Mabra-SPEC.md) · [`Mabra-RESEARCH-BRIEF.md`](Mabra-RESEARCH-BRIEF.md) · [`MABRA-PROJEKT-VIT-HUB-SPEC.md`](../../design/MABRA-PROJEKT-VIT-HUB-SPEC.md)

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

## Nästa implementation (P1)

- Firestore `vit_hub` / `vit_entries` med `kind: card | memory | chat_turn`
- Komponent: ett frågekort i taget från `MABRA_PROJECTS` + bank-id
- Deterministisk rotation — **ingen** LLM som genererar nya fakta i prod utan curator-pass

**Smoke:** `npm run smoke:mabra`
