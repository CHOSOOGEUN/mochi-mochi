import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// 1. CLASSIC — Breathing glow + Pink ribbon bow
// ─────────────────────────────────────────────────────────────────────────────
const ClassicInside = () => {
  const breathAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(breathAnim, { toValue: 1, duration: 3200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(breathAnim, { toValue: 0, duration: 3200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ])).start();
  }, []);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Breathing warm pulse */}
      <Animated.View style={{
        position: 'absolute', top: '12%', left: '12%', right: '12%', bottom: '12%',
        borderRadius: 999,
        backgroundColor: '#FFE0D0',
        opacity: breathAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.14] }),
      }} />
      {/* Primary gloss — top right */}
      <View style={{ position: 'absolute', top: '7%', right: '9%', width: 32, height: 20, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.6)', transform: [{ rotate: '-36deg' }] }} />
      {/* Secondary gloss */}
      <View style={{ position: 'absolute', top: '18%', right: '22%', width: 14, height: 9, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.44)', transform: [{ rotate: '-36deg' }] }} />
      {/* Soft bottom depth shadow */}
      <View style={{ position: 'absolute', bottom: 0, left: '14%', right: '14%', height: '26%', backgroundColor: 'rgba(215,175,155,0.1)', borderTopLeftRadius: 80, borderTopRightRadius: 80 }} />
    </View>
  );
};

const ClassicOutside = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Left bow wing */}
    <View style={{ position: 'absolute', top: '-30%', left: '1%', width: 38, height: 26, borderRadius: 19, backgroundColor: '#EF6080', transform: [{ rotate: '-26deg' }] }}>
      <View style={{ position: 'absolute', top: 5, left: 6, right: 6, bottom: 5, borderRadius: 13, backgroundColor: 'rgba(255,148,168,0.52)' }} />
    </View>
    {/* Right bow wing */}
    <View style={{ position: 'absolute', top: '-30%', right: '1%', width: 38, height: 26, borderRadius: 19, backgroundColor: '#EF6080', transform: [{ rotate: '26deg' }] }}>
      <View style={{ position: 'absolute', top: 5, left: 6, right: 6, bottom: 5, borderRadius: 13, backgroundColor: 'rgba(255,148,168,0.52)' }} />
    </View>
    {/* Bow center knot */}
    <View style={{ position: 'absolute', top: '-18%', left: '37%', width: 22, height: 22, borderRadius: 11, backgroundColor: '#D83858' }}>
      <View style={{ position: 'absolute', top: 5, left: 5, width: 7, height: 7, borderRadius: 3.5, backgroundColor: 'rgba(255,255,255,0.5)' }} />
    </View>
    {/* Bow tails */}
    <View style={{ position: 'absolute', top: '-5%', left: '28%', width: 13, height: 24, borderRadius: 6.5, backgroundColor: '#EF6080', transform: [{ rotate: '-22deg' }] }} />
    <View style={{ position: 'absolute', top: '-5%', right: '28%', width: 13, height: 24, borderRadius: 6.5, backgroundColor: '#EF6080', transform: [{ rotate: '22deg' }] }} />
  </View>
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. HONEY BEE — Stripes + Flapping wings + Antennae
// ─────────────────────────────────────────────────────────────────────────────
const HoneyBeeInside = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Black stripes — rounded to fit the circle */}
    {[18, 36, 53, 70].map((top, i) => (
      <View key={i} style={{
        position: 'absolute', top: `${top}%` as any, left: '0%', right: '0%',
        height: `${11 - i * 1.5}%`,
        backgroundColor: 'rgba(16,8,0,0.8)',
        borderRadius: 28,
      }} />
    ))}
    {/* Stinger bottom */}
    <View style={{ position: 'absolute', bottom: '5%', left: '44%', width: 10, height: 13, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, borderTopLeftRadius: 2, borderTopRightRadius: 2, backgroundColor: 'rgba(16,8,0,0.5)' }} />
    {/* Gloss */}
    <View style={{ position: 'absolute', top: '7%', right: '10%', width: 26, height: 16, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.5)', transform: [{ rotate: '-28deg' }] }} />
  </View>
);

