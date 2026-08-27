import { useMemo, useState } from 'react';
import {
  NEWS_ENTRIES,
  NEWS_UPDATED_AT,
  type NewsCategory,
  type NewsReliability,
} from '../data/news';

const CATEGORIES: NewsCategory[] = [
  'パッチ/メンテ',
  'タスク',
  'ボス',
  'バランス調整',
  'イベント',
  '今後の予定',
];

const RELIABILITIES: NewsReliability[] = ['確定', 'コミュニティ', '噂'];

const CATEGORY_CLASS: Record<NewsCategory, string> = {
  'パッチ/メンテ': 'cat-patch',
  タスク: 'cat-task',
  ボス: 'cat-boss',
  バランス調整: 'cat-balance',
  イベント: 'cat-event',
  今後の予定: 'cat-future',
};

const RELIABILITY_CLASS: Record<NewsReliability, string> = {
  確定: 'rel-confirmed',
  コミュニティ: 'rel-community',
  噂: 'rel-rumor',
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const weekday = ['日', '月', '火', '水', '木', '金', '土'][
    new Date(iso).getDay()
  ];
  return `${y}/${m}/${d} (${weekday})`;
}

export default function NewsPage() {
  const [category, setCategory] = useState<NewsCategory | 'all'>('all');
  const [reliability, setReliability] = useState<NewsReliability | 'all'>(
    'all',
  );

  const entries = useMemo(
    () =>
      NEWS_ENTRIES.filter(
        (e) =>
          (category === 'all' || e.category === category) &&
          (reliability === 'all' || e.reliability === reliability),
      ),
    [category, reliability],
  );

  return (
    <section>
      <h1>最新情報まとめ</h1>
      <p className="page-desc">
        X(旧Twitter)の公式発表・一般ユーザーやコミュニティの投稿・ニュースサイト・データマイニング・攻略ブログから収集した直近の
        Escape from Tarkov 情報です(最終更新: {formatDate(NEWS_UPDATED_AT)})。
        <span className="badge rel-confirmed">確定</span>は公式発表やゲームデータで裏付けのある情報、
        <span className="badge rel-community">コミュニティ</span>はプレイヤー発の報告・要望、
        <span className="badge rel-rumor">噂</span>は未確定のリーク・考察です。噂は今後の公式発表で変わる可能性があります。
      </p>
      <div className="filter-bar column">
        <div className="chip-row">
          <span className="chip-label">カテゴリ:</span>
          <button
            type="button"
            className={category === 'all' ? 'chip active' : 'chip'}
            onClick={() => setCategory('all')}
          >
            すべて
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={category === c ? 'chip active' : 'chip'}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="chip-row">
          <span className="chip-label">確度:</span>
          <button
            type="button"
            className={reliability === 'all' ? 'chip active' : 'chip'}
            onClick={() => setReliability('all')}
          >
            すべて
          </button>
          {RELIABILITIES.map((r) => (
            <button
              key={r}
              type="button"
              className={reliability === r ? 'chip active' : 'chip'}
              onClick={() => setReliability(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="news-list">
        {entries.map((entry) => (
          <article key={`${entry.date}-${entry.title}`} className="card news-card">
            <div className="news-meta">
              <span className="news-date">{formatDate(entry.date)}</span>
              <span className={`badge ${CATEGORY_CLASS[entry.category]}`}>
                {entry.category}
              </span>
              <span className={`badge ${RELIABILITY_CLASS[entry.reliability]}`}>
                {entry.reliability}
              </span>
            </div>
            <h2 className="news-title">{entry.title}</h2>
            <ul className="news-points">
              {entry.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
            <div className="news-sources">
              出典:{' '}
              {entry.sources.map((s, i) => (
                <span key={s.url}>
                  {i > 0 && ' / '}
                  {s.url.startsWith('#') ? (
                    <a href={s.url}>{s.label}</a>
                  ) : (
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.label}
                    </a>
                  )}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
      {entries.length === 0 && (
        <div className="state-box">
          <p>条件に一致する情報はありません。</p>
        </div>
      )}
    </section>
  );
}
