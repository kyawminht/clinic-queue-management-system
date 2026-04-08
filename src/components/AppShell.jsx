import { NavLink } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const navigationItems = [
  { to: '/', key: 'navHome' },
  { to: '/status', key: 'navQueue' },
];

function AppShell({ children }) {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(186,230,253,0.85),_transparent_45%),linear-gradient(180deg,_#f8fbff_0%,_#eff6ff_42%,_#ffffff_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-24 pt-5 sm:px-6">
        <header className="mb-6 rounded-[28px] border border-white/70 bg-white/85 p-4 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-600">{t('appBrand')}</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">{t('appTitle')}</h1>
              <p className="mt-2 text-sm text-slate-600">{t('appTagline')}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-brand-50 p-2">
              <button
                type="button"
                onClick={() => setLanguage('my')}
                className={`h-12 rounded-2xl text-sm font-bold transition ${
                  language === 'my' ? 'bg-brand-600 text-white' : 'bg-white text-brand-700'
                }`}
              >
                {t('languageMyanmar')}
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`h-12 rounded-2xl text-sm font-bold transition ${
                  language === 'en' ? 'bg-brand-600 text-white' : 'bg-white text-brand-700'
                }`}
              >
                {t('languageEnglish')}
              </button>
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
