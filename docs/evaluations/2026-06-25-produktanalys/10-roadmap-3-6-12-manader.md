# Prompt 10 — Roadmap 3 · 6 · 12 månader

**Datum:** 2026-06-25  
**Plattform:** Cursor (Composer)  
**Typ:** Analys — inga kodändringar  
**Perspektiv:** VP Product · Staff Engineer · Security Architect

**Utgångspunkt:** G1–G17 **done** · superhubbar Fas 6–11 **låsta** · Fas 19 masterplan · Fas 23 etapp 2 pågår (23A–B done, 23C–E open) · produktanalys 01–09 (juni 2026).

**Horisonter:** 3 mån ≈ sep 2026 · 6 mån ≈ dec 2026 · 12 mån ≈ jun 2027.

---

## Strategisk nordstjärna

Livskompassen är ett **personligt Life OS** under juridiskt och psykologiskt tryck — inte en wellness-app. Roadmapen prioriterar:

1. **Tillförlitlig daglig användning** (mobil, låg friktion)
2. **Bevisbar säkerhet** (tre silos, WORM, Zero Footprint, HITL)
3. **Kognitiv avlastning** (små steg, inga streaks)
4. **Billig drift** (Firebase gratis/skal-till-noll, PMIR före scope)

---

# 3 månader (sep 2026)

## Mål

Appen ska vara **Pontus dagliga verktyg på telefon** — stabil build, grön smoke, tydliga snabbvägar till rätt silo, utan nya stora moduler.

## 1. Stabilisering

| Leverans | Värde/insats |
|----------|----------------|
| Slutför **Fas 23C–E** (SOS Ankare, Paralys i Planering, Tyst läge Dagbok) | Hög — direkt coping |
| `npm run smoke:predeploy` + `smoke:locked-ux` grön på `main` | Hög — förhindrar regression |
| Android: `build:web && cap sync` dokumenterad rutin; G85 smoke | Medel |
| Städa git/root-artefakter (`app.js`, legacy index) om de blockerar deploy | Medel |

**Undvik:** Ny superhub · ny zon utanför 3-zonsystemet · parallella arkitekturexperiment.

**Beroenden:** Locked UX oförändrad · Fas 19 avslutad eller explicit defer.

**Risker:** Scope creep i Fas 23 · deploy utan YOLO-vakt.

---

## 2. Säkerhet / driftsäkring

| Leverans | Värde/insats |
|----------|----------------|
| **App Check** coverage på känsliga callables (kvarvarande gaps) | Hög |
| **Zero Footprint:** `clearSynapseState` + widget state wipe vid logout/panic | Hög |
| **Widget etikgrind** WH1 audit (alla inspelningsvägar) | Hög |
| Valv session: blur/pagehide (G17) regression-test | Medel |

**Undvik:** CMEK Big Bang · ny auth-provider · prod rules utan PMIR.

**Beroenden:** `useZeroFootprint`, `WidgetRecordingEthicsGate`.

**Risker:** Over-engineering säkerhet som stoppar UX-ship.

---

## 3. Högvärdesfunktioner

| Leverans | Värde/insats |
|----------|----------------|
| **Hamn våg 1:** kopiera-svar, JADE-undo, mikrosteg-läge | Mycket hög |
| **MåBra våg 1:** lågenergi-filter, post-session «klart», RSD-felcopy | Mycket hög |
| **Widgets våg 1:** panik dölj, silo-chip före spar, rensa vid stäng | Hög |
| **Inkast/Töm skallen** polish (23B redan done — UX-finputs) | Medel |

**Undvik:** Kunskap-RAG i MåBra-coach · auto barn→Valv.

**Beroenden:** Prompt 05–08 MVP våg 1.

**Risker:** Blanda Hamn-innehåll i Dagbok UI.

---

## 4. Arkitekturlyft

