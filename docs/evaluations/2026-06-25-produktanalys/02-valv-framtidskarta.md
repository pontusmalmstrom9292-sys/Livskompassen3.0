# Prompt 2 — Framtidskarta för Valvet

**Datum:** 2026-06-25  
**Plattform:** Cursor (Composer)  
**Typ:** Analys — inga kodändringar  
**Scope:** Verklighetsvalvet / `reality_vault`, Valv-Chat, Mönster/Orkester, Dossier, bevisflöden, export, forensik, HITL, Zero Footprint, plausible deniability

---

## Nuläge (kort)

Valvet är en **egen route-silo** (`/valvet`) med PIN + server-session (`vaultSessionGate`, JWT claims, 1 h idle / 4 h max). Zoner i TabBar:

| Zon | Flikar | Syfte |
|-----|--------|-------|
| **Samla** | `logga`, `sok` | WORM-inmatning + sök/RAG-chat |
| **Analysera** | `monster`, `orkester` | Locked UX — frekvens + agenter |
| **Kunskap** | `kunskapsbank`, `aktorskarta`, `docs` | FACT bakom PIN (plausible deniability) |
| **Vit** | `mitt_vit` | Utvecklingszon, separat från bevis-WORM |
| **Exportera** | `dossier` | Wizard → PDF + `dossier_snapshots` WORM |
| **Forensik** | `hamn_analys`, `speglar_fordjupat`, m.fl. | Säkra analysytor (PIN redan upplåst) |

**Backend:** `reality_vault` append-only · `pattern_scan_metadata` som sidecar (muterar aldrig beviskropp) · `worm_hash_chain` · `generateDossierInternal` · `valvChatQuery` via `vaultRag.ts` · DCAP/heuristik före LLM vid inkast.

**HITL:** `WeaverPendingVaultBanner`, `SaveAsEvidencePrompt` (Barnporten/Familjen), inkast `review`-routing.

---

## 15 framtida förbättringar

### 1. Beviskort med källkedja

| Lager | Värde |
|-------|-------|
| Användare | Ser direkt *varifrån* posten kom (manuell, inkast, Hamn, widget, Barnporten HITL) |
| Bevis | Spårbar ingest-väg + server-tidsstämpel synlig per post |
| Säkerhet | Transparens utan att exponera Valv i publikt läge |

**Problem:** Poster i `logga`/`sok` visar ofta bara text — källan är gömd i metadata.

**Användningsfall:** "Det här sms:et sparades via Inkast 2026-03-12"; "Barnporten → Granska i Valv med `sourceRef`".

**Arkitektur:** Läser befintliga fält (`sourceRef`, `channel`, `sourceModule`) i `VaultLogList` / normalisering — ingen ny collection.

**Kräver:** UI only (ev. liten read-helper). Ingen ny rule.

**Risker:** Låg — metadata redan i WORM.

**Får inte brytas:** WORM oföränderlig; inga nya client-writes; ingen cross-silo-data i kortet.

---

### 2. Hash-kedja verifiering i Exportera

| Lager | Värde |
|-------|-------|
| Användare | "Bevisen har inte manipulerats" — konkret knapp |
| Bevis | `wormHashChain.ts` blir användbar för advokat/soc |
| Säkerhet | Stärker tillit till export utan att öppna ny attackyta |

**Problem:** Hash-kedja finns i backend men saknar användar-facing verifiering.

**Användningsfall:** Innan dossier-export: "Verifiera integritet för valda 24 poster"; bifoga verifieringsrapport i exportpaket.

**Arkitektur:** Ny panel i `ValvExporteraZone` / Dossier wizard steg `review`; anropar befintlig chain-logik.

**Kräver:** Ny callable `verifyWormHashChain` (read-only) · UI i exportera-zon · ev. rule: read `worm_hash_chain` endast för ägare.

**Risker:** Medel — felaktig "grön" status vid partial chain måste undvikas.

**Får inte brytas:** Read-only; hash beräknas server-side; WORM-poster får aldrig uppdateras vid verify.

