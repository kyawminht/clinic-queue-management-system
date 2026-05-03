import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';

function QueueStatusPage({
  latestAppointment,
  currentServingQueueNumber,
  started,
  selectedDate,
  setSelectedDate,
  t,
}) {
  if (!latestAppointment) {
    return (
      <section className="rounded-[28px] bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-black text-slate-900">{t('noAppointment')}</h2>
        <Link
          to="/"
          className="mt-5 flex h-14 items-center justify-center rounded-2xl bg-brand-600 text-center font-black text-white"
        >
          {t('bookAppointment')}
        </Link>
      </section>
    );
  }

  if (latestAppointment.status === 'done') {
    return (
      <section className="space-y-5">
        <div className="rounded-[32px] bg-emerald-600 p-6 text-white shadow-soft">
          <p className="text-sm font-semibold text-emerald-50">{t('thankYou')}</p>
          <h2 className="mt-2 text-2xl font-black">{t('statusDone')}</h2>
          <p className="mt-3 text-sm text-emerald-50">{t('appointmentDoneMessage')}</p>
        </div>

        <div className="rounded-[28px] border border-white bg-white p-5 shadow-soft">
          <p className="text-sm font-bold tracking-[0.08em] text-slate-500">{t('queueNumber')}</p>
          <p className="mt-3 text-6xl font-black leading-none text-emerald-600">{latestAppointment.queueNumber}</p>
        </div>

        <Link
          to="/"
          className="flex h-14 items-center justify-center rounded-2xl bg-brand-600 text-center font-black text-white shadow-lg shadow-sky-200"
        >
          {t('bookNextAppointment')}
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-5">
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

      {!started ? (
        <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5 shadow-soft">
          <p className="text-sm font-black text-amber-800">{t('doctorNotStarted')}</p>
          <p className="mt-1 text-sm font-medium text-amber-700">{t('doctorNotStartedHint')}</p>
        </div>
      ) : (
        <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5 shadow-soft">
          <p className="text-sm font-black text-emerald-800">{t('doctorStarted')}</p>
        </div>
      )}
      <div className="rounded-[32px] bg-brand-600 p-6 text-white shadow-soft">
        <p className="text-sm font-semibold text-sky-100">{t('myStatus')}</p>
        <h2 className="mt-2 text-2xl font-black">{latestAppointment.patientName}</h2>
        <p className="mt-2 text-sm text-sky-50">{latestAppointment.doctorName}</p>
        <p className="mt-1 text-sm text-sky-100">{t('time')}: {latestAppointment.slot}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[28px] border border-white bg-white p-5 shadow-soft">
          <p className="text-sm font-bold tracking-[0.08em] text-slate-500">{t('queueNumber')}</p>
          <p className="mt-3 text-6xl font-black leading-none text-brand-600">
            {latestAppointment.queueNumber}
          </p>
        </article>

        <article className="rounded-[28px] border border-white bg-white p-5 shadow-soft">
          <p className="text-sm font-bold tracking-[0.08em] text-slate-500">{t('currentServing')}</p>
          <p className="mt-3 text-6xl font-black leading-none text-slate-900">
            {currentServingQueueNumber}
          </p>
        </article>
      </div>

      <div className="rounded-[28px] border border-white bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-500">{t('estimatedWaiting')}</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{latestAppointment.estimatedWait}</p>
          </div>
          <StatusBadge status={latestAppointment.status} />
        </div>
      </div>

      <div className="rounded-[28px] border border-brand-100 bg-white p-5 shadow-soft">
        <p className="text-base font-black text-slate-900">{t('easyGuide')}</p>
        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl bg-brand-50 p-4">
            <p className="font-bold text-brand-700">{t('statusWaiting')}</p>
            <p className="text-sm text-slate-600">{t('guideWaiting')}</p>
          </div>
          <div className="rounded-2xl bg-brand-50 p-4">
            <p className="font-bold text-brand-700">{t('statusServing')}</p>
            <p className="text-sm text-slate-600">{t('guideServing')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QueueStatusPage;
