import { httpsCallable, type FunctionsError } from 'firebase/functions';
import { functions } from '@/core/firebase/init';

type SpeglingsMirrorResponse = { mirror?: unknown };

const speglingsMirrorCallable = httpsCallable<
  { reflection: string; mood?: string },
  SpeglingsMirrorResponse
>(functions, 'speglingsMirror');

function extractMirrorText(data: unknown): string {
  if (typeof data === 'string') return data.trim();
  if (!data || typeof data !== 'object') return '';
  const obj = data as Record<string, unknown>;
  const raw = obj.mirror ?? obj.mirrorLine ?? obj.text;
  if (typeof raw === 'string') return raw.trim();
  if (raw == null) return '';
  return String(raw).trim();
}

export function speglingsMirrorFailureCode(err: unknown): string {
  const fnErr = err as FunctionsError;
  const code = fnErr?.code ?? '';
  if (code === 'functions/unauthenticated' || code === 'unauthenticated') return 'unauthenticated';
  return 'unknown';
}

export async function fetchSpeglingsMirror(reflection: string, mood?: string): Promise<string> {
  const safeReflection = typeof reflection === 'string' ? reflection.trim() : '';
  if (!safeReflection) throw new Error('empty_reflection');
  const safeMood = typeof mood === 'string' && mood.trim() ? mood.trim() : undefined;

  const result = await speglingsMirrorCallable({ reflection: safeReflection, mood: safeMood });
  const mirror = extractMirrorText(result.data);
  if (!mirror) throw new Error('empty_mirror');
  return mirror;
}
