import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { loadTasks } from '../api/tarkov';
import QueryState from '../components/QueryState';
import useDebouncedValue from '../hooks/useDebouncedValue';

export default function TasksPage() {
  const [trader, setTrader] = useState('all');
  const [kappaOnly, setKappaOnly] = useState(false);
  const [input, setInput] = useState('');
  const search = useDebouncedValue(input.trim().toLowerCase(), 300);

  const query = useQuery({ queryKey: ['tasks'], queryFn: loadTasks });

  const tasks = useMemo(() => query.data ?? [], [query.data]);

  const traders = useMemo(
    () => [...new Set(tasks.map((t) => t.trader.name))],
    [tasks],
  );

  const rows = useMemo(() => {
    return tasks.filter((t) => {
      if (trader !== 'all' && t.trader.name !== trader) return false;
      if (kappaOnly && !t.kappaRequired) return false;
      if (search && !t.name.toLowerCase().includes(search)) return false;
      return true;
    });
  }, [tasks, trader, kappaOnly, search]);

  return (
    <section>
      <h1>タスク一覧</h1>
      <p className="page-desc">
        全トレーダーのタスクを検索・フィルタできます。Kappa
        は、コレクターのタスク(Kappa コンテナ入手)に必要なタスクを示します。
      </p>
      <div className="filter-bar">
        <input
          type="search"
          className="search-input compact"
          placeholder="タスク名で絞り込み…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <label>
          トレーダー:
          <select value={trader} onChange={(e) => setTrader(e.target.value)}>
            <option value="all">すべて</option>
            {traders.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={kappaOnly}
            onChange={(e) => setKappaOnly(e.target.checked)}
          />
          Kappa 必須のみ
        </label>
        {query.isSuccess && <span className="count">{rows.length} 件</span>}
      </div>
      <QueryState
        isLoading={query.isPending}
        error={query.error}
        onRetry={() => query.refetch()}
      />
      {rows.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>タスク</th>
                <th>トレーダー</th>
                <th>マップ</th>
                <th className="num">必要Lv</th>
                <th className="num">経験値</th>
                <th>目標</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id}>
                  <td>
                    {t.wikiLink ? (
                      <a href={t.wikiLink} target="_blank" rel="noreferrer">
                        {t.name}
                      </a>
                    ) : (
                      t.name
                    )}
                    {t.kappaRequired && <span className="badge kappa">Kappa</span>}
                    {t.lightkeeperRequired && (
                      <span className="badge lk">Lightkeeper</span>
                    )}
                  </td>
                  <td>{t.trader.name}</td>
                  <td>{t.map?.name ?? '指定なし'}</td>
                  <td className="num">{t.minPlayerLevel || '-'}</td>
                  <td className="num">{t.experience.toLocaleString()}</td>
                  <td className="objectives">
                    <ul>
                      {t.objectives.map((o, i) => (
                        <li key={i}>{o.description}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {query.isSuccess && rows.length === 0 && (
        <div className="state-box">
          <p>条件に一致するタスクがありません。</p>
        </div>
      )}
    </section>
  );
}
