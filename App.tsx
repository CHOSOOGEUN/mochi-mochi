import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Animated, PanResponder, Dimensions, TouchableOpacity, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const BASE_DIM = 140;
const MIN_DIM = 75;
const MAX_DIM = 210;
const PLAYER_CENTER_Y = SCREEN_H * 0.7;

const TARGET_TYPES = ['tall', 'wide', 'circle'] as const;
type TargetType = typeof TARGET_TYPES[number];

const TARGETS = {
  tall: { h: 240, w: 90, color: '#8DB580', label: 'TALL!' },
  wide: { h: 90, w: 240, color: '#F0C75E', label: 'WIDE!' },
  circle: { h: 150, w: 150, color: '#E8A0B4', label: 'ROUND!' },
};

const PARTICLE_COLORS = ['#8DB580', '#F0C75E', '#E8A0B4', '#FFF9F0', '#D4C4B0'];

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

// ─── Background Scene (Full coverage) ───
const BackgroundIllustrations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* ── Clouds (scattered across) ── */}
    <CloudPuff x={-10} y={SCREEN_H * 0.04} w={80} opacity={0.22} />
    <CloudPuff x={SCREEN_W * 0.55} y={SCREEN_H * 0.1} w={70} opacity={0.18} />
    <CloudPuff x={SCREEN_W * 0.2} y={SCREEN_H * 0.22} w={60} opacity={0.14} />
    <CloudPuff x={SCREEN_W * 0.75} y={SCREEN_H * 0.38} w={55} opacity={0.12} />
    <CloudPuff x={SCREEN_W * 0.05} y={SCREEN_H * 0.52} w={65} opacity={0.15} />
    <CloudPuff x={SCREEN_W * 0.6} y={SCREEN_H * 0.65} w={75} opacity={0.13} />
    <CloudPuff x={SCREEN_W * 0.3} y={SCREEN_H * 0.82} w={85} opacity={0.16} />
    <CloudPuff x={SCREEN_W * 0.8} y={SCREEN_H * 0.92} w={50} opacity={0.1} />

    {/* ── Cherry Blossoms (many!) ── */}
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

    {/* ── Dango ── */}
    <Dango x={SCREEN_W * 0.88} y={SCREEN_H * 0.15} scale={0.9} opacity={0.22} />
    <Dango x={SCREEN_W * 0.03} y={SCREEN_H * 0.35} scale={0.7} opacity={0.18} />
    <Dango x={SCREEN_W * 0.72} y={SCREEN_H * 0.55} scale={0.8} opacity={0.15} />
    <Dango x={SCREEN_W * 0.15} y={SCREEN_H * 0.85} scale={0.6} opacity={0.2} />
    <Dango x={SCREEN_W * 0.92} y={SCREEN_H * 0.75} scale={0.5} opacity={0.12} />

    {/* ── Leaves ── */}
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

    {/* ── Mini Mochis ── */}
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

    {/* ── Sparkles ── */}
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
  </View>
);

// ─── Floating Particle (animated) ───
const FloatingParticle = ({ delay, x }: { delay: number, x: number }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.timing(anim, { toValue: 1, duration: 4000 + Math.random() * 2000, easing: Easing.linear, useNativeDriver: true })
      ).start();
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
  const size = 6 + Math.random() * 10;

  return (
    <Animated.View style={{
      position: 'absolute',
      left: x,
      width: size, height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      opacity: anim.interpolate({ inputRange: [0, 0.3, 0.7, 1], outputRange: [0, 0.4, 0.4, 0] }),
      transform: [
        { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_H + 20, -40] }) },
        { translateX: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, Math.random() > 0.5 ? 15 : -15, 0] }) },
      ]
    }} />
  );
};

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

