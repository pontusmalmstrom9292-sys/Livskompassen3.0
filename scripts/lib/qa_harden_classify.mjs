/**
 * Classify QA Harden findings into Tier A / B / C.
 */
export const TIER_A_CODES = new Set([
  'DUAL_SCROLL',
  'ISLAND_SCROLL_BLOCKED',
  'NO_SCROLL_SURFACE',
  'CRASH_OR_STUCK',
  'LOADING_STUCK',
  'TOUCH_TOO_SMALL',
  'TAP_FAIL',
  'PAGEERROR',
  'HUB_FAIL',
  'CTA_OVERLOAD',
  'SWEDISH_TYPO',
  'BANNED_COPY',
  'BUTTON_TOUCH',
  'BUTTON_COLOR_DRIFT',
  'WEIRD_UI',
]);

export const TIER_B_CODES = new Set([
  'WRONG_PATH',
  'DOCK_LABEL',
  'HEADER_STRUCTURE',
  'VALV_FLOW',
  'COMPANION_STRUCTURE',
  'LOCKED_UX_STRUCTURE',
  'ENGLISH_UI',
  'DEVICE_HARNESS',
]);

export const TIER_C_CODES = new Set([
  'RULES',
  'WORM',
  'GHOST',
  'STRONGBOX',
  'BIOMETRIC_BYPASS',
  'CROSS_RAG',
  'DEPLOY',
]);

const CTA_OVERLOAD_THRESHOLD = 6;

/**
 * @param {object} latest — qa-harden latest.json shape
 */
export function classifyFromLatest(latest) {
  const findings = [];

  const hub = latest?.probes?.hubSweep;
  if (hub?.failures?.length) {
    for (const f of hub.failures) {
      const code =
        f.status === 'loading-stuck'
          ? 'LOADING_STUCK'
          : f.status === 'auth-boundary'
            ? 'HUB_FAIL'
            : 'HUB_FAIL';
      findings.push({
        tier: 'A',
        code,
        source: 'hub-sweep',
        path: f.path,
        detail: f.status,
        swedish: `Sidan ${f.path} svarade fel (${f.status}).`,
      });
    }
  }

  const scroll = latest?.probes?.scrollProbe;
  if (scroll?.hardFails?.length) {
    for (const r of scroll.hardFails) {
      for (const code of r.hard) {
        findings.push({
          tier: 'A',
          code,
          source: 'scroll-probe',
          path: r.path,
          detail: r.issues.join(','),
          swedish: `Scrollproblem på ${r.path}: ${code}.`,
          recipe: code,
        });
      }
    }
  } else if (scroll?.routeIssues) {
    for (const r of scroll.routeIssues) {
      for (const code of r.hard || []) {
        findings.push({
          tier: 'A',
          code,
          source: 'scroll-probe',
          path: r.path,
          detail: r.issues.join(','),
          swedish: `Scrollproblem på ${r.path}: ${code}.`,
          recipe: code,
        });
      }
    }
  }

  const tap = latest?.probes?.tapPress;
  if (tap?.issues?.length) {
    for (const i of tap.issues) {
      const code = i.code || 'TAP_FAIL';
      const tier = TIER_B_CODES.has(code) ? 'B' : TIER_A_CODES.has(code) ? 'A' : 'A';
      findings.push({
        tier,
        code,
        source: 'tap-press',
        path: i.action,
        detail: i.detail,
        swedish:
          code === 'TOUCH_TOO_SMALL'
            ? `Tryckyta för liten: ${i.action} (${i.detail}).`
            : `Trycktest misslyckades: ${i.action} — ${i.detail}`,
        recipe: code === 'TOUCH_TOO_SMALL' ? 'TOUCH_TOO_SMALL' : undefined,
      });
    }
  }

  if (tap?.consoleErrors?.length) {
    for (const text of tap.consoleErrors.slice(0, 8)) {
      if (/insufficient permissions|auth\/network-request-failed|Anonymous sign-in/i.test(text)) {
        continue;
      }
      if (/PAGEERROR|Maximum update depth|getSnapshot should be cached/i.test(text)) {
        findings.push({
          tier: 'A',
          code: /Maximum update depth|getSnapshot/i.test(text) ? 'CRASH_OR_STUCK' : 'PAGEERROR',
          source: 'tap-press-console',
          path: '',
          detail: text.slice(0, 160),
          swedish: /Maximum update depth/i.test(text)
            ? 'En sida fastnade i en uppdaterings-loop (React).'
            : 'Sidan kastade ett fel i konsolen.',
          recipe: 'CRASH_OR_STUCK',
        });
      }
    }
  }

  const device = latest?.device;
  if (device?.status === 'fail') {
    const harnessOnly =
      device?.exhaustive?.harnessOnly === true ||
      /harness-timeout|TIMEOUT after|Target page, context or browser has been closed/i.test(
        String(device.detail || ''),
      );
    const zeroUi =
      device?.exhaustive?.issueCount === 0 ||
      /0 UI/i.test(String(device.detail || ''));
    // CDP/timeout with no product issues → Tier B (infra), not product Tier A
    if (harnessOnly && zeroUi) {
      findings.push({
        tier: 'B',
        code: 'DEVICE_HARNESS',
        source: 'device-probe',
        path: 'android',
        detail: device.detail || 'device harness timeout',
        swedish: `Telefon-crawl timeout utan UI-fel — kör om med USB eller höj QA_DEVICE_EXHAUSTIVE_TIMEOUT_MS.`,
      });
    } else {
      findings.push({
        tier: 'A',
        code: 'DEVICE_FAIL',
        source: 'device-probe',
        path: 'android',
        detail: device.detail || 'device fail',
        swedish: `Telefon-test misslyckades: ${device.detail || 'okänt'}.`,
      });
    }
  }

  const swedish = latest?.probes?.swedishStatic;
  if (swedish?.issues?.length) {
    for (const i of swedish.issues.slice(0, 40)) {
      const code = i.code || 'SWEDISH_TYPO';
      findings.push({
        tier: code === 'ENGLISH_UI' ? 'B' : 'A',
        code,
        source: 'swedish-static',
        path: i.path,
        detail: i.detail,
        swedish: i.swedish || `${code}: ${i.detail}`,
        recipe: code === 'SWEDISH_TYPO' ? 'SWEDISH_TYPO' : undefined,
      });
    }
  }

  const uiCon = latest?.probes?.uiConsistency;
  if (uiCon?.issues?.length) {
    for (const i of uiCon.issues.slice(0, 40)) {
      const code = i.code || 'BUTTON_TOUCH';
      findings.push({
        tier: code === 'ENGLISH_UI' ? 'B' : 'A',
        code,
        source: 'ui-consistency',
        path: i.path,
        detail: i.detail,
        swedish: i.swedish || `${code} på ${i.path}`,
        recipe: ['BUTTON_TOUCH', 'BUTTON_COLOR_DRIFT'].includes(code)
          ? 'BUTTON_PARITY'
          : code === 'SWEDISH_TYPO'
            ? 'SWEDISH_TYPO'
            : undefined,
      });
    }
  }

  // Cognitive proxy: too many primary CTAs counted in tap body snippets — optional future
  void CTA_OVERLOAD_THRESHOLD;

  const dedup = new Map();
  for (const f of findings) {
    const key =
      f.code === 'CRASH_OR_STUCK' || f.code === 'PAGEERROR'
        ? `${f.tier}:${f.code}:${/Maximum update depth|getSnapshot/i.test(f.detail || '') ? 'react-loop' : 'other'}`
        : `${f.tier}:${f.code}:${(f.path || '')}:${(f.detail || '').slice(0, 60)}`;
    if (!dedup.has(key)) dedup.set(key, f);
  }
  const unique = [...dedup.values()];

  const tierA = unique.filter((f) => f.tier === 'A');
  const tierB = unique.filter((f) => f.tier === 'B');
  const tierC = unique.filter((f) => f.tier === 'C');

  return { findings: unique, tierA, tierB, tierC };
}

