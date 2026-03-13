import React from 'react';
import { View, Text, TouchableOpacity, Animated, Platform } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { bannerAdUnitId } from '../ads';
import { GAME_ITEMS, SCREEN_H } from '../constants';
import styles from '../styles';
import { Furin } from '../components/illustrations/Decorative';
import type { Inventory } from '../types';

type Props = {
  coins: number;
  highScore: number;
  showTutorial: boolean;
  inventory: Inventory;
  activeItems: { shield: boolean; slow: boolean; double: boolean };
  adsRemoved: boolean;
  furinSwayAnim: Animated.Value;
  titleEntryAnim: Animated.Value;
  titleShimmerAnim: Animated.Value;
  playPulseAnim: Animated.Value;
  screenFadeAnim: Animated.Value;
  onPlay: () => void;
  onShop: () => void;
  onToggleItem: (id: keyof Inventory) => void;
  onBuyItem: (item: typeof GAME_ITEMS[0]) => void;
};

export const HomeScreen: React.FC<Props> = ({
  coins, highScore, showTutorial, inventory, activeItems, adsRemoved,
  furinSwayAnim, titleEntryAnim, titleShimmerAnim, playPulseAnim, screenFadeAnim,
  onPlay, onShop, onToggleItem, onBuyItem,
}) => (
  <Animated.View style={[styles.homeScreen, { opacity: screenFadeAnim }]}>
    {/* Coin display */}
    <View style={styles.coinBar}>
      <Text style={styles.coinText}>🍡 {coins}</Text>
    </View>

    {/* Top decorative bar */}
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
        const count = inventory[item.id];
        const active = activeItems[item.id];
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.itemSlot, active && count > 0 && styles.itemSlotActive]}
            onPress={() => count > 0 ? onToggleItem(item.id) : onBuyItem(item)}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 20, opacity: count > 0 ? 1 : 0.5 }}>{item.icon}</Text>
            {count > 0 ? (
              <Text style={styles.itemSlotCount}>x{count}</Text>
            ) : (
              <Text style={[styles.itemSlotCount, { color: '#E8A0B4' }]}>🍡 {item.price}</Text>
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
        <TouchableOpacity style={styles.playButton} onPress={onPlay} activeOpacity={0.85}>
          <Text style={styles.playButtonText}>PLAY</Text>
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity style={styles.shopBtn} onPress={onShop} activeOpacity={0.85}>
        <Text style={styles.shopBtnText}>🛍️ SHOP</Text>
      </TouchableOpacity>
    </Animated.View>

    {/* Banner Ad */}
    {!adsRemoved && (
      <View style={{ marginTop: 8 }}>
        <BannerAd unitId={bannerAdUnitId} size={BannerAdSize.BANNER} />
      </View>
    )}
  </Animated.View>
);