// ─── Kawaii Mochi Face ───
const MochiDrawnFace = ({ isDead, squishType }: { isDead: boolean, squishType: 'tall' | 'wide' | 'normal' }) => {
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
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'OVER'>('START');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [targetShape, setTargetShape] = useState<TargetType>('circle');
  const [highScore, setHighScore] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showBurst, setShowBurst] = useState(false);
  const [burstColor, setBurstColor] = useState('#E8A0B4');

  useEffect(() => {
    AsyncStorage.getItem('highScore').then(val => { if (val) setHighScore(parseInt(val, 10)); });
    AsyncStorage.getItem('tutorialDone').then(val => { if (val === 'true') setShowTutorial(false); });
  }, []);

  const gameStateRef = useRef(gameState); gameStateRef.current = gameState;
  const targetShapeRef = useRef(targetShape); targetShapeRef.current = targetShape;
  const scoreRef = useRef(score); scoreRef.current = score;
  const passedRef = useRef(false);
  const comboRef = useRef(combo); comboRef.current = combo;

  const heightAnim = useRef(new Animated.Value(BASE_DIM)).current;
  const heightRef = useRef(BASE_DIM);
  const widthAnim = useRef(Animated.subtract(new Animated.Value(280), heightAnim)).current;
  const fallAnim = useRef(new Animated.Value(-300)).current;
  const popAnim = useRef(new Animated.Value(1)).current;
  const ringScaleAnim = useRef(new Animated.Value(0)).current;
  const ringOpacityAnim = useRef(new Animated.Value(0)).current;
  const levelUpAnim = useRef(new Animated.Value(0)).current;
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
  const titleEntryAnim = useRef(new Animated.Value(0)).current;

  // Target wobble + burst
  const targetRotateAnim = useRef(new Animated.Value(0)).current;
  const burstParticleAnim = useRef(new Animated.Value(0)).current;

  const [squishType, setSquishType] = useState<'tall' | 'wide' | 'normal'>('normal');
  const [displayScore, setDisplayScore] = useState(0);

  // ─── Audio Players (using temporary free URLs) ───
  const bgmPlayer = useAudioPlayer('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3');
  const popSfx = useAudioPlayer('https://actions.google.com/sounds/v1/cartoon/pop.ogg');
  const failSfx = useAudioPlayer('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg');

  useEffect(() => {
    bgmPlayer.loop = true;
    bgmPlayer.volume = 0.3; // BGM is slightly quieter
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
    } else {
      idleBreathAnim.stopAnimation();
      idleBounceAnim.stopAnimation();
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

  const frameRef = useRef<number | undefined>(undefined);
  const checkCollision = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING') return;

    // @ts-ignore - access internal value for high-frequency polling
    const curY = fallAnim._value;
    const threshold = PLAYER_CENTER_Y - 30;

    if (curY > threshold && !passedRef.current) {
      passedRef.current = true;
      const curH = heightRef.current;
      let isMatch = false;
      const currentTS = targetShapeRef.current;

      // RELAXED & UNIFIED THRESHOLDS (Matches the visual state exactly)
      if (currentTS === 'tall' && curH >= 155) isMatch = true;
      else if (currentTS === 'wide' && curH <= 125) isMatch = true;
      else if (currentTS === 'circle' && curH > 125 && curH < 155) isMatch = true;

      if (isMatch) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 100);

        popSfx.seekTo(0);
        popSfx.play();

        triggerBurst(TARGETS[currentTS].color);

        setScore(s => {
          const ns = s + 1; scoreRef.current = ns;
          if (ns % 3 === 0) {
            setLevel(l => l + 1);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            levelUpAnim.setValue(0);
            Animated.sequence([
              Animated.spring(levelUpAnim, { toValue: 1, friction: 5, useNativeDriver: false }),
              Animated.delay(1000),
              Animated.timing(levelUpAnim, { toValue: 0, duration: 300, useNativeDriver: false })
            ]).start();
          }
          return ns;
        });

        setCombo(c => {
          const nc = c + 1; comboRef.current = nc;
          if (nc >= 2) { comboAnim.setValue(0.5); Animated.spring(comboAnim, { toValue: 1, friction: 3, useNativeDriver: false }).start(); }
          return nc;
        });

        // Removed pop (grow) animation as requested by user
        triggerWobble();

        ringScaleAnim.setValue(0.3); ringOpacityAnim.setValue(1);
        Animated.parallel([
          Animated.timing(ringScaleAnim, { toValue: 2.8, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
          Animated.timing(ringOpacityAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: false })
        ]).start();
      } else {
        gameStateRef.current = 'OVER';
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

        setDisplayScore(0); scoreCountAnim.setValue(0);
        const cd = Math.min(fs * 80, 1500);
        Animated.timing(scoreCountAnim, { toValue: fs, duration: cd, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
        const cid = scoreCountAnim.addListener(({ value: v }) => setDisplayScore(Math.round(v)));
        setTimeout(() => { scoreCountAnim.removeListener(cid); setDisplayScore(fs); }, cd + 100);

        AsyncStorage.getItem('highScore').then(val => {
          const prev = val ? parseInt(val, 10) : 0;
          if (fs > prev) { AsyncStorage.setItem('highScore', String(fs)); setHighScore(fs); }
        });
      }
    }

    if (gameStateRef.current === 'PLAYING') {
      frameRef.current = requestAnimationFrame(checkCollision);
    }
  }, []);

  useEffect(() => {
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, []);

  const startFallRef = useRef<() => void>(undefined);
  startFallRef.current = () => {
    fallAnim.setValue(-250);
    passedRef.current = false;
    let dur = 3000 - (Math.floor(scoreRef.current / 3) + 1) * 150;
    if (dur < 1000) dur = 1000;
    Animated.timing(fallAnim, { toValue: SCREEN_H + 150, duration: dur, easing: Easing.linear, useNativeDriver: false }).start(({ finished }) => {
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

    fallAnim.stopAnimation();
    fallAnim.setValue(-250);

    screenFadeAnim.setValue(0);
    Animated.timing(screenFadeAnim, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();

    setGameState('PLAYING'); setScore(0); setLevel(1); setCombo(0); setBestCombo(0); setDisplayScore(0);
    setTargetShape('circle');
    targetShapeRef.current = 'circle';

    heightAnim.setValue(BASE_DIM); popAnim.setValue(1); wobbleAnim.setValue(0);
    if (showTutorial) { setShowTutorial(false); AsyncStorage.setItem('tutorialDone', 'true'); }

    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    checkCollision();
    startFallRef.current?.();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const goHome = () => {
    screenFadeAnim.setValue(0);
    Animated.timing(screenFadeAnim, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    setGameState('START'); setScore(0); setLevel(1); setCombo(0); setBestCombo(0);
    scoreRef.current = 0; heightAnim.setValue(BASE_DIM); popAnim.setValue(1); fallAnim.setValue(-300);
    gameStateRef.current = 'START';
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
  const bgColors = ['#FFF8F0', '#F0F5E8', '#F5F0F8', '#FFFDE8', '#FFF0F3'];
  const appBgColor = bgColors[Math.min(level - 1, bgColors.length - 1)];

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

      {/* Floating particles */}
      {gameState === 'START' && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {Array.from({ length: 10 }).map((_, i) => (
            <FloatingParticle key={i} delay={i * 600} x={20 + (SCREEN_W - 40) * (i / 10)} />
          ))}
        </View>
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
          position: 'absolute', top: 0, alignSelf: 'center',
          width: currentTarget.w, height: currentTarget.h,
          borderRadius: currentTarget.w === currentTarget.h ? 999 : 50,
          borderWidth: 12, borderStyle: 'dashed', borderColor: currentTarget.color,
          backgroundColor: 'rgba(255,255,255,0.5)', justifyContent: 'center', alignItems: 'center',
          shadowColor: currentTarget.color, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15,
          transform: [{ translateY: fallAnim }, { translateY: -currentTarget.h / 2 }, { rotate: targetRotate }],
          zIndex: 10,
        }}>
          <Text style={[styles.frameLabel, { color: currentTarget.color }]}>{currentTarget.label}</Text>
        </Animated.View>
      )}

      {/* 🍡 MOCHI 🍡 */}
      {gameState === 'PLAYING' || gameState === 'OVER' ? (
        <Animated.View style={{
          position: 'absolute', top: 0, alignSelf: 'center', width: widthAnim, height: heightAnim,
          transform: [{ translateY: PLAYER_CENTER_Y }, { translateY: Animated.multiply(heightAnim, -0.5) }, { scale: popAnim }, { rotate: wobbleRotate }],
          zIndex: 20,
        }}>
          <View style={{
            flex: 1, backgroundColor: isDead ? '#E8E0D8' : '#FFF9F0', borderRadius: 999,
            borderWidth: 6, borderColor: isDead ? '#C4B5A5' : '#F0E6D8',
            shadowColor: '#D4C4B0', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.4, shadowRadius: 20, overflow: 'hidden',
          }}>
            <View style={[styles.blush, { left: squishType === 'wide' ? '15%' : '10%' }]} />
            <View style={[styles.blush, { right: squishType === 'wide' ? '15%' : '10%' }]} />
            <MochiDrawnFace isDead={isDead} squishType={squishType} />
          </View>
        </Animated.View>
      ) : (
        <Animated.View style={{
          position: 'absolute', top: 0, alignSelf: 'center', width: BASE_DIM, height: BASE_DIM,
          transform: [{ translateY: PLAYER_CENTER_Y }, { translateY: -BASE_DIM / 2 }, { scale: idleScale }, { translateY: idleY }],
          zIndex: 20,
        }}>
          <View style={{
            flex: 1, backgroundColor: '#FFF9F0', borderRadius: 999,
            borderWidth: 6, borderColor: '#F0E6D8',
            shadowColor: '#D4C4B0', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.4, shadowRadius: 20, overflow: 'hidden',
          }}>
            <View style={[styles.blush, { left: '10%' }]} />
            <View style={[styles.blush, { right: '10%' }]} />
            <MochiDrawnFace isDead={false} squishType="normal" />
          </View>
        </Animated.View>
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
            <View style={styles.popupArea}>
              {combo >= 2 && (
                <Animated.View style={[styles.comboBadge, { transform: [{ scale: comboAnim }] }]}>
                  <Text style={styles.comboText}>{combo} COMBO!</Text>
                </Animated.View>
              )}
              <Animated.View style={[styles.levelUpContainer, {
                opacity: levelUpAnim,
                transform: [{ translateY: levelUpAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }, { scale: levelUpAnim }]
              }]}>
                <Text style={styles.levelUpText}>FASTER!</Text>
              </Animated.View>
            </View>
          </Animated.View>
        )}

        {/* ─── HOME SCREEN (Redesigned) ─── */}
        {gameState === 'START' && (
          <Animated.View style={[styles.homeScreen, { opacity: screenFadeAnim }]}>
            {/* Top decorative bar */}
            <View style={styles.homeTopArea}>
              <View style={styles.topDeco}>
                <View style={styles.decoLine} />
                <Text style={styles.decoText}>🍡</Text>
                <View style={styles.decoLine} />
              </View>
            </View>

            {/* Main title card */}
            <Animated.View style={[styles.homeTitleCard, {
              transform: [
                { scale: titleEntryAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
                { translateY: titleEntryAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
              ],
              opacity: titleEntryAnim,
            }]}>
              {/* Title */}
              <View style={styles.titleRow}>
                <Text style={styles.titleMochi}>mochi</Text>
              </View>
              <Text style={styles.titleMochi2}>mochi!</Text>

              {/* Subtitle */}
              <View style={styles.subtitleRow}>
                <View style={styles.subtitleLine} />
                <Text style={styles.subtitleText}>shape matching game</Text>
                <View style={styles.subtitleLine} />
              </View>

              {/* Tutorial or High Score */}
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

            {/* Play button */}
            <Animated.View style={{
              transform: [{ scale: titleEntryAnim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 0, 1] }) }],
              opacity: titleEntryAnim,
            }}>
              <TouchableOpacity style={styles.playButton} onPress={startGame} activeOpacity={0.85}>
                <Text style={styles.playButtonText}>PLAY</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}

        {/* ─── GAME OVER ─── */}
        {gameState === 'OVER' && (
          <Animated.View style={[styles.gameOverScreen, {
            opacity: gameOverSlideAnim,
            transform: [{ translateY: gameOverSlideAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) }]
          }]}>
            <View style={styles.gameOverCard}>
              <Text style={styles.gameOverTitle}>SQUISHED!</Text>

              <View style={styles.scoreArea}>
                <Text style={styles.scoreLabel}>SCORE</Text>
                <Text style={styles.scoreNum}>{displayScore}</Text>
                {score > highScore && score > 0 && (
                  <Animated.View style={[styles.newBestBadge, {
                    transform: [{ scale: gameOverSlideAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1.1] }) }]
                  }]}>
                    <Text style={styles.newBestText}>NEW BEST!</Text>
                  </Animated.View>
                )}
                {score <= highScore && highScore > 0 && (
                  <Text style={styles.bestText}>BEST: {highScore}</Text>
                )}
                {bestCombo > 1 && <Text style={styles.comboResultText}>Best Combo: {bestCombo}</Text>}
              </View>
            </View>

            <View style={{ gap: 16, alignItems: 'center' }}>
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
  blush: { position: 'absolute', top: '38%', width: 28, height: 18, borderRadius: 10, backgroundColor: 'rgba(220,160,130,0.45)' },
  burstRing: { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 12, top: -70, alignSelf: 'center', zIndex: 15 },
  frameLabel: { fontSize: 26, fontWeight: '900', opacity: 0.7, letterSpacing: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', zIndex: 100 },
  headsUpLayer: { position: 'absolute', top: 60, left: 0, right: 0, bottom: 0, alignItems: 'center' },

  // HUD
  hudTopBar: { flexDirection: 'row', gap: 15 },
  hudBadge: { backgroundColor: '#FFF9F0', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, borderWidth: 4, alignItems: 'center', minWidth: 100, flexDirection: 'row', gap: 10, shadowColor: '#D4C4B0', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 0 },
  hudLabel: { fontSize: 18, fontWeight: '900' },
  hudValue: { fontSize: 24, fontWeight: '900', color: '#4A3F35' },
  popupArea: { flex: 1, alignItems: 'center', paddingTop: 20 },
  comboBadge: { backgroundColor: '#FFF9F0', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 25, borderWidth: 4, borderColor: '#F0C75E', transform: [{ rotate: '-8deg' }], shadowColor: '#F0C75E', shadowOpacity: 0.4, shadowOffset: { width: 0, height: 8 }, shadowRadius: 15 },
  comboText: { fontSize: 22, fontWeight: '900', color: '#C4A030', letterSpacing: 1 },
  levelUpContainer: { marginTop: 20, backgroundColor: '#FFF9F0', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25, borderWidth: 5, borderColor: '#8DB580', shadowColor: '#8DB580', shadowOpacity: 0.5, shadowOffset: { width: 0, height: 10 }, shadowRadius: 20 },
  levelUpText: { fontSize: 28, fontWeight: '900', color: '#6B9A5E', letterSpacing: 1 },

  // ─── HOME SCREEN (New) ───
  homeScreen: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  homeTopArea: { position: 'absolute', top: SCREEN_H * 0.08, alignItems: 'center' },
  topDeco: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  decoLine: { width: 40, height: 2, backgroundColor: '#E0D5C8', borderRadius: 1 },
  decoText: { fontSize: 20 },

  homeTitleCard: {
    backgroundColor: '#FFF9F0', borderRadius: 30, paddingHorizontal: 36, paddingTop: 40, paddingBottom: 36,
    alignItems: 'center', width: '100%', maxWidth: 340, marginBottom: 40,
    borderWidth: 5, borderColor: '#F0E6D8',
    shadowColor: '#D4C4B0', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.3, shadowRadius: 30,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  titleMochi: { fontSize: 58, fontWeight: '900', color: '#E8A0B4', letterSpacing: -1 },
  titleMochi2: { fontSize: 62, fontWeight: '900', color: '#8DB580', marginTop: -16, letterSpacing: -2 },

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
  highScoreCard: { backgroundColor: '#F5EDE0', borderRadius: 20, paddingHorizontal: 30, paddingVertical: 16, alignItems: 'center', borderWidth: 3, borderColor: '#E8DDD0' },
  highScoreLabel: { fontSize: 11, fontWeight: '800', color: '#C4B5A5', letterSpacing: 2 },
  highScoreRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  highScoreEmoji: { fontSize: 22 },
  highScoreNum: { fontSize: 36, fontWeight: '900', color: '#4A3F35' },

  playButton: {
    backgroundColor: '#8DB580', paddingHorizontal: 72, paddingVertical: 22, borderRadius: 999,
    borderWidth: 5, borderColor: '#FFF9F0',
    shadowColor: '#8DB580', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.5, shadowRadius: 25,
  },
  playButtonText: { color: '#FFF', fontSize: 30, fontWeight: '900', letterSpacing: 4 },

  // ─── GAME OVER ───
  gameOverScreen: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,248,240,0.85)', paddingHorizontal: 30 },
  gameOverCard: {
    backgroundColor: '#FFF9F0', borderRadius: 30, paddingHorizontal: 36, paddingVertical: 36,
    alignItems: 'center', width: '100%', maxWidth: 340, marginBottom: 40,
    borderWidth: 5, borderColor: '#F0E6D8',
    shadowColor: '#D4C4B0', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.3, shadowRadius: 30,
  },
  gameOverTitle: { fontSize: 42, fontWeight: '900', color: '#C4B5A5', letterSpacing: -1 },
  scoreArea: { marginTop: 20, alignItems: 'center' },
  scoreLabel: { fontSize: 14, fontWeight: '800', color: '#8B7E74', letterSpacing: 2 },
  scoreNum: { fontSize: 68, fontWeight: '900', color: '#4A3F35', marginVertical: 8 },
  bestText: { fontSize: 14, fontWeight: '800', color: '#C4B5A5', marginTop: 4 },
  comboResultText: { fontSize: 14, fontWeight: '800', color: '#F0C75E', marginTop: 8 },

  retryButton: {
    backgroundColor: '#E8A0B4', paddingHorizontal: 64, paddingVertical: 22, borderRadius: 999,
    borderWidth: 5, borderColor: '#FFF9F0',
    shadowColor: '#E8A0B4', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.5, shadowRadius: 25,
  },
  retryButtonText: { color: '#FFF', fontSize: 26, fontWeight: '900', letterSpacing: 3 },
  homeBtn: { paddingHorizontal: 40, paddingVertical: 12, borderRadius: 999, borderWidth: 3, borderColor: '#D4C4B0' },
  homeBtnText: { color: '#8B7E74', fontSize: 16, fontWeight: '900', letterSpacing: 2 },

  newBestBadge: { backgroundColor: '#F0C75E', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginTop: 8, shadowColor: '#F0C75E', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10 },
  newBestText: { color: '#FFF', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
});
