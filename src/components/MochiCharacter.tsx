import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// 1. CLASSIC — Soft Gloss + Breathing Pulse + Pink Ribbon Bow
// ─────────────────────────────────────────────────────────────────────────────
const ClassicInside = () => null;
const ClassicOutside = () => null;

// ─────────────────────────────────────────────────────────────────────────────
// 2. HONEY BEE — Bold Stripes + Iridescent Wings + Antennae (Flapping)
// ─────────────────────────────────────────────────────────────────────────────
const HoneyBeeInside = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Stripes — taper toward the sides like a real bee */}
    {[16, 36, 55, 73].map((top, i) => (
      <View key={i} style={{
        position: 'absolute',
        top: `${top}%` as any,
        left: `${i * 2.5}%` as any,
        right: `${i * 2.5}%` as any,
        height: `${12 - i * 1.5}%`,
        backgroundColor: 'rgba(22,10,0,0.72)',
        borderRadius: 40,
      }} />
    ))}
    {/* Stinger tip at bottom */}
    <View style={{
      position: 'absolute', bottom: '1%', left: '44%',
      width: '12%', height: '12%',
      borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
      borderTopLeftRadius: 2, borderTopRightRadius: 2,
      backgroundColor: 'rgba(22,10,0,0.55)',
    }} />
    {/* Gloss */}
    <View style={{
      position: 'absolute', top: '7%', right: '10%',
      width: '32%', height: '18%',
      borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.7)',
      transform: [{ rotate: '-28deg' }],
    }} />
  </View>
);

