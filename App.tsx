import React from 'react';
import { StyleSheet, View, Text, Animated, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from 'react-native';

import { useGameLogic } from './src/hooks/useGameLogic';
import { BackgroundIllustrations, SeigaihaWaves } from './src/components/illustrations/Decorative';
import { FallingSakura, FloatingParticle, BurstParticle } from './src/components/illustrations/Animated';
import { MochiPattern, MochiDrawnFace } from './src/components/MochiCharacter';
import { HomeScreen } from './src/screens/HomeScreen';
import { ShopScreen } from './src/screens/ShopScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import styles from './src/styles';
import {
  BASE_DIM, PLAYER_CENTER_Y, TARGETS, SAKURA_POSITIONS, SCREEN_W, SCREEN_H,
} from './src/constants';

export default function App() {
  const g = useGameLogic();

  const isDead = g.gameState === 'OVER';
  const currentTarget = TARGETS[g.targetShape];
  const { wobbleRotate, shakeX, targetRotate, idleScale, idleY } = g;

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: g.appBgColor, transform: [{ translateX: shakeX }] }]}
      {...g.panResponder.panHandlers}
    >
      <StatusBar style="dark" />

      {/* Background */}
      <BackgroundIllustrations />
      <SeigaihaWaves opacity={0.06} />

      {/* Falling Sakura — always visible */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {SAKURA_POSITIONS.map((sx, i) => (
          <FallingSakura key={`sakura-${i}`} delay={i * 800} startX={sx} />
        ))}
      </View>

      {/* Floating particles — home/shop only */}
      {(g.gameState === 'START' || g.gameState === 'SHOP') && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {Array.from({ length: 10 }).map((_, i) => (
            <FloatingParticle key={i} delay={i * 600} x={20 + (SCREEN_W - 40) * (i / 10)} />
          ))}
        </View>
      )}

      {/* Combo milestone flash */}
      {g.gameState === 'PLAYING' && (
        <Animated.View pointerEvents="none" style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 18,
          backgroundColor: g.comboFlashAnim.interpolate({ inputRange: [0, 1], outputRange: ['rgba(240,190,50,0)', 'rgba(240,190,50,0.22)'] }),
        }} />
      )}

      {/* Level up white flash */}
      {g.gameState === 'PLAYING' && (
        <Animated.View pointerEvents="none" style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 19,
          backgroundColor: g.levelUpFlashAnim.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)'] }),
        }} />
      )}

      {/* Burst ring */}
      {g.gameState === 'PLAYING' && (
        <Animated.View style={[styles.burstRing, {
          borderColor: currentTarget.color,
          transform: [{ translateY: PLAYER_CENTER_Y }, { scale: g.ringScaleAnim }],
          opacity: g.ringOpacityAnim,
        }]} />
      )}

      {/* Burst particles */}
      {g.showBurst && (
        <View style={{ position: 'absolute', top: PLAYER_CENTER_Y, alignSelf: 'center', zIndex: 25 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <BurstParticle key={i} angle={i * 36} color={g.burstColor} anim={g.burstParticleAnim} />
          ))}
        </View>
      )}

      {/* Falling target */}
      {g.gameState === 'PLAYING' && (
        <Animated.View style={{
          position: 'absolute', opacity: g.targetOpacityAnim,
          top: 0, alignSelf: 'center' as const,
          width: currentTarget.w, height: currentTarget.h,
          borderRadius: currentTarget.w === currentTarget.h ? 999 : 40,
          borderWidth: 6, borderStyle: 'dashed', borderColor: currentTarget.color,
          backgroundColor: 'rgba(255,255,255,0.35)', justifyContent: 'center', alignItems: 'center',
          shadowColor: currentTarget.color, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 20,
          transform: [{ translateY: g.fallAnim }, { translateY: -currentTarget.h / 2 }, { rotate: targetRotate }],
          zIndex: 10,
        }}>
          <Text style={[styles.frameLabel, { color: currentTarget.color }]}>{currentTarget.label}</Text>
        </Animated.View>
      )}

      {/* ─── MOCHI CHARACTER ─── */}
      {(g.gameState === 'PLAYING' || g.gameState === 'OVER') ? (
        <Animated.View style={{
          position: 'absolute', top: 0, alignSelf: 'center', width: g.widthAnim, height: g.heightAnim,
          transform: isDead
            ? [{ translateY: PLAYER_CENTER_Y }, { translateY: Animated.multiply(g.heightAnim, -0.5) }, { scale: g.popAnim }, { rotate: wobbleRotate }, { scaleY: g.gameOverSquishY }, { scaleX: g.gameOverSquishX }]
            : [{ translateY: PLAYER_CENTER_Y }, { translateY: Animated.multiply(g.heightAnim, -0.5) }, { scale: g.popAnim }, { rotate: wobbleRotate }],
          zIndex: 20,
        }}>
          {/* Shield ring */}
          {g.hasShield && (
            <View pointerEvents="none" style={{
              position: 'absolute', top: -8, bottom: -8, left: -8, right: -8,
              borderRadius: 999, borderWidth: 4, borderColor: '#A0D8EF', backgroundColor: 'rgba(160,216,239,0.25)', zIndex: 30,
            }} />
          )}
          <Animated.View pointerEvents="none" style={{
            position: 'absolute', top: -8, bottom: -8, left: -8, right: -8,
            borderRadius: 999, borderWidth: 6, borderColor: '#A0D8EF',
            opacity: g.shieldAnim,
            transform: [{ scale: g.shieldAnim.interpolate({ inputRange: [0, 1], outputRange: [1.6, 1] }) }],
            zIndex: 30,
          }} />
          {g.showShieldBreak && (
            <Animated.View pointerEvents="none" style={{
              position: 'absolute', top: -50, alignSelf: 'center', zIndex: 40,
              opacity: g.shieldBreakAnim,
              transform: [
                { scale: g.shieldBreakAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) },
                { translateY: g.shieldBreakAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
              ],
            }}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: '#A0D8EF', textAlign: 'center' }}>🛡️ SHIELD!</Text>
            </Animated.View>
          )}
          <View style={{
            flex: 1, backgroundColor: isDead ? g.currentSkin.deadBody : g.currentSkin.body, borderRadius: 999,
            borderWidth: 4, borderColor: isDead ? g.currentSkin.deadBorder : g.currentSkin.border,
            shadowColor: g.currentSkin.shadow, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.35, shadowRadius: 24, overflow: 'hidden',
          }}>
            <MochiPattern skinId={g.currentSkin.id} isDead={isDead} />
            <View style={[styles.blush, { left: g.squishType === 'wide' ? '15%' : '10%', backgroundColor: g.currentSkin.blush }]} />
            <View style={[styles.blush, { right: g.squishType === 'wide' ? '15%' : '10%', backgroundColor: g.currentSkin.blush }]} />
            <MochiDrawnFace isDead={isDead} squishType={g.squishType} isHappy={g.isHappy} />
          </View>
        </Animated.View>
      ) : (
        // Home mochi (tappable)
        <TouchableOpacity
          activeOpacity={1}
          onPress={g.handleHomeTap}
          style={{ position: 'absolute', top: 0, alignSelf: 'center', zIndex: 20 }}
        >
          <Animated.View style={{
            width: BASE_DIM, height: BASE_DIM,
            transform: [
              { translateY: PLAYER_CENTER_Y }, { translateY: -BASE_DIM / 2 },
              { scale: idleScale }, { translateY: idleY },
              { translateY: g.homeTapAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -30] }) },
              { scaleX: g.homeTapScaleX }, { scaleY: g.homeTapScaleY },
            ],
          }}>
            <View style={{
              flex: 1, backgroundColor: g.currentSkin.body, borderRadius: 999,
              borderWidth: 4, borderColor: g.currentSkin.border,
              shadowColor: g.currentSkin.shadow, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.35, shadowRadius: 24, overflow: 'hidden',
            }}>
              <MochiPattern skinId={g.currentSkin.id} isDead={false} />
              <View style={[styles.blush, { left: '10%', backgroundColor: g.currentSkin.blush }]} />
              <View style={[styles.blush, { right: '10%', backgroundColor: g.currentSkin.blush }]} />
              <MochiDrawnFace isDead={false} squishType="normal" isHappy={g.homeHappy} />
            </View>
          </Animated.View>
        </TouchableOpacity>
      )}

      {/* ─── UI OVERLAYS ─── */}
      <View style={styles.overlay} pointerEvents="box-none">

        {/* Level Up Banner */}
        {g.gameState === 'PLAYING' && (
          <Animated.View pointerEvents="none" style={{
            position: 'absolute', top: 0, left: 0, right: 0, zIndex: 200,
            transform: [{ translateY: g.levelUpBannerY }],
            opacity: g.levelUpBannerOpacity,
            backgroundColor: 'rgba(200,80,112,0.88)',
            paddingTop: Platform.OS === 'ios' ? 62 : 14,
            paddingBottom: 14, paddingHorizontal: 24,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
            borderBottomWidth: 2, borderBottomColor: 'rgba(255,255,255,0.4)',
          }}>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600', marginRight: 10 }}>レベルアップ！</Text>
            <Text style={{ color: '#FFE566', fontSize: 32, fontWeight: '900', letterSpacing: 1 }}>Level {g.level}</Text>
            {g.level === 4 && <Text style={{ color: '#FFE566', fontSize: 13, fontWeight: '900', marginLeft: 10 }}>↓ Bottom incoming!</Text>}
            {g.level !== 4 && <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginLeft: 10 }}>Stage {g.level}</Text>}
          </Animated.View>
        )}

        {/* HUD */}
        {g.gameState === 'PLAYING' && (
          <Animated.View style={[styles.headsUpLayer, { opacity: g.screenFadeAnim }]} pointerEvents="none">
            <View style={styles.hudTopBar}>
              <View style={[styles.hudBadge, { borderColor: '#8DB580' }]}>
                <Text style={[styles.hudLabel, { color: '#8DB580' }]}>Lv</Text>
                <Text style={styles.hudValue}>{g.level}</Text>
              </View>
              <View style={[styles.hudBadge, { borderColor: '#E8A0B4' }]}>
                <Text style={[styles.hudLabel, { color: '#E8A0B4' }]}>⭐</Text>
                <Text style={styles.hudValue}>{g.score}</Text>
              </View>
              <View style={[styles.hudBadge, { borderColor: '#F0C75E' }]}>
                <Text style={[styles.hudLabel, { color: '#D4A030' }]}>🍡</Text>
                <Text style={styles.hudValue}>{g.coins}</Text>
              </View>
            </View>

            {/* Active item indicators */}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              {g.slowCount > 0 && (
                <View style={[styles.activeItemBadge, { backgroundColor: '#E8F4F8', borderColor: '#8DB580' }]}>
                  <Text style={{ fontSize: 16 }}>🐢 <Text style={{ fontSize: 14, fontWeight: '800', color: '#8DB580' }}>x{g.slowCount}</Text></Text>
                </View>
              )}
              {g.doubleCount > 0 && (
                <View style={[styles.activeItemBadge, { backgroundColor: '#FFFDF0', borderColor: '#F0C75E' }]}>
                  <Text style={{ fontSize: 16 }}>✨ <Text style={{ fontSize: 14, fontWeight: '800', color: '#C4A030' }}>x{g.doubleCount}</Text></Text>
                </View>
              )}
            </View>

            <View style={styles.popupArea}>
              {g.combo >= 2 && (
                <Animated.View style={[styles.comboBadge, { transform: [{ scale: g.comboAnim }] }]}>
                  <Text style={styles.comboText}>{g.combo} COMBO!</Text>
                </Animated.View>
              )}
            </View>

            {/* Item use popup */}
            {g.itemPopup && (
              <Animated.View pointerEvents="none" style={{
                position: 'absolute', top: SCREEN_H * 0.38, alignSelf: 'center', zIndex: 50,
                opacity: g.itemPopupAnim,
                transform: [
                  { scale: g.itemPopupAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) },
                  { translateY: g.itemPopupAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
                ],
              }}>
                <Text style={{ fontSize: 24, fontWeight: '900', color: g.itemPopup.color, textAlign: 'center', textShadowColor: 'rgba(255,255,255,0.8)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 }}>
                  {g.itemPopup.text}
                </Text>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* HOME SCREEN */}
        {g.gameState === 'START' && (
          <HomeScreen
            coins={g.coins}
            highScore={g.highScore}
            showTutorial={g.showTutorial}
            inventory={g.inventory}
            activeItems={g.activeItems}
            adsRemoved={g.adsRemoved}
            furinSwayAnim={g.furinSwayAnim}
            titleEntryAnim={g.titleEntryAnim}
            titleShimmerAnim={g.titleShimmerAnim}
            playPulseAnim={g.playPulseAnim}
            screenFadeAnim={g.screenFadeAnim}
            onPlay={g.startGame}
            onShop={() => g.setGameState('SHOP')}
            onToggleItem={g.toggleActiveItem}
            onBuyItem={g.buyItem}
          />
        )}

        {/* SHOP SCREEN */}
        {g.gameState === 'SHOP' && (
          <ShopScreen
            coins={g.coins}
            shopTab={g.shopTab}
            inventory={g.inventory}
            selectedSkinId={g.selectedSkinId}
            unlockedSkinIds={g.unlockedSkinIds}
            adsRemoved={g.adsRemoved}
            watchAdCount={g.watchAdCount}
            setShopTab={g.setShopTab}
            onBack={g.goHome}
            onBuySkin={g.buySkin}
            onSelectSkin={g.selectSkin}
            onBuyItem={g.buyItem}
            onWatchAd={g.watchAdForCoins}
            onBuyIap={g.buyIap}
          />
        )}

        {/* GAME OVER */}
        {g.gameState === 'OVER' && (
          <GameOverScreen
            score={g.score}
            displayScore={g.displayScore}
            highScore={g.highScore}
            bestCombo={g.bestCombo}
            earnedCoins={g.earnedCoins}
            adMultiplierUsed={g.adMultiplierUsed}
            adContinueCount={g.adContinueCount}
            adsRemoved={g.adsRemoved}
            coins={g.coins}
            inventory={g.inventory}
            activeItems={g.activeItems}
            gameOverSlideAnim={g.gameOverSlideAnim}
            statAnim0={g.statAnim0}
            statAnim1={g.statAnim1}
            statAnim2={g.statAnim2}
            stampAnim={g.stampAnim}
            onRetry={g.startGame}
            onHome={g.goHome}
            onContinue={g.continueFromAd}
            onMultiplyCoins={g.multiplyCoinsFromAd}
            onToggleItem={g.toggleActiveItem}
            onBuyItem={g.buyItem}
          />
        )}

        {/* DAILY BONUS POPUP */}
        {g.dailyBonusShow && g.gameState === 'START' && (
          <View style={styles.dailyBonusOverlay}>
            <View style={styles.dailyBonusCard}>
              <Text style={{ fontSize: 40, marginBottom: 8 }}>🎁</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#C4B5A5', letterSpacing: 3, marginBottom: 4 }}>DAILY BONUS</Text>
              <Text style={{ fontSize: 48, fontWeight: '900', color: '#F0C75E' }}>+{g.dailyBonusAmount}</Text>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#4A3F35', marginBottom: 4 }}>🍡</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 }}>
                <Text style={{ fontSize: 13, color: '#8B7E74', fontWeight: '600' }}>🔥 {g.loginStreak} day streak!</Text>
              </View>
              <TouchableOpacity style={styles.dailyBonusBtn} onPress={() => g.setDailyBonusShow(false)} activeOpacity={0.85}>
                <Text style={styles.dailyBonusBtnText}>Claim</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
}
