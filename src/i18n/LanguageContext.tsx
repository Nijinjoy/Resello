import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { strings, type Language } from './strings';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  isRTL: boolean;
  t: (typeof strings)[Language];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function deviceLanguage(): Language {
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale.startsWith('ar')
      ? 'ar'
      : 'en';
  } catch {
    return 'en';
  }
}

// In-app language choice. RTL is applied per screen with `direction` styles,
// so switching language does not need an app restart (unlike I18nManager).
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(deviceLanguage);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      isRTL: language === 'ar',
      t: strings[language],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return value;
}
