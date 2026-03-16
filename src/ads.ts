import mobileAds, {
  InterstitialAd,
  RewardedAd,
  TestIds,
} from 'react-native-google-mobile-ads';

const interstitialAdUnitId = TestIds.INTERSTITIAL;
const rewardedAdUnitId = TestIds.REWARDED;
export const bannerAdUnitId = TestIds.ADAPTIVE_BANNER;

export const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

export const rewarded = RewardedAd.createForAdRequest(rewardedAdUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

mobileAds().initialize().then(adapterStatuses => {
  console.log('AdMob Initialized:', adapterStatuses);
}).catch(e => console.log('AdMob init failed:', e));
