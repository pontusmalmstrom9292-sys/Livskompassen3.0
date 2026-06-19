/** Kuraterad kanon för Valv docs-flik (A2.7) — statisk, ingen RAG. */

export const VALV_KANON_ROUTING_MD = `## Vart hamnar det?

När du är osäker: **bevis, barn, ex-sms eller metod?**

| Signal | Zon | Silo |
|--------|-----|------|
| Sms/mejl, tidslinje, mönster | Valv · Arkiv | \`reality_vault\` (WORM) |
| Barnobservation (Kasper/Arvid) | Familjen · Barnfokus | \`children_logs\` |
| Ex-sms → svar | Hamn (BIFF) | ephemeral — spara → Valv |
| Gaslighting / validering | Speglar | Zero Footprint |
| Metod, taktik-fakta | Kunskapsbank | \`kampspar\` |

**Grundregel:** DCAP och routing sker i kod — inte via fri LLM-gissning. Osäkert inkast → **Granska** först.
`;

export const VALV_KANON_SILOS_MD = `## Tre silos (U1)

Kunskap, Valv och Barnen **blandas aldrig** i samma RAG-fråga.

| Silo | Samling | Användning |
|------|---------|------------|
| Kunskap | \`kampspar\`, \`kb_docs\` | Metod, BBIC, taktik-fakta |
| Valv | \`reality_vault\` | Bevis, sms, tidslinje |
| Barnen | \`children_logs\` | Observerbart om barnen |

**MUST NOT:** fjärde silo · cross-read för bekvämlighet · auto-promote barnlogg → Valv.
`;

export const VALV_KANON_WORM_MD = `## WORM & bevis

Append-only: \`reality_vault\`, \`children_logs\`, \`journal\`, \`dossier_snapshots\`.

- **Beteende + datum** — aldrig diagnosetikett på motpart i poster eller dossier.
- Server-tidsstämpel på bevis; ingen \`updatedAt\` / \`deletedAt\` på WORM-poster.
- Spara till Valv sker **manuellt** (t.ex. \`SaveAsEvidencePrompt\`) — aldrig automatiskt från barnlogg.
`;

export const VALV_KANON_DOMAIN_MD = `## Domän — covert HCF

~80% av inkast förväntas gälla bevis eller teorier kring högkonflikt medföräldraskap och **covert** dynamik (offerroll, gaslighting, DARVO, triangulering, tyst straff).

| Behov | Modul |
|-------|-------|
| Ex-sms → svar | Hamn (BIFF, Grey Rock) |
| Validera gaslighting | Speglar |
| Bevis, mönster, dossier | Valv |
| Barnobservation | Familjen Barnfokus |
| Metod/fakta | Kunskapsbank (PIN) |

**MUST NOT:** «narcissist» i WORM · BIFF-coaching i Kunskap RAG · PA-autodiagnos i Barnen.
`;

export const VALV_KANON_CONTENT_MD = `## Innehåll (U6)

| Klass | Zon | Exempel |
|-------|-----|---------|
| FACT | Kunskap | \`cn-*\`, \`bh-*\` taktik-kort |
| REFLECTION / PLAY | MåBra / Vit | frågekort, lek |
| EVIDENCE | Valv / Barnen | bevis, observationer |

Prod-coach parafrasar bank med \`bankId\` — inga nya FACT-kort utan godkänd content-bank.
`;
