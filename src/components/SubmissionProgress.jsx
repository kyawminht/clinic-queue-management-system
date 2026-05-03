import { useSubmissions } from '../context/SubmissionContext';

function statusLabel(status) {
  if (status === 'queued') return 'Queued';
  if (status === 'pending') return 'Sending';
  if (status === 'complete') return 'Complete';
  if (status === 'failed') return 'Failed';
  return status;
}

function statusClasses(status) {
  if (status === 'failed') return 'bg-rose-50 text-rose-700 border-rose-200';
  if (status === 'queued') return 'bg-amber-50 text-amber-800 border-amber-200';
  if (status === 'pending') return 'bg-sky-50 text-sky-800 border-sky-200';
  return 'bg-slate-50 text-slate-700 border-slate-200';
}

export default function SubmissionProgress({ formKey, label = 'Submitting', maxDisplay = 3 }) {
  const { getSubmissions, removeSubmission, retrySubmission, isOnline } = useSubmissions();
  const submissions = getSubmissions(formKey);

  const active = submissions.filter((item) => item.status === 'pending').slice(0, maxDisplay);
  const queued = submissions.filter((item) => item.status === 'queued').slice(0, maxDisplay);
  const failed = submissions.filter((item) => item.status === 'failed').slice(0, maxDisplay);

  if (submissions.length === 0) return null;

  return (
    <section className="space-y-3">
      {!isOnline ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          You&apos;re offline. Submissions will queue and retry when back online.
        </div>
      ) : null}

      {isOnline && queued.length > 0 ? (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-800">
          Back online. Resuming queued submissions…
        </div>
      ) : null}

      {active.length > 0 ? (
        <div className="rounded-2xl border border-sky-200 bg-white p-4 shadow-soft">
          <p className="text-sm font-black text-slate-900">{label}</p>
          <div className="mt-3 space-y-2">
            {active.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="min-w-0 truncate text-sm font-bold text-slate-800">
                    {item.title || item.name || 'Submitting…'}
                  </p>
                  <span className="shrink-0 rounded-full border px-2 py-0.5 text-xs font-bold text-slate-700">
                    {statusLabel(item.status)}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-brand-600 transition-all"
                    style={{ width: `${Math.max(5, Math.min(100, item.progress || 0))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {queued.length > 0 ? (
        <div className="space-y-2">
          {queued.map((item) => (
            <div key={item.id} className="rounded-2xl border border-amber-200 bg-white p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-900">{item.title || item.name || 'Queued'}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">Will send when online</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-black ${statusClasses(item.status)}`}>
                  {statusLabel(item.status)}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => removeSubmission(formKey, item.id)}
                  className="h-9 rounded-xl bg-slate-100 px-3 text-xs font-black text-slate-700 hover:bg-slate-200"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {failed.length > 0 ? (
        <div className="space-y-2">
          {failed.map((item) => (
            <div key={item.id} className="rounded-2xl border border-rose-200 bg-white p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-900">{item.title || item.name || 'Failed'}</p>
                  <p className="mt-1 text-xs font-semibold text-rose-600">{item.error || 'Submission failed'}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-black ${statusClasses(item.status)}`}>
                  {statusLabel(item.status)}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => retrySubmission(formKey, item.id)}
                  className="h-9 rounded-xl bg-brand-600 px-3 text-xs font-black text-white hover:bg-brand-700"
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={() => removeSubmission(formKey, item.id)}
                  className="h-9 rounded-xl bg-slate-100 px-3 text-xs font-black text-slate-700 hover:bg-slate-200"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

