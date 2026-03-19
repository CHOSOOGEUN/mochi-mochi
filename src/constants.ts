import { Dimensions, Platform } from 'react-native';
import type { MochiSkin, GameItem, Inventory, TargetType } from './types';

export const TARGET_TYPES = ['tall', 'wide', 'circle'] as const;

export const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const BASE_DIM = 140;
export const MIN_DIM = 75;
export const MAX_DIM = 210;
export const PLAYER_CENTER_Y = SCREEN_H * 0.5;

export const TARGETS: Record<TargetType, { h: number; w: number; color: string; label: string }> = {
  tall: { h: 240, w: 90, color: '#8DB580', label: 'TALL!' },
  wide: { h: 90, w: 240, color: '#F0C75E', label: 'WIDE!' },
  circle: { h: 150, w: 150, color: '#E8A0B4', label: 'ROUND!' },
};

export const PARTICLE_COLORS = ['#8DB580', '#F0C75E', '#E8A0B4', '#FFF9F0', '#D4C4B0'];
export const SAKURA_POSITIONS: number[] = Array.from({ length: 15 }, () => Math.random() * SCREEN_W);

export const BG_COLORS = ['#FFF5F0', '#F2F7E8', '#F5EFF8', '#FFF3E8', '#FFE8EE', '#EEF0F8', '#FFF8E0'];

export const BANNER_HIDE_Y = Platform.OS === 'ios' ? -130 : -90;

// ─── IAP Configuration ───
export const IAP_SKUS = {
  coins100: 'mochi_coins_100',
  coins500: 'mochi_coins_500',
  coins1500: 'mochi_coins_1500',
  removeAds: 'mochi_remove_ads',
};

export const IAP_BUNDLES = [
  { sku: IAP_SKUS.coins100, label: '🍡 100 Coins', price: '$0.99', coins: 100 },
  { sku: IAP_SKUS.coins500, label: '🍡 500 Coins', price: '$3.99', coins: 500 },
  { sku: IAP_SKUS.coins1500, label: '🍡 1500 Coins', price: '$9.99', coins: 1500 },
  { sku: IAP_SKUS.removeAds, label: '🚫 Remove Ads', price: '$2.99', coins: 0 },
];

// ─── Skin System ───
export const SKINS: MochiSkin[] = [
  { id: 'classic',  name: 'Classic',    body: '#FFF8F2', border: '#EAD5C2', shadow: '#C8B09A', blush: 'rgba(240,160,145,0.38)', deadBody: '#EDE4DA', deadBorder: '#C8B8A8', price: 0 },
  { id: 'honeybee', name: 'Honey Bee',  body: '#FFE040', border: '#E8B010', shadow: '#C88800', blush: 'rgba(255,165,20,0.4)',   deadBody: '#E8D490', deadBorder: '#C0A030', price: 150 },
  { id: 'galaxy',   name: 'Galaxy',     body: '#100825', border: '#260C50', shadow: '#4A1E8A', blush: 'rgba(130,50,230,0.3)',   deadBody: '#1C1230', deadBorder: '#281640', price: 400 },
  { id: 'panda',    name: 'Panda',      body: '#F6F5F0', border: '#D8D4CC', shadow: '#B0ACA4', blush: 'rgba(255,155,175,0.5)',  deadBody: '#E8E6E0', deadBorder: '#C4C0B8', price: 800 },
  { id: 'chocmint', name: 'Choco Mint', body: '#C2EED6', border: '#7AC8A0', shadow: '#50A87A', blush: 'rgba(55,185,120,0.32)', deadBody: '#B0D4C0', deadBorder: '#88AE98', price: 1300 },
  { id: 'cloud',    name: 'Cloud',      body: '#D6EEFF', border: '#9CC4F0', shadow: '#70A4E0', blush: 'rgba(95,155,238,0.32)', deadBody: '#C6D8EC', deadBorder: '#8EB0D0', price: 2000 },
  { id: 'tiger',    name: 'Tiger',      body: '#FF9620', border: '#D85A08', shadow: '#A84000', blush: 'rgba(215,75,10,0.36)',   deadBody: '#D8B890', deadBorder: '#B08050', price: 3000 },
  { id: 'pudding',  name: 'Pudding',    body: '#FFF0A0', border: '#E0C02A', shadow: '#C0A010', blush: 'rgba(238,190,28,0.4)',   deadBody: '#E8DFA8', deadBorder: '#C4B63A', price: 5000 },
];

// ─── Game Items ───
export const GAME_ITEMS: GameItem[] = [
  { id: 'shield', name: 'Shield', desc: 'Survive 1 miss', icon: '🛡️', price: 15 },
  { id: 'slow', name: 'Slow Down', desc: 'Next 3 targets slower', icon: '🐢', price: 10 },
];

export const DEFAULT_INVENTORY: Inventory = { shield: 0, slow: 0 };
