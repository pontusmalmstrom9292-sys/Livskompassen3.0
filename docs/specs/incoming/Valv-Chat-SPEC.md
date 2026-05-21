# Valv-Chat-SPEC

Källa: extern planerings-AI + Kladd 2026-05-21. Konsoliderad till `.context/modules/valv_chatt.md`.

**Kladd-master:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](./Kladd-2026-05-21-PERSONAL-MASTER.md) §F, §G, §I.3.

## 1. Syfte och användarbehov

Forensiskt sökverktyg **inuti Verklighetsvalvet** — ställ frågor mot din egen WORM-historik (`reality_vault`) för att snabbt motverka gaslighting. Kalla, objektiva fakta med källhänvisningar. **Ingen** sparad chatt (Zero Footprint).

**Inte samma som `/kunskap`:** Kunskapsvalvet (Kampspår/Drive/RAG) är bredare livs-OS-navigering. Valv-Chat läser **endast** användarens `reality_vault`-bevis (exkl. `vävaren_metadata` som standard).

## 2. Route och ingång

- **Route idag:** flik **Sök** i `/dagbok?tab=bevis` efter PIN (`VaultPage` → `ValvChatPanel`)
- **Route valfri senare:** `/valv/chat` (egen route — ej MVP)
- **Ingång:** endast från upplåst valv — **ingen** dock-ikon

## 3. UX-flöde (Progressive Disclosure)

1. **Fråga** — ett inmatningsfält
2. **Laddning** — diskret indigo pulserande linje
3. **Svar + källor** — kort svar, klickbara referenser (`docId`, datum)
4. **Nollställning** — ny fråga ersätter föregående (inget oändligt scroll)

**Relaterat idag:** [`matchVaultEvidence`](../../../src/modules/speglings_system/utils/matchVaultEvidence.ts) i Speglar — deterministisk token-match, **inte** full chat-UI.

## 4. Visuell design (Obsidian Calm)

Canonical: [`docs/specs/design-master.md`](../design-master.md)

- Bakgrund `#020617`, yta `#0f172a` + glass blur
- Guld `#FDE68A` — användarens fråga
- Indigo `#818CF8` — knappar, laddning
- Emerald `#2DD4BF` — verifierade fakta / källhänvisningar
- Outfit + Inter
- Förbjudet: naturteman, regnbåge, lila, count-up

## 5. Datamodell (Firestore, WORM)

| Operation | Collection |
|-----------|------------|
| **Läser** | `reality_vault` (WORM) via `getVaultLogs(uid)` |
| **Skriver** | **ingen** — chatt endast i RAM |

Filter: exkludera `category: vävaren_metadata` som standard (samma som Speglar evidence-only).

## 6. Backend och agenter

**Spec (målbild):**

- Agent: **Sannings-Analytikern** (klinisk bevisföring, ingen empati)
- Pipeline: RAG mot `reality_vault` → `{ answer, citations[] }`
- Strikt: hallucinera aldrig utan bevis

**Idag i kod:**

| Callable | Användning | Datakälla |
|----------|------------|-----------|
| `valvChatQuery` | [`ValvChatPanel`](../../../src/modules/valv_chatt/components/ValvChatPanel.tsx) i `/valv` (Sök-flik) | **`reality_vault` only** — JSON `{ answer, citations[] }` |
| `knowledgeVaultQuery` | [`KnowledgeVaultChat`](../../../src/modules/kompis/components/KnowledgeVaultChat.tsx) på `/vardagen?tab=kunskap` | **`kampspar` + `kb_docs` only** — se [`Kunskap-SPEC.md`](./Kunskap-SPEC.md) |
| `getVaultLogs` + `matchVaultEvidence` | Speglar EvidenceCompare | Klient-side token-match, ingen LLM-svar |

**Skott:** Koppla aldrig Valv-Chat till `knowledgeVaultQuery` eller Kunskapsvalv till `valvChatQuery`.

## 7. Säkerhet

- AuthGate + valv unlocked (Shield 3s + PIN/WebAuthn)
- Zero Footprint: chatt-state i RAM; rensa vid navigering bort, logout, shake
- Kill Switch: global `useShakeToKill` → `/`
- CMEK (drift)

## 8. Status idag vs planerat

**Idag:** `valvChatQuery` + `ValvChatPanel` i `VaultPage` (flik Sök efter unlock); `useValvChatSession` nollställer vid flikbyte; `getVaultLogs`, `matchVaultEvidence` i Speglar.

**Planerat:** Klickbara citations; ev. egen route `/valv/chat`; bro Speglar→Hamn förfina.

## 9. Acceptanskriterier

| # | Kriterium | Kod-status |
|---|-----------|------------|
| 1 | Svar endast från `reality_vault` | **done** (`valvChatQuery`) |
| 2 | Varje påstående med källhänvisning | **partial** — citations JSON; UI ej klickbar |
| 3 | Shake raderar chatt + stänger valv-kontext | **partial** — global shake |
| 4 | Ingen spår vid flikbyte/unmount | **done** (`useValvChatSession`) |

## 10. Kopplingar

- **Verklighetsvalvet** — föräldra; levererar WORM-data
- **Speglings-Systemet** — valfri bro vid ångest efter fakta (planerad)
- **Kunskap `/vardagen?tab=kunskap`** — **skild** — se [`Kunskap-SPEC.md`](./Kunskap-SPEC.md)

## 11. Navigation

- Ingång: flik **Sök** i upplåst Bevis (`/dagbok?tab=bevis`)
- Utgång: flikbyte, Stäng eller shake — Zero Footprint (session reset **done**)

## 12. Tidigare diskussioner att bevara (vision)

- **Sanningens Ankare:** pinned WORM-poster som snabb referens vid gaslighting (fas 2 pin-vy; idag senaste + Sök).
- Forensisk sök ska kännas kall och faktabaserad — inte empati-coach.
- Citations som juridisk fotnot — användaren ska kunna öppna originalpost.
- Exkludera `vävaren_metadata` tills användaren godkänt taggar (Kladd §I.2).

## 13. Avvisade eller alternativa idéer

- **Gemensam RAG med Kunskap** — avvisat (cross-contamination).
- **Sparad chattlogg i Firestore** — avvisat (Zero Footprint).
- **Livs-Arkivarien i Valv-Chat** — avvisat; Sannings-Analytikern only.
- **Route `/valv/chat` som krav** — avvisat MVP; panel i VaultPage räcker.
- **Auto-ingest Kladd-filer till valv** — avvisat; manuell bevis-uppladdning.

---

**Module plan:** [`src/modules/valv_chatt/module_plan.md`](../../../src/modules/valv_chatt/module_plan.md)  
**Flöde:** [`docs/specs/p2-flode.md`](../p2-flode.md)
