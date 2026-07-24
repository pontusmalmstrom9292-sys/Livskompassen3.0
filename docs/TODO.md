> **AI Governance:** Read [`PROJECT_STATE.md`](./PROJECT_STATE.md) and [`AI-GOVERNANCE.md`](./AI-GOVERNANCE.md) before work. Update this file after every completed task.

## 2026-07-24 — UI QA Harden Loop (gratis)

- [x] W0: tap-press chrome-first · scroll-probe exit≠0 · `.cursor/qa-harden/latest.json`
- [x] W1: 5 sync-experter (chrome/scroll/g85/companion/fas24-verifier)
- [x] W2–W3: `npm run qa:harden` detect→klass→Tier A recipes→smoke
- [x] W4: `debug:device-probe` + `.maestro/smoke-dock.yaml` (USB SKIP)
- [x] W5: `docs/QA-HARDEN-LOOP.md` · manifest v63
- [x] Privacy-blur bort (idle overlay + Android pause-täckning + Sacred ej default)
- [ ] Pontus: `npm run build:web && npx cap sync android` → Run G85 · sedan `npm run qa:harden`

## 2026-07-23 — Widget UI Polish ×10 (Kap 6 / Gate F)

- [x] R1–5: Capture/Note/Compass/Beacon/Inbox/Tasks/Journal/Harbor/Anchor/Child/Check-in
- [x] R6: `--cw-touch-floor` 56px · mood/pills/CTA ≥56 · Android check-in faces ≥56
- [x] R7–9: padding parity 12/10 · caps/tracking · trust/signature gold-dim · Anchor guldring
- [x] R10: `smoke:companion-widgets` + `smoke:locked-ux` **PASS**
- [x] Merge-konflikter mot main lösta (interactive layout IDs + Gate F)
- [ ] Pontus: G85 visuell sign-off (fäst Capture + Note på hemskärm)


## 2026-07-23 — Silo-glow bort överallt

- [x] CSS kill-switch `.glow-bottom-*` (+ tema/mabra)
- [x] DS/centrala mappers: ingen glow-klass (API kvar)
- [x] `smoke:locked-ux` · `smoke:design-modules` PASS

## 2026-07-24 — Ethereal Blue utan glow (moduler/val)

- [x] Kategori-/läges-pills: guldig glow → Ethereal `#7BA3C9` (inset endast)
- [x] Familjen hub + GS-hub-card: guldrim/bloom → ethereal lugn
- [x] `locked-obsidian-depth` + COLOR-POLICY uppdaterade (Pontus OK)
- [x] Unlock + re-lock `MOD-FAM-HUB` · smoke: `obsidian-depth` · `locked-ux` · `design-modules` · `governance` PASS

## 2026-07-23 — Familjen header glow bort

- [x] Ta bort `glow="blue"` från Välj barn + Barnfokus-intro i `FamiljenPage`
- [x] `smoke:locked-ux` PASS

## 2026-07-23 — Auth unlock (G85 / inloggningskrasch)

- [x] AuthErrorBoundary: Försök igen + Rensa inloggning (visar feltext)
- [x] WebAuthn-app-unlock avstängd på Capacitor (SacredLock äger biometri)
- [x] syncAuthUserToStore sätter `emailVerified` · Hem anteckningar mood-safe
- [x] **Root cause:** `stopAuraFlow` → `MemoryManager.scrub()` clearCache off-UI-thread → AuthErrorBoundary
- [x] AuraFlow stop utan scrub · bridge try/catch · breathing stop bara efter start
- [x] `compileDebugJavaWithJavac` PASS · build:web + cap sync
- [ ] Pontus: Android Studio Run på G85 → bekräfta hem utan felsida

## 2026-07-23 — UI Polish V10 ×10 Widgets (autonom, supernoggrant)

Unlock: [`evaluations/2026-07-23-unlock-MOD-UI-POLISH-V10-WIDGETS-X10.md`](./evaluations/2026-07-23-unlock-MOD-UI-POLISH-V10-WIDGETS-X10.md) (`approved: yes` · MOD-WIDGET)

- [x] W1 WidgetButton / QuickAction / MoodCheckIn defaults
- [x] W2 companion-widgets.css — touch floor 44 + unified focus + reduced-motion
- [x] W3–W5 Companion 10-pack aria-labels (Inbox→Beacon + HomeRail)
- [x] W6 Widget Studio page/mode/preview
- [x] W7–W8 features/widgets pages + ActionDashboard + Moduler forms
- [x] W9 FyrenWidgetBar / SideQuickDock
- [x] W10 smoke:companion-widgets · widgets · locked-ux

## 2026-07-23 — UI Polish V9 ×10 (autonom)

Unlock: [`evaluations/2026-07-23-unlock-MOD-UI-POLISH-V9-X10.md`](./evaluations/2026-07-23-unlock-MOD-UI-POLISH-V9-X10.md) (`approved: yes`)

- [x] W1 Core chrome (drawer, Fyren, Zen, AuthGate)
- [x] W2 Home executive / ankare
- [x] W3 Archive / Familjen / ekonomi stub
- [x] W4 Dagbok / Valv dossier / kunskap
- [x] W5–W9 residual (AccountAuth, StampClock, Ekonomi)
- [x] W10 smoke

## 2026-07-23 — UI Polish V8 ×10 (autonom)

Unlock: [`evaluations/2026-07-23-unlock-MOD-UI-POLISH-V8-X10.md`](./evaluations/2026-07-23-unlock-MOD-UI-POLISH-V8-X10.md) (`approved: yes`)

- [x] W1 Capture/Inkast
- [x] W2 Dashboard/widgets/studio
- [x] W3 Planering residual
- [x] W4 Projekt residual
- [x] W5 MåBra tools/vit
- [x] W6 Ekonomi/Arbetsliv/Drogfrihet
- [x] W7 Familjen/Dagbok
- [x] W8 Valv kunskap/ekonomi
- [x] W9 residual sweep
- [x] W10 smoke

