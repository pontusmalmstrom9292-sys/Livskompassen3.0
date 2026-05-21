# Valv-Chat

**Route planerad:** `/valv/chat` · **AuthGate:** ja · **Valv unlock:** ja · **Ej i dock**  
**Design:** [`docs/specs/design-master.md`](../../docs/specs/design-master.md) (Obsidian Calm)  
**Incoming spec:** [`docs/specs/incoming/Valv-Chat-SPEC.md`](../../docs/specs/incoming/Valv-Chat-SPEC.md)

---

## 1. Syfte och användarbehov

Sök och få svar direkt från **ditt WORM-valv** (`reality_vault`) — motverka gaslighting med kalla fakta och källhänvisningar. Zero Footprint: ingen sparad chatt.

## 2. Skillnad mot Kunskap (`/kunskap`)

| | **Valv-Chat** | **Kunskapsvalvet (`/kunskap`)** |
|---|---------------|----------------------------------|
| Route | `/valv/chat` (planerad) | `/kunskap` |
| Data | `reality_vault` (egna bevis) | Kampspår, kb_docs, Drive-ingest |
| Unlock | Valv PIN + Fyren | AuthGate only |
| UI idag | **saknas** | `KnowledgeVaultChat` |
| Callable idag | **planerad** `valvChatQuery` | `knowledgeVaultQuery` |
| Agent | Sannings-Analytikern | Kompis / generisk vault |
| Citations | Krävs per påstående | Ej strukturerade idag |
| Dock | Nej (dold i valv) | Sparkles i dock |

## 3. Route och ingång

- Endast från upplåst `/valv` — knapp *"Sök i Valvet"*
- Ingen FloatingDock-ikon

## 4. UX-flöde

1. Fråga (ett fält)
2. Laddning (indigo)
3. Svar + källhänvisningar (emerald)
4. Ny fråga ersätter föregående

**Befintlig byggsten:** `getVaultLogs` + `matchVaultEvidence` (Speglar) — deterministisk, ej LLM-chat.

## 5. Datamodell

- **Read:** `reality_vault` via Firestore SDK
- **Write:** ingen (chatt i RAM)

## 6. Backend

- **Planerat:** callable med vault-scoped RAG + Sannings-Analytikern → `{ answer, citations }`
- **Ej:** återanvänd `knowledgeVaultQuery` rakt av (fel scope)

## 7. Säkerhet

AuthGate + valv session; Zero Footprint; CMEK; kill switch global.

## 8. Status idag vs planerat

| Klart | Delvis | Planerat |
|-------|--------|----------|
| getVaultLogs | matchVaultEvidence (Speglar) | `/valv/chat` route |
| Valv unlock gate | | Sök-UI |
| | | valvChatQuery + citations |
| | | Stäng/Zero Footprint per session |
| | | Bro Speglar |

## 9. Acceptanskriterier

Se [`incoming/Valv-Chat-SPEC.md`](../../docs/specs/incoming/Valv-Chat-SPEC.md) — alla **planned** utom partial shake.

## 10. Kopplingar

- **Verklighetsvalvet** — datakälla
- **Speglings-Systemet** — valfri bro (planerad)
- **Kunskap** — **inte** samma modul

## 11. Navigation

Dold under `/valv`. Se [`hjartat-flode.md`](../../docs/specs/hjartat-flode.md).

## Kod (planerad)

Stub: `src/modules/valv_chatt/module_plan.md` — ingen `src/modules/valv_chatt/` än.

## Gap — minimal nästa implementationsdiff

1. Route `/valv/chat` + knapp i VaultPage  
2. Ny callable `valvChatQuery` (vault RAG + citations)  
3. UI: fråga → svar → källor (emerald)  
4. Session cleanup on unmount / Stäng  
5. Tydlig separation dokumenterad i kompis-modul  
