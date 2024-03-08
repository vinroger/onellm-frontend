import { useState, useCallback, useRef, useMemo } from "react";
import { useIsomorphicLayoutEffect } from "usehooks-ts";

export type AsyncStatusType = "IDLE" | "LOADING" | "COMPLETED" | "ERRORED";

export type UseAsyncHookReturnValue<T, E> = {
  execute: () => Promise<void>;
  status: AsyncStatusType;
  value: T | null;
  error: E | null;
  reset: () => void;
};

// This is a modified version of the hook found in: https://usehooks.com/useAsync/
const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  keepPreviousStateWhenLoading?: boolean
): UseAsyncHookReturnValue<T, E> => {
  const [status, setStatus] = useState<AsyncStatusType>("IDLE");
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);
  const asyncFunctionRef = useRef<() => Promise<T> | undefined>();

  useIsomorphicLayoutEffect(() => {
    asyncFunctionRef.current = asyncFunction;
  });

  const keepValue =
    keepPreviousStateWhenLoading == null ? false : keepPreviousStateWhenLoading;
  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(async () => {
    setStatus("LOADING");
    if (!keepValue) {
      setValue(null);
      setError(null);
    }

    try {
      if (asyncFunctionRef.current) {
        const response = await asyncFunctionRef.current?.();
        setValue(response as T);
        setStatus("COMPLETED");
      }
    } catch (promiseError) {
      setError(promiseError as E);
      setStatus("ERRORED");
    }
  }, [keepValue]);

  const reset = useCallback(() => {
    setStatus("IDLE");
    setError(null);
    setValue(null);
  }, []);

  const values = useMemo(() => {
    return { execute, status, value, error, reset };
  }, [error, execute, reset, status, value]);

  return values;
};

export default useAsync;
