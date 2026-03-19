import mobileAds, {
  MaxAdContentRating,
  TestIds,
} from 'react-native-google-mobile-ads';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

// TODO: Replace these TestIds with real AdMob Unit IDs for release
export const interstitialAdUnitId = TestIds.INTERSTITIAL;
export const rewardedAdUnitId = TestIds.REWARDED;
export const bannerAdUnitId = TestIds.ADAPTIVE_BANNER;

export async function initializeAds() {
  const { status } = await requestTrackingPermissionsAsync();
  const nonPersonalized = status !== 'granted';

  try {
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.G,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    });
    
    const adapterStatuses = await mobileAds().initialize();
    console.log('AdMob Initialized:', adapterStatuses);
  } catch (e) {
    console.log('AdMob init failed:', e);
  }

  return nonPersonalized;
}
