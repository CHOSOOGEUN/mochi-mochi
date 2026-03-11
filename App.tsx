import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Animated, PanResponder, Dimensions, TouchableOpacity, Easing, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const BASE_DIM = 140;
const MIN_DIM = 75;
const MAX_DIM = 210;
const PLAYER_CENTER_X = SCREEN_W / 2;
const PLAYER_CENTER_Y = SCREEN_H * 0.5;

const DIRECTIONS = ['top', 'bottom', 'left', 'right'] as const;
type Direction = typeof DIRECTIONS[number];

const TARGET_TYPES = ['tall', 'wide', 'circle'] as const;
type TargetType = typeof TARGET_TYPES[number];

const TARGETS = {
  tall: { h: 240, w: 90, color: '#8DB580', label: 'TALL!' },
  wide: { h: 90, w: 240, color: '#F0C75E', label: 'WIDE!' },
  circle: { h: 150, w: 150, color: '#E8A0B4', label: 'ROUND!' },
};

const PARTICLE_COLORS = ['#8DB580', '#F0C75E', '#E8A0B4', '#FFF9F0', '#D4C4B0'];
const SAKURA_POSITIONS: number[] = Array.from({ length: 15 }, () => Math.random() * SCREEN_W);

// ─── Skin System ───
type MochiSkin = {
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

const SKINS: MochiSkin[] = [
  { id: 'classic', name: 'Plain Mochi', body: '#FFF9F0', border: '#F0E6D8', shadow: '#D4C4B0', blush: 'rgba(220,160,130,0.45)', deadBody: '#E8E0D8', deadBorder: '#C4B5A5', price: 0 },
  { id: 'matcha', name: 'Matcha Mochi', body: '#E8F5E0', border: '#C8DEB8', shadow: '#A8C098', blush: 'rgba(180,200,140,0.4)', deadBody: '#D8E0D0', deadBorder: '#B0BEA0', price: 30 },
  { id: 'sakura', name: 'Sakura Mochi', body: '#FFE8EE', border: '#F0C8D4', shadow: '#D4A8B4', blush: 'rgba(240,140,160,0.4)', deadBody: '#E8D8DC', deadBorder: '#C4B0B8', price: 80 },
  { id: 'yomogi', name: 'Yomogi Mochi', body: '#E0ECD0', border: '#B8D0A0', shadow: '#98B080', blush: 'rgba(160,190,120,0.4)', deadBody: '#D0D8C8', deadBorder: '#A8B898', price: 150 },
  { id: 'anko', name: 'Anko Mochi', body: '#E8D8D0', border: '#C4A898', shadow: '#A08878', blush: 'rgba(180,140,120,0.4)', deadBody: '#D8CCC4', deadBorder: '#B0A090', price: 250 },
  { id: 'yuzu', name: 'Yuzu Mochi', body: '#FFF8D8', border: '#F0E0A8', shadow: '#D4C488', blush: 'rgba(220,190,100,0.4)', deadBody: '#E8E0D0', deadBorder: '#C4B8A0', price: 400 },
];

// ─── Game Items ───
type GameItem = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  price: number;
};

const GAME_ITEMS: GameItem[] = [
  { id: 'shield', name: 'Shield', desc: 'Survive 1 miss', icon: '🛡️', price: 15 },
  { id: 'slow', name: 'Slow Down', desc: 'Next 3 targets slower', icon: '🐢', price: 10 },
  { id: 'double', name: '2x Score', desc: 'Next 5 targets 2x pts', icon: '✨', price: 20 },
];

type Inventory = { shield: number; slow: number; double: number };
const DEFAULT_INVENTORY: Inventory = { shield: 0, slow: 0, double: 0 };

// ─── Cute Illustrations (View-based) ───

const CherryBlossom = ({ x, y, size = 24, opacity = 0.3, rotate = '0deg' }: { x: number, y: number, size?: number, opacity?: number, rotate?: string }) => {
  const petalColor = `rgba(232, 160, 180, ${opacity})`;
  const centerColor = `rgba(240, 199, 94, ${opacity + 0.2})`;
  const ps = size * 0.38;
  return (
    <View style={{ position: 'absolute', left: x, top: y, width: size, height: size, transform: [{ rotate }] }}>
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <View key={i} style={{
          position: 'absolute',
          left: size / 2 - ps / 2,
          top: size / 2 - ps,
          width: ps, height: ps,
          borderRadius: ps / 2,
          backgroundColor: petalColor,
          transform: [{ translateY: -ps * 0.3 }, { rotate: `${deg}deg` }],
          transformOrigin: `${ps / 2}px ${ps + ps * 0.3}px`,
        }} />
      ))}
      <View style={{
        position: 'absolute', left: size / 2 - 3, top: size / 2 - 3,
        width: 6, height: 6, borderRadius: 3, backgroundColor: centerColor,
      }} />
    </View>
  );
};

const Dango = ({ x, y, scale = 1, opacity = 0.25 }: { x: number, y: number, scale?: number, opacity?: number }) => {
  const colors = [`rgba(232, 160, 180, ${opacity})`, `rgba(255, 249, 240, ${opacity + 0.15})`, `rgba(141, 181, 128, ${opacity})`];
  const s = 14 * scale;
  return (
    <View style={{ position: 'absolute', left: x, top: y, alignItems: 'center' }}>
      {colors.map((c, i) => (
        <View key={i} style={{ width: s, height: s, borderRadius: s / 2, backgroundColor: c, marginTop: i === 0 ? 0 : -2 }} />
      ))}
      <View style={{ width: 2, height: s * 3 + 6, backgroundColor: `rgba(180, 160, 140, ${opacity * 0.7})`, borderRadius: 1, position: 'absolute', top: -3 }} />
    </View>
  );
};

const CloudPuff = ({ x, y, w = 60, opacity = 0.15 }: { x: number, y: number, w?: number, opacity?: number }) => {
  const c = `rgba(255, 249, 240, ${opacity})`;
  return (
    <View style={{ position: 'absolute', left: x, top: y, flexDirection: 'row', alignItems: 'flex-end' }}>
      <View style={{ width: w * 0.4, height: w * 0.3, borderRadius: w * 0.2, backgroundColor: c }} />
      <View style={{ width: w * 0.5, height: w * 0.45, borderRadius: w * 0.25, backgroundColor: c, marginLeft: -w * 0.1, marginBottom: w * 0.05 }} />
      <View style={{ width: w * 0.35, height: w * 0.28, borderRadius: w * 0.18, backgroundColor: c, marginLeft: -w * 0.08 }} />
    </View>
  );
};

const Leaf = ({ x, y, rotate = '30deg', opacity = 0.2 }: { x: number, y: number, rotate?: string, opacity?: number }) => (
  <View style={{
    position: 'absolute', left: x, top: y,
    width: 10, height: 16,
    borderRadius: 8,
    backgroundColor: `rgba(141, 181, 128, ${opacity})`,
    transform: [{ rotate }],
  }} />
);

const MiniMochi = ({ x, y, color = '#FFF9F0', opacity = 0.35 }: { x: number, y: number, color?: string, opacity?: number }) => (
  <View style={{ position: 'absolute', left: x, top: y, alignItems: 'center' }}>
    <View style={{
      width: 22, height: 18,
      borderRadius: 11,
      backgroundColor: color,
      opacity,
    }}>
      <View style={{ flexDirection: 'row', gap: 4, position: 'absolute', top: 5, alignSelf: 'center' }}>
        <View style={{ width: 3, height: 4, borderRadius: 2, backgroundColor: `rgba(74, 63, 53, ${opacity})` }} />
        <View style={{ width: 3, height: 4, borderRadius: 2, backgroundColor: `rgba(74, 63, 53, ${opacity})` }} />
      </View>
    </View>
  </View>
);

const Sparkle = ({ x, y, size = 8, opacity = 0.3 }: { x: number, y: number, size?: number, opacity?: number }) => (
  <View style={{ position: 'absolute', left: x, top: y, width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: size, height: 2, borderRadius: 1, backgroundColor: `rgba(240, 199, 94, ${opacity})`, position: 'absolute' }} />
    <View style={{ width: 2, height: size, borderRadius: 1, backgroundColor: `rgba(240, 199, 94, ${opacity})`, position: 'absolute' }} />
    <View style={{ width: size * 0.7, height: 1.5, borderRadius: 1, backgroundColor: `rgba(240, 199, 94, ${opacity * 0.6})`, position: 'absolute', transform: [{ rotate: '45deg' }] }} />
    <View style={{ width: size * 0.7, height: 1.5, borderRadius: 1, backgroundColor: `rgba(240, 199, 94, ${opacity * 0.6})`, position: 'absolute', transform: [{ rotate: '-45deg' }] }} />
  </View>
);

// ─── Torii Gate (decorative) ───
const ToriiGate = ({ x, y, scale = 1, opacity = 0.15 }: { x: number, y: number, scale?: number, opacity?: number }) => {
  const w = 50 * scale;
  const h = 60 * scale;
  const pillarW = 5 * scale;
  const beamH = 6 * scale;
  const c = `rgba(200, 80, 80, ${opacity})`;
  return (
    <View style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
      {/* Top beam (kasagi) - curved */}
      <View style={{ position: 'absolute', top: 0, left: -4 * scale, right: -4 * scale, height: beamH, backgroundColor: c, borderRadius: beamH }} />
      {/* Second beam (nuki) */}
      <View style={{ position: 'absolute', top: beamH + 6 * scale, left: 2 * scale, right: 2 * scale, height: beamH * 0.7, backgroundColor: c, borderRadius: 2 }} />
      {/* Left pillar */}
      <View style={{ position: 'absolute', top: beamH * 0.5, left: 6 * scale, width: pillarW, height: h - beamH, backgroundColor: c, borderRadius: 2 }} />
      {/* Right pillar */}
      <View style={{ position: 'absolute', top: beamH * 0.5, right: 6 * scale, width: pillarW, height: h - beamH, backgroundColor: c, borderRadius: 2 }} />
    </View>
  );
};

// ─── Paper Lantern (Chochin) ───
const PaperLantern = ({ x, y, scale = 1, opacity = 0.2, color = 'rgba(240, 80, 80, OPACITY)' }: { x: number, y: number, scale?: number, opacity?: number, color?: string }) => {
  const s = 24 * scale;
  const c = color.replace('OPACITY', String(opacity));
  const stringC = `rgba(80, 60, 50, ${opacity * 0.6})`;
  return (
    <View style={{ position: 'absolute', left: x, top: y, alignItems: 'center' }}>
      {/* String */}
      <View style={{ width: 1.5, height: 10 * scale, backgroundColor: stringC }} />
      {/* Lantern body */}
      <View style={{
        width: s, height: s * 1.3,
        borderRadius: s / 2,
        backgroundColor: c,
      }}>
        {/* Horizontal stripes */}
        <View style={{ position: 'absolute', top: s * 0.35, left: 3 * scale, right: 3 * scale, height: 1.5, backgroundColor: `rgba(60, 40, 30, ${opacity * 0.3})`, borderRadius: 1 }} />
        <View style={{ position: 'absolute', top: s * 0.65, left: 3 * scale, right: 3 * scale, height: 1.5, backgroundColor: `rgba(60, 40, 30, ${opacity * 0.3})`, borderRadius: 1 }} />
      </View>
      {/* Bottom tassel */}
      <View style={{ width: 2, height: 6 * scale, backgroundColor: stringC, borderRadius: 1 }} />
    </View>
  );
};

// ─── Seigaiha Wave Pattern (bottom decoration) ───
const SeigaihaWaves = ({ opacity = 0.08 }: { opacity?: number }) => {
  const waveSize = 30;
  const rows = 3;
  const cols = Math.ceil(SCREEN_W / waveSize) + 1;
  const c = `rgba(160, 130, 110, ${opacity})`;
  return (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: rows * waveSize * 0.6, overflow: 'hidden' }}>
      {Array.from({ length: rows }).map((_, row) => (
        <View key={row} style={{ flexDirection: 'row', position: 'absolute', bottom: row * waveSize * 0.5, left: row % 2 === 0 ? 0 : -waveSize / 2 }}>
          {Array.from({ length: cols }).map((_, col) => (
            <View key={col} style={{
              width: waveSize, height: waveSize,
              borderRadius: waveSize / 2,
              borderWidth: 1.5, borderColor: c,
              backgroundColor: 'transparent',
              marginRight: -1,
            }} />
          ))}
        </View>
      ))}
    </View>
  );
};

