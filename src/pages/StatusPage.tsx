import { useQuery } from '@tanstack/react-query';
import { fetchGraphQL, STATUS_QUERY, type ServerStatus } from '../api/tarkov';
import QueryState from '../components/QueryState';

const STATUS_LABELS: Record<number, { label: string; className: string }> = {
  0: { label: '正常', className: 'ok' },
  1: { label: '一部障害', className: 'warn' },
  2: { label: '障害発生中', className: 'down' },
  3: { label: 'メンテナンス', className: 'warn' },
};

function statusInfo(code: number) {
  return STATUS_LABELS[code] ?? { label: `不明 (${code})`, className: 'warn' };
}

export default function StatusPage() {
  const query = useQuery({
    queryKey: ['status'],
    queryFn: () => fetchGraphQL<{ status: ServerStatus }>(STATUS_QUERY),
    refetchInterval: 60_000,
  });

  const status = query.data?.status;

  return (
    <section>
      <h1>サーバー状況</h1>
      <p className="page-desc">
        Escape from Tarkov 公式サービスの稼働状況です(1分ごとに自動更新)。
      </p>
      <QueryState
        isLoading={query.isPending}
        error={query.error}
        onRetry={() => query.refetch()}
      />
      {status && (
        <>
          <div className="card-grid status-grid">
            {status.currentStatuses.map((s) => {
              const info = statusInfo(s.status);
              return (
                <div key={s.name} className="card status-card">
                  <span className={`status-dot ${info.className}`} />
                  <div>
                    <div className="status-name">{s.name}</div>
                    <div className="item-sub">{s.message || info.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <h2 className="section-title">最近のお知らせ</h2>
          {status.messages.length === 0 ? (
            <div className="state-box">
              <p>現在お知らせはありません。</p>
            </div>
          ) : (
            <ul className="message-list">
              {status.messages.map((m, i) => (
                <li key={i} className="card message-card">
                  <div className="item-sub">
                    {new Date(m.time).toLocaleString('ja-JP')}
                    {m.solveTime &&
                      ` (解決: ${new Date(m.solveTime).toLocaleString('ja-JP')})`}
                  </div>
                  <p>{m.content}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
