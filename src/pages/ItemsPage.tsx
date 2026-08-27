import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  fetchGraphQL,
  formatRubles,
  ITEM_SEARCH_QUERY,
  type Item,
} from '../api/tarkov';
import QueryState from '../components/QueryState';
import useDebouncedValue from '../hooks/useDebouncedValue';

function bestSell(item: Item): { vendor: string; price: number } | null {
  if (item.sellFor.length === 0) return null;
  const traderOffers = item.sellFor.filter(
    (offer) => offer.vendor.name !== 'フリーマーケット',
  );
  const pool = traderOffers.length > 0 ? traderOffers : item.sellFor;
  const best = pool.reduce((a, b) => (a.priceRUB >= b.priceRUB ? a : b));
  return { vendor: best.vendor.name, price: best.priceRUB };
}

function pricePerSlot(item: Item): number | null {
  if (item.avg24hPrice == null) return null;
  return Math.round(item.avg24hPrice / (item.width * item.height));
}

export default function ItemsPage() {
  const [input, setInput] = useState('');
  const search = useDebouncedValue(input.trim(), 350);

  const query = useQuery({
    queryKey: ['items', search],
    queryFn: () =>
      fetchGraphQL<{ items: Item[] }>(ITEM_SEARCH_QUERY, { name: search }),
    enabled: search.length >= 2,
    placeholderData: keepPreviousData,
  });

  const items = query.data?.items ?? [];

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
      {search.length < 2 ? (
        <div className="state-box">
          <p>2文字以上入力すると検索します。</p>
        </div>
      ) : (
        <>
          <QueryState
            isLoading={query.isPending}
            error={query.error}
            onRetry={() => query.refetch()}
          />
          {query.isSuccess && items.length === 0 && (
            <div className="state-box">
              <p>「{search}」に一致するアイテムは見つかりませんでした。</p>
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
        </>
      )}
    </section>
  );
}
