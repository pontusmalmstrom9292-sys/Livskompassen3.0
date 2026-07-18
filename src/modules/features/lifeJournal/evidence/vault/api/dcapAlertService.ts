import { httpsCallable, type FunctionsError } from 'firebase/functions';
import { functions } from '@/core/firebase/init';
import { withVaultSessionPayloadReady } from '@/core/auth/vaultServerSession';

export type DcapReviewDecision = 'acknowledged' | 'dismissed';

const resolveDcapAlertCallable = httpsCallable<
  { alertId: string; decision: DcapReviewDecision; vaultSessionToken?: string },
  { reviewId: string; alreadyReviewed: boolean }
>(functions, 'resolveDcapAlert');

export async function resolveDcapAlert(
  alertId: string,
  decision: DcapReviewDecision = 'acknowledged',
): Promise<{ reviewId: string; alreadyReviewed: boolean }> {
  try {
    const result = await resolveDcapAlertCallable(
      await withVaultSessionPayloadReady({ alertId, decision }),
    );
    return result.data;
  } catch (error) {
    const fnError = error as FunctionsError;
    throw new Error(fnError.message || 'Kunde inte markera larm som granskat.');
  }
}
