import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { bannerAdUnitId } from '../ads';
import { GAME_ITEMS, SCREEN_H } from '../constants';
import styles from '../styles';
import { Furin } from '../components/illustrations/Decorative';
import { t, LANG_LABELS, LANG_CYCLE, type Lang } from '../i18n';
import type { Inventory } from '../types';

type Props = {
  coins: number;
  highScore: number;
  playerLevel: number;
  playerXp: number;
  soundEnabled: boolean;
  showTutorial: boolean;
  inventory: Inventory;
  activeItems: { shield: boolean; slow: boolean };
  adsRemoved: boolean;
  lang: Lang;
  furinSwayAnim: Animated.Value;
  titleEntryAnim: Animated.Value;
  titleShimmerAnim: Animated.Value;
  playPulseAnim: Animated.Value;
  screenFadeAnim: Animated.Value;
  onPlay: () => void;
  onShop: () => void;
  onToggleItem: (id: keyof Inventory) => void;
  onBuyItem: (item: typeof GAME_ITEMS[0]) => void;
  onCycleLang: (lang?: Lang) => void;
  onToggleSound: () => void;
};

export const HomeScreen: React.FC<Props> = ({
  coins, highScore, playerLevel, playerXp, soundEnabled, showTutorial, inventory, activeItems, adsRemoved, lang,
  furinSwayAnim, titleEntryAnim, titleShimmerAnim, playPulseAnim, screenFadeAnim,
  onPlay, onShop, onToggleItem, onBuyItem, onCycleLang, onToggleSound,
}) => (
  <Animated.View style={[styles.homeScreen, { opacity: screenFadeAnim }]}>
    {/* Coin display */}
    <View style={styles.coinBar}>
      <Text style={styles.coinText}>🍡 {coins}</Text>
    </View>

    {/* Player level badge */}
    <View style={styles.levelBar}>
      <Text style={styles.levelText}>Lv.{playerLevel}</Text>
      <View style={styles.xpBarBg}>
        <View style={[styles.xpBarFill, { width: `${Math.min((playerXp / (playerLevel * 100)) * 100, 100)}%` as any }]} />
      </View>
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
            <Text style={styles.tutLabel}>{t('subtitleDrag', lang) as string}</Text>
          </View>
          <View style={styles.tutArrow}>
            <Text style={{ color: '#D4C4B0', fontSize: 18 }}>→</Text>
          </View>
          <View style={styles.tutStep}>
            <View style={styles.tutCircle}>
              <Text style={styles.tutStepEmoji}>⭕</Text>
            </View>
            <Text style={styles.tutLabel}>{t('subtitleMatch', lang) as string}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.highScoreArea}>
          <View style={styles.highScoreCard}>
            <Text style={styles.highScoreLabel}>{t('yourBest', lang) as string}</Text>
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
      opacity: titleEntryAnim, alignItems: 'center', gap: 10,
    }}>
      <Animated.View style={{ transform: [{ scale: playPulseAnim }] }}>
        <TouchableOpacity style={styles.playButton} onPress={onPlay} activeOpacity={0.85}>
          <Text style={styles.playButtonText}>{t('play', lang) as string}</Text>
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity style={styles.shopBtn} onPress={onShop} activeOpacity={0.85}>
        <Text style={styles.shopBtnText}>{t('shop', lang) as string}</Text>
      </TouchableOpacity>

      {/* Language selector + Sound toggle */}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 4, alignItems: 'center' }}>
        {LANG_CYCLE.map(l => (
          <TouchableOpacity
            key={l}
            onPress={() => onCycleLang(l)}
            activeOpacity={0.7}
            style={{
              paddingHorizontal: 14, paddingVertical: 7,
              backgroundColor: lang === l ? '#C85070' : 'rgba(200,80,112,0.1)',
              borderRadius: 14, borderWidth: 1.5,
              borderColor: lang === l ? '#A03050' : '#E8B4C2',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: lang === l ? '#fff' : '#C85070' }}>
              {LANG_LABELS[l]}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={onToggleSound}
          activeOpacity={0.7}
          style={{
            width: 36, height: 36, borderRadius: 12, borderWidth: 1.5,
            backgroundColor: soundEnabled ? 'rgba(200,80,112,0.1)' : 'rgba(180,160,150,0.15)',
            borderColor: soundEnabled ? '#E8B4C2' : '#D4C4B0',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 16 }}>{soundEnabled ? '🔊' : '🔇'}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>

    {/* Banner Ad */}
    {!adsRemoved && (
      <View style={{ marginTop: 8 }}>
        <BannerAd unitId={bannerAdUnitId} size={BannerAdSize.BANNER} />
      </View>
    )}
  </Animated.View>
);
