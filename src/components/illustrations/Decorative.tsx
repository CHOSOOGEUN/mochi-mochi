import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { SCREEN_W, SCREEN_H } from '../../constants';

// ─── Primitive decorative elements ───

export const CherryBlossom = ({ x, y, size = 24, opacity = 0.3, rotate = '0deg' }: { x: number; y: number; size?: number; opacity?: number; rotate?: string }) => {
  const petalColor = `rgba(232, 160, 180, ${opacity})`;
  const centerColor = `rgba(240, 199, 94, ${opacity + 0.2})`;
  const ps = size * 0.38;
  return (
    <View style={{ position: 'absolute', left: x, top: y, width: size, height: size, transform: [{ rotate }] }}>
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <View key={i} style={{
          position: 'absolute', left: size / 2 - ps / 2, top: size / 2 - ps,
          width: ps, height: ps, borderRadius: ps / 2, backgroundColor: petalColor,
          transform: [{ translateY: -ps * 0.3 }, { rotate: `${deg}deg` }],
          transformOrigin: `${ps / 2}px ${ps + ps * 0.3}px`,
        }} />
      ))}
      <View style={{ position: 'absolute', left: size / 2 - 3, top: size / 2 - 3, width: 6, height: 6, borderRadius: 3, backgroundColor: centerColor }} />
    </View>
  );
};

export const Dango = ({ x, y, scale = 1, opacity = 0.25 }: { x: number; y: number; scale?: number; opacity?: number }) => {
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

export const CloudPuff = ({ x, y, w = 60, opacity = 0.15 }: { x: number; y: number; w?: number; opacity?: number }) => {
  const c = `rgba(255, 249, 240, ${opacity})`;
  return (
    <View style={{ position: 'absolute', left: x, top: y, flexDirection: 'row', alignItems: 'flex-end' }}>
      <View style={{ width: w * 0.4, height: w * 0.3, borderRadius: w * 0.2, backgroundColor: c }} />
      <View style={{ width: w * 0.5, height: w * 0.45, borderRadius: w * 0.25, backgroundColor: c, marginLeft: -w * 0.1, marginBottom: w * 0.05 }} />
      <View style={{ width: w * 0.35, height: w * 0.28, borderRadius: w * 0.18, backgroundColor: c, marginLeft: -w * 0.08 }} />
    </View>
  );
};

export const Leaf = ({ x, y, rotate = '30deg', opacity = 0.2 }: { x: number; y: number; rotate?: string; opacity?: number }) => (
  <View style={{ position: 'absolute', left: x, top: y, width: 10, height: 16, borderRadius: 8, backgroundColor: `rgba(141, 181, 128, ${opacity})`, transform: [{ rotate }] }} />
);

export const MiniMochi = ({ x, y, color = '#FFF9F0', opacity = 0.35 }: { x: number; y: number; color?: string; opacity?: number }) => (
  <View style={{ position: 'absolute', left: x, top: y, alignItems: 'center' }}>
    <View style={{ width: 22, height: 18, borderRadius: 11, backgroundColor: color, opacity }}>
      <View style={{ flexDirection: 'row', gap: 4, position: 'absolute', top: 5, alignSelf: 'center' }}>
        <View style={{ width: 3, height: 4, borderRadius: 2, backgroundColor: `rgba(74, 63, 53, ${opacity})` }} />
        <View style={{ width: 3, height: 4, borderRadius: 2, backgroundColor: `rgba(74, 63, 53, ${opacity})` }} />
      </View>
    </View>
  </View>
);

export const Sparkle = ({ x, y, size = 8, opacity = 0.3 }: { x: number; y: number; size?: number; opacity?: number }) => (
  <View style={{ position: 'absolute', left: x, top: y, width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: size, height: 2, borderRadius: 1, backgroundColor: `rgba(240, 199, 94, ${opacity})`, position: 'absolute' }} />
    <View style={{ width: 2, height: size, borderRadius: 1, backgroundColor: `rgba(240, 199, 94, ${opacity})`, position: 'absolute' }} />
    <View style={{ width: size * 0.7, height: 1.5, borderRadius: 1, backgroundColor: `rgba(240, 199, 94, ${opacity * 0.6})`, position: 'absolute', transform: [{ rotate: '45deg' }] }} />
    <View style={{ width: size * 0.7, height: 1.5, borderRadius: 1, backgroundColor: `rgba(240, 199, 94, ${opacity * 0.6})`, position: 'absolute', transform: [{ rotate: '-45deg' }] }} />
  </View>
);

export const ToriiGate = ({ x, y, scale = 1, opacity = 0.15 }: { x: number; y: number; scale?: number; opacity?: number }) => {
  const w = 50 * scale;
  const h = 60 * scale;
  const pillarW = 5 * scale;
  const beamH = 6 * scale;
  const c = `rgba(200, 80, 80, ${opacity})`;
  return (
    <View style={{ position: 'absolute', left: x, top: y, width: w, height: h }}>
      <View style={{ position: 'absolute', top: 0, left: -4 * scale, right: -4 * scale, height: beamH, backgroundColor: c, borderRadius: beamH }} />
      <View style={{ position: 'absolute', top: beamH + 6 * scale, left: 2 * scale, right: 2 * scale, height: beamH * 0.7, backgroundColor: c, borderRadius: 2 }} />
      <View style={{ position: 'absolute', top: beamH * 0.5, left: 6 * scale, width: pillarW, height: h - beamH, backgroundColor: c, borderRadius: 2 }} />
      <View style={{ position: 'absolute', top: beamH * 0.5, right: 6 * scale, width: pillarW, height: h - beamH, backgroundColor: c, borderRadius: 2 }} />
    </View>
  );
};

export const PaperLantern = ({ x, y, scale = 1, opacity = 0.2, color = 'rgba(240, 80, 80, OPACITY)' }: { x: number; y: number; scale?: number; opacity?: number; color?: string }) => {
  const s = 24 * scale;
  const c = color.replace('OPACITY', String(opacity));
  const stringC = `rgba(80, 60, 50, ${opacity * 0.6})`;
  return (
    <View style={{ position: 'absolute', left: x, top: y, alignItems: 'center' }}>
      <View style={{ width: 1.5, height: 10 * scale, backgroundColor: stringC }} />
      <View style={{ width: s, height: s * 1.3, borderRadius: s / 2, backgroundColor: c }}>
        <View style={{ position: 'absolute', top: s * 0.35, left: 3 * scale, right: 3 * scale, height: 1.5, backgroundColor: `rgba(60, 40, 30, ${opacity * 0.3})`, borderRadius: 1 }} />
        <View style={{ position: 'absolute', top: s * 0.65, left: 3 * scale, right: 3 * scale, height: 1.5, backgroundColor: `rgba(60, 40, 30, ${opacity * 0.3})`, borderRadius: 1 }} />
      </View>
      <View style={{ width: 2, height: 6 * scale, backgroundColor: stringC, borderRadius: 1 }} />
    </View>
  );
};

export const SeigaihaWaves = ({ opacity = 0.08 }: { opacity?: number }) => {
  const waveSize = 30;
  const rows = 3;
  const cols = Math.ceil(SCREEN_W / waveSize) + 1;
  const c = `rgba(160, 130, 110, ${opacity})`;
  return (
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: rows * waveSize * 0.6, overflow: 'hidden' }}>
      {Array.from({ length: rows }).map((_, row) => (
        <View key={row} style={{ flexDirection: 'row', position: 'absolute', bottom: row * waveSize * 0.5, left: row % 2 === 0 ? 0 : -waveSize / 2 }}>
          {Array.from({ length: cols }).map((_, col) => (
            <View key={col} style={{ width: waveSize, height: waveSize, borderRadius: waveSize / 2, borderWidth: 1.5, borderColor: c, backgroundColor: 'transparent', marginRight: -1 }} />
          ))}
        </View>
      ))}
    </View>
  );
};

