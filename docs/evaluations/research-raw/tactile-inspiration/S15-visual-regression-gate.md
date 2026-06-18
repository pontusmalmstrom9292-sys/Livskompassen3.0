# FP-TI-S15 — Playwright screenshot gate (förslag)

| Fält | Värde |
|------|-------|
| **Tag** | `FP-TI-S15` |
| **Datum** | 2026-06-18 |
| **Scope** | Sandbox endast — CI gate före prod-merge av FP-TI |
| **Kanonbild** | [`docs/design/references/FP-TI-REF-executive-5screen-canonical.png`](../../../design/references/FP-TI-REF-executive-5screen-canonical.png) |
| **Baseline-mapp** | `docs/design/references/fp-ti-baselines/` (planerad) |

---

## 1. Syfte

Automatisk pixel-jämförelse mellan sandbox FP-TI exact-panel och sparade baselines vid varje PR som rör `design-freeport.css` eller `src/modules/sandbox/**`.

**Tröskel:** max diff **2.0 %** per skärm (antal röda pixlar / totala pixlar).

---

## 2. Verktyg

| Paket | Version (förslag) | Syfte |
|-------|-------------------|-------|
| `@playwright/test` | `^1.49` | Browser automation |
| `pixelmatch` | `^6.0` | Diff-algoritm |
| `pngjs` | `^7.0` | PNG read/write |

**Nytt npm-script:** `smoke:fp-ti-visual` → `node scripts/visual/fp_ti_regression.mjs`

*Alternativ:* ren Playwright `toHaveScreenshot()` med `maxDiffPixelRatio: 0.02`.

---

## 3. Viewport & enhet

| Parameter | Värde |
|-----------|-------|
| `viewport` | `{ width: 390, height: 844 }` |
| `deviceScaleFactor` | `1` (logiska px) |
| `colorScheme` | `dark` |
| Browser | Chromium headless |
| Font loading | `await page.waitForFunction(() => document.fonts.ready)` |

---

## 4. Test-rutter

| ID | URL | Skärm | Baseline-fil |
|----|-----|-------|--------------|
| `fp-ti-hem` | `/dev/design-freeport?panel=exact&screen=hem` | HEM | `hem-390x844.png` |
| `fp-ti-ekonomi` | `…&screen=ekonomi` | EKONOMI | `ekonomi-390x844.png` |
| `fp-ti-resurser` | `…&screen=resurser` | RESURSER | `resurser-390x844.png` |
| `fp-ti-dagbok` | `…&screen=dagbok` | DAGBOK | `dagbok-390x844.png` |
| `fp-ti-installningar` | `…&screen=installningar` | INSTÄLLNINGAR | `installningar-390x844.png` |

**Förutsättning:** `panel=exact` implementeras i W2 (S8).

---

## 5. Playwright-spec (utkast)

```typescript
// tests/visual/fp-ti-exact.spec.ts
import { test, expect } from '@playwright/test';

const SCREENS = ['hem', 'ekonomi', 'resurser', 'dagbok', 'installningar'] as const;

test.describe('FP-TI exact match', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
  });

  for (const screen of SCREENS) {
    test(`screen ${screen} ≤2% diff`, async ({ page }) => {
      await page.goto(`/dev/design-freeport?panel=exact&screen=${screen}&theme=tactile-obsidian`);
      await page.waitForSelector('.design-freeport__exec-bottom-nav');
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('.design-freeport__phone--executive')).toHaveScreenshot(
        `${screen}-390x844.png`,
        { maxDiffPixelRatio: 0.02 },
      );
    });
  }
});
```

---

## 6. Node smoke (utan Playwright — fas 0)

```javascript
// scripts/visual/fp_ti_regression.mjs — static gate tills Playwright finns
mustInclude('src/styles/design-freeport.css', 'design-freeport__exec-card');
mustExist('docs/design/references/FP-TI-REF-executive-5screen-canonical.png');
// 5 baseline PNG — warn if missing, fail in W6
```

---

## 7. CI-integration

```yaml
# .github/workflows/fp-ti-visual.yml (förslag)
jobs:
  fp-ti-visual:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install chromium
      - run: npm run build
      - run: npx vite preview --port 4173 &
      - run: npx playwright test tests/visual/fp-ti-exact.spec.ts
```

**Trigger:** `paths: ['src/modules/sandbox/**', 'src/styles/design-freeport.css']`

---

## 8. Baseline-uppdatering

| Kommando | När |
|----------|-----|
| `npx playwright test --update-snapshots` | Medveten designändring + jury OK (S16) |
| PR-krav | 2 reviewer om diff > 2 % |

**Kanon PNG** (`FP-TI-REF-executive-5screen-canonical.png`) förblir mänsklig referens — baselines häärleds från sandbox, inte direkt från mockup.

---

## 9. Maskering (flaky-fix)

| Zon | Mask |
|-----|------|
| Klocka/status bar | `clip` till `.design-freeport__phone-scroll` |
| Dynamisk hälsning | Mocka `Date` till `2026-06-18T08:00:00` |
| Notis-badge | Dölj `.design-freeport__notify-btn` i test |

---

## 10. Acceptans

1. 5 screenshots genereras reproducerbart lokalt.
2. Diff ≤ 2 % på alla 5 i CI.
3. `smoke:fp-ti-visual` i `package.json`.
4. Baselines committade i `docs/design/references/fp-ti-baselines/`.
5. Ingen prod-route i test-scope.
