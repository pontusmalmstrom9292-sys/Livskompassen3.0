# Barnens livsloggar

**Route:** `/barnen` · **AuthGate:** ja · **Dock:** Heart  
**Design:** [`docs/specs/design-master.md`](../../docs/specs/design-master.md) (Obsidian Calm, Riktning A)  
**Incoming spec:** [`docs/specs/incoming/Barnen-SPEC.md`](../../docs/specs/incoming/Barnen-SPEC.md)

---

## 1. Syfte och användarbehov

Den trygga hamnen — neutral dokumentation för **Kasper** och **Arvid**. Balansmätare (7 dagar) utan dom. Juridisk PDF-export planerad.

## 2. Route och ingång

| Variant | Ingång |
|---------|--------|
| **A (aktiv)** | FloatingDock Heart, HomePage bento |
| **B (planerad)** | Dagbok-tagg → barn-specifik Balansmätare |

PIN-gate separat från valv (lokal hash).

## 3. UX-flöde

1. PIN → lås upp modul  
2. Välj Kasper / Arvid  
3. Balansmätare + JSON-export  
4. Fysiologi — sömn, ångest, aptit (1–5)  
5. Livslogg — kategori, observation, valfri barnpåverkan  
6. Tidslinje per barn  

**Planerat:** steg-wizard, PDF-knapp, unmount cleanup.

## 4. Visuell design

- Obsidian Calm enligt design-master
- Guld `#FDE68A` — aktiv flik, Balansmätare-bar
- Indigo `#818CF8` — sekundär (spec Balansmätare)
- Inga count-ups eller regnbågsgrafer

## 5. Datamodell

| Collection | WORM | Nyckelfält |
|------------|------|------------|
| `children_logs` | ja | childAlias, action, signals, observation, category, childrenImpact, createdAt |

## 6. Backend

- Klient: `saveChildrenLog` / `getChildrenLogs`
- Planerat: Genkit Dossier-agent för PDF-sammanställning

## 7. Säkerhet

- AuthGate + separat PIN
- Zero Footprint: lås vid bakgrund (`visibilitychange`); global kill switch
- CMEK (drift)
- Minimera PII; neutral Grey Rock-ton i observationer

## 8. Status idag vs planerat

| Klart | Delvis | Planerat |
|-------|--------|----------|
| Kasper/Arvid-flikar, fysiologi, livslogg | Zero Footprint unmount | Steg-wizard enligt spec |
| Balansmätare 7 dagar, tidslinje | | Incident → valv |
| JSON-export (stub) — `exportBalansReport.ts` | | Full Dossier / PDF juridisk rapport |
| | | Dagbok Variant B |

## 9. Acceptanskriterier

| # | Kriterium | Kod-status |
|---|-----------|------------|
| 1 | Logg per barn + timestamp | **done** |
| 2 | WORM rules | **done** |
| 3 | PDF juridisk export | **planned** |
| 4 | Balansmätare utan count-up | **done** |
| 5 | State reset vid navigering bort | **partial** |

## 10. Kopplingar

- **Verklighetsvalvet** — allvarliga incidenter som WORM-bevis (planerad)
- **Dossier** — JSON stub idag; samlad export valv + journal + barnen (planerad) → [`dossier.md`](dossier.md)
- **Dagbok** — taggning Variant B (planerad)

## 11. Navigation

Se [`docs/specs/navigation-master.md`](../../docs/specs/navigation-master.md): Variant A aktiv.

## Kod

`src/modules/barnens_livsloggar/` · plan: `src/modules/barnens_livsloggar/module_plan.md`

## Gap — minimal nästa implementationsdiff

1. Full Dossier / PDF juridisk stabilitetsrapport (7/30 dagar, hash) — se [`dossier.md`](../../.context/modules/dossier.md)  
2. `useEffect` cleanup formulär vid unmount  
3. *Skapa juridisk rapport*-knapp (PDF, inte bara JSON)  
4. Valfri kopiering allvarlig incident → `reality_vault`  
