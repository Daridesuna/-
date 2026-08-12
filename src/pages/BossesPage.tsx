import { useQuery } from '@tanstack/react-query';
import { fetchGraphQL, MAPS_QUERY, type MapInfo } from '../api/tarkov';
import QueryState from '../components/QueryState';

function chancePercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export default function BossesPage() {
  const query = useQuery({
    queryKey: ['maps'],
    queryFn: () => fetchGraphQL<{ maps: MapInfo[] }>(MAPS_QUERY),
  });

  const maps = (query.data?.maps ?? []).filter((m) => m.bosses.length > 0);

  return (
    <section>
      <h1>マップ別ボス出現率</h1>
      <p className="page-desc">
        各マップのボス・スカフ集団の出現率と主な出現場所です(現在のワイプの設定値)。
      </p>
      <QueryState
        isLoading={query.isPending}
        error={query.error}
        onRetry={() => query.refetch()}
      />
      <div className="card-grid">
        {maps.map((map) => (
          <div key={map.id} className="card">
            <div className="card-header">
              <h2>{map.name}</h2>
              <span className="item-sub">
                {map.players && `プレイヤー ${map.players}人`}
                {map.raidDuration && ` ・ ${map.raidDuration}分`}
              </span>
            </div>
            <ul className="boss-list">
              {map.bosses.map((spawn, i) => (
                <li key={`${spawn.boss.name}-${i}`} className="boss-row">
                  {spawn.boss.imagePortraitLink && (
                    <img
                      src={spawn.boss.imagePortraitLink}
                      alt=""
                      loading="lazy"
                      className="boss-icon"
                    />
                  )}
                  <div className="boss-info">
                    <div className="boss-name-row">
                      <span className="boss-name">{spawn.boss.name}</span>
                      <span
                        className={
                          'boss-chance ' +
                          (spawn.spawnChance >= 0.5 ? 'high' : 'low')
                        }
                      >
                        {chancePercent(spawn.spawnChance)}
                      </span>
                    </div>
                    {spawn.spawnLocations.length > 0 && (
                      <div className="item-sub">
                        {spawn.spawnLocations
                          .map((loc) => loc.name)
                          .join(' / ')}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
