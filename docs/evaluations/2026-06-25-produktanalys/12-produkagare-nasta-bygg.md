# Prompt 12 — Om jag vore produktägare: vad bygger jag härnäst?

**Datum:** 2026-06-25  
**Plattform:** Cursor (Composer)  
**Typ:** Analys — inga kodändringar  
**Perspektiv:** Tillfällig produktägare (syntes av prompt 01–11 + repo-nuläge)

**Premiss:** Pontus behöver **fungerande mobil vardag** under låg energi, med **säker fångst** till rätt silo — inte fler AI-demoer.

---

## De 10 prioriteringarna

### 1. MåBra «Sista utvägen» / SOS Ankare (Fas 23C)

| Fält | Innehåll |
|------|----------|
| **Vad** | Dedikerat akutflöde: andning · grounding · urge-länk · en «du är här»-rad |
| **Varför nu** | Redan TODO i system-plan; 23A–B done; största gap i etapp 2 |
| **Smärta** | Panik, RSD, hypervigilans — behöver *ett* steg utan valmeny |
| **Modul** | MåBra `/mabra/recovery/sos` · Vardagen |
| **Svårighet** | **Låg–medel** (UI + befintliga verktyg) |
| **Risk om fel** | Wellness-ton · för många steg · streak-känsla |
| **MVP** | Fullskärm 3 knappar: andas · grounding · stäng; ingen logg default |

---

### 2. Hamn — kopiera-svar, mikrosteg, session rensas

| Fält | Innehåll |
|------|----------|
| **Vad** | BIFF/Grey Rock-utkast → **kopiera** (ej skicka) · ett mikrosteg efter · Zero Footprint vid stäng |
| **Varför nu** | Daglig smärta (konflikt-SMS); JADE-detektor finns delvis — slutflödet saknas polish |
| **Smärta** | «Vad svarar jag utan JADE?» + RSD efter dåligt utkast |
| **Modul** | Hamn / Trygg Hamn · `BiffPublicPanel` · widget `/widget/hamn` |
| **Svårighet** | **Låg** |
| **Risk om fel** | Auto-send · för långa AI-svar · konflikt-innehåll sparas fel |
| **MVP** | Primär «Kopiera» · sekundär «Rensa» · JADE-varning kvar · ingen auto-send |

---

### 3. MåBra lågenergi — hubben filtreras

| Fält | Innehåll |
|------|----------|
| **Vad** | `MabraLowEnergyToggle` döljer utforskning, nutrition-detalj, tunga mål — bara akut + check-in + ett Vit-kort |
| **Varför nu** | Toggle finns; filtrering av `MABRA_HUB_ITEMS` är billig hög vinst |
| **Smärta** | Dagtrötthet, medicin, post-krasch — hubben överväldigar |
| **Modul** | MåBra · `MabraHubView` · `mabraHubRegistry` |
| **Svårighet** | **Låg** |
| **Risk om fel** | Känns som «straff» · gömmer viktigt utan väg tillbaka |
| **MVP** | Filterlista + tydlig «Låg energi — färre val» copy; toggle av = full hub |

---

### 4. Widget — silo-chip före spar + panik «Dölj»

| Fält | Innehåll |
|------|----------|
| **Vad** | `/widget/*`: välj Dagbok · Bevis · Barn · MåBra · Planering före save; global «Dölj nu» |
| **Varför nu** | `/widget/anteckning` → Valv idag — lätt att spara fel; Android widgets redan live |
| **Smärta** | «Var landade det?» + skärm-exponering |
| **Modul** | Widgets · `WidgetShell` · Android `WidgetLaunch` |
| **Svårighet** | **Medel** |
| **Risk om fel** | För många steg · default till Valv · preview på låsskärm |
| **MVP** | 5 chips + default «Inkast» · panik → neutral hem + blur (web först) |

---

### 5. Smoke-grön deploy + Android som daily driver

| Fält | Innehåll |
|------|----------|
| **Vad** | `npm run smoke:predeploy` PASS · `build:web && cap sync` · G85 test av Fyren + diskret widget |
| **Varför nu** | Utan detta är all produktanalys teori; git har lösa root-filer |
| **Smärta** | Appen «finns» men används inte dagligen — tillit eroderar |
| **Modul** | Core CI · Android · hosting |
| **Svårighet** | **Medel** (fixa blockers, inte ny feature) |
| **Risk om fel** | Deploya trasig build · skip smoke |
| **MVP** | En grön main · en APK Pontus kör 7 dagar · notera friktion i logg |

---

### 6. Zero Footprint — rensa widget + synapse vid logout/panic

