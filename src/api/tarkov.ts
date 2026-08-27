// データ取得について:
// tarkov.dev の GraphQL API (api.tarkov.dev) はバックエンド障害で長期間 422 を
// 返し続けており、公式サイト自身も静的 JSON API (json.tarkov.dev) に移行済み。
// 本アプリも JSON API から取得する(CORS 対応・定期更新)。
// 本文は翻訳キーのプレースホルダ("<id> Name" 等)になっており、言語別の
// 翻訳マップ(items_ja 等)を重ねて日本語化する(公式サイトと同じ方式)。
// エンドポイント一覧: https://json.tarkov.dev/endpoints
const JSON_BASE = 'https://json.tarkov.dev';
const GAME_MODE = 'regular';

// 同じファイルを複数ページで使うため、エンドポイント単位でフェッチを共有する
const fetchCache = new Map<string, Promise<unknown>>();

async function fetchData<T>(path: string): Promise<T> {
  const res = await fetch(`${JSON_BASE}/${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`tarkov.dev データ取得エラー: HTTP ${res.status} (${path})`);
  }
  const json = await res.json();
  return json.data as T;
}

function fetchJson<T>(path: string): Promise<T> {
  let promise = fetchCache.get(path);
  if (!promise) {
    promise = fetchData<T>(path);
    // 失敗したら次回リトライできるようキャッシュから外す
    promise.catch(() => fetchCache.delete(path));
    fetchCache.set(path, promise);
  }
  return promise as Promise<T>;
}

type Dict = Record<string, string>;

/** 日本語訳(無ければ英語訳)のマージ済み辞書を取得 */
async function loadDict(endpoint: string): Promise<Dict> {
  const [en, ja] = await Promise.all([
    fetchJson<Dict>(`${GAME_MODE}/${endpoint}_en`),
    fetchJson<Dict>(`${GAME_MODE}/${endpoint}_ja`),
  ]);
  return { ...en, ...ja };
}

const tr = (dict: Dict, key: string, fallback = ''): string =>
  dict[key] ?? fallback;

const mode = (path: string) => `${GAME_MODE}/${path}`;

// ---------- traders ----------

interface RawTrader {
  id: string;
  normalizedName: string;
}

async function loadTraderNames(): Promise<Map<string, string>> {
  const [traders, dict] = await Promise.all([
    fetchJson<Record<string, RawTrader>>(mode('traders')),
    loadDict('traders'),
  ]);
  const names = new Map<string, string>();
  for (const trader of Object.values(traders)) {
    names.set(
      trader.id,
      tr(dict, `${trader.id} Nickname`, trader.normalizedName),
    );
  }
  return names;
}

// ---------- items ----------

interface RawItem {
  id: string;
  normalizedName: string;
  iconLink: string | null;
  wikiLink: string | null;
  avg24hPrice: number | null;
  changeLast48hPercent: number | null;
  basePrice: number;
  width: number;
  height: number;
  types: string[];
  sellToTrader: { trader: string; priceRUB: number }[] | null;
  properties: Record<string, unknown> | null;
}

interface ItemsFile {
  items: Record<string, RawItem>;
}

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

async function loadItemParts() {
  return Promise.all([fetchJson<ItemsFile>(mode('items')), loadDict('items')]);
}

export async function loadItems(): Promise<Item[]> {
  const [[file, dict], traderNames] = await Promise.all([
    loadItemParts(),
    loadTraderNames(),
  ]);
  return Object.values(file.items).map((raw) => ({
    id: raw.id,
    name: tr(dict, `${raw.id} Name`, raw.normalizedName),
    shortName: tr(dict, `${raw.id} ShortName`, raw.normalizedName),
    iconLink: raw.iconLink,
    wikiLink: raw.wikiLink,
    avg24hPrice: raw.avg24hPrice,
    changeLast48hPercent: raw.changeLast48hPercent,
    basePrice: raw.basePrice,
    width: raw.width,
    height: raw.height,
    sellFor: (raw.sellToTrader ?? []).map((offer) => ({
      priceRUB: offer.priceRUB,
      vendor: { name: traderNames.get(offer.trader) ?? '?' },
    })),
  }));
}

// ---------- ammo ----------

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

interface AmmoProperties {
  propertiesType: string;
  caliber?: string;
  damage?: number;
  penetrationPower?: number;
  armorDamage?: number;
  fragmentationChance?: number;
  initialSpeed?: number;
  projectileCount?: number;
  tracer?: boolean;
}

export async function loadAmmo(): Promise<Ammo[]> {
  const [file, dict] = await loadItemParts();
  const result: Ammo[] = [];
  for (const raw of Object.values(file.items)) {
    const props = raw.properties as AmmoProperties | null;
    if (props?.propertiesType !== 'ItemPropertiesAmmo') continue;
    result.push({
      item: {
        id: raw.id,
        name: tr(dict, `${raw.id} Name`, raw.normalizedName),
        shortName: tr(dict, `${raw.id} ShortName`, raw.normalizedName),
        iconLink: raw.iconLink,
        wikiLink: raw.wikiLink,
      },
      caliber: props.caliber ?? null,
      damage: props.damage ?? 0,
      penetrationPower: props.penetrationPower ?? 0,
      armorDamage: props.armorDamage ?? 0,
      fragmentationChance: props.fragmentationChance ?? 0,
      initialSpeed: props.initialSpeed ?? null,
      projectileCount: props.projectileCount ?? null,
      tracer: props.tracer ?? false,
    });
  }
  return result;
}

// ---------- maps ----------

interface RawMap {
  id: string;
  normalizedName: string;
  players: string | null;
  raidDuration: number | null;
  bosses: {
    mob: string;
    spawnChance: number;
    spawnLocations: { name: string; chance: number }[];
  }[];
}

interface RawMob {
  id: string;
  name: string;
  imagePortraitLink: string | null;
}

interface MapsFile {
  maps: Record<string, RawMap>;
  mobs: Record<string, RawMob>;
}

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

async function loadMapParts() {
  return Promise.all([fetchJson<MapsFile>(mode('maps')), loadDict('maps')]);
}

export async function loadMaps(): Promise<MapInfo[]> {
  const [file, dict] = await loadMapParts();
  return Object.values(file.maps).map((raw) => ({
    id: raw.id,
    name: tr(dict, `${raw.id} Name`, raw.normalizedName),
    players: raw.players,
    raidDuration: raw.raidDuration,
    bosses: (raw.bosses ?? []).map((spawn) => {
      const mob = file.mobs[spawn.mob];
      return {
        boss: {
          name: tr(dict, mob?.name ?? spawn.mob, spawn.mob),
          imagePortraitLink: mob?.imagePortraitLink ?? null,
        },
        spawnChance: spawn.spawnChance,
        spawnLocations: (spawn.spawnLocations ?? []).map((loc) => ({
          name: tr(dict, loc.name, loc.name),
          chance: loc.chance,
        })),
      };
    }),
  }));
}

// ---------- tasks ----------

interface RawTask {
  id: string;
  normalizedName: string;
  minPlayerLevel: number | null;
  kappaRequired: boolean | null;
  lightkeeperRequired: boolean | null;
  experience: number;
  wikiLink: string | null;
  trader: string;
  map: string | null;
  objectives: { id: string; description: string }[];
}

export interface Task {
  id: string;
  name: string;
  minPlayerLevel: number | null;
  kappaRequired: boolean | null;
  lightkeeperRequired: boolean | null;
  experience: number;
  wikiLink: string | null;
  trader: { name: string };
  map: { name: string } | null;
  objectives: { description: string }[];
}

export async function loadTasks(): Promise<Task[]> {
  const [file, dict, traderNames, [mapsFile, mapsDict]] = await Promise.all([
    fetchJson<{ tasks: Record<string, RawTask> }>(mode('tasks')),
    loadDict('tasks'),
    loadTraderNames(),
    loadMapParts(),
  ]);
  const mapNames = new Map(
    Object.values(mapsFile.maps).map((m) => [
      m.id,
      tr(mapsDict, `${m.id} Name`, m.normalizedName),
    ]),
  );
  return Object.values(file.tasks).map((raw) => ({
    id: raw.id,
    name: tr(dict, `${raw.id} name`, raw.normalizedName),
    minPlayerLevel: raw.minPlayerLevel,
    kappaRequired: raw.kappaRequired,
    lightkeeperRequired: raw.lightkeeperRequired,
    experience: raw.experience,
    wikiLink: raw.wikiLink,
    trader: { name: traderNames.get(raw.trader) ?? '?' },
    map: raw.map ? { name: mapNames.get(raw.map) ?? '?' } : null,
    objectives: (raw.objectives ?? []).map((o) => ({
      description: tr(dict, o.description, ''),
    })),
  }));
}

// ---------- server status ----------

export interface ServerStatus {
  currentStatuses: {
    name: string;
    message?: string | null;
    status: number;
    statusCode?: string;
  }[];
  messages: {
    time: string;
    content: string;
    type: number;
    solveTime: string | null;
    statusCode?: string;
  }[];
}

export async function loadServerStatus(): Promise<ServerStatus> {
  // ステータスは定期再取得するため共有キャッシュを使わない
  return fetchData<ServerStatus>('status');
}

// ---------- utils ----------

export function formatRubles(value: number | null | undefined): string {
  if (value == null) return '-';
  return `₽${value.toLocaleString('ja-JP')}`;
}
