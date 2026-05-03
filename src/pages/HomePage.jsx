import { Link } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import { useAppContext } from '../context/AppContext';

function HomePage({ doctors, loading, t }) {
  const { selectedDate, setSelectedDate } = useAppContext();

  return (
    <section className="space-y-5">
      <div className="rounded-[28px] bg-brand-600 p-6 text-white shadow-soft">
        <p className="text-sm font-semibold text-sky-100">{t('welcome')}</p>
        <p className="mt-3 text-base leading-7 text-sky-50">{t('clinicIntro')}</p>
      </div>

      <div className="grid gap-3">
        <div className="rounded-[28px] border border-white bg-white p-5 shadow-soft">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">{t('appointmentDate')}</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-semibold text-slate-900 outline-none transition focus:border-brand-500"
            />
          </label>
        </div>

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