const HoneyBeeOutside = () => {
  const wingAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(wingAnim, { toValue: 1, duration: 95, easing: Easing.linear, useNativeDriver: false }),
      Animated.timing(wingAnim, { toValue: -1, duration: 95, easing: Easing.linear, useNativeDriver: false }),
    ])).start();
  }, []);
  const lRot = wingAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-20deg', '18deg'] });
  const rRot = wingAnim.interpolate({ inputRange: [-1, 1], outputRange: ['20deg', '-18deg'] });
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Left wing */}
      <Animated.View style={{
        position: 'absolute', top: '2%', left: '-34%',
        width: 46, height: 30, borderRadius: 23,
        backgroundColor: 'rgba(210,238,255,0.74)',
        borderWidth: 1.5, borderColor: 'rgba(130,185,230,0.52)',
        transformOrigin: '46px 15px' as any,
        transform: [{ rotate: lRot }],
      }} />
      {/* Right wing */}
      <Animated.View style={{
        position: 'absolute', top: '2%', right: '-34%',
        width: 46, height: 30, borderRadius: 23,
        backgroundColor: 'rgba(210,238,255,0.74)',
        borderWidth: 1.5, borderColor: 'rgba(130,185,230,0.52)',
        transformOrigin: '0px 15px' as any,
        transform: [{ rotate: rRot }],
      }} />
      {/* Left antenna */}
      <View style={{ position: 'absolute', top: '-30%', left: '19%', width: 4, height: 32, borderRadius: 2, backgroundColor: '#160A00', transform: [{ rotate: '-22deg' }] }}>
        <View style={{ position: 'absolute', top: -11, left: -5, width: 14, height: 14, borderRadius: 7, backgroundColor: '#FFD010', borderWidth: 2.5, borderColor: '#160A00' }} />
      </View>
      {/* Right antenna */}
      <View style={{ position: 'absolute', top: '-30%', right: '19%', width: 4, height: 32, borderRadius: 2, backgroundColor: '#160A00', transform: [{ rotate: '22deg' }] }}>
        <View style={{ position: 'absolute', top: -11, left: -5, width: 14, height: 14, borderRadius: 7, backgroundColor: '#FFD010', borderWidth: 2.5, borderColor: '#160A00' }} />
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. GALAXY — Twinkling stars + Floating planet
// ─────────────────────────────────────────────────────────────────────────────
const STAR_DATA = [
  { t: 13, l: 20, s: 4 }, { t: 24, l: 68, s: 3 }, { t: 40, l: 10, s: 5 },
  { t: 52, l: 54, s: 3 }, { t: 34, l: 80, s: 4 }, { t: 66, l: 28, s: 3 },
  { t: 18, l: 45, s: 6 }, { t: 58, l: 72, s: 4 }, { t: 76, l: 46, s: 3 },
  { t: 30, l: 34, s: 3 }, { t: 14, l: 84, s: 5 }, { t: 72, l: 12, s: 4 },
  { t: 46, l: 60, s: 3 }, { t: 84, l: 62, s: 3 },
];

const TwinkleStar = ({ t, l, s, delay }: { t: number; l: number; s: number; delay: number }) => {
  const op = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    const go = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(op, { toValue: 0.1 + Math.random() * 0.4, duration: 450 + Math.random() * 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(op, { toValue: 0.55 + Math.random() * 0.45, duration: 450 + Math.random() * 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]).start(go);
    };
    go();
  }, []);
  return (
    <Animated.View style={{ position: 'absolute', top: `${t}%` as any, left: `${l}%` as any, width: s, height: s, borderRadius: s / 2, backgroundColor: '#FFFFFF', opacity: op }} />
  );
};

