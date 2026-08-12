// tarkov.dev API のローカルモック。UI 動作確認用。
// 使い方: node scripts/mock-api.mjs
//         VITE_TARKOV_API_URL=http://localhost:8787/graphql npm run dev
import { createServer } from 'node:http';

const data = {
  ItemSearch: {
    items: [
      {
        id: '544fb45d4bdc2dee738b4568',
        name: 'Salewa ファーストエイドキット',
        shortName: 'Salewa',
        iconLink: null,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Salewa_first_aid_kit',
        avg24hPrice: 23456,
        changeLast48hPercent: 4.2,
        basePrice: 12500,
        width: 1,
        height: 2,
        sellFor: [
          { priceRUB: 9375, vendor: { name: 'セラピスト' } },
          { priceRUB: 22800, vendor: { name: 'フリーマーケット' } },
        ],
      },
      {
        id: '57347d7224597744596b4e72',
        name: 'グラフィックカード',
        shortName: 'GPU',
        iconLink: null,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Graphics_card',
        avg24hPrice: 385000,
        changeLast48hPercent: -2.8,
        basePrice: 150000,
        width: 2,
        height: 1,
        sellFor: [{ priceRUB: 105000, vendor: { name: 'メカニック' } }],
      },
    ],
  },
  AmmoList: {
    ammo: [
      {
        item: {
          id: '5efb0da7a29a85116f6ea05f',
          name: '9x19mm PBP gzh',
          shortName: 'PBP',
          iconLink: null,
          wikiLink: null,
        },
        caliber: 'Caliber9x19PARA',
        damage: 52,
        penetrationPower: 39,
        armorDamage: 48,
        fragmentationChance: 0.15,
        initialSpeed: 560,
        projectileCount: 1,
        tracer: false,
      },
      {
        item: {
          id: '560d5e524bdc2d25448b4571',
          name: '12/70 8.5mm Magnum バックショット',
          shortName: 'Magnum',
          iconLink: null,
          wikiLink: null,
        },
        caliber: 'Caliber12g',
        damage: 50,
        penetrationPower: 2,
        armorDamage: 26,
        fragmentationChance: 0,
        initialSpeed: 385,
        projectileCount: 8,
        tracer: true,
      },
      {
        item: {
          id: '5c0d5e4486f77478390952fe',
          name: '5.45x39mm PPBS gs "Igolnik"',
          shortName: 'PPBS',
          iconLink: null,
          wikiLink: null,
        },
        caliber: 'Caliber545x39',
        damage: 37,
        penetrationPower: 62,
        armorDamage: 65,
        fragmentationChance: 0.02,
        initialSpeed: 905,
        projectileCount: 1,
        tracer: false,
      },
    ],
  },
  TaskList: {
    tasks: [
      {
        id: '5936d90786f7742b1420ba5b',
        name: 'デブリ講習',
        minPlayerLevel: 1,
        kappaRequired: true,
        lightkeeperRequired: false,
        experience: 1700,
        wikiLink: 'https://escapefromtarkov.fandom.com/wiki/Debut',
        trader: { name: 'プラポル', imageLink: null },
        map: { name: 'カスタム' },
        objectives: [
          { description: 'スカフを5人倒す' },
          { description: 'MP-133 ショットガンを2丁入手して引き渡す' },
        ],
      },
      {
        id: '5967733e86f774602332fc84',
        name: '香ばしい香り',
        minPlayerLevel: 10,
        kappaRequired: false,
        lightkeeperRequired: true,
        experience: 8000,
        wikiLink: null,
        trader: { name: 'セラピスト', imageLink: null },
        map: null,
        objectives: [{ description: 'ガソリンスタンドの缶詰を見つける' }],
      },
    ],
  },
  MapList: {
    maps: [
      {
        id: '55f2d3fd4bdc2d5f408b4567',
        name: 'カスタム',
        players: '9-12',
        raidDuration: 40,
        bosses: [
          {
            boss: { name: 'レシャラ', imagePortraitLink: null },
            spawnChance: 0.38,
            spawnLocations: [
              { name: '寮', chance: 0.5 },
              { name: 'ガソリンスタンド', chance: 0.5 },
            ],
          },
          {
            boss: { name: 'カルテル', imagePortraitLink: null },
            spawnChance: 0.6,
            spawnLocations: [{ name: '全域', chance: 1 }],
          },
        ],
      },
      {
        id: '5704e3c2d2720bac5b8b4567',
        name: '森林',
        players: '9-12',
        raidDuration: 40,
        bosses: [
          {
            boss: { name: 'シュトゥルマン', imagePortraitLink: null },
            spawnChance: 0.42,
            spawnLocations: [{ name: '製材所', chance: 1 }],
          },
        ],
      },
    ],
  },
  ServerStatus: {
    status: {
      currentStatuses: [
        { name: 'Global', message: null, status: 0 },
        { name: 'Trading', message: null, status: 0 },
        { name: 'Messaging', message: '一部遅延が発生しています', status: 1 },
        { name: 'Matchmaking', message: null, status: 0 },
      ],
      messages: [
        {
          time: '2026-08-11T21:00:00.000Z',
          content:
            'We are aware of the issue with long matching times and are working on a fix.',
          type: 1,
          solveTime: '2026-08-11T23:30:00.000Z',
        },
      ],
    },
  },
};

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.writeHead(204).end();
    return;
  }
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', () => {
    let opName = null;
    try {
      const { query } = JSON.parse(body);
      opName = /query\s+(\w+)/.exec(query)?.[1] ?? null;
    } catch {
      // fall through to error response
    }
    const payload = opName && data[opName];
    res.setHeader('Content-Type', 'application/json');
    if (!payload) {
      res.writeHead(400);
      res.end(JSON.stringify({ errors: [{ message: `unknown operation: ${opName}` }] }));
      return;
    }
    res.writeHead(200);
    res.end(JSON.stringify({ data: payload }));
  });
});

server.listen(8787, () => {
  console.log('mock tarkov.dev API listening on http://localhost:8787/graphql');
});