## 2026-07-23 — UI Polish V7 ×10 (autonom)

Unlock: [`evaluations/2026-07-23-unlock-MOD-UI-POLISH-V7-X10.md`](./evaluations/2026-07-23-unlock-MOD-UI-POLISH-V7-X10.md) (`approved: yes`)

- [x] W1 Projekt hub/detail/ny
- [x] W2 Planering residual (pin/kanban/inkorg)
- [x] W3 Core chrome/home
- [x] W4 Media attach
- [x] W5 MåBra residual
- [x] W6 Drogfrihet/Arbetsliv/Näring
- [x] W7 Dagbok residual
- [x] W8 Barnporten
- [x] W9 Ekonomi/Valv/Hamn/widgets residual
- [x] W10 smoke

## 2026-07-23 — UI Polish V6 ×10 (autonom)

Unlock: [`evaluations/2026-07-23-unlock-MOD-UI-POLISH-V6-X10.md`](./evaluations/2026-07-23-unlock-MOD-UI-POLISH-V6-X10.md) (`approved: yes`)

- [x] W1 Core gates (HomeLayoutA, Worm, EvidenceMedia)
- [x] W2 Inkast / HITL
- [x] W3 MåBra residual (+ Nutrition focus)
- [x] W4 Planering residual
- [x] W5 Dagbok residual
- [x] W6 Familjen / Barnporten
- [x] W7 Valv-chat / Pansar
- [x] W8 Emotionellt minne
- [x] W9 Projekt + shared shell
- [x] W10 smoke

## 2026-07-23 — UI Polish V5 ×10 (autonom)

Unlock: [`evaluations/2026-07-23-unlock-MOD-UI-POLISH-V5-X10.md`](./evaluations/2026-07-23-unlock-MOD-UI-POLISH-V5-X10.md) (`approved: yes`)

- [x] W1 Hem/chrome — focus + min-h-11
- [x] W2 MåBra panels
- [x] W3 Vardagen/recovery
- [x] W4 Planering
- [x] W5 Hjärtat/Dagbok
- [x] W6 Familjen/Hamn
- [x] W7 Valv UI (citation)
- [x] W8 Widgets pack
- [x] W9 Ekonomi deepen
- [x] W10 Settings + smoke

## 2026-07-23 — Release readiness runway (agent)

Plan: Release-readiness audit

- [x] Agent: G85 device-ready pack + checklist day-6 prep (Enhetsgate = Pontus)
- [x] Recovery SOS ZF: `clearRecoveryLocalStorage` i Device Clear + logout
- [x] Android CI: RemoteViews lint-fix (`<View>` → ImageView i Capture/Note/Tasks)
- [x] Minne v61/v62 doc-synk: DONE (deploy 2026-07-18) — waves PAUS → DONE
- [x] Visual sign-off handoff: `evaluations/2026-07-23-g85-visual-signoff-handoff.md`
- [x] PMIR park hold: Genkit V1 · Familje-PIN · G18 · `/gora` · Gmail/Calendar · Life OS Fas D — **bygg inte**
- [ ] Pontus: G85 Enhetsgate + Capture one-pass (checklist)
- [ ] Pontus: day 1–7 logg → stäng Fas 24 P0
- [ ] Pontus: Gold/V4/Companion visual sign-off
- [x] Valfritt: `smoke:predeploy:live` + yolo-vakt **GO** (merge runway) — deploy fortfarande SKIP

## 2026-07-23 — Fas 24 close + Companion Våg 5–7 (Cursor)

Plan: Fas24 Companion Waves (implement)

- [x] W0: Gold Våg 1–4 already on main (`4e931001f`) — no core bundled
- [x] v63: ML Kit language-id in build.gradle; smoke:predeploy:build PASS; unlock docs
- [x] v65: Sacred deep-lock + escapeJs `"` + VISIBILITY_PRIVATE + KeyRecovery TEE retry
- [x] v66: Ghost exit waits biometric unlock callback
- [x] HUMAN prep: `docs/evaluations/2026-07-23-g85-device-ready-pack.md` (device-ready, not G85 PASS)
- [x] v67–v68: Edge AI Mind/Aura bridges + WORM consumer (`edgeTags` → classification.tags)
- [x] Unlock MOD-WIDGET Smart Time/Widget AI (`approved: yes`)
- [x] Våg 5: `SmartTimePeriods` 07/12/18/22 + night dim (no ThemeManager)
- [x] Våg 6: `WidgetAiModes` + `pushCompanionAiSnapshot` (heuristics only)
- [x] Våg 7: Studio `smartAiEnabled` default **off** (opt-in) + re-lock MOD-WIDGET
- [ ] Pontus: G85 one-pass (Capture pin + Valv <3s) — see device-ready pack

## 2026-07-23 — Android CI ML Kit-fix

- [x] Bekräftat fel i GitHub Actions `Android CI` (`run 30008547997`): `IntelligenceManager.java` saknade ML Kit Language ID dependency
- [x] Lagt till `com.google.mlkit:language-id:17.0.6` i `/android/app/build.gradle`
- [x] Försökt lokal Android-validering (`./android/gradlew -p android lint assembleDebug test`)
- [ ] Verifiera grön Android CI efter nästa remote körning

## 2026-07-23 — Companion OS Hemskärm + Studio Gold (Våg 1–4)

Unlock: `2026-07-21-unlock-MOD-WIDGET-companion-android-interact.md` (`approved: yes`)

- [x] Våg 1: Capture/Note elev. + Compass/Beacon rich + Studio `--cw-bloom` + G85 pin-docs
- [x] Våg 2–3: Inbox/Tasks/Journal + Harbor/Anchor/Child rich RV (multi-PI / WIS)
- [x] Gate F: primära hit-targets ≥56 dp (note/harbor/tasks/CTA)
- [x] Soft bloom panel + inset well depth; waveform alpha vid recording
- [x] Smoke: companion-widgets · widgets · locked-ux · android compile **PASS**
- [x] YOLO: GO (widgets-only) — `docs/evaluations/2026-07-23-yolo-companion-os-gold-waves.md`
- [x] Våg 5+ Smart Time / Widget AI — **DEFER**
- [ ] Pontus: G85 pin Capture → ett mic-tryck → inspelning (visuell sign-off)
- [x] Merge: Gold Våg 1–4 already committed; Smart/AI waves unlocked 2026-07-23 + layouts/drawables/docs — **exkludera** dirty `android/.../core/**` tills separat review

