# Delrapport: Drogfrihet MAX → förstärkningsvågor

**Datum:** 2026-07-21  
**Roll:** Våg-/roadmap-arkitekt (Cursor · Composer)  
**Bas:** Drogfrihet MAX-plan (MVP 2–3v / V2 1–2m / MAX 3m+ · tickets 1–125)  
**Kod:** Ingen. Endast omstrukturering.

---

## 0. Dom: varför vågor slår MVP/V2/MAX

MVP/V2/MAX blandar **säkerhet, akut, content, notiser och progression** i samma tidsfönster. Det skapar parallell rivningsrisk på en **låst** modul (`MOD-FAM-DROG`) och ADHD-överlast (för många ytor samtidigt).

**Ny kanon:** sex **additiva förstärkningsvågor**. Varje våg = ett lager ovanpå befintlig yta. Ingen rebuild. Ingen ersättning av `RecoveryUrgeSosModule`. Re-lock efter varje våg.

**Mappning tidshorisont (ungefärlig):**

| Våg | Tid (kalender) | Tidigare nivå |
|-----|----------------|---------------|
| 0 | 1–3 dagar | Pre-MVP gate |
| 1 | ~1,5–2,5 v | MVP-kärna |
| 2 | ~1–2 v | MVP-rest + tidig V2 |
| 3 | ~1–2 v (batchar) | MAX innehåll (flyttad **före** notiser) |
| 4 | ~1–2 v | V2 widget/notiser |
| 5 | 4–8+ v | Rest V2 + MAX experiment |

**Strikt princip:** Våg *n* får inte starta innan Våg *n−1* har **DoD + re-lock GO**.

---

## 1. Globalt: får inte rivas (alla vågor)

| Artefakt | Regel |
|----------|--------|
| `RecoveryUrgeSosModule` | **Utöka** (lager/fas/protokoll) — **inte** ersätt med ny SOS-app |
| Dagräknare (`drogfrihetCounter` / localStorage) | Neutral räknare; nollställ **endast** Inställningar tvåsteg; **inga** streaks/XP |
| `DF-REF-*` katalog + `pickDrogfrihetIdag` | Behåll Idag-kort; akut får **referera**, inte ersätta pool |
| `DF-STEP-*` / `RecoveryTwelveStepJournal` | Behåll; Våg 5 polerar disclosure — ingen AA-låsning |
| Familjen-placement | `/familjen?tab=drogfrihet` (+ legacy redirect) — **ingen** hub-flytt utan PMIR |
| `MOD-FAM-DROG` lock | Unlock per våg → work → **re-lock** |
| Zero Footprint SOS Fas 1–2 | Ingen auto-persist, ingen RAG/Valv/LLM i akut |
| Krisnummer-sanning | 112 livsfara · 113 77 självmord · korrekta SE-linjer (Våg 0) |
| Silo | Recovery → Vit (`vit_entries` / profil); **aldrig** auto `kampspar` / `reality_vault` |
| Progressive disclosure | Ett val / en övning i taget i akut och steg |

---

## 2. Vågtabell (översikt)

| Våg | Namn | Mål (en mening) | Ticket-band (MAX-plan) | Gate till nästa |
|-----|------|-----------------|------------------------|-----------------|
| **0** | Safety + unlock | Rätt akutkedja + godkänd unlock innan feature-kod | ~1–12 (+ safety locks) | Nummer QA + Pontus unlock-OK |
| **1** | Akutläge kärna | 0–15 min protokoll **på** befintlig SOS | ~13–40 | Offline akut DoD + smoke |
| **2** | Återfallsberedskap | Lapse≠relapse, kom-tillbaka, If–Then/profil | ~41–65 | AVE-copy + reset-flöde OK |
| **3** | Innehållsmotor | Skamfri bank (citat/frågor/prompter) klar **före** push | ~101–115 | Content safety gate PASS |
| **4** | Widget / notiser | One-tap Ankare + quiet hours (pull-first) | ~86–100 | Widget → SOS ≤1 tap |
| **5** | Progression / MAX | Daglig träning, steg-UX, experiment, re-lock-stäng | ~66–85, 116–125 | KPI-baseline + re-lock |

