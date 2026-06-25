# Prompt 7 — MåBra / Vit som lågtröskel-stöd

**Datum:** 2026-06-25  
**Plattform:** Cursor (Composer)  
**Typ:** Analys — inga kodändringar  
**Perspektiv:** Neurodiversitetsvänlig · recovery-focused · low-pressure wellbeing

---

## Nuläge (kort)

**Route:** `/vardagen?tab=mabra` + `/mabra/*` (verktyg, recovery/sos, projekt).

**MåBraInputSuperModule:** check-in · Vit (card/chat/memory) · känslominne · reflektion · dagbok-bro · inkast.

**Hub:** `mabraHubRegistry` — kategorier akut / tankar / lekar / identitet / projekt. **Low energy toggle** · **capacity gate** (`mabra30Capacity`) · **Recovery SOS** · **grounding 5-4-3-2-1** · **Daglig mix** (deterministisk rotation, ingen streak).

**Vit:** `vit_entries` WORM · `mabraContentBank` parafras (REFLECTION, bankId) · **ingen Kunskap-RAG** · `pickVitProjectCard` daglig rotation.

**Gränser:** `mabraCoachGuard` → Speglar vid konflikt/gaslighting · `MabraVitEvidencePrompt` (valfri Valv, HITL) · journal via `MabraDagbokBridgePanel` · Valv `mitt_vit` read/export bakom PIN.

**Copy-kanon:** `VIT_HUB_KRAVLOST` — ingen streak, ingen skuld vid paus.

---

## 20 modulidéer / förbättringar

### 1. Paralys-panel (kapacitets-gate)

| Fält | Innehåll |
|------|----------|
| **Syfte** | Vid låg kapacitet: endast check-in, andning, SOS — inga valmenyer |
| **Situation** | ADHD shutdown, utmattning efter konflikt |
| **UI-risk** | Medel — får inte kännas som "straff" för dålig prestation |
| **Kognitiv belastning** | **Minimal** |
| **MVP** | Auto när `lowEnergyMode` + `capacityLevel` låg; 3 knappar max |

---

### 2. "Bara andas" (ingen övning, ingen logg)

| Fält | Innehåll |
|------|----------|
| **Syfte** | Timer + en instruktion; sparas endast om användaren vill |
| **Situation** | Panik, rastlöshet, hypervigilans |
| **UI-risk** | Låg |
| **Kognitiv belastning** | Minimal |
| **MVP** | 2/5 min väljare + stäng; ingen session WORM default |

---

### 3. Dissociation-läge (grå minimal UI)

| Fält | Innehåll |
|------|----------|
| **Syfte** | En skärm: "Du är här" + fot på golvet + en rad |
| **Situation** | Dissociation, overbelastning |
| **UI-risk** | Medel — för mycket text triggar |
| **Kognitiv belastning** | Minimal |
| **MVP** | `/mabra/akut/land` fullscreen; koppla befintlig grounding54321 som valfritt steg 2 |

---

### 4. Lågenergi-toggle styr hela hubben

| Fält | Innehåll |
|------|----------|
| **Syfte** | `MabraLowEnergyToggle` döljer utforskning, nutrition detalj, mål |
| **Situation** | Dagtrötthet, medicin, post-krasch |
| **UI-risk** | Låg — redan diskret toggle |
| **Kognitiv belastning** | Låg |
| **MVP** | Filtrera `MABRA_HUB_ITEMS` till quick + akut only |

---

### 5. Check-in → ett mikrosteg (inte lista)

| Fält | Innehåll |
|------|----------|
| **Syfte** | Efter humör/energi: max **ett** förslag från bank (parafras) |
| **Situation** | "Vad ska jag göra nu?" utan planeringsstress |
| **UI-risk** | Medel — får inte bli coachig |
| **Kognitiv belastning** | Låg |
| **MVP** | `fetchBankParafrasCoach` en rad; dismiss = klart |

---

### 6. Vit-frågekort: "Ett ord räcker" förstärkt

| Fält | Innehåll |
|------|----------|
| **Syfte** | `VitCardFlowPanel` — stor "Spara utan text" / emoji-only |
| **Situation** | Självkritik, tomhet, låg energi |
| **UI-risk** | Låg |
| **Kognitiv belastning** | Minimal |
| **MVP** | Primär knapp "Landat ✓" utan textarea |

---

### 7. Post-session "Klart — inget mer"