## 2026-07-22 — Gold Standard hub + Companion parity (C + Ethereal Blue)

Unlock: [`evaluations/2026-07-22-unlock-hub-gold-standard-layout.md`](./evaluations/2026-07-22-unlock-hub-gold-standard-layout.md) (`approved: yes`)

- [x] Fas 0 unlock + docs
- [x] Fas 1 Companion web 10-pack Kap 6 deepen
- [x] Fas 1 Android layouts/drawables + v31 gold
- [x] Fas 2 `gs-hub-card` design-system skin
- [x] Fas 2 Dagbok + Fyren hub-skin
- [x] Fas 2 Fokus + Familjen hub-skin
- [x] Fas 3 ×15 specialist polish + PROGRESS
- [x] Smoke: companion-widgets · locked-ux · design-modules
- [ ] Pontus: G85 visual sign-off mot Gold Standard-mockuper

## 2026-07-22 — UI högerförskjutning + Projekt-look

- [x] Overflow-x lock (`html`/`body`/`#root`) + compass/watermarks `absolute` + `%` (inte `*vw`)
- [x] Återställd `.elongated-module` navy glass i `obsidian-calm-glass.css`
- [x] Projekt-tomstate: global `planering-tool-card.css` + bort dubbel `glow-bottom-gold`
- [x] Smoke: `smoke:design-modules` · `smoke:locked-ux` **PASS**
- [ ] Pontus: G85 visuellt — ingen högerpan, Projekt samma mörka look som Hem

## 2026-07-22 — Valvet Samla-lås + cleanup

- [x] Locked UX §2b (Inkast+Arkiv+Sök) + smoke guards
- [x] Modul-lås `MOD-VALV-SAMLA` + unlock-doc
- [x] Raderat orphan `ValvInboxZone.tsx`
- [x] Docs/README/module_plan route → `/valvet`
- [ ] Pontus: G85 Valv bakgrund &lt;3s

## 2026-07-22 — Valvet optimalitetshotfix

- [x] Fix: Inkast-läge dolde arkivlista + Valv-Chat (`vaultTab=sok`)
- [x] Fix: `firebaseAdmin` FieldValue → `smoke:dcap-alerts-worm` PASS
- [x] Docs: Verklighetsvalvet-SPEC route → `/valvet`
- [x] Smoke: valv-mode · locked-ux · dcap-alerts-worm · inbox · orkester PASS
- [ ] Pontus: G85 Valv bakgrund &lt;3s (Fas 24 P0)

## 2026-07-22 — Valvet full audit + 5 specialistagenter

- [x] Våg A: inventering UI/silo/synaps/DCAP/säkerhet
- [x] Eval: `docs/evaluations/2026-07-22-valvet-full-audit.md` **VERIFY PASS**
- [x] Våg B: 5 agenter (`specialist-valv-sjalvbygg-arkiv` … `kostnad-silo`) + auto-routing
- [x] Våg C: locked-ux · valv-* · pattern · cost-guard · entities · dossier · kunskap · inbox · orkester · gcp:audit-apis **PASS**
- [ ] Pontus: G85 Valv bakgrund &lt;3s + valfritt `smoke:predeploy:live`

## 2026-07-22 — Debug-runda

- [x] Lokal build + smoke:predeploy:build + G85 day1 Android verify
- [x] Browser runtime: Hem / Valvet / Familjen / Hjärtat
- [x] Fix: `ai_cost_log` composite indexes (costCapGuard) — fil + moln create
- [ ] Pontus: Android Studio Run på G85 — Valv bakgrund &lt;3s + Google-inloggning

## 2026-07-22 — Companion Kap. 6 ×10 Polish + legacy chip-rensning

Unlock: [`evaluations/2026-07-22-unlock-MOD-WIDGET-legacy-chip-removal.md`](./evaluations/2026-07-22-unlock-MOD-WIDGET-legacy-chip-removal.md) (`approved: yes`)

- [x] Kap. 6 ×10 polish — web 10-pack (`companion-widgets.css` + `WidgetTheme` 1.2) + Android companion layouts/drawables
- [x] Capture: 3 trust-rader (E2E / privat / endast du) · mic-ring deepen
- [x] Note: inset well ≥56dp · dock · pencil header
- [x] Insight/action: tracking + CTA ≥56dp · capacity ethereal ring
- [x] Legacy chip bort: `CompassWidgetProvider` · `HamnWidgetProvider` · `NoteWidgetProvider` (+ info XML + Manifest)
- [x] Behåll: Companion* · Record discreet · WH7/WH8/WH9 · Drogfrihet
- [x] Smoke: companion-widgets · widgets · locked-ux · module-lock · MOD-WIDGET re-locked

## 2026-07-22 — UI Polish V4 ×10 (hela appen)

> **FULL RE-RUN PASS** 2026-07-22 — andra varvet I1–I10 deepen + smoke:predeploy:build. G85 visual väntar Pontus.
>
> **PASS 3 ADD-only** 2026-07-22 — samma vågor igen (inget borttaget). UX guardian GO.
>
> **PASS 4 ADD-only** 2026-07-22 — samma vågor igen. UX guardian GO.
>
> **PASS 4 ADD-only** 2026-07-22 — Planering · Hjärtat/Dagbok · MåBra · QuickCapture · ArchiveShelf · KompassDiscovery (`min-h-11` + `focus-visible` + icon aria).

Unlock: [`evaluations/2026-07-22-unlock-MOD-UI-POLISH-V4-X10.md`](./evaluations/2026-07-22-unlock-MOD-UI-POLISH-V4-X10.md)

