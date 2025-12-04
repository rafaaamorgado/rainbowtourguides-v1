import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "es" | "fr" | "de" | "pt";
export type Currency = "USD" | "EUR" | "GBP" | "AUD";

interface Preferences {
  language: Language;
  currency: Currency;
}

interface PreferencesContextType extends Preferences {
  setLanguage: (language: Language) => void;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amount: number) => string;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const PREFERENCES_KEY = "user_preferences";

const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
};

const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  AUD: 1.52,
};

function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return "en";

  const browserLang = navigator.language.split("-")[0].toLowerCase();
  const supportedLanguages: Language[] = ["en", "es", "fr", "de", "pt"];

  if (supportedLanguages.includes(browserLang as Language)) {
    return browserLang as Language;
  }

  return "en";
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>({
    language: "en",
    currency: "USD",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences(parsed);
      } else {
        const detectedLanguage = detectBrowserLanguage();
        setPreferences(prev => ({ ...prev, language: detectedLanguage }));
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
    }
  }, []);

  const savePreferences = (newPreferences: Preferences) => {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  };

  const setLanguage = (language: Language) => {
    savePreferences({ ...preferences, language });
  };

  const setCurrency = (currency: Currency) => {
    savePreferences({ ...preferences, currency });
  };

  const formatPrice = (amountUSD: number): string => {
    const converted = amountUSD * EXCHANGE_RATES[preferences.currency];
    const symbol = CURRENCY_SYMBOLS[preferences.currency];

    return `${symbol}${Math.round(converted)}`;
  };

  return (
    <PreferencesContext.Provider
      value={{
        ...preferences,
        setLanguage,
        setCurrency,
        formatPrice,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}

export { LANGUAGE_NAMES, CURRENCY_SYMBOLS };
