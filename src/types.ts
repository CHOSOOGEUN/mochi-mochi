export const DIRECTIONS = ['top', 'bottom'] as const;
export type Direction = typeof DIRECTIONS[number];

export const TARGET_TYPES = ['tall', 'wide', 'circle'] as const;
export type TargetType = typeof TARGET_TYPES[number];

export type MochiSkin = {
  id: string;
  name: string;
  body: string;
  border: string;
  shadow: string;
  blush: string;
  deadBody: string;
  deadBorder: string;
  price: number;
};

export type GameItem = {
  id: keyof Inventory;
  name: string;
  desc: string;
  icon: string;
  price: number;
};

export type Inventory = { shield: number; slow: number; double: number };

export type GameScreenState = 'START' | 'PLAYING' | 'OVER' | 'SHOP';
