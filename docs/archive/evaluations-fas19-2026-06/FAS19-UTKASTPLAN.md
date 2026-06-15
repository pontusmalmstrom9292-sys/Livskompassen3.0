# Fas 19 — Utkastplan (workspace-kopia)

**Status:** Utkast före pre-flight · **Inte** implementation än  
**Cursor Plan (intern):** `~/.cursor/plans/fas_19_life_os_015fe1f3.plan.md`  
**Pre-flight prompt:** [`docs/prompts/FAS19-PREFLIGHT-SUPERPROMPT.md`](../prompts/FAS19-PREFLIGHT-SUPERPROMPT.md)  
**Regel:** [`.cursor/rules/fas19-masterplan-guard.mdc`](../../.cursor/rules/fas19-masterplan-guard.mdc)

> Efter pre-flight ersätts detta av `docs/evaluations/*-fas19-masterplan-v2.md`.

---

# Fas 19 — Design, projekt-hjärna och kostnad (balanserat)

## Ja — jag förstår vad du vill bygga

Du bygger ett **Life OS** som:

- Samlar **oföränderligt bevis** (WORM i Valv) när konflikten eskalerar — sms, mönster, tidslinjer, gaslighting — så du har stenkoll utan att behöva minnas eller argumentera (BIFF/Grey Rock, inget JADE).
- Håller **tre silos** strikt (Kunskap / Valv / Barnen) så AI **aldrig** hallucinerar auth, ägarskap eller cross-RAG.
- Använder **orkester + synapser** (Drive→ingest, journal_woven, DCAP) för att systemet **själv** bygger minnet — fakta i Kunskapsbanken, bevis i Valvet, barnobservationer i Barnen.
- Skyddar barnen (Barnfokus, Barnporten, utvecklingsinnehåll) och dig (MåBra, Hamn, Speglar) med **Zero Footprint** där det ska vara ephemeral.

Det är exakt vad [`.context/domän-covert-narcissism.md`](../../.context/domän-covert-narcissism.md), [`.context/arkiv-minne.md`](../../.context/arkiv-minne.md) och [`.context/security.md`](../../.context/security.md) redan beskriver.

---

## Bekräftelse: MåBra-design finns i planen (men är inte färdigpolerad)

| Källa | Vad som sägs |
|-------|----------------|
| [`MABRA-3.0-MASTER-SPEC.md`](../specs/modules/MABRA-3.0-MASTER-SPEC.md) §6 | L0 `/mabra` med **8 pelarkort**, Obsidian Calm |
| Samma SPEC §8 | **M3.0-B** pelarnav-UI; **M3.0-E** lås efter PMIR |
| [`SYSTEM_PLAN_v2.md`](../SYSTEM_PLAN_v2.md) | Obsidian Calm: delvis — hex i 16 filer |
| Nuvarande UI | 6-korts `MabraModulValjare` — funkar men inte målbilden |

---

## Var vi är nu (efter Fas 15–18 våg 2)

- Superhub Fas 6–11 **klart** och låst (§11–§17)
- Arkiv-GAP G1–G16 + F8 **done**
- Fas 15 våg 2 **agent-PASS**
- MåBra krasch fixad (`a865d044f`)

---

## Fas 19.0 — Pre-flight (INNAN implementation)

| Gate | Krav |
|------|------|
| G0 | Globala agenter + trippel per zon |
| G1 | Pontus godkänner `fas19-masterplan-v2.md` |
| G2 | Beslutsmemo med rekommendationer |
| G3 | PMIR för arkiv-flytt |

Se fullständig process i [`FAS19-PREFLIGHT-SUPERPROMPT.md`](../prompts/FAS19-PREFLIGHT-SUPERPROMPT.md).

---

## Fas 19 — tre parallella spår

### Spår A — MåBra + ikoner (design)
### Spår B — Projekt-hjärna (arkiv-först städ)
### Spår C — Kredit- och kostnadsgate

(Full detalj i Cursor Plan eller efter masterplan-v2.)

---

## Glömda / öppna punkter

JOY-17 · BP-PUSH · LEG-VAULT · M3.0-C · DF-CLEAR · EVO-LEDGER · NAV-2.7 · P2-ROUTE · KUNSKAP-25+

**Inget raderas** utan PMIR + explicit OK.
