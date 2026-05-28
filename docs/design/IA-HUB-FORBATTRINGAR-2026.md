# Hub-förbättringar — förslag per modul (2026-05-28)

**Bas:** Jämfört med liknande hubbar (Vardagen, Familjen, Hamn) och innehållskanon (U1–U6).  
**IA-beslut:** [`IA-MODUL-FLYTT-2026.md`](./IA-MODUL-FLYTT-2026.md)

---

## Hem (`/`)

1. **Inkast Lite** som enda primär CTA i hero — övriga länkar i Fyren, inte duplicerade i drawer-snabbåtgärder.
2. **Adaptiva kort** (`compassAdaptiveCards`) med max 2 synliga — resten bakom "Visa mer".
3. **Life OS-preset** synlig som en rad text (t.ex. "Profil: Förälder trygg") utan inställningsdjup.
4. **Kompis-avatar** klickbar → Valv Kunskapsbank endast efter gate (ej direkt RAG från hem).
5. **Zero Footprint-hint** vid utloggning: en rad "Känslig data rensas från denna enhet."

## Dagbok / Hjärtat (`/dagbok`)

1. **Reflektion default** — wizard steg 1 alltid humör först (ADHD-vänligt).
2. **Speglar-bro** efter sparad post (`SavedStep`) — en knapp, ingen lista.
3. **Bevis-flik** dold tills Fyren long-press + PIN (G18) — behåll plausible deniability.
4. **JournalArchive** paginerat (5) — "Visa fler" istället för oändlig scroll.
5. **MåBra-bro** (`mabraBridge`) med "Spara bara humör" när energi är låg.

## Valv (`/dagbok?tab=bevis`)

1. **TabBar från `getMainVaultTabBarItems`** — samma ordning som drawer Pansaret.
2. **Triage + Valv-chatt** på Sök-fliken — ingest och chatt samma zon (expert: ärendehantering).
3. **Orkester-panel** med agent-trio + dokumentlista — ingen auto-skriv till Firestore från LLM.
4. **Kunskapsbank** läser `kampspar`/`kb_docs` — citations klickbara (öppet GAP).
5. **Dossier** kvar som `/dossier` + drawer-rad "full vy" — export WORM.

## Vardagen (`/vardagen`)

1. **Kompasser default** efter tid på dygnet (`getDefaultCompassByTime`).
2. **Ekonomi-flik** (`wellbeing/economy`) med veckopeng + manuell smoke #18.
3. **Ingen publik Kunskap-flik** — redirect till Valv om legacy `?tab=kunskap`.
4. **HubPageShell** med samma typografi som Familjen (`hubHeaderClasses`).
5. **Life OS MaterialPack** för rutiner/ekonomi när preset har flaggor.

## MåBra (`/mabra`)

1. **Daglig Mix** (`DagligMixPanel`) överst — deterministisk rotation, inga streaks.
2. **Vit hub preview** kopplad till Transformator-callable — offline fallback-text.
3. **Ingen FACT-RAG** i modulen — fakta → kunskap-seed / Valv.
4. **Hub-specifik footer** med en regleringsövning (andning), inte tre val.
5. **Bro till Dagbok** med lågenergi-query (`from=mabra&energy=low`).

## Familjen (`/familjen`)

1. **Flikar från `navTruth`** via `useHubTab` — reflektion / livslogg / tillsammans.
2. **Barnfokus** endast på reflektion — `BarnfokusFraganPanel` + WORM `children_logs`.
3. **Child picker** döljs på tillsammans-fliken.
4. **Legacy `?tab=kunskap`** → redirect Valv kunskapsbank (ej egen RAG här).
5. **ParentReminderFooter** en rad, lågaffektiv — ingen skuldton.

## Trygg hamn (`/hamn`)

1. **TryggHamnHub** med underflikar (BIFF, speglar, barn) — `BiffTriagePanel` via `BiffPublicPanel`.
2. **Kompassrad** inbäddad (delad med Vardagen) — kvällsflöde utan egen route.
3. **Grey Rock/BIFF** utan JADE-förslag i UI — korta svarmallar.
4. **Valv-länkar** för forensik (frånvaro/lön) via `vaultDrawerPath`.
5. **MaterialPack** för hamn-preset (BIFF, speglar) när Life OS säger på.

## Planering (`/planering`)

1. **P3 Kanban** låst — handling / fokus / inkorg som drawer-flikar.
2. **Koppling Projekt** (`projectId` på tasks) — P1 done, P2 för bild/regler.
3. **Ingen bevis-ingest** i kanban — PDF → Valv route.
4. **Hub footer** med en "Lägg i inkorg"-snabbknapp.
5. **Life OS** koppling C–D enligt hybrid-spec (nästa spår).

## Projekt (`/projekt`)

1. **Hub-lista** aktiva projekt + `/projekt/ny`.
2. **P2:** bildblock, regler, widget-sheet — se PROJEKT-SPEC.
3. **MaterialPack-editor** light (Fas D Life OS).
4. **Delad planering-route** för handling — inte duplicera kanban här.
5. **Firestore `projects` + `project_blocks`** — typer enligt spec.

## Arbetsliv (`/arbetsliv`)

1. **Stämpel** som flik (`admin/stampla`) — widget `/widget/stampla`.
2. **Valv-forensik** för frånvaro/lön via legacy tab-redirects.
3. **Tid & logg** operativ data — ej Kunskap-RAG.
4. **HubPageShell** + `useHubTab` som övriga hubbar.
5. **Smoke `smoke:arbetsliv`** i CI-orkester.

## Drogfrihet (`/drogfrihet`)

1. **Flik "Stöd & resurser"** (path `?tab=kunskap` oförändrad) — minskar förvirring med Valv.
2. **Idag** som default-flik.
3. **Innehåll REFLECTION/PLAY** — kurator mabra, inte kunskap-seed FACT.
4. **Inställningar** undermodul i drawer.
5. **Ingen PIN** — publikt livsstöd, skilt från Valv.

## Inställningar (`/installningar`)

1. **Allmänt + Drogfrihet** som enda drawer-underflikar.
2. **App unlock / Google** i auth-zon — inte i denna hub.
3. **Tema** via Theme Pack I — inte Theme Lab i prod.
4. **Zero Footprint-toggle** synlig med en mening förklaring.
5. **Inga silo-regler** redigerbara här — endast i `firestore.rules` (dev-process).