const GalaxyInside = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Deep space nebula */}
    <View style={{ position: 'absolute', top: '8%', left: '5%', width: '58%', height: '58%', borderRadius: 999, backgroundColor: 'rgba(85,32,160,0.3)' }} />
    <View style={{ position: 'absolute', bottom: '6%', right: '4%', width: '44%', height: '44%', borderRadius: 999, backgroundColor: 'rgba(25,85,190,0.22)' }} />
    <View style={{ position: 'absolute', top: '40%', left: '30%', width: '35%', height: '35%', borderRadius: 999, backgroundColor: 'rgba(190,60,160,0.15)' }} />
    {/* Stars */}
    {STAR_DATA.map((s, i) => <TwinkleStar key={i} {...s} delay={i * 175} />)}
    {/* Gloss (subtle on dark background) */}
    <View style={{ position: 'absolute', top: '8%', right: '10%', width: 18, height: 10, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.14)', transform: [{ rotate: '-28deg' }] }} />
  </View>
);

const GalaxyOutside = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: 1, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      Animated.timing(floatAnim, { toValue: 0, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
    ])).start();
  }, []);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={{
        position: 'absolute', top: '-26%', right: '-10%',
        transform: [{ translateY: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) }],
      }}>
        {/* Planet body */}
        <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#5A2A8A', borderWidth: 2, borderColor: '#8A50C8' }}>
          <View style={{ position: 'absolute', top: 5, left: 5, width: 10, height: 7, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.18)' }} />
          <View style={{ position: 'absolute', top: 9, left: 8, right: 8, height: 4, borderRadius: 2, backgroundColor: 'rgba(150,80,200,0.5)' }} />
        </View>
        {/* Ring */}
        <View style={{
          position: 'absolute', top: 11, left: -14,
          width: 62, height: 12, borderRadius: 8,
          borderWidth: 3, borderColor: 'rgba(160,100,220,0.65)',
          backgroundColor: 'transparent',
          transform: [{ rotateX: '68deg' }],
        }} />
      </Animated.View>
      {/* Outer sparkles */}
      <View style={{ position: 'absolute', top: '-6%', left: '10%', width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(185,130,255,0.9)' }} />
      <View style={{ position: 'absolute', top: '7%', right: '2%', width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(130,200,255,0.85)' }} />
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. PANDA — Eye patches + Twitching ears
// ─────────────────────────────────────────────────────────────────────────────
const PandaInside = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Left eye patch */}
    <View style={{ position: 'absolute', top: '20%', left: '5%', width: 34, height: 30, borderRadius: 17, backgroundColor: 'rgba(22,16,14,0.86)', transform: [{ rotate: '-10deg' }] }}>
      <View style={{ position: 'absolute', top: 6, left: 6, width: 11, height: 8, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.1)' }} />
    </View>
    {/* Right eye patch */}
    <View style={{ position: 'absolute', top: '20%', right: '5%', width: 34, height: 30, borderRadius: 17, backgroundColor: 'rgba(22,16,14,0.86)', transform: [{ rotate: '10deg' }] }}>
      <View style={{ position: 'absolute', top: 6, right: 6, width: 11, height: 8, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.1)' }} />
    </View>
    {/* Gloss */}
    <View style={{ position: 'absolute', top: '8%', right: '12%', width: 24, height: 15, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.58)', transform: [{ rotate: '-26deg' }] }} />
    {/* Subtle bottom shade */}
    <View style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '22%', backgroundColor: 'rgba(150,145,140,0.1)', borderTopLeftRadius: 70, borderTopRightRadius: 70 }} />
  </View>
);

const PandaOutside = () => {
  const leftY = useRef(new Animated.Value(0)).current;
  const rightY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const twitch = () => {
      Animated.sequence([
        Animated.timing(leftY, { toValue: -4, duration: 100, useNativeDriver: false }),
        Animated.timing(leftY, { toValue: 0, duration: 200, easing: Easing.out(Easing.bounce), useNativeDriver: false }),
        Animated.delay(480),
        Animated.timing(rightY, { toValue: -4, duration: 100, useNativeDriver: false }),
        Animated.timing(rightY, { toValue: 0, duration: 200, easing: Easing.out(Easing.bounce), useNativeDriver: false }),
        Animated.delay(720),
      ]).start(twitch);
    };
    twitch();
  }, []);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Left ear */}
      <Animated.View style={{ position: 'absolute', top: '-22%', left: '4%', transform: [{ translateY: leftY }, { rotate: '-10deg' }] }}>
        <View style={{ width: 44, height: 40, borderRadius: 22, backgroundColor: '#1A1210' }}>
          <View style={{ position: 'absolute', top: 10, left: 10, right: 10, bottom: 8, borderRadius: 16, backgroundColor: 'rgba(255,160,185,0.2)' }} />
        </View>
      </Animated.View>
      {/* Right ear */}
      <Animated.View style={{ position: 'absolute', top: '-22%', right: '4%', transform: [{ translateY: rightY }, { rotate: '10deg' }] }}>
        <View style={{ width: 44, height: 40, borderRadius: 22, backgroundColor: '#1A1210' }}>
          <View style={{ position: 'absolute', top: 10, left: 10, right: 10, bottom: 8, borderRadius: 16, backgroundColor: 'rgba(255,160,185,0.2)' }} />
        </View>
      </Animated.View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. CHOCO MINT — Choco chips + Syrup sway
// ─────────────────────────────────────────────────────────────────────────────
const CHIP_DATA = [
  { t: 15, l: 9, r: '10deg', w: 18, h: 11 }, { t: 28, l: 57, r: '-20deg', w: 20, h: 12 },
  { t: 44, l: 5, r: '6deg', w: 16, h: 10 },  { t: 55, l: 68, r: '-12deg', w: 17, h: 10 },
  { t: 68, l: 29, r: '18deg', w: 15, h: 9 }, { t: 37, l: 33, r: '-5deg', w: 14, h: 9 },
  { t: 18, l: 76, r: '15deg', w: 13, h: 8 }, { t: 60, l: 50, r: '8deg', w: 11, h: 7 },
];

const ChocoMintInside = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Cool mint gradient hint */}
    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '42%', backgroundColor: 'rgba(50,195,130,0.1)', borderTopLeftRadius: 90, borderTopRightRadius: 90 }} />
    {/* Choco chips */}
    {CHIP_DATA.map((c, i) => (
      <View key={i} style={{
        position: 'absolute', top: `${c.t}%` as any, left: `${c.l}%` as any,
        width: c.w, height: c.h, borderRadius: c.h * 0.44,
        backgroundColor: '#38180A',
        transform: [{ rotate: c.r }],
        shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 2, shadowOffset: { width: 0, height: 1 },
      }} />
    ))}
    {/* Gloss */}
    <View style={{ position: 'absolute', top: '7%', right: '10%', width: 26, height: 16, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.48)', transform: [{ rotate: '-28deg' }] }} />
  </View>
);