export const Furin = ({ swayAnim }: { swayAnim: Animated.Value }) => {
  const rotate = swayAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-8deg', '0deg', '8deg'] });
  const tailRotate = swayAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-12deg', '0deg', '12deg'] });
  return (
    <Animated.View style={{ alignItems: 'center', transform: [{ rotate }], transformOrigin: 'center top' }}>
      <View style={{ width: 1, height: 12, backgroundColor: 'rgba(140,120,100,0.3)' }} />
      <View style={{ width: 22, height: 18, borderTopLeftRadius: 11, borderTopRightRadius: 11, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, backgroundColor: 'rgba(160,210,240,0.35)', borderWidth: 1, borderColor: 'rgba(140,190,220,0.3)' }}>
        <View style={{ position: 'absolute', bottom: 0, left: 2, right: 2, height: 3, backgroundColor: 'rgba(100,180,220,0.2)', borderRadius: 1 }} />
      </View>
      <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(140,120,100,0.3)', marginTop: -1 }} />
      <Animated.View style={{ width: 10, height: 28, backgroundColor: 'rgba(200,80,80,0.2)', borderRadius: 2, marginTop: 1, transform: [{ rotate: tailRotate }], transformOrigin: 'center top' }}>
        <View style={{ position: 'absolute', top: 8, left: 2, right: 2, height: 1, backgroundColor: 'rgba(160,60,60,0.15)' }} />
        <View style={{ position: 'absolute', top: 16, left: 2, right: 2, height: 1, backgroundColor: 'rgba(160,60,60,0.12)' }} />
      </Animated.View>
    </Animated.View>
  );
};

// ─── Full background scene ───
export const BackgroundIllustrations = React.memo(() => (
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

    <ToriiGate x={SCREEN_W * 0.02} y={SCREEN_H * 0.14} scale={0.7} opacity={0.1} />
    <ToriiGate x={SCREEN_W * 0.78} y={SCREEN_H * 0.7} scale={0.5} opacity={0.08} />
    <ToriiGate x={SCREEN_W * 0.4} y={SCREEN_H * 0.92} scale={0.6} opacity={0.07} />

    <PaperLantern x={SCREEN_W * 0.08} y={SCREEN_H * 0.02} scale={0.8} opacity={0.18} />
    <PaperLantern x={SCREEN_W * 0.85} y={SCREEN_H * 0.05} scale={0.6} opacity={0.14} color="rgba(240, 180, 60, OPACITY)" />
    <PaperLantern x={SCREEN_W * 0.5} y={SCREEN_H * 0.01} scale={0.7} opacity={0.12} />
    <PaperLantern x={SCREEN_W * 0.92} y={SCREEN_H * 0.35} scale={0.5} opacity={0.1} color="rgba(240, 180, 60, OPACITY)" />
    <PaperLantern x={SCREEN_W * 0.02} y={SCREEN_H * 0.6} scale={0.55} opacity={0.1} />
  </View>
));