const HoneyBeeOutside = () => {
  const wingAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(wingAnim, { toValue: 1, duration: 85, easing: Easing.linear, useNativeDriver: false }),
      Animated.timing(wingAnim, { toValue: -1, duration: 85, easing: Easing.linear, useNativeDriver: false }),
    ])).start();
  }, []);
  const lRot = wingAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-38deg', '8deg'] });
  const rRot = wingAnim.interpolate({ inputRange: [-1, 1], outputRange: ['38deg', '-8deg'] });
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Left wing */}
      <Animated.View style={{
        position: 'absolute', top: '-6%', left: '-36%',
        width: 56, height: 40, borderRadius: 28,
        backgroundColor: 'rgba(230,248,255,0.9)',
        borderWidth: 2, borderColor: 'rgba(190,225,250,0.85)',
        shadowColor: '#90C8EF', shadowOpacity: 0.5, shadowRadius: 8,
        transformOrigin: '56px 20px' as any,
        transform: [{ rotate: lRot }],
      }}>
        <View style={{ position: 'absolute', top: 6, left: 8, width: 30, height: 3, borderRadius: 2, backgroundColor: 'rgba(160,215,245,0.55)' }} />
        <View style={{ position: 'absolute', top: 14, left: 10, width: 18, height: 2, borderRadius: 1, backgroundColor: 'rgba(160,215,245,0.4)' }} />
      </Animated.View>
      {/* Right wing */}
      <Animated.View style={{
        position: 'absolute', top: '-6%', right: '-36%',
        width: 56, height: 40, borderRadius: 28,
        backgroundColor: 'rgba(230,248,255,0.9)',
        borderWidth: 2, borderColor: 'rgba(190,225,250,0.85)',
        shadowColor: '#90C8EF', shadowOpacity: 0.5, shadowRadius: 8,
        transformOrigin: '0px 20px' as any,
        transform: [{ rotate: rRot }],
      }}>
        <View style={{ position: 'absolute', top: 6, right: 8, width: 30, height: 3, borderRadius: 2, backgroundColor: 'rgba(160,215,245,0.55)' }} />
        <View style={{ position: 'absolute', top: 14, right: 10, width: 18, height: 2, borderRadius: 1, backgroundColor: 'rgba(160,215,245,0.4)' }} />
      </Animated.View>
      {/* Left antenna stem + ball */}
      <View style={{
        position: 'absolute', top: '-30%', left: '22%',
        width: 5, height: 32, borderRadius: 3,
        backgroundColor: '#251000', transform: [{ rotate: '-22deg' }],
      }}>
        <View style={{
          position: 'absolute', top: -14, left: -7,
          width: 18, height: 18, borderRadius: 9,
          backgroundColor: '#FFCC00', borderWidth: 2, borderColor: '#251000',
          shadowColor: '#FFB800', shadowOpacity: 0.6, shadowRadius: 4,
        }}>
          <View style={{ position: 'absolute', top: 3, left: 3, width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.55)' }} />
        </View>
      </View>
      {/* Right antenna stem + ball */}
      <View style={{
        position: 'absolute', top: '-30%', right: '22%',
        width: 5, height: 32, borderRadius: 3,
        backgroundColor: '#251000', transform: [{ rotate: '22deg' }],
      }}>
        <View style={{
          position: 'absolute', top: -14, left: -6,
          width: 18, height: 18, borderRadius: 9,
          backgroundColor: '#FFCC00', borderWidth: 2, borderColor: '#251000',
          shadowColor: '#FFB800', shadowOpacity: 0.6, shadowRadius: 4,
        }}>
          <View style={{ position: 'absolute', top: 3, left: 3, width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.55)' }} />
        </View>
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. GALAXY — Nebula Blobs + Twinkling Stars + Floating Saturn
// ─────────────────────────────────────────────────────────────────────────────
const TwinkleStar = ({ t, l, s, delay }: { t: number; l: number; s: number; delay: number }) => {
  const op = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    const go = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(op, { toValue: 0.1, duration: 700 + Math.random() * 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(op, { toValue: 0.95, duration: 700 + Math.random() * 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]).start(go);
    };
    go();
  }, []);
  return (
    <Animated.View style={{
      position: 'absolute', top: `${t}%` as any, left: `${l}%` as any,
      width: s, height: s, borderRadius: s / 2,
      backgroundColor: '#FFFFFF', opacity: op,
      shadowColor: '#FFF', shadowOpacity: 1, shadowRadius: s * 2,
    }} />
  );
};

const GALAXY_STARS = [
  { t: 12, l: 18, s: 5, delay: 0 }, { t: 22, l: 65, s: 3, delay: 220 }, { t: 40, l: 10, s: 6, delay: 80 },
  { t: 56, l: 54, s: 4, delay: 340 }, { t: 33, l: 82, s: 5, delay: 160 }, { t: 68, l: 26, s: 3, delay: 460 },
  { t: 18, l: 44, s: 7, delay: 120 }, { t: 74, l: 48, s: 4, delay: 300 }, { t: 14, l: 76, s: 5, delay: 200 },
  { t: 48, l: 30, s: 3, delay: 400 }, { t: 26, l: 30, s: 4, delay: 540 }, { t: 60, l: 70, s: 4, delay: 380 },
];

const GalaxyInside = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Nebula — purple cloud upper-left */}
    <View style={{
      position: 'absolute', top: '0%', left: '-15%',
      width: '78%', height: '68%', borderRadius: 999,
      backgroundColor: 'rgba(100,25,200,0.34)',
    }} />
    {/* Nebula — blue lower-right */}
    <View style={{
      position: 'absolute', bottom: '-5%', right: '-8%',
      width: '68%', height: '58%', borderRadius: 999,
      backgroundColor: 'rgba(25,75,220,0.28)',
    }} />
    {/* Nebula — pink center accent */}
    <View style={{
      position: 'absolute', top: '28%', left: '12%',
      width: '58%', height: '48%', borderRadius: 999,
      backgroundColor: 'rgba(210,35,140,0.2)',
    }} />
    {/* Stars */}
    {GALAXY_STARS.map((s, i) => <TwinkleStar key={i} {...s} />)}
    {/* Faint gloss */}
    <View style={{
      position: 'absolute', top: '7%', right: '12%',
      width: '26%', height: '15%',
      borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.14)',
      transform: [{ rotate: '-28deg' }],
    }} />
  </View>
);