| Fält | Innehåll |
|------|----------|
| **Syfte** | Efter övning/Vit-spar: en skärm utan "nästa utmaning" |
| **Situation** | RSD efter "missad" session |
| **UI-risk** | Låg |
| **Kognitiv belastning** | Minimal |
| **MVP** | Ersätt upsell-länkar med en "Stäng" i `MabraExerciseView` |

---

### 8. Speglar-vakt synlig (konflikt → rätt zon)

| Fält | Innehåll |
|------|----------|
| **Syfte** | Förstärk `MabraSpeglarGuardHint` i vit_chat och check-in anteckning |
| **Situation** | Användare ventilerar om ex i MåBra |
| **UI-risk** | Låg — redirect, inte moral |
| **Kognitiv belastning** | Låg |
| **MVP** | Guard på fler inputs; länk till Speglar med state |

---

### 9. Dagbok-bro förenklad (MåBra → Hjärtat)

| Fält | Innehåll |
|------|----------|
| **Syfte** | `MabraDagbokBridgePanel` — "Spara bara humör" lika stor som text |
| **Situation** | Reflektion efter MåBra-session |
| **UI-risk** | Låg |
| **Kognitiv belastning** | Låg |
| **MVP** | Symmetriska CTA; `mabraBridgeHub` förifyllt |

---

### 10. Känslominne vs Vit tydligare (D1)

| Fält | Innehåll |
|------|----------|
| **Syfte** | Separera `emotional_memory` WORM från `vit_entries` i UI-copy |
| **Situation** | Förvirring var känslor "hör hemma" |
| **UI-risk** | Medel — för många val |
| **Kognitiv belastning** | Medel |
| **MVP** | En rad per läge i mode picker; default ett spår |

---

### 11. Recovery SOS + Drogfrihet bro

| Fält | Innehåll |
|------|----------|
| **Syfte** | `RecoverySosView` länk till `/vardagen?tab=drogfrihet` utan skuld |
| **Situation** | Urge, F155-återhämtning |
| **UI-risk** | Medel — känslig copy |
| **Kognitiv belastning** | Låg |
| **MVP** | Diskret "Urge-stöd" länk i SOS-modul |

---

### 12. Nutrition diskret logg (redan delvis)

| Fält | Innehåll |
|------|----------|
| **Syfte** | `MabraNutritionQuickLog` — en tap "ätit/nuget" utan makro-stress |
| **Situation** | ADHD glömmer mat; skam kring tracking |
| **UI-risk** | Medel — wellness-vibe om macros prominent |
| **Kognitiv belastning** | Låg i minimal läge |
| **MVP** | Default minimal; macros i "Mer…" |

---

### 13. Rörelse: 2-minuters variant

| Fält | Innehåll |
|------|----------|
| **Syfte** | `movementPrograms` — ultra-kort för rastlöshet (stretches) |
| **Situation** | Rastlös kropp, ingen gym-känsla |
| **UI-risk** | Låg |
| **Kognitiv belastning** | Låg |
| **MVP** | Ett program "Stå upp · 2 min" i akut-kategori |

---

### 14. Utforsk vecka: skip utan skuld (förstärk)

| Fält | Innehåll |
|------|----------|
| **Syfte** | `MabraExplorePanel` — tydlig copy när skip-limit nådd |
| **Situation** | Veckan passar inte |
| **UI-risk** | Låg |
| **Kognitiv belastning** | Minimal |
| **MVP** | "Hoppa över är ok — nytt nästa vecka" |

---

### 15. Vit curriculum: läs-only FACT

| Fält | Innehåll |
|------|----------|
| **Syfte** | `VitCurriculumPanel` — korta kapitel utan quiz-pressure |
| **Situation** | Vill förstå RSD/GAD utan terapi-app |
| **UI-risk** | Medel — för skolfilmig |
| **Kognitiv belastning** | Medel |
| **MVP** | En kollapsbar lektion + valfri övning |

---

### 16. Explicit save-only sessions

| Fält | Innehåll |
|------|----------|
| **Syfte** | `MabraExplicitSavePanel` — inget auto-spar till `mabra_sessions` |
| **Situation** | Integritet, testa övning |
| **UI-risk** | Låg |
| **Kognitiv belastning** | Låg |
| **MVP** | Default ephemeral; spara = explicit knapp |

---

### 17. Vit → Valv evidence (HITL only)

