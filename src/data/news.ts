// 過去1週間(+重要な直近アップデートの文脈)の Escape from Tarkov 情報まとめ。
// X(旧Twitter)の公式発表・一般ユーザー/コミュニティの投稿・各種ニュースサイト・
// データマイニングサイト・攻略ブログを情報源として手動で収集・整理したもの。
// 確度ラベル: 確定 = 公式発表やゲームデータで裏付けあり /
//             コミュニティ = プレイヤー発の報告・要望(事実ベース) /
//             噂 = 未確定情報・リーク・考察(信頼度に注意)
// 最終更新: 2026-08-27

export type NewsCategory =
  | 'パッチ/メンテ'
  | 'タスク'
  | 'ボス'
  | 'バランス調整'
  | 'イベント'
  | '今後の予定';

export type NewsReliability = '確定' | 'コミュニティ' | '噂';

export interface NewsSource {
  label: string;
  url: string;
}

export interface NewsEntry {
  /** 出来事の日付 (YYYY-MM-DD) */
  date: string;
  category: NewsCategory;
  reliability: NewsReliability;
  title: string;
  /** 箇条書きの詳細 */
  points: string[];
  sources: NewsSource[];
}

export const NEWS_UPDATED_AT = '2026-08-27';

export const NEWS_ENTRIES: NewsEntry[] = [
  {
    date: '2026-08-24',
    category: 'バランス調整',
    reliability: '確定',
    title: 'サイレント変更(1.1.0.1.46911): ロビー通知設定の調整',
    points: [
      'クライアント設定の NotifierLobbyPercentage が 20 → 30 に変更(軽微な内部設定変更)。',
      'アイテム性能への影響はなし。データマイニングサイト Tarkov Silent Changes による検出。',
    ],
    sources: [
      {
        label: 'Tarkov Silent Changes',
        url: 'https://changes.tarkov-changes.com/',
      },
    ],
  },
  {
    date: '2026-08-23',
    category: '今後の予定',
    reliability: '確定',
    title: 'Nikita 発言続報: Lighthouse リワーク「ほぼ完成」・PvE シーズン・シークレットエンディング',
    points: [
      'Lighthouse(灯台)のリワークは「シーズン開始から1ヶ月以内」を予定、ほぼ完成済みとのこと。',
      'PvE モードのシーズン対応を「活発に作業中」。PvE のプレステージも比較的近いうちに実装予定。',
      '「少なくとも1つのシークレットエンディングを追加する。内容も時期も言わない」と新エンディングを予告。',
      '武器カスタマイズ用の新ツール(射撃場での試射・スクリーンショット機能付き)を年内目標で開発中。',
      'EFT の世界観をベースにした新作ゲームにも言及。',
    ],
    sources: [
      {
        label: 'ixbt.games(公式Q&Aまとめ 8/23)',
        url: 'https://ixbt.games/en/news/2026/08/23/nikita-buianov-rasskazal-pro-pererabotku-maiaka-pve-prestiz-i-prikol-s-sekretnoi-koncovkoi-escape-from-tarkov.html',
      },
      { label: '公式X (@tarkov)', url: 'https://x.com/tarkov' },
    ],
  },
  {
    date: '2026-08-22',
    category: 'タスク',
    reliability: 'コミュニティ',
    title: 'コミュニティの声: バトルパス文書のドロップ上限に不満集中',
    points: [
      'r/EscapefromTarkov のトップスレッド(593ポイント)で、バトルパス進行用の TerraGroup 文書をデイリータスク報酬に含めてほしいという要望が多数の支持を集める。',
      'プレイヤー報告によると文書の取得は「1モードあたり1日10枚」の上限があり、シーズン後半からの追い上げが困難とのこと。',
      'X でも同様の不満・要望の投稿が拡散。BSG からの公式回答は現時点でなし。',
    ],
    sources: [
      {
        label: 'slashskill(コミュニティ動向まとめ)',
        url: 'https://www.slashskill.com/escape-from-tarkov-seasons-explained-kord-breach-the-new-wipe-system-and-what-carries-over/',
      },
      {
        label: 'r/EscapefromTarkov',
        url: 'https://www.reddit.com/r/EscapefromTarkov/',
      },
    ],
  },
  {
    date: '2026-08-21',
    category: 'パッチ/メンテ',
    reliability: '確定',
    title: '技術アップデート配信(メンテナンス 3〜4時間)',
    points: [
      'キー割り当てが「NONE」と表示されホットキーが使えなくなる不具合を修正。',
      'スタミナ満タンでも PMC の疲労エフェクトが発動することがある問題を修正。',
      '屋外マップのレイド後に Lab が暗くなる表示問題を修正。',
      'レイド離脱後に画面が真っ暗なままフリーズする問題を修正。',
      'Ground Zero のカリング(描画)問題、武器グリップアニメーションの不具合を修正。',
      'トレーダー訪問後に隠れ家の射撃場で ADS できなくなる問題、死亡時ラグドール挙動を修正。',
      'コミュニティからは「エラー228 が直っていない」という報告が引き続き上がっている(未解決)。',
    ],
    sources: [
      { label: '公式X (@tarkov)', url: 'https://x.com/tarkov' },
      {
        label: 'ixbt.games(修正内容まとめ)',
        url: 'https://ixbt.games/en/news/2026/08/23/cvk-bolse-ne-simuliruiut-ustalost-v-escape-from-tarkov-razrabotciki-rasskazali-pro-ispravleniia.html',
      },
    ],
  },
  {
    date: '2026-08-21',
    category: '今後の予定',
    reliability: '確定',
    title: 'TarkovTV 続報: 新マップ「End of the Line」・MOD 対応・Arena 協力モード',
    points: [
      '新レイドマップ「End of the Line」が開発中。大型マップで新ボスが登場予定。初回は Icebreaker と同様にシングルプレイ体験として導入される見込み。',
      'MOD 対応を計画中。詳細非公開の別サブプロジェクトで、「サンドボックス」内で MOD を作れる形になるとのこと。',
      'EFT: Arena に協力型 PvE モード(旧称 Overrun、正式名称は変更予定)を開発中。',
      'Adik ジャージの見た目刷新、ヒゲ・髪型のカスタマイズも将来的に追加したい意向。',
      'Linux 対応は現時点で予定なし(プレイヤー比率とコストが理由、将来の可能性は否定せず)。',
    ],
    sources: [
      {
        label: 'consolepcgaming(公式Q&Aまとめ)',
        url: 'https://consolepcgaming.com/escape-from-tarkovs-plans-include-mods-co-op-arena-play-and-dynamic-weather/',
      },
      {
        label: 'ixbt.games(Nikita 発言)',
        url: 'https://ixbt.games/en/news/2026/08/21/nikita-buianov-gotovit-bolsuiu-reidovuiu-lokaciiu-dlia-escape-from-tarkov-v-planax-podderzka-modov-i-pererabotka-olimpiiki-adik.html',
      },
    ],
  },
  {
    date: '2026-08-20',
    category: 'ボス',
    reliability: '噂',
    title: '噂: Terminal のボス出現情報が食い違い(Killa 20% 説 vs ボス不在説)',
    points: [
      '一部攻略サイト(8/20更新)は「シーズン1から Killa が Terminal にも約20%で出現する」と主張。',
      '別の検証系サイト(8/17更新)は「Terminal に確定ネームドボスはいない。脅威は Scav・RUAF・Black Division の三つ巴攻城戦と迫撃砲」とし、ボス出現説を否定。',
      '本サイトのライブデータ(tarkov.dev)では Terminal に「Black Div.」が出現率100%として記録されており、ネームドボスとしての Killa は未確認。',
      '実際に Terminal へ行く場合はボスの有無を断定せず、Black Division の集団戦を前提に装備を組むのが無難。',
    ],
    sources: [
      {
        label: 'timesaver(Killa ガイド 8/20)',
        url: 'https://timesaver.gg/blog/tarkov-killa-boss-guide',
      },
      {
        label: 'timesaver(Terminal ガイド 8/17)',
        url: 'https://timesaver.gg/blog/tarkov-terminal-map-escape-guide',
      },
      { label: '本サイトのボス出現率(ライブデータ)', url: '#/bosses' },
    ],
  },
  {
    date: '2026-08-20',
    category: '今後の予定',
    reliability: '噂',
    title: '噂: シーズン1の終了日は12月7日? 期間情報が錯綜',
    points: [
      'シーズン期間について公式の明確な発表はなく、コミュニティの情報が割れている。',
      'ゲーム内プレビュー表示から「155日(〜2026/12/7)」とする説が現状最有力。',
      '一方で「最低74日」「70〜80日」「約55日」とする古い情報も X や攻略サイトに残っており混乱の元に。',
      '公式は「シーズンは4〜6ヶ月ごと・年2回」というサイクルのみ明言。正確な終了日は公式発表待ち。',
    ],
    sources: [
      {
        label: 'slashskill(12/7 説)',
        url: 'https://www.slashskill.com/escape-from-tarkov-seasons-explained-kord-breach-the-new-wipe-system-and-what-carries-over/',
      },
      {
        label: 'skycoach(155日プレビュー・諸説まとめ)',
        url: 'https://skycoach.gg/blog/escape-from-tarkov/articles/tarkov-wipe-dates',
      },
    ],
  },
  {
    date: '2026-08-19',
    category: 'ボス',
    reliability: '確定',
    title: '現在のボス出現率(KORD BREACH Seasonal / PvP / PvE)',
    points: [
      '8/19 時点の Seasonal・通常 PvP: 主要ボス(Reshala・Shturman・Sanitar・Killa・Kaban・Kollontay)45%、Glukhar と Factory の Tagilla 30%、Goons 15%、Partisan 10%。',
      'PvE モードは主要ボスの多くが 75% と高め(Glukhar/Tagilla は 50%)。',
      'なお 8/27 時点の tarkov.dev ライブデータでは主要ボス 60% を確認(本サイト「ボス出現率」タブ参照)。週内に再度引き上げられた可能性あり。',
      '7月末の「全ボス100%出現イベント」は終了済み。古い攻略記事の出現率をそのまま信用しないよう注意。',
      'シーズン限定: Lab のレイダーが Black Division に置換。Ground Zero(Lv21+)・Shoreline・Streets に Black Division 兵士が徘徊。',
    ],
    sources: [
      {
        label: '冷凍みかんの冷凍庫(日本語・8/19更新)',
        url: 'https://reitou-blog.com/tarkov-boss-spawn-rate-locations/',
      },
      {
        label: '本サイトのボス出現率(ライブデータ)',
        url: '#/bosses',
      },
    ],
  },
  {
    date: '2026-08-17',
    category: 'イベント',
    reliability: '確定',
    title: 'Twitch Drops キャンペーン終了(8/5〜8/17)',
    points: [
      'KORD BREACH 開始記念の Twitch Drops が日本時間 8/17 22:00 に終了。',
      '視聴のみ: シーズンキャラクター用の貴重品入りコンテナ / サブスク: 全モードで使える限定アイテム、という2本立てだった。',
      '次回 Drops の告知は現時点でなし。公式 X の告知を要チェック。',
    ],
    sources: [
      {
        label: 'タルコフ情報省(日本語・公式X訳)',
        url: 'https://ministryoftarkovinfo.com/16104',
      },
      { label: '公式X (@tarkov)', url: 'https://x.com/tarkov' },
    ],
  },
  {
    date: '2026-08-13',
    category: 'パッチ/メンテ',
    reliability: '確定',
    title: 'パッチ 1.1.0.1 配信 + データ内に「NODE-3」の新規テキスト',
    points: [
      'トレード要件の調整、隠れ家の建設時間短縮、序盤装備の入手性改善などの QoL 修正。',
      'データマイニングで「NODE-3 施設」「B-190a の最低出力維持」「施設封鎖・無線封止」といった新規のシークレット文書テキストを検出。',
    ],
    sources: [
      {
        label: 'Tarkov Silent Changes (8/13)',
        url: 'https://pve.tarkov-changes.com/view/237',
      },
    ],
  },
  {
    date: '2026-08-13',
    category: '今後の予定',
    reliability: '噂',
    title: '考察: 「NODE-3」文書は新マップ End of the Line や次イベントの伏線?',
    points: [
      '8/13 にデータマインされた機密文書(NODE-3 施設の封鎖、原子炉らしき B-190a を停止してはならない等)を巡り、X や Reddit で考察が活発化。',
      '「開発中の新マップ End of the Line の舞台では」「次のシーズンイベントの布石では」という説が有力視されているが、公式の言及は一切なし。',
      '文書には「接触者はすべて敵性とみなす」「緊急プロトコル em-11」などの不穏な記述があり、新ボス・新勢力の登場を予想する声も。',
    ],
    sources: [
      {
        label: 'Tarkov Silent Changes(文書全文)',
        url: 'https://pve.tarkov-changes.com/view/237',
      },
      {
        label: 'r/EscapefromTarkov(考察スレッド)',
        url: 'https://www.reddit.com/r/EscapefromTarkov/',
      },
    ],
  },
  {
    date: '2026-08-07',
    category: 'バランス調整',
    reliability: '確定',
    title: 'サイレント調整: 新弾薬 5.8x42mm ファミリーと AR-15 ストック',
    points: [
      'DBP191(汎用弾): ダメージ 56→53、アーマーダメージ 46→43(弱体化)、反動 -5→-3。',
      'DBX95(曳光弾): 貫通力 29→33(強化)、反動 0→5。',
      'DVC12(徹甲弾): 貫通力 49→52、アーマーダメージ 55→60(強化)、反動 5→12(大幅増)。',
      'DVX12(徹甲曳光弾): ダメージ 50→48、貫通力 46→47、反動 5→9。',
      'AR-15 各種ストックのエルゴノミクス/リコイルを微調整(LMT SOPMOD エルゴ 5→7 など)。',
      '最新の実数値は本サイトの「弾薬性能」タブで確認可能(ライブデータ)。',
    ],
    sources: [
      {
        label: 'Tarkov Silent Changes (8/7)',
        url: 'https://changes.tarkov-changes.com/view/1164',
      },
      { label: '本サイトの弾薬性能(ライブデータ)', url: '#/ammo' },
    ],
  },
  {
    date: '2026-08-03',
    category: 'タスク',
    reliability: '確定',
    title: '新タスク: KORD BREACH シーズン専用クエストライン(Black Division 編)',
    points: [
      'シーズンキャラクター専用の新クエストライン。Prapor の「Uninvited Guests - Part 1」から開始。',
      'Wi-Fi カメラ設置(Cast the Net)、Black Division プレートキャリア5個納品(Know Your Enemy)、暗号化キー入手(Key to Understanding)など Black Division を追う構成。',
      '終盤は Fence ルート(Final Stretch)と Mechanic ルート(Consequences of Our Decisions)の二択で、片方を完了するともう片方は失敗になる分岐制。',
      '報酬の一部(シーズン報酬)は恒久プロファイル(PvP/PvE)にも引き継がれる。',
      'あわせてサイドタスク制度全体が刷新され、トレーダーの Loyalty Level に応じて2〜4個ずつ解放される方式に変更。グループメンバーの進行が共有されるタスクも追加。',
    ],
    sources: [
      { label: 'Tarkov101(クエスト一覧)', url: 'https://tarkov101.com/kordbreach' },
      {
        label: 'Overgear(シーズン1クエストガイド)',
        url: 'https://overgear.com/guides/eft/season-1-quests/',
      },
    ],
  },
  {
    date: '2026-08-03',
    category: 'パッチ/メンテ',
    reliability: '確定',
    title: 'パッチ 1.1.0.0「KORD BREACH」: シーズン制導入の大型アップデート',
    points: [
      'シーズン1「KORD BREACH」開始。シーズンキャラクターは専用サーバーで動作し、恒久 PvP/PvE プロファイルはワイプされない。',
      '無料バトルパスを全モード共通で追加。レイド内で TerraGroup 文書を集めて進行。',
      '新武器: Norinco QBZ-191(新口径 5.8x42mm)、Howa Type 20(自衛隊20式小銃)、HK 416A5 RAL 8000。',
      '経済大改編: トレーダー販売価格 約+25%、買取価格 約-20%、フリーマーケット手数料 3%→5%。',
      'アーマー関連: 防具の跳弾(リコシェット)設定を全面的に見直し。Ref はプレート無しキャリアを中心に販売する形に変更。',
      '序盤緩和: FMJ 系弾薬の値下げ・低LL化、7.62x39 T-45M1 が開始直後から Prapor で購入可能に。隠れ家の序盤建設も簡略化。',
      '将来のシーズン内容をコミュニティ投票で決める仕組みも検討中と公式が言及。',
    ],
    sources: [
      {
        label: '公式パッチノート(Steam News)',
        url: 'https://store.steampowered.com/news/app/3932890/view/686386819418294180',
      },
      {
        label: 'EAA FPS News(日本語まとめ)',
        url: 'https://fpsjp.net/archives/555729',
      },
      {
        label: 'updatecrazy(全文まとめ)',
        url: 'https://updatecrazy.com/escape-from-tarkov-update-1-1-0-patch-notes-eft-1-1-0/',
      },
    ],
  },
];
