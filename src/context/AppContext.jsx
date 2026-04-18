import { createContext, useContext, useMemo, useState } from 'react';
import { translations } from '../services/translations';

const AppContext = createContext(null);

const initialCurrentUser = {
  name: 'Ko Min',
  age: '31',
  phone: '09 888 555 444',
};

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('my');
  const [currentUser, setCurrentUser] = useState(initialCurrentUser);

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      currentUser,
      setCurrentUser,
    }),
    [currentUser, language]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }

  return context;
}