---

### 3. Enhetlig HITL-kö i Samla (Granska-läge)

| Lager | Värde |
|-------|-------|
| Användare | Ett ställe för allt som väntar: Inkast review, Vävaren, Barnporten |
| Bevis | Inget faller mellan stolar före WORM |
| Säkerhet | Trauma/LVU alltid manuell — DCAP-gate synlig |

**Problem:** HITL är utspritt (`WeaverPendingVaultBanner`, inkast-kö, `SaveAsEvidencePrompt` per modul).

**Användningsfall:** Öppna Valv → Granska visar 3 väntande poster med confidence + rationale; godkänn/avvisa en i taget.

**Arkitektur:** Utökar `ValvInputSuperModule` granska-läge + `ValvSamlaZone`; konsumerar `inbox_queue`, weaver pending, ev. barnporten-bridge.

**Kräver:** UI-zon (befintlig granska) · ev. callable `listPendingValvReview` · inga rule-ändringar om queries redan ägare-scopade.

**Risker:** Medel — fel routing vid batch-godkännande.

**Får inte brytas:** DCAP före LLM; trauma/LVU kan inte auto-godkännas; barnen kräver explicit HITL.

---

### 4. Mönster → Samla filter (förstärkt handoff)

| Lager | Värde |
|-------|-------|
| Användare | Klick på DARVO-rad → filtrerat arkiv direkt |
| Bevis | Snabbare hitta relevanta poster inför dossier |
| Säkerhet | Filter sker inom Valv-silo only |

**Problem:** Handoff finns (`onTechniqueSelect`) men kan fördjupas med tidsperiod och antal.

**Användningsfall:** "Visa alla poster med GASLIGHTING senaste 6 månaderna" → Samla-lista.

**Arkitektur:** `VaultMonsterPanel` + `pattern_scan_metadata` + `VaultLogList` filter — redan delvis wired.

**Kräver:** UI only (+ ev. query-index på metadata).

**Risker:** Låg.

**Får inte brytas:** `pattern_scan_metadata` muterar aldrig `reality_vault`; locked UX Mönster-panel kvar.

---

### 5. Mönster → Dossier förfyllning

| Lager | Värde |
|-------|-------|
| Användare | "Skapa dossier från denna teknik" — ett steg |
| Bevis | `techniqueFilter` i Dossier redan stöds |
| Säkerhet | Användaren granskar fortfarande varje doc i wizard |

**Problem:** Dossier wizard och Mönster är separata mentala modeller.

**Användningsfall:** Frekvensrapport visar 12 DARVO-poster → "Öppna i Dossier" med filter + period förfyllt.

**Arkitektur:** Deep link `/valvet?vaultTab=dossier&technique=DARVO&from=...` · `dossierCandidates.ts` filter.

**Kräver:** UI + URL-param · ingen ny callable.

**Risker:** Låg–medel — journal default av (bra; behåll varning).

**Får inte brytas:** Dossier max-dokument-gräns; användaren måste explicit välja includedDocIds.

---

### 6. Enkelpost export med metadata-blatt

| Lager | Värde |
|-------|-------|
| Användare | Skriv ut / PDF en post utan hela dossier |
| Bevis | `exportVaultRecord.ts` + server-tid + doc-id + hash-referens |
| Säkerhet | XSS-säker export (`secureExport`) redan mönster |

**Problem:** Snabb export av enstaka sms/bevis saknar forensiskt omslag.

**Användningsfall:** Advokat vill ha *ett* meddelande med metadata-sida.

**Arkitektur:** Utökar `exportVaultRecord` / print-flöde i `VaultLogList`.

**Kräver:** UI only · ev. liten callable för hash-ref lookup.

**Risker:** Låg.

**Får inte brytas:** Escape all user content; ingen export utan Valv unlock.

---

### 7. Valv-Chat med förbättrade citat & begränsningar

