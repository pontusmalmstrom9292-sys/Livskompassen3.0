# Senaste sammanfattning — systemstatus

**Datum:** 2026-06-06 · **Gren:** `main` · Repo: Livskompassen3.0  
**Senaste leverans:** Kunskap seed våg 8 (53 FACT) — omkörning till din uid kvar

---

## Nuläge i en mening

**Superhub + alla supermoduler klart (inkl. ValvSuper Fas 2)** · Kunskap våg 8 — omkör seed med din uid i `.env`.

---

## Vad som är byggt (bevara)

| Område | Status |
|--------|--------|
| CaptureSuperModule | Fas 1–3 + **v2** — kompass, hem, valv, planering; ReviewQueuePipelinePanel |
| InboxReviewQueue | Canonical i VaultSamlaHub; länk elsewhere |
| LivLauncherPage | Stora kort; kompass/ekonomi inline; övrigt → fullsid |
| LivSuper Fas 1–3 | Kortgrid · LivBackLink · VardagenShellPage raderad |
| Drogfrihet | Flik i `/familjen` · legacy `/drogfrihet` → redirect |
| SpeglarSuperModule | Fas 2 — dagbok + forensic variant-router |
| ValvSuperModule | Fas 1 + **Fas 2** — sub-TabBar i zoner; samlaView URL-sync |
| DagbokSuperModule | Fas 1 — reflektion + forensic-readonly; canonical JournalArchiveReadonly |
| PlaneringSuperModule | Fas 1 — inkorg + capture (G10 planering_inkorg) |
| BarnfokusSuperModule | Fas 1 — reflektion + livslogg router |
| K2 domän-svar | speglar · valv · familj · meny · mabra |
| Locked UX + silos | Oförändrat |

---

## Öppet (kräver dig)

| Punkt | Var |
|-------|-----|
| **Kunskap våg 8 omkörning** | Sätt `SEED_FIREBASE_EMAIL/PASSWORD` i `.env` → `--manifest=kunskap-facts --skip-existing` |
| **Manuell smoke #3, #4** | Autorun PASS — valfritt USER i app · [`SMOKE_RESULTS.md`](../SMOKE_RESULTS.md) |
| **Hosting ValvSuper Fas 2** | `firebase deploy --only hosting` (commit `c5348b56`) |

---

## Kanon

| Tier | Fil |
|------|-----|
| Upload plan | [`2026-06-06-upload-unified-cursor-plan.md`](./evaluations/2026-06-06-upload-unified-cursor-plan.md) |
| Liv launcher | [`2026-06-06-liv-super-cursor-plan.md`](./evaluations/2026-06-06-liv-super-cursor-plan.md) |
| K2 handoff | [`gemini-handoff/K2-*-svar.md`](../gemini-handoff/) |
