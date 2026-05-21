{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fmodern\fcharset0 Courier;\f1\froman\fcharset0 Times-Roman;}
{\colortbl;\red255\green255\blue255;\red36\green36\blue36;\red255\green255\blue255;}
{\*\expandedcolortbl;;\cssrgb\c18824\c18824\c18824;\cssrgb\c100000\c100000\c100000;}
\paperw11900\paperh16840\margl1440\margr1440\vieww28600\viewh16040\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs28 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 # SafeHarbor-SPEC.md\
\
### 1. Syfte och anv\'e4ndarbehov\
Safe Harbor (Hamn) \'e4r en "Sacred Feature" utformad f\'f6r att hantera all n\'f6dv\'e4ndig kommunikation med en h\'f6gkonflikt-expartner. Modulen minskar kognitiv stress genom att fungera som en k\'e4nslom\'e4ssig brandv\'e4gg. Den filtrerar bort manipulation och genererar k\'e4nslo-neutrala, gr\'e4nss\'e4ttande svar enligt BIFF- (Brief, Informative, Friendly, Firm) och Gr\'e5stens-metoden (Grey Rock), helt fria fr\'e5n JADE (Justify, Argue, Defend, Explain).\
\
### 2. Route och ing\'e5ng\
*   **Route:** `/hamn` (skyddad av AuthGate).\
*   **Ing\'e5ng:** N\'e5s \'f6ppet via dockan, Hemsidans bento-grid, eller via en direkt bro fr\'e5n Speglings-Systemet (`/speglar`).\
\
### 3. UX-fl\'f6de (Progressive Disclosure)\
1.  **Inmatning:** Anv\'e4ndaren klistrar in exets meddelande.\
2.  **Brusfiltret:** AI:n analyserar meddelandet (`analyzeMessage`) och skalar bort allt skuld- och skambel\'e4ggande (gaslighting/crazymaking). Anv\'e4ndaren f\'e5r se k\'e4rnfr\'e5gan: "Vad hen egentligen fr\'e5gar om" (objektiv fakta).\
3.  **Anv\'e4ndarens m\'e5l:** Anv\'e4ndaren anger kort vad den vill uppn\'e5 eller svara (t.ex. "S\'e4g nej, jag kan inte ta barnen p\'e5 fredag").\
4.  **Generering:** BIFF-agenten skapar ett kort, neutralt svarsf\'f6rslag.\
5.  **Kopiera och rensa:** Anv\'e4ndaren kopierar svaret. Ett klick p\'e5 "Klar" utl\'f6ser Zero Footprint och raderar allt.\
\
### 4. Visuell design (Obsidian Calm)\
*   **Bakgrund:** `#020617` (slate-950).\
*   **Yta:** `#0f172a` (slate-900) med glass blur (backdrop-filter).\
*   **Rubriker / Aktivt val:** Guld `#FDE68A`.\
*   **Call-to-Action (Forts\'e4tt):** Indigo `#818CF8`.\
*   **Spara / Kopiera / Klar:** Emerald `#2DD4BF`.\
*   **Typografi:** Outfit f\'f6r rubriker, Inter f\'f6r br\'f6dtext.\
*   **F\'f6rbjudet:** Inga lila, turkosa, regnb\'e5gsf\'e4rger, naturteman, ljusa bakgrunder eller r\'e4knare (count-up).\
\
### 5. Datamodell (Firestore, WORM)\
Strikt **Zero Footprint** som standard. F\'f6r att skydda anv\'e4ndarens psykiska h\'e4lsa lagras *inga* toxiska meddelanden permanent i denna modul. Det enda undantaget \'e4r om anv\'e4ndaren aktivt v\'e4ljer "Spara som bevis", varp\'e5 en WORM-post (Write Once, Read Many) skickas asynkront till `reality_vault` med en servertidsst\'e4mpel.\
\
### 6. Backend och agenter (Callable)\
*   **Agent Card (Genkit):** En dedikerad kommunikationsagent anropas via Cloud Functions (`analyzeMessage` och `generateBiffResponse`). \
*   Agenten styrs av strikta systeminstruktioner (Dotprompt) som f\'f6rbjuder f\'f6rklaringar och f\'f6rsvar, och formaterar utdatan enligt JSON f\'f6r att separera "Brusfilter-fakta" fr\'e5n "Svarsf\'f6rslag".\
\
### 7. S\'e4kerhet\
*   **AuthGate:** Obeh\'f6riga avvisas direkt.\
*   **Zero Footprint & Kill Switch:** Vid inaktivitet, om appen hamnar i bakgrunden, vid enhets-skakning (`useShakeToKill`), eller n\'e4r fl\'f6det st\'e4ngs, raderas omedelbart hela chatt-staten fr\'e5n klientens minne.\
*   **CMEK:** All eventuell data i r\'f6relse och lagrad bevisdata \'e4r krypterad.\
\
### 8. Status idag vs planerat\
*   **Status idag:** Route `/hamn` och viss komponentstruktur finns i koden. Eventuellt finns ett skelett f\'f6r `analyzeMessage`.\
*   **Planerat:** Bygga "Brusfiltret" visuellt, implementera Genkit-agenten f\'f6r strikta BIFF/Grey Rock-svar, och bygga \'f6verg\'e5ngen (bron) fr\'e5n `/speglar` d\'e4r det initiala meddelandet automatiskt f\'f6ljer med som kontext.\
\
### 9. Acceptanskriterier\
1. Inmatning av ett toxiskt meddelande i "Brusfiltret" returnerar enbart den faktam\'e4ssiga k\'e4rnfr\'e5gan utan k\'e4nslo-laddade ord.\
2. Det genererade svarsf\'f6rslaget bryter aldrig mot BIFF-reglerna och inneh\'e5ller aldrig f\'f6rsvar eller f\'f6rklaringar (JADE).\
3. Att navigera bort fr\'e5n vyn, eller trigga Kill Switch, nollst\'e4ller omedelbart formul\'e4rets inneh\'e5ll helt (Zero Footprint).\
4. Ett klick p\'e5 "Spara som bevis" skapar ett of\'f6r\'e4nderligt dokument i `reality_vault`-samlingen i Firestore.\
\
### 10. Kopplingar till andra moduler\
*   **Speglings-Systemet (`/speglar`):** En naturlig bro. Om speglingen visar att ett meddelande var ett \'f6vergrepp/gaslighting kan anv\'e4ndaren slussas direkt till `/hamn` f\'f6r att hantera svaret s\'e4kert.\
*   **Verklighetsvalvet (`/valv`):** Tar emot l\'e5sta kopior av exets meddelanden om de utg\'f6r hot eller avtalsbrott.\
\
### 11. Navigation\
*   **Variant A:** Synlig ankare/hamn-ikon i huvudmenyn eller dockan.\
*   **Variant B:** Dold/integrerad navigering d\'e4r modulen fr\'e4mst n\'e5s som ett logiskt n\'e4sta steg inifr\'e5n Speglings-systemet.\
\pard\pardeftab720\partightenfactor0

\f1 \cf2 \cb1 \
}