const GalaxyOutside = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: 1, duration: 3200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      Animated.timing(floatAnim, { toValue: 0, duration: 3200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
    ])).start();
  }, []);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={{
        position: 'absolute', top: '-22%', right: '-4%',
        transform: [{ translateY: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) }],
      }}>
        {/* Planet sphere */}
        <View style={{
          width: 40, height: 40, borderRadius: 20,
          backgroundColor: '#4A1888',
          shadowColor: '#7A30CC', shadowOpacity: 0.8, shadowRadius: 10,
        }}>
          <View style={{ position: 'absolute', top: 6, left: 5, width: 14, height: 10, borderRadius: 7, backgroundColor: 'rgba(180,110,255,0.4)' }} />
          <View style={{ position: 'absolute', top: 4, right: 6, width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.22)' }} />
        </View>
        {/* Saturn ring */}
        <View style={{
          position: 'absolute', top: 14, left: -18,
          width: 76, height: 12, borderRadius: 8,
          borderWidth: 3.5, borderColor: 'rgba(185,95,255,0.78)',
          backgroundColor: 'transparent',
          transform: [{ rotateZ: '-12deg' }],
        }} />
      </Animated.View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. PANDA — Eye Patches + Round Ears with Pink Inner (Ear Twitch)
// ─────────────────────────────────────────────────────────────────────────────
const PandaInside = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Left eye patch */}
    <View style={{
      position: 'absolute', top: '18%', left: '5%',
      width: '36%', height: '32%',
      borderRadius: 50, backgroundColor: '#181210',
      transform: [{ rotate: '-22deg' }],
    }}>
      <View style={{ position: 'absolute', top: 7, left: 7, width: 13, height: 9, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.2)' }} />
    </View>
    {/* Right eye patch */}
    <View style={{
      position: 'absolute', top: '18%', right: '5%',
      width: '36%', height: '32%',
      borderRadius: 50, backgroundColor: '#181210',
      transform: [{ rotate: '22deg' }],
    }}>
      <View style={{ position: 'absolute', top: 7, right: 7, width: 13, height: 9, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.2)' }} />
    </View>
    {/* Gloss */}
    <View style={{
      position: 'absolute', top: '8%', right: '14%',
      width: '26%', height: '15%',
      borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.68)',
      transform: [{ rotate: '-28deg' }],
    }} />
  </View>
);

const PandaOutside = () => {
  const leftY = useRef(new Animated.Value(0)).current;
  const rightY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const twitch = () => {
      Animated.sequence([
        Animated.timing(leftY, { toValue: -5, duration: 100, useNativeDriver: false }),
        Animated.timing(leftY, { toValue: 0, duration: 230, easing: Easing.out(Easing.bounce), useNativeDriver: false }),
        Animated.delay(480),
        Animated.timing(rightY, { toValue: -5, duration: 100, useNativeDriver: false }),
        Animated.timing(rightY, { toValue: 0, duration: 230, easing: Easing.out(Easing.bounce), useNativeDriver: false }),
        Animated.delay(720),
      ]).start(twitch);
    };
    twitch();
  }, []);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Left ear */}
      <Animated.View style={{
        position: 'absolute', top: '-20%', left: '3%',
        transform: [{ translateY: leftY }, { rotate: '-15deg' }],
      }}>
        <View style={{
          width: 48, height: 48, borderRadius: 24,
          backgroundColor: '#181210',
          shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5,
        }}>
          <View style={{ position: 'absolute', top: 10, left: 10, right: 10, bottom: 10, borderRadius: 14, backgroundColor: 'rgba(255,155,185,0.32)' }} />
        </View>
      </Animated.View>
      {/* Right ear */}
      <Animated.View style={{
        position: 'absolute', top: '-20%', right: '3%',
        transform: [{ translateY: rightY }, { rotate: '15deg' }],
      }}>
        <View style={{
          width: 48, height: 48, borderRadius: 24,
          backgroundColor: '#181210',
          shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5,
        }}>
          <View style={{ position: 'absolute', top: 10, left: 10, right: 10, bottom: 10, borderRadius: 14, backgroundColor: 'rgba(255,155,185,0.32)' }} />
        </View>
      </Animated.View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. ICHIGO (딸기) — Strawberry Seeds + Green Calyx Leaves
// ─────────────────────────────────────────────────────────────────────────────
const SEED_DATA = [
  { t: 13, l: 16, r: '12deg'  }, { t: 20, l: 54, r: '-8deg'  }, { t: 27, l: 78, r: '20deg'  },
  { t: 35, l: 9,  r: '-16deg' }, { t: 41, l: 38, r: '5deg'   }, { t: 47, l: 68, r: '-12deg' },
  { t: 55, l: 22, r: '18deg'  }, { t: 62, l: 56, r: '-4deg'  }, { t: 69, l: 36, r: '14deg'  },
  { t: 37, l: 85, r: '-20deg' }, { t: 18, l: 32, r: '8deg'   }, { t: 65, l: 14, r: '-14deg' },
  { t: 52, l: 86, r: '10deg'  },
];

const IchigoInside = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Subtle deeper red shading at bottom */}
    <View style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
      backgroundColor: 'rgba(180,0,30,0.12)',
      borderTopLeftRadius: 80, borderTopRightRadius: 80,
    }} />
    {/* Seeds — small yellowish achenes */}
    {SEED_DATA.map((s, i) => (
      <View key={i} style={{
        position: 'absolute', top: `${s.t}%` as any, left: `${s.l}%` as any,
        width: 5, height: 8, borderRadius: 3,
        backgroundColor: '#EEE060',
        transform: [{ rotate: s.r }],
        borderWidth: 0.5, borderColor: 'rgba(160,140,0,0.45)',
        shadowColor: '#8A7800', shadowOpacity: 0.25, shadowRadius: 1,
      }} />
    ))}
    {/* Gloss */}
    <View style={{
      position: 'absolute', top: '7%', right: '10%',
      width: '32%', height: '20%',
      borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.6)',
      transform: [{ rotate: '-35deg' }],
    }} />
    <View style={{
      position: 'absolute', top: '22%', right: '8%',
      width: '11%', height: '11%',
      borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.38)',
    }} />
  </View>
);

const IchigoOutside = () => {
  const swayAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(swayAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      Animated.timing(swayAnim, { toValue: -1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
    ])).start();
  }, []);
  // 5 calyx leaves spreading upward
  const LEAVES = [
    { r: '-48deg', l: '10%', t: '-26%' },
    { r: '-22deg', l: '24%', t: '-32%' },
    { r: '2deg',   l: '40%', t: '-34%' },
    { r: '26deg',  l: '56%', t: '-32%' },
    { r: '50deg',  l: '70%', t: '-26%' },
  ];
  return (
    <Animated.View style={[StyleSheet.absoluteFill, {
      transform: [{ rotate: swayAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-3deg', '3deg'] }) }],
      transformOrigin: '50% 60%' as any,
    }]} pointerEvents="none">
      {LEAVES.map((leaf, i) => (
        <View key={i} style={{
          position: 'absolute', top: leaf.t as any, left: leaf.l as any,
          width: 11, height: 28, borderRadius: 6,
          backgroundColor: '#228B3A',
          transform: [{ rotate: leaf.r }],
          shadowColor: '#0A4A18', shadowOpacity: 0.3, shadowRadius: 2,
        }}>
          {/* Leaf midrib */}
          <View style={{ position: 'absolute', top: 4, left: 4, width: 2, height: 18, borderRadius: 1, backgroundColor: 'rgba(8,50,18,0.5)' }} />
        </View>
      ))}
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. CLOUD — Fluffy Cloud Bumps + Floating Puffs + Raindrops
// ─────────────────────────────────────────────────────────────────────────────
const CloudInside = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Sky tint top half */}
    <View style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: '52%',
      backgroundColor: 'rgba(130,185,255,0.16)',
      borderBottomLeftRadius: 80, borderBottomRightRadius: 80,
    }} />
    {/* White cloud fill bottom */}
    <View style={{
      position: 'absolute', bottom: '-3%', left: '-12%', right: '-12%', height: '54%',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderTopLeftRadius: 55, borderTopRightRadius: 55,
    }} />
    {/* Fluffy bumps */}
    {[
      { l: '-8%', t: '40%', s: 66 },
      { l: '14%', t: '32%', s: 74 },
      { l: '42%', t: '34%', s: 68 },
      { l: '68%', t: '36%', s: 62 },
    ].map((c, i) => (
      <View key={i} style={{
        position: 'absolute', top: c.t as any, left: c.l as any,
        width: c.s, height: c.s, borderRadius: c.s / 2,
        backgroundColor: 'rgba(255,255,255,0.92)',
      }} />
    ))}
    {/* Gloss */}
    <View style={{
      position: 'absolute', top: '8%', right: '14%',
      width: '26%', height: '16%',
      borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.78)',
      transform: [{ rotate: '-28deg' }],
    }} />
  </View>
);

