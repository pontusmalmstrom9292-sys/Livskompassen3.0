# Systemkontroll — A — 2026-05-23

**Trigger:** Användaren sa `kör` — Fas 4 plan (verifiering + Ekonomi) med multi-agent våg 1–2.

**Källor lästa:** `.context/system-plan.md`, `Arkiv-GAP-REGISTER.md`, `Ekonomi-SPEC.md`, `EconomyPage.tsx`, `firestore.rules`, `retentionJob.ts`, `functions/src/economy/vendor/` (Fas 2, ej exporterad), subagent-rapporter Sacred + Ekonomi gap.

## Sammanfattning (3–5 rader)

Arkiv **G1–G14** är implementerade i kod; sammanfattningstabellen i GAP-registret var **föråldrad** (G9–G14 markerade open). **Ekonomi-MVP** är live i kod (Firestore, snabbknappar, lista) men SPEC/README/module_plan låg kvar på placeholder. **Lönespec** (`economy/vendor`) är Fas 2 — ska inte kopplas till UI än. Nästa produktionsvärde: **manuell smoke** (#1–7, #18 ekonomi) och **doc-synk** (denna körning).

## PASS

- Firestore `transactions` WORM (create-only) + `economy_profiles` uid-bound
- Ekonomi silo: ingen RAG/LLM/callable i `index.ts`
- `EconomyPage`: veckopeng, matlåda, vinst, `TimelineEntry`, profil
- `/ekonomi` → `/vardagen?tab=ekonomi` under `AuthGate`
- G1–G8, G9–G14 detaljrader **done** i GAP-register

## GAP / risk

| GAP | Allvar | Åtgärd |
|-----|--------|--------|
| GAP-register rad G9–G14 **open** | Doc | Uppdaterad till **done** |
| Ekonomi-SPEC/README föråldrade | Kognitiv | Synk i denna körning |
| `transactions` saknas i `WORM_COLLECTIONS_NEVER_PURGE` | Låg (purge träffar ej idag) | Tillagd i `retentionJob.ts` |
| Manuell smoke Fas 3 | Prod | Användare kör `SMOKE_CHECKLIST` |
| Opt-in minne-ingest | Produkt | Separat `kör` när redo |
| Payslip vendor + sjuk/VAB-data | PII om klient-exponering | Håll server-only; ingen UI Fas 4B |

## Rekommenderat nästa steg (max 1)

**Manuellt:** Kör smoke #18 (ekonomi) lokalt eller på Hosting — veckopeng → kontrollera `transactions` i Firestore Console.

## Blocker

Ingen kodblockerare för Ekonomi-MVP. Deploy av löne-callable kräver produktbeslut Fas 2.

## Multi-agent våg 2 (utförd)

- Doc-synk: `Ekonomi-SPEC.md`, `module_plan.md`, README, `.context/modules/ekonomi.md`
- `retentionJob.ts`: `transactions` i WORM allowlist
- `EconomyPage`: spar-bekräftelse (success)
- `SMOKE_CHECKLIST.md`: #18 Ekonomi