| Leverans | Värde/insats |
|----------|----------------|
| En **HITL-preview**-komponent delad inbox + dcap_alerts (minimal) | Hög |
| Synapse **idempotency** audit (drive, widget, journal_woven) | Medel |
| `traceId` i dev/admin för AI-svar (prompt 09 #5) | Medel |

**Undvik:** Genkit (GAP V1 wait) · fjärde silo · LLM-router.

**Beroenden:** `dcapAlertSynapse`, `inbox_queue`.

**Risker:** Refactor utan användar-visible win.

---

## 5. UX/polish

| Leverans | Värde/insats |
|----------|----------------|
| Obsidian Calm **hex→tokens** avslut (Fas 19.3) | Medel |
| Fyren widget-bar: tydligare silo-labels (Dagbok vs Bevis) | Hög |
| Tomma tillstånd + skeletons på widget-routes | Medel |

**Undvik:** Wellness-estetik · gamification.

**Beroenden:** `design-calm.mdc`.

---

## 6. AI/agentförbättringar

| Leverans | Värde/insats |
|----------|----------------|
| **`routeFromDcap` 4 band** (prompt 09 #4) | Hög |
| **`mabraCoachGuard`** utökad till fler inputs | Hög |
| DCAP → `dcap_alert` HITL smoke | Medel |

**Undvik:** Ny «super-agent» · cross-RAG.

**Beroenden:** `KompisSupervisor`, sharedRules.

---

### 3 mån — sammanfattning

| | |
|--|--|
| **Mest värde per insats** | Hamn våg 1 + MåBra lågenergi + widget panik/silo + smoke-grön deploy |
| **Största risk** | Bygga nytt innan stabil mobil vardag fungerar |

---

# 6 månader (dec 2026)

## Mål

**Hela 3-zonsflödet** ska kännas sammanhängande: fånga → rätt silo (HITL) → läsa tillbaka säkert. Android widgets våg 2. Agent-lager tydligare utan fler modeller.

## 1. Stabilisering

| Leverans | Värde/insats |
|----------|----------------|
| **Ekonomi/transactions** job stabil (efter nuvarande fix) | Medel |
| **evolution_ledger** dual-write (Fas 19.5) om ej done | Medel |
| Regression-pack: `smoke:orkester` i CI/nattpass | Hög |

**Undvik:** M3.0-C Fitness/Näring djup (defer Fas 19).

**Beroenden:** F8 Super-Ekonomi done.

**Risker:** Batch-jobb kostnad — håll schedule sparse.

---

## 2. Säkerhet / driftsäkring

| Leverans | Värde/insats |
|----------|----------------|
| **Unified HITL** inbox + DCAP (prompt 09 #6) | Mycket hög |
| Firestore rules audit (barn, vault, kampspar) årlig | Hög |
| Android **FLAG_SECURE** / blur on panic (prompt 08) | Hög |
| Structured **monitoring** dashboards (latency, DCAP alerts) | Medel |

**Undvik:** Extern SIEM med månadskostnad.

**Beroenden:** `monitor.ts`, Valv PIN.

**Risker:** HITL som kräver för många klick → användaren skippar.

---

## 3. Högvärdesfunktioner

| Leverans | Värde/insats |
|----------|----------------|
| **Valv våg 2** (prompt 02): export polish, dossier preview, mönster-läsning | Hög |
| **Dagbok våg 2** (prompt 03): lågenergi, röst→journal, väv opt-in | Hög |
| **Widgets våg 2:** dagbok-puls, andning, Web Share → inkast | Hög |
| **Barnen våg 1** (prompt 04): Barnporten HITL UX, barnfokus polish | Hög |
| **Kunskap våg 1** (prompt 06): citation UX, PIN-only browse | Medel |

**Undvik:** Auto-promote barnlogg → Valv · publik Kunskap-hub.

**Beroenden:** Prompt 02–08 våg 2.

**Risker:** Valv blir « för tungt » för daglig use — håll ingest enkelt.

---

## 4. Arkitekturlyft

| Leverans | Värde/insats |
|----------|----------------|
| **valvChat split** retrieval vs generation (prompt 09 #2) | Hög |
| **Inkorg-Sorteraren** som formal agent card (#1) | Medel |
| **MASTER-INTEGRATION-MANIFEST** sync med `BACKEND_MANIFEST` | Medel |
| Offline widget **kö** (Android A5) — encrypted, TTL | Medel |

**Undvik:** Monolitisk «AI service».

**Beroenden:** L-layer målarkitektur (prompt 09).

---

## 5. UX/polish

| Leverans | Värde/insats |
|----------|----------------|
| **MåBra våg 2:** paralys-panel, dissociation, bara andas | Mycket hög |
| **Hamn våg 2:** brusfilter steg 2, HITL-paus | Hög |
| Planering **P3** oförändrad men tydligare widget-ingång | Medel |
| PWA **manifest shortcuts** (prompt 08 W2) | Medel |

**Undvik:** Ny navigation utan drawer-kanon.

---

## 6. AI/agentförbättringar

| Leverans | Värde/insats |
|----------|----------------|
| **Kunskap-Retrieval-Agent** read-only (prompt 09 N3) | Hög |
| **Safety-Review** post-draft BIFF (N2) | Hög |
| **Mönster-Arkivarien** endast batch trigger (#11) | Medel |
| MåBra **bank-only** coach audit (#8) | Hög |

**Undvik:** Realtime pattern chat · LLM barn-svar.

**Beroenden:** `kampsparQueryRag`, `valvChatAgent`.

---

### 6 mån — sammanfattning

| | |
|--|--|
| **Mest värde per insats** | Unified HITL + MåBra/Hamn våg 2 + widgets dagbok/andning |
| **Största risk** | Feature-spridning över alla zoner samtidigt |

---

# 12 månader (jun 2027)

## Mål

**Mogen Life OS** för long-term custody/conflict context: beviskedja trovärdig, kunskap kuraterad, barnspår isolerat, AI förutsägbart och billigt. iOS grundparity. Ingen «produkt pivot».

## 1. Stabilisering

| Leverans | Värde/insats |
|----------|----------------|
| **Dossier BBIC** `reportType` (Fas 12D backlog) | Hög (juridiskt) |
| **Content bank** vågor (Kunskap FACT, MåBra REFLECTION) via kuratorer | Medel |
| Deprecation legacy routes helt (redirect-only) | Låg |

**Undvik:** Multi-tenant / B2B.

**Beroenden:** Valv export, entity profiles (G9 done).

---

## 2. Säkerhet / driftsäkring

| Leverans | Värde/insats |
|----------|----------------|
| **CMEK** utvärdering + stegvis rollout (PMIR) | Medel–hög (juridik) |
| **Retention** vs WORM re-audit (G5) | Medel |
| Pen-test checklist intern (security auditor agent) | Medel |
| Biometri → widget route (A4) | Medel |

**Undvik:** Full GCP overhaul utan kreditplan.

**Risker:** CMEK kostnad — fasera per collection.

---

## 3. Högvärdesfunktioner

| Leverans | Värde/insats |
|----------|----------------|
| **Valv våg 3** + **Kunskap våg 2–3** (prompt 02/06) | Hög |
| **Familjen 6–12 mo vision** (prompt 04): Trygg Hamn, livslogg analytics neutral | Hög |
| **Arkiv/autonomous panel** HITL (G10 polish) | Medel |
| **Projekt-hjärna** doc-synk (Fas 19 spår B) om ROI finns | Medel |

**Undvik:** Social delning · «AI coach» som ersätter terapeut.

---

## 4. Arkitekturlyft

| Leverans | Värde/insats |
|----------|----------------|
| Full **L0–L5 AI-lager** (prompt 09 diagram) | Hög |
| **Synapse-Dispatcher** (N5) + observability UI (admin) | Medel |
| Vector index **kostnads-gate** (scale-to-zero policy) | Medel |
| Eventuell **iOS** Capacitor shell + widget parity minimal | Medel |

**Undvik:** Genkit · microservices split.

---

## 5. UX/polish

| Leverans | Värde/insats |
|----------|----------------|
| **Theme Lab** → prod tokens (selected variants) | Låg–medel |
| **Globalt Pansarläge** iteration (Fas 23A done base) | Medel |
| Tillgänglighet pass (kontrast, reduced motion) | Medel |
| Onboarding **en** väg (anonymous → full auth) | Medel |

**Undvik:** Redesign av locked UX (Barnfokus, P3, Valv tabs).

---

## 6. AI/agentförbättringar

| Leverans | Värde/insats |
|----------|----------------|
| **Sammanfattnings-Agent** (N1) · **Barn-EVIDENCE-klassificerare** (N4) | Hög |
| **Batch Mönster** veckoinsikter med HITL preview | Medel |
| **KASAM aggregation** synapse prod-hardening | Låg |
| Multi-model router **endast** för cost (flash vs pro), inte agent-val | Medel |

**Undvik:** Autonom agent som skriver WORM · Universal-Kompis.

---

### 12 mån — sammanfattning

| | |
|--|--|
| **Mest värde per insats** | Dossier/juridisk export + Kunskap citation trust + AI-lager formaliserat |
| **Största risk** | Driftkostnad Vector/Gemini utan gates |

---

# Tvärgående tidslinje (visual)

```
2026 Q3 (3m)     Stabilisera · Fas23 · Hamn/MåBra/Widget v1 · smoke deploy
2026 Q4 (6m)     HITL unified · Valv/Dagbok/Barn v2 · Agent L2 split
2027 H1 (12m)    Dossier · CMEK eval · Content banks · iOS minimal · L-layer complete
```

---

# Detta borde göras **nu** (0–12 veckor)

1. **Grön smoke + Android daily driver** — utan detta är roadmap teori  
2. **Fas 23C SOS + Hamn/MåBra/widget MVP våg 1** — högsta coping-värde  
3. **Säkerhet:** App Check gaps, Zero Footprint clear, WH1 etik audit  
4. **`routeFromDcap` 4 band + mabraCoachGuard** — billig AI-förbättring  
5. **YOLO + Pontus OK** före varje hosting deploy  

---

# Detta borde **vänta** (6+ månader)

1. **CMEK full rollout** — PMIR + budget först  
2. **M3.0-C Fitness/Näring djup** — defer enligt Fas 19  
3. **Genkit / V1 migration** — GAP explicit wait  
4. **iOS widget parity** — efter Android bevisat  
5. **Autonomous archive utan HITL** — juridiskt och UX-mässigt för tidigt  
6. **BP-PUSH** (barn-notiser) — integritetsreview  
7. **Batch Mönster-insikter** — efter traceId + unified HITL  

---

# Detta borde **aldrig** byggas

1. **Universal-agent** med läs till alla silos och skriv till Valv  
2. **LLM-baserad routing** som ersätter DCAP + AgentCards  
3. **Streaks/XP/gamification** i MåBra eller coping-flöden  
4. **Auto-promote** barnlogg eller dagbok → Valv utan explicit HITL  
5. **Push/notiser** med konflikt-, journal- eller barninnehåll i klartext  
6. **Offentlig Kunskap-hub** utan PIN (bryter plausible deniability)  
7. **LLM som svarar barn** direkt (Barnporten ska vara HITL till förälder)  
8. **Cross-RAG** Kunskap ↔ Valv ↔ Barnen i samma coach-session  
9. **Tredjeparts OAuth** (Gmail/Kalender) — governance förbjuder API-träsk  
10. **«Self-optimization» wellness-produkt** — fel produktidentitet för Pontus  

---

# Beroendegraf (förenklad)

```
smoke:predeploy
    ├── Fas 23C–E
    ├── Widget/Hamn/MåBra v1
    └── deploy hosting

Unified HITL
    ├── inbox_queue UI
    ├── dcap_alerts UI
    └── Valv evidence prompt patterns

AI L-layer
    ├── routeFromDcap bands
    ├── traceId
    └── valvChat split

12m juridik
    ├── Dossier BBIC
    ├── Valv export polish
    └── CMEK PMIR
```

---

# KPI:er (realistiska, icke-skambeläggande)

| KPI | 3m | 6m | 12m |
|-----|----|----|-----|
| Smoke predeploy PASS | 100% merges | CI gate | + nattpass |
| Widget → rätt silo (manual sample) | 90% | 95% | 95% |
| HITL pending cleared (vecka) | — | median <7d | <3d |
| DCAP ALERT without raw text leak | 100% | 100% | 100% |
| Monthly GCP AI spend | inom gratis/kredit | alert threshold | scale-to-zero policy |

*Inga streak-KPI:er. Ingen «daglig active user»-skuld.*

---

## Källor

- Produktanalys [`01–09`](./INDEX.md) · [Fas 19 masterplan](../2026-06-15-fas19-masterplan-v2.md) · [Arkiv-GAP-REGISTER](../../specs/modules/Arkiv-GAP-REGISTER.md) · `.context/system-plan.md`
