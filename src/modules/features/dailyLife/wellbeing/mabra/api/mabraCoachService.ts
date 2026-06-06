import { httpsCallable } from 'firebase/functions';
import { functions } from '@/core/firebase/init';
import type { MabraProjectId } from '../constants/mabraProjects';
import type { MabraExerciseType, MabraSymptomHub } from '../types';

export type MabraCoachResult = {
  coach: string;
  redirectToSpeglar: boolean;
};

const mabraCoachCallable = httpsCallable<
  {
    hubSymptom: MabraSymptomHub;
    exerciseType: MabraExerciseType;
    optionalNote?: string;
  },
  { coach: string; redirectToSpeglar?: boolean }
>(functions, 'mabraCoach');

export async function fetchMabraCoach(
  hubSymptom: MabraSymptomHub,
  exerciseType: MabraExerciseType,
  optionalNote?: string,
): Promise<MabraCoachResult> {
  const result = await mabraCoachCallable({ hubSymptom, exerciseType, optionalNote });
  const coach = result.data?.coach;
  if (!coach?.trim()) throw new Error('Tomt måbra-coach-svar.');
  return {
    coach: coach.trim(),
    redirectToSpeglar: result.data?.redirectToSpeglar === true,
  };
}

const vitChatCallable = httpsCallable<
  {
    mode: 'vit_chat';
    projectId: MabraProjectId;
    vitMessage: string;
    seedPrompt?: string;
  },
  { coach: string; redirectToSpeglar?: boolean }
>(functions, 'mabraCoach');

/** P3 — Vit «Lär tillsammans» dialog (silo-guard, ingen RAG). */
export async function fetchVitChatCoach(
  projectId: MabraProjectId,
  vitMessage: string,
  seedPrompt?: string,
): Promise<MabraCoachResult> {
  const result = await vitChatCallable({
    mode: 'vit_chat',
    projectId,
    vitMessage,
    seedPrompt,
  });
  const coach = result.data?.coach;
  if (!coach?.trim()) throw new Error('Tomt vit-chat-svar.');
  return {
    coach: coach.trim(),
    redirectToSpeglar: result.data?.redirectToSpeglar === true,
  };
}
