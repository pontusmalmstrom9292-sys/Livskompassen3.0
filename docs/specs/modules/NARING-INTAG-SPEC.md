# NÄRINGSINTAG — Låst modulspec (M3.0-C+)

**Status:** LÅST UX (Pontus 2026-06-19)  
**Zon:** Vardagen → MåBra → `nutrition`  
**Research:** [`docs/evaluations/2026-06-19-naringsintag-diskret-deep-research.md`](../../evaluations/2026-06-19-naringsintag-diskret-deep-research.md)

---

## Syfte

Diskret loggning av mat och dryck för mönster över tid — **utan kaloriräkning, skuld eller Valv-export**.

---

## Låsta principer (MUST)

1. **Kärnläge från start:** Snabb logg (mat/dryck + kort notering + energikänsla) + mjuka nudges.
2. **Ingen moral:** Etiketter `bra` / `okej` / `tungt` — aldrig "fusk" eller "misslyckande".
3. **Progressive disclosure:** Trend, analys, makron och våg **endast** via Inställningar → Näring.
4. **Lokal först:** Intagsrader i `localStorage`; molnsynk endast dagssummering (`mabra_nutrition_log`).
5. **Zero Footprint:** Ingen export till Valv; ingen cross-RAG.
6. **Obsidian Calm:** `glow-bottom-green`, `BentoCard`, låg visuell arousal.

---

## Komponenter (kanoniska filer)

| Fil | Roll |
|-----|------|
| `mabra/components/MabraNutritionPanel.tsx` | Huvudvy |
| `mabra/components/MabraNutritionQuickLog.tsx` | Snabb logg |
| `mabra/components/MabraNutritionRhythmPanel.tsx` | Måltidsrytm (opt-in) |
| `mabra/components/MabraNutritionMacroStub.tsx` | Portionsguide (opt-in) |
| `naring/components/NutritionSettingsPanel.tsx` | Inställningar |
| `mabra/lib/mabraNutritionIntakeStorage.ts` | Lokal lagring |
| `mabra/lib/mabraNutritionPrefs.ts` | Feature-prefs |
| `mabra/lib/mabraNutritionNudges.ts` | Deterministiska nudges |

---

## Inställningsflaggor (lokal pref)

| Nyckel | Default | Beskrivning |
|--------|---------|-------------|
| `gentleNudges` | `true` | Mjuka påminnelser i panelen |
| `mealReminders` | `true` | "Har du ätit?" efter kl 14 |
| `trendView` | `false` | 7-dagars översikt |
| `detailedAnalysis` | `false` | Måltidsrytm och enkla mönster |
| `macroTracking` | `false` | Portionsguide (stub); full makron/våg i nästa våg |

---

## MUST NOT (utan PMIR + Pontus OK)

- Ta bort snabb logg eller göra kaloriräkning till standard
- Auto-exportera matlogg till Valv
- Aktivera makron/våg i UI utan explicit `macroTracking`
- Streak, XP eller röda varningsbanners
- Ändra `firestore.rules` för `intakeEntries` utan Fas 22.3 PMIR

---

## Smoke

- `npm run smoke:mabra` — statiska guards för intag-filer
- `npm run smoke:locked-ux` vid panel-/inställningsändringar
