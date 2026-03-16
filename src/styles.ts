import { StyleSheet } from 'react-native';
import { SCREEN_W, SCREEN_H } from './constants';

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', overflow: 'hidden' },
  blush: { position: 'absolute', top: '38%', width: 28, height: 18, borderRadius: 10 },
  burstRing: { position: 'absolute', width: 140, height: 140, borderRadius: 70, borderWidth: 12, top: -70, alignSelf: 'center', zIndex: 15 },
  frameLabel: { fontSize: 26, fontWeight: '900', opacity: 0.7, letterSpacing: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', zIndex: 100 },
  headsUpLayer: { position: 'absolute', top: 60, left: 0, right: 0, bottom: 0, alignItems: 'center', zIndex: 40 },

  // HUD
  hudTopBar: { flexDirection: 'row', gap: 15 },
  hudBadge: { backgroundColor: 'rgba(255,249,240,0.9)', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20, borderWidth: 2.5, alignItems: 'center', minWidth: 90, flexDirection: 'row', gap: 8, shadowColor: '#B0948A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10 },
  hudLabel: { fontSize: 18, fontWeight: '900' },
  hudValue: { fontSize: 24, fontWeight: '900', color: '#4A3F35' },
  activeItemBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 2, shadowColor: '#D4C4B0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5 },
  popupArea: { flex: 1, alignItems: 'center', paddingTop: 20 },
  comboBadge: { backgroundColor: 'rgba(255,249,240,0.95)', paddingHorizontal: 22, paddingVertical: 10, borderRadius: 20, borderWidth: 3, borderColor: '#D4A030', transform: [{ rotate: '-6deg' }], shadowColor: '#D4A030', shadowOpacity: 0.35, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12 },
  comboText: { fontSize: 20, fontWeight: '900', color: '#B88A20', letterSpacing: 2 },
  levelUpContainer: { marginTop: 20, backgroundColor: 'rgba(255,249,240,0.95)', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 22, borderWidth: 3, borderColor: '#7BA870', shadowColor: '#7BA870', shadowOpacity: 0.4, shadowOffset: { width: 0, height: 8 }, shadowRadius: 16 },
  levelUpText: { fontSize: 26, fontWeight: '900', color: '#5A8A4E', letterSpacing: 2 },

  // ─── HOME SCREEN ───
  homeScreen: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
  coinBar: { position: 'absolute', top: SCREEN_H * 0.06, right: 20, backgroundColor: 'rgba(255,249,240,0.9)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 2, borderColor: '#E0D0C0', shadowColor: '#B0948A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  coinText: { fontSize: 16, fontWeight: '900', color: '#4A3F35' },
  homeTopArea: { position: 'absolute', top: SCREEN_H * 0.08, alignItems: 'center' },
  topDeco: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  decoLine: { width: 40, height: 2, backgroundColor: '#E0D5C8', borderRadius: 1 },
  decoText: { fontSize: 20 },
  topDecoSub: { fontSize: 11, fontWeight: '600', color: '#C4B5A5', letterSpacing: 3, marginTop: 6 },

  homeTitleCard: {
    backgroundColor: '#FFF9F0', borderRadius: 28, paddingHorizontal: 36, paddingTop: 32, paddingBottom: 36,
    alignItems: 'center', width: '100%', maxWidth: 340, marginBottom: 24,
    borderWidth: 3, borderColor: '#E8D8C8',
    shadowColor: '#B0948A', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.25, shadowRadius: 30,
  },
  titleJapanese: { fontSize: 16, fontWeight: '700', color: '#C4B5A5', letterSpacing: 6, marginBottom: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  titleMochi: { fontSize: 54, fontWeight: '900', color: '#D4748E', letterSpacing: -1 },
  titleMochi2: { fontSize: 58, fontWeight: '900', color: '#7BA870', marginTop: -14, letterSpacing: -2 },

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
  highScoreCard: { backgroundColor: '#F5EDE0', borderRadius: 18, paddingHorizontal: 30, paddingVertical: 16, alignItems: 'center', borderWidth: 2, borderColor: '#E0D4C6' },
  highScoreLabel: { fontSize: 11, fontWeight: '800', color: '#C4B5A5', letterSpacing: 2 },
  highScoreRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  highScoreEmoji: { fontSize: 22 },
  highScoreNum: { fontSize: 36, fontWeight: '900', color: '#4A3F35' },

  itemSlotsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  itemSlot: { backgroundColor: 'rgba(255,249,240,0.9)', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 2, borderColor: '#E0D4C6', alignItems: 'center', gap: 2, shadowColor: '#B0948A', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6 },
  itemSlotActive: { borderColor: '#7BA870', backgroundColor: '#EEF6E6' },
  itemSlotCount: { fontSize: 10, fontWeight: '800', color: '#8B7E74' },

  playButton: {
    backgroundColor: '#C85070', paddingHorizontal: 72, paddingVertical: 22, borderRadius: 999,
    borderWidth: 4, borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#C85070', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.45, shadowRadius: 25,
  },
  playButtonText: { color: '#FFF', fontSize: 28, fontWeight: '900', letterSpacing: 6 },

  shopBtn: { backgroundColor: '#B8956A', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 999, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)', shadowColor: '#B8956A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 15 },
  shopBtnText: { color: '#FFF', fontSize: 18, fontWeight: '900', letterSpacing: 2 },

  // ─── SHOP SCREEN ───
  shopScreen: { flex: 1, width: '100%', paddingTop: SCREEN_H * 0.06 },
  shopHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  shopBackText: { fontSize: 16, fontWeight: '900', color: '#8B7E74' },
  shopCoins: { fontSize: 18, fontWeight: '900', color: '#4A3F35', backgroundColor: '#FFF9F0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 3, borderColor: '#F0E6D8', overflow: 'hidden' },
  shopTabs: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 16 },
  shopTab: { flex: 1, paddingVertical: 12, borderRadius: 18, backgroundColor: '#F0E8DC', alignItems: 'center', borderWidth: 2, borderColor: '#E0D4C6' },
  shopTabActive: { backgroundColor: '#FFF9F0', borderColor: '#C85070' },
  shopTabText: { fontSize: 14, fontWeight: '900', color: '#B0A090', letterSpacing: 2 },
  shopTabTextActive: { color: '#C85070' },
  shopContent: { flex: 1, paddingHorizontal: 20 },
  shopContentInner: { paddingBottom: 40 },

  skinGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  skinCard: { width: (SCREEN_W - 52) / 2, backgroundColor: '#FFF9F0', borderRadius: 20, padding: 14, alignItems: 'center', borderWidth: 2, borderColor: '#E8D8C8', gap: 8, shadowColor: '#B0948A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  skinCardSelected: { borderColor: '#7BA870', borderWidth: 3 },
  skinPreview: { width: 76, height: 76, borderRadius: 38, borderWidth: 3, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', shadowColor: '#B0948A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
  skinPreviewBlush: { position: 'absolute', top: '38%', width: 14, height: 9, borderRadius: 5, opacity: 0.6 },
  skinPreviewEyes: { flexDirection: 'row', gap: 12, marginTop: -4 },
  skinPreviewEye: { width: 7, height: 10, backgroundColor: '#4A3F35', borderRadius: 4 },
  skinPreviewMouth: { fontSize: 9, color: '#C4907A', fontWeight: '600', marginTop: -2 },
  skinName: { fontSize: 12, fontWeight: '800', color: '#4A3F35', textAlign: 'center' },

  itemList: { gap: 12 },
  itemCard: { flexDirection: 'row', backgroundColor: '#FFF9F0', borderRadius: 20, padding: 16, alignItems: 'center', borderWidth: 3, borderColor: '#F0E6D8', gap: 12 },
  itemIcon: { fontSize: 32 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '900', color: '#4A3F35' },
  itemDesc: { fontSize: 11, fontWeight: '700', color: '#8B7E74', marginTop: 2 },
  itemOwned: { fontSize: 11, fontWeight: '800', color: '#C4B5A5', marginTop: 4 },

  selectedBadge: { backgroundColor: '#7BA870', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12 },
  selectedBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  selectBtn: { backgroundColor: '#F5EDE0', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, borderWidth: 2, borderColor: '#E8DDD0' },
  selectBtnText: { color: '#8B7E74', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  buyBtn: { backgroundColor: '#C85070', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14 },
  buyBtnDisabled: { backgroundColor: '#E8DDD0' },
  buyBtnText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  buyBtnTextDisabled: { color: '#C4B5A5' },

  // ─── GAME OVER ───
  gameOverScreen: { flex: 1, width: '100%', backgroundColor: 'rgba(60,40,35,0.4)', paddingHorizontal: 30 },
  gameOverCard: {
    backgroundColor: '#FFF9F0', borderRadius: 28, paddingHorizontal: 28, paddingVertical: 24,
    alignItems: 'center', width: '100%', maxWidth: 340, marginBottom: 16,
    borderWidth: 3, borderColor: '#E8D8C8',
    shadowColor: '#8A6A5A', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.3, shadowRadius: 30,
  },
  gameOverTitle: { fontSize: 38, fontWeight: '900', color: '#C85070', letterSpacing: 1 },
  scoreArea: { marginTop: 12, alignItems: 'center' },
  scoreLabel: { fontSize: 14, fontWeight: '800', color: '#8B7E74', letterSpacing: 2 },
  scoreNum: { fontSize: 48, fontWeight: '900', color: '#4A3F35', marginVertical: 4 },
  bestText: { fontSize: 14, fontWeight: '800', color: '#C4B5A5', marginTop: 4 },
  comboResultText: { fontSize: 14, fontWeight: '800', color: '#F0C75E', marginTop: 8 },
  earnedCoinsText: { fontSize: 20, fontWeight: '900', color: '#F0C75E', marginTop: 12 },

  retryButton: {
    backgroundColor: '#C85070', paddingHorizontal: 64, paddingVertical: 22, borderRadius: 999,
    borderWidth: 4, borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#C85070', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.45, shadowRadius: 25,
  },
  retryButtonText: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: 4 },
  homeBtn: { paddingHorizontal: 40, paddingVertical: 12, borderRadius: 999, borderWidth: 3, borderColor: '#D4C4B0' },
  homeBtnText: { color: '#8B7E74', fontSize: 16, fontWeight: '900', letterSpacing: 2 },

  adContinueBtn: { backgroundColor: '#7BA870', paddingHorizontal: 48, paddingVertical: 16, borderRadius: 999, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)', shadowColor: '#7BA870', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20, alignItems: 'center' },
  adContinueBtnText: { color: '#FFF', fontSize: 22, fontWeight: '900', letterSpacing: 2 },
  adContinueSubText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '800', marginTop: 2, letterSpacing: 1 },

  // ─── DAILY BONUS ───
  dailyBonusOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  dailyBonusCard: { backgroundColor: '#FFF9F0', borderRadius: 28, paddingHorizontal: 40, paddingVertical: 36, alignItems: 'center', width: '80%', maxWidth: 320, borderWidth: 3, borderColor: '#E8D8C8', shadowColor: '#8A6A5A', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.3, shadowRadius: 30 },
  dailyBonusBtn: { backgroundColor: '#C85070', paddingHorizontal: 48, paddingVertical: 16, borderRadius: 999, shadowColor: '#C85070', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12 },
  dailyBonusBtnText: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
});

export default styles;
