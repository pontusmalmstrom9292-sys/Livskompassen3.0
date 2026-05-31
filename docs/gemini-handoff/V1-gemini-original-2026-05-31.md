# Livskompassen v2 — Systeminitialisering och V1 Valv-zonering

**Källa:** Gemini (Google AI Pro) — klistrat in av användare 2026-05-31  
**Status:** Original bevarat ordagrant · Cursor-integration: se [`V1-valv-gemini-svar.md`](./V1-valv-gemini-svar.md)

Detta dokument sammanställer den fastställda grundarkitekturen, den visuella layouten samt den fullständiga specifikationen för V1 — Valv zon-navigation för Livskompassen v2 (Life OS, ADHD/RSD-säker UX).

---

## 1. Initialisering & Visuell Layout

Grundarkitekturen är uppbyggd kring tre fysiologiskt trygga, kognitivt avlastande och strikt isolerade datasilor för att förhindra cross-contamination och RSD-triggers.

| Silo | Collection / route | Innehåll |
|------|-------------------|----------|
| **Kunskap** | `kampspar` / `kb_docs` | Strategier, manualer och kognitiva verktyg |
| **Valv** | `reality_vault` | Objektiv loggning, tidslinjer och sms-analyser |
| **Barnen** | `children_logs` | Fokus på barnens mående, logistik och rollen som den trygga hamnen |

### K1 / K3 Ny Kompass- & Valvskrom (SVG-kod)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 120" width="100%" height="100" style="background: #020617; border-radius: 12px; padding: 10px;">
  <rect x="10" y="10" width="780" height="100" rx="24" fill="#0f172a" fill-opacity="0.7" stroke="#1e293b" stroke-width="1.5" />
  <g transform="translate(60, 35)">
    <circle cx="25" cy="25" r="22" fill="#d4af37" fill-opacity="0.15" stroke="#d4af37" stroke-width="2" />
    <path d="M25 12 L29 21 L38 25 L29 29 L25 38 L21 29 L12 25 L21 21 Z" fill="#d4af37" />
    <text x="60" y="30" fill="#d4af37" font-family="sans-serif" font-weight="600" font-size="14">Morgon</text>
  </g>
  <g transform="translate(320, 35)">
    <rect x="5" y="6" width="40" height="36" rx="8" fill="none" stroke="#475569" stroke-width="2" />
    <circle cx="25" cy="24" r="6" fill="none" stroke="#475569" stroke-width="2" />
    <path d="M25 30 L25 36" stroke="#475569" stroke-width="2" stroke-linecap="round" />
    <text x="60" y="30" fill="#94a3b8" font-family="sans-serif" font-weight="500" font-size="14">Valvet</text>
  </g>
  <g transform="translate(560, 35)">
    <path d="M12 38 C12 28, 38 28, 38 38 M25 24 A 6 6 0 1 0 25 12 A 6 6 0 1 0 25 24 Z" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" />
    <text x="60" y="30" fill="#a7f3d0" font-family="sans-serif" font-weight="500" font-size="14">Trygg Hamn</text>
  </g>