---

## 3. Våg 0 — Safety + unlock

### Mål
Gör det **säkert och lagligt att röra** Drogfrihet: korrekta akutnummer, tydlig app≠behandling, unlock med spårbar eval.

### In-scope
- Rätta `resources.ts` / disclaimer: **112**, **113 77**, Droghjälpen, Alkoholhjälpen (ersätt fel “Ring 113” där det betyder akutnummer).
- Unlock `MOD-FAM-DROG` (eval + Pontus OK) med scope = **endast aktuell våg**.
- Sacred safety invariants dokumenterade (Zero Footprint SOS, ingen terapeut-AI, ingen community default).
- Smoke/assert på krisrader synliga utan AuthGate där kanon kräver det.
- Tickets: unlock, nummerfix, copy-förbudslista (skam/glorifiering), re-lock-checklista-stub.

### Out-of-scope
- Ny akut-UI, protokoll 1/3/10, widget, innehållsbank, If–Then, buddy, Speglar-bro.
- Route-flytt Familjen → `/mabra/recovery` (kräver separat PMIR).

### Definition of Done
- [ ] Manuell QA: 112 / 113 77 / stödlinjer syns korrekt i Resurser + akut-yta.
- [ ] Unlock-eval filad; Pontus OK sparad.
- [ ] Inga feature-PR:ar mergade före denna gate.
- [ ] `npm run smoke:locked-ux` (eller motsv.) grön på orörd UX-baslinje.

### Re-lock krav
- Efter Våg 0: antingen **håll unlock öppen endast för Våg 1** med tidsgräns, eller re-lock tills Våg 1 startar (rekommenderat: **kort unlock-fönster** dokumenterat i eval).
- Nummer-/safety-filer får inte lämnas “halvfärdiga”.

### Beroenden
- Pontus OK unlock.  
- Klinisk safety-delrapport (invariants) — får köras parallellt **läsning**, men **kod** efter/under Våg 0.

### Får inte riva
- Befintlig SOS Ankare (andning/jordning).  
- Dagräknare / DF-REF / 12-steg / Familjen-flik.

---

## 4. Våg 1 — Akutläge kärna (lager på SOS)

### Mål
När suget slår till: ≤ få tryck till lugn yta, protokoll **1 / 3 / 10 min**, urge surf, HALT, distraktion — **additive** i `RecoveryUrgeSosModule` (+ deep link / CTA).

### In-scope
- Tickets ~13–40: deep link akut, entry “Jag är här”, dölj tabs i akut, större SOS-CTA, L2 andning/jordning polish, L3 stödval + tel, 1/3/10, urge surfing default ~2 min, HALT, cykelkarta, distraktionsbank, anti-köp 15 min, offline + a11y, opt-in intensitet, events `akut_start/complete`.
- Utöka skärmtillstånd i befintlig modul (t.ex. `anchor | breathing | grounding | protocol | …`) — **samma komponent-API** (`onClose`).

### Out-of-scope
- If–Then-planer, trigger-CRUD, widget, push-notiser, 300-citat-bank, buddy, curriculum v1–12, Speglar-bro.
- Ersätta hub-flikar eller flytta SOS till ny app-shell.

### Definition of Done
- [ ] Från Idag: SOS → Ankare ≤2 s till första lugnande mening.
- [ ] 1/3/10 körbara **offline** (ingen nätverk i Fas 1–2).
- [ ] “Klar för nu” / stödväg utan skam-copy (förbudslista från Våg 0).
- [ ] Manuell QA-protokoll 0–15 min dokumenterad PASS.
- [ ] Device Clear / logout rensar SOS session-nycklar (om gap kvar: ticket måste stängas här).

### Re-lock krav
- Re-lock `MOD-FAM-DROG` efter merge **eller** explicit “våg-1-klar”-eval + smoke:locked-ux + typecheck.
- Inga öppna “temporary” fork-SOS-filer.