| Fält | Innehåll |
|------|----------|
| **Syfte** | `MabraVitEvidencePrompt` — tydlig "nej default" |
| **Situation** | Sällan behov av bevis från identitetsarbete |
| **UI-risk** | Medel — blanda inte terapi + bevis |
| **Kognitiv belastning** | Medel |
| **MVP** | Collapsed; endast vid användar-initierad "dokumentera" |

---

### 18. Felcopy / offline (RSD-safe)

| Fält | Innehåll |
|------|----------|
| **Syfte** | `getMabraRsdErrorCopy` överallt — inga tekniska fel som personlig rejection |
| **Situation** | Nätverksfel triggar RSD |
| **UI-risk** | Låg |
| **Kognitiv belastning** | Låg |
| **MVP** | Audit alla MåBra error paths |

---

### 19. Morgon/kväll check-in utan påminnelse-skuld

| Fält | Innehåll |
|------|----------|
| **Syfte** | Valfri lokal notis — av default; ingen "missad dag" |
| **Situation** | Struktur utan streak |
| **UI-risk** | **Hög** om streak/påminnelser skuldbelägger |
| **Kognitiv belastning** | Låg om opt-in |
| **MVP** | Inställning av; ingen räknare i UI |

---

### 20. Inkast för MåBra-reflektion → journal

| Fält | Innehåll |
|------|----------|
| **Syfte** | `sourceModule: mabra_inkast` → journal (heuristik finns) |
| **Situation** | Osäker om text ska sparas |
| **UI-risk** | Låg |
| **Kognitiv belastning** | Medel |
| **MVP** | UI "Granska innan spar" i inkast-läge |

---

## Rekommenderad informationsarkitektur (MåBra på sikt)

```
MåBra (/vardagen?tab=mabra)
├── 0. Akut (alltid reachable)
│   ├── SOS / Recovery
│   ├── Andning (2–5 min, optional save)
│   ├── Grounding 5-4-3-2-1
│   └── Dissociation-landning
├── 1. Check-in (default ingång)
│   ├── Humör / energi (1–2 taps)
│   ├── Lågenergi-toggle (global filter)
│   └── Valfritt mikrosteg (bank parafras)
├── 2. Vit (identitet & återhämtning)
│   ├── Projekt: self_esteem · emotional_memory · learn_together · who_am_i
│   ├── Frågekort · parafras coach · känslominne
│   └── Curriculum FACT (read-only)
├── 3. Verktyg (krävlöst)
│   ├── KBT-light · reflektionskort · lekar
│   ├── Rörelse · nutrition (minimal default)
│   └── Utforsk vecka (skip ok)
├── 4. Broar (inte egen terapi)
│   ├── → Dagbok (privat reflektion)
│   ├── → Speglar (konflikt/gaslighting guard)
│   └── → Drogfrihet / SOS (urge)
└── 5. Valv (endast PIN, separat)
    └── mitt_vit · export · read-only historik
```

**Princip:** MåBra = **inåtvänd återhämtning + små steg**. Konflikt → Hamn/Speglar. Bevis → Valv. Fakta → Kunskap (PIN). Ingen silo-läckage.

---

## Komplement till Dagbok · Hamn · Valv

| Zon | MåBra/Vit roll | Gräns |
|-----|----------------|-------|
| **Dagbok** | Bro efter session; samma humör-språk; **inte** dubbel lagring auto | Journal WORM separat; opt-in weave till Kunskap |
| **Hamn/BIFF** | **Redirect** vid ex/konflikt-input; MåBra coach parafras bank only | Ingen BIFF-generering i MåBra |
| **Valv** | Vit export + sällsynt evidence HITL; **inte** terapi i Valv | `mitt_vit` ≠ `reality_vault`; PIN |

**Bästa komplement-idéer:** #8 Speglar-vakt · #9 Dagbok-bro · #4 lågenergi · #1 paralys · #17 Vit≠bevis · #2 bara andas

**Undvik krock:** Konflikt-coaching i vit_chat · auto-promote Vit → Valv · streak på check-in · Kunskap-RAG i coach

---

## Prioriterad MVP-våg

| Våg | Idéer |
|-----|-------|
| **1** | #4 lågenergi hub filter · #7 post-session klart · #6 ett ord räcker · #18 RSD felcopy |
| **2** | #1 paralys · #3 dissociation · #2 bara andas · #5 ett mikrosteg |
| **3** | #12 nutrition minimal · #15 curriculum · #19 opt-in notis · #20 inkast UI |
