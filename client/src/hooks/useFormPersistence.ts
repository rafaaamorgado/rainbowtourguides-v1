import { useEffect, useCallback, useRef } from "react";

interface FormPersistenceOptions<T> {
  key: string;
  data: T;
  expirationMinutes?: number;
  debounceMs?: number;
}

interface StoredData<T> {
  data: T;
  timestamp: number;
}

export function useFormPersistence<T>({
  key,
  data,
  expirationMinutes = 60,
  debounceMs = 500,
}: FormPersistenceOptions<T>) {
  const debounceTimer = useRef<NodeJS.Timeout>();

  const saveToStorage = useCallback((dataToSave: T) => {
    try {
      const stored: StoredData<T> = {
        data: dataToSave,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(stored));
    } catch (error) {
      console.error("Failed to save form data:", error);
    }
  }, [key]);

  const loadFromStorage = useCallback((): T | null => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const parsed: StoredData<T> = JSON.parse(stored);
      const expirationMs = expirationMinutes * 60 * 1000;
      const isExpired = Date.now() - parsed.timestamp > expirationMs;

      if (isExpired) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error("Failed to load form data:", error);
      return null;
    }
  }, [key, expirationMinutes]);

  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to clear form data:", error);
    }
  }, [key]);

  // Debounced save on data change
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      saveToStorage(data);
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [data, debounceMs, saveToStorage]);

  return {
    loadFromStorage,
    clearStorage,
  };
}

export function getStoredFormData<T>(key: string, expirationMinutes: number = 60): T | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const parsed: StoredData<T> = JSON.parse(stored);
    const expirationMs = expirationMinutes * 60 * 1000;
    const isExpired = Date.now() - parsed.timestamp > expirationMs;

    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error("Failed to load stored form data:", error);
    return null;
  }
}

export function clearStoredFormData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to clear stored form data:", error);
  }
}