| Lager | Värde |
|-------|-------|
| Användare | Förstår *vilken* post AI citerar; kan hoppa till original |
| Bevis | Citat kopplade till `sourceRef` — granskbara |
| Säkerhet | RAG strictly `vaultRag.ts`; inga hallucinerade bevis |

**Problem:** Chat utan tydlig källnavigering minskar forensiskt förtroende.

**Användningsfall:** "När sa hen X?" → citat + länk till post i Samla.

**Arkitektur:** `ValvChatPanel` + `ValvChatCitation` · befintlig `valvChatQuery`.

**Kräver:** UI · ev. prompt-tuning i `sharedRules.ts` (PMIR).

**Risker:** Medel — prompt-ändring kräver PMIR; hallucination om citat saknas.

**Får inte brytas:** Endast Valv-silo RAG; Zero Footprint vid session end; ingen cross-RAG.

---

### 8. DCAP-alert panel med åtgärdslogg

| Lager | Värde |
|-------|-------|
| Användare | Ser eskalerande mönster utan att jaga i sms |
| Bevis | `dcap_alerts` WORM + länk till källpost |
| Säkerhet | Alerts genereras via synapse, inte LLM-auth |

**Problem:** `VaultDcapAlertsPanel` / `useDcapAlerts` kan bli mer handlingsorienterad.

**Användningsfall:** Ny alert "JADE_BAIT x3 denna vecka" → öppna poster → "Lägg till i Dossier-utkast".

**Arkitektur:** `dcap_alert`-synapse + befintlig panel; handoff till Dossier (idé 5).

**Kräver:** UI · ev. read-index · ingen ny WORM-typ.

**Risker:** Medel — alert-trötthet; håll lågaffektiv copy.

**Får inte brytas:** `dcap_alerts` append-only; diagnos-etiketter förbjudna.

---

### 9. SMS-tråd vy i Samla

| Lager | Värde |
|-------|-------|
| Användare | Konversationer grupperade som trådar, inte flat lista |
| Bevis | Tidsordning och kontext bevarad för myndighet |
| Säkerhet | Parsing lokalt/server deterministiskt (`smsThreadParse.ts`) |

**Problem:** Många sms-poster blir oöverskådliga i flat logg.

**Användningsfall:** Importera tråd → grupperad vy → exportera tråd-segment i Dossier.

**Arkitektur:** Read-only gruppering ovanpå `reality_vault`; ev. metadata-sidecar för tråd-id (append-only).

**Kräver:** UI · ev. sidecar collection (append-only) · ingen rule om endast read.

**Risker:** Medel — fel gruppering; kräver manuell merge/split HITL.

**Får inte brytas:** WORM-poster splits/merge får inte mutera original; endast metadata-sidecar.

---

### 10. Aktörskarta ↔ bevislänk

| Lager | Värde |
|-------|-------|
| Användare | Se alla poster kopplade till en aktör (ex, soc, BUP) |
| Bevis | Strukturerad aktörslogg för dossier |
| Säkerhet | Manuell aktörskarta (G9) — ingen auto-profilering av motpart |

**Problem:** `VaultAktorskartaPanel` och bevisposter är svagt kopplade.

**Användningsfall:** Välj aktör "Medförälder" → filtrera Valv-poster taggade med entityId.

**Arkitektur:** `addEntityProfile` + valfritt `entityRef` på nya poster (append-only nyckel).

**Kräver:** Ev. utökad WORM-nyckel (PMIR + rules) · UI filter · migration endast forward.

**Risker:** Hög om auto-tagging — **måste vara manuell/HITL**.

**Får inte brytas:** Aldrig auto-diagnos på motpart; entity = beteende + roll, inte etikett.

---

### 11. Dossier exportpaket v2 (PDF + manifest + hash)

| Lager | Värde |
|-------|-------|
| Användare | En zip: PDF, innehållsförteckning, hash-lista |
| Bevis | `documentHash`, `dossierCanonicalHash`, chain-ref per bilaga |
| Säkerhet | Export sker server-side; signed URL tidsbegränsad |

