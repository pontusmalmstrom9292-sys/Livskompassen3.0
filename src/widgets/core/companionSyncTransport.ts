/**
 * companionSyncTransport — text / voice / photo (WIDGET_BIBLE 4.3).
 */

import { getAuth } from 'firebase/auth';
import { saveWidgetTextCapture } from '@/features/widgets/api/widgetSiloCapture';
import type { WidgetSiloId } from '@/features/widgets/config/widgetSiloConfig';
import type { WidgetSyncQueueItem } from './WidgetCache';
import type { WidgetSyncTransport } from './WidgetSync';
import { isCompanionPhotoPayload, uploadCompanionPhoto } from './companionPhotoUpload';
import { isCompanionVoicePayload, uploadCompanionVoice } from './companionVoiceUpload';
import { pushCompanionWidgetStatus, type CompanionAndroidScope } from './companionWidgetBridge';

function asSilo(value: unknown): WidgetSiloId {
  const allowed: WidgetSiloId[] = ['inkast', 'dagbok', 'bevis', 'barn', 'mabra', 'planering'];
  if (typeof value === 'string' && (allowed as string[]).includes(value)) {
    return value as WidgetSiloId;
  }
  return 'inkast';
}

/** Map queue source → Android chip scope (last_action_*). */
export function companionScopeFromSource(source: unknown): CompanionAndroidScope | undefined {
  const s = typeof source === 'string' ? source.toLowerCase() : '';
  if (!s) return undefined;
  if (s.includes('capture') || s.includes('quick_capture')) return 'capture';
  if (s.includes('inbox')) return 'inbox';
  if (s.includes('note') || s.includes('quick_note')) return 'note';
  if (s.includes('harbor')) return 'harbor';
  if (s.includes('compass')) return 'compass';
  if (s.includes('child') || s.includes('barn')) return 'child';
  if (s.includes('beacon') || s.includes('fyr')) return 'beacon';
  if (s.includes('journal') || s.includes('dagbok')) return 'journal';
  if (s.includes('anchor') || s.includes('ankare')) return 'anchor';
  if (s.includes('task') || s.includes('planering')) return 'tasks';
  return undefined;
}

function requireUid(override?: string | null): string {
  const auth = getAuth();
  const uid = override ?? auth.currentUser?.uid;
  if (!uid) throw new Error('auth_required');
  return uid;
}

export type CompanionSyncTransportOptions = {
  userId?: string | null;
};

export function createCompanionSyncTransport(
  opts?: CompanionSyncTransportOptions,
): WidgetSyncTransport {
  return async (item: WidgetSyncQueueItem) => {
    const payload =
      item.payload && typeof item.payload === 'object'
        ? (item.payload as Record<string, unknown>)
        : {};
    const scope = companionScopeFromSource(item.source);

    if (item.type === 'complete' || item.type === 'cancel') {
      if (item.type === 'complete') {
        pushCompanionWidgetStatus('Klart', scope);
      }
      return;
    }

    if (isCompanionVoicePayload(payload)) {
      const uid = requireUid(opts?.userId);
      await uploadCompanionVoice(uid, {
        ...payload,
        source: typeof item.source === 'string' ? item.source : payload.source,
      });
      pushCompanionWidgetStatus('Röst · Valvet', scope);
      return;
    }

    if (isCompanionPhotoPayload(payload)) {
      await uploadCompanionPhoto(payload);
      pushCompanionWidgetStatus('Foto · Inkast', scope);
      return;
    }

    const text = typeof payload.text === 'string' ? payload.text.trim() : '';
    const answer = typeof payload.answer === 'string' ? payload.answer.trim() : '';
    const body = text || (answer && answer !== '[röst]' ? answer : '');

    if (body) {
      const uid = requireUid(opts?.userId);
      const silo = asSilo(payload.silo);
      const childAlias =
        typeof payload.childAlias === 'string'
          ? payload.childAlias
          : silo === 'barn'
            ? 'Kasper'
            : undefined;
      await saveWidgetTextCapture(uid, silo, body, { childAlias });
      pushCompanionWidgetStatus(
        silo === 'barn'
          ? 'Barn · sparat'
          : silo === 'dagbok'
            ? 'Dagbok · sparat'
            : 'Text · sparat',
        scope,
      );
      return;
    }

    return;
  };
}
