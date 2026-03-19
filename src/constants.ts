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
  { id: 'classic', name: 'Classic',  body: '#FFF9F0', border: '#F0E6D8', shadow: '#D4C4B0', blush: 'rgba(220,160,130,0.45)', deadBody: '#E8E0D8', deadBorder: '#C4B5A5', price: 0 },
  { id: 'matcha',  name: 'Matcha',   body: '#D8F0C8', border: '#A8CC90', shadow: '#88B070', blush: 'rgba(130,190,100,0.4)',  deadBody: '#C8D8C0', deadBorder: '#A0B890', price: 150 },
  { id: 'sakura',  name: 'Sakura',   body: '#FFE0EC', border: '#F0A8BC', shadow: '#D48AAA', blush: 'rgba(240,130,160,0.4)', deadBody: '#E8D0D8', deadBorder: '#C4A0B0', price: 400 },
  { id: 'ichigo',  name: 'Ichigo',   body: '#FFCCD4', border: '#E890A0', shadow: '#C06878', blush: 'rgba(220,90,110,0.4)',  deadBody: '#E0C0C8', deadBorder: '#BC9098', price: 800 },
  { id: 'kogeme',  name: 'Kogeme',   body: '#FFEEC0', border: '#D4A840', shadow: '#B08030', blush: 'rgba(210,160,60,0.4)',  deadBody: '#E0D4B0', deadBorder: '#B09868', price: 1300 },
  { id: 'anko',    name: 'Anko',     body: '#D8B8A0', border: '#A87860', shadow: '#885840', blush: 'rgba(190,130,90,0.4)',  deadBody: '#C8B0A0', deadBorder: '#A09080', price: 2000 },
  { id: 'sumi',    name: 'Sumi',     body: '#786868', border: '#524040', shadow: '#3A2C2C', blush: 'rgba(180,150,140,0.3)', deadBody: '#585050', deadBorder: '#3C3030', price: 3000 },
  { id: 'yuzu',    name: 'Yuzu',     body: '#FFF4A0', border: '#E8CC30', shadow: '#C4A818', blush: 'rgba(240,200,40,0.4)',  deadBody: '#E8E4C0', deadBorder: '#C8C080', price: 5000 },
];

// ─── Game Items ───
export const GAME_ITEMS: GameItem[] = [
  { id: 'shield', name: 'Shield', desc: 'Survive 1 miss', icon: '🛡️', price: 15 },
  { id: 'slow', name: 'Slow Down', desc: 'Next 3 targets slower', icon: '🐢', price: 10 },
  { id: 'double', name: '2x Score', desc: 'Next 5 targets 2x pts', icon: '✨', price: 20 },
];

export const DEFAULT_INVENTORY: Inventory = { shield: 0, slow: 0, double: 0 };
