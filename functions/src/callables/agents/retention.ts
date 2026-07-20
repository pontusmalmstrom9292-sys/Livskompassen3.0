import { onSchedule } from 'firebase-functions/v2/scheduler';

export const scheduledRetentionJob = onSchedule(
  { schedule: '0 3 * * *', timeZone: 'Europe/Stockholm', region: 'europe-west1' },
  async (_event) => {
    console.log('[scheduledRetentionJob] Startar GDPR-rensning...');
    const { default: runRetention } = await import('../../jobs/retentionJob');
    if (typeof runRetention === 'function') {
      await runRetention();
    }
    console.log('[scheduledRetentionJob] Klar.');
  }
);
