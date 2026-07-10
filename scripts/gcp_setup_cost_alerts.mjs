#!/usr/bin/env node
/**
 * Guidar setup av budget, avvikelser och kostnadslarm i GCP.
 * Usage: npm run gcp:setup-cost-alerts
 *
 * Skapar budget via gcloud om GCP_BILLING_ACCOUNT_ID är satt.
 * Annars: skriver exakta Console-steg för Pontus.
 */
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const MANIFEST = join(ROOT, 'infra/gcp/cost-guard/manifest.json');

function sh(cmd, allowFail = false) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    if (allowFail) return null;
    throw err;
  }
}

function main() {
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  const { budgetDefaults, projectId } = manifest;
  const billingAccount = process.env.GCP_BILLING_ACCOUNT_ID?.trim();
  const apply = process.argv.includes('--apply');

  console.log('\n=== Livskompassen — GCP Kostnadsvakt Setup ===\n');
  console.log(`Projekt: ${projectId}`);
  console.log(`Månadsbudget (rekommenderad): ${budgetDefaults.monthlyAmount} ${budgetDefaults.currency}`);
  console.log(`Avvikelse-trösklar: ${budgetDefaults.anomalyCostImpactSek} SEK / ${budgetDefaults.anomalyPercent}%\n`);

  console.log('--- Steg 1: Kostnadsavvikelser (Console) ---');
  console.log('1. Öppna: https://console.cloud.google.com/billing/anomalies');
  console.log(`2. Välj projekt ${projectId}`);
  console.log('3. Hantera avvikelser → Kostnadspåverkan + Avvikelse % enligt manifest');
  console.log('4. E-post: Daglig sammanfattning till Billing Admin\n');

  console.log('--- Steg 2: Månadsbudget (Console) ---');
  console.log('1. Öppna: https://console.cloud.google.com/billing/budgets');
  console.log(`2. Skapa budget ${budgetDefaults.monthlyAmount} ${budgetDefaults.currency}/månad`);
  console.log(`3. Larm vid: ${budgetDefaults.alertThresholdsPercent.join('%, ')}%`);
  console.log('4. Scope: endast detta projekt\n');

  if (billingAccount && apply) {
    console.log('--- Steg 3: Skapar budget via gcloud (--apply) ---');
    const budgetName = `Livskompassen ${budgetDefaults.monthlyAmount} ${budgetDefaults.currency}`;
    const thresholds = budgetDefaults.alertThresholdsPercent
      .map((pct) => `--threshold-rule=percent=${(pct / 100).toFixed(2)}`)
      .join(' ');
    sh(
      `gcloud billing budgets create --billing-account=${billingAccount} ` +
        `--display-name="${budgetName}" ` +
        `--budget-amount=${budgetDefaults.monthlyAmount}${budgetDefaults.currency} ` +
        `--filter-projects=projects/${projectId} ` +
        thresholds,
    );
    console.log('[gcp:setup-cost-alerts] Budget skapad via gcloud.');
  } else {
    console.log('--- Steg 3: Automatisk budget (valfritt) ---');
    console.log('Sätt GCP_BILLING_ACCOUNT_ID=XXXXXX-XXXXXX-XXXXXX och kör:');
    console.log('  npm run gcp:setup-cost-alerts -- --apply\n');
  }

  console.log('--- Steg 4: Veckovis API-audit ---');
  console.log('  npm run gcp:audit-apis -- --write-report\n');

  console.log('--- Steg 5: Kodskydd (redan i repo) ---');
  console.log('  npm run smoke:cost-guard  ( ingår i smoke:predeploy )\n');

  console.log('Kanon: docs/governance/GCP-KOSTNADSVAKT.md\n');
}

main();