const ChocoMintOutside = () => {
  const swayAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(swayAnim, { toValue: 1, duration: 2400, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      Animated.timing(swayAnim, { toValue: -1, duration: 2400, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
    ])).start();
  }, []);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={{
        position: 'absolute', top: '-20%', left: '16%', right: '16%',
        transform: [{ rotate: swayAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-5deg', '5deg'] }) }],
        transformOrigin: '50% 100%' as any,
      }}>
        {/* Syrup cap */}
        <View style={{ height: 20, backgroundColor: '#2C1204', borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
          <View style={{ position: 'absolute', top: 5, left: 8, width: 14, height: 6, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.2)' }} />
        </View>
        {/* Left drip */}
        <View style={{ position: 'absolute', top: 15, left: '12%', width: 9, height: 22, borderRadius: 4.5, backgroundColor: '#2C1204' }}>
          <View style={{ position: 'absolute', bottom: -9, left: -4, width: 17, height: 17, borderRadius: 8.5, backgroundColor: '#2C1204' }} />
        </View>
        {/* Right drip */}
        <View style={{ position: 'absolute', top: 13, right: '16%', width: 8, height: 16, borderRadius: 4, backgroundColor: '#2C1204' }}>
          <View style={{ position: 'absolute', bottom: -7, left: -3, width: 14, height: 14, borderRadius: 7, backgroundColor: '#2C1204' }} />
        </View>
      </Animated.View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. CLOUD — Fluffy bottom puffs + Floating
// ─────────────────────────────────────────────────────────────────────────────
const CloudInside = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Sky blue tint top half */}
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '48%', backgroundColor: 'rgba(100,180,255,0.14)', borderBottomLeftRadius: 90, borderBottomRightRadius: 90 }} />
    {/* Fluffy cloud puffs — bottom */}
    {[{ l: '-4%', s: 56 }, { l: '18%', s: 62 }, { l: '42%', s: 54 }, { l: '62%', s: 50 }].map((c, i) => (
      <View key={i} style={{ position: 'absolute', bottom: '-10%' as any, left: c.l as any, width: c.s, height: c.s, borderRadius: c.s / 2, backgroundColor: 'rgba(255,255,255,0.82)' }} />
    ))}
    {/* Gloss */}
    <View style={{ position: 'absolute', top: '9%', right: '12%', width: 26, height: 16, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.65)', transform: [{ rotate: '-24deg' }] }} />
  </View>
);

const CloudOutside = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: 1, duration: 2600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      Animated.timing(floatAnim, { toValue: 0, duration: 2600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
    ])).start();
  }, []);
  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { transform: [{ translateY: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) }] }]}
      pointerEvents="none"
    >
      {/* Left cloud cluster */}
      <View style={{ position: 'absolute', top: '-16%', left: '-16%' }}>
        <View style={{ width: 38, height: 28, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.94)' }} />
        <View style={{ position: 'absolute', top: -12, left: 6, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.94)' }} />
        <View style={{ position: 'absolute', top: -8, left: 20, width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.94)' }} />
      </View>
      {/* Right cloud cluster */}
      <View style={{ position: 'absolute', top: '-10%', right: '-12%' }}>
        <View style={{ width: 30, height: 22, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.9)' }} />
        <View style={{ position: 'absolute', top: -9, right: 5, width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.9)' }} />
      </View>
      {/* Raindrops */}
      {[{ l: '22%', h: 10 }, { l: '46%', h: 8 }, { l: '66%', h: 11 }].map((r, i) => (
        <View key={i} style={{ position: 'absolute', bottom: '-22%' as any, left: r.l as any, width: 3.5, height: r.h, borderRadius: 2, backgroundColor: 'rgba(80,145,215,0.6)', transform: [{ rotate: '10deg' }] }} />
      ))}
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. TIGER — Stripes + Triangle ears
// ─────────────────────────────────────────────────────────────────────────────
const TigerInside = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Left V-stripes */}
    <View style={{ position: 'absolute', top: '14%', left: '3%', width: 28, height: 10, borderRadius: 5, backgroundColor: 'rgba(16,6,0,0.64)', transform: [{ rotate: '48deg' }] }} />
    <View style={{ position: 'absolute', top: '29%', left: '7%', width: 22, height: 9, borderRadius: 4.5, backgroundColor: 'rgba(16,6,0,0.56)', transform: [{ rotate: '52deg' }] }} />
    <View style={{ position: 'absolute', top: '44%', left: '9%', width: 18, height: 8, borderRadius: 4, backgroundColor: 'rgba(16,6,0,0.48)', transform: [{ rotate: '48deg' }] }} />
    {/* Right V-stripes */}
    <View style={{ position: 'absolute', top: '14%', right: '3%', width: 28, height: 10, borderRadius: 5, backgroundColor: 'rgba(16,6,0,0.64)', transform: [{ rotate: '-48deg' }] }} />
    <View style={{ position: 'absolute', top: '29%', right: '7%', width: 22, height: 9, borderRadius: 4.5, backgroundColor: 'rgba(16,6,0,0.56)', transform: [{ rotate: '-52deg' }] }} />
    <View style={{ position: 'absolute', top: '44%', right: '9%', width: 18, height: 8, borderRadius: 4, backgroundColor: 'rgba(16,6,0,0.48)', transform: [{ rotate: '-48deg' }] }} />
    {/* Forehead stripe */}
    <View style={{ position: 'absolute', top: '5%', left: '41%', width: 15, height: 28, borderRadius: 7.5, backgroundColor: 'rgba(16,6,0,0.52)' }} />
    {/* Gloss */}
    <View style={{ position: 'absolute', top: '6%', right: '11%', width: 26, height: 16, borderRadius: 13, backgroundColor: 'rgba(255,205,100,0.38)', transform: [{ rotate: '-26deg' }] }} />
  </View>
);

const TigerOutside = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Left ear — triangle */}
    <View style={{
      position: 'absolute', top: '-28%', left: '7%',
      width: 0, height: 0, borderStyle: 'solid',
      borderLeftWidth: 22, borderRightWidth: 22, borderBottomWidth: 40,
      borderLeftColor: 'transparent', borderRightColor: 'transparent',
      borderBottomColor: '#FF9828',
    }}>
      {/* Inner ear */}
      <View style={{
        position: 'absolute', top: 14, left: -12,
        width: 0, height: 0, borderStyle: 'solid',
        borderLeftWidth: 12, borderRightWidth: 12, borderBottomWidth: 22,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderBottomColor: '#C84820',
      }} />
    </View>
    {/* Right ear */}
    <View style={{
      position: 'absolute', top: '-28%', right: '7%',
      width: 0, height: 0, borderStyle: 'solid',
      borderLeftWidth: 22, borderRightWidth: 22, borderBottomWidth: 40,
      borderLeftColor: 'transparent', borderRightColor: 'transparent',
      borderBottomColor: '#FF9828',
    }}>
      <View style={{
        position: 'absolute', top: 14, left: -12,
        width: 0, height: 0, borderStyle: 'solid',
        borderLeftWidth: 12, borderRightWidth: 12, borderBottomWidth: 22,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderBottomColor: '#C84820',
      }} />
    </View>
  </View>
);

// ─────────────────────────────────────────────────────────────────────────────
// 8. PUDDING — Caramel top + Cherry shake
// ─────────────────────────────────────────────────────────────────────────────
const PuddingInside = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Caramel top coat */}
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', backgroundColor: 'rgba(155,75,0,0.38)', borderBottomLeftRadius: 78, borderBottomRightRadius: 78 }} />
    {/* Cream body highlight */}
    <View style={{ position: 'absolute', top: '36%', left: '14%', right: '14%', height: '20%', backgroundColor: 'rgba(255,240,155,0.22)', borderRadius: 28 }} />
    {/* Primary gloss */}
    <View style={{ position: 'absolute', top: '6%', right: '9%', width: 30, height: 18, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.48)', transform: [{ rotate: '-30deg' }] }} />
    {/* Secondary gloss */}
    <View style={{ position: 'absolute', top: '16%', right: '25%', width: 13, height: 8, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.34)', transform: [{ rotate: '-30deg' }] }} />
    {/* Pudding ring lines */}
    <View style={{ position: 'absolute', top: '52%', left: '10%', right: '10%', height: 3.5, backgroundColor: 'rgba(190,135,25,0.22)', borderRadius: 2 }} />
    <View style={{ position: 'absolute', top: '63%', left: '16%', right: '16%', height: 2.5, backgroundColor: 'rgba(190,135,25,0.16)', borderRadius: 2 }} />
  </View>
);

const PuddingOutside = () => {
  const shakeX = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const shake = () => {
      Animated.sequence([
        Animated.timing(shakeX, { toValue: 3.5, duration: 65, easing: Easing.linear, useNativeDriver: false }),
        Animated.timing(shakeX, { toValue: -3.5, duration: 65, easing: Easing.linear, useNativeDriver: false }),
        Animated.timing(shakeX, { toValue: 2.5, duration: 65, easing: Easing.linear, useNativeDriver: false }),
        Animated.timing(shakeX, { toValue: -1.5, duration: 65, easing: Easing.linear, useNativeDriver: false }),
        Animated.timing(shakeX, { toValue: 0, duration: 65, easing: Easing.linear, useNativeDriver: false }),
        Animated.delay(2800),
      ]).start(shake);
    };
    shake();
  }, []);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={{
        position: 'absolute', top: '-30%', left: '33%',
        transform: [{ translateX: shakeX }],
      }}>
        {/* Stem */}
        <View style={{ position: 'absolute', top: -20, left: 12, width: 3.5, height: 22, borderRadius: 2, backgroundColor: '#286018', transform: [{ rotate: '16deg' }] }} />
        {/* Cherry */}
        <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: '#C41620', borderWidth: 1.5, borderColor: '#9C101A' }}>
          <View style={{ position: 'absolute', top: 4, left: 5, width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.58)' }} />
          <View style={{ position: 'absolute', top: 3, left: 14, width: 5, height: 4, borderRadius: 2.5, backgroundColor: 'rgba(255,255,255,0.32)' }} />
        </View>
      </Animated.View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────
export const MochiPattern = ({ skinId, isDead }: { skinId: string; isDead?: boolean }) => {
  if (isDead) return null;
  switch (skinId) {
    case 'classic':  return <ClassicInside />;
    case 'honeybee': return <HoneyBeeInside />;
    case 'galaxy':   return <GalaxyInside />;
    case 'panda':    return <PandaInside />;
    case 'chocmint': return <ChocoMintInside />;
    case 'cloud':    return <CloudInside />;
    case 'tiger':    return <TigerInside />;
    case 'pudding':  return <PuddingInside />;
    default:         return <ClassicInside />;
  }
};

export const MochiDecoration = ({ skinId, isDead }: { skinId: string; isDead?: boolean }) => {
  if (isDead) return null;
  switch (skinId) {
    case 'classic':  return <ClassicOutside />;
    case 'honeybee': return <HoneyBeeOutside />;
    case 'galaxy':   return <GalaxyOutside />;
    case 'panda':    return <PandaOutside />;
    case 'chocmint': return <ChocoMintOutside />;
    case 'cloud':    return <CloudOutside />;
    case 'tiger':    return <TigerOutside />;
    case 'pudding':  return <PuddingOutside />;
    default:         return <ClassicOutside />;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Mochi Face
// ─────────────────────────────────────────────────────────────────────────────
export const MochiDrawnFace = ({ isDead, squishType, isHappy }: { isDead: boolean; squishType: 'tall' | 'wide' | 'normal'; isHappy: boolean }) => {
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
        <View style={{ marginTop: 4, width: 28, height: 5, backgroundColor: '#8B7E74', borderRadius: 3, transform: [{ scaleX: 1.4 }] }} />
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
        <View style={{ marginTop: squishType === 'tall' ? 5 : 2, width: squishType === 'wide' ? 22 : 18, height: 14, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, backgroundColor: '#E09080', overflow: 'hidden' }}>
          <View style={{ position: 'absolute', top: -10, left: 0, right: 0, height: 12, backgroundColor: '#E09080', borderRadius: 10 }} />
        </View>
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
          <View key={i} style={{ width: eyeW, height: eyeH, backgroundColor: '#3A3028', borderRadius: eyeW / 2 }}>
            <View style={{ position: 'absolute', top: 3, left: 3, width: 6, height: 6, backgroundColor: '#FFF', borderRadius: 3 }} />
            <View style={{ position: 'absolute', bottom: 4, right: 3, width: 3, height: 3, backgroundColor: 'rgba(255,255,255,0.55)', borderRadius: 1.5 }} />
          </View>
        ))}
      </View>
      <View style={{ marginTop: squishType === 'tall' ? 6 : 3, width: squishType === 'wide' ? 14 : 11, height: squishType === 'wide' ? 8 : 7, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, backgroundColor: '#C4907A' }} />
    </View>
  );
};