| Fält | Innehåll |
|------|----------|
| **Vad** | `WidgetShell` unmount wipe · `clearSynapseState(uid)` · Hamn state clear (delvis finns) |
| **Varför nu** | G17 blur done; widget/synapse RAM gap (prompt 09 #12, 08 W5) |
| **Smärta** | Delad enhet · plausible deniability · ex kan se skärm |
| **Modul** | Core auth · widgets · ADK |
| **Svårighet** | **Låg–medel** |
| **Risk om fel** | Radera data användaren *ville* spara · otydlig «sparad vs ephemeral» |
| **MVP** | Alla `/widget/*` rensar textarea on back · logout callable clear trace |

---

### 7. Fyren — tydlig «Dagbok» vs «Bevis» vs «Barn»

| Fält | Innehåll |
|------|----------|
| **Vad** | Widget-bar labels + ikoner som matchar silo, inte generiska «Anteckning» |
| **Varför nu** | Billig kognitiv vinst; minskar fel routing utan ny AI |
| **Smärta** | «Voice-to-Vault» vs dagbok — samma mental modell |
| **Modul** | `FyrenWidgetBar` · `FyrenSideQuickDock` |
| **Svårighet** | **Låg** |
| **Risk om fel** | För långa labels · rör locked UX |
| **MVP** | Copy-pass: «Bevis-rad» / «Dagbok» / «Barnobs» · Valv låst tills PIN |

---

### 8. Unified HITL — en preview för inkast + DCAP

| Fält | Innehåll |
|------|----------|
| **Vad** | Samma UI-mönster: «Föreslagen silo · confidence · Godkänn / Ändra / Avvisa» |
| **Varför nu** | `inbox_queue` + `dcap_alerts` parallella mentala modeller |
| **Smärta** | Osäkerhet om AI klassificerat rätt — särskilt bevis/barn |
| **Modul** | Inkast · DCAP · Valv inkorg |
| **Svårighet** | **Medel–hög** |
| **Risk om fel** | För många klick → användaren skippar HITL helt |
| **MVP** | Endast inkast confirm med silo-chip; DCAP alerts länk till samma komponent senare |

---

### 9. Paralys-Brytaren i Planering (Fas 23D)

| Fält | Innehåll |
|------|----------|
| **Vad** | P3 «Att göra» + widget: vid overwhelm → **ett** mikrosteg från `user_overwhelm` synapse |
| **Varför now** | System-plan TODO; synapse finns; Planering P3 är locked men får mikro-ingång |
| **Smärta** | Exekutiv dysfunktion — listor paralyserar |
| **Modul** | Planering P3 · `ParalysBreakerWidget` (finns admin-variant) |
| **Svårighet** | **Medel** |
| **Risk om fel** | Ny kanban · gamification · för många steg |
| **MVP** | Knapp «Bara ett steg» → en rad · lägg valfritt i P3 |

---

### 10. DCAP 4 band + utökad mabraCoachGuard

| Fält | Innehåll |
|------|----------|
| **Vad** | Finare `routeFromDcap`; guard på fler MåBra-inputs → Speglar |
| **Varför nu** | Billig backend · hög säkerhetsvinst · ingen ny modell |
| **Smärta** | Fel AI-zon (terapi i MåBra vid ex-text) |
| **Modul** | `KompisSupervisor` · `mabraCoach` · Hamn |
| **Svårighet** | **Låg** |
| **Risk om fel** | Över-redirect · frustrerande «fel rum» |
| **MVP** | 4 trösklar i kod + guard på vit_chat/check-in anteckning |

---

## Prioriteringsordning (byggsekvens)

```
5 Deploy/smoke  →  7 Fyren labels  →  3 MåBra lågenergi  →  2 Hamn kopiera
→  1 SOS  →  6 Zero Footprint  →  4 Widget silo/panik  →  10 DCAP/guard
→  8 HITL preview  →  9 Paralys P3
```

*Deploy först — annars shippar du till ingen.*

---

## Topp 3 — snabbast vinst

| # | Val | Varför snabb |
|---|-----|--------------|
| **1** | **MåBra lågenergi-filter** | Toggle finns; mest UI-filter |
| **2** | **Fyren silo-labels** | Copy + routing-klarhet; timmar inte veckor |
| **3** | **Hamn kopiera + rensa** | JADE finns; slutar i affärsmässigt flöde |

---

## Topp 3 — strategiskt viktigast

| # | Val | Varför strategiskt |
|---|-----|-------------------|
| **1** | **Smoke + Android daily driver** | Utan vana dör produkten |
| **2** | **Widget silo + panik dölj** | Integritet + rätt WORM = kärnlöfte |
| **3** | **Unified HITL preview** | Trust i AI-klassificering utan cross-RAG |

---

## Topp 3 — vänta (trots att de är spännande)

| # | Idé | Varför vänta |
|---|-----|--------------|
| **1** | **Batch Mönster-Arkivarien / veckoinsikter** | Kräver traceId + HITL mogen; risk falsk trygghet (prompt 11 #7) |
| **2** | **CMEK full rollout** | Kostnad + PMIR; appen måste fungera emotionellt först |
| **3** | **Web Share Target + offline widget-kö** | Bra mobil v2 — men efter silo-chip och deploy bevisat |

---

## Vad jag medvetet *inte* prioriterar top 10

- Ny AI-modell / Universal-Kompis  
- Kunskap-RAG i MåBra-coach  
- Streaks, health scores, motparts-riskdashboard  
- Publik Kunskap · social community  
- Gmail/Kalender-sync  

→ Se [11-farliga-bra-ideer.md](./11-farliga-bra-ideer.md).

---

## Nästa steg efter 12/12

Ny chatt:

> *Läs `docs/evaluations/2026-06-25-produktanalys/` och syntetisera till uppdaterad app-planering.*

Korsreferens: [10-roadmap-3-6-12-manader.md](./10-roadmap-3-6-12-manader.md) · [INDEX.md](./INDEX.md)

---

## Källor

Produktanalys 01–11 · `.context/system-plan.md` (Fas 23C–E TODO) · Fas 19 masterplan · GAP G1–G17 done
