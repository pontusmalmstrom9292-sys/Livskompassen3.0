// src/modules/shared/types/index.ts

export type Maybe<T> = T | null;

export type ApiResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };
