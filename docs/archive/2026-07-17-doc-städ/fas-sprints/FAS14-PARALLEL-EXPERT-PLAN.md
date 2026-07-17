# Fas 14 — Parallell expertplan (5 chattar)

**Status:** Aktiv från 2026-06-15  
**State:** [`.orkester/fas14-state.json`](../.orkester/fas14-state.json) (lokal)  
**Kanon:** Cursor-plan *Fas 14 parallell expertplan* · [`SYSTEM_PLAN_v2.md`](./SYSTEM_PLAN_v2.md) · [`FAS13-SPRINT-AUTORUN.md`](./FAS13-SPRINT-AUTORUN.md)

---

## Syfte

Fem parallella Cursor-chattar med dedikerade specialister, tydliga filgränser och veckovis integrationsgate via Smoke Runner + `npm run orkester:night`.

---

## Expertspår

| Chat | Specialist | Fas | Eval-rapport |
|------|------------|-----|--------------|
| 1 | `specialist-security-auditor` | 14B | [`evaluations/2026-06-15-fas14-chat1-security-14b.md`](./evaluations/2026-06-15-fas14-chat1-security-14b.md) |
| 2 | `specialist-ux-guardian` | 14C | [`evaluations/2026-06-15-fas14-chat2-ux-14c.md`](./evaluations/2026-06-15-fas14-chat2-ux-14c.md) |
| 3 | `specialist-adk-weaver` | 15 | [`evaluations/2026-06-15-fas14-chat3-adk-15.md`](./evaluations/2026-06-15-fas14-chat3-adk-15.md) |
| 4 | `specialist-innehall-dirigent` | 16 | [`evaluations/2026-06-15-fas14-chat4-innehall-16.md`](./evaluations/2026-06-15-fas14-chat4-innehall-16.md) |
| 5 | `specialist-smoke-runner` | 17 | [`evaluations/2026-06-15-fas14-chat5-smoke-17.md`](./evaluations/2026-06-15-fas14-chat5-smoke-17.md) |

---

## Filägarskap (MUST)

| Expert | Får skriva | Får INTE röra |
|--------|-----------|---------------|
| Security | `firestore.rules`, vault-gates, App Check | UI, content-banker |
| UX | drawer, hub-sidor, error boundaries | rules, seed |
| ADK | synapser, inkast, inbox | content banks, locked UX-kärna |
| Innehåll | INNEHALL-REGISTER, seed, content/ | rules, agent routing |
| Smoke | smoke scripts, CI, typecheck config | feature-logik |

---

## Säkerhetsblock (klistra in varje chatt)

```
SÄKERHET (icke förhandlingsbart):
- WORM: inga update/delete på bevis-collections
- Tre silos: Kunskap / Valv / Barnen — ingen cross-RAG
- Zero Footprint: invalidateSession vid logout
- Prompts ENDAST i functions/src/sharedRules.ts
- Ingen mock-auth, mock-crypto eller LLM-beslut om auth/ägarskap
- Bevara Locked UX (npm run smoke:locked-ux före merge som rör Valv/Familjen)
- PMIR-stopp: ändra INTE firestore.rules utan explicit OK från Pontus
- Ingen force-push
Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän vågen PASS eller blocker dokumenterad.
```

---

## Veckorytm

| Dag | Aktivitet |
|-----|-----------|
| Mån–Tor | Parallella expertchattar |
| Fre | `npm run orkester:night` + rapport |
| Lör | 1 manuell smoke-rad ([`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md)) |
| Sön | PMIR vid >3 filer/rules — vänta **godkänn merge** |

---

## Startordning

1. Fas 13 user-signoff (Motorola) — [`2026-06-15-fas13-vag-6-user-signoff.md`](./evaluations/2026-06-15-fas13-vag-6-user-signoff.md)
2. Chat 5 baseline — `orkester:night`
3. Chat 1 + Chat 2 parallellt
4. Vecka 2 — Chat 3 + Chat 4
5. Fredag — Chat 5 integrerar + PMIR ([`2026-06-15-fas14-weekly-pmir.md`](./evaluations/2026-06-15-fas14-weekly-pmir.md))

---

## Relaterat

- [`FAS13-SPRINT-AUTORUN.md`](./FAS13-SPRINT-AUTORUN.md) — avslutad sprint
- [`ORKESTER-AUTORUN.md`](./ORKESTER-AUTORUN.md) — terminal nattpass
- [`MERGE-IMPACT-RAPPORT.md`](./MERGE-IMPACT-RAPPORT.md) — PMIR-mall