const CloudOutside = () => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(floatAnim, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      Animated.timing(floatAnim, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
    ])).start();
  }, []);
  return (
    <Animated.View style={[StyleSheet.absoluteFill, {
      transform: [{ translateY: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }) }],
    }]} pointerEvents="none">
      {/* Left puff group */}
      <View style={{ position: 'absolute', top: '-10%', left: '-14%' }}>
        <View style={{
          width: 44, height: 30, borderRadius: 15,
          backgroundColor: 'rgba(255,255,255,0.95)',
          shadowColor: '#A0CCF8', shadowOpacity: 0.45, shadowRadius: 6,
        }}>
          <View style={{ position: 'absolute', top: -13, left: 5, width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.95)' }} />
          <View style={{ position: 'absolute', top: -7, left: 20, width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.95)' }} />
        </View>
      </View>
      {/* Right puff */}
      <View style={{ position: 'absolute', top: '-7%', right: '-12%' }}>
        <View style={{
          width: 36, height: 24, borderRadius: 12,
          backgroundColor: 'rgba(255,255,255,0.92)',
          shadowColor: '#A0CCF8', shadowOpacity: 0.4, shadowRadius: 5,
        }}>
          <View style={{ position: 'absolute', top: -10, right: 5, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.92)' }} />
        </View>
      </View>
      {/* Raindrops */}
      {[{ l: '22%', h: 9 }, { l: '44%', h: 11 }, { l: '64%', h: 8 }].map((r, i) => (
        <View key={i} style={{
          position: 'absolute', bottom: '-20%', left: r.l as any,
          width: 4, height: r.h, borderRadius: 2,
          backgroundColor: 'rgba(75,145,230,0.58)',
        }} />
      ))}
    </Animated.View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. TIGER — Bold Curved Stripes + Round Orange Ears
// ─────────────────────────────────────────────────────────────────────────────
const TigerInside = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Left side stripes — curved inward */}
    <View style={{ position: 'absolute', top: '12%', left: '-3%', width: '28%', height: '9%', borderTopRightRadius: 22, borderBottomRightRadius: 22, backgroundColor: '#2A0E00', transform: [{ rotate: '14deg' }] }} />
    <View style={{ position: 'absolute', top: '27%', left: '-2%', width: '22%', height: '8%', borderTopRightRadius: 18, borderBottomRightRadius: 18, backgroundColor: '#2A0E00', transform: [{ rotate: '9deg' }] }} />
    <View style={{ position: 'absolute', top: '42%', left: '-1%', width: '15%', height: '7%', borderTopRightRadius: 14, borderBottomRightRadius: 14, backgroundColor: '#2A0E00', transform: [{ rotate: '5deg' }] }} />
    {/* Right side stripes */}
    <View style={{ position: 'absolute', top: '12%', right: '-3%', width: '28%', height: '9%', borderTopLeftRadius: 22, borderBottomLeftRadius: 22, backgroundColor: '#2A0E00', transform: [{ rotate: '-14deg' }] }} />
    <View style={{ position: 'absolute', top: '27%', right: '-2%', width: '22%', height: '8%', borderTopLeftRadius: 18, borderBottomLeftRadius: 18, backgroundColor: '#2A0E00', transform: [{ rotate: '-9deg' }] }} />
    <View style={{ position: 'absolute', top: '42%', right: '-1%', width: '15%', height: '7%', borderTopLeftRadius: 14, borderBottomLeftRadius: 14, backgroundColor: '#2A0E00', transform: [{ rotate: '-5deg' }] }} />
    {/* Forehead stripe — center vertical */}
    <View style={{ position: 'absolute', top: '4%', left: '44%', width: '12%', height: '24%', borderRadius: 8, backgroundColor: '#2A0E00' }} />
    {/* Gloss */}
    <View style={{
      position: 'absolute', top: '7%', right: '11%',
      width: '30%', height: '17%',
      borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.42)',
      transform: [{ rotate: '-28deg' }],
    }} />
  </View>
);