</svg>
```

---

## 2. SPEC: V1 — Valv zon-navigation & Wireframe

För att eliminera kognitiv överbelastning och hypervigilans i stunder av hög stress tillämpas principen för **Progressive Disclosure** strikt. Gränssnittet visar max **5 fasta huvudzoner** på den översta tab-raden.

### ASCII Wireframe: VaultPage Layout

```
+-----------------------------------------------------------------------------------------------------+
|  [D1 LivskompassMark]  Valv · Samla · Arkiv                                              [X Stäng]  |
+-----------------------------------------------------------------------------------------------------+
|                                                                                                     |
|  ZON-NAVIGERING (Max 5 parallella flikar synliga)                                                    |
|  +-------------------+  +---------------+  +---------------+  +---------------+  +---------------+  |
|  |  * 1. SAMLA * |  |  2.ANALYSERA  |  |   3.KUNSKAP   |  |  4.EXPORTERA  |  |  5.FORENSIK   |  |
|  |  (Aktiv: Gold)    |  |  (Slate-700)  |  |  (Slate-700)  |  |  (Slate-700)  |  |  (Slate-700)  |  |
|  +-------------------+  +---------------+  +---------------+  +---------------+  +---------------+  |
|  Ingress: "Samla in bevis och sök i loggen."                                                         |
|                                                                                                     |
|  SUB-FLIKAR (Dynamiska för aktiv zon)                                                               |
|  [ * Arkiv (logga) * ]   [ Triage (sok) ]                                                           |
|                                                                                                     |
|  -------------------------------------------------------------------------------------------------  |
|  AKTIV PRÄSENTERAD FOCUS-VY (Max ett primärsteg/kort öppet samtidigt)                               |
|                                                                                                     |
|  +-----------------------------------------------------------------------------------------------+  |
|  |  [Inbox] Inkast-Kompakt                                                                        |  |
|  |  Sms, mejl eller fil -> rätt silo. Sorteras via backend sharedRules.ts                         |  |
|  +-----------------------------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------------------------+
```

### Zonernas komponentmappning

| Zon | Underflikar | Komponenter (kod) |
|-----|-------------|-------------------|
| **Samla** | `logga`, `sok` | `VaultInkastCompact`, `VaultSamlaDriveHint`, `VaultLogList` · `ValvChatPanel` via Sannings-Analytikern |
| **Analysera** (LÅST UX) | `monster`, `orkester` | `VaultMonsterPanel` (deterministiska regex-mönster) · `VaultOrkesterPanel` |
| **Kunskap** | `kunskapsbank`, `aktorskarta` | `VaultKunskapsbankPanel` (RAG mot `kb_docs`) · `VaultAktorskartaPanel` (G9-aktörsprofiler) |
| **Exportera** | `dossier` | `DossierPage` (periodisk och krypterad export) |
| **Forensik** | `hamn_analys`, `speglar_fordjupat`, `dagbok_arkiv`, `familjen_monster`, `arbetsliv_franvaro`, `arbetsliv_lon` | `VaultForensicPanel` m.fl. |

---

## 3. Handoff-Copy & Dirigeringsregler (Hamn vs Valv)

| Situation / Användarkontext | Destination i UI | Mål-copy & Gränssnittsbeteende |
|-----------------------------|------------------|--------------------------------|
| Mottagit aggressivt meddelande, behöver omedelbart neutralt svar | Public Route: `/hamn` | Ingen PIN-gate. Visar `BiffPublicPanel`. Copyn betonar snabb avlastning: *«Skriv eller klistra in för att skala bort känslomässiga beten.»* |
| Genererat ett BIFF-svar på `/hamn` och vill spara originalmeddelandet som bevis | Valv-zon: **Samla** (`logga`) | PIN-gate triggas. Skickas via en HITL-bro (Human-In-The-Loop) till bevisvalvet. *«Låser upp Verklighetsvalvet för permanent WORM-lagring.»* |
| Upplever desorientering (gaslighting) och vill undersöka mönster | Valv-zon: **Analysera** (`monster`) | PIN-gate triggas. Öppnar `VaultMonsterPanel`. *«Deterministisk skanning av dina sparade dokument. Inga gissningar eller generativa AI-hittepå.»* |
| Klickar på fliken «Analys/Triage» inifrån den publika `/hamn`-sidan | Valv-zon: **Forensik** (`hamn_analys`) | Automatisk Redirect + PIN-gate. Sidan `/hamn?tab=analys` flyttar användaren till `VaultForensicPanel`. *«Djupare mönsteranalys kräver en skyddad forensisk miljö.»* |

**MUST NOT:** kräva PIN för första Grey Rock på `/hamn` · ta bort Mönster/Orkester · cross-RAG mellan silos.

---

## 4. Vävaren Polish: Granskningstabell

| Gränssnittselement | Status | Arkitektonisk motivering & Systempåverkan |
|--------------------|--------|-------------------------------------------|
| 1 rad dämpad ingress per zon (`VALV_ZONE_INGRESS`) | **KEEP** | Minskar kognitiv trötthet genom att ge en lågaffektiv förklaring av zonens syfte under ångest. |
| Fasta och synkade brödsmulor (`VaultValvBreadcrumb`) | **KEEP** | Kritisk somatosensorisk och kognitiv förankring. Användaren ser exakt var de befinner sig. |
| Tomma tillstånd (`EmptyState`) med handlingsknappar | **KEEP** | Undviker tomma skärmar som kan trigga stress. Ger en lugn riktning för nästa mikrosteg. |
| AI-driven automatisk taggning av bevis vid inmatning | **REJECT** | Strikt förbjudet. Ingen LLM-kod eller AI får modifiera beviskroppen automatiskt. Isoleras till `weaverTags` / `vävaren_metadata`. |
| Visuella framstegsbarrar med procentuell färdigställning | **REJECT** | Skapar prestandastress och påtvingade kravkänslor (RSD-sårbarhet). Ersätts med neutrala textsteg. |

---

## 5. Gap-Analys: Nuvarande Kodstatus vs Nästa Utvecklingssteg

| Nuvarande fil i källkod | Identifierat glapp / saknad logik | Specifikt och avgränsat nästa steg i Cursor |
|-------------------------|-----------------------------------|---------------------------------------------|
| `src/modules/evidence/vault/components/VaultPage.tsx` | Hanterar zon-byten i tillståndet, men döljer inte icke-aktiva zoner helt från DOM:en. | Refaktorera render-blocken så att underflikarna kapslas in i villkorsstyrda block baserade på gällande `valvZone`. |
| `src/modules/core/navigation/navTruth.ts` | `NAV_TRUTH`-registret saknar exakta `drawerHint`-strängar från `M2-valv-drawer-copy.md`. | Uppdatera fälten för `valv_grp_kunskap` och `valv_grp_forensik` med exakt copy från handoff-matrisen. |
| `src/modules/evidence/vault/dossier/components/DossierPage.tsx` | Rapportstrukturen BBIC är hårdkodat inaktiverad (`disabled`). | Lås upp alternativet BBIC i gränssnittets select-box och säkerställ korrekt datamappning mot Cloud Function. |
| `src/modules/evidence/vault/components/VaultEntryForm.tsx` | Uppdelningen av sms-trådar saknar en direkt handoff-notis/bekräftelse till användaren. | Lägg till en kort, dämpad guld-bekräftelse under textfälten när tråden har delats upp deterministiskt. |

---

## Cursor — integrationsstatus (2026-05-31)

| Gap / KEEP | Cursor |
|------------|--------|
| `VALV_ZONE_INGRESS` + zon-tabs | **Integrerad** |
| Villkorsstyrd `valvZone`-render | **Integrerad** (redan i kod) |
| M2 hints kunskap/forensik | **Integrerad** |
| SMS-tråd bekräftelse | **Integrerad** |
| BBIC select | **Integrerad** |
| Vävaren godkännande (HITL) | **Integrerad** — `weaver_pending` + `approveWeaverMetadata` |
| AI auto-taggning beviskropp | **REJECT** — ej implementerat |
| Progress bars / % | **REJECT** — ej implementerat |

Se även: [`V1-valv-zone-wireframe.md`](./V1-valv-zone-wireframe.md) · [`V1-valv-gemini-svar.md`](./V1-valv-gemini-svar.md) · [`M2-valv-drawer-copy.md`](./M2-valv-drawer-copy.md)
