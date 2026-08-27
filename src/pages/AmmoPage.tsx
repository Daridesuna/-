import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { loadAmmo, type Ammo } from '../api/tarkov';
import QueryState from '../components/QueryState';

/** 貫通力からアーマークラス相当 (0〜6) を算出。tarkov.dev の弾薬チャートと同じ基準。 */
function penClass(pen: number): number {
  return Math.min(6, Math.floor(pen / 10));
}

function caliberLabel(caliber: string | null): string {
  if (!caliber) return 'その他';
  return caliber.replace(/^Caliber/, '');
}

type SortKey = 'damage' | 'penetrationPower' | 'armorDamage';

export default function AmmoPage() {
  const [caliber, setCaliber] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('penetrationPower');

  const query = useQuery({ queryKey: ['ammo'], queryFn: loadAmmo });

  const allAmmo = useMemo<Ammo[]>(() => query.data ?? [], [query.data]);

  const calibers = useMemo(() => {
    const set = new Map<string, string>();
    for (const a of allAmmo) {
      const key = a.caliber ?? 'other';
      set.set(key, caliberLabel(a.caliber));
    }
    return [...set.entries()].sort((x, y) => x[1].localeCompare(y[1]));
  }, [allAmmo]);

  const rows = useMemo(() => {
    const filtered =
      caliber === 'all'
        ? allAmmo
        : allAmmo.filter((a) => (a.caliber ?? 'other') === caliber);
    return [...filtered].sort((a, b) => b[sortKey] - a[sortKey]);
  }, [allAmmo, caliber, sortKey]);

  return (
    <section>
      <h1>弾薬性能一覧</h1>
      <p className="page-desc">
        全弾薬のダメージ・貫通力・アーマーダメージを比較できます。貫通力の色は貫通可能なアーマークラスの目安です。
      </p>
      <div className="filter-bar">
        <label>
          口径:
          <select value={caliber} onChange={(e) => setCaliber(e.target.value)}>
            <option value="all">すべて</option>
            {calibers.map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          並び順:
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="penetrationPower">貫通力が高い順</option>
            <option value="damage">ダメージが高い順</option>
            <option value="armorDamage">アーマーダメージが高い順</option>
          </select>
        </label>
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
                <th>弾薬</th>
                <th>口径</th>
                <th className="num">ダメージ</th>
                <th className="num">貫通力</th>
                <th className="num">アーマーDMG%</th>
                <th className="num">フラグ率</th>
                <th className="num">初速 m/s</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const damage = a.damage * (a.projectileCount ?? 1);
                return (
                  <tr key={a.item.id}>
                    <td>
                      <div className="item-cell">
                        {a.item.iconLink && (
                          <img
                            src={a.item.iconLink}
                            alt=""
                            loading="lazy"
                            className="item-icon"
                          />
                        )}
                        <span>
                          {a.item.wikiLink ? (
                            <a
                              href={a.item.wikiLink}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {a.item.name}
                            </a>
                          ) : (
                            a.item.name
                          )}
                          {a.tracer && <span className="badge">曳光弾</span>}
                        </span>
                      </div>
                    </td>
                    <td>{caliberLabel(a.caliber)}</td>
                    <td className="num">
                      {damage}
                      {(a.projectileCount ?? 1) > 1 && (
                        <span className="item-sub">
                          {' '}
                          ({a.damage}x{a.projectileCount})
                        </span>
                      )}
                    </td>
                    <td className="num">
                      <span className={`pen pen-${penClass(a.penetrationPower)}`}>
                        {a.penetrationPower}
                      </span>
                    </td>
                    <td className="num">{a.armorDamage}%</td>
                    <td className="num">
                      {Math.round(a.fragmentationChance * 100)}%
                    </td>
                    <td className="num">{a.initialSpeed ?? '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