### Beroenden
- **Våg 0 DoD.**  
- Befintlig `RecoveryUrgeSosModule` + `MabraRecoveryBanner` entry.

### Får inte riva
- Ankare-flöde andning/jordning (får polishas, inte tas bort).  
- Zero Footprint: ingen auto-WORM efter timer.  
- Dagräknare synlig på Idag **utanför** akut-overlay.

---

## 5. Våg 2 — Återfallsberedskap

### Mål
Efter akut: skamfri omstart, personlig “varför”, enkla If–Then och riskförberedelse — utan gamification.

### In-scope
- Tickets ~41–65: lapse vs relapse FACT/copy, AVE-copy vid reset, kom-tillbaka-flöde, `coreWhy` / grounding / supportContact UI, konsekvenskort, If–Then (max 3 scenarier), PPT-riskkarta light, trigger tags + opt-in logg efter akut, DF-SOS-01 wire (valfri save), `lastSosAt`, eskaleringsbanner (≥N SOS/vecka → vårdlänk), natt/helg-toggle, coping-segrar, milstolpe **utan** streak-brand, värde/tankefälla/beslutsbalans light, reality check snabbväg.

### Out-of-scope
- Push/widget (Våg 4).  
- Full innehållsmotor-volym (Våg 3).  
- Buddy 1:1, heatmap, mental rehearsal-kalender (Våg 5).  
- Streaks, XP, community feed.

### Definition of Done
- [ ] Nollställ dagräknare → kom-tillbaka utan skam; AVE-språk konsekvent.
- [ ] Minst 3 If–Then sparbara i `recovery_profile` (eller lokal profil enligt kanon).
- [ ] Eskaleringscopy pekar till **vård/linjer**, inte “app som behandling”.
- [ ] Smoke: innehåll/FACT för lapse–relapse om tillagt.

### Re-lock krav
- Profil-schemaändringar dokumenterade; rules-gap kräver separat rules-PR + yolo-vakt — annars client-only tills PMIR.
- Re-lock efter grön smoke.

### Beroenden
- **Våg 1** (akut session finns att koppla opt-in logg / lastSosAt).  
- `recoveryProfileService` / CAT8-spec.

### Får inte riva
- Tvåstegs nollställ i Inställningar.  
- “Inga streaks”-kanon i help/katalog.  
- Vit-silo: ingen auto-promote till Valv.

---

## 6. Våg 3 — Innehållsmotor

### Mål
Färdig, **skam-/trigger-granskad** bank innan notiser så push aldrig får tom eller farlig copy.

### In-scope
- Tickets ~101–115: schema DF-QUOTE / DF-Q / DF-PROMPT, seed i **batchar** (inte 650 rader på en gång i UI), 50 notis-meningar, content-QA gate, `source_tier`, FACT df-007+, export → TS-katalog, `smoke:innehall`, parafras-policy, SV-only lock.
- Koppling: prompter ska kunna konsumeras av Våg 1-protokoll (referens), inte kräva ombyggnad av SOS.

### Out-of-scope
- Aktivera push/widget (Våg 4).  
- Skriva “terapeutiska” dialogflöden / LLM-coach.  
- Community-citat / AA-varumärkestext.

### Definition of Done
- [ ] Content safety gate PASS (skam, glorifiering, trigger, religionstvång).  
- [ ] Minst P0-subset live i katalog: akuta prompter + notis-seed + QA-logg.  
- [ ] `npm run smoke:innehall` grön för nya bankId.  
- [ ] Full volym (300/200/100) får vara **fler batch-PR:ar** inom vågen — men gate gäller varje batch.

### Re-lock krav
- Innehålls-PR:ar får inte låsa upp nav/IA.  
- Re-lock modul om kod rör hub; rena bankfiler kan gå under curator-gate utan full unlock om policy tillåter — annars samma unlock-fönster.

