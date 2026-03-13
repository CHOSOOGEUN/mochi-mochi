import React, { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { SCREEN_H, PARTICLE_COLORS } from '../../constants';

// ─── Falling Sakura Petal ───
export const FallingSakura = React.memo(({ delay, startX }: { delay: number; startX: number }) => {
  const anim = useRef(new Animated.Value(0)).current;
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
      ],
    }} />
  );
});

// ─── Floating Particle ───
export const FloatingParticle = React.memo(({ delay, x }: { delay: number; x: number }) => {
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
      ],
    }} />
  );
});

// ─── Burst Particle ───
export const BurstParticle = ({ angle, color, anim }: { angle: number; color: string; anim: Animated.Value }) => {
  const rad = (angle * Math.PI) / 180;
  const { dist, size } = useRef({ dist: 80 + Math.random() * 40, size: 6 + Math.random() * 8 }).current;
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
      ],
    }} />
  );
};
