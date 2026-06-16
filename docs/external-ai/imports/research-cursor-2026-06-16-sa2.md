# Research — SA-2 HCF & Hamn (Cursor)

**Datum:** 2026-06-16 · **Agent:** Cursor SA-2 · **Baseline:** `research-2026-06-16-sa2-hcf-hamn.md` + `.context/domän-covert-narcissism.md`

**Källor (P1/P2, ej clickbait):** [AFCC Parenting Coordination Task Force Report (2003)](https://www.afccnet.org/Portals/0/Committees/parentcoord_final.pdf), [AFCC Guidelines for Parenting Coordination (2019)](https://www.afccnet.org/Portals/0/PDF/Guidelines%20for%20PC%20with%20Appendex.pdf), [Bris — skilsmässa med barn](https://www.bris.se/for-vuxna/bris-guidar/sa-pratar-du-skilsmassa-med-ditt-barn/), [Bris — stöd för vuxna](https://www.bris.se/for-vuxna/stod-och-rad/), [Socialstyrelsen — separation små barn (PDF)](https://kunskapsstodforvardgivare.se/download/18.72c4495e17f44b64443237a/1646300927730/kunskapsmaterial-separation-sm%C3%A5-barn.pdf), [Regeringen.se — samarbetssamtal](https://www.regeringen.se/regeringens-politik/familjeratt/radgivning-och-annan-hjalp/), [Freyd — DARVO](https://www.jjfreyd.com/darvo), [High Conflict Institute — BIFF](https://www.highconflictinstitute.com/how-to-write-a-biff-response/)

---

## Top 5 NEW (sammanfattning)

| # | id | Bank / wire | Varför NEW |
|---|-----|-------------|------------|
| 1 | research-cursor-sa2-001 | **kunskap-fact-cop-006** | AFCC-definition av parallel parenting (disengagement, separata spår, minimal face-to-face) — djupare än `cn-011` / `fact-003` |
| 2 | research-cursor-sa2-004 | **kunskap-fact-cop-007** | Skriftlig kommunikation som default vid HCF — BRIS + Socialstyrelsen; motiverar Hamn-routing |
| 3 | research-cursor-sa2-003 | **kunskap-fact-jur-009** | Parenting coordinator (AFCC) mappad mot svensk familjerätt (samarbetssamtal, inte samma befogenhet) |
| 4 | research-cursor-sa2-021 | **hamnTaktikWire** | `written_only_escalation` — saknas i `hamnTaktikWire.ts` (endast hoover/smear/juridik_hot m.fl.) |
| 5 | research-cursor-sa2-002 | **bh-013** (KEEP) | Barnexponering för konflikt skadligare än separation — BRIS P1 stärker befintlig post, ingen ny bank |

---

## Jämförelse cn-* · cop-* · jur-*

| Prefix | Täckning idag | SA-2-lucka | Rekommendation |
|--------|---------------|------------|----------------|
| **cn-*** | `cn-001`–`022` ingest; BIFF/Grey Rock/parallel/JADE/DARVO (`cn-008`–`012`) | `cn-011` kort; saknar AFCC disengagement + “tvingad teamwork eskalerar” | **KEEP** cn-*; fördjupa via **cop-006**, inte duplicera cn-post |
| **cop-*** | `cop-001`–`005` ingest (logistik, Grey Rock) | Skrift-default + AFCC parallel parenting | **NEW** `cop-006`, `cop-007` (CANDIDATE våg 27) |
| **jur-*** | `jur-001`–`008` ingest; `jur-001`/`007` nämner parallellt föräldraskap | PC vs svensk familjerätt | **NEW** `jur-009`; **KEEP** `jur-007` (svensk process) |

**DARVO:** `kunskap-fact-043`–`047` + `cn-008` — **KEEP**, Freyd P2 som citation_hint. Ingen ny DARVO-post.

**BIFF/Grey Rock:** `fact-005`/`006`/`012`, `cn-009`/`010`, `cop-005` — **KEEP**. BIFF-coaching → Hamn, inte Kunskap-RAG.

**Överlapp att undvika:** `cn-011` ≈ `fact-003` ≈ `fact-015` ≈ `jur-001`/`jur-007` — en AFCC-fördjupning (`cop-006`) räcker.

---

## Fynd (22 YAML)

```yaml
id: research-cursor-sa2-001
content_class: FACT
target_zone: kunskap
target_module: family/safeHarbor
route: /familjen?tab=hamn
category: medforaldraskap
source_tier: P2
source_url: https://www.afccnet.org/Portals/0/Committees/parentcoord_final.pdf
source_title: AFCC Task Force — Parenting Coordination (parallel parenting)
claim_sv: "Parallel parenting är disengagement på två parallella spår: separata hushåll, minimal vuxenväxelverkan, barn utanför föräldradialog; kommunikation om barn sker sällan face-to-face."
why: "AFCC-kanon utöver cn-011 och fact-003."
existing_overlap: cn-011, jur-001, jur-007, kunskap-fact-003, kunskap-fact-015
recommendation: NEW
proposed_bankId: kunskap-fact-cop-006
rule_impact: domän-covert-narcissism — parallel parenting som default-råd vid HCF
```

```yaml
id: research-cursor-sa2-002
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen
category: barn_hcf
source_tier: P1
source_url: https://www.bris.se/for-vuxna/bris-guidar/sa-pratar-du-skilsmassa-med-ditt-barn/
source_title: Bris — Så pratar du skilsmässa med ditt barn
claim_sv: "Skilsmässa i sig skadar inte barnet; långvariga föräldrakonflikter kan. Barn tar ofta ansvar för vuxnas mående — vuxna ska bära konflikten."
why: "Bris P1 validerar bh-013 utan alienation-retorik."
existing_overlap: bh-013, kunskap-fact-042, bh-005
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa2-003
content_class: FACT
target_zone: kunskap
target_module: evidence/vault
route: /valvet?vaultTab=dossier
category: juridik_logistik
source_tier: P2
source_url: https://www.afccnet.org/Portals/0/PDF/Guidelines%20for%20PC%20with%20Appendex.pdf
source_title: AFCC Guidelines for Parenting Coordination (2019)
claim_sv: "Parenting coordination är barnfokuserad hybridprocess (utbildning, konflikthantering, tvistlösning, ibland beslut) för föräldrar som inte kan samarbeta — med screening för våld och maktklyftor."
why: "Saknas som egen FACT; jur-001..008 täcker svensk rätt, inte PC-rollen."
existing_overlap: jur-001, jur-004, jur-007 (delvis)
recommendation: NEW
proposed_bankId: kunskap-fact-jur-009
rule_impact: dossier — neutral metodreferens, inga diagnos-etiketter
```

```yaml
id: research-cursor-sa2-004
content_class: FACT
target_zone: kunskap
target_module: family/safeHarbor
route: /familjen?tab=hamn
category: medforaldraskap_logistik
source_tier: P1
source_url: https://www.bris.se/for-vuxna/bris-guidar/sa-pratar-du-skilsmassa-med-ditt-barn/
source_title: Bris — kommunikationsväg mellan vuxna
claim_sv: "När föräldrar inte kan prata direkt: hitta vuxen-till-vuxen-kanal (mejl, sms) — barn ska inte vara budbärare."
why: "Svensk P1-källa för skrift-default; motiverar cop-007 och Hamn."
existing_overlap: cop-002, cn-007, bh-005, cop-005
recommendation: NEW
proposed_bankId: kunskap-fact-cop-007
rule_impact: hamn-written-default (eval våg 27)
```

```yaml
id: research-cursor-sa2-005
content_class: FACT
target_zone: kunskap
target_module: family/safeHarbor
route: /familjen?tab=hamn
category: covert_taktik
source_tier: P2
source_url: https://www.afccnet.org/Portals/0/Committees/parentcoord_final.pdf
source_title: AFCC — disengagement vs forced cooperation
claim_sv: "Tvingad 'teamwork' mellan fientliga föräldrar kan upprätthålla konflikt; parallel parenting prioriterar förutsägbarhet framför gemensam problemlösning när samarbete eskalerar."
why: "Validerar Grey Rock/BIFF utan JADE; stärker cn-012."
existing_overlap: cn-012, cn-009, cop-005
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa2-006
content_class: FACT
target_zone: kunskap
target_module: evidence/vault
route: /valvet
category: covert_taktik
source_tier: P2
source_url: https://www.afccnet.org/Portals/0/PDF/Guidelines%20for%20PC%20with%20Appendex.pdf
source_title: AFCC PC — intimate partner violence screening
claim_sv: "Vid parenting coordination krävs screening för våld inklusive dominerande och intimiderande beteende; standard ADR kan vara olämplig vid coercive control."
why: "Säkerhets-P0 — stödjer DCAP fail-closed → Granska."
existing_overlap: cn-014, cn-016..021, juridik_hot wire
recommendation: KEEP
rule_impact: security — fail-closed vid våldssignal
```

```yaml
id: research-cursor-sa2-007
content_class: FACT
target_zone: kunskap
target_module: diary/mirror
route: /hjartat?tab=speglar
category: kommunikation_metod
source_tier: P1
source_url: https://www.highconflictinstitute.com/how-to-write-a-biff-response/
source_title: High Conflict Institute — BIFF Response
claim_sv: "BIFF (Brief, Informative, Friendly, Firm) är skriftlig metod för korta sakliga svar — minskar eskalering, ersätter inte terapi, juridik eller akut skydd."
why: "Produktgräns; redan i fact-005/006/cn-010."
existing_overlap: kunskap-fact-005, 006, 012, cn-010
recommendation: KEEP
rule_impact: BIFF endast Hamn, ej Kunskap-coach
```

```yaml
id: research-cursor-sa2-008
content_class: FACT
target_zone: kunskap
target_module: family/safeHarbor
route: /familjen?tab=hamn
category: kommunikation_metod
source_tier: P1
source_url: https://www.highconflictinstitute.com/how-to-write-a-biff-response/
source_title: HCI — BIFF skriftligt
claim_sv: "Hostila mejl behöver ofta inget svar; när svar krävs (t.ex. kopior till myndighet) ska det vara kort, faktabaserat och utan försvar — längre svar ger mer bränsle."
why: "Stärker cop-001 och Hamn wire-logik."
existing_overlap: cop-001, cn-012, cn-022
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa2-009
content_class: FACT
target_zone: kunskap
target_module: evidence/vault
route: /valvet
category: covert_taktik
source_tier: P2
source_url: https://www.jjfreyd.com/darvo
source_title: Jennifer Freyd — DARVO
claim_sv: "DARVO (Deny, Attack, Reverse Victim and Offender) är beteendemönster vid konfrontation — inte diagnos; kan öka tystnad och självanklagelse hos den som konfronterar."
why: "Kanon för 043–047 och cn-008; skilj från gaslighting (cn-006)."
existing_overlap: kunskap-fact-043, cn-008, 044-047
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa2-010
content_class: FACT
target_zone: kunskap
target_module: family/safeHarbor
route: /familjen?tab=hamn
category: covert_taktik
source_tier: P2
source_url: https://dynamic.uoregon.edu/jjf/articles/hf2020.pdf
source_title: Harsey & Freyd (2020) — DARVO credibility
claim_sv: "Forskning visar att DARVO kan påverka observatörers trovärdighetsbedömningar; neutral dokumentation (datum, citat) motverkar minnesglapp utan att etikettera motpart."
why: "Stödjer cn-013 och Valv WORM — inte ny bank."
existing_overlap: cn-013, vf-001, ep-007
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa2-011
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen
category: barn_hcf
source_tier: P1
source_url: https://www.bris.se/for-vuxna/stod-och-rad/
source_title: Bris — barn mitt i vuxenkonflikt
claim_sv: "Barn vill att vuxna tar ansvar och löser konflikter utan att barn blir indragna, medlar eller väljer sida."
why: "Stärker bh-001, bh-010, cop-003 (överlämning utan konflikt)."
existing_overlap: bh-001, bh-010, cn-007, bh-005
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa2-012
content_class: FACT
target_zone: kunskap
target_module: family/safeHarbor
route: /familjen?tab=hamn
category: medforaldraskap_logistik
source_tier: P2
source_url: https://kunskapsstodforvardgivare.se/download/18.72c4495e17f44b64443237a/1646300927730/kunskapsmaterial-separation-sm%C3%A5-barn.pdf
source_title: Socialstyrelsen — separation små barn
claim_sv: "Vid oenighet eller konflikt rekommenderas mejl: kortfattat, barnfokus, praktiska frågor — inte parrelation eller anklagelser i samtal med BVC/skola."
why: "Svensk P2 för cop-007; kompletterar cop-002."
existing_overlap: cop-002, cop-007 (plan), cn-015
recommendation: NEW
proposed_bankId: kunskap-fact-cop-007
rule_impact: null
```

```yaml
id: research-cursor-sa2-013
content_class: FACT
target_zone: kunskap
target_module: evidence/vault
route: /valvet
category: juridik_logistik
source_tier: P2
source_url: https://www.regeringen.se/regeringens-politik/familjeratt/radgivning-och-annan-hjalp/
source_title: Regeringen.se — samarbetssamtal
claim_sv: "Svensk familjerätt erbjuder kostnadsfria samarbetssamtal vid oenighet om vårdnad, boende, umgänge — syfte samförstånd utanför domstol."
why: "Svensk motsvarighet delvis till PC; skilj från jur-009 (PC har ofta beslutsmandat)."
existing_overlap: jur-007, jur-001, fact-010
recommendation: KEEP
rule_impact: Hamn signal parenting_coordinator_ref → länka familjerätt/samarbetssamtal
```

```yaml
id: research-cursor-sa2-014
content_class: FACT
target_zone: kunskap
target_module: evidence/vault
route: /valvet
category: juridik_logistik
source_tier: P2
source_url: https://www.regeringen.se/regeringens-politik/familjeratt/radgivning-och-annan-hjalp/
source_title: Regeringen.se — informationssamtal
claim_sv: "Sedan 2022 krävs informationssamtal hos familjerätten innan domstolstvist om vårdnad/boende/umgänge — föräldrar ska känna till samhällets stöd."
why: "Kompletterar jur-007; ny processfakta för dossier."
existing_overlap: jur-007, jur-008
recommendation: KEEP
rule_impact: juridik_hot wire kan nämna informationssamtal vid domstolshot
```

```yaml
id: research-cursor-sa2-015
content_class: FACT
target_zone: kunskap
target_module: family/safeHarbor
route: /familjen?tab=hamn
category: medforaldraskap_logistik
source_tier: P2
source_url: https://www.afccnet.org/Portals/0/Committees/parentcoord_final.pdf
source_title: AFCC — parallel parenting kommunikation
claim_sv: "I parallel parenting följs ofta parenting time-plan exakt med liten flexibilitet; större beslut kommuniceras snarare än diskuteras live."
why: "Logistik-FACT för cop-004 och cop-002."
existing_overlap: cop-002, cop-004, cop-003
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa2-016
content_class: FACT
target_zone: kunskap
target_module: family/children
route: /familjen
category: barn_hcf
source_tier: P1
source_url: https://www.bris.se/for-vuxna/bris-guidar/sa-pratar-du-skilsmassa-med-ditt-barn/
source_title: Bris — prata inte illa om andra föräldern
claim_sv: "Oavsett konflikt: prata aldrig illa om den andre inför barnet; dela upp skol/fritids-tillfällen om barnet stressas av att båda är där."
why: "Stärker bh-007; ingen ny bank."
existing_overlap: bh-007, bh-008, cn-007
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa2-017
content_class: FACT
target_zone: kunskap
target_module: family/safeHarbor
route: /familjen?tab=hamn
category: kommunikation_metod
source_tier: P1
source_url: https://www.varannanvecka.app/artikel/hur-kan-jag-dampa-vara-vuxenkonflikter/
source_title: Varannan Vecka — neutral kommunikation
claim_sv: "Neutral kommunikation skapar distans och matar inte aggression; provocerande beteenden förstärks när de får utdelning — svara inte med ilska på ilska."
why: "Grey Rock-logik; överlapp cn-009, cop-005."
existing_overlap: cn-009, cop-005, fact-006, fact-011
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa2-018
content_class: FACT
target_zone: kunskap
target_module: evidence/vault
route: /valvet
category: juridik_overview
source_tier: P2
source_url: https://www.afccnet.org/Portals/0/PDF/Guidelines%20for%20PC%20with%20Appendex.pdf
source_title: AFCC PC — child-focused continuous focus
claim_sv: "Parenting coordination ska kontinuerligt prioritera barnets bästa och minska skadlig konflikt mellan vuxna som barn exponeras för."
why: "Stödjer jur-006 (logistik vs känsloargument) och bh-013."
existing_overlap: jur-006, bh-013, ep-008
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa2-019
content_class: FACT
target_zone: kunskap
target_module: family/safeHarbor
route: /familjen?tab=hamn
category: medforaldraskap_logistik
source_tier: P2
source_url: https://www.supremecourt.ohio.gov/sites/disputeResolution/conference/2020/agenda/D9/D9.pdf
source_title: Fidler & McHale (2020) — parallel vs cooperative parenting
claim_sv: "Efter separation: ~25–30% kooperativt, >50% parallel parenting, ~20% fortsatt konfliktfyllt; 8–15% hög konflikt 2–3 år post-divorce."
why: "Kontext-FACT; validerar att parallel är vanligt, inte 'misslyckande'."
existing_overlap: cn-011, jur-007, fact-003
recommendation: KEEP
rule_impact: null
```

```yaml
id: research-cursor-sa2-020
content_class: FACT
target_zone: kunskap
target_module: family/safeHarbor
route: /familjen?tab=hamn
category: covert_taktik
source_tier: P2
source_url: https://www.afccnet.org/Portals/0/Committees/parentcoord_final.pdf
source_title: AFCC — PC som neutral beslutsfattare dag-till-dag
claim_sv: "I högkonflikt kan parenting coordinator fungera som neutral beslutsfattare för vardagstvister (schema, utrustning, kommunikationsmetod) och rapportera till domstol vid brott."
why: "Förtydligar jur-009; skilj från svensk samarbetssamtal utan beslutsmandat."
existing_overlap: jur-009 (plan), jur-004
recommendation: NEW
proposed_bankId: kunskap-fact-jur-009
rule_impact: null
```

```yaml
id: research-cursor-sa2-021
content_class: FACT
target_zone: hamn
target_module: family/safeHarbor
route: /familjen?tab=hamn
category: kommunikation_metod
source_tier: P2
source_url: https://www.highconflictinstitute.com/how-to-write-a-biff-response/
source_title: HCI + baseline SA-2 wire-spec
claim_sv: "Efter etablerad skriftlig gräns: krav om 'ring mig', 'vi måste prata nu' eller 'svara i telefon' kan vara eskalering — föreslå kort skriftligt svar (BIFF), inte JADE."
why: "Deterministisk signal saknas i hamnTaktikWire.ts."
existing_overlap: cop-007, cn-012, cop-005
recommendation: NEW
proposed_wire: written_only_escalation
rule_impact: hamnTaktikWire — mönster: ring mig|vi måste prata|svara i telefon
```

```yaml
id: research-cursor-sa2-022
content_class: REJECT
target_zone: null
category: clickbait
source_tier: REJECT
source_url: null
source_title: "Narcissist-test", "13 tecken", etikettera motpart i UI
claim_sv: "Ej FACT — diagnos-quiz och personetiketter bryter mot domän-covert MUST NOT."
why: "Stop-list research-slutfas."
existing_overlap: null
recommendation: REJECT
rule_impact: anti-hallucination + domän-covert-narcissism
```

---

## Hamn wire (föreslagen)

| Signal | Mönster (sv) | Åtgärd | Bank-ref |
|--------|--------------|--------|----------|
| `written_only_escalation` | "ring mig", "vi måste prata nu", "svara i telefon" | BIFF-tips, håll skrift | cop-007, cn-012 |
| `parenting_coordinator_ref` | "familjerätten", "samarbetssamtal", "kontakta soc" | Neutral vägledning | jur-009, jur-013 |

**Live idag:** `hamnTaktikWire.ts` har `hoovering`, `smear`, `ekonomisk_kontroll`, `maternal_fasad`, `trauma_bonding`, `juridik_hot` — **inte** `written_only_escalation`.

---

## Routing (dirigent)

| Research-id | → bankId | Zone |
|-------------|----------|------|
| 001 | kunskap-fact-cop-006 | Kunskap |
| 004, 012 | kunskap-fact-cop-007 | Kunskap |
| 003, 020 | kunskap-fact-jur-009 | Kunskap |
| 021 | eval only → `hamnTaktikWire` | Hamn |
| 002, 005–011, 013–019 | KEEP (befintlig bank) | — |
| 022 | REJECT | — |

**Nästa steg (våg 27):** KEEP på `cop-006`, `cop-007`, `jur-009` → ingest → `npm run smoke:innehall` → implementera `written_only_escalation` separat.

---

Vill du att jag sparar detta som fil? Byt till **Agent mode** och säg till.

[REDACTED]