const TigerOutside = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Left ear */}
    <View style={{
      position: 'absolute', top: '-20%', left: '3%',
      width: 48, height: 48, borderRadius: 24,
      backgroundColor: '#FF9620',
      transform: [{ rotate: '-17deg' }],
      shadowColor: '#A84000', shadowOpacity: 0.28, shadowRadius: 5,
    }}>
      <View style={{ position: 'absolute', top: 11, left: 11, right: 11, bottom: 9, borderRadius: 12, backgroundColor: '#CC3E08' }} />
      <View style={{ position: 'absolute', top: 6, left: 8, width: 11, height: 7, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.32)' }} />
    </View>
    {/* Right ear */}
    <View style={{
      position: 'absolute', top: '-20%', right: '3%',
      width: 48, height: 48, borderRadius: 24,
      backgroundColor: '#FF9620',
      transform: [{ rotate: '17deg' }],
      shadowColor: '#A84000', shadowOpacity: 0.28, shadowRadius: 5,
    }}>
      <View style={{ position: 'absolute', top: 11, left: 11, right: 11, bottom: 9, borderRadius: 12, backgroundColor: '#CC3E08' }} />
      <View style={{ position: 'absolute', top: 6, right: 8, width: 11, height: 7, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.32)' }} />
    </View>
  </View>
);

// ─────────────────────────────────────────────────────────────────────────────
// 8. PUDDING — Caramel Glaze + Cherry Shake
// ─────────────────────────────────────────────────────────────────────────────
const PuddingInside = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Caramel glaze top */}
    <View style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: '44%',
      backgroundColor: '#A04E00',
      borderBottomLeftRadius: 85, borderBottomRightRadius: 85,
    }}>
      {/* Caramel highlight within */}
      <View style={{ position: 'absolute', top: '22%', left: '15%', right: '15%', height: '28%', borderRadius: 20, backgroundColor: 'rgba(220,120,0,0.42)' }} />
    </View>
    {/* Caramel top shine */}
    <View style={{
      position: 'absolute', top: '6%', right: '9%',
      width: '34%', height: '18%',
      borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.5)',
      transform: [{ rotate: '-33deg' }],
    }} />
    <View style={{
      position: 'absolute', top: '15%', right: '20%',
      width: '13%', height: '10%',
      borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.3)',
      transform: [{ rotate: '-33deg' }],
    }} />
    {/* Pudding ring lines */}
    <View style={{ position: 'absolute', top: '52%', left: '12%', right: '12%', height: 3, backgroundColor: 'rgba(200,145,35,0.22)', borderRadius: 2 }} />
    <View style={{ position: 'absolute', top: '62%', left: '18%', right: '18%', height: 2.5, backgroundColor: 'rgba(200,145,35,0.17)', borderRadius: 2 }} />
  </View>
);