**Djup:** I1 kontrast+44 · I2 focus-visible · I3 focus-within · I4 reduced-m/t · I5 aria · I6 320px · I7 tokens · I8 empty · I9 motion · I10 micro

- [x] Pass 3 zone deepen W3–W11 — Speglar/Inkast/Drogfrihet/Hamn-BIFF/Valv UI/Inställningar/Widgets/Arbetsliv/MåBra (`min-h-11` + `focus-visible` + icon aria) — ADD only
- [x] Pass 4 zone deepen — Planering (7) · Dagbok/Hjärtat (8) · MåBra (8) · QuickCapture/Archive/KompassDiscovery (4) — ADD only

### Iteration checklist (W0–W11 × I1–I10)

#### I1
- [x] I1-W0 W0 Baseline
- [x] I1-W1 W1 Chrome
- [x] I1-W2 W2 Hem
- [x] I1-W3 W3 Vardagen
- [x] I1-W4 W4 MåBra
- [x] I1-W5 W5 Planering
- [x] I1-W6 W6 Arbetsliv
- [x] I1-W7 W7 Hjärtat
- [x] I1-W8 W8 Familjen
- [x] I1-W9 W9 Valvet
- [x] I1-W10 W10 Widgets
- [x] I1-W11 W11 Residual

#### I2
- [x] I2-W0 W0 Baseline
- [x] I2-W1 W1 Chrome
- [x] I2-W2 W2 Hem
- [x] I2-W3 W3 Vardagen
- [x] I2-W4 W4 MåBra
- [x] I2-W5 W5 Planering
- [x] I2-W6 W6 Arbetsliv
- [x] I2-W7 W7 Hjärtat
- [x] I2-W8 W8 Familjen
- [x] I2-W9 W9 Valvet
- [x] I2-W10 W10 Widgets
- [x] I2-W11 W11 Residual

#### I3
- [x] I3-W0 W0 Baseline
- [x] I3-W1 W1 Chrome
- [x] I3-W2 W2 Hem
- [x] I3-W3 W3 Vardagen
- [x] I3-W4 W4 MåBra
- [x] I3-W5 W5 Planering
- [x] I3-W6 W6 Arbetsliv
- [x] I3-W7 W7 Hjärtat
- [x] I3-W8 W8 Familjen
- [x] I3-W9 W9 Valvet
- [x] I3-W10 W10 Widgets
- [x] I3-W11 W11 Residual

#### I4
- [x] I4-W0 W0 Baseline
- [x] I4-W1 W1 Chrome
- [x] I4-W2 W2 Hem
- [x] I4-W3 W3 Vardagen
- [x] I4-W4 W4 MåBra
- [x] I4-W5 W5 Planering
- [x] I4-W6 W6 Arbetsliv
- [x] I4-W7 W7 Hjärtat
- [x] I4-W8 W8 Familjen
- [x] I4-W9 W9 Valvet
- [x] I4-W10 W10 Widgets
- [x] I4-W11 W11 Residual

#### I5
- [x] I5-W0 W0 Baseline
- [x] I5-W1 W1 Chrome
- [x] I5-W2 W2 Hem
- [x] I5-W3 W3 Vardagen
- [x] I5-W4 W4 MåBra
- [x] I5-W5 W5 Planering
- [x] I5-W6 W6 Arbetsliv
- [x] I5-W7 W7 Hjärtat
- [x] I5-W8 W8 Familjen
- [x] I5-W9 W9 Valvet
- [x] I5-W10 W10 Widgets
- [x] I5-W11 W11 Residual

#### I6
- [x] I6-W0 W0 Baseline
- [x] I6-W1 W1 Chrome
- [x] I6-W2 W2 Hem
- [x] I6-W3 W3 Vardagen
- [x] I6-W4 W4 MåBra
- [x] I6-W5 W5 Planering
- [x] I6-W6 W6 Arbetsliv
- [x] I6-W7 W7 Hjärtat
- [x] I6-W8 W8 Familjen
- [x] I6-W9 W9 Valvet
- [x] I6-W10 W10 Widgets
- [x] I6-W11 W11 Residual

#### I7
- [x] I7-W0 W0 Baseline
- [x] I7-W1 W1 Chrome
- [x] I7-W2 W2 Hem
- [x] I7-W3 W3 Vardagen
- [x] I7-W4 W4 MåBra
- [x] I7-W5 W5 Planering
- [x] I7-W6 W6 Arbetsliv
- [x] I7-W7 W7 Hjärtat
- [x] I7-W8 W8 Familjen
- [x] I7-W9 W9 Valvet
- [x] I7-W10 W10 Widgets
- [x] I7-W11 W11 Residual

#### I8
- [x] I8-W0 W0 Baseline
- [x] I8-W1 W1 Chrome
- [x] I8-W2 W2 Hem
- [x] I8-W3 W3 Vardagen
- [x] I8-W4 W4 MåBra
- [x] I8-W5 W5 Planering
- [x] I8-W6 W6 Arbetsliv
- [x] I8-W7 W7 Hjärtat
- [x] I8-W8 W8 Familjen
- [x] I8-W9 W9 Valvet
- [x] I8-W10 W10 Widgets
- [x] I8-W11 W11 Residual

#### I9
- [x] I9-W0 W0 Baseline
- [x] I9-W1 W1 Chrome
- [x] I9-W2 W2 Hem
- [x] I9-W3 W3 Vardagen
- [x] I9-W4 W4 MåBra
- [x] I9-W5 W5 Planering
- [x] I9-W6 W6 Arbetsliv
- [x] I9-W7 W7 Hjärtat
- [x] I9-W8 W8 Familjen
- [x] I9-W9 W9 Valvet
- [x] I9-W10 W10 Widgets
- [x] I9-W11 W11 Residual