export function swedishSummary(classified, meta = {}) {
  const lines = [
    `# QA Harden — ${meta.date || new Date().toISOString().slice(0, 10)}`,
    '',
    meta.round != null ? `**Omgång:** ${meta.round}` : '',
    `**Tier A (auto):** ${classified.tierA.length}`,
    `**Tier B (dig):** ${classified.tierB.length}`,
    `**Tier C (aldrig auto):** ${classified.tierC.length}`,
    '',
  ].filter(Boolean);

  if (classified.tierA.length) {
    lines.push('## Tier A — säkra fel');
    for (const f of classified.tierA) {
      lines.push(`- [${f.code}] ${f.swedish}`);
    }
    lines.push('');
  }
  if (classified.tierB.length) {
    lines.push('## Tier B — väntar på dig');
    for (const f of classified.tierB) {
      lines.push(`- [${f.code}] ${f.swedish}`);
    }
    lines.push('');
  }
  if (!classified.findings.length) {
    lines.push('Inga fynd. Webb-roboten såg inga Tier A/B-fel denna omgång.');
    lines.push('');
  }
  lines.push('## Nästa steg');
  if (classified.tierA.length) {
    lines.push('Kör `npm run qa:harden` igen (auto-fix försöker Tier A).');
  } else if (classified.tierB.length) {
    lines.push('Läs Tier B ovan och säg OK i Cursor om något ska ändras.');
  } else {
    lines.push('Valfritt: plugga in G85 och kör `npm run debug:device-probe`. Deploy kräver fortfarande `OK deploy`.');
  }
  return lines.join('\n');
}
