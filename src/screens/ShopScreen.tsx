import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { bannerAdUnitId } from '../ads';
import { SKINS, GAME_ITEMS, IAP_BUNDLES, IAP_SKUS } from '../constants';
import styles from '../styles';
import { MochiPattern } from '../components/MochiCharacter';
import { t, type Lang } from '../i18n';
import type { Inventory, MochiSkin } from '../types';

type Props = {
  coins: number;
  shopTab: 'skins' | 'items' | 'coins';
  inventory: Inventory;
  selectedSkinId: string;
  unlockedSkinIds: string[];
  adsRemoved: boolean;
  watchAdCount: number;
  lang: Lang;
  setShopTab: (tab: 'skins' | 'items' | 'coins') => void;
  onBack: () => void;
  onBuySkin: (skin: MochiSkin) => void;
  onSelectSkin: (id: string) => void;
  onBuyItem: (item: typeof GAME_ITEMS[0]) => void;
  onWatchAd: () => void;
  onBuyIap: (sku: string) => void;
};

export const ShopScreen: React.FC<Props> = ({
  coins, shopTab, inventory, selectedSkinId, unlockedSkinIds,
  adsRemoved, watchAdCount, lang,
  setShopTab, onBack, onBuySkin, onSelectSkin, onBuyItem, onWatchAd, onBuyIap,
}) => (
  <View style={styles.shopScreen}>
    {/* Header */}
    <View style={styles.shopHeader}>
      <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
        <Text style={styles.shopBackText}>{t('back', lang) as string}</Text>
      </TouchableOpacity>
      <Text style={styles.shopCoins}>🍡 {coins}</Text>
    </View>

    {/* Tabs */}
    <View style={styles.shopTabs}>
      {(['skins', 'items', 'coins'] as const).map(tab => (
        <TouchableOpacity
          key={tab}
          style={[styles.shopTab, shopTab === tab && styles.shopTabActive]}
          onPress={() => setShopTab(tab)}
          activeOpacity={0.7}
        >
          <Text style={[styles.shopTabText, shopTab === tab && styles.shopTabTextActive]}>
            {tab === 'coins' ? t('buyCoins', lang) as string : tab === 'skins' ? t('skins', lang) as string : t('items', lang) as string}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    {/* Content */}
    <ScrollView style={styles.shopContent} contentContainerStyle={styles.shopContentInner} showsVerticalScrollIndicator={false}>
      {shopTab === 'coins' && (
        <View style={styles.itemList}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#C4B5A5', letterSpacing: 2, textAlign: 'center', marginBottom: 16 }}>{t('coinsHeader', lang) as string}</Text>
          {IAP_BUNDLES.map(bundle => (
            <TouchableOpacity
              key={bundle.sku}
              style={[styles.itemCard, bundle.sku === IAP_SKUS.removeAds && { borderColor: '#C85070', borderWidth: 2 }]}
              onPress={() => onBuyIap(bundle.sku)}
              activeOpacity={0.8}
              disabled={bundle.sku === IAP_SKUS.removeAds && adsRemoved}
            >
              <Text style={styles.itemIcon}>{bundle.sku === IAP_SKUS.removeAds ? '🚫' : '🍡'}</Text>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{bundle.label}</Text>
                {bundle.sku === IAP_SKUS.removeAds && (
                  <Text style={styles.itemDesc}>{t('removeAdsDesc', lang) as string}</Text>
                )}
                {adsRemoved && bundle.sku === IAP_SKUS.removeAds && (
                  <Text style={[styles.itemOwned, { color: '#7BA870' }]}>{t('purchased', lang) as string}</Text>
                )}
              </View>
              <View style={[styles.buyBtn, { backgroundColor: bundle.sku === IAP_SKUS.removeAds ? '#C85070' : '#F0C75E', borderColor: bundle.sku === IAP_SKUS.removeAds ? '#A03050' : '#D4A030' }]}>
                <Text style={[styles.buyBtnText, { color: bundle.sku === IAP_SKUS.removeAds ? '#fff' : '#4A3F35' }]}>{bundle.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <Text style={{ fontSize: 11, color: '#C4B5A5', textAlign: 'center', marginTop: 12, lineHeight: 16 }}>
            {t('iapDisclaimer', lang) as string}
          </Text>
        </View>
      )}

      {shopTab === 'skins' && (
        <View style={styles.skinGrid}>
          {SKINS.map(skin => {
            const owned = unlockedSkinIds.includes(skin.id);
            const selected = selectedSkinId === skin.id;
            const canBuy = coins >= skin.price;
            return (
              <View key={skin.id} style={[styles.skinCard, selected && styles.skinCardSelected]}>
                <View style={[styles.skinPreview, { backgroundColor: skin.body, borderColor: skin.border }]}>
                  <MochiPattern skinId={skin.id} isDead={false} />
                  <View style={[styles.skinPreviewBlush, { backgroundColor: skin.blush, left: 10 }]} />
                  <View style={[styles.skinPreviewBlush, { backgroundColor: skin.blush, right: 10 }]} />
                  <View style={styles.skinPreviewEyes}>
                    <View style={styles.skinPreviewEye} />
                    <View style={styles.skinPreviewEye} />
                  </View>
                  <Text style={styles.skinPreviewMouth}>ω</Text>
                </View>
                <Text style={styles.skinName}>{skin.name}</Text>
                {selected ? (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>{t('using', lang) as string}</Text>
                  </View>
                ) : owned ? (
                  <TouchableOpacity style={styles.selectBtn} onPress={() => onSelectSkin(skin.id)} activeOpacity={0.7}>
                    <Text style={styles.selectBtnText}>{t('select', lang) as string}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.buyBtn, !canBuy && styles.buyBtnDisabled]}
                    onPress={() => onBuySkin(skin)}
                    activeOpacity={canBuy ? 0.7 : 1}
                  >
                    <Text style={[styles.buyBtnText, !canBuy && styles.buyBtnTextDisabled]}>🍡 {skin.price}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      )}

      {shopTab === 'items' && (
        <View style={styles.itemList}>
          {GAME_ITEMS.map(item => {
            const count = inventory[item.id];
            const canBuy = coins >= item.price;
            return (
              <View key={item.id} style={styles.itemCard}>
                <Text style={styles.itemIcon}>{item.icon}</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{t(`item_${item.id}_name` as any, lang) as string}</Text>
                  <Text style={styles.itemDesc}>{t(`item_${item.id}_desc` as any, lang) as string}</Text>
                  <Text style={styles.itemOwned}>{(t('owned', lang) as (n: number) => string)(count)}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.buyBtn, !canBuy && styles.buyBtnDisabled]}
                  onPress={() => onBuyItem(item)}
                  activeOpacity={canBuy ? 0.7 : 1}
                >
                  <Text style={[styles.buyBtnText, !canBuy && styles.buyBtnTextDisabled]}>🍡 {item.price}</Text>
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Watch Ad for Coins */}
          {!adsRemoved && (
            <TouchableOpacity
              style={[styles.itemCard, {
                backgroundColor: watchAdCount >= 3 ? '#F5F0EB' : '#FFF8E8',
                borderColor: '#F0C75E', borderWidth: 2, borderRadius: 16,
                opacity: watchAdCount >= 3 ? 0.5 : 1,
              }]}
              onPress={onWatchAd}
              activeOpacity={watchAdCount >= 3 ? 1 : 0.7}
              disabled={watchAdCount >= 3}
            >
              <Text style={styles.itemIcon}>🎬</Text>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{t('watchAd', lang) as string}</Text>
                <Text style={styles.itemDesc}>{t('watchAdReward', lang) as string}</Text>
                <Text style={styles.itemOwned}>{watchAdCount >= 3 ? t('watchAdLimit', lang) as string : (t('watchAdToday', lang) as (n: number) => string)(watchAdCount)}</Text>
              </View>
              <View style={[styles.buyBtn, { backgroundColor: watchAdCount >= 3 ? '#D4C4B0' : '#F0C75E', borderColor: '#D4A030' }]}>
                <Text style={[styles.buyBtnText, { color: '#4A3F35' }]}>{t('free', lang) as string}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>

    {/* Banner Ad */}
    {!adsRemoved && (
      <View style={{ alignItems: 'center', paddingBottom: 8 }}>
        <BannerAd unitId={bannerAdUnitId} size={BannerAdSize.BANNER} />
      </View>
    )}
  </View>
);
