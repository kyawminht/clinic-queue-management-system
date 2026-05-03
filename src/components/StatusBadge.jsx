import { useTranslation } from '../hooks/useTranslation';

const badgeStyles = {
  not_started: 'bg-amber-100 text-amber-700',
  waiting: 'bg-amber-100 text-amber-700',
  serving: 'bg-emerald-100 text-emerald-700',
  done: 'bg-slate-200 text-slate-700',
};

function StatusBadge({ status }) {
  const { t } = useTranslation();
  const labels = {
    not_started: t('statusNotStarted'),
    waiting: t('statusWaiting'),
    serving: t('statusServing'),
    done: t('statusDone'),
  };

  return (
    <span
      className={`inline-flex rounded-full px-4 py-2 text-center text-sm font-bold leading-tight ${
        badgeStyles[status] || badgeStyles.waiting
      }`}
    >
      {labels[status] || labels.waiting}
    </span>
  );
}

export default StatusBadge;
