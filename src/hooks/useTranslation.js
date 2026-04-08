import { useAppContext } from '../context/AppContext';

export function useTranslation() {
  const { language, setLanguage, t } = useAppContext();

  return {
    language,
    setLanguage,
    t,
    isMyanmar: language === 'my',
    isEnglish: language === 'en',
  };
}