// ─── Wind Chime (Furin) - animated ───
const Furin = ({ swayAnim }: { swayAnim: Animated.Value }) => {
  const rotate = swayAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-8deg', '0deg', '8deg'] });
  const tailRotate = swayAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-12deg', '0deg', '12deg'] });
  return (
    <Animated.View style={{ alignItems: 'center', transform: [{ rotate }], transformOrigin: 'center top' }}>
      {/* String */}
      <View style={{ width: 1, height: 12, backgroundColor: 'rgba(140,120,100,0.3)' }} />
      {/* Bell body */}
      <View style={{ width: 22, height: 18, borderTopLeftRadius: 11, borderTopRightRadius: 11, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, backgroundColor: 'rgba(160,210,240,0.35)', borderWidth: 1, borderColor: 'rgba(140,190,220,0.3)' }}>
        {/* Rim highlight */}
        <View style={{ position: 'absolute', bottom: 0, left: 2, right: 2, height: 3, backgroundColor: 'rgba(100,180,220,0.2)', borderRadius: 1 }} />
      </View>
      {/* Clapper */}
      <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(140,120,100,0.3)', marginTop: -1 }} />
      {/* Paper tail (tanzaku) */}
      <Animated.View style={{ width: 10, height: 28, backgroundColor: 'rgba(200,80,80,0.2)', borderRadius: 2, marginTop: 1, transform: [{ rotate: tailRotate }], transformOrigin: 'center top' }}>
        <View style={{ position: 'absolute', top: 8, left: 2, right: 2, height: 1, backgroundColor: 'rgba(160,60,60,0.15)' }} />
        <View style={{ position: 'absolute', top: 16, left: 2, right: 2, height: 1, backgroundColor: 'rgba(160,60,60,0.12)' }} />
      </Animated.View>
    </Animated.View>
  );
};

// ─── Background Scene (Full coverage) ───
const BackgroundIllustrations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <CloudPuff x={-10} y={SCREEN_H * 0.04} w={80} opacity={0.22} />
    <CloudPuff x={SCREEN_W * 0.55} y={SCREEN_H * 0.1} w={70} opacity={0.18} />
    <CloudPuff x={SCREEN_W * 0.2} y={SCREEN_H * 0.22} w={60} opacity={0.14} />
    <CloudPuff x={SCREEN_W * 0.75} y={SCREEN_H * 0.38} w={55} opacity={0.12} />
    <CloudPuff x={SCREEN_W * 0.05} y={SCREEN_H * 0.52} w={65} opacity={0.15} />
    <CloudPuff x={SCREEN_W * 0.6} y={SCREEN_H * 0.65} w={75} opacity={0.13} />
    <CloudPuff x={SCREEN_W * 0.3} y={SCREEN_H * 0.82} w={85} opacity={0.16} />
    <CloudPuff x={SCREEN_W * 0.8} y={SCREEN_H * 0.92} w={50} opacity={0.1} />

    <CherryBlossom x={SCREEN_W * 0.05} y={SCREEN_H * 0.06} size={26} opacity={0.28} rotate="15deg" />
    <CherryBlossom x={SCREEN_W * 0.4} y={SCREEN_H * 0.03} size={20} opacity={0.2} rotate="-25deg" />
    <CherryBlossom x={SCREEN_W * 0.82} y={SCREEN_H * 0.08} size={24} opacity={0.22} rotate="40deg" />
    <CherryBlossom x={SCREEN_W * 0.15} y={SCREEN_H * 0.18} size={18} opacity={0.18} rotate="-10deg" />
    <CherryBlossom x={SCREEN_W * 0.65} y={SCREEN_H * 0.2} size={22} opacity={0.2} rotate="5deg" />
    <CherryBlossom x={SCREEN_W * 0.9} y={SCREEN_H * 0.28} size={16} opacity={0.15} rotate="-35deg" />
    <CherryBlossom x={SCREEN_W * 0.02} y={SCREEN_H * 0.4} size={20} opacity={0.2} rotate="20deg" />
    <CherryBlossom x={SCREEN_W * 0.5} y={SCREEN_H * 0.35} size={14} opacity={0.15} rotate="-15deg" />
    <CherryBlossom x={SCREEN_W * 0.78} y={SCREEN_H * 0.48} size={22} opacity={0.18} rotate="30deg" />
    <CherryBlossom x={SCREEN_W * 0.25} y={SCREEN_H * 0.58} size={26} opacity={0.22} rotate="-20deg" />
    <CherryBlossom x={SCREEN_W * 0.88} y={SCREEN_H * 0.62} size={18} opacity={0.16} rotate="50deg" />
    <CherryBlossom x={SCREEN_W * 0.1} y={SCREEN_H * 0.75} size={24} opacity={0.25} rotate="-5deg" />
    <CherryBlossom x={SCREEN_W * 0.7} y={SCREEN_H * 0.78} size={20} opacity={0.18} rotate="35deg" />
    <CherryBlossom x={SCREEN_W * 0.35} y={SCREEN_H * 0.88} size={22} opacity={0.2} rotate="-30deg" />
    <CherryBlossom x={SCREEN_W * 0.85} y={SCREEN_H * 0.9} size={16} opacity={0.15} rotate="10deg" />
    <CherryBlossom x={SCREEN_W * 0.55} y={SCREEN_H * 0.95} size={28} opacity={0.22} rotate="-40deg" />

    <Dango x={SCREEN_W * 0.88} y={SCREEN_H * 0.15} scale={0.9} opacity={0.22} />
    <Dango x={SCREEN_W * 0.03} y={SCREEN_H * 0.35} scale={0.7} opacity={0.18} />
    <Dango x={SCREEN_W * 0.72} y={SCREEN_H * 0.55} scale={0.8} opacity={0.15} />
    <Dango x={SCREEN_W * 0.15} y={SCREEN_H * 0.85} scale={0.6} opacity={0.2} />
    <Dango x={SCREEN_W * 0.92} y={SCREEN_H * 0.75} scale={0.5} opacity={0.12} />

    <Leaf x={SCREEN_W * 0.92} y={SCREEN_H * 0.05} rotate="45deg" opacity={0.25} />
    <Leaf x={SCREEN_W * 0.3} y={SCREEN_H * 0.12} rotate="-20deg" opacity={0.2} />
    <Leaf x={SCREEN_W * 0.08} y={SCREEN_H * 0.28} rotate="60deg" opacity={0.22} />
    <Leaf x={SCREEN_W * 0.72} y={SCREEN_H * 0.32} rotate="-45deg" opacity={0.18} />
    <Leaf x={SCREEN_W * 0.45} y={SCREEN_H * 0.45} rotate="30deg" opacity={0.15} />
    <Leaf x={SCREEN_W * 0.88} y={SCREEN_H * 0.52} rotate="-15deg" opacity={0.2} />
    <Leaf x={SCREEN_W * 0.18} y={SCREEN_H * 0.62} rotate="55deg" opacity={0.18} />
    <Leaf x={SCREEN_W * 0.6} y={SCREEN_H * 0.72} rotate="-40deg" opacity={0.22} />
    <Leaf x={SCREEN_W * 0.05} y={SCREEN_H * 0.9} rotate="25deg" opacity={0.2} />
    <Leaf x={SCREEN_W * 0.78} y={SCREEN_H * 0.88} rotate="-55deg" opacity={0.15} />
    <Leaf x={SCREEN_W * 0.5} y={SCREEN_H * 0.02} rotate="10deg" opacity={0.18} />

    <MiniMochi x={SCREEN_W * 0.85} y={SCREEN_H * 0.18} opacity={0.3} />
    <MiniMochi x={SCREEN_W * 0.08} y={SCREEN_H * 0.12} opacity={0.25} color="#F5EDE0" />
    <MiniMochi x={SCREEN_W * 0.45} y={SCREEN_H * 0.25} opacity={0.2} />
    <MiniMochi x={SCREEN_W * 0.7} y={SCREEN_H * 0.42} opacity={0.22} color="#F5EDE0" />
    <MiniMochi x={SCREEN_W * 0.12} y={SCREEN_H * 0.5} opacity={0.28} />
    <MiniMochi x={SCREEN_W * 0.55} y={SCREEN_H * 0.6} opacity={0.2} color="#F5EDE0" />
    <MiniMochi x={SCREEN_W * 0.9} y={SCREEN_H * 0.68} opacity={0.18} />
    <MiniMochi x={SCREEN_W * 0.3} y={SCREEN_H * 0.78} opacity={0.25} color="#F5EDE0" />
    <MiniMochi x={SCREEN_W * 0.65} y={SCREEN_H * 0.88} opacity={0.22} />
    <MiniMochi x={SCREEN_W * 0.02} y={SCREEN_H * 0.95} opacity={0.2} />

    <Sparkle x={SCREEN_W * 0.2} y={SCREEN_H * 0.08} size={10} opacity={0.35} />
    <Sparkle x={SCREEN_W * 0.7} y={SCREEN_H * 0.05} size={7} opacity={0.25} />
    <Sparkle x={SCREEN_W * 0.48} y={SCREEN_H * 0.15} size={9} opacity={0.3} />
    <Sparkle x={SCREEN_W * 0.9} y={SCREEN_H * 0.22} size={8} opacity={0.25} />
    <Sparkle x={SCREEN_W * 0.12} y={SCREEN_H * 0.32} size={11} opacity={0.3} />
    <Sparkle x={SCREEN_W * 0.62} y={SCREEN_H * 0.3} size={6} opacity={0.2} />
    <Sparkle x={SCREEN_W * 0.35} y={SCREEN_H * 0.42} size={9} opacity={0.28} />
    <Sparkle x={SCREEN_W * 0.82} y={SCREEN_H * 0.45} size={7} opacity={0.22} />
    <Sparkle x={SCREEN_W * 0.05} y={SCREEN_H * 0.55} size={10} opacity={0.3} />
    <Sparkle x={SCREEN_W * 0.55} y={SCREEN_H * 0.52} size={8} opacity={0.25} />
    <Sparkle x={SCREEN_W * 0.75} y={SCREEN_H * 0.62} size={12} opacity={0.32} />
    <Sparkle x={SCREEN_W * 0.22} y={SCREEN_H * 0.7} size={7} opacity={0.2} />
    <Sparkle x={SCREEN_W * 0.42} y={SCREEN_H * 0.75} size={9} opacity={0.28} />
    <Sparkle x={SCREEN_W * 0.88} y={SCREEN_H * 0.82} size={8} opacity={0.25} />
    <Sparkle x={SCREEN_W * 0.15} y={SCREEN_H * 0.88} size={11} opacity={0.3} />
    <Sparkle x={SCREEN_W * 0.6} y={SCREEN_H * 0.92} size={6} opacity={0.2} />
    <Sparkle x={SCREEN_W * 0.38} y={SCREEN_H * 0.98} size={10} opacity={0.25} />

    {/* Torii Gates */}
    <ToriiGate x={SCREEN_W * 0.02} y={SCREEN_H * 0.14} scale={0.7} opacity={0.1} />
    <ToriiGate x={SCREEN_W * 0.78} y={SCREEN_H * 0.7} scale={0.5} opacity={0.08} />
    <ToriiGate x={SCREEN_W * 0.4} y={SCREEN_H * 0.92} scale={0.6} opacity={0.07} />

    {/* Paper Lanterns */}
    <PaperLantern x={SCREEN_W * 0.08} y={SCREEN_H * 0.02} scale={0.8} opacity={0.18} />
    <PaperLantern x={SCREEN_W * 0.85} y={SCREEN_H * 0.05} scale={0.6} opacity={0.14} color="rgba(240, 180, 60, OPACITY)" />
    <PaperLantern x={SCREEN_W * 0.5} y={SCREEN_H * 0.01} scale={0.7} opacity={0.12} />
    <PaperLantern x={SCREEN_W * 0.92} y={SCREEN_H * 0.35} scale={0.5} opacity={0.1} color="rgba(240, 180, 60, OPACITY)" />
    <PaperLantern x={SCREEN_W * 0.02} y={SCREEN_H * 0.6} scale={0.55} opacity={0.1} />
  </View>
);

