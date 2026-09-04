import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  GAME_MODE_LABELS,
  loadMaps,
  type GameMode,
} from '../api/tarkov';
import QueryState from '../components/QueryState';

const GAME_MODES: GameMode[] = ['regular', 'pvp-season', 'pve'];

function chancePercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export default function BossesPage() {
  const [gameMode, setGameMode] = useState<GameMode>('regular');

  const query = useQuery({
    queryKey: ['maps', gameMode],
    queryFn: () => loadMaps(gameMode),
  });

  const maps = (query.data ?? []).filter((m) => m.bosses.length > 0);

  return (
    <section>
      <h1>マップ別ボス出現率</h1>
      <p className="page-desc">
        各マップのボス・敵集団の出現率と主な出現場所です(ゲーム内設定値のライブデータ)。
        シーズン限定の出現(Shoreline・Streets・Ground Zero の Black Division
        など)は「シーズン」モードに切り替えると表示されます。
      </p>
      <div className="filter-bar">
        <div className="chip-row">
          <span className="chip-label">ゲームモード:</span>
          {GAME_MODES.map((m) => (
            <button
              key={m}
              type="button"
              className={gameMode === m ? 'chip active' : 'chip'}
              onClick={() => setGameMode(m)}
            >
              {GAME_MODE_LABELS[m]}
            </button>
          ))}
        </div>
      </div>
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
