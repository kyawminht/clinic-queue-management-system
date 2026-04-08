import { Link } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import { useDoctors } from '../hooks/useDoctors';
import { useTranslation } from '../hooks/useTranslation';

function HomePage() {
  const { doctors, loading } = useDoctors();
  const { t } = useTranslation();

  return (
    <section className="space-y-5">
      <div className="rounded-[28px] bg-brand-600 p-6 text-white shadow-soft">
        <p className="text-sm font-semibold text-sky-100">{t('welcome')}</p>
        <h2 className="mt-2 text-3xl font-black">{t('clinicName')}</h2>
        <p className="mt-3 text-base leading-7 text-sky-50">{t('clinicIntro')}</p>
      </div>

      <div className="grid gap-3">
        <div className="rounded-[28px] border border-brand-100 bg-white p-5 shadow-soft">
          <h3 className="text-lg font-black text-slate-900">{t('threeSteps')}</h3>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl bg-brand-50 p-4">
              <p className="text-base font-black text-brand-700">{t('step1')}</p>
            </div>
            <div className="rounded-2xl bg-brand-50 p-4">
              <p className="text-base font-black text-brand-700">{t('step2')}</p>
            </div>
            <div className="rounded-2xl bg-brand-50 p-4">
              <p className="text-base font-black text-brand-700">{t('step3')}</p>
            </div>
          </div>
        </div>

        <Link
          to="/status"
          className="flex h-14 items-center justify-center rounded-2xl bg-white text-center text-base font-black text-brand-700 shadow-soft"
        >
          {t('checkQueue')}
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-black text-slate-900">{t('doctors')}</h3>
          <p className="text-sm text-slate-500">
            {loading ? t('loading') : `${doctors.length} ${t('availableSuffix')}`}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomePage;
