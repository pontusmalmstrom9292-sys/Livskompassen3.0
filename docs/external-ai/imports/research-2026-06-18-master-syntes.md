SYSTEM REVISION MASTER — KONSOLIDERAD SYNTES (SA1–SA10)
1. Systemstatus och Baseline (Arkitektonisk Sanning)
Som teknisk ledare och arkitekt för Livskompassen v2 bekräftar jag följande systemläge inför denna revision:
Fas 19 Sprint: Våg 19.1–19.6 är genomförd (KLAR) och verifierad via baseline smoke-tester.
Backend FREEZE: Kärnan är låst sedan 2026-06-16. Nya integrationer hanterar exklusivt via tunna callables och Google Flow.
Dataintegritet: Tre strikta RAG-silor upprätthålls utan cross-RAG. WORM-datastrukturen (Write Once, Read Many) är intakt och skyddad via firestore.rules.
P1 och P2 Flow-Pipelines: Brusfilter v1+v2 samt Dossier Ai Foreword är implementerade och har status LOCK.
Kapacitet & Ekonomi: Driftkostnaden hålls under 150 kr/månad. Vi har cirka 2000 Google Flow-krediter tillgängliga för tunga LLM-offloads (Kandidater P3–P7).
2. Prioriterade Research-Fynd (SA1–SA10)
Nedan presenteras de konsoliderade systemfynden formaterade enligt obligatoriskt YAML-schema. Analyser fokuserar på att optimala lågkrediter och stängas av luckor utan att låsa UX eller befintliga silos.
YAML






id: research-sa6-001
content_class: TECH
target_zone: valv
target_module: "evidence/vault/dossier"
route: "/dossier"
backend_impact: YES
backend_sketch: "Tunn callable-brygga i generateDossierInternal som offloadar tidslinje-strukturering till Google Flow (P6 Kandidat)."
flow_credit_estimate: medium
existing_overlap: "generateDossier finns och är låst; Flow används endast för att förbättra output via includeAiForeword."
recommendation: NEW
pmir_required: YES
smoke_commands: ["npm run smoke:dossier", "npm run smoke:valv-security"]
YAML






id: research-sa8-002
content_class: TECH
target_zone: vardagen
target_module: "wellbeing/mabra"
route: "/vardagen?tab=mabra"
backend_impact: YES
backend_sketch: "Tunn callable för mabraCoach som anropar Flow för parafrasering och reframing (P4 Kandidat)."
flow_credit_estimate: medium
existing_overlap: "mabraCoach finns med bankId-synk (låst 19.4), saknar dynamisk parafrasering via Flow."
recommendation: NEW
pmir_required: YES
smoke_commands: ["npm run smoke:mabra", "npm run smoke:innehall"]
YAML






id: research-sa6-003
content_class: TECH
target_zone: valv
target_module: "evidence/vault"
route: "/valvet"
backend_impact: YES
backend_sketch: "Flow-assistans ansluten till vaultPatternScan för auto-taggning av HCF/covert-mönster i metadata (P3 Kandidat)."
flow_credit_estimate: low
existing_overlap: "Mönster-UX är låst, men mönstermatchningen saknar automatiserad metadata-assistans."
recommendation: NEW
pmir_required: YES
smoke_commands: ["npm run smoke:valv", "npm run smoke:valv-security"]
YAML






id: research-sa2-004
content_class: TECH
target_zone: hamn
target_module: "family/safeHarbor"
route: "/familjen?tab=hamn"
backend_impact: NO
backend_sketch: "N/A"
flow_credit_estimate: none
existing_overlap: "BIFF och Grey Rock hanteras redan väl av gransArkitektenAgent.ts (askGransArkitekten)."
recommendation: DEFER
pmir_required: NO
smoke_commands: ["npm run smoke:design-modules"]
YAML






id: research-sa10-005
content_class: UX
target_zone: platform
target_module: "core"
route: "/dev/themes"
backend_impact: NO
backend_sketch: "N/A"
flow_credit_estimate: low
existing_overlap: "Hex till tokens P0 är låst; P5-kandidat för ytterligare Theme-mockups i Antigravity."
recommendation: NEW
pmir_required: NO
smoke_commands: ["npm run smoke:design-modules"]
YAML






id: research-sa8-006
content_class: UX
target_zone: vardagen
target_module: "wellbeing/mabra"
route: "/vardagen?tab=mabra"
backend_impact: NO
backend_sketch: "N/A"
flow_credit_estimate: none
existing_overlap: "M3.0-B hybrid-8 är implementerad och låst; saknar fullt UI för Fitness/Näring."
recommendation: DEFER
pmir_required: NO
smoke_commands: ["npm run smoke:mabra", "npm run smoke:modulvaljare"]
YAML






id: research-sa4-007
content_class: TECH
target_zone: familjen
target_module: "barnporten"
route: "/barnporten"
backend_impact: YES
backend_sketch: "PWA Push-notifikationer via orkester (BP-PUSH) till Barnporten."
flow_credit_estimate: none
existing_overlap: "Barnporten är implementerad med manuell synk; push är dokumenterat som DEFER i Fas 19."
recommendation: DEFER
pmir_required: YES
smoke_commands: ["npm run smoke:locked-ux", "npm run smoke:children"]
YAML






id: research-sa2-008
content_class: FACT
target_zone: hamn
target_module: "family/safeHarbor"
route: "/familjen?tab=hamn"
backend_impact: NO
backend_sketch: "N/A"
flow_credit_estimate: none
existing_overlap: "Innehållsbanken cn-016 till cn-021 (Hoovering, Smear, Ekonomisk kontroll) är redan ingestade och mappade till Hamn wire."
recommendation: OVERLAP
pmir_required: NO
smoke_commands: ["npm run smoke:hamn", "npm run smoke:innehall"]
