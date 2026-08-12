// 開発・テスト時は VITE_TARKOV_API_URL でモックサーバーに差し替え可能
const API_URL =
  import.meta.env.VITE_TARKOV_API_URL ?? 'https://api.tarkov.dev/graphql';

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.errors) {
    const message =
      json?.errors?.[0]?.message ??
      (typeof json?.errors?.[0] === 'string' ? json.errors[0] : null) ??
      `HTTP ${res.status}`;
    throw new Error(`tarkov.dev API エラー: ${message}`);
  }
  return json.data as T;
}

// ---------- Items ----------

export interface VendorPrice {
  priceRUB: number;
  vendor: { name: string };
}

export interface Item {
  id: string;
  name: string;
  shortName: string;
  iconLink: string | null;
  wikiLink: string | null;
  avg24hPrice: number | null;
  changeLast48hPercent: number | null;
  basePrice: number;
  width: number;
  height: number;
  sellFor: VendorPrice[];
}

export const ITEM_SEARCH_QUERY = /* GraphQL */ `
  query ItemSearch($name: String!) {
    items(name: $name, lang: ja, limit: 48) {
      id
      name
      shortName
      iconLink
      wikiLink
      avg24hPrice
      changeLast48hPercent
      basePrice
      width
      height
      sellFor {
        priceRUB
        vendor {
          name
        }
      }
    }
  }
`;

// ---------- Ammo ----------

export interface Ammo {
  item: {
    id: string;
    name: string;
    shortName: string;
    iconLink: string | null;
    wikiLink: string | null;
  };
  caliber: string | null;
  damage: number;
  penetrationPower: number;
  armorDamage: number;
  fragmentationChance: number;
  initialSpeed: number | null;
  projectileCount: number | null;
  tracer: boolean;
}

export const AMMO_QUERY = /* GraphQL */ `
  query AmmoList {
    ammo(lang: ja) {
      item {
        id
        name
        shortName
        iconLink
        wikiLink
      }
      caliber
      damage
      penetrationPower
      armorDamage
      fragmentationChance
      initialSpeed
      projectileCount
      tracer
    }
  }
`;

// ---------- Tasks ----------

export interface Task {
  id: string;
  name: string;
  minPlayerLevel: number | null;
  kappaRequired: boolean | null;
  lightkeeperRequired: boolean | null;
  experience: number;
  wikiLink: string | null;
  trader: { name: string; imageLink: string | null };
  map: { name: string } | null;
  objectives: { description: string }[];
}

export const TASKS_QUERY = /* GraphQL */ `
  query TaskList {
    tasks(lang: ja) {
      id
      name
      minPlayerLevel
      kappaRequired
      lightkeeperRequired
      experience
      wikiLink
      trader {
        name
        imageLink
      }
      map {
        name
      }
      objectives {
        description
      }
    }
  }
`;

// ---------- Maps / Bosses ----------

export interface BossSpawn {
  boss: { name: string; imagePortraitLink: string | null };
  spawnChance: number;
  spawnLocations: { name: string; chance: number }[];
}

export interface MapInfo {
  id: string;
  name: string;
  players: string | null;
  raidDuration: number | null;
  bosses: BossSpawn[];
}

export const MAPS_QUERY = /* GraphQL */ `
  query MapList {
    maps(lang: ja) {
      id
      name
      players
      raidDuration
      bosses {
        boss {
          name
          imagePortraitLink
        }
        spawnChance
        spawnLocations {
          name
          chance
        }
      }
    }
  }
`;

// ---------- Server status ----------

export interface ServerStatus {
  currentStatuses: { name: string; message: string | null; status: number }[];
  messages: {
    time: string;
    content: string;
    type: number;
    solveTime: string | null;
  }[];
}

export const STATUS_QUERY = /* GraphQL */ `
  query ServerStatus {
    status {
      currentStatuses {
        name
        message
        status
      }
      messages {
        time
        content
        type
        solveTime
      }
    }
  }
`;

export function formatRubles(value: number | null | undefined): string {
  if (value == null) return '-';
  return `₽${value.toLocaleString('ja-JP')}`;
}
