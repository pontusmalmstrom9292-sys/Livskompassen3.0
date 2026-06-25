# docs/evaluations/2026-06-25-deep-research-barnporten-pwa.md

**Datum:** 2026-06-25
**Zon:** Familjen
**Modul:** Aktivera Barnporten barn-PWA / DEFER
**Status:** Deep Research pre-flight

---

#### Uppgift
Gör en Deep Research för att förbereda aktiveringen av den redan byggda men pausade Barnporten PWA-klienten.

#### Exakta filer
För en aktivering av Barnporten PWA berörs följande exakta filvägar och routes i frontend:
*   `barnportenRollout.ts` (där flaggan `BARNPORTEN_CHILD_PWA_ROLLOUT_ENABLED` styr nuvarande pausläge) [1].
*   `BarnportenPausedPanel.tsx` (visas när klienten är avstängd) [1].
*   `src/modules/barnporten/constants/barnportenAgents.ts` (styr barnens egen, från Valvet isolerade, orkester) [2].
*   **Routing:** `/barnporten` (för barnets PWA-vy) och `/familjen?tab=barnporten` (för förälderns vy) [2].
*   **Förälderns granskningsvyer (HITL):** `BarnportenInboxPanel.tsx`, `SaveAsEvidencePrompt.tsx`, samt funktionen `buildVaultPayloadFromChildLog` [3].

#### Callables och Backend-påverkan
Aktiveringen av klienten kräver **ingen ny backend-kod**, vilket innebär att vi helt respekterar det pågående FREEZE-tillståndet.
*   Systemet är förberett för att fungera, men är avstängt via klientflaggan `BARNPORTEN_CHILD_PWA_ROLLOUT_ENABLED=false` [1].
*   Befintliga funktioner för ihopparning (`createBarnportenPairing`, `claimBarnportenPairing`) är redan på plats och säkrade via App Check [4].
*   En aktivering innebär endast att man ändrar flaggan till `true` på klientsidan (och bygger/deployar frontenden), men det kräver formellt "Pontus OK + PMIR för enable" [5].

#### Risk: Dataseparering och WORM-samlingar
Följande arkitektoniska gränser är kritiska och verifierade som säkra:
1.  **Silo-isolering:** Barnporten kommunicerar exklusivt med sin egen WORM-silo, `children_logs` [6, 7]. Det finns **egen** orkestrering för barnet (`barnportenAgents.ts`) och ingen Cross-RAG till `kb_docs` (Kunskapsbanken) eller `reality_vault` förekommer [2, 7].
2.  **Förbud mot Auto-promote:** Ingen information, särskilt inte det som har målgruppen `child` ("Bara för mig"), får auto-exporteras till Valvet (`reality_vault`) [6, 8].
3.  **Human-in-the-Loop (HITL):** Överföring från Barnportens inkorg till Valvet kräver ett explicit godkännande av föräldern. Föräldern granskar meddelandet i `BarnportenInboxPanel` och måste klicka på **Spara som bevis** (`SaveAsEvidencePrompt`) för att materialet med korrekt tidsstämpel ska flyttas till `reality_vault` [3].

#### Slutsats
**Beslut:** **DEFER (UPPHÄVA)**
**Motivering:** Trots att arkitekturen medger noll backend-påverkan, säker separation till `children_logs` och en robust HITL-grind utan Auto-promote [2, 3], står "barn-PWA rollout" och relaterade push-notiser ("BP-PUSH") uttryckligen markerade som **PAUSED** och **DEFER** i `LIFE-OS-BUILD-STATE.md` och sprint-planeringen [1, 5, 9]. Enligt våra strikta regler får pausade system inte aktiveras utan explicit "Pontus OK + PMIR". Innan detta formella godkännande ges, och tills Fas 19.N+ (där DEFER-moduler utvärderas) initieras, rekommenderas att vi behåller systemet i sitt säkra, pausade läge för maximalt kognitivt fokus på den pågående inkast-stabiliseringen [5].