### Beroenden
- **Våg 0** copy-förbud.  
- **Våg 1** protokoll-struktur (så prompter matchar 1/3/10).  
- Våg 2 **önskvärd** för AVE/lapse-språk i FACT — **rekommenderat före** stora FACT-batchar.

### Får inte riva
- Befintliga `DF-REF-*` / `DF-STEP-*` KEEP-rader (utöka, ersätt inte).  
- U6: REFLECTION i Mabra-bank, FACT via kunskap-seed — ingen fjärde silo.

---

## 7. Våg 4 — Widget / notiser

### Mål
Minska friktion till Ankare (widget/deep link) och **opt-in** quiet-hours-nudges — pull-first, max 1 nudge/fönster.

### In-scope
- Tickets ~86–100: Android widget Ankare, Capacitor deep link, notis opt-in UI, quiet hours, craving windows, notis-copy från Våg 3, max-1-nudge enforce, Fyren snabbåtgärd “Sug”, haptik opt-in, a11y widget; retention guardrails (disable-rate).

### Out-of-scope
- Spontan JITAI utan opt-in.  
- Röst-ankare (P2 — tidigast Våg 5).  
- Buddy-ping (Våg 5).  
- Notiscopy skriven ad hoc utan bank.

### Definition of Done
- [ ] Widget / genväg → samma SOS L1 som hub (≤1 tap).  
- [ ] Default: notiser **av**; quiet hours fungerar.  
- [ ] Max 1 nudge per konfigurerat fönster verifierat.  
- [ ] Deep link-test dokumenterad (Android).

### Re-lock krav
- Widget/Android-ytor: respektera Sacred / screenshot-policy i säkra zoner; ingen ny bypass.  
- Re-lock + smoke:android-platform där relevant.

### Beroenden
- **Våg 1** (mål-yta Ankare/akut).  
- **Våg 3** (notis-copy bank + safety gate).  
- *Inte* beroende av full Våg 5 progression.

### Får inte riva
- Global SOS / hub-entry.  
- Quiet-by-default (ingen “spam för retention”).

---

## 8. Våg 5 — Progression / MAX

### Mål
Långsiktig träning utan överlast: morgon/kväll light, steg-disclosure, valfri curriculum, experiment — sedan stäng unlock-cykeln.

### In-scope
- Tickets ~66–85: one-day check, kväll 3 frågor, själv-sponsor, steg progressive disclosure, inkluderande hoppkälla, AA/SMART info-kort (neutralt), mikrosteg, Vit opt-in, HALT-bro MåBra, twelveStepProgress verify.  
- Tickets ~116–123: buddy design (design only tills PMIR), Speglar→craving-bro (PMIR), heatmap, mental rehearsal, anhörig-läge scope-doc, A/B urge-tid, KPI-mall.  
- Tickets ~124–125: re-lock + unlock-eval stäng + YOLO-logg.

### Out-of-scope (utan separat PMIR)
- Klinisk PDT, andningstest/övervakning, community, dating, belöningsekonomi (CM).  
- Flytt av hub till annan zon.  
- Terapeut-AI / sponsor-LLM.

### Definition of Done
- [ ] Daglig träning: max **en** primär CTA/dag synlig (progressive disclosure).  
- [ ] Steg-journal: ett steg expanded.  
- [ ] Experiment bakom flagga; default off.  
- [ ] KPI-events dokumenterade (akut complete, opt-in intensity delta).  
- [ ] **124–125:** MOD-FAM-DROG re-lock + eval stängd.

### Re-lock krav
- **Obligatorisk** hård re-lock i slutet av Våg 5.  
- Öppna P2-spår (buddy/Speglar) = **nya** unlock-vågor, inte “smyg in under MAX”.

### Beroenden
- Våg 1–4 klara (annars progression utan akut/copy/widget = falsk MAX).  
- Innehåll från Våg 3 för dagliga prompts.

### Får inte riva
- Allt i §1.  
- App-stöd ≠ behandling (eskalering till 112/1177/linjer kvar i UI).

---

## 9. Ticket-omslag (125 → vågor)

