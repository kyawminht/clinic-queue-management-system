import { NavLink } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { usePwa } from '../hooks/usePwa';

const navigationItems = [
  { to: '/', key: 'navHome' },
  { to: '/status', key: 'navQueue' },
];

function AppShell({ children }) {
  const { language, setLanguage, t } = useTranslation();
  const {
    canInstall,
    promptInstall,
    pushSupported,
    notificationPermission,
    pushStatus,
    pushError,
    enablePushNotifications,
  } = usePwa();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(186,230,253,0.85),_transparent_45%),linear-gradient(180deg,_#f8fbff_0%,_#eff6ff_42%,_#ffffff_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-24 pt-0 sm:px-6">
        <header className="sticky top-0 z-40 mb-5 -mx-4 rounded-none border-y bg-brand-600  px-4 py-3 shadow-[0_14px_34px_rgba(15,23,42,0.12)] backdrop-blur-md sm:-mx-6 sm:rounded-[24px] sm:border sm:px-5 lg:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black text-white sm:text-xl">{t('clinicName')}</h1>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:justify-end">
              <div className="flex flex-wrap items-center gap-2">
                {canInstall ? (
                  <button
                    type="button"
                    onClick={promptInstall}
                    className="min-h-[44px] rounded-2xl bg-white/95 px-4 text-sm font-black text-brand-700 shadow-sm transition hover:bg-white"
                  >
                    {t('installApp')}
                  </button>
                ) : null}

             
              </div>

              {pushError ? (
                <div className="rounded-2xl bg-rose-500/15 px-4 py-2 text-xs font-bold text-rose-100 ring-1 ring-rose-200/30">
                  {pushError}
                </div>
              ) : null}

              <div className="grid w-full grid-cols-2 gap-2 rounded-2xl bg-sky-100 p-1.5 sm:w-auto sm:min-w-[250px] sm:rounded-full">
                <button
                  type="button"
                  onClick={() => setLanguage('my')}
                  className={`min-h-[44px] rounded-xl px-4 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-brand-300 sm:rounded-full sm:px-5 ${
                    language === 'my' ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-brand-700'
                  }`}
                >
                  {t('languageMyanmar')}
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`min-h-[44px] rounded-xl px-4 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-brand-300 sm:rounded-full sm:px-5 ${
                    language === 'en' ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-brand-700'
                  }`}
                >
                  {t('languageEnglish')}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <nav className="fixed bottom-0 left-0 right-0 border-t border-brand-100 bg-white/95 px-4 py-3 shadow-[0_-10px_30px_rgba(2,132,199,0.08)] backdrop-blur">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex h-14 items-center justify-center rounded-2xl px-2 text-center text-sm font-bold transition ${
                    isActive
                      ? 'bg-brand-600 text-white'
                      : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default AppShell;