#### I10
- [x] I10-W0 W0 Baseline
- [x] I10-W1 W1 Chrome
- [x] I10-W2 W2 Hem
- [x] I10-W3 W3 Vardagen
- [x] I10-W4 W4 MåBra
- [x] I10-W5 W5 Planering
- [x] I10-W6 W6 Arbetsliv
- [x] I10-W7 W7 Hjärtat
- [x] I10-W8 W8 Familjen
- [x] I10-W9 W9 Valvet
- [x] I10-W10 W10 Widgets
- [x] I10-W11 W11 Residual

- [ ] Pontus G85 spotcheck after each iteration (/, /vardagen, /hjartat, /familjen, /valvet, 1 widget) — **kod+smoke PASS; väntar Pontus öga**
- [x] I10 closeout: smoke:predeploy:build **PASS** + visual sign-off väntar Pontus

---

## 2026-07-22 — Gemini visual harvest (MOD-WIDGET)

- [x] Art: FacetedCompassRose / Lighthouse / Lotus / Anchor3D → Compass, Beacon, Harbor, DailyAnchor
- [x] Specular `.cw-card::after` + bible 6.2.1
- [x] Unlock `2026-07-22-unlock-MOD-WIDGET-gemini-visual-harvest.md`
- [ ] Pontus: Studio/Hem — kolla kompass-ros + fyren-bakgrund visuellt

## 2026-07-22 — Interaktiva Companion Widgets (WIS) — LÅST i MOD-WIDGET

- [x] 5 underagenter + skill + INTERACTIVE FIRST
- [x] Native WIS + bakgrundsinspelning + krypterad lokal store + export
- [x] Locked UX §23 / companion-os-lock / module-lock entryFiles utökade
- [x] smoke:companion-widgets + smoke:locked-ux WIS-asserts
- [ ] Pontus G85: fäst Capture/Note/Tasks → verifiera ingen full app-chrome

## 2026-07-22 — UI Polish v3 (alla zoner)

- [x] Wave 0 baseline smoke (design-debt, locked-ux, design-modules, calm-card)
- [x] Wave 1 Hem polish (touch/focus/kontrast; ej dock/kompass-struktur)
- [x] Wave 2 Vardagen/MåBra/Planering kontrast + touch gap-pass
- [x] Wave 3 Hjärtat Dagbok/Speglar kontrast
- [x] Wave 4 Familjen/Hamn/BIFF kontrast + reduced-transparency
- [x] Wave 5 Valv UI kontrast (WORM-logik orörd)
- [x] Wave 6 Widgets kontrast + touch
- [x] Wave 7 QuickCapture → DS Sheet (adHocDialog 3→2)
- [x] Unlock-eval `2026-07-22-unlock-MOD-UI-POLISH-V3.md`
- [x] Docs: TODO / DASHBOARD / PROGRESS / Completion-Criteria stickprov
- [ ] Pontus visual sign-off per zon (G85)
- [ ] Pontus: Android Studio → Run + Valv <3s bakgrund


## 2026-07-21 — Egna moduler (masterplan v2.2)

- [x] Pontus OK masterplan v2.2 «godkänn v2.2 kör hela planen»
- [x] W0 docs: contract + PMIR + unlock W1/W3 (ingen feature-UI)
- [x] W1–W5 feature: motor, Hem-slot, tab=bygg, pin-freeze, archive-first
- [x] Rules deploy user_widgets + module_media — Pontus «OK deploy» 2026-07-21
- [x] Kapacitetsgate evolution_hub + live-preview i Experimentera
- [ ] Manuell E2E: skapa modul → fäst Hem → syns under Hem (Pontus)
- [ ] Hosting-deploy av UI (valfritt — när Pontus säger «OK hosting»)
- [ ] Freeport canvas promote — deferred W5+/P1 (ej MVP-blocker)

## 2026-07-21 — SAFE YOLO v2 `ui-polish-v2-vardagen` (autopilot run)

- [x] Våg 2 scope klar: MåBra + Planering polish i `mabra.css`, `planering.css`, `compasses.css`, `vardagen.css` utan flödesändring.
- [x] Verifiering körd: `build` + `smoke:locked-ux` + `smoke:design-modules` + `smoke:mabra` + `smoke:predeploy:build`.


# Premium UI Polish — TODO

**Version:** 1.2 | **Last updated:** 2026-07-15


## 2026-07-17 — PROJECT_STATE v1.3 sync

- [x] Synka PROJECT_STATE v1.3 (marathon v40–v48, stubs, P0 G85 ej startad, single next)
- [x] Starta P0 G85 7-day daily driver (logga startdatum i PROJECT_STATE) — **2026-07-18 day 1**

---

Each item is independently completable. Link files in Dashboard when done.

---

## Phase 0 — Baseline

- [x] Record smoke:design-modules output in PROGRESS.md (2026-06-29)
- [x] Record smoke:locked-ux output in PROGRESS.md
- [x] Vite bundle split wave: lazy route-entry for `/valvet` + `/familjen` and verify build smoke (2026-06-28)
- [x] SAFE YOLO v2: expand `typecheck:core-strict` scope över `src/modules/features/` (2026-06-28)
- [x] Screenshot baseline: / @ 390×844 and 1280×800 (2026-06-29)
- [x] Screenshot baseline: /vardagen (2026-06-29)
- [x] Screenshot baseline: /planering (2026-06-29)
- [x] Screenshot baseline: /valvet (2026-06-29)
- [x] Screenshot baseline: /familjen (2026-06-29)
- [x] Screenshot baseline: /hjartat (2026-06-29)
- [x] Record btn-pill file count in Dashboard metrics (2026-06-29)
- [x] Add PR checklist to team workflow (Testing-Strategy.md)
- [x] Add delivery + safe git workflow docs (`DELIVERY_PLAN.md`, `GIT_WORKFLOW.md`)
- [x] Sync prompt mirrors in `docs/prompts/*` with `functions/src/sharedRules.ts` to keep `smoke:prompts` green (2026-06-29)

---

## Phase 1 — Tokens & motion

