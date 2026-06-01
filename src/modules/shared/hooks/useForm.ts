import { useCallback, useState } from 'react';

export type UseFormOptions<T extends Record<string, string>> = {
  initialValues: T;
};

export function useForm<T extends Record<string, string>>({
  initialValues,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);

  const setField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  return { values, setField, reset, setValues };
}
