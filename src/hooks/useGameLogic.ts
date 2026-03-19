import { useRef, useState, useEffect, useCallback } from 'react';
import { Animated, PanResponder, Platform, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AdEventType,
  RewardedAdEventType,
  InterstitialAd,
  RewardedAd,
} from 'react-native-google-mobile-ads';
import {
  initConnection,
  purchaseUpdatedListener,
  requestPurchase,
  finishTransaction,
  type Purchase as IapPurchase,
} from 'react-native-iap';

import {
  BASE_DIM, MIN_DIM, MAX_DIM, PLAYER_CENTER_Y,
  TARGETS, TARGET_TYPES, BG_COLORS, BANNER_HIDE_Y,
  IAP_SKUS, IAP_BUNDLES, SKINS, DEFAULT_INVENTORY,
} from '../constants';
import { interstitialAdUnitId, rewardedAdUnitId, initializeAds } from '../ads';
import type { Direction, TargetType, Inventory, GameItem, MochiSkin, GameScreenState } from '../types';
import { t, LANG_CYCLE, type Lang } from '../i18n';

export function useGameLogic() {
  // ─── Game state ───
  const [gameState, setGameState] = useState<GameScreenState>('START');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [targetShape, setTargetShape] = useState<TargetType>('circle');
  const [highScore, setHighScore] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showBurst, setShowBurst] = useState(false);
  const [burstColor, setBurstColor] = useState('#E8A0B4');

  // ─── Economy state ───
  const [coins, setCoins] = useState(0);
  const [selectedSkinId, setSelectedSkinId] = useState('classic');
  const [unlockedSkinIds, setUnlockedSkinIds] = useState<string[]>(['classic']);
  const [inventory, setInventory] = useState<Inventory>({ ...DEFAULT_INVENTORY });
  const [shopTab, setShopTab] = useState<'skins' | 'items' | 'coins'>('skins');
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [adMultiplierUsed, setAdMultiplierUsed] = useState(false);
  const [activeItems, setActiveItems] = useState<{ shield: boolean; slow: boolean }>({ shield: false, slow: false });
  const [adContinueCount, setAdContinueCount] = useState(0);

  // ─── Ad state ───
  const [interstitial, setInterstitial] = useState<InterstitialAd | null>(null);
  const [rewarded, setRewarded] = useState<RewardedAd | null>(null);
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [rewardedLoaded, setRewardedLoaded] = useState(false);
  const [deathCount, setDeathCount] = useState(0);
  const [adsRemoved, setAdsRemoved] = useState(false);
  const [watchAdCount, setWatchAdCount] = useState(0);

  // ─── Language ───
  const [lang, setLang] = useState<Lang>('en');

  // ─── Daily bonus ───
  const [dailyBonusShow, setDailyBonusShow] = useState(false);
  const [dailyBonusAmount, setDailyBonusAmount] = useState(0);
  const [loginStreak, setLoginStreak] = useState(1);

  // ─── In-game UI state ───
  const [hasShield, setHasShield] = useState(false);
  const [squishType, setSquishType] = useState<'tall' | 'wide' | 'normal'>('normal');
  const [displayScore, setDisplayScore] = useState(0);
  const [isHappy, setIsHappy] = useState(false);
  const [showShieldBreak, setShowShieldBreak] = useState(false);
  const [slowCount, setSlowCount] = useState(0);
  const [itemPopup, setItemPopup] = useState<{ text: string; color: string } | null>(null);
  const [homeHappy, setHomeHappy] = useState(false);

  // ─── Refs ───
  const langRef = useRef(lang); langRef.current = lang;
  const gameStateRef = useRef(gameState); gameStateRef.current = gameState;
  const targetShapeRef = useRef(targetShape); targetShapeRef.current = targetShape;
  const directionRef = useRef<Direction>('top');
  const levelRef = useRef(1);
  const scoreRef = useRef(score); scoreRef.current = score;
  const passedRef = useRef(false);
  const comboRef = useRef(combo); comboRef.current = combo;
  const comboCoinsRef = useRef(0);
  const scoreCoinsRef = useRef(0);
  const shieldActiveRef = useRef(false);
  const slowCountRef = useRef(0);
  const happyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingInterstitialRef = useRef(false);
  const frameRef = useRef<number | undefined>(undefined);
  const scoreCountListenerRef = useRef<string | undefined>(undefined);
  const homeTapCooldown = useRef(false);

  // ─── Animated Values — Mochi & Game ───
  const heightAnim = useRef(new Animated.Value(BASE_DIM)).current;
  const heightRef = useRef(BASE_DIM);
  const widthAnim = useRef(Animated.subtract(new Animated.Value(280), heightAnim)).current;
  const fallAnim = useRef(new Animated.Value(-300)).current;
  const popAnim = useRef(new Animated.Value(1)).current;
  const ringScaleAnim = useRef(new Animated.Value(0)).current;
  const ringOpacityAnim = useRef(new Animated.Value(0)).current;
  const comboAnim = useRef(new Animated.Value(0)).current;
  const wobbleAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const targetRotateAnim = useRef(new Animated.Value(0)).current;
  const targetOpacityAnim = useRef(new Animated.Value(1)).current;
  const burstParticleAnim = useRef(new Animated.Value(0)).current;
  const shieldAnim = useRef(new Animated.Value(0)).current;
  const shieldBreakAnim = useRef(new Animated.Value(0)).current;
  const itemPopupAnim = useRef(new Animated.Value(0)).current;

  // ─── Animated Values — Screen transitions ───
  const screenFadeAnim = useRef(new Animated.Value(1)).current;
  const gameOverSlideAnim = useRef(new Animated.Value(0)).current;
  const scoreCountAnim = useRef(new Animated.Value(0)).current;

  // ─── Animated Values — Game Over ───
  const gameOverSquishY = useRef(new Animated.Value(1)).current;
  const gameOverSquishX = useRef(new Animated.Value(1)).current;
  const stampAnim = useRef(new Animated.Value(0)).current;
  const statAnim0 = useRef(new Animated.Value(0)).current;
  const statAnim1 = useRef(new Animated.Value(0)).current;
  const statAnim2 = useRef(new Animated.Value(0)).current;

  // ─── Animated Values — Home ───
  const idleBreathAnim = useRef(new Animated.Value(0)).current;
  const idleBounceAnim = useRef(new Animated.Value(0)).current;
  const titleEntryAnim = useRef(new Animated.Value(0)).current;
  const titleShimmerAnim = useRef(new Animated.Value(0)).current;
  const playPulseAnim = useRef(new Animated.Value(1)).current;
  const furinSwayAnim = useRef(new Animated.Value(0)).current;
  const homeTapAnim = useRef(new Animated.Value(0)).current;
  const homeTapScaleX = useRef(new Animated.Value(1)).current;
  const homeTapScaleY = useRef(new Animated.Value(1)).current;

  // ─── Animated Values — Background & Level ───
  const bgColorAnim = useRef(new Animated.Value(0)).current;
  const prevBgIdxRef = useRef(0);
  const curBgIdxRef = useRef(0);
  const comboFlashAnim = useRef(new Animated.Value(0)).current;
  const levelUpBannerY = useRef(new Animated.Value(BANNER_HIDE_Y)).current;
  const levelUpBannerOpacity = useRef(new Animated.Value(0)).current;
  const levelUpFlashAnim = useRef(new Animated.Value(0)).current;

  // ─── Audio ───
  const bgmPlayer = useAudioPlayer(require('../../assets/audio/bgm.mp3'));
  const popSfx = useAudioPlayer(require('../../assets/audio/pop.mp3'));
  const failSfx = useAudioPlayer(require('../../assets/audio/fail.mp3'));
  const levelUpSfx = useAudioPlayer(require('../../assets/audio/levelup.mp3'));
  const shieldSfx = useAudioPlayer(require('../../assets/audio/shield.mp3'));

  const playSound = (player: ReturnType<typeof useAudioPlayer>, volume = 1.0) => {
    player.volume = volume;
    player.seekTo(0).then(() => player.play()).catch(() => { });
  };

  useEffect(() => {
    bgmPlayer.loop = true;
    bgmPlayer.volume = 0.25;
  }, []);

  useEffect(() => {
    if (gameState === 'PLAYING') bgmPlayer.play();
    else bgmPlayer.pause();
  }, [gameState]);

  // ─── Ad setup ───
  useEffect(() => {
    AsyncStorage.getItem('deathCount').then(val => { if (val) setDeathCount(parseInt(val, 10)); });

    let iAd: InterstitialAd;
    let rAd: RewardedAd;
    let unsubI: any[] = [];
    let unsubR: any[] = [];

    initializeAds().then((nonPersonalized) => {
      iAd = InterstitialAd.createForAdRequest(interstitialAdUnitId, { requestNonPersonalizedAdsOnly: nonPersonalized });
      rAd = RewardedAd.createForAdRequest(rewardedAdUnitId, { requestNonPersonalizedAdsOnly: nonPersonalized });

      unsubI.push(iAd.addAdEventListener(AdEventType.LOADED, () => setInterstitialLoaded(true)));
      unsubI.push(iAd.addAdEventListener(AdEventType.CLOSED, () => { setInterstitialLoaded(false); iAd.load(); }));
      iAd.load();

      unsubR.push(rAd.addAdEventListener(RewardedAdEventType.LOADED, () => setRewardedLoaded(true)));
      unsubR.push(rAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => console.log('User earned reward:', reward)));
      unsubR.push(rAd.addAdEventListener(AdEventType.CLOSED, () => { setRewardedLoaded(false); rAd.load(); }));
      rAd.load();

      setInterstitial(iAd);
      setRewarded(rAd);
    });

    return () => {
      unsubI.forEach(u => u());
      unsubR.forEach(u => u());
    };
  }, []);

  // ─── IAP setup ───
  useEffect(() => {
    let purchaseListener: ReturnType<typeof purchaseUpdatedListener> | null = null;
    initConnection()
      .then(() => {
        purchaseListener = purchaseUpdatedListener(async (purchase: IapPurchase) => {
          const sku = purchase.productId;
          const bundle = IAP_BUNDLES.find(b => b.sku === sku);
          if (bundle) {
            if (sku === IAP_SKUS.removeAds) {
              setAdsRemoved(true);
              AsyncStorage.setItem('adsRemoved', 'true');
            } else if (bundle.coins > 0) {
              setCoins(prev => {
                const newTotal = prev + bundle.coins;
                AsyncStorage.setItem('coins', String(newTotal));
                return newTotal;
              });
            }
          }
          await finishTransaction({ purchase });
        });
      })
      .catch(e => console.log('IAP initConnection error:', e));
    return () => { purchaseListener?.remove(); };
  }, []);

  // ─── Persist / load data ───
  useEffect(() => {
    AsyncStorage.getItem('highScore').then(val => { if (val) setHighScore(parseInt(val, 10)); }).catch(() => {});
    AsyncStorage.getItem('tutorialDone').then(val => { if (val === 'true') setShowTutorial(false); }).catch(() => {});
    AsyncStorage.getItem('selectedSkin').then(val => { if (val) setSelectedSkinId(val); }).catch(() => {});
    AsyncStorage.getItem('unlockedSkins').then(val => { if (val) setUnlockedSkinIds(JSON.parse(val)); }).catch(() => {});
    AsyncStorage.getItem('inventory').then(val => { if (val) setInventory(JSON.parse(val)); }).catch(() => {});
    AsyncStorage.getItem('adsRemoved').then(val => { if (val === 'true') setAdsRemoved(true); }).catch(() => {});
    AsyncStorage.getItem('lang').then(val => { if (val) setLang(val as Lang); }).catch(() => {});

    const today = new Date().toDateString();
    AsyncStorage.getItem('watchAdDate').then(date => {
      if (date === today) {
        AsyncStorage.getItem('watchAdCount').then(c => { if (c) setWatchAdCount(parseInt(c, 10)); }).catch(() => {});
      } else {
        AsyncStorage.setItem('watchAdDate', today).catch(() => {});
        AsyncStorage.setItem('watchAdCount', '0').catch(() => {});
        setWatchAdCount(0);
      }
    }).catch(() => {});

    AsyncStorage.multiGet(['coins', 'lastLoginDate', 'loginStreak']).then(pairs => {
      const savedCoins = pairs[0][1] ? parseInt(pairs[0][1], 10) : 0;
      setCoins(savedCoins);
      const lastDate = pairs[1][1];
      const streak = parseInt(pairs[2][1] || '0', 10);
      if (lastDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = lastDate === yesterday ? streak + 1 : 1;
        const bonus = newStreak >= 4 ? 25 : newStreak === 3 ? 20 : newStreak === 2 ? 15 : 10;
        setLoginStreak(newStreak);
        setDailyBonusAmount(bonus);
        setDailyBonusShow(true);
        const newCoins = savedCoins + bonus;
        setCoins(newCoins);
        AsyncStorage.multiSet([
          ['coins', String(newCoins)],
          ['lastLoginDate', today],
          ['loginStreak', String(newStreak)],
        ]);
      }
    });
  }, []);

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
      Animated.loop(Animated.sequence([
        Animated.timing(titleShimmerAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(titleShimmerAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])).start();
      Animated.loop(Animated.sequence([
        Animated.timing(playPulseAnim, { toValue: 1.06, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(playPulseAnim, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])).start();
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

  // ─── Playing animations ───
  useEffect(() => {
    if (gameState === 'PLAYING') {
      Animated.loop(Animated.sequence([
        Animated.timing(targetRotateAnim, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(targetRotateAnim, { toValue: -1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(targetRotateAnim, { toValue: 0, duration: 400, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])).start();
    } else {
      targetRotateAnim.stopAnimation(); targetRotateAnim.setValue(0);
    }
  }, [gameState]);

  // ─── Background color on level change ───
  useEffect(() => {
    const newIdx = Math.min(level - 1, BG_COLORS.length - 1);
    if (newIdx !== curBgIdxRef.current) {
      prevBgIdxRef.current = curBgIdxRef.current;
      curBgIdxRef.current = newIdx;
      bgColorAnim.setValue(0);
      Animated.timing(bgColorAnim, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }).start();
    }
  }, [level]);

  // ─── Height listener for squish type ───
  useEffect(() => {
    const hId = heightAnim.addListener(({ value }) => {
      heightRef.current = value;
      setSquishType(prev => {
        if (value > 155 && prev !== 'tall') return 'tall';
        if (value < 125 && prev !== 'wide') return 'wide';
        if (value >= 125 && value <= 155 && prev !== 'normal') return 'normal';
        return prev;
      });
    });
    return () => heightAnim.removeListener(hId);
  }, []);

  // ─── Cleanup ───
  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (scoreCountListenerRef.current) scoreCountAnim.removeListener(scoreCountListenerRef.current);
      if (happyTimerRef.current) clearTimeout(happyTimerRef.current);
    };
  }, []);

  // ─── Animation helpers ───
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

  const showItemPopup = useCallback((text: string, color: string) => {
    setItemPopup({ text, color });
    itemPopupAnim.setValue(0);
    Animated.sequence([
      Animated.spring(itemPopupAnim, { toValue: 1, friction: 4, tension: 100, useNativeDriver: false }),
      Animated.delay(500),
      Animated.timing(itemPopupAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start(() => setItemPopup(null));
  }, [itemPopupAnim]);

  // ─── Collision detection (rAF loop) ───
  const checkCollisionRef = useRef<() => void>(undefined);
  checkCollisionRef.current = () => {
    if (gameStateRef.current !== 'PLAYING') return;

    const curVal = (fallAnim as any)._value as number;
    const dir = directionRef.current;
    let hasReachedMochi = false;
    switch (dir) {
      case 'top': hasReachedMochi = curVal > PLAYER_CENTER_Y - 30; break;
      case 'bottom': hasReachedMochi = curVal < PLAYER_CENTER_Y + 30; break;
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

        if (happyTimerRef.current) clearTimeout(happyTimerRef.current);
        setIsHappy(true);
        happyTimerRef.current = setTimeout(() => setIsHappy(false), 400);

        playSound(popSfx, 0.7);
        triggerBurst(TARGETS[currentTS].color);

        setScore(s => {
          const ns = s + 1; scoreRef.current = ns;
          if (ns % 3 === 0) {
            setLevel(l => {
              const newLvl = l + 1;
              levelRef.current = newLvl;
              return newLvl;
            });
            scoreCoinsRef.current += 1;
            setCoins(prev => { const n = prev + 1; AsyncStorage.setItem('coins', String(n)); return n; });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            playSound(levelUpSfx, 0.8);
            levelUpBannerY.setValue(BANNER_HIDE_Y);
            levelUpBannerOpacity.setValue(0);
            Animated.sequence([
              Animated.parallel([
                Animated.spring(levelUpBannerY, { toValue: 0, friction: 7, tension: 150, useNativeDriver: true }),
                Animated.timing(levelUpBannerOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
              ]),
              Animated.delay(1200),
              Animated.parallel([
                Animated.timing(levelUpBannerY, { toValue: BANNER_HIDE_Y, duration: 300, useNativeDriver: true }),
                Animated.timing(levelUpBannerOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
              ]),
            ]).start();
            levelUpFlashAnim.setValue(0);
            Animated.sequence([
              Animated.timing(levelUpFlashAnim, { toValue: 1, duration: 80, useNativeDriver: false }),
              Animated.timing(levelUpFlashAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
            ]).start();
            triggerBurst('#F0C75E');
          }
          return ns;
        });

        // Combo coin reward every 5 combos
        const newCombo = comboRef.current + 1;
        if (newCombo % 5 === 0) {
          comboCoinsRef.current += 3;
          setCoins(prev => {
            const newTotal = prev + 3;
            AsyncStorage.setItem('coins', String(newTotal));
            return newTotal;
          });
          showItemPopup(t('popupCoins', langRef.current) as string, '#F0C75E');
        }

        setCombo(c => {
          const nc = c + 1; comboRef.current = nc;
          if (nc >= 2) { comboAnim.setValue(0.5); Animated.spring(comboAnim, { toValue: 1, friction: 3, useNativeDriver: false }).start(); }
          if (nc === 5 || nc === 10 || (nc > 10 && nc % 5 === 0)) {
            comboFlashAnim.setValue(0);
            Animated.sequence([
              Animated.timing(comboFlashAnim, { toValue: 1, duration: 120, useNativeDriver: false }),
              Animated.timing(comboFlashAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
            ]).start();
            triggerBurst(nc >= 15 ? '#C85070' : nc === 10 ? '#7060D4' : '#D4A030');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          return nc;
        });

        triggerWobble();
        ringScaleAnim.setValue(0.3); ringOpacityAnim.setValue(1);
        Animated.parallel([
          Animated.timing(ringScaleAnim, { toValue: 2.8, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
          Animated.timing(ringOpacityAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
        ]).start();
      } else {
        if (shieldActiveRef.current) {
          shieldActiveRef.current = false;
          setHasShield(false);
          shieldAnim.setValue(1);
          Animated.timing(shieldAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
          setShowShieldBreak(true);
          shieldBreakAnim.setValue(0);
          Animated.sequence([
            Animated.spring(shieldBreakAnim, { toValue: 1, friction: 4, tension: 100, useNativeDriver: false }),
            Animated.delay(600),
            Animated.timing(shieldBreakAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
          ]).start(() => setShowShieldBreak(false));
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          playSound(shieldSfx, 0.9);
          triggerWobble();
        } else {
          gameStateRef.current = 'OVER';
          setIsHappy(false);
          if (happyTimerRef.current) clearTimeout(happyTimerRef.current);
          const fs = scoreRef.current; const fc = comboRef.current;
          setBestCombo(fc);
          fallAnim.stopAnimation();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          playSound(failSfx, 1.0);
          triggerShake();

          const newDeathCount = deathCount + 1;
          setDeathCount(newDeathCount);
          AsyncStorage.setItem('deathCount', String(newDeathCount)).catch(() => {});

          if (!adsRemoved && newDeathCount > 2 && newDeathCount % 3 === 0 && interstitialLoaded) {
            pendingInterstitialRef.current = true;
            setTimeout(() => {
              if (pendingInterstitialRef.current) {
                pendingInterstitialRef.current = false;
                interstitial?.show();
              }
            }, 800);
          }

          gameOverSlideAnim.setValue(0);
          setGameState('OVER'); setCombo(0);
          setAdMultiplierUsed(false);
          Animated.spring(gameOverSlideAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: false }).start();

          gameOverSquishY.setValue(1); gameOverSquishX.setValue(1);
          Animated.sequence([
            Animated.parallel([
              Animated.spring(gameOverSquishY, { toValue: 0.35, friction: 3, tension: 200, useNativeDriver: false }),
              Animated.spring(gameOverSquishX, { toValue: 1.5, friction: 3, tension: 200, useNativeDriver: false }),
            ]),
            Animated.parallel([
              Animated.spring(gameOverSquishY, { toValue: 0.5, friction: 5, tension: 80, useNativeDriver: false }),
              Animated.spring(gameOverSquishX, { toValue: 1.3, friction: 5, tension: 80, useNativeDriver: false }),
            ]),
          ]).start();

          statAnim0.setValue(0); statAnim1.setValue(0); statAnim2.setValue(0);
          Animated.stagger(220, [
            Animated.timing(statAnim0, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(statAnim1, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(statAnim2, { toValue: 1, duration: 300, useNativeDriver: true }),
          ]).start();

          setDisplayScore(0); scoreCountAnim.setValue(0);
          const cd = Math.min(fs * 80, 1500);
          Animated.timing(scoreCountAnim, { toValue: fs, duration: cd, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
          if (scoreCountListenerRef.current) scoreCountAnim.removeListener(scoreCountListenerRef.current);
          scoreCountListenerRef.current = scoreCountAnim.addListener(({ value: v }) => setDisplayScore(Math.round(v)));
          setTimeout(() => {
            if (scoreCountListenerRef.current) { scoreCountAnim.removeListener(scoreCountListenerRef.current); scoreCountListenerRef.current = undefined; }
            setDisplayScore(fs);
          }, cd + 100);

          const earned = scoreCoinsRef.current + comboCoinsRef.current;
          setEarnedCoins(earned);

          AsyncStorage.getItem('highScore').then(val => {
            const prev = val ? parseInt(val, 10) : 0;
            if (fs > prev) {
              AsyncStorage.setItem('highScore', String(fs)).catch(() => {}); setHighScore(fs);
              stampAnim.setValue(3);
              Animated.spring(stampAnim, { toValue: 1, friction: 4, tension: 180, useNativeDriver: true }).start();
              triggerBurst('#C85070');
            }
          }).catch(() => {});
        }
      }
    }

    if (gameStateRef.current === 'PLAYING') {
      frameRef.current = requestAnimationFrame(() => checkCollisionRef.current?.());
    }
  };

  // ─── Target fall ───
  const startFallRef = useRef<() => void>(undefined);
  startFallRef.current = () => {
    const lvl = levelRef.current;
    const availDirs: Direction[] = lvl <= 3 ? ['top'] : ['top', 'bottom'];
    const dir = availDirs[Math.floor(Math.random() * availDirs.length)];
    directionRef.current = dir;

    let startVal: number, endVal: number;
    switch (dir) {
      case 'top': startVal = -250; endVal = SCREEN_H_VAL + 150; break;
      case 'bottom': startVal = SCREEN_H_VAL + 250; endVal = -150; break;
      default: startVal = -250; endVal = SCREEN_H_VAL + 150; break;
    }

    targetOpacityAnim.setValue(0);
    fallAnim.setValue(startVal);
    passedRef.current = false;
    Animated.timing(targetOpacityAnim, { toValue: 1, duration: 80, useNativeDriver: false }).start();

    let dur = 3000 - (Math.floor(scoreRef.current / 3) + 1) * 150;
    if (dur < 600) dur = 600;

    if (slowCountRef.current > 0) {
      dur *= 2;
      slowCountRef.current--;
      setSlowCount(slowCountRef.current);
      showItemPopup(t('popupSlow', langRef.current) as string, '#8DB580');
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

  // Need screen height in startFall but can't import at top without circular — use constant
  const SCREEN_H_VAL = PLAYER_CENTER_Y * 2;

  // ─── Item helpers ───
  const applyActiveItems = () => {
    shieldActiveRef.current = activeItems.shield;
    setHasShield(activeItems.shield);
    shieldAnim.setValue(0);
    slowCountRef.current = activeItems.slow ? 3 : 0;
    setSlowCount(slowCountRef.current);
    if (activeItems.shield || activeItems.slow) {
      setInventory(prev => {
        const next = { ...prev };
        if (activeItems.shield) next.shield--;
        if (activeItems.slow) next.slow--;
        AsyncStorage.setItem('inventory', JSON.stringify(next));
        return next;
      });
      setActiveItems({ shield: false, slow: false });
    }
  };

  // ─── Game flow ───
  const startGame = () => {
    gameStateRef.current = 'PLAYING';
    passedRef.current = false;
    scoreRef.current = 0;
    comboRef.current = 0;
    comboCoinsRef.current = 0;
    scoreCoinsRef.current = 0;

    applyActiveItems();

    fallAnim.stopAnimation();
    fallAnim.setValue(-250);

    screenFadeAnim.setValue(0);
    Animated.timing(screenFadeAnim, { toValue: 1, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();

    setGameState('PLAYING'); setScore(0); setLevel(1); setCombo(0); setBestCombo(0); setDisplayScore(0);
    prevBgIdxRef.current = 0; curBgIdxRef.current = 0; bgColorAnim.setValue(1);
    setTargetShape('circle');
    targetShapeRef.current = 'circle';
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
    directionRef.current = 'top';
    levelRef.current = 1;
    setAdContinueCount(0);
    setAdMultiplierUsed(false);
  };

  const executeContinue = () => {
    setAdContinueCount(prev => prev + 1);
    gameStateRef.current = 'PLAYING';
    passedRef.current = false;
    comboRef.current = 0;
    applyActiveItems();
    fallAnim.stopAnimation();
    fallAnim.setValue(-250);
    heightAnim.setValue(BASE_DIM); wobbleAnim.setValue(0);
    setGameState('PLAYING'); setCombo(0);
    directionRef.current = 'top';
    const nextTarget = TARGET_TYPES[Math.floor(Math.random() * TARGET_TYPES.length)];
    setTargetShape(nextTarget);
    targetShapeRef.current = nextTarget;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    checkCollisionRef.current?.();
    startFallRef.current?.();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const continueFromAd = () => {
    if (adsRemoved) { executeContinue(); return; }
    if (rewardedLoaded) {
      const unsubscribeClosed = rewarded?.addAdEventListener(AdEventType.CLOSED, () => {
        if (unsubscribeClosed) unsubscribeClosed();
        executeContinue();
      });
      rewarded?.show();
    } else {
      executeContinue();
    }
  };

  const multiplyCoinsFromAd = () => {
    if (rewardedLoaded && !adMultiplierUsed && earnedCoins > 0) {
      pendingInterstitialRef.current = false;
      const unsubscribeClosed = rewarded?.addAdEventListener(AdEventType.CLOSED, () => {
        if (unsubscribeClosed) unsubscribeClosed();
        const bonusCoins = earnedCoins * 2;
        setCoins(prev => {
          const newTotal = prev + bonusCoins;
          AsyncStorage.setItem('coins', String(newTotal));
          return newTotal;
        });
        setEarnedCoins(earnedCoins * 3);
        setAdMultiplierUsed(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        if (interstitialLoaded) setTimeout(() => interstitial?.show(), 300);
      });
      rewarded?.show();
    }
  };

  // ─── Shop actions ───
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
      const next = { ...prev, [item.id]: prev[item.id] + 1 };
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

  const watchAdForCoins = () => {
    if (watchAdCount >= 3 || !rewardedLoaded) return;
    const today = new Date().toDateString();
    const handleReward = rewarded?.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      if (handleReward) handleReward();
      const reward = 20;
      setCoins(prev => {
        const newTotal = prev + reward;
        AsyncStorage.setItem('coins', String(newTotal));
        return newTotal;
      });
      const newCount = watchAdCount + 1;
      setWatchAdCount(newCount);
      AsyncStorage.setItem('watchAdCount', String(newCount));
      AsyncStorage.setItem('watchAdDate', today);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    });
    rewarded?.show();
  };

  const buyIap = async (sku: string) => {
    try {
      await requestPurchase({
        request: Platform.OS === 'ios'
          ? { apple: { sku } }
          : { google: { skus: [sku] } },
        type: 'in-app',
      });
    } catch (e) {
      console.log('IAP purchase error:', e);
    }
  };

  // ─── Home mochi tap ───
  const handleHomeTap = () => {
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
  };

  // ─── Pan responder ───
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
    },
  })).current;

  const cycleLang = useCallback((targetLang?: Lang) => {
    const next = targetLang ?? LANG_CYCLE[(LANG_CYCLE.indexOf(langRef.current) + 1) % LANG_CYCLE.length];
    setLang(next);
    AsyncStorage.setItem('lang', next);
  }, []);

  // ─── Derived values ───
  const currentSkin = SKINS.find(s => s.id === selectedSkinId) || SKINS[0];
  const isDead = gameState === 'OVER';
  const currentTarget = TARGETS[targetShape];
  const prevColor = BG_COLORS[Math.min(prevBgIdxRef.current, BG_COLORS.length - 1)];
  const curColor = BG_COLORS[Math.min(curBgIdxRef.current, BG_COLORS.length - 1)];
  const appBgColor = bgColorAnim.interpolate({ inputRange: [0, 1], outputRange: [prevColor, curColor] });
  const wobbleRotate = wobbleAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-4deg', '0deg', '4deg'] });
  const shakeX = shakeAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: [-8, 0, 8] });
  const targetRotate = targetRotateAnim.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-3deg', '0deg', '3deg'] });
  const idleScale = idleBreathAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const idleY = idleBounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -12] });

  return {
    // Game state
    gameState, score, level, combo, bestCombo, targetShape, highScore,
    showTutorial, showBurst, burstColor, displayScore,
    // Economy
    coins, selectedSkinId, unlockedSkinIds, inventory, shopTab, setShopTab,
    earnedCoins, adMultiplierUsed, activeItems, adContinueCount,
    // Ads
    adsRemoved, watchAdCount, rewardedLoaded,
    // Daily bonus
    dailyBonusShow, setDailyBonusShow, dailyBonusAmount, loginStreak,
    // In-game UI
    hasShield, squishType, isHappy, showShieldBreak, slowCount, itemPopup,
    homeHappy,
    // Animated values
    heightAnim, widthAnim, fallAnim, popAnim, ringScaleAnim, ringOpacityAnim,
    comboAnim, wobbleAnim, shakeAnim, targetOpacityAnim, burstParticleAnim,
    shieldAnim, shieldBreakAnim, itemPopupAnim, screenFadeAnim,
    gameOverSlideAnim, gameOverSquishY, gameOverSquishX, stampAnim,
    statAnim0, statAnim1, statAnim2, idleBreathAnim, idleBounceAnim,
    titleEntryAnim, titleShimmerAnim, playPulseAnim, furinSwayAnim,
    homeTapAnim, homeTapScaleX, homeTapScaleY,
    bgColorAnim, comboFlashAnim, levelUpBannerY, levelUpBannerOpacity, levelUpFlashAnim,
    // Derived
    currentSkin, isDead, currentTarget, appBgColor,
    wobbleRotate, shakeX, targetRotate, idleScale, idleY,
    // Handlers
    startGame, goHome, continueFromAd, multiplyCoinsFromAd,
    buySkin, selectSkin, buyItem, toggleActiveItem, watchAdForCoins, buyIap,
    handleHomeTap, setGameState,
    panResponder,
    // Language
    lang, cycleLang,
  };
}
