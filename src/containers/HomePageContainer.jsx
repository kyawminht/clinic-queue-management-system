import HomePage from '../pages/HomePage';
import { useDoctors } from '../hooks/useDoctors';
import { useTranslation } from '../hooks/useTranslation';

function HomePageContainer() {
  const { doctors, loading } = useDoctors();
  const { t } = useTranslation();

  return <HomePage doctors={doctors} loading={loading} t={t} />;
}

export default HomePageContainer;
