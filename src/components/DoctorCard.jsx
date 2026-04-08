import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

function DoctorCard({ doctor }) {
  const { t } = useTranslation();

  return (
    <article className="rounded-[28px] border border-white bg-white p-5 shadow-soft">
      <div className="flex items-center gap-4">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="h-20 w-20 rounded-full object-cover ring-4 ring-brand-50"
        />
        <div>
          <h2 className="text-lg font-black text-slate-900">{doctor.name}</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">{t(doctor.specialtyKey)}</p>
        </div>
      </div>

      <Link
        to={`/booking/${doctor.id}`}
        className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-brand-600 text-base font-bold text-white shadow-lg shadow-sky-200 transition hover:bg-brand-700"
      >
        {t('bookAppointment')}
      </Link>
    </article>
  );
}

export default DoctorCard;
