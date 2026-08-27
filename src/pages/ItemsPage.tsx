import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatRubles, loadItems, type Item } from '../api/tarkov';
import QueryState from '../components/QueryState';
import useDebouncedValue from '../hooks/useDebouncedValue';

const MAX_RESULTS = 48;

function bestSell(item: Item): { vendor: string; price: number } | null {
  if (item.sellFor.length === 0) return null;
  const best = item.sellFor.reduce((a, b) => (a.priceRUB >= b.priceRUB ? a : b));
  return { vendor: best.vendor.name, price: best.priceRUB };
}

function pricePerSlot(item: Item): number | null {
  if (item.avg24hPrice == null) return null;
  return Math.round(item.avg24hPrice / (item.width * item.height));
}

export default function ItemsPage() {
  const [input, setInput] = useState('');
  const search = useDebouncedValue(input.trim().toLowerCase(), 300);

  const query = useQuery({ queryKey: ['items'], queryFn: loadItems });

  const items = useMemo(() => {
    if (!query.data || search.length < 2) return [];
    const matched: Item[] = [];
    for (const item of query.data) {
      if (
        item.name.toLowerCase().includes(search) ||
        item.shortName.toLowerCase().includes(search)
      ) {
        matched.push(item);
        if (matched.length >= MAX_RESULTS) break;
      }
    }
    return matched;
  }, [query.data, search]);

  return (
    <section>
      <h1>アイテム価格検索</h1>
      <p className="page-desc">
        アイテム名(日本語・英語どちらでも可)で検索して、フリーマーケット平均価格とトレーダーの最高買取価格を確認できます。
      </p>
      <input
        type="search"
        className="search-input"
        placeholder="例: Salewa, GPU, LEDX…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <QueryState
        isLoading={query.isPending}
        error={query.error}
        onRetry={() => query.refetch()}
      />
      {query.isSuccess && search.length < 2 && (
        <div className="state-box">
          <p>2文字以上入力すると検索します。</p>
        </div>
      )}
      {query.isSuccess && search.length >= 2 && items.length === 0 && (
        <div className="state-box">
          <p>「{input.trim()}」に一致するアイテムは見つかりませんでした。</p>
        </div>
      )}
      {items.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>アイテム</th>
                <th className="num">フリマ平均 (24h)</th>
                <th className="num">1スロット単価</th>
                <th className="num">48h変動</th>
                <th>最高買取 (トレーダー)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const sell = bestSell(item);
                const change = item.changeLast48hPercent;
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="item-cell">
                        {item.iconLink && (
                          <img
                            src={item.iconLink}
                            alt=""
                            loading="lazy"
                            className="item-icon"
                          />
                        )}
                        <div>
                          {item.wikiLink ? (
                            <a
                              href={item.wikiLink}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {item.name}
                            </a>
                          ) : (
                            item.name
                          )}
                          <div className="item-sub">
                            {item.shortName} ・ {item.width}x{item.height}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="num">{formatRubles(item.avg24hPrice)}</td>
                    <td className="num">{formatRubles(pricePerSlot(item))}</td>
                    <td
                      className={
                        'num ' +
                        (change == null
                          ? ''
                          : change >= 0
                            ? 'text-up'
                            : 'text-down')
                      }
                    >
                      {change == null
                        ? '-'
                        : `${change > 0 ? '+' : ''}${change.toFixed(1)}%`}
                    </td>
                    <td>
                      {sell
                        ? `${formatRubles(sell.price)} (${sell.vendor})`
                        : '-'}
                    </td>
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
