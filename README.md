# Tarkov 情報局

Escape from Tarkov の攻略情報をまとめて確認できる Web アプリです。データはすべて [tarkov.dev](https://tarkov.dev) の無料 GraphQL API からブラウザ上で直接取得します(API キー不要)。

## 機能

- **アイテム価格検索** — アイテム名(日本語/英語)で検索し、フリーマーケット24時間平均価格・1スロット単価・48時間の価格変動・トレーダー最高買取価格を表示
- **弾薬性能一覧** — 全弾薬のダメージ・貫通力・アーマーダメージ・フラグ率・初速を口径別にフィルタ&ソート。貫通力はアーマークラス相当で色分け
- **タスク一覧** — 全トレーダーのタスクを名前検索・トレーダー別・Kappa 必須でフィルタし、目標や必要レベルを確認
- **マップ別ボス出現率** — 各マップのボス・スカフ集団の出現率と出現場所
- **サーバー状況** — 公式サービスの稼働状況と障害情報(1分ごとに自動更新)

## 技術構成

- [Vite](https://vite.dev) + [React](https://react.dev) + TypeScript
- [TanStack Query](https://tanstack.com/query) — データ取得・キャッシュ
- [React Router](https://reactrouter.com)(HashRouter — 静的ホスティングでもそのまま動作)
- [tarkov.dev GraphQL API](https://tarkov.dev/api/) — ゲームデータ(日本語ローカライズ対応)

## 開発

```bash
npm install
npm run dev      # 開発サーバー起動 (http://localhost:5173)
npm run build    # 本番ビルド (dist/ に出力)
npm run preview  # ビルド結果のプレビュー
npm run lint     # Lint チェック
```

## デプロイ

ビルド成果物は静的ファイルのみなので、GitHub Pages / Cloudflare Pages / Netlify などにそのまま配置できます。バックエンドは不要です。
