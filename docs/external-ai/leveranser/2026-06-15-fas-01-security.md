# SECURITY-LOCK-MANIFEST for Livskompassen v2

Inventering baserad på bifogad repomix — inga gissningar, endast verifierad information.

| Komponent                          | Filer / Platser                                                                                                      | Status    | Smoke-kommando                       | Risk om ändras                                                                                         |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------------|-----------|------------------------------------|------------------------------------------------------------------------------------------------------|
| **1. WORM Collections i Firestore**        | `firestore.rules` (alla append-only regler)                                                                       | LOCK      | `npm run smoke:valv`, `smoke:children`, `smoke:dossier` | Dataförlust, datamanipulation, bryter permanent minne-invariant                                      |
| - reality_vault                   | `firestore.rules`                                                                                                   | LOCK      | `smoke:valv`                       | Radering eller update till bevis är förbjudet                                                        |
| - children_logs                  | `firestore.rules`                                                                                                   | LOCK      | `smoke:children`                   | Särskilt ägarskap, cross-RAG manipulationsrisk                                                       |
| - journal                        | `firestore.rules`                                                                                                   | LOCK      | `smoke:valv`, `smoke:locked-ux`   | Skrivskydd append-only; delta data för recovery och reflektion                                       |
| - evolution_ledger               | `firestore.rules`                                                                                                   | LOCK      | `smoke:evolution`                  | Livscykel-data för användarprogression, ägarskydd                                                   |
| - dossier_snapshots             | `firestore.rules`                                                                                                   | LOCK      | `smoke:dossier`                    | Immutable export, blir beviskvitto, inga ändringar                                                    |

| **2. Dual Vault Gate: JWT + VaultSessionGate** | `functions/src/callables/unlockVault.ts`, `functions/src/lib/vaultSessionGate.ts`                                  | LOCK      | `smoke:valv-security`              | Obsluta serverautentisering, PIN/WebAuthn gate; omgår session = säkerhetsläge kan brytas             |

| **3. callableGuards + App Check Enforcement** | `functions/src/lib/callableGuards.ts` + `src/modules/core/firebase/appCheck.ts`                                     | LOCK      | `smoke:valv-security`              | Felaktig App Check-hantering kan leda till DoS/DDoS, obehörig åtkomst                                |
| - App Check enforcement flag   | `APP_CHECK_ENFORCE=true` miljövariabel                                                                             | LOCK      | `smoke:valv-security`              | Måste vara fail-closed; om öppnas risk för otillåten access                                           |

| **4. SynapseBus - 4 triggers + siloriktig routing** | `functions/src/adk/synapses/synapseBus.ts`, `driveIngestSynapse.ts` (routing logik)                                | LOCK      | `smoke:valv-security`, `smoke:kunskap` | Felaktig routing kan blanda silos, ex. bevis → knowledgeVault (förbjudet), bryter PRINICIP tre silos |

| **5. routeFromDcap / resolveExecutorId - Deterministisk emiss** | `functions/src/agents/cards/index.ts` (routeFromDcap, resolveExecutorId)                                          | LOCK      | `smoke:grans`                      | LLM får aldrig styra auth eller routing; misslyckad fix ger risken för projektion/manipulation       |

| **6. Sacred + Locked UX funktioner (§11–17 i locked-ux-features.md)** | `.context/locked-ux-features.md`                                                                                | LOCK      | `npm run smoke:locked-ux`          | Produktflöden för Barnfokus, Valv (Mönster, Orkester, Kunskap, Aktörskarta), Planering, Barnporten etc |
| - Barnfokus-frågor (Familjen)   | `FamiljenBarnfokusDelegate.tsx`, `FamiljenInputSuperModule.tsx`                                                    | LOCK      | `smoke:locked-ux`                  | Måste finnas, knapp sparas till barnens logg, ingen borttagning eller gömning                          |
| - Valv: Mönster + Orkester + Kunskapsbank + Aktörskarta | `VaultPage.tsx`, `VaultMonsterPanel.tsx`, `VaultOrkesterPanel.tsx`, `VaultKunskapsbankPanel.tsx`, UI komponenter     | LOCK      | `smoke:locked-ux`                  | Får ej tas bort eller refaktoreras utan produktbeslut                                                 |
| - Planering P3 Kanban på /planering | `/planering` route och tillhörande komponenter                                                                | LOCK      | `smoke:planering-superhub`         | Kanban ska vara kvar och oförändrad                                                                     |
| - Barnporten + Inkorg→Valv HITL-bro | `BarnportenInboxPanel.tsx`, `SaveAsEvidencePrompt.tsx` (HITL steg)                                                | LOCK      | `smoke:locked-ux`                  | Inkorgen får ej automatiskt promovera, alltid HITL-godkännande                                         |
| - Ikoner D1 LivskompassMark, M2 KompisMark, WH1/WH2 | `LivskompassMark.tsx`, `KompisMark.tsx`, widget-ikoner                                                           | LOCK      | `smoke:locked-icons`               | Får ej tas bort, döpas om eller bytas utan PMIR                                                       |

---

# Identifierade luckor och rekommenderade fixes

| Lucka                                   | Beskrivning                                                                                     | Rekommenderad fix                                   | PHASE att adressera                   |
|----------------------------------------|-------------------------------------------------------------------------------------------------|-----------------------------------------------------|--------------------------------------|
| Kontroll av App Check enforce flag i Console | Console kan ha pendlande status för enforcement; krävs hård enforcement i funktioner              | Säkerställ fail-closed implementation och UI-varning| 19.1 och uppdaterad DEPLOY.md        |
| SynapseBus routing strikt siloseparation     | Komplext routing behövs fortsatt verifieras för nya dokumenttyper / klassificeringar            | Skriv detaljerad test för silos och HITL pipelines  | 19.1–19.3                           |
| DCAP-routing utan LLM-styrning               | Säkerställ strikt deterministisk routing i `routeFromDcap` och `resolveExecutorId` utan LLM-inblandning | Kod-/regelkontroller, e2e-tester                      | 19.1                               |
| Locked UX smoke-kommandon automatisering     | Säkerställ alla låsta UX-komponenter inkluderas i smoke-paket och körs vid CI                    | Smoke-regler + CI integration                         | 19.1                               |

---

Dokumentet är baserat på obestridd kontext från repomix inklusive `.context/arkiv-minne.md`, `.context/security.md`, `firestore.rules`, samt relaterade `functions/src` källor och dokument i `docs`.

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
