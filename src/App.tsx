import { NavLink, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'アイテム価格', end: true },
  { to: '/ammo', label: '弾薬性能' },
  { to: '/tasks', label: 'タスク' },
  { to: '/bosses', label: 'ボス出現率' },
  { to: '/status', label: 'サーバー状況' },
  { to: '/news', label: '最新情報' },
];

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="brand">
            <span className="brand-mark">EFT</span>
            <span className="brand-title">Tarkov 情報局</span>
          </div>
          <nav className="nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        データ提供:{' '}
        <a href="https://tarkov.dev" target="_blank" rel="noreferrer">
          tarkov.dev
        </a>{' '}
        (無料・オープンソースの Escape from Tarkov API)
      </footer>
    </div>
  );
}