| Våg | Ticket-ID (från MAX backlog) |
|-----|------------------------------|
| 0 | 1–12 (+ eventuella safety-lock-tickets från etik-revisor) |
| 1 | 13–40 |
| 2 | 41–65 |
| 3 | 101–115 |
| 4 | 86–100 |
| 5 | 66–85, 116–125 |

**Avvikelse mot ursprunglig implementationsordning i MAX-planen:**  
Ursprung: widget **före** innehåll + If–Then sent.  
**Ny ordning:** återfall (2) → innehåll (3) → widget (4).  
Skäl: notiser utan bank = riskcopy; If–Then hör till beredskap före push.

---

## 10. Risker om vågor blandas

| Blandning | Risk | Symptom | Mitigation |
|-----------|------|---------|------------|
| **1 + 4** (akut + widget samtidigt) | Dubbel entry, broken deep link, Sacred/Android-störning | Widget öppnar gammal/halv SOS | Widget först efter Våg 1 DoD |
| **3 före 0** | Farlig/felaktig kriscopy i bank | “Ring 113” i notis/prompt | Safety gate blockerar seed |
| **4 före 3** | Tomma eller ad hoc-notiser | Spam, skamton, disable-rate ↑ | Förbjud push utan bank-ID |
| **2 + 5** tidigt | Profil + curriculum + inventering = ADHD-överlast | Användaren undviker hub | En primär yta/våg |
| **5 utan 1** | “MAX” utan fungerande craving-hjälp | Feature-rik, kris-fattig | Strikt gate |
| Rebuild SOS parallellt med Våg 1 | Rivning av Ankare, regresser | Två SOS-vägar | Additive only-regel i PR-mall |
| Unlock utan re-lock | Locked UX-drift | Smoke fail / natt STOP | Re-lock DoD per våg |
| Content + Speglar-bro samtidigt | Silo-läcka / HCF-trigger | Ex-konflikt i recovery-flöde | Speglar = Våg 5 + PMIR |
| Rules/WORM i Våg 1 akut | Latens, nätkrav i kris | SOS “hänger” | WORM endast opt-in efter “Klar” |

---

## 11. Rekommenderad strikt ordning

```text
Våg 0  →  Våg 1  →  Våg 2  →  Våg 3  →  Våg 4  →  Våg 5
Safety    Akut       Återfall   Innehåll   Widget     Progression
unlock    på SOS     beredskap  motor      /notiser   /MAX + re-lock
```

**Parallellisering som *är* tillåten (läsning/design, inte merge-blandning):**
- Etik/safety-invariants (**text**) ∥ Våg 0.  
- Innehålls-*utkast* i sandbox ∥ Våg 1–2, men **merge/seed** först efter Våg 0 (+ rekommenderat efter Våg 1 struktur).  
- Widget *design/spike* ∥ Våg 3, merge först efter Våg 1 + Våg 3 gate.

**Parallellisering som *inte* är tillåten:**
- Merge av Våg 4 innan Våg 3 content safety PASS.  
- Ny SOS-komponent bredvid `RecoveryUrgeSosModule`.  
- Hub-flytt / buddy / Speglar-bro utan PMIR.

---

## 12. ADHD / progressive disclosure (vågregel)

| Regel | Tillämpning |
|-------|-------------|
| En primär CTA | Våg 1: SOS. Våg 2: kom-tillbaka / If–Then. Våg 5: “dagens mikrosteg”. |
| Max 2 synliga val i akut | Redan CAT8 — behåll i Våg 1 utökning |
| Batcha innehåll | Våg 3 aldrig “dumpa 650 rader” i en UI-PR |
| Inga streaks | Alla vågor |

---

## 13. Nästa beslut (ett)

**Godkänn vågkanon §2 + strikt ordning §11** som ersätter MVP/V2/MAX som *styrande leveransmodell* (tidshorisont får finnas kvar som prognos, inte som blandad backlog).

---

*Delrapport klar. Ingen kod ändrad.*
