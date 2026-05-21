# Valv-Chat-SPEC

Källa: extern planerings-AI. Konsoliderad till `.context/modules/valv_chatt.md`.

## 1. Syfte och användarbehov

Forensiskt sökverktyg **inuti Verklighetsvalvet** — ställ frågor mot din egen WORM-historik (`reality_vault`) för att snabbt motverka gaslighting. Kalla, objektiva fakta med källhänvisningar. **Ingen** sparad chatt (Zero Footprint).

**Inte samma som `/kunskap`:** Kunskapsvalvet (Kampspår/Drive/RAG) är bredare livs-OS-navigering. Valv-Chat läser **endast** användarens `reality_vault`-bevis (exkl. `vävaren_metadata` som standard).

## 2. Route och ingång

- **Route planerad:** `/valv/chat` (AuthGate + valv unlocked)
- **Ingång:** knapp *"Sök i Valvet"* inuti upplåst `/valv` — **ingen** dock-ikon
- **Idag:** route och UI **saknas**

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

| Callable | Användning | Valv-scoped? |
|----------|------------|--------------|
| `knowledgeVaultQuery` | [`KnowledgeVaultChat`](../../../src/modules/kompis/components/KnowledgeVaultChat.tsx) på `/kunskap` | **Nej** — generisk `askKnowledgeVault`, ingen citation-JSON |
| `getVaultLogs` + `matchVaultEvidence` | Speglar EvidenceCompare | **Ja** — klient-side, ingen LLM-svar |

*(Extern spec kopplade Valv-Chat till `knowledgeVaultQuery` — **fel modul**; kräver ny callable t.ex. `valvChatQuery` eller utökad pipeline med vault-RAG + citations.)*

## 7. Säkerhet

- AuthGate + valv unlocked (Shield 3s + PIN/WebAuthn)
- Zero Footprint: chatt-state i RAM; rensa vid navigering bort, logout, shake
- Kill Switch: global `useShakeToKill` → `/`
- CMEK (drift)

## 8. Status idag vs planerat

**Idag:** `getVaultLogs`, `matchVaultEvidence`, valv unlock-gate — **ingen** Valv-Chat UI/route.

**Planerat:** `/valv/chat`, sök-UI, Sannings-Analytikern + citations, bro Speglar→"Behöver du processa detta?"

## 9. Acceptanskriterier

| # | Kriterium | Kod-status |
|---|-----------|------------|
| 1 | Svar endast från `reality_vault` | **planned** |
| 2 | Varje påstående med källhänvisning | **planned** |
| 3 | Shake raderar chatt + stänger valv-kontext | **partial** — global shake |
| 4 | Ingen spår vid utloggning/byt vy | **planned** |

## 10. Kopplingar

- **Verklighetsvalvet** — föräldra; levererar WORM-data
- **Speglings-Systemet** — valfri bro vid ångest efter fakta (planerad)
- **Kunskap `/kunskap`** — **skild** — Kampspår, inte samma datakälla eller route

## 11. Navigation

- Ingång: *"Sök i Valvet"* i `/valv` (planerad)
- Utgång: Stäng eller shake — Zero Footprint (planerad)
