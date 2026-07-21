/**
 * WidgetPermissions — on-demand mic/camera only (WIDGET_BIBLE 3.2).
 * Never request until the feature is actually invoked.
 */

export type WidgetPermissionKind = 'microphone' | 'camera';

export type WidgetPermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

export type WidgetPermissionResult = {
  kind: WidgetPermissionKind;
  state: WidgetPermissionState;
};

function mapPermissionState(state: PermissionState | 'unsupported'): WidgetPermissionState {
  if (state === 'unsupported') return 'unsupported';
  if (state === 'granted') return 'granted';
  if (state === 'denied') return 'denied';
  return 'prompt';
}

export async function queryWidgetPermission(
  kind: WidgetPermissionKind,
): Promise<WidgetPermissionResult> {
  if (typeof navigator === 'undefined' || !navigator.permissions?.query) {
    return { kind, state: 'unsupported' };
  }
  const name = kind === 'microphone' ? 'microphone' : 'camera';
  try {
    const status = await navigator.permissions.query({ name: name as PermissionName });
    return { kind, state: mapPermissionState(status.state) };
  } catch {
    return { kind, state: 'prompt' };
  }
}

/**
 * Request microphone only when recording starts.
 * Returns a live MediaStream or throws a quiet, typed error.
 */
export async function requestWidgetMicrophone(): Promise<MediaStream> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw new Error('microphone_unsupported');
  }
  return navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
    video: false,
  });
}

/** Request camera only when photo capture starts. */
export async function requestWidgetCamera(): Promise<MediaStream> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw new Error('camera_unsupported');
  }
  return navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { facingMode: 'environment' },
  });
}

/** Stop all tracks — Zero Footprint helper after capture ends. */
export function releaseMediaStream(stream: MediaStream | null | undefined): void {
  if (!stream) return;
  stream.getTracks().forEach((t) => {
    try {
      t.stop();
    } catch {
      /* ignore */
    }
  });
}

/**
 * Ensure permission then open stream. Queries first; only prompts on use.
 */
export async function ensureWidgetMedia(
  kind: WidgetPermissionKind,
): Promise<{ stream: MediaStream; permission: WidgetPermissionResult }> {
  const permission = await queryWidgetPermission(kind);
  if (permission.state === 'denied') {
    throw new Error(`${kind}_denied`);
  }
  const stream = kind === 'microphone' ? await requestWidgetMicrophone() : await requestWidgetCamera();
  return {
    stream,
    permission: { kind, state: 'granted' },
  };
}
