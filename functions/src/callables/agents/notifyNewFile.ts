import { onRequest } from 'firebase-functions/v2/https';
import { adkOrchestrator } from '../../adk';
import { emitSynapse } from '../../adk/synapses/synapseBus';

export const notifyNewFile = onRequest(
  {
    region: 'europe-west1',
    secrets: ['NOTIFY_WEBHOOK_SECRET'],
    timeoutSeconds: 300,
    memory: '512MiB',
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const isProduction = process.env.FUNCTIONS_EMULATOR !== 'true';
    const webhookSecret = process.env.NOTIFY_WEBHOOK_SECRET;

    if (isProduction && !webhookSecret) {
      console.error('[notifyNewFile] NOTIFY_WEBHOOK_SECRET saknas — endpoint stängd (fail-closed)');
      res.status(503).send('Service Unavailable');
      return;
    }

    if (webhookSecret) {
      const provided = req.get('X-Livskompassen-Webhook-Secret');
      if (provided !== webhookSecret) {
        res.status(401).send('Unauthorized');
        return;
      }
    }

    const { fileId, fileName, mimeType } = req.body;
    const ownerId =
      typeof req.body.ownerId === 'string' && req.body.ownerId.trim()
        ? req.body.ownerId.trim()
        : typeof req.body.ownerUid === 'string' && req.body.ownerUid.trim()
          ? req.body.ownerUid.trim()
          : undefined;
    const optInTrauma = req.body.optInTrauma === true;
    const dryRun = req.body.dryRun === true;

    if (!fileId || !fileName || !mimeType) {
      res.status(400).send('Missing fileId, fileName or mimeType');
      return;
    }

    // U1/G10: ownerId krävs i prod — body-only spoof utan uid = fail-closed.
    // Drive ACL ownership-bind (fileId → Drive owner) är Pontus/ops follow-up (PMIR).
    if (isProduction && !ownerId) {
      console.error(`[notifyNewFile] ownerId saknas för fileId=${fileId} — avvisad`);
      res.status(400).send('Missing ownerId');
      return;
    }

    try {
      const result = await emitSynapse(adkOrchestrator, {
        trigger: 'drive_file_ingested',
        payload: { fileId, fileName, mimeType, ownerId, optInTrauma, dryRun },
      });

      res.status(200).send(
        dryRun
          ? { status: 'Dry-run complete', fileId, ...(typeof result === 'object' && result ? result : {}) }
          : { status: 'Processing complete', fileId }
      );
    } catch (error) {
      console.error(`[notifyNewFile] Pipeline fel fileId=${fileId} fileName=${fileName}:`, error);
      res.status(500).send('Pipeline failed');
    }
  });