**Problem:** Nuvarande dossier = PDF; ombud vill ha verifierbar manifest-fil.

**Användningsfall:** Soc begär period 2025-01—2025-06 → zip med PDF + `manifest.json` + hash-rapport.

**Arkitektur:** Utökar `generateDossierInternal`, `dossierPdf`, Storage path `dossier_exports/`.

**Kräver:** Callable utökning · Storage rule (ägare read) · UI download-knapp.

**Risker:** Hög (juridik, PMIR för exportformat).

**Får inte brytas:** `dossier_snapshots` WORM; AI-försätt utanför documentHash (redan så); journal-default av.

---

### 12. Forensik-zon guidad ingress

| Lager | Värde |
|-------|-------|
| Användare | Förstår skillnad Hamn-analys vs Speglar fördjupat vs Dagbok-arkiv |
| Bevis | Rätt verktyg → rätt typ av underlag |
| Säkerhet | Forensik fortfarande bakom samma PIN; Zero Footprint i Speglar-variant |

**Problem:** Sex forensic tabs utan tydlig "när använder jag vad?".

**Användningsfall:** Första besök → ett steg ingress → rekommenderad tab baserat på behov (sms / barn / ekonomi).

**Arkitektur:** `ValvForensikZone` + `FORENSIC_TAB_INGRESS` copy · progressive disclosure.

**Kräver:** UI + copy only.

**Risker:** Låg.

**Får inte brytas:** Speglar forensic = Zero Footprint; Hamn forensic ≠ publik Hamn.

---

### 13. Synlig Valv-session nedräkning + snabblås

| Lager | Värde |
|-------|-------|
| Användare | Ser när session går ut; ett tryck låser |
| Bevis | — |
| Säkerhet | Plausible deniability; `VaultCountdown` + `revokeVaultSession` |

**Problem:** 1 h idle är osynlig — användaren glömmer att låsa.

**Användningsfall:** Lämnar telefon → auto-blur 30 s → full låsning; manuell "Lås Valv nu".

**Arkitektur:** `VaultCountdown`, `vaultSessionGate`, client `clearSynapseState`.

**Kräver:** UI · ev. kortare client idle (ej rule-ändring).

**Risker:** Medel UX — för aggressiv blur irriterar.

**Får inte brytas:** Drawer Valv-sektion försvinner vid lås; JWT claims rensas.

---

### 14. Vävaren → Valv promote-flöde (förtydligat)

| Lager | Värde |
|-------|-------|
| Användare | Tydlig väg från dagbok till bevis *med* godkännande |
| Bevis | Endast godkänd journal-text promote:as |
| Säkerhet | HITL; ingen auto-promote |

**Problem:** `WeaverPendingVaultBanner` finns men flödet kan tydliggöras med steg-för-steg.

**Användningsfall:** Vävaren föreslår Valv-promote → banner i Samla → granska diff → godkänn → ny `reality_vault`-post med `sourceRef` till journal.

**Arkitektur:** `weaverApprovalService`, `journal_woven`-synapse, banner i `ValvSamlaZone`.

**Kräver:** UI polish · befintlig callable pipeline.

**Risker:** Medel — accidental promote av emotionell dagbok.

**Får inte brytas:** Journal och Valv är separata WORM; promote = ny post, aldrig update; användaren måste confirm.

---

### 15. Read-only ombudslänk (tidsbegränsad export)

| Lager | Värde |
|-------|-------|
| Användare | Delar dossier med advokat utan konto |
| Bevis | Signerad URL + expiry + access-log |
| Säkerhet | Ingen Valv-PIN delning; endast pre-genererad snapshot |

**Problem:** Export sker idag som download till ägaren — extern delning är manuell/e-post.

**Användningsfall:** Generera dossier → "Skapa ombudslänk 7 dagar" → advokat läser PDF, ingen inloggning.

**Arkitektur:** `dossier_snapshots` + Storage signed URL · ny callable `issueDossierShareLink` · audit log append-only.

