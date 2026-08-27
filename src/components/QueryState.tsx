interface QueryStateProps {
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

/** ローディング中・エラー時の共通表示。データ表示可能なら null を返す。 */
export default function QueryState({
  isLoading,
  error,
  onRetry,
}: QueryStateProps) {
  if (isLoading) {
    return (
      <div className="state-box">
        <div className="spinner" />
        <p>データを取得中…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="state-box error">
        <p>データの取得に失敗しました。</p>
        <p className="state-detail">{error.message}</p>
        {onRetry && (
          <button type="button" className="btn" onClick={onRetry}>
            再試行
          </button>
        )}
      </div>
    );
  }
  return null;
}