const PuddingOutside = () => {
  const shakeX = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const shake = () => {
      Animated.sequence([
        Animated.timing(shakeX, { toValue: 5, duration: 55, easing: Easing.linear, useNativeDriver: false }),
        Animated.timing(shakeX, { toValue: -5, duration: 55, easing: Easing.linear, useNativeDriver: false }),
        Animated.timing(shakeX, { toValue: 3, duration: 55, easing: Easing.linear, useNativeDriver: false }),
        Animated.timing(shakeX, { toValue: -2, duration: 55, easing: Easing.linear, useNativeDriver: false }),
        Animated.timing(shakeX, { toValue: 0, duration: 55, easing: Easing.linear, useNativeDriver: false }),
        Animated.delay(2800),
      ]).start(shake);
    };
    shake();
  }, []);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View style={{
        position: 'absolute', top: '-27%', left: '34%',
        transform: [{ translateX: shakeX }],
      }}>
        {/* Curved stem */}
        <View style={{
          position: 'absolute', top: -20, left: 15,
          width: 4, height: 24, borderRadius: 2,
          backgroundColor: '#2C7020', transform: [{ rotate: '17deg' }],
        }} />
        {/* Cherry */}
        <View style={{
          width: 30, height: 30, borderRadius: 15,
          backgroundColor: '#C01828', borderWidth: 1.5, borderColor: '#940F18',
          shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5,
        }}>
          <View style={{ position: 'absolute', top: 5, left: 5, width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.65)' }} />
          <View style={{ position: 'absolute', top: 4, left: 16, width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' }} />
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
    case 'ichigo':   return <IchigoInside />;
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
    case 'ichigo':   return <IchigoOutside />;
    case 'cloud':    return <CloudOutside />;
    case 'tiger':    return <TigerOutside />;
    case 'pudding':  return <PuddingOutside />;
    default:         return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Mochi Face
// ─────────────────────────────────────────────────────────────────────────────
export const MochiDrawnFace = ({ isDead, squishType, isHappy }: { isDead: boolean; squishType: 'tall' | 'wide' | 'normal'; isHappy: boolean }) => {
  if (isDead) {
    return (
      <View style={{ position: 'absolute', top: '28%', alignSelf: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 24 }}>
          {[0, 1].map(i => (
            <View key={i} style={{ width: 26, height: 26, justifyContent: 'center', alignItems: 'center', opacity: 0.85 }}>
              <View style={{ width: 24, height: 6, backgroundColor: '#5A4A40', borderRadius: 4, transform: [{ rotate: '45deg' }], position: 'absolute' }} />
              <View style={{ width: 24, height: 6, backgroundColor: '#5A4A40', borderRadius: 4, transform: [{ rotate: '-45deg' }], position: 'absolute' }} />
            </View>
          ))}
        </View>
        <View style={{ marginTop: 6, width: 32, height: 6, backgroundColor: '#5A4A40', borderRadius: 4, opacity: 0.85 }} />
      </View>
    );
  }

  if (isHappy) {
    const gap = squishType === 'wide' ? 42 : 26;
    return (
      <View style={{ position: 'absolute', top: squishType === 'tall' ? '22%' : '28%', alignSelf: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap, alignItems: 'center' }}>
          {[0, 1].map(i => (
            <View key={i} style={{ width: 22, height: 12, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, backgroundColor: '#483C30', overflow: 'hidden' }}>
              <View style={{ position: 'absolute', top: -10, left: 0, right: 0, height: 12, backgroundColor: '#483C30', borderRadius: 12 }} />
            </View>
          ))}
        </View>
        <View style={{ marginTop: squishType === 'tall' ? 6 : 4, width: squishType === 'wide' ? 24 : 18, height: 16, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, backgroundColor: '#F08080', overflow: 'hidden', shadowColor: '#E06060', shadowOpacity: 0.4, shadowRadius: 3 }}>
          <View style={{ position: 'absolute', top: -12, left: 0, right: 0, height: 14, backgroundColor: '#F08080', borderRadius: 12 }} />
        </View>
      </View>
    );
  }

  const eyeH = squishType === 'tall' ? 24 : squishType === 'wide' ? 16 : 22;
  const eyeW = squishType === 'wide' ? 20 : 18;
  const eyeGap = squishType === 'wide' ? 38 : 26;

  return (
    <View style={{ position: 'absolute', top: squishType === 'tall' ? '22%' : '28%', alignSelf: 'center', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', gap: eyeGap, alignItems: 'center' }}>
        {[0, 1].map(i => (
          <View key={i} style={{ width: eyeW, height: eyeH, backgroundColor: '#382D25', borderRadius: 50, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 2 }}>
            <View style={{ position: 'absolute', top: 4, left: 4, width: 6, height: 6, backgroundColor: '#FFF', borderRadius: 3, opacity: 0.9 }} />
            <View style={{ position: 'absolute', bottom: 5, right: 4, width: 3.5, height: 3.5, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 2 }} />
          </View>
        ))}
      </View>
      <View style={{ marginTop: squishType === 'tall' ? 8 : 5, width: squishType === 'wide' ? 14 : 12, height: 8, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, backgroundColor: '#C4806A', opacity: 0.9 }} />
    </View>
  );
};
