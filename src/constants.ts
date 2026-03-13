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
  { id: 'classic', name: 'Plain Mochi', body: '#FFF9F0', border: '#F0E6D8', shadow: '#D4C4B0', blush: 'rgba(220,160,130,0.45)', deadBody: '#E8E0D8', deadBorder: '#C4B5A5', price: 0 },
  { id: 'matcha', name: 'Matcha Mochi', body: '#E8F5E0', border: '#C8DEB8', shadow: '#A8C098', blush: 'rgba(180,200,140,0.4)', deadBody: '#D8E0D0', deadBorder: '#B0BEA0', price: 80 },
  { id: 'sakura', name: 'Sakura Mochi', body: '#FFE8EE', border: '#F0C8D4', shadow: '#D4A8B4', blush: 'rgba(240,140,160,0.4)', deadBody: '#E8D8DC', deadBorder: '#C4B0B8', price: 200 },
  { id: 'yomogi', name: 'Yomogi Mochi', body: '#E0ECD0', border: '#B8D0A0', shadow: '#98B080', blush: 'rgba(160,190,120,0.4)', deadBody: '#D0D8C8', deadBorder: '#A8B898', price: 400 },
  { id: 'anko', name: 'Anko Mochi', body: '#E8D8D0', border: '#C4A898', shadow: '#A08878', blush: 'rgba(180,140,120,0.4)', deadBody: '#D8CCC4', deadBorder: '#B0A090', price: 700 },
  { id: 'yuzu', name: 'Yuzu Mochi', body: '#FFF8D8', border: '#F0E0A8', shadow: '#D4C488', blush: 'rgba(220,190,100,0.4)', deadBody: '#E8E0D0', deadBorder: '#C4B8A0', price: 1200 },
];

// ─── Game Items ───
export const GAME_ITEMS: GameItem[] = [
  { id: 'shield', name: 'Shield', desc: 'Survive 1 miss', icon: '🛡️', price: 15 },
  { id: 'slow', name: 'Slow Down', desc: 'Next 3 targets slower', icon: '🐢', price: 10 },
  { id: 'double', name: '2x Score', desc: 'Next 5 targets 2x pts', icon: '✨', price: 20 },
];

export const DEFAULT_INVENTORY: Inventory = { shield: 0, slow: 0, double: 0 };