- [x] Audit hardcoded hex in src/index.css :root (document, do not break theme) — root theme colors are intentional; no theme change made (2026-06-29)
- [x] Add focus.ts tokens (--ds-focus-ring) — already exists (2026-06-29)
- [x] Add zIndex.ts tokens — already exists (2026-06-29)
- [x] Create src/design-system/motion/presets.ts — already exists (2026-06-29)
- [x] Create useDsReducedMotion hook — already exists (2026-06-29)
- [x] Sync ChameleonInputShell to --ds-duration-morph (2026-06-29)
- [x] Create DS Skeleton component — already exists (2026-06-29)
- [x] Create DS Spinner component — already exists (2026-06-29)
- [x] Write src/design-system/README.md — already exists (2026-06-29)
- [x] Verify tailwind.config.js ds-* bridge — complete (2026-06-29)
- [x] Run validate:session after token changes (2026-06-29)

---

## Phase 2 — Chrome

- [x] Premium Header — glass, float, hierarchy (AppHeaderBar) (2026-06-29)
- [x] Premium Header — BastaDesignHeader parity (2026-06-29)
- [x] Premium Dock — capsule, inner glow (ExecutiveDockBar) (2026-06-29)
- [x] Premium Dock — FloatingDock fallback theme (2026-06-29)
- [x] Premium Compass — SVG polish (HomeAdaptiveCompass) (2026-06-29)
- [x] Premium Compass — LivskompassMark stroke/glow (2026-06-29)
- [x] NavigationDrawer — gold active row (visual only) (2026-06-29)
- [x] AmbientBackground — depth layers (2026-06-29)
- [x] executive-chrome.css token pass (2026-06-29)
- [x] smoke:locked-ux after chrome batch (2026-06-29)
- [ ] Pontus visual sign-off compass

---

## Phase 3 — Primitives: Button migration

- [x] Batch: Planering module (~15 files) (2026-06-29 migration)
- [x] Batch: Inkast/Capture (~15 files) (2026-06-29 migration)
- [x] Batch: Valv (~20 files) (2026-06-29 migration)
- [x] Batch: MåBra (~25 files) (2026-06-29 migration)
- [x] Batch: Familjen (~20 files) (2026-06-29 migration)
- [x] Batch: Hjärtat/Dagbok (~15 files) (2026-06-29 migration)
- [x] Batch: Widgets (~10 files) (2026-06-29 migration)
- [x] Batch: Core auth/settings (~10 files) (2026-06-29 migration)
- [x] Batch: Remainder + CSS definition cleanup (2026-07-10)
- [x] ESLint/smoke: no new btn-pill-- in modules (btnPillFiles: 0, 2026-07-11)

## Phase 3 — Primitives: Other

- [x] Input: JournalQuickMode, ReflectionEditor (våg 24)
- [x] Input: EconomyLogPanel, inkast forms (våg 24)
- [x] Input: PlaneringNotePinPanel, InboxRuleManager, JournalArchiveToolbar (våg 28)
- [x] Input: Ekonomi/MåBra/Arbetsliv batch (våg 29)
- [x] Banner: deprecate AlertBanner usages (våg 25 — DS Banner wrapper)
- [x] Banner: deprecate ModuleSectionBanner usages (våg 25)
- [x] Card: document BentoCard as sole module API (våg 31)
- [x] UiCard: restrict to /dev routes (våg 31 — KompisHubPage → glass-card)
- [x] Badge: map worm/locked/risk to ds-badge (våg 25 + inbox status våg 31)

---

## Phase 4 — Overlays

- [x] Migrate ZenModeOverlay → DS Modal (våg 23)
- [x] Migrate RecoveryUrgeSosModule dialog (våg 23)
- [x] Migrate AccountAuthMenu dialog (våg 22)
- [x] Migrate PlanningTaskDetail dialog (våg 19 — redan DS Modal)
- [x] Migrate DrogfrihetHubPage dialog section (våg 23)
- [x] Evaluate ImmersiveExperienceShell → Modal (våg 27)
- [x] Fix/rename WormSaveConfirmSheet (våg 27 — role=region dokumenterat)
- [x] Keyboard test each migrated overlay (våg 27 + 33 checklist i PROGRESS)

---

## Phase 5 — States

- [x] Create ErrorFallback component — already exists in DS (2026-06-29)
- [x] Migrate HubErrorBoundary (våg 12)
- [x] Migrate PlaneringErrorBoundary (våg 12 — HubErrorBoundary glow=gold)
- [x] Migrate VaultErrorBoundary (våg 12 + våg 30 glow=blue explicit)
- [x] Migrate RAGErrorBoundary (våg 12 — DS ErrorFallback)
- [x] Migrate DagbokWizardErrorBoundary (våg 12 — DS ErrorFallback glow=gold)
- [x] Align PageSkeleton with DS Skeleton (2026-06-29)
- [x] EmptyState token pass (core/ui/EmptyState.tsx)
- [x] Friendly empty-states for Dagbok, Planering, Familjen list views

---

## Phase 6 — Zone: Hem + Vardagen

- [x] HomePage depth pass (2026-06-29) — executive hero/card depth pass complete
- [x] ExecutiveReflektionHero polish
- [x] Executive home cards (Livslogg, etc.)
- [x] LivLauncherPage bento grid
- [x] ClusterGrid module-card CSS localization
- [x] ReviewQueue status badge CSS localization
- [x] PlaneringPage (complete in-flight)
- [x] PlanningKanbanBoard (in-flight)
- [x] PlaneringInkorgPanel (in-flight)
- [x] InkorgPreviewSheet (in-flight)
- [x] CognitiveGuardView + banner (in-flight)
- [x] PlaneringFokusPanel (in-flight)
- [x] PlaneringParalysEntry (in-flight)
- [x] MåBra MabraHubView + layout
- [x] MåBra flow views
- [x] Ekonomi panels (EconomyPage, log, budget)
- [x] Arbetsliv hub + delegates
- [x] MorningCompass polish

---

## Phase 7 — Zone: Hjärtat + Familjen + Valv