**Kräver:** Ny callable · Storage rules · PMIR · ev. ny `dossier_share_tokens` (TTL).

**Risker:** Hög — läckage, för lång TTL, screenshot-forwarding (acceptabel residual risk).

**Får inte brytas:** Länk ger aldrig Valv-access eller live RAG; endast frozen snapshot; Pontus kan revoke.

---

## Rekommenderad roadmap

### Våg 1 — Låg risk (1–4 veckor, mest UI/read)

| Prioritet | Idé | Varför först |
|-----------|-----|--------------|
| 1 | **Beviskort med källkedja** (#1) | Minimal insats, stor tydlighet |
| 2 | **Mönster → Samla filter** (#4) | Bygger på locked UX, redan delvis finns |
| 3 | **Forensik guidad ingress** (#12) | Minskar kognitiv belastning |
| 4 | **Synlig session nedräkning** (#13) | Zero Footprint i praktiken |
| 5 | **Inkast routing-förklaring i HITL** (del av #3) | Tillit utan ny AI |

**Leverans:** UI-only + read-callables · `smoke:valv-security`, `smoke:locked-ux`, `smoke:plausible-deniability`.

---

### Våg 2 — Hög nytta (1–3 månader)

| Prioritet | Idé | Varför |
|-----------|-----|--------|
| 1 | **Enhetlig HITL-kö i Samla** (#3) | Kärnflöde för all ingest |
| 2 | **Mönster → Dossier förfyllning** (#5) | Kopplar Analysera → Exportera |
| 3 | **Valv-Chat citat** (#7) | Dagligt sökbehov i Valv |
| 4 | **DCAP-alert handoff** (#8) | Proaktiv utan skrikig UI |
| 5 | **Enkelpost export m. metadata** (#6) | Advokat-vardag |
| 6 | **Vävaren promote förtydligat** (#14) | Dagbok → bevis säkert |

**Leverans:** Utökade callables (read-mostly) · ev. sidecar metadata · PMIR om `sharedRules.ts` ändras.

---

### Våg 3 — Avancerad framtid (3–6+ månader, PMIR-tung)

| Prioritet | Idé | Varför sist |
|-----------|-----|-------------|
| 1 | **Hash-kedja verifiering** (#2) | Kräver robust verify-callable + juridisk copy |
| 2 | **Dossier exportpaket v2** (#11) | PMIR exportformat; advokat-validated mall |
| 3 | **SMS-tråd vy** (#9) | Sidecar + HITL merge |
| 4 | **Aktörskarta ↔ bevis** (#10) | WORM-nyckel PMIR; endast manuell tagg |
| 5 | **Read-only ombudslänk** (#15) | Hög säkerhetsyta; separat hot model |

**Leverans:** Rules + callables + YOLO full gate · juridisk granskning av exportmall.

---

## Sammanfattning per värdelager

| Värdelager | Starkast i våg |
|------------|----------------|
| **Användarvärde** | 1, 3, 4, 7, 12, 13 |
| **Juridiskt/bevismässigt** | 2, 5, 6, 9, 11, 15 |
| **Säkerhet/integritet** | 3, 13, 14, 15 (+ alltid: PIN, session gate, plausible deniability) |

## Absoluta invariants (alla vågor)

- `reality_vault` append-only — ingen client update/delete
- Tre silos — `valvChatQuery` / `vaultRag.ts` only; ingen cross-RAG
- DCAP/heuristik före LLM för routing och trauma-gate
- Aldrig auto-promote barnlogg → Valv (Barnporten HITL)
- Beteende + datum i bevis — aldrig diagnos-etikett på motpart
- Kunskapsbank/Aktörskarta endast bakom PIN (drawer plausible deniability)
- Locked UX: Mönster + Orkester tabs får inte tas bort eller kollapsas
- Zero Footprint: session/synapse/draft rensas vid lås/panic
- PMIR före: `firestore.rules`, exportformat, `sharedRules.ts`, share-links
