import { useMemo, useState } from 'react';
import {
  NEWS_ENTRIES,
  NEWS_UPDATED_AT,
  type NewsCategory,
} from '../data/news';

const CATEGORIES: NewsCategory[] = [
  'パッチ/メンテ',
  'タスク',
  'ボス',
  'バランス調整',
  '今後の予定',
];

const CATEGORY_CLASS: Record<NewsCategory, string> = {
  'パッチ/メンテ': 'cat-patch',
  タスク: 'cat-task',
  ボス: 'cat-boss',
  バランス調整: 'cat-balance',
  今後の予定: 'cat-future',
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

  const entries = useMemo(
    () =>
      category === 'all'
        ? NEWS_ENTRIES
        : NEWS_ENTRIES.filter((e) => e.category === category),
    [category],
  );

  return (
    <section>
      <h1>最新情報まとめ</h1>
      <p className="page-desc">
        X(旧Twitter)の公式発表・ニュースサイト・データマイニング・攻略ブログから収集した直近の
        Escape from Tarkov 情報です(最終更新: {formatDate(NEWS_UPDATED_AT)})。
        性能の実数値は「弾薬性能」等の各タブでライブデータを確認できます。
      </p>
      <div className="filter-bar">
        <div className="chip-row">
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
      </div>
      <div className="news-list">
        {entries.map((entry) => (
          <article key={`${entry.date}-${entry.title}`} className="card news-card">
            <div className="news-meta">
              <span className="news-date">{formatDate(entry.date)}</span>
              <span className={`badge ${CATEGORY_CLASS[entry.category]}`}>
                {entry.category}
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
          <p>このカテゴリの情報はありません。</p>
        </div>
      )}
    </section>
  );
}