- [x] DagbokInputSuperModule shell
- [x] Dagbok delegates (reflektion, tyst, burn)
- [x] SpeglarSuperModule
- [x] FamiljenPage + 6 tabs
- [x] FamiljenBarnfokusDelegate UI
- [x] Barnporten parent panels (not child fullscreen)
- [x] Trygg Hamn / Biff panels
- [x] VaultPage + zone tabs
- [x] ValvSamlaZone (in-flight)
- [x] WeaverPendingVaultBanner (in-flight)
- [x] VaultErrorBoundary (in-flight)
- [x] Remaining vault zones
- [x] DossierPage style-only pass
- [x] smoke:valv-security after Valv wave

---

## Phase 8 — Widgets + Android

- [x] WidgetShell polish
- [x] WidgetRecordPage
- [x] WidgetNotePage
- [x] WidgetCompassPage
- [x] WidgetHamnPage
- [x] WidgetFamiljenPage
- [x] WidgetStampPage
- [x] WidgetBarnportenPage
- [x] WidgetSnabbvalPage
- [x] WidgetVoiceVaultPage
- [x] WidgetProjektPage
- [x] WidgetActionDashboardPage
- [x] FyrenWidgetBar CSS localization into WidgetShell.css
- [x] smoke:widgets
- [x] WH1/WH2 Executive Midnight polish (discreet native + Inkast copy + WidgetShell panik 44px) — 2026-07-12
- [x] Våg 1 MOD-WIDGET polish — W1EdgeQuickDock executive + widget_bg_premium_panel + WH2 «Snabbanteckning» — 2026-07-14
- [x] G85 device re-verify WH1 tap→spara→Dölj nu + WH2 Inkast + W1 kant (Våg 2, Pontus) — 2026-07-14
- [x] Våg 3 W1 v2 kompakt strip — Theme Lab → prod (`/widget/projekt` + W1EdgeQuickDock) — 2026-07-14
- [x] Motorola G85 manual test pass

---

## Phase 9 — Testing infrastructure

- [x] Implement scripts/count_design_debt.mjs
- [x] Implement scripts/smoke_no_new_btn_pill.mjs
- [x] ESLint rule: warn btn-pill-- in modules
- [x] Optional: Playwright screenshot compare
- [x] Document results in Dashboard metrics

---

## Phase 10 — Legacy sunset (stretch)

- [x] Våg 35–42: Input batches Planering/Familjen/Hjärtat, Badge cleanup, titleHub/a11y, index sunset batch (2026-07-09)

- [x] Audit unused calm-card classes
- [x] Extract planering.css patterns to DS
- [x] Remove dead lab CSS from prod bundle
- [x] Reduce index.css toward 5000 LOC target (3837 LOC)
- [x] Deprecate shared/ui re-exports
- [x] Remove dead smart-bar / unlock-gate CSS from prod bundle
- [x] Remove dead nav-drawer calm-2 selector
- [x] Remove dead projekt-picker-sheet selectors
- [x] Remove dead ambient blob variants (indigo/white)
- [x] Remove dead btn-pill--primary selector
- [x] Remove dead pin-gate / input-glass--pin selectors
- [x] Remove dead glass-nav selector
- [x] Remove dead familjen-hub__aurora selectors
- [x] Remove dead mabra-vit-hub__quick selector
- [x] Remove dead dock-hub-band__context selector
- [x] Remove dead dock-hub-band__pad selector
- [x] Remove dead familjen-hub header/title/tabs selectors
- [x] Remove dead familjen-hub selector
- [x] Remove dead familjen-kunskap-panel selector
- [x] Remove dead kompis-hub-page__avatar selector
- [x] Remove dead kompis-hub-page__intro selector
- [x] Remove dead dock-center__label selector
- [x] Remove dead dock-classic__context-close selector
- [x] Remove dead dock-classic__context-title selector
- [x] Remove dead dock-classic__context-body selector
- [x] Remove dead dock-classic__context selector
- [x] Remove dead dock-classic__center:hover selector
- [x] Remove dead dock-classic__mark selector
- [x] Remove dead dock-classic__side--active label selector
- [x] Remove dead dock-classic__side--active selector
- [x] Remove dead dock-classic__side--active side-icon selector
- [x] Remove dead dock-classic__center--active selector
- [x] Remove dead dock-classic__center--holding selector
- [x] Remove dead dock-classic__center side-label selector
- [x] Remove dead dock-classic__center selector
- [x] Remove dead dock-classic__side-label selector
- [x] Remove dead dock-classic__side selector
- [x] Remove dead dock-classic__side-icon selector
- [x] Remove dead dock-classic selector
- [x] Remove dead dock-classic__plate selector
- [x] Remove dead hub-chrome-tile--side selector
- [x] Remove dead dock-nav-btn--active dock-nav-btn__chrome-v4 selector
- [x] Remove dead dock-nav-btn__glyph selector
- [x] Remove dead floating-dock__side-btn--planering selectors
- [x] Remove dead floating-dock__side-btn--dagbok selectors
- [x] Våg 111: legacy src/styles CSS stubs borttagna (design-packs, obsidian-calm-2, redesign-*, brushed-brass-neu)
- [x] Remove dead floating-dock__side-btn--vardag selectors
- [x] Remove dead dock-nav-btn__chrome-v5 selector from index.css

---

## Completion

- [ ] All Completion-Criteria.md sections checked *(partial — UI Polish v3 bockade 1.x/2.x/3.x/4 Sheet 2026-07-22)*
- [x] Dashboard all prod zones Done
- [x] smoke:predeploy:build green (2026-07-11)
- [x] yolo-vakt GO (MOD-WIDGET våg 4 — 2026-07-14)
- [ ] Pontus sign-off
- [x] Final PROGRESS.md entry *(UI Polish v3 2026-07-22)*

