# Genomgång: Fas 2 - Agent Engine & RAG

Jag har slutfört den andra fasen av systemplanen, vilket etablerar intelligensen och datahämtningen för Livskompassen v2.

## 1. Vektorindexering (RAG)
> [!IMPORTANT]
> Vector Search 2.0 (via `textembedding-gecko`) används för att omvandla "Kampspår" till sökbara vektorer (RAG). Detta minskar risken för hallucinationer från LLM:en, då svar måste grunda sig i dokumenterade bevis.

Jag skapade ett konfigurationsskript:
- **`scripts/setup_vector_search.sh`**: Innehåller nödvändiga `gcloud`-kommandon för att skapa ett Approximate Nearest Neighbor (ANN)-index, en endpoint och distribuera detta i Google Cloud för blixtsnabba RAG-uppslag.

## 2. A2A-orkestrering & Kompis Supervisor
> [!NOTE]
> Systemet använder Agent2Agent (A2A)-protokollet för att isolera kontext och bevara integritet (Gatekeeper-principen).

Följande logik byggdes upp i backend-miljön (`functions/src/agents/`):
- **`types.ts`**: Typdefinitioner för AgentCards, AgentMetadata, Data Access Policies, och A2A-meddelandestrukturen.
- **`cards/index.ts`**: Definition av våra Worker Agents. Jag har skapat "AgentCards" för **Livs-Arkivarien** (hanterar sökningar i Kampspår) och **Gräns-Arkitekten** (specialist på manipulativa mönster och BIFF/Grey Rock).
- **`kompis-supervisor.ts`**: Huvud-orkestratorn (Kompis). Den analyserar användarens avsikt och delegerar via A2A till rätt sub-agent. Exempelvis kan den detektera manipulativa sökord ("ex", "manipulation") och ruttar då direkt till Gräns-Arkitekten för krishantering istället för att bara returnera data.

## 3. Status
`system_plan.md` är uppdaterad med slutförd Fas 2:
```diff
- [ ] Interaktivt Tidshjul (TimeWheel)
- [ ] Verklighetsvalvets UI
- [x] Fas 1 (Steg 1.1 & 1.2): Grundläggande Infrastruktur (CMEK-skript) & Säkerhet (WebAuthn/Passkeys UI+Hooks)
+- [x] Fas 2 (Steg 2.1 & 2.2): Agent Engine & RAG (Vector Search, A2A Orkestrering, Kompis Supervisor)
```

När du känner dig redo, så kan vi påbörja den avslutande fasen, **Fas 3: Analys och Proaktivt Skydd** (DCAP-implementering och Context Caching). Låt mig veta!

---

# Genomgång: Fas 3 - Analys och Proaktivt Skydd

**Alla tre faser i Livskompassen v2.0 är nu slutförda!** 🧭

## 1. DCAP - Digital Conversation Analysis Pipeline
`functions/src/agents/DCAP.ts` — Hybrid Regex + Vertex AI (Gemini Flash) pipeline:
- **Lager 1 (Regex):** Deterministisk skanning för DARVO, gaslighting, hot, JADE-bete och love-bombing på svenska.
- **Lager 2 (Semantisk):** Kontextuell AI-analys för implicita mönster som inte fångas av Regex.
- **Utdata:** `DcapResult` med `riskScore` (0–100), `detections`, `greyRockResponse` och `recommendedAction`.

## 2. GDPR Retention Job
`functions/src/jobs/retentionJob.ts` — Cloud Run Job som körs via Cloud Scheduler:
- Raderar Firestore-dokument äldre än 90 dagar (konfigurerbart).
- Raderar tillhörande vektorer från Vector Search — kryptografisk rensning. **High privacy by default.**

## 3. Context Cache Manager
`functions/src/lib/vertexCache.ts` — Vertex AI Context Caching:
- Sparar förberäknade systemkontext-tokens (RAG + systemprompt) i max 1h TTL.
- Minskar dramatiskt token-kostnader vid tunga DCAP-analyser.
- `invalidateCache()` kopplas till Kill Switch/Zero Footprint-funktionen.

## Fullständig Arkitekturmatris

| Lager | Teknologi | Fil |
|---|---|---|
| Auth (Biometri) | WebAuthn Passkeys | `src/lib/auth/webauthn.ts` |
| Kryptering | CMEK via Cloud KMS | `scripts/setup_gcp_cmek.sh` |
| RAG-index | Vertex AI Vector Search 2.0 | `scripts/setup_vector_search.sh` |
| Agent-orkestrering | A2A + Kompis Supervisor | `functions/src/agents/kompis-supervisor.ts` |
| Psykologiskt skydd | DCAP (Regex + Gemini) | `functions/src/agents/DCAP.ts` |
| GDPR Rensning | Cloud Run Job | `functions/src/jobs/retentionJob.ts` |
| Kostnadsoptimering | Vertex AI Context Cache | `functions/src/lib/vertexCache.ts` |