// ─── Falling Sakura Petal (animated) ───
const FallingSakura = React.memo(({ delay, startX }: { delay: number, startX: number }) => {
  const anim = useRef(new Animated.Value(0)).current;
  // Fix: store random values in refs so they don't change on re-render
  const params = useRef({
    duration: 5000 + Math.random() * 4000,
    drift: (Math.random() - 0.5) * 80,
    rotation: Math.random() * 720 - 360,
    size: 10 + Math.random() * 12,
    opacity: 0.25 + Math.random() * 0.25,
  }).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.timing(anim, { toValue: 1, duration: params.duration, easing: Easing.linear, useNativeDriver: true })
      ).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View style={{
      position: 'absolute',
      left: startX,
      width: params.size, height: params.size * 0.7,
      borderRadius: params.size / 2,
      backgroundColor: `rgba(240, 160, 180, ${params.opacity})`,
      opacity: anim.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, params.opacity, params.opacity, 0] }),
      transform: [
        { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-30, SCREEN_H + 30] }) },
        { translateX: anim.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [0, params.drift * 0.5, params.drift, params.drift * 0.5, 0] }) },
        { rotate: anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${params.rotation}deg`] }) },
      ]
    }} />
  );
});

// ─── Floating Particle (animated) ───
const FloatingParticle = React.memo(({ delay, x }: { delay: number, x: number }) => {
  const anim = useRef(new Animated.Value(0)).current;
  const params = useRef({
    duration: 4000 + Math.random() * 2000,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    size: 6 + Math.random() * 10,
    driftX: Math.random() > 0.5 ? 15 : -15,
  }).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.timing(anim, { toValue: 1, duration: params.duration, easing: Easing.linear, useNativeDriver: true })
      ).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View style={{
      position: 'absolute',
      left: x,
      width: params.size, height: params.size,
      borderRadius: params.size / 2,
      backgroundColor: params.color,
      opacity: anim.interpolate({ inputRange: [0, 0.3, 0.7, 1], outputRange: [0, 0.4, 0.4, 0] }),
      transform: [
        { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_H + 20, -40] }) },
        { translateX: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, params.driftX, 0] }) },
      ]
    }} />
  );
});

// ─── Burst Particle ───
const BurstParticle = ({ angle, color, anim }: { angle: number, color: string, anim: Animated.Value }) => {
  const rad = (angle * Math.PI) / 180;
  const dist = 80 + Math.random() * 40;
  const size = 6 + Math.random() * 8;
  return (
    <Animated.View style={{
      position: 'absolute',
      width: size, height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      opacity: anim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 0.8, 0] }),
      transform: [
        { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(rad) * dist] }) },
        { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(rad) * dist] }) },
        { scale: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3, 1.2, 0] }) },
      ]
    }} />
  );
};

// ─── Mochi Skin Patterns (unique per skin) ───
const MochiPattern = ({ skinId, isDead }: { skinId: string, isDead: boolean }) => {
  if (isDead) return null;
  switch (skinId) {
    case 'matcha':
      // Matcha swirl + tea powder dusting + leaf accent
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Matcha powder dusting */}
          {[{t:48,l:18,s:5},{t:52,l:35,s:3},{t:55,l:60,s:4},{t:50,l:75,s:3},{t:58,l:25,s:4},{t:56,l:50,s:3},{t:53,l:70,s:5}].map((p,i) => (
            <View key={i} style={{ position:'absolute', top:`${p.t}%` as any, left:`${p.l}%` as any, width:p.s, height:p.s, borderRadius:p.s/2, backgroundColor:'rgba(100,160,80,0.2)' }} />
          ))}
          {/* Swirl pattern */}
          <View style={{ position:'absolute', top:'58%', left:'30%', width:30, height:30, borderRadius:15, borderWidth:2, borderColor:'rgba(90,150,70,0.15)', borderRightColor:'transparent', borderBottomColor:'transparent', transform:[{rotate:'-30deg'}] }} />
          <View style={{ position:'absolute', top:'62%', left:'38%', width:16, height:16, borderRadius:8, borderWidth:1.5, borderColor:'rgba(90,150,70,0.12)', borderRightColor:'transparent', borderBottomColor:'transparent', transform:[{rotate:'60deg'}] }} />
          {/* Leaf accent on top */}
          <View style={{ position:'absolute', top:'20%', right:'18%', width:16, height:10, borderRadius:8, backgroundColor:'rgba(100,160,80,0.18)', transform:[{rotate:'-35deg'}] }}>
            <View style={{ position:'absolute', top:4.5, left:2, right:2, height:1, backgroundColor:'rgba(80,130,60,0.15)', borderRadius:1 }} />
          </View>
        </View>
      );
    case 'sakura':
      // Full sakura petals scattered + sakura leaf wrap at bottom
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Sakura leaf wrap (kashiwa-style) */}
          <View style={{ position:'absolute', bottom:'8%', left:'5%', width:'50%', height:20, backgroundColor:'rgba(140,180,120,0.18)', borderTopLeftRadius:20, borderTopRightRadius:40, borderBottomRightRadius:10, transform:[{rotate:'-8deg'}] }}>
            <View style={{ position:'absolute', top:9, left:8, right:8, height:1.5, backgroundColor:'rgba(120,160,100,0.15)', borderRadius:1 }} />
          </View>
          {/* Scattered cherry blossom petals */}
          {[{t:25,l:20,r:'-15deg',s:1},{t:35,l:60,r:'30deg',s:0.8},{t:55,l:15,r:'-40deg',s:0.7},{t:48,l:65,r:'20deg',s:0.9},{t:68,l:40,r:'-25deg',s:0.6}].map((p,i) => (
            <View key={i} style={{ position:'absolute', top:`${p.t}%` as any, left:`${p.l}%` as any, transform:[{rotate:p.r},{scale:p.s}] }}>
              {[0,72,144,216,288].map((deg,j) => (
                <View key={j} style={{ position:'absolute', width:6, height:8, borderRadius:3, backgroundColor:`rgba(240,150,170,${0.2-i*0.02})`, transform:[{rotate:`${deg}deg`},{translateY:-4}], transformOrigin:'3px 8px' }} />
              ))}
              <View style={{ width:3, height:3, borderRadius:1.5, backgroundColor:'rgba(240,200,100,0.25)' }} />
            </View>
          ))}
        </View>
      );
    case 'yomogi':
      // Herb leaves pattern + rustic texture
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Herb leaf clusters */}
          {[{t:30,l:15,r:'-20deg'},{t:45,l:65,r:'15deg'},{t:60,l:30,r:'-35deg'},{t:70,l:55,r:'25deg'}].map((p,i) => (
            <View key={i} style={{ position:'absolute', top:`${p.t}%` as any, left:`${p.l}%` as any, transform:[{rotate:p.r}] }}>
              <View style={{ width:12, height:7, borderRadius:6, backgroundColor:'rgba(90,140,70,0.18)' }}>
                <View style={{ position:'absolute', top:3, left:2, right:2, height:1, backgroundColor:'rgba(70,120,50,0.12)', borderRadius:1 }} />
              </View>
              <View style={{ width:8, height:5, borderRadius:4, backgroundColor:'rgba(90,140,70,0.14)', marginTop:-2, marginLeft:2, transform:[{rotate:'30deg'}] }} />
            </View>
          ))}
          {/* Herb speckles */}
          {[{t:35,l:40,s:4},{t:42,l:22,s:3},{t:50,l:55,s:5},{t:55,l:75,s:3},{t:65,l:18,s:4},{t:48,l:80,s:3},{t:72,l:42,s:4},{t:38,l:70,s:3}].map((p,i) => (
            <View key={`s${i}`} style={{ position:'absolute', top:`${p.t}%` as any, left:`${p.l}%` as any, width:p.s, height:p.s, borderRadius:p.s/2, backgroundColor:`rgba(80,130,60,${0.12 + (i%3)*0.04})` }} />
          ))}
        </View>
      );
    case 'anko':
      // Rich anko topping drizzle + red bean accents
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Anko topping layer */}
          <View style={{ position:'absolute', top:'38%', left:'5%', right:'5%', height:30, overflow:'hidden' }}>
            <View style={{ position:'absolute', top:0, left:0, right:0, height:18, backgroundColor:'rgba(120,60,40,0.22)', borderBottomLeftRadius:30, borderBottomRightRadius:30 }} />
            {/* Drips */}
            <View style={{ position:'absolute', top:12, left:'12%', width:10, height:14, backgroundColor:'rgba(120,60,40,0.2)', borderBottomLeftRadius:5, borderBottomRightRadius:5 }} />
            <View style={{ position:'absolute', top:14, left:'40%', width:7, height:10, backgroundColor:'rgba(120,60,40,0.18)', borderBottomLeftRadius:4, borderBottomRightRadius:4 }} />
            <View style={{ position:'absolute', top:10, left:'65%', width:12, height:16, backgroundColor:'rgba(120,60,40,0.2)', borderBottomLeftRadius:6, borderBottomRightRadius:6 }} />
            <View style={{ position:'absolute', top:13, left:'85%', width:8, height:8, backgroundColor:'rgba(120,60,40,0.16)', borderBottomLeftRadius:4, borderBottomRightRadius:4 }} />
          </View>
          {/* Red bean particles */}
          {[{t:60,l:20},{t:65,l:50},{t:62,l:72},{t:70,l:35},{t:68,l:62}].map((p,i) => (
            <View key={i} style={{ position:'absolute', top:`${p.t}%` as any, left:`${p.l}%` as any, width:6, height:5, borderRadius:3, backgroundColor:'rgba(140,70,50,0.18)', transform:[{rotate:`${i*30}deg`}] }} />
          ))}
          {/* Glossy highlight on anko */}
          <View style={{ position:'absolute', top:'40%', left:'25%', width:20, height:4, borderRadius:2, backgroundColor:'rgba(255,255,255,0.12)' }} />
        </View>
      );
    case 'yuzu':
      // Citrus slice + zest pattern + leaf
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Main citrus cross-section */}
          <View style={{ position:'absolute', top:'50%', left:'25%', width:28, height:28, borderRadius:14, borderWidth:2, borderColor:'rgba(220,180,60,0.2)', backgroundColor:'rgba(255,240,150,0.08)', justifyContent:'center', alignItems:'center' }}>
            {/* Segments */}
            {[0,45,90,135].map((deg,i) => (
              <View key={i} style={{ position:'absolute', width:18, height:1.5, backgroundColor:'rgba(220,180,60,0.15)', borderRadius:1, transform:[{rotate:`${deg}deg`}] }} />
            ))}
            <View style={{ width:6, height:6, borderRadius:3, backgroundColor:'rgba(240,200,60,0.15)' }} />
          </View>
          {/* Smaller citrus */}
          <View style={{ position:'absolute', top:'60%', right:'20%', width:16, height:16, borderRadius:8, borderWidth:1.5, borderColor:'rgba(220,180,60,0.15)', justifyContent:'center', alignItems:'center' }}>
            <View style={{ width:8, height:1, backgroundColor:'rgba(220,180,60,0.12)', position:'absolute' }} />
            <View style={{ width:1, height:8, backgroundColor:'rgba(220,180,60,0.12)', position:'absolute' }} />
          </View>
          {/* Yuzu leaf */}
          <View style={{ position:'absolute', top:'28%', right:'22%', width:14, height:9, borderRadius:7, backgroundColor:'rgba(100,160,70,0.18)', transform:[{rotate:'25deg'}] }}>
            <View style={{ position:'absolute', top:4, left:2, right:2, height:1, backgroundColor:'rgba(80,130,50,0.12)', borderRadius:1 }} />
          </View>
          {/* Zest dots */}
          {[{t:35,l:18},{t:42,l:55},{t:70,l:30},{t:45,l:78},{t:75,l:60}].map((p,i) => (
            <View key={i} style={{ position:'absolute', top:`${p.t}%` as any, left:`${p.l}%` as any, width:3, height:3, borderRadius:1.5, backgroundColor:'rgba(240,200,60,0.2)' }} />
          ))}
        </View>
      );
    default:
      return null;
  }
};

// ─── Kawaii Mochi Face ───
const MochiDrawnFace = ({ isDead, squishType, isHappy }: { isDead: boolean, squishType: 'tall' | 'wide' | 'normal', isHappy: boolean }) => {
  if (isDead) {
    return (
      <View style={{ position: 'absolute', top: '30%', alignSelf: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          {[0, 1].map(i => (
            <View key={i} style={{ width: 28, height: 28, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: 22, height: 5, backgroundColor: '#8B7E74', transform: [{ rotate: '45deg' }], position: 'absolute', borderRadius: 3 }} />
              <View style={{ width: 22, height: 5, backgroundColor: '#8B7E74', transform: [{ rotate: '-45deg' }], position: 'absolute', borderRadius: 3 }} />
            </View>
          ))}
        </View>
        <Text style={{ fontSize: 18, color: '#8B7E74', marginTop: 2, fontWeight: '700' }}>～</Text>
      </View>
    );
  }
  if (isHappy) {
    const gap = squishType === 'wide' ? 40 : 24;
    return (
      <View style={{ position: 'absolute', top: squishType === 'tall' ? '22%' : '30%', alignSelf: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap, alignItems: 'center' }}>
          {[0, 1].map(i => (
            <View key={i} style={{ width: 20, height: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, backgroundColor: '#4A3F35', overflow: 'hidden' }}>
              <View style={{ position: 'absolute', top: -8, left: 0, right: 0, height: 10, backgroundColor: '#4A3F35', borderRadius: 10 }} />
            </View>
          ))}
        </View>
        <Text style={{ fontSize: squishType === 'wide' ? 16 : 18, color: '#C4907A', marginTop: squishType === 'tall' ? 4 : 0, fontWeight: '600' }}>▽</Text>
      </View>
    );
  }
  const eyeH = squishType === 'tall' ? 26 : squishType === 'wide' ? 12 : 20;
  const eyeW = squishType === 'wide' ? 20 : 16;
  const eyeGap = squishType === 'wide' ? 40 : 24;
  return (
    <View style={{ position: 'absolute', top: squishType === 'tall' ? '22%' : '30%', alignSelf: 'center', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', gap: eyeGap, alignItems: 'center' }}>
        {[0, 1].map(i => (
          <View key={i} style={{ width: eyeW, height: eyeH, backgroundColor: '#4A3F35', borderRadius: eyeW / 2 }}>
            <View style={{ position: 'absolute', top: 3, left: 3, width: 6, height: 6, backgroundColor: '#FFF', borderRadius: 3 }} />
            <View style={{ position: 'absolute', bottom: 4, right: 3, width: 3, height: 3, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 2 }} />
          </View>
        ))}
      </View>
      <Text style={{ fontSize: squishType === 'wide' ? 14 : 16, color: '#C4907A', marginTop: squishType === 'tall' ? 6 : 2, fontWeight: '600' }}>ω</Text>
    </View>
  );
};


export default function App() {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'OVER' | 'SHOP'>('START');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [targetShape, setTargetShape] = useState<TargetType>('circle');
  const [currentDirection, setCurrentDirection] = useState<Direction>('top');
  const [highScore, setHighScore] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showBurst, setShowBurst] = useState(false);
  const [burstColor, setBurstColor] = useState('#E8A0B4');

  // Coin & Skin & Inventory state
  const [coins, setCoins] = useState(0);
  const [selectedSkinId, setSelectedSkinId] = useState('classic');
  const [unlockedSkinIds, setUnlockedSkinIds] = useState<string[]>(['classic']);
  const [inventory, setInventory] = useState<Inventory>({ ...DEFAULT_INVENTORY });
  const [shopTab, setShopTab] = useState<'skins' | 'items'>('skins');
  const [earnedCoins, setEarnedCoins] = useState(0);

  // Active items for next game
  const [activeItems, setActiveItems] = useState<{ shield: boolean; slow: boolean; double: boolean }>({ shield: false, slow: false, double: false });
  const [adContinueUsed, setAdContinueUsed] = useState(false);

  const currentSkin = SKINS.find(s => s.id === selectedSkinId) || SKINS[0];

  useEffect(() => {
    AsyncStorage.getItem('highScore').then(val => { if (val) setHighScore(parseInt(val, 10)); });
    AsyncStorage.getItem('tutorialDone').then(val => { if (val === 'true') setShowTutorial(false); });
    AsyncStorage.getItem('coins').then(val => { if (val) setCoins(parseInt(val, 10)); });
    AsyncStorage.getItem('selectedSkin').then(val => { if (val) setSelectedSkinId(val); });
    AsyncStorage.getItem('unlockedSkins').then(val => { if (val) setUnlockedSkinIds(JSON.parse(val)); });
    AsyncStorage.getItem('inventory').then(val => { if (val) setInventory(JSON.parse(val)); });
  }, []);

  const gameStateRef = useRef(gameState); gameStateRef.current = gameState;
  const targetShapeRef = useRef(targetShape); targetShapeRef.current = targetShape;
  const directionRef = useRef<Direction>('top');
  const levelRef = useRef(1);
  const scoreRef = useRef(score); scoreRef.current = score;
  const passedRef = useRef(false);
  const comboRef = useRef(combo); comboRef.current = combo;

  // Item effect refs
  const shieldActiveRef = useRef(false);
  const slowCountRef = useRef(0);
  const doubleCountRef = useRef(0);

  const heightAnim = useRef(new Animated.Value(BASE_DIM)).current;
  const heightRef = useRef(BASE_DIM);
  const widthAnim = useRef(Animated.subtract(new Animated.Value(280), heightAnim)).current;
  const fallAnim = useRef(new Animated.Value(-300)).current;
  const popAnim = useRef(new Animated.Value(1)).current;
  const ringScaleAnim = useRef(new Animated.Value(0)).current;
  const ringOpacityAnim = useRef(new Animated.Value(0)).current;
  const comboAnim = useRef(new Animated.Value(0)).current;

  const wobbleAnim = useRef(new Animated.Value(0)).current;

  // Screen transitions
  const screenFadeAnim = useRef(new Animated.Value(1)).current;
  const gameOverSlideAnim = useRef(new Animated.Value(0)).current;
  const scoreCountAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Home
  const idleBreathAnim = useRef(new Animated.Value(0)).current;
  const idleBounceAnim = useRef(new Animated.Value(0)).current;

  // Items
  const [hasShield, setHasShield] = useState(false);
  const shieldAnim = useRef(new Animated.Value(0)).current;
  const titleEntryAnim = useRef(new Animated.Value(0)).current;

  // Target wobble + burst
  const targetRotateAnim = useRef(new Animated.Value(0)).current;
  const burstParticleAnim = useRef(new Animated.Value(0)).current;

  const [squishType, setSquishType] = useState<'tall' | 'wide' | 'normal'>('normal');
  const [displayScore, setDisplayScore] = useState(0);
  const [isHappy, setIsHappy] = useState(false);
  const happyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showShieldBreak, setShowShieldBreak] = useState(false);
  const shieldBreakAnim = useRef(new Animated.Value(0)).current;
  const [slowCount, setSlowCount] = useState(0);
  const [doubleCount, setDoubleCount] = useState(0);
  const [itemPopup, setItemPopup] = useState<{ text: string; color: string } | null>(null);
  const itemPopupAnim = useRef(new Animated.Value(0)).current;

  // Background color transition
  const bgColorAnim = useRef(new Animated.Value(0)).current;
  const prevBgIdxRef = useRef(0);
  const curBgIdxRef = useRef(0);

  // Home mochi touch
  const homeTapAnim = useRef(new Animated.Value(0)).current;
  const homeTapScaleX = useRef(new Animated.Value(1)).current;
  const homeTapScaleY = useRef(new Animated.Value(1)).current;
  const [homeHappy, setHomeHappy] = useState(false);
  const homeTapCooldown = useRef(false);

  // Combo flash
  const comboFlashAnim = useRef(new Animated.Value(0)).current;
  const [comboMilestone, setComboMilestone] = useState('');
  const comboMilestoneAnim = useRef(new Animated.Value(0)).current;

  // Home shimmer + play pulse
  const titleShimmerAnim = useRef(new Animated.Value(0)).current;
  const playPulseAnim = useRef(new Animated.Value(1)).current;
  const furinSwayAnim = useRef(new Animated.Value(0)).current;

  // Level up banner
  const levelUpBannerY = useRef(new Animated.Value(-80)).current;
  const levelUpBannerOpacity = useRef(new Animated.Value(0)).current;
  const levelUpFlashAnim = useRef(new Animated.Value(0)).current;

  // Game over effects
  const gameOverSquishY = useRef(new Animated.Value(1)).current;
  const gameOverSquishX = useRef(new Animated.Value(1)).current;
  const stampAnim = useRef(new Animated.Value(0)).current;
  const statAnim0 = useRef(new Animated.Value(0)).current;
  const statAnim1 = useRef(new Animated.Value(0)).current;
  const statAnim2 = useRef(new Animated.Value(0)).current;

  // ─── Audio Players ───
  const bgmPlayer = useAudioPlayer('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3');
  const popSfx = useAudioPlayer('https://actions.google.com/sounds/v1/cartoon/pop.ogg');
  const failSfx = useAudioPlayer('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg');

  useEffect(() => {
    bgmPlayer.loop = true;
    bgmPlayer.volume = 0.3;
    if (gameState === 'PLAYING') {
      bgmPlayer.play();
    } else {
      bgmPlayer.pause();
    }
  }, [gameState]);

  // ─── Home screen animations ───
  useEffect(() => {
    if (gameState === 'START') {
      titleEntryAnim.setValue(0);
      Animated.spring(titleEntryAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: false }).start();

      Animated.loop(Animated.sequence([
        Animated.timing(idleBreathAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(idleBreathAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])).start();
      Animated.loop(Animated.sequence([
        Animated.timing(idleBounceAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        Animated.timing(idleBounceAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
      ])).start();
      // Title shimmer
      Animated.loop(Animated.sequence([
        Animated.timing(titleShimmerAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(titleShimmerAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])).start();
      // Play button pulse
      Animated.loop(Animated.sequence([
        Animated.timing(playPulseAnim, { toValue: 1.06, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(playPulseAnim, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])).start();
      // Wind chime sway
      Animated.loop(Animated.sequence([
        Animated.timing(furinSwayAnim, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(furinSwayAnim, { toValue: -1, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])).start();
    } else {
      idleBreathAnim.stopAnimation();
      idleBounceAnim.stopAnimation();
      titleShimmerAnim.stopAnimation();
      playPulseAnim.stopAnimation(); playPulseAnim.setValue(1);
      furinSwayAnim.stopAnimation();
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      Animated.loop(Animated.sequence([
        Animated.timing(targetRotateAnim, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(targetRotateAnim, { toValue: -1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(targetRotateAnim, { toValue: 0, duration: 400, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])).start();
    } else { targetRotateAnim.stopAnimation(); targetRotateAnim.setValue(0); }
  }, [gameState]);

  // Background color smooth transition on level change
  useEffect(() => {
    const newIdx = Math.min(level - 1, bgColors.length - 1);
    if (newIdx !== curBgIdxRef.current) {
      prevBgIdxRef.current = curBgIdxRef.current;
      curBgIdxRef.current = newIdx;
      bgColorAnim.setValue(0);
      Animated.timing(bgColorAnim, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }).start();
    }
  }, [level]);

  const triggerWobble = useCallback(() => {
    wobbleAnim.setValue(0);
    Animated.sequence([
      Animated.timing(wobbleAnim, { toValue: 1, duration: 80, useNativeDriver: false }),
      Animated.timing(wobbleAnim, { toValue: -0.6, duration: 100, useNativeDriver: false }),
      Animated.timing(wobbleAnim, { toValue: 0.3, duration: 90, useNativeDriver: false }),
      Animated.timing(wobbleAnim, { toValue: -0.1, duration: 80, useNativeDriver: false }),
      Animated.timing(wobbleAnim, { toValue: 0, duration: 70, useNativeDriver: false }),
    ]).start();
  }, [wobbleAnim]);

  const triggerShake = useCallback(() => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 1, duration: 50, useNativeDriver: false }),
      Animated.timing(shakeAnim, { toValue: -1, duration: 50, useNativeDriver: false }),
      Animated.timing(shakeAnim, { toValue: 0.7, duration: 40, useNativeDriver: false }),
      Animated.timing(shakeAnim, { toValue: -0.5, duration: 40, useNativeDriver: false }),
      Animated.timing(shakeAnim, { toValue: 0.2, duration: 30, useNativeDriver: false }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 30, useNativeDriver: false }),
    ]).start();
  }, [shakeAnim]);

  const triggerBurst = useCallback((color: string) => {
    setBurstColor(color);
    setShowBurst(true);
    burstParticleAnim.setValue(0);
    Animated.timing(burstParticleAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start(() => setShowBurst(false));
  }, [burstParticleAnim]);

  // Separate, stable listener for height to prevent lag
  useEffect(() => {
    const hId = heightAnim.addListener(({ value }) => {
      heightRef.current = value;
      if (value > 155 && squishType !== 'tall') setSquishType('tall');
      else if (value < 125 && squishType !== 'wide') setSquishType('wide');
      else if (value >= 125 && value <= 155 && squishType !== 'normal') setSquishType('normal');
    });
    return () => heightAnim.removeListener(hId);
  }, [squishType]);

  // Track fallAnim value — read _value directly in collision loop for reliability
  const fallPosRef = useRef(-300);
  useEffect(() => {
    const id = fallAnim.addListener(({ value }) => { fallPosRef.current = value; });
    return () => fallAnim.removeListener(id);
  }, []);

  const frameRef = useRef<number | undefined>(undefined);
  // Use ref pattern to always have fresh closure (fixes retry bug)
  const checkCollisionRef = useRef<() => void>(undefined);
  checkCollisionRef.current = () => {
    if (gameStateRef.current !== 'PLAYING') return;

    const curVal = (fallAnim as any)._value as number;
    const dir = directionRef.current;
    let hasReachedMochi = false;
    switch (dir) {
      case 'top': hasReachedMochi = curVal > PLAYER_CENTER_Y - 30; break;
      case 'bottom': hasReachedMochi = curVal < PLAYER_CENTER_Y + 30; break;
      case 'left': hasReachedMochi = curVal > PLAYER_CENTER_X - 30; break;
      case 'right': hasReachedMochi = curVal < PLAYER_CENTER_X + 30; break;
    }

    if (hasReachedMochi && !passedRef.current) {
      passedRef.current = true;
      const curH = (heightAnim as any)._value as number;
      let isMatch = false;
      const currentTS = targetShapeRef.current;

      if (currentTS === 'tall' && curH >= 155) isMatch = true;
      else if (currentTS === 'wide' && curH <= 125) isMatch = true;
      else if (currentTS === 'circle' && curH > 125 && curH < 155) isMatch = true;

      if (isMatch) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 100);

        // Happy face on match
        if (happyTimerRef.current) clearTimeout(happyTimerRef.current);
        setIsHappy(true);
        happyTimerRef.current = setTimeout(() => setIsHappy(false), 400);

        popSfx.seekTo(0);
        popSfx.play();

        triggerBurst(TARGETS[currentTS].color);

        const isDouble = doubleCountRef.current > 0;
        if (isDouble) {
          doubleCountRef.current--;
          setDoubleCount(doubleCountRef.current);
          setItemPopup({ text: '✨ x2 SCORE!', color: '#C4A030' });
          itemPopupAnim.setValue(0);
          Animated.sequence([
            Animated.spring(itemPopupAnim, { toValue: 1, friction: 4, tension: 100, useNativeDriver: false }),
            Animated.delay(500),
            Animated.timing(itemPopupAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
          ]).start(() => setItemPopup(null));
        }

        setScore(s => {
          const ns = s + (isDouble ? 2 : 1); scoreRef.current = ns;
          if (ns % 3 === 0) {
            setLevel(l => {
              const newLvl = l + 1;
              levelRef.current = newLvl;
              return newLvl;
            });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            // Level up banner slide-down
            levelUpBannerY.setValue(-80);
            levelUpBannerOpacity.setValue(0);
            Animated.sequence([
              Animated.parallel([
                Animated.spring(levelUpBannerY, { toValue: 0, friction: 7, tension: 150, useNativeDriver: true }),
                Animated.timing(levelUpBannerOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
              ]),
              Animated.delay(1200),
              Animated.parallel([
                Animated.timing(levelUpBannerY, { toValue: -80, duration: 300, useNativeDriver: true }),
                Animated.timing(levelUpBannerOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
              ]),
            ]).start();
            // White flash
            levelUpFlashAnim.setValue(0);
            Animated.sequence([
              Animated.timing(levelUpFlashAnim, { toValue: 1, duration: 80, useNativeDriver: false }),
              Animated.timing(levelUpFlashAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
            ]).start();
            // Gold burst
            triggerBurst('#F0C75E');
          }
          return ns;
        });

        setCombo(c => {
          const nc = c + 1; comboRef.current = nc;
          if (nc >= 2) { comboAnim.setValue(0.5); Animated.spring(comboAnim, { toValue: 1, friction: 3, useNativeDriver: false }).start(); }

          // Combo milestone flash
          if (nc === 5 || nc === 10 || (nc > 10 && nc % 5 === 0)) {
            const milestone = nc >= 15 ? '神！' : nc === 10 ? '最高！' : 'すごい！';
            setComboMilestone(milestone);
            comboMilestoneAnim.setValue(0);
            Animated.sequence([
              Animated.spring(comboMilestoneAnim, { toValue: 1, friction: 4, tension: 120, useNativeDriver: false }),
              Animated.delay(700),
              Animated.timing(comboMilestoneAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
            ]).start(() => setComboMilestone(''));

            comboFlashAnim.setValue(0);
            Animated.sequence([
              Animated.timing(comboFlashAnim, { toValue: 1, duration: 120, useNativeDriver: false }),
              Animated.timing(comboFlashAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
            ]).start();

            // Extra burst particles for milestone
            triggerBurst(nc >= 15 ? '#C85070' : nc === 10 ? '#7060D4' : '#D4A030');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }

          return nc;
        });

        triggerWobble();

        ringScaleAnim.setValue(0.3); ringOpacityAnim.setValue(1);
        Animated.parallel([
          Animated.timing(ringScaleAnim, { toValue: 2.8, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
          Animated.timing(ringOpacityAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: false })
        ]).start();
      } else {
        // Mismatch — check shield
        if (shieldActiveRef.current) {
          shieldActiveRef.current = false;
          setHasShield(false);
          shieldAnim.setValue(1);
          Animated.timing(shieldAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
          // Shield break popup
          setShowShieldBreak(true);
          shieldBreakAnim.setValue(0);
          Animated.sequence([
            Animated.spring(shieldBreakAnim, { toValue: 1, friction: 4, tension: 100, useNativeDriver: false }),
            Animated.delay(600),
            Animated.timing(shieldBreakAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
          ]).start(() => setShowShieldBreak(false));
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          triggerWobble();
          // Continue playing — shield consumed
        } else {
          gameStateRef.current = 'OVER';
          setIsHappy(false);
          if (happyTimerRef.current) clearTimeout(happyTimerRef.current);
          const fs = scoreRef.current; const fc = comboRef.current;
          setBestCombo(fc);
          fallAnim.stopAnimation();

          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

          failSfx.seekTo(0);
          failSfx.play();

          triggerShake();
          gameOverSlideAnim.setValue(0);
          setGameState('OVER'); setCombo(0);
          Animated.spring(gameOverSlideAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: false }).start();

          // Mochi squish on death
          gameOverSquishY.setValue(1);
          gameOverSquishX.setValue(1);
          Animated.sequence([
            Animated.parallel([
              Animated.spring(gameOverSquishY, { toValue: 0.35, friction: 3, tension: 200, useNativeDriver: true }),
              Animated.spring(gameOverSquishX, { toValue: 1.5, friction: 3, tension: 200, useNativeDriver: true }),
            ]),
            Animated.parallel([
              Animated.spring(gameOverSquishY, { toValue: 0.5, friction: 5, tension: 80, useNativeDriver: true }),
              Animated.spring(gameOverSquishX, { toValue: 1.3, friction: 5, tension: 80, useNativeDriver: true }),
            ]),
          ]).start();

          // Stat stagger
          statAnim0.setValue(0); statAnim1.setValue(0); statAnim2.setValue(0);
          Animated.stagger(220, [
            Animated.timing(statAnim0, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(statAnim1, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(statAnim2, { toValue: 1, duration: 300, useNativeDriver: true }),
          ]).start();

          setDisplayScore(0); scoreCountAnim.setValue(0);
          const cd = Math.min(fs * 80, 1500);
          Animated.timing(scoreCountAnim, { toValue: fs, duration: cd, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
          const cid = scoreCountAnim.addListener(({ value: v }) => setDisplayScore(Math.round(v)));
          setTimeout(() => { scoreCountAnim.removeListener(cid); setDisplayScore(fs); }, cd + 100);

          // Earn coins
          const earned = fs;
          setEarnedCoins(earned);
          if (earned > 0) {
            setCoins(prev => {
              const newTotal = prev + earned;
              AsyncStorage.setItem('coins', String(newTotal));
              return newTotal;
            });
          }

          AsyncStorage.getItem('highScore').then(val => {
            const prev = val ? parseInt(val, 10) : 0;
            if (fs > prev) {
              AsyncStorage.setItem('highScore', String(fs)); setHighScore(fs);
              // Stamp slam for new best
              stampAnim.setValue(3);
              Animated.spring(stampAnim, { toValue: 1, friction: 4, tension: 180, useNativeDriver: true }).start();
              triggerBurst('#C85070');
            }
          });
        }
      }
    }

    if (gameStateRef.current === 'PLAYING') {
      frameRef.current = requestAnimationFrame(() => checkCollisionRef.current?.());
    }
  };

  useEffect(() => {
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, []);

  const startFallRef = useRef<() => void>(undefined);
  startFallRef.current = () => {
    // Pick direction based on level
    const lvl = levelRef.current;
    const availDirs: Direction[] =
      lvl <= 2 ? ['top'] :
        lvl <= 4 ? ['top', 'bottom'] :
          [...DIRECTIONS];
    const dir = availDirs[Math.floor(Math.random() * availDirs.length)];
    setCurrentDirection(dir);
    directionRef.current = dir;

    // Compute start/end by direction
    let startVal: number, endVal: number;
    switch (dir) {
      case 'top': startVal = -250; endVal = SCREEN_H + 150; break;
      case 'bottom': startVal = SCREEN_H + 250; endVal = -150; break;
      case 'left': startVal = -250; endVal = SCREEN_W + 150; break;
      case 'right': startVal = SCREEN_W + 250; endVal = -150; break;
    }

    fallAnim.setValue(startVal);
    fallPosRef.current = startVal;
    passedRef.current = false;
    let dur = 3000 - (Math.floor(scoreRef.current / 3) + 1) * 150;
    if (dur < 1000) dur = 1000;
    // Apply slow item
    if (slowCountRef.current > 0) {
      dur *= 2;
      slowCountRef.current--;
      setSlowCount(slowCountRef.current);
      setItemPopup({ text: '🐢 SLOW!', color: '#8DB580' });
      itemPopupAnim.setValue(0);
      Animated.sequence([
        Animated.spring(itemPopupAnim, { toValue: 1, friction: 4, tension: 100, useNativeDriver: false }),
        Animated.delay(500),
        Animated.timing(itemPopupAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
      ]).start(() => setItemPopup(null));
    }
    Animated.timing(fallAnim, { toValue: endVal, duration: dur, easing: Easing.linear, useNativeDriver: false }).start(({ finished }) => {
      if (finished && gameStateRef.current === 'PLAYING') {
        const nextTarget = TARGET_TYPES[Math.floor(Math.random() * TARGET_TYPES.length)];
        setTargetShape(nextTarget);
        targetShapeRef.current = nextTarget;
        startFallRef.current?.();
      }
    });
  };

  const startGame = () => {
    gameStateRef.current = 'PLAYING';
    passedRef.current = false;
    scoreRef.current = 0;
    comboRef.current = 0;

    // Apply active items
    shieldActiveRef.current = activeItems.shield;
    setHasShield(activeItems.shield);
    shieldAnim.setValue(0);
    slowCountRef.current = activeItems.slow ? 3 : 0;
    setSlowCount(slowCountRef.current);
    doubleCountRef.current = activeItems.double ? 5 : 0;
    setDoubleCount(doubleCountRef.current);

    // Consume items from inventory
    if (activeItems.shield || activeItems.slow || activeItems.double) {
      setInventory(prev => {
        const next = { ...prev };
        if (activeItems.shield) next.shield--;
        if (activeItems.slow) next.slow--;
        if (activeItems.double) next.double--;
        AsyncStorage.setItem('inventory', JSON.stringify(next));
        return next;
      });
      setActiveItems({ shield: false, slow: false, double: false });
    }

    fallAnim.stopAnimation();
    fallAnim.setValue(-250);
    fallPosRef.current = -250;

    screenFadeAnim.setValue(0);
    Animated.timing(screenFadeAnim, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();

    setGameState('PLAYING'); setScore(0); setLevel(1); setCombo(0); setBestCombo(0); setDisplayScore(0);
    prevBgIdxRef.current = 0; curBgIdxRef.current = 0; bgColorAnim.setValue(1);
    setTargetShape('circle');
    targetShapeRef.current = 'circle';
    setCurrentDirection('top');
    directionRef.current = 'top';
    levelRef.current = 1;

    heightAnim.setValue(BASE_DIM); popAnim.setValue(1); wobbleAnim.setValue(0);
    if (showTutorial) { setShowTutorial(false); AsyncStorage.setItem('tutorialDone', 'true'); }

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    checkCollisionRef.current?.();
    startFallRef.current?.();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const goHome = () => {
    screenFadeAnim.setValue(0);
    Animated.timing(screenFadeAnim, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    setGameState('START'); setScore(0); setLevel(1); setCombo(0); setBestCombo(0);
    prevBgIdxRef.current = 0; curBgIdxRef.current = 0; bgColorAnim.setValue(1);
    scoreRef.current = 0; heightAnim.setValue(BASE_DIM); popAnim.setValue(1); fallAnim.setValue(-300);
    gameStateRef.current = 'START';
    setCurrentDirection('top');
    directionRef.current = 'top';
    levelRef.current = 1;
    setAdContinueUsed(false);
  };

  const continueFromAd = () => {
    // Simulate watching an ad (placeholder — replace with real ad SDK later)
    setAdContinueUsed(true);
    gameStateRef.current = 'PLAYING';
    passedRef.current = false;
    comboRef.current = 0;

    // Apply active items
    shieldActiveRef.current = activeItems.shield;
    setHasShield(activeItems.shield);
    shieldAnim.setValue(0);
    slowCountRef.current = activeItems.slow ? 3 : 0;
    setSlowCount(slowCountRef.current);
    doubleCountRef.current = activeItems.double ? 5 : 0;
    setDoubleCount(doubleCountRef.current);

    // Consume items from inventory
    if (activeItems.shield || activeItems.slow || activeItems.double) {
      setInventory(prev => {
        const next = { ...prev };
        if (activeItems.shield) next.shield--;
        if (activeItems.slow) next.slow--;
        if (activeItems.double) next.double--;
        AsyncStorage.setItem('inventory', JSON.stringify(next));
        return next;
      });
      setActiveItems({ shield: false, slow: false, double: false });
    }

    fallAnim.stopAnimation();
    fallAnim.setValue(-250);
    fallPosRef.current = -250;
    heightAnim.setValue(BASE_DIM); wobbleAnim.setValue(0);

    setGameState('PLAYING'); setCombo(0);
    setCurrentDirection('top');
    directionRef.current = 'top';
    const nextTarget = TARGET_TYPES[Math.floor(Math.random() * TARGET_TYPES.length)];
    setTargetShape(nextTarget);
    targetShapeRef.current = nextTarget;

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    checkCollisionRef.current?.();
    startFallRef.current?.();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // ─── Shop functions ───
  const buySkin = (skin: MochiSkin) => {
    if (coins < skin.price || unlockedSkinIds.includes(skin.id)) return;
    const newCoins = coins - skin.price;
    const newUnlocked = [...unlockedSkinIds, skin.id];
    setCoins(newCoins);
    setUnlockedSkinIds(newUnlocked);
    AsyncStorage.setItem('coins', String(newCoins));
    AsyncStorage.setItem('unlockedSkins', JSON.stringify(newUnlocked));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const selectSkin = (skinId: string) => {
    setSelectedSkinId(skinId);
    AsyncStorage.setItem('selectedSkin', skinId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const buyItem = (item: GameItem) => {
    if (coins < item.price) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    const newCoins = coins - item.price;
    setCoins(newCoins);
    AsyncStorage.setItem('coins', String(newCoins));
    setInventory(prev => {
      const next = { ...prev, [item.id]: prev[item.id as keyof Inventory] + 1 };
      AsyncStorage.setItem('inventory', JSON.stringify(next));
      return next;
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const toggleActiveItem = (itemId: keyof Inventory) => {
    if (inventory[itemId] <= 0) return;
    setActiveItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => gameStateRef.current === 'PLAYING',
    onMoveShouldSetPanResponder: () => gameStateRef.current === 'PLAYING',
    onPanResponderMove: (_, gs) => {
      if (gameStateRef.current !== 'PLAYING') return;
      let newH = BASE_DIM - gs.dy * 1.5;
      heightAnim.setValue(Math.max(MIN_DIM, Math.min(MAX_DIM, newH)));
    },
    onPanResponderRelease: () => {
      if (gameStateRef.current !== 'PLAYING') return;
      Animated.spring(heightAnim, { toValue: BASE_DIM, friction: 3.5, tension: 80, useNativeDriver: false }).start();
      triggerWobble();
    }
  })).current;

  const isDead = gameState === 'OVER';
  const currentTarget = TARGETS[targetShape];
  // Japanese-inspired background colors
  const bgColors = ['#FFF5F0', '#F2F7E8', '#F5EFF8', '#FFF3E8', '#FFE8EE', '#EEF0F8', '#FFF8E0'];
  const prevColor = bgColors[Math.min(prevBgIdxRef.current, bgColors.length - 1)];
  const curColor = bgColors[Math.min(curBgIdxRef.current, bgColors.length - 1)];
  const appBgColor = bgColorAnim.interpolate({ inputRange: [0, 1], outputRange: [prevColor, curColor] });

  const wobbleRotate = wobbleAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-4deg', '0deg', '4deg'] });
  const shakeX = shakeAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: [-8, 0, 8] });
  const targetRotate = targetRotateAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-3deg', '0deg', '3deg'] });
  const idleScale = idleBreathAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const idleY = idleBounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });

  return (
    <Animated.View style={[styles.container, { backgroundColor: appBgColor, transform: [{ translateX: shakeX }] }]} {...panResponder.panHandlers}>
      <StatusBar style="dark" />

      {/* Background Illustrations */}
      <BackgroundIllustrations />

      {/* Seigaiha wave pattern at bottom */}
      <SeigaihaWaves opacity={0.06} />

      {/* Falling Sakura Petals — always visible */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {SAKURA_POSITIONS.map((sx, i) => (
          <FallingSakura key={`sakura-${i}`} delay={i * 800} startX={sx} />
        ))}
      </View>

      {/* Floating particles */}
      {(gameState === 'START' || gameState === 'SHOP') && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {Array.from({ length: 10 }).map((_, i) => (
            <FloatingParticle key={i} delay={i * 600} x={20 + (SCREEN_W - 40) * (i / 10)} />
          ))}
        </View>
      )}

      {/* Combo Milestone Flash Overlay */}
      {gameState === 'PLAYING' && (
        <Animated.View pointerEvents="none" style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 18,
          backgroundColor: comboFlashAnim.interpolate({ inputRange: [0, 1], outputRange: ['rgba(240,190,50,0)', 'rgba(240,190,50,0.22)'] }),
        }} />
      )}

      {/* Combo Milestone Text */}
      {gameState === 'PLAYING' && comboMilestone !== '' && (
        <Animated.View pointerEvents="none" style={{
          position: 'absolute', alignSelf: 'center', top: PLAYER_CENTER_Y - 120, zIndex: 60,
          opacity: comboMilestoneAnim,
          transform: [
            { scale: comboMilestoneAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.4, 1.15, 1] }) },
            { translateY: comboMilestoneAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
          ],
        }}>
          <Text style={{
            fontSize: 42, fontWeight: '900', color: '#C85070',
            textShadowColor: 'rgba(255,255,255,0.9)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 16,
            letterSpacing: 2,
          }}>{comboMilestone}</Text>
        </Animated.View>
      )}

      {/* Level Up White Flash */}
      {gameState === 'PLAYING' && (
        <Animated.View pointerEvents="none" style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 19,
          backgroundColor: levelUpFlashAnim.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)'] }),
        }} />
      )}

      {/* Level Up Banner */}
      {gameState === 'PLAYING' && (
        <Animated.View pointerEvents="none" style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
          transform: [{ translateY: levelUpBannerY }],
          opacity: levelUpBannerOpacity,
          backgroundColor: 'rgba(200,80,112,0.88)',
          paddingVertical: 14,
          paddingHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomWidth: 2,
          borderBottomColor: 'rgba(255,255,255,0.4)',
        }}>
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600', marginRight: 10 }}>レベルアップ！</Text>
          <Text style={{ color: '#FFE566', fontSize: 32, fontWeight: '900', letterSpacing: 1 }}>Level {level}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginLeft: 10 }}>第{level}段</Text>
        </Animated.View>
      )}

      {/* Burst Ring */}
      {gameState === 'PLAYING' && (
        <Animated.View style={[styles.burstRing, {
          borderColor: currentTarget.color,
          transform: [{ translateY: PLAYER_CENTER_Y }, { scale: ringScaleAnim }],
          opacity: ringOpacityAnim
        }]} />
      )}

      {/* Burst Particles */}
      {showBurst && (
        <View style={{ position: 'absolute', top: PLAYER_CENTER_Y, alignSelf: 'center', zIndex: 25 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <BurstParticle key={i} angle={i * 36} color={burstColor} anim={burstParticleAnim} />
          ))}
        </View>
      )}

      {/* Falling Target */}
      {gameState === 'PLAYING' && (
        <Animated.View style={{
          position: 'absolute',
          ...(currentDirection === 'left' || currentDirection === 'right'
            ? { left: 0, top: PLAYER_CENTER_Y - currentTarget.h / 2 }
            : { top: 0, alignSelf: 'center' as const }),
          width: currentTarget.w, height: currentTarget.h,
          borderRadius: currentTarget.w === currentTarget.h ? 999 : 40,
          borderWidth: 6, borderStyle: 'dashed', borderColor: currentTarget.color,
          backgroundColor: 'rgba(255,255,255,0.35)', justifyContent: 'center', alignItems: 'center',
          shadowColor: currentTarget.color, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 20,
          transform: currentDirection === 'left' || currentDirection === 'right'
            ? [{ translateX: fallAnim }, { translateX: -currentTarget.w / 2 }, { rotate: targetRotate }]
            : [{ translateY: fallAnim }, { translateY: -currentTarget.h / 2 }, { rotate: targetRotate }],
          zIndex: 10,
        }}>
          <Text style={[styles.frameLabel, { color: currentTarget.color }]}>{currentTarget.label}</Text>
        </Animated.View>
      )}

      {/* MOCHI */}
      {gameState === 'PLAYING' || gameState === 'OVER' ? (
        <Animated.View style={{
          position: 'absolute', top: 0, alignSelf: 'center', width: widthAnim, height: heightAnim,
          transform: gameState === 'OVER'
            ? [{ translateY: PLAYER_CENTER_Y }, { translateY: Animated.multiply(heightAnim, -0.5) }, { scale: popAnim }, { rotate: wobbleRotate }, { scaleY: gameOverSquishY }, { scaleX: gameOverSquishX }]
            : [{ translateY: PLAYER_CENTER_Y }, { translateY: Animated.multiply(heightAnim, -0.5) }, { scale: popAnim }, { rotate: wobbleRotate }],
          zIndex: 20,
        }}>
          {/* Active Shield Visual */}
          {hasShield && (
            <View pointerEvents="none" style={{
              position: 'absolute', top: -8, bottom: -8, left: -8, right: -8,
              borderRadius: 999, borderWidth: 4, borderColor: '#A0D8EF', backgroundColor: 'rgba(160, 216, 239, 0.25)',
              zIndex: 30,
            }} />
          )}
          {/* Shield Break Animation */}
          <Animated.View pointerEvents="none" style={{
            position: 'absolute', top: -8, bottom: -8, left: -8, right: -8,
            borderRadius: 999, borderWidth: 6, borderColor: '#A0D8EF',
            opacity: shieldAnim,
            transform: [{ scale: shieldAnim.interpolate({ inputRange: [0, 1], outputRange: [1.6, 1] }) }],
            zIndex: 30,
          }} />
          {/* Shield Break Popup */}
          {showShieldBreak && (
            <Animated.View pointerEvents="none" style={{
              position: 'absolute', top: -50, alignSelf: 'center', zIndex: 40,
              opacity: shieldBreakAnim,
              transform: [
                { scale: shieldBreakAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) },
                { translateY: shieldBreakAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
              ],
            }}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: '#A0D8EF', textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.15)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
                🛡️ SHIELD!
              </Text>
            </Animated.View>
          )}

          <View style={{
            flex: 1, backgroundColor: isDead ? currentSkin.deadBody : currentSkin.body, borderRadius: 999,
            borderWidth: 4, borderColor: isDead ? currentSkin.deadBorder : currentSkin.border,
            shadowColor: currentSkin.shadow, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.35, shadowRadius: 24, overflow: 'hidden',
          }}>
            <MochiPattern skinId={currentSkin.id} isDead={isDead} />
            <View style={[styles.blush, { left: squishType === 'wide' ? '15%' : '10%', backgroundColor: currentSkin.blush }]} />
            <View style={[styles.blush, { right: squishType === 'wide' ? '15%' : '10%', backgroundColor: currentSkin.blush }]} />
            <MochiDrawnFace isDead={isDead} squishType={squishType} isHappy={isHappy} />
          </View>
        </Animated.View>
      ) : (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (gameState !== 'START' || homeTapCooldown.current) return;
            homeTapCooldown.current = true;
            setTimeout(() => { homeTapCooldown.current = false; }, 400);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const reactions = ['squish', 'jump', 'happy'] as const;
            const pick = reactions[Math.floor(Math.random() * reactions.length)];
            if (pick === 'squish') {
              homeTapScaleX.setValue(1); homeTapScaleY.setValue(1);
              Animated.parallel([
                Animated.sequence([
                  Animated.timing(homeTapScaleX, { toValue: 1.3, duration: 100, useNativeDriver: false }),
                  Animated.spring(homeTapScaleX, { toValue: 1, friction: 3, tension: 120, useNativeDriver: false }),
                ]),
                Animated.sequence([
                  Animated.timing(homeTapScaleY, { toValue: 0.7, duration: 100, useNativeDriver: false }),
                  Animated.spring(homeTapScaleY, { toValue: 1, friction: 3, tension: 120, useNativeDriver: false }),
                ]),
              ]).start();
            } else if (pick === 'jump') {
              homeTapAnim.setValue(0);
              Animated.sequence([
                Animated.timing(homeTapAnim, { toValue: 1, duration: 150, easing: Easing.out(Easing.quad), useNativeDriver: false }),
                Animated.spring(homeTapAnim, { toValue: 0, friction: 3, tension: 100, useNativeDriver: false }),
              ]).start();
              setHomeHappy(true);
              setTimeout(() => setHomeHappy(false), 500);
            } else {
              setHomeHappy(true);
              setTimeout(() => setHomeHappy(false), 500);
            }
          }}
          style={{ position: 'absolute', top: 0, alignSelf: 'center', zIndex: 20 }}
        >
          <Animated.View style={{
            width: BASE_DIM, height: BASE_DIM,
            transform: [
              { translateY: PLAYER_CENTER_Y }, { translateY: -BASE_DIM / 2 },
              { scale: idleScale }, { translateY: idleY },
              { translateY: homeTapAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -30] }) },
              { scaleX: homeTapScaleX }, { scaleY: homeTapScaleY },
            ],
          }}>
            <View style={{
              flex: 1, backgroundColor: currentSkin.body, borderRadius: 999,
              borderWidth: 4, borderColor: currentSkin.border,
              shadowColor: currentSkin.shadow, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.35, shadowRadius: 24, overflow: 'hidden',
            }}>
              <MochiPattern skinId={currentSkin.id} isDead={false} />
              <View style={[styles.blush, { left: '10%', backgroundColor: currentSkin.blush }]} />
              <View style={[styles.blush, { right: '10%', backgroundColor: currentSkin.blush }]} />
              <MochiDrawnFace isDead={false} squishType="normal" isHappy={homeHappy} />
            </View>
          </Animated.View>
        </TouchableOpacity>
      )}

      {/* ─── UI OVERLAYS ─── */}
      <View style={styles.overlay} pointerEvents="box-none">

        {/* HUD */}
        {gameState === 'PLAYING' && (
          <Animated.View style={[styles.headsUpLayer, { opacity: screenFadeAnim }]} pointerEvents="none">
            <View style={styles.hudTopBar}>
              <View style={[styles.hudBadge, { borderColor: '#8DB580' }]}>
                <Text style={[styles.hudLabel, { color: '#8DB580' }]}>Lv</Text>
                <Text style={styles.hudValue}>{level}</Text>
              </View>
              <View style={[styles.hudBadge, { borderColor: '#E8A0B4' }]}>
                <Text style={[styles.hudLabel, { color: '#E8A0B4' }]}>🍡</Text>
                <Text style={styles.hudValue}>{score}</Text>
              </View>
            </View>

            {/* Active Item Status Indicators */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              {slowCount > 0 && (
                <View style={[styles.activeItemBadge, { backgroundColor: '#E8F4F8', borderColor: '#8DB580' }]}>
                  <Text style={{ fontSize: 16 }}>🐢 <Text style={{ fontSize: 14, fontWeight: '800', color: '#8DB580' }}>x{slowCount}</Text></Text>
                </View>
              )}
              {doubleCount > 0 && (
                <View style={[styles.activeItemBadge, { backgroundColor: '#FFFDF0', borderColor: '#F0C75E' }]}>
                  <Text style={{ fontSize: 16 }}>✨ <Text style={{ fontSize: 14, fontWeight: '800', color: '#C4A030' }}>x{doubleCount}</Text></Text>
                </View>
              )}
            </View>

            <View style={styles.popupArea}>
              {combo >= 2 && (
                <Animated.View style={[styles.comboBadge, { transform: [{ scale: comboAnim }] }]}>
                  <Text style={styles.comboText}>{combo} COMBO!</Text>
                </Animated.View>
              )}
            </View>
            {/* Item Use Popup */}
            {itemPopup && (
              <Animated.View pointerEvents="none" style={{
                position: 'absolute', top: SCREEN_H * 0.38, alignSelf: 'center', zIndex: 50,
                opacity: itemPopupAnim,
                transform: [
                  { scale: itemPopupAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) },
                  { translateY: itemPopupAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                ],
              }}>
                <Text style={{ fontSize: 24, fontWeight: '900', color: itemPopup.color, textAlign: 'center', textShadowColor: 'rgba(255,255,255,0.8)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 }}>
                  {itemPopup.text}
                </Text>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* ─── HOME SCREEN ─── */}
        {gameState === 'START' && (
          <Animated.View style={[styles.homeScreen, { opacity: screenFadeAnim }]}>
            {/* Coin display */}
            <View style={styles.coinBar}>
              <Text style={styles.coinText}>🍡 {coins}</Text>
            </View>

            {/* Top decorative bar — Japanese motif */}
            <View style={styles.homeTopArea}>
              <View style={styles.topDeco}>
                <View style={styles.decoLine} />
                <Text style={styles.decoText}>⛩️</Text>
                <View style={styles.decoLine} />
              </View>
              <Text style={styles.topDecoSub}>~ 和菓子ゲーム ~</Text>
            </View>

            {/* Wind chimes */}
            <View style={{ position: 'absolute', top: SCREEN_H * 0.03, left: 20 }}>
              <Furin swayAnim={furinSwayAnim} />
            </View>
            <View style={{ position: 'absolute', top: SCREEN_H * 0.05, right: 60 }}>
              <Furin swayAnim={furinSwayAnim} />
            </View>

            {/* Main title card */}
            <Animated.View style={[styles.homeTitleCard, {
              transform: [
                { scale: titleEntryAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
                { translateY: titleEntryAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
              ],
              opacity: titleEntryAnim,
            }]}>
              {/* Japanese subtitle */}
              <Text style={styles.titleJapanese}>もちもち</Text>

              <View style={styles.titleRow}>
                <Animated.Text style={[styles.titleMochi, {
                  textShadowColor: titleShimmerAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['rgba(240,200,100,0)', 'rgba(240,200,100,0.6)', 'rgba(240,200,100,0)'] }),
                  textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12,
                }]}>mochi</Animated.Text>
              </View>
              <Animated.Text style={[styles.titleMochi2, {
                textShadowColor: titleShimmerAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['rgba(240,200,100,0)', 'rgba(240,200,100,0.5)', 'rgba(240,200,100,0)'] }),
                textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12,
              }]}>mochi!</Animated.Text>

              <View style={styles.subtitleRow}>
                <View style={styles.subtitleLine} />
                <Text style={styles.subtitleText}>shape matching game</Text>
                <View style={styles.subtitleLine} />
              </View>

              {showTutorial ? (
                <View style={styles.tutorialContainer}>
                  <View style={styles.tutStep}>
                    <View style={styles.tutCircle}>
                      <Text style={styles.tutStepEmoji}>↕️</Text>
                    </View>
                    <Text style={styles.tutLabel}>Drag to stretch</Text>
                  </View>
                  <View style={styles.tutArrow}>
                    <Text style={{ color: '#D4C4B0', fontSize: 18 }}>→</Text>
                  </View>
                  <View style={styles.tutStep}>
                    <View style={styles.tutCircle}>
                      <Text style={styles.tutStepEmoji}>⭕</Text>
                    </View>
                    <Text style={styles.tutLabel}>Match the shape</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.highScoreArea}>
                  <View style={styles.highScoreCard}>
                    <Text style={styles.highScoreLabel}>YOUR BEST</Text>
                    <View style={styles.highScoreRow}>
                      <Text style={styles.highScoreEmoji}>🏅</Text>
                      <Text style={styles.highScoreNum}>{highScore}</Text>
                    </View>
                  </View>
                </View>
              )}
            </Animated.View>

            {/* Item slots */}
            <View style={styles.itemSlotsRow}>
              {GAME_ITEMS.map(item => {
                const count = inventory[item.id as keyof Inventory];
                const active = activeItems[item.id as keyof typeof activeItems];
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.itemSlot, active && count > 0 && styles.itemSlotActive]}
                    onPress={() => {
                      if (count > 0) {
                        toggleActiveItem(item.id as keyof Inventory);
                      } else {
                        buyItem(item);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 20, opacity: count > 0 ? 1 : 0.5 }}>{item.icon}</Text>
                    {count > 0 ? (
                      <Text style={styles.itemSlotCount}>x{count}</Text>
                    ) : (
                      <Text style={[styles.itemSlotCount, { color: coins >= item.price ? '#E8A0B4' : '#C4B5A5' }]}>🍡 {item.price}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Buttons */}
            <Animated.View style={{
              transform: [{ scale: titleEntryAnim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 0, 1] }) }],
              opacity: titleEntryAnim, alignItems: 'center', gap: 16,
            }}>
              <Animated.View style={{ transform: [{ scale: playPulseAnim }] }}>
                <TouchableOpacity style={styles.playButton} onPress={startGame} activeOpacity={0.85}>
                  <Text style={styles.playButtonText}>PLAY</Text>
                </TouchableOpacity>
              </Animated.View>
              <TouchableOpacity style={styles.shopBtn} onPress={() => setGameState('SHOP')} activeOpacity={0.85}>
                <Text style={styles.shopBtnText}>🛍️ SHOP</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}

        {/* ─── SHOP SCREEN ─── */}
        {gameState === 'SHOP' && (
          <View style={styles.shopScreen}>
            {/* Header */}
            <View style={styles.shopHeader}>
              <TouchableOpacity onPress={goHome} activeOpacity={0.7}>
                <Text style={styles.shopBackText}>← BACK</Text>
              </TouchableOpacity>
              <Text style={styles.shopCoins}>🍡 {coins}</Text>
            </View>

            {/* Tabs */}
            <View style={styles.shopTabs}>
              <TouchableOpacity
                style={[styles.shopTab, shopTab === 'skins' && styles.shopTabActive]}
                onPress={() => setShopTab('skins')}
                activeOpacity={0.7}
              >
                <Text style={[styles.shopTabText, shopTab === 'skins' && styles.shopTabTextActive]}>SKINS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.shopTab, shopTab === 'items' && styles.shopTabActive]}
                onPress={() => setShopTab('items')}
                activeOpacity={0.7}
              >
                <Text style={[styles.shopTabText, shopTab === 'items' && styles.shopTabTextActive]}>ITEMS</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={styles.shopContent} contentContainerStyle={styles.shopContentInner} showsVerticalScrollIndicator={false}>
              {shopTab === 'skins' ? (
                <View style={styles.skinGrid}>
                  {SKINS.map(skin => {
                    const owned = unlockedSkinIds.includes(skin.id);
                    const selected = selectedSkinId === skin.id;
                    const canBuy = coins >= skin.price;
                    return (
                      <View key={skin.id} style={[styles.skinCard, selected && styles.skinCardSelected]}>
                        {/* Preview mochi with pattern */}
                        <View style={[styles.skinPreview, { backgroundColor: skin.body, borderColor: skin.border }]}>
                          <MochiPattern skinId={skin.id} isDead={false} />
                          <View style={[styles.skinPreviewBlush, { backgroundColor: skin.blush, left: 10 }]} />
                          <View style={[styles.skinPreviewBlush, { backgroundColor: skin.blush, right: 10 }]} />
                          <View style={styles.skinPreviewEyes}>
                            <View style={styles.skinPreviewEye} />
                            <View style={styles.skinPreviewEye} />
                          </View>
                          <Text style={styles.skinPreviewMouth}>ω</Text>
                        </View>
                        <Text style={styles.skinName}>{skin.name}</Text>
                        {selected ? (
                          <View style={styles.selectedBadge}>
                            <Text style={styles.selectedBadgeText}>USING</Text>
                          </View>
                        ) : owned ? (
                          <TouchableOpacity style={styles.selectBtn} onPress={() => selectSkin(skin.id)} activeOpacity={0.7}>
                            <Text style={styles.selectBtnText}>SELECT</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={[styles.buyBtn, !canBuy && styles.buyBtnDisabled]}
                            onPress={() => buySkin(skin)}
                            activeOpacity={canBuy ? 0.7 : 1}
                          >
                            <Text style={[styles.buyBtnText, !canBuy && styles.buyBtnTextDisabled]}>🍡 {skin.price}</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.itemList}>
                  {GAME_ITEMS.map(item => {
                    const count = inventory[item.id as keyof Inventory];
                    const canBuy = coins >= item.price;
                    return (
                      <View key={item.id} style={styles.itemCard}>
                        <Text style={styles.itemIcon}>{item.icon}</Text>
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <Text style={styles.itemDesc}>{item.desc}</Text>
                          <Text style={styles.itemOwned}>Owned: {count}</Text>
                        </View>
                        <TouchableOpacity
                          style={[styles.buyBtn, !canBuy && styles.buyBtnDisabled]}
                          onPress={() => buyItem(item)}
                          activeOpacity={canBuy ? 0.7 : 1}
                        >
                          <Text style={[styles.buyBtnText, !canBuy && styles.buyBtnTextDisabled]}>🍡 {item.price}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* ─── GAME OVER ─── */}
        {gameState === 'OVER' && (
          <Animated.View style={[styles.gameOverScreen, {
            opacity: gameOverSlideAnim,
            transform: [{ translateY: gameOverSlideAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) }]
          }]}>
            <View style={styles.gameOverCard}>
              {/* Decorative Japanese top strip */}
              <View style={{
                height: 52, backgroundColor: '#F7D0DB', borderTopLeftRadius: 26, borderTopRightRadius: 26,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
                marginHorizontal: -24, marginTop: -20, marginBottom: 16,
                borderBottomWidth: 1.5, borderBottomColor: '#E8B4C2',
              }}>
                {[0,1,2,3,4].map(i => (
                  <View key={i} style={{
                    width: 12, height: 12, borderRadius: 6,
                    backgroundColor: i % 2 === 0 ? '#C85070' : '#F0B8C8',
                    opacity: 0.7,
                  }} />
                ))}
              </View>

              <Text style={{ fontSize: 14, fontWeight: '600', color: '#B0948A', letterSpacing: 4, marginBottom: 4 }}>ぺちゃんこ</Text>
              <Text style={styles.gameOverTitle}>SQUISHED!</Text>
              <View style={{ width: 60, height: 2, backgroundColor: '#E8C4C4', borderRadius: 1, marginBottom: 12 }} />

              <View style={styles.scoreArea}>
                <Text style={styles.scoreLabel}>SCORE</Text>
                <Animated.View style={{ opacity: statAnim0, transform: [{ translateY: statAnim0.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>
                  <Text style={styles.scoreNum}>{displayScore}</Text>
                </Animated.View>
                {score > highScore && score > 0 && (
                  <Animated.View style={{
                    transform: [
                      { scale: stampAnim.interpolate({ inputRange: [1, 3], outputRange: [1, 3] }) },
                      { rotate: stampAnim.interpolate({ inputRange: [1, 3], outputRange: ['0deg', '-15deg'] }) },
                    ],
                  }}>
                    <View style={{
                      width: 72, height: 72, borderRadius: 36,
                      backgroundColor: '#C85070', borderWidth: 3, borderColor: '#A03050',
                      alignItems: 'center', justifyContent: 'center',
                      shadowColor: '#C85070', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
                    }}>
                      <Text style={{ color: '#fff', fontSize: 11, fontWeight: '900', lineHeight: 14, textAlign: 'center' }}>{'NEW\nBEST'}</Text>
                    </View>
                  </Animated.View>
                )}
                {score <= highScore && highScore > 0 && (
                  <Text style={styles.bestText}>BEST: {highScore}</Text>
                )}
                <Animated.View style={{ opacity: statAnim1, transform: [{ translateY: statAnim1.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>
                  {bestCombo > 1 && <Text style={styles.comboResultText}>Best Combo: {bestCombo}</Text>}
                </Animated.View>
                <Animated.View style={{ opacity: statAnim2, transform: [{ translateY: statAnim2.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>
                  {earnedCoins > 0 && (
                    <Text style={styles.earnedCoinsText}>+{earnedCoins} 🍡</Text>
                  )}
                </Animated.View>
              </View>
            </View>

            {/* Item slots for Retry */}
            <View style={[styles.itemSlotsRow, { marginTop: -10, marginBottom: 10 }]}>
              {GAME_ITEMS.map(item => {
                const count = inventory[item.id as keyof Inventory];
                const active = activeItems[item.id as keyof typeof activeItems];
                return (
                  <TouchableOpacity
                    key={`retry-${item.id}`}
                    style={[styles.itemSlot, active && count > 0 && styles.itemSlotActive]}
                    onPress={() => {
                      if (count > 0) {
                        toggleActiveItem(item.id as keyof Inventory);
                      } else {
                        buyItem(item);
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 20, opacity: count > 0 ? 1 : 0.5 }}>{item.icon}</Text>
                    {count > 0 ? (
                      <Text style={styles.itemSlotCount}>x{count}</Text>
                    ) : (
                      <Text style={[styles.itemSlotCount, { color: coins >= item.price ? '#E8A0B4' : '#C4B5A5' }]}>🍡 {item.price}</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={{ gap: 12, alignItems: 'center' }}>
              {!adContinueUsed && score > 0 && (
                <TouchableOpacity style={styles.adContinueBtn} onPress={continueFromAd} activeOpacity={0.85}>
                  <Text style={styles.adContinueBtnText}>▶ CONTINUE</Text>
                  <Text style={styles.adContinueSubText}>Watch Ad</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.retryButton} onPress={startGame} activeOpacity={0.85}>
                <Text style={styles.retryButtonText}>RETRY</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.homeBtn} onPress={goHome} activeOpacity={0.85}>
                <Text style={styles.homeBtnText}>HOME</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', overflow: 'hidden' },
  blush: { position: 'absolute', top: '38%', width: 28, height: 18, borderRadius: 10 },
  burstRing: { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 12, top: -70, alignSelf: 'center', zIndex: 15 },
  frameLabel: { fontSize: 26, fontWeight: '900', opacity: 0.7, letterSpacing: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', zIndex: 100 },
  headsUpLayer: { position: 'absolute', top: 60, left: 0, right: 0, bottom: 0, alignItems: 'center' },

  // HUD
  hudTopBar: { flexDirection: 'row', gap: 15 },
  hudBadge: { backgroundColor: 'rgba(255,249,240,0.9)', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, borderWidth: 2.5, alignItems: 'center', minWidth: 90, flexDirection: 'row', gap: 8, shadowColor: '#B0948A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10 },
  hudLabel: { fontSize: 18, fontWeight: '900' },
  hudValue: { fontSize: 24, fontWeight: '900', color: '#4A3F35' },
  activeItemBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 2, shadowColor: '#D4C4B0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5 },
  popupArea: { flex: 1, alignItems: 'center', paddingTop: 20 },
  comboBadge: { backgroundColor: 'rgba(255,249,240,0.95)', paddingHorizontal: 22, paddingVertical: 10, borderRadius: 20, borderWidth: 3, borderColor: '#D4A030', transform: [{ rotate: '-6deg' }], shadowColor: '#D4A030', shadowOpacity: 0.35, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12 },
  comboText: { fontSize: 20, fontWeight: '900', color: '#B88A20', letterSpacing: 2 },
  levelUpContainer: { marginTop: 20, backgroundColor: 'rgba(255,249,240,0.95)', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 22, borderWidth: 3, borderColor: '#7BA870', shadowColor: '#7BA870', shadowOpacity: 0.4, shadowOffset: { width: 0, height: 8 }, shadowRadius: 16 },
  levelUpText: { fontSize: 26, fontWeight: '900', color: '#5A8A4E', letterSpacing: 2 },

  // ─── HOME SCREEN ───
  homeScreen: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  coinBar: { position: 'absolute', top: SCREEN_H * 0.06, right: 20, backgroundColor: 'rgba(255,249,240,0.9)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: '#E0D0C0', shadowColor: '#B0948A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  coinText: { fontSize: 16, fontWeight: '900', color: '#4A3F35' },
  homeTopArea: { position: 'absolute', top: SCREEN_H * 0.08, alignItems: 'center' },
  topDeco: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  decoLine: { width: 40, height: 2, backgroundColor: '#E0D5C8', borderRadius: 1 },
  decoText: { fontSize: 20 },
  topDecoSub: { fontSize: 11, fontWeight: '600', color: '#C4B5A5', letterSpacing: 3, marginTop: 6 },

  homeTitleCard: {
    backgroundColor: '#FFF9F0', borderRadius: 28, paddingHorizontal: 36, paddingTop: 32, paddingBottom: 36,
    alignItems: 'center', width: '100%', maxWidth: 340, marginBottom: 24,
    borderWidth: 3, borderColor: '#E8D8C8',
    shadowColor: '#B0948A', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.25, shadowRadius: 30,
  },
  titleJapanese: { fontSize: 16, fontWeight: '700', color: '#C4B5A5', letterSpacing: 6, marginBottom: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  titleMochi: { fontSize: 54, fontWeight: '900', color: '#D4748E', letterSpacing: -1 },
  titleMochi2: { fontSize: 58, fontWeight: '900', color: '#7BA870', marginTop: -14, letterSpacing: -2 },

  subtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  subtitleLine: { width: 24, height: 1.5, backgroundColor: '#D4C4B0', borderRadius: 1 },
  subtitleText: { fontSize: 12, fontWeight: '700', color: '#C4B5A5', letterSpacing: 2, textTransform: 'uppercase' },

  tutorialContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 28 },
  tutStep: { alignItems: 'center', gap: 8 },
  tutCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#F5EDE0', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#E8DDD0' },
  tutStepEmoji: { fontSize: 24 },
  tutLabel: { fontSize: 11, fontWeight: '800', color: '#8B7E74', textAlign: 'center', maxWidth: 80 },
  tutArrow: { marginTop: -16 },

  highScoreArea: { marginTop: 24, alignItems: 'center', width: '100%' },
  highScoreCard: { backgroundColor: '#F5EDE0', borderRadius: 18, paddingHorizontal: 30, paddingVertical: 16, alignItems: 'center', borderWidth: 2, borderColor: '#E0D4C6' },
  highScoreLabel: { fontSize: 11, fontWeight: '800', color: '#C4B5A5', letterSpacing: 2 },
  highScoreRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  highScoreEmoji: { fontSize: 22 },
  highScoreNum: { fontSize: 36, fontWeight: '900', color: '#4A3F35' },

  // Item slots on home screen
  itemSlotsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  itemSlot: { backgroundColor: 'rgba(255,249,240,0.9)', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 2, borderColor: '#E0D4C6', alignItems: 'center', gap: 2, shadowColor: '#B0948A', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6 },
  itemSlotActive: { borderColor: '#7BA870', backgroundColor: '#EEF6E6' },
  itemSlotCount: { fontSize: 10, fontWeight: '800', color: '#8B7E74' },

  playButton: {
    backgroundColor: '#C85070', paddingHorizontal: 72, paddingVertical: 22, borderRadius: 999,
    borderWidth: 4, borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#C85070', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.45, shadowRadius: 25,
  },
  playButtonText: { color: '#FFF', fontSize: 28, fontWeight: '900', letterSpacing: 6 },

  shopBtn: { backgroundColor: '#B8956A', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 999, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)', shadowColor: '#B8956A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 15 },
  shopBtnText: { color: '#FFF', fontSize: 18, fontWeight: '900', letterSpacing: 2 },

  // ─── SHOP SCREEN ───
  shopScreen: { flex: 1, width: '100%', paddingTop: SCREEN_H * 0.06 },
  shopHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  shopBackText: { fontSize: 16, fontWeight: '900', color: '#8B7E74' },
  shopCoins: { fontSize: 18, fontWeight: '900', color: '#4A3F35', backgroundColor: '#FFF9F0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 3, borderColor: '#F0E6D8', overflow: 'hidden' },
  shopTabs: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 16 },
  shopTab: { flex: 1, paddingVertical: 12, borderRadius: 18, backgroundColor: '#F0E8DC', alignItems: 'center', borderWidth: 2, borderColor: '#E0D4C6' },
  shopTabActive: { backgroundColor: '#FFF9F0', borderColor: '#C85070' },
  shopTabText: { fontSize: 14, fontWeight: '900', color: '#B0A090', letterSpacing: 2 },
  shopTabTextActive: { color: '#C85070' },
  shopContent: { flex: 1, paddingHorizontal: 20 },
  shopContentInner: { paddingBottom: 40 },

  // Skin grid
  skinGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  skinCard: { width: (SCREEN_W - 52) / 2, backgroundColor: '#FFF9F0', borderRadius: 20, padding: 14, alignItems: 'center', borderWidth: 2, borderColor: '#E8D8C8', gap: 8, shadowColor: '#B0948A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  skinCardSelected: { borderColor: '#7BA870', borderWidth: 3 },
  skinPreview: { width: 76, height: 76, borderRadius: 38, borderWidth: 3, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', shadowColor: '#B0948A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  skinPreviewBlush: { position: 'absolute', top: '38%', width: 14, height: 9, borderRadius: 5, opacity: 0.6 },
  skinPreviewEyes: { flexDirection: 'row', gap: 12, marginTop: -4 },
  skinPreviewEye: { width: 7, height: 10, backgroundColor: '#4A3F35', borderRadius: 4 },
  skinPreviewMouth: { fontSize: 9, color: '#C4907A', fontWeight: '600', marginTop: -2 },
  skinName: { fontSize: 12, fontWeight: '800', color: '#4A3F35', textAlign: 'center' },

  // Item list
  itemList: { gap: 12 },
  itemCard: { flexDirection: 'row', backgroundColor: '#FFF9F0', borderRadius: 20, padding: 16, alignItems: 'center', borderWidth: 3, borderColor: '#F0E6D8', gap: 12 },
  itemIcon: { fontSize: 32 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '900', color: '#4A3F35' },
  itemDesc: { fontSize: 11, fontWeight: '700', color: '#8B7E74', marginTop: 2 },
  itemOwned: { fontSize: 11, fontWeight: '800', color: '#C4B5A5', marginTop: 4 },

  // Buy/Select buttons
  selectedBadge: { backgroundColor: '#7BA870', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 },
  selectedBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  selectBtn: { backgroundColor: '#F5EDE0', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, borderWidth: 2, borderColor: '#E8DDD0' },
  selectBtnText: { color: '#8B7E74', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  buyBtn: { backgroundColor: '#C85070', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14 },
  buyBtnDisabled: { backgroundColor: '#E8DDD0' },
  buyBtnText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  buyBtnTextDisabled: { color: '#C4B5A5' },

  // ─── GAME OVER ───
  gameOverScreen: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(60,40,35,0.4)', paddingHorizontal: 30 },
  gameOverCard: {
    backgroundColor: '#FFF9F0', borderRadius: 28, paddingHorizontal: 36, paddingVertical: 36,
    alignItems: 'center', width: '100%', maxWidth: 340, marginBottom: 40,
    borderWidth: 3, borderColor: '#E8D8C8',
    shadowColor: '#8A6A5A', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.3, shadowRadius: 30,
  },
  gameOverTitle: { fontSize: 38, fontWeight: '900', color: '#C85070', letterSpacing: 1 },
  scoreArea: { marginTop: 20, alignItems: 'center' },
  scoreLabel: { fontSize: 14, fontWeight: '800', color: '#8B7E74', letterSpacing: 2 },
  scoreNum: { fontSize: 68, fontWeight: '900', color: '#4A3F35', marginVertical: 8 },
  bestText: { fontSize: 14, fontWeight: '800', color: '#C4B5A5', marginTop: 4 },
  comboResultText: { fontSize: 14, fontWeight: '800', color: '#F0C75E', marginTop: 8 },
  earnedCoinsText: { fontSize: 20, fontWeight: '900', color: '#F0C75E', marginTop: 12 },

  retryButton: {
    backgroundColor: '#C85070', paddingHorizontal: 64, paddingVertical: 22, borderRadius: 999,
    borderWidth: 4, borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#C85070', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.45, shadowRadius: 25,
  },
  retryButtonText: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: 4 },
  homeBtn: { paddingHorizontal: 40, paddingVertical: 12, borderRadius: 999, borderWidth: 3, borderColor: '#D4C4B0' },
  homeBtnText: { color: '#8B7E74', fontSize: 16, fontWeight: '900', letterSpacing: 2 },

  newBestBadge: { backgroundColor: '#F0C75E', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginTop: 8, shadowColor: '#F0C75E', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10 },
  newBestText: { color: '#FFF', fontSize: 14, fontWeight: '900', letterSpacing: 2 },

  // Ad Continue
  adContinueBtn: { backgroundColor: '#7BA870', paddingHorizontal: 48, paddingVertical: 16, borderRadius: 999, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)', shadowColor: '#7BA870', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20, alignItems: 'center' },
  adContinueBtnText: { color: '#FFF', fontSize: 22, fontWeight: '900', letterSpacing: 2 },
  adContinueSubText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '800', marginTop: 2, letterSpacing: 1 },
});