## 2026-07-12 — Android Studio YOLO våg
- Inkorg-flik touch + routing fix (GoraHubTabBar, TabBar)
- Liv och göra redirects (widgetSiloConfig, livLauncherRoutes, hemInkast)
- Android viewport CSS + smoke:android-viewport
- Docs: OFFLINE-ANDROID, FIREBASE-AUTH-LATHUND, .context/android-capacitor.md
- Smoke: android-platform, planering-gora-e, inkast-fas2, locked-ux, cost-guard PASS

- [x] MOD-WIDGET Standalone v1 — 5 vågor (skin, WH7, auth bypass) 2026-07-14
## 2026-07-14 — YOLO v41 GOVERNANCE sync
- [x] PROJECT_STATE synkad (v40 INTEGRATION GO + v41 governance)
- [x] LOCK-MANIFEST v1.17 — register ↔ entryFiles (22 moduler, 24 entryFiles)
- [x] `smoke:governance` + `smoke:module-lock` PASS
- [x] Eval: `docs/evaluations/2026-07-14-governance-v41.md`

## 2026-07-15 — Grok 4.5 Android App Check harden
- [x] Release nollställer debug-token (build.gradle) + BuildConfig.DEBUG bootstrap-gate
- [x] LkNativeBuildPlugin: JS aktiverar debug-provider endast när native DEBUG ∧ token
- [x] AppCheckDebugBootstrap: korrekt Firebase prefs-key + apply före WebView
- [x] smoke:android-platform utökad (release-clear, app-id-match, plugin, fail-closed)
- [x] Eval: `docs/evaluations/2026-07-15-grok45-android-appcheck-yolo.md`
- Smoke: `smoke:android-platform` PASS · `smoke:valv-security` PASS · `typecheck:core-strict` PASS
## 2026-07-17 — Valv kickout Android
- [x] Zero Footprint: native appStateChange + unlock-in-flight suppress
- [x] Eval: docs/evaluations/2026-07-17-valv-kickout-zero-footprint-android.md

## 2026-07-17 — G85 App Check live-harden
- [x] Vite prod strip + build assert mot debug-token i Hosting/APK-web
- [x] Release clearStaleDebugSecret (SharedPreferences)
- [x] appCheck debugTokenFromEnv DEV-only
- [x] smoke:android-platform: dist-leak + ZF appStateChange + vite-strip
- [x] Eval: docs/evaluations/2026-07-17-g85-appcheck-yolo.md

## 2026-07-18 — Fas 24 förbättringsplan (agent)

- [x] Pull origin + commit App Check/Valv-kickout
- [x] `cap sync` + `assembleDebug` (APK ready; USB device saknades)
- [x] App Check await på fler Valv-vägar + BuildConfig-first token path
- [x] MainActivity widget deep-link efter kallstart
- [x] A11y: reduced-transparency card fallback i premium-polish
- [x] Planering/Valv polish batch — inkorg/connect, pending-banner, focus-within, reduced-transparency (2026-07-20)
- [x] Valv PDF export a11y — explicit aria-label i arkivlistan (2026-07-20)
- [x] Valv a11y sweep — Escape i zonväljare + aria-label på mönster/Drive-CTA + contrast pass (2026-07-20)
- [x] MåBra UI polish — vit-hub chip/tile focus, touch-target, contrast + reduced-transparency fallback (2026-07-20)
- [x] YOLO app-wide UI polish Wave 1 — DS button touch-target, badge contrast, input/chip focus-visible, reduced-transparency fallback (2026-07-20)
- [x] YOLO app-wide UI polish Wave 2 — DS icon-button aria-label fallback via title (Button/ButtonLink) (2026-07-20)
- [x] YOLO app-wide UI polish Wave 3 — drawer/dock focus-visible, touch-target, small-label contrast (2026-07-20)
- [x] YOLO app-wide UI polish Wave 4 — nav-drawer sections + Planering routines + MåBra collapsible + Reflektion panel contrast/focus/touch-target pass (2026-07-20)
- [x] YOLO app-wide UI polish Wave 5 — dock hub/compass + Dagbok mode/handoff + adaptive-card focus/touch-target/contrast pass (2026-07-20)
- [x] YOLO app-wide UI polish Wave 6 — executive home/header + Obsidian shell/glass focus-visible, touch-target and small-text contrast pass (2026-07-20)
- [x] YOLO app-wide UI polish Wave 7 — dock center-label hardening och selector-säker polish i core chrome (2026-07-21)
- [x] YOLO app-wide UI polish Wave 8 — Home Layout A keyboard focus-visible polish (snabbval/tile/step/link/strip) i DS shell-lager (2026-07-21)
- [x] YOLO app-wide UI polish Wave 9 — Home Layout A hero-inset `:focus-visible` ring/contrast polish i DS shell-lager (2026-07-21)
- [x] YOLO app-wide UI polish Wave 10 — Home Layout A `:focus-within` polish för hero-card och tile i DS shell-lager (2026-07-21)
- [x] YOLO app-wide UI polish Wave 11 — Home Layout A reduced-motion polish (tar bort transition på interaktiva element vid `prefers-reduced-motion`) i DS shell-lager (2026-07-21)
- [x] YOLO app-wide UI polish Wave 12 — Home Layout A transition-token polish (snabbval/tile/link) i DS shell-lager (2026-07-21)
- [x] YOLO app-wide UI polish Wave 13 — Home Layout A strip transition-token + reduced-motion polish i DS shell-lager (2026-07-21)
- [x] YOLO app-wide UI polish Wave 14 — Home Layout A step-button transition-token polish i DS shell-lager (2026-07-21)
- [x] Livskompassen SAFE YOLO v2 — `ui-polish-v2-vardagen`: Vardagen/MåBra/Planering token+a11y+depth polish i `mabra.css`, `planering.css`, `compasses.css`, `vardagen.css` (focus-visible, touch target, reduced-motion/transparency, typografi; ingen flödesändring) (2026-07-21)
- [x] PMIR/defer dokumenterat i PROJECT_STATE (bygg ej utan Pontus OK)
- [ ] Pontus: Android Studio → Run + Valv <3s bakgrund (enhetsgate)
- [ ] Pontus visual sign-off compass (program Phase 10)
