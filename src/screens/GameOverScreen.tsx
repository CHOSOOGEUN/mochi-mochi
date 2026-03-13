import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { GAME_ITEMS } from '../constants';
import styles from '../styles';
import type { Inventory } from '../types';

type Props = {
  score: number;
  displayScore: number;
  highScore: number;
  bestCombo: number;
  earnedCoins: number;
  adMultiplierUsed: boolean;
  adContinueCount: number;
  adsRemoved: boolean;
  coins: number;
  inventory: Inventory;
  activeItems: { shield: boolean; slow: boolean; double: boolean };
  gameOverSlideAnim: Animated.Value;
  statAnim0: Animated.Value;
  statAnim1: Animated.Value;
  statAnim2: Animated.Value;
  stampAnim: Animated.Value;
  onRetry: () => void;
  onHome: () => void;
  onContinue: () => void;
  onMultiplyCoins: () => void;
  onToggleItem: (id: keyof Inventory) => void;
  onBuyItem: (item: typeof GAME_ITEMS[0]) => void;
};

export const GameOverScreen: React.FC<Props> = ({
  score, displayScore, highScore, bestCombo, earnedCoins, adMultiplierUsed,
  adContinueCount, adsRemoved, coins, inventory, activeItems,
  gameOverSlideAnim, statAnim0, statAnim1, statAnim2, stampAnim,
  onRetry, onHome, onContinue, onMultiplyCoins, onToggleItem, onBuyItem,
}) => (
  <Animated.View style={[styles.gameOverScreen, {
    opacity: gameOverSlideAnim,
    transform: [{ translateY: gameOverSlideAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) }],
  }]}>
    <ScrollView contentContainerStyle={{ alignItems: 'center', paddingVertical: 24 }} showsVerticalScrollIndicator={false}>
      <View style={styles.gameOverCard}>
        {/* Decorative top strip */}
        <View style={{
          height: 52, backgroundColor: '#F7D0DB', borderTopLeftRadius: 26, borderTopRightRadius: 26,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
          marginHorizontal: -24, marginTop: -20, marginBottom: 16,
          borderBottomWidth: 1.5, borderBottomColor: '#E8B4C2',
        }}>
          {[0, 1, 2, 3, 4].map(i => (
            <View key={i} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: i % 2 === 0 ? '#C85070' : '#F0B8C8', opacity: 0.7 }} />
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
            {earnedCoins > 0 && <Text style={styles.earnedCoinsText}>+{earnedCoins} 🍡</Text>}
          </Animated.View>
        </View>
      </View>

      {/* Item slots for Retry */}
      <View style={[styles.itemSlotsRow, { marginTop: -10, marginBottom: 10 }]}>
        {GAME_ITEMS.map(item => {
          const count = inventory[item.id];
          const active = activeItems[item.id];
          return (
            <TouchableOpacity
              key={`retry-${item.id}`}
              style={[styles.itemSlot, active && count > 0 && styles.itemSlotActive]}
              onPress={() => count > 0 ? onToggleItem(item.id) : onBuyItem(item)}
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
        {adContinueCount < 2 && score > 0 && (
          <TouchableOpacity style={styles.adContinueBtn} onPress={onContinue} activeOpacity={0.85}>
            <Text style={styles.adContinueBtnText}>▶ CONTINUE</Text>
            <Text style={styles.adContinueSubText}>
              {adsRemoved ? 'FREE' : `Watch Ad (${adContinueCount}/2)`}
            </Text>
          </TouchableOpacity>
        )}
        {!adMultiplierUsed && earnedCoins > 0 && (
          <TouchableOpacity
            style={[styles.adContinueBtn, { backgroundColor: '#F0C75E', borderColor: '#D4A030' }]}
            onPress={onMultiplyCoins}
            activeOpacity={0.85}
          >
            <Text style={[styles.adContinueBtnText, { color: '#4A3F35' }]}>💰 3x COINS</Text>
            <Text style={[styles.adContinueSubText, { color: '#8B7E74' }]}>Watch Ad to multiply reward!</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.85}>
          <Text style={styles.retryButtonText}>RETRY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeBtn} onPress={onHome} activeOpacity={0.85}>
          <Text style={styles.homeBtnText}>HOME</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </Animated.View>
);
