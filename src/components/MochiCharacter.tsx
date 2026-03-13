import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// ─── Skin-specific patterns ───
export const MochiPattern = ({ skinId, isDead }: { skinId: string; isDead: boolean }) => {
  if (isDead) return null;
  switch (skinId) {
    case 'matcha':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {[{ t: 48, l: 18, s: 5 }, { t: 52, l: 35, s: 3 }, { t: 55, l: 60, s: 4 }, { t: 50, l: 75, s: 3 }, { t: 58, l: 25, s: 4 }, { t: 56, l: 50, s: 3 }, { t: 53, l: 70, s: 5 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: p.s, height: p.s, borderRadius: p.s / 2, backgroundColor: 'rgba(100,160,80,0.2)' }} />
          ))}
          <View style={{ position: 'absolute', top: '58%', left: '30%', width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: 'rgba(90,150,70,0.15)', borderRightColor: 'transparent', borderBottomColor: 'transparent', transform: [{ rotate: '-30deg' }] }} />
          <View style={{ position: 'absolute', top: '62%', left: '38%', width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: 'rgba(90,150,70,0.12)', borderRightColor: 'transparent', borderBottomColor: 'transparent', transform: [{ rotate: '60deg' }] }} />
          <View style={{ position: 'absolute', top: '20%', right: '18%', width: 16, height: 10, borderRadius: 8, backgroundColor: 'rgba(100,160,80,0.18)', transform: [{ rotate: '-35deg' }] }}>
            <View style={{ position: 'absolute', top: 4.5, left: 2, right: 2, height: 1, backgroundColor: 'rgba(80,130,60,0.15)', borderRadius: 1 }} />
          </View>
        </View>
      );
    case 'sakura':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={{ position: 'absolute', bottom: '8%', left: '5%', width: '50%', height: 20, backgroundColor: 'rgba(140,180,120,0.18)', borderTopLeftRadius: 20, borderTopRightRadius: 40, borderBottomRightRadius: 10, transform: [{ rotate: '-8deg' }] }}>
            <View style={{ position: 'absolute', top: 9, left: 8, right: 8, height: 1.5, backgroundColor: 'rgba(120,160,100,0.15)', borderRadius: 1 }} />
          </View>
          {[{ t: 25, l: 20, r: '-15deg', s: 1 }, { t: 35, l: 60, r: '30deg', s: 0.8 }, { t: 55, l: 15, r: '-40deg', s: 0.7 }, { t: 48, l: 65, r: '20deg', s: 0.9 }, { t: 68, l: 40, r: '-25deg', s: 0.6 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, transform: [{ rotate: p.r }, { scale: p.s }] }}>
              {[0, 72, 144, 216, 288].map((deg, j) => (
                <View key={j} style={{ position: 'absolute', width: 6, height: 8, borderRadius: 3, backgroundColor: `rgba(240,150,170,${0.2 - i * 0.02})`, transform: [{ rotate: `${deg}deg` }, { translateY: -4 }], transformOrigin: '3px 8px' }} />
              ))}
              <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(240,200,100,0.25)' }} />
            </View>
          ))}
        </View>
      );
    case 'yomogi':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {[{ t: 30, l: 15, r: '-20deg' }, { t: 45, l: 65, r: '15deg' }, { t: 60, l: 30, r: '-35deg' }, { t: 70, l: 55, r: '25deg' }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, transform: [{ rotate: p.r }] }}>
              <View style={{ width: 12, height: 7, borderRadius: 6, backgroundColor: 'rgba(90,140,70,0.18)' }}>
                <View style={{ position: 'absolute', top: 3, left: 2, right: 2, height: 1, backgroundColor: 'rgba(70,120,50,0.12)', borderRadius: 1 }} />
              </View>
              <View style={{ width: 8, height: 5, borderRadius: 4, backgroundColor: 'rgba(90,140,70,0.14)', marginTop: -2, marginLeft: 2, transform: [{ rotate: '30deg' }] }} />
            </View>
          ))}
          {[{ t: 35, l: 40, s: 4 }, { t: 42, l: 22, s: 3 }, { t: 50, l: 55, s: 5 }, { t: 55, l: 75, s: 3 }, { t: 65, l: 18, s: 4 }, { t: 48, l: 80, s: 3 }, { t: 72, l: 42, s: 4 }, { t: 38, l: 70, s: 3 }].map((p, i) => (
            <View key={`s${i}`} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: p.s, height: p.s, borderRadius: p.s / 2, backgroundColor: `rgba(80,130,60,${0.12 + (i % 3) * 0.04})` }} />
          ))}
        </View>
      );
    case 'anko':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={{ position: 'absolute', top: '38%', left: '5%', right: '5%', height: 30, overflow: 'hidden' }}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 18, backgroundColor: 'rgba(120,60,40,0.22)', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }} />
            <View style={{ position: 'absolute', top: 12, left: '12%', width: 10, height: 14, backgroundColor: 'rgba(120,60,40,0.2)', borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }} />
            <View style={{ position: 'absolute', top: 14, left: '40%', width: 7, height: 10, backgroundColor: 'rgba(120,60,40,0.18)', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }} />
            <View style={{ position: 'absolute', top: 10, left: '65%', width: 12, height: 16, backgroundColor: 'rgba(120,60,40,0.2)', borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }} />
            <View style={{ position: 'absolute', top: 13, left: '85%', width: 8, height: 8, backgroundColor: 'rgba(120,60,40,0.16)', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }} />
          </View>
          {[{ t: 60, l: 20 }, { t: 65, l: 50 }, { t: 62, l: 72 }, { t: 70, l: 35 }, { t: 68, l: 62 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: 6, height: 5, borderRadius: 3, backgroundColor: 'rgba(140,70,50,0.18)', transform: [{ rotate: `${i * 30}deg` }] }} />
          ))}
          <View style={{ position: 'absolute', top: '40%', left: '25%', width: 20, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.12)' }} />
        </View>
      );
    case 'yuzu':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={{ position: 'absolute', top: '50%', left: '25%', width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: 'rgba(220,180,60,0.2)', backgroundColor: 'rgba(255,240,150,0.08)', justifyContent: 'center', alignItems: 'center' }}>
            {[0, 45, 90, 135].map((deg, i) => (
              <View key={i} style={{ position: 'absolute', width: 18, height: 1.5, backgroundColor: 'rgba(220,180,60,0.15)', borderRadius: 1, transform: [{ rotate: `${deg}deg` }] }} />
            ))}
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(240,200,60,0.15)' }} />
          </View>
          <View style={{ position: 'absolute', top: '60%', right: '20%', width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: 'rgba(220,180,60,0.15)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: 8, height: 1, backgroundColor: 'rgba(220,180,60,0.12)', position: 'absolute' }} />
            <View style={{ width: 1, height: 8, backgroundColor: 'rgba(220,180,60,0.12)', position: 'absolute' }} />
          </View>
          <View style={{ position: 'absolute', top: '28%', right: '22%', width: 14, height: 9, borderRadius: 7, backgroundColor: 'rgba(100,160,70,0.18)', transform: [{ rotate: '25deg' }] }}>
            <View style={{ position: 'absolute', top: 4, left: 2, right: 2, height: 1, backgroundColor: 'rgba(80,130,50,0.12)', borderRadius: 1 }} />
          </View>
          {[{ t: 35, l: 18 }, { t: 42, l: 55 }, { t: 70, l: 30 }, { t: 45, l: 78 }, { t: 75, l: 60 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(240,200,60,0.2)' }} />
          ))}
        </View>
      );
    default:
      return null;
  }
};

// ─── Kawaii Mochi Face ───
export const MochiDrawnFace = ({ isDead, squishType, isHappy }: { isDead: boolean; squishType: 'tall' | 'wide' | 'normal'; isHappy: boolean }) => {
  if (isDead) {
    return (
      <View style={{ position: 'absolute', top: '30%', alignSelf: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 20 }}>
          {[0, 1].map(i => (
            <View key={i} style={{ width: 28, height: 28, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ width: 22, height: 5, backgroundColor: '#8B7E74', transform: [{ rotate: '45deg' }], position: 'absolute', borderRadius: 3 }} />
              <View style={{ width: 22, height: 5, backgroundColor: '#8B7E74', transform: [{ rotate: '-45deg' }], position: 'absolute', borderRadius: 3 }} />
            </View>
          ))}
        </View>
        <Text style={{ fontSize: 18, color: '#8B7E74', marginTop: 2, fontWeight: '700' }}>～</Text>
      </View>
    );
  }
  if (isHappy) {
    const gap = squishType === 'wide' ? 40 : 24;
    return (
      <View style={{ position: 'absolute', top: squishType === 'tall' ? '22%' : '30%', alignSelf: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap, alignItems: 'center' }}>
          {[0, 1].map(i => (
            <View key={i} style={{ width: 20, height: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, backgroundColor: '#4A3F35', overflow: 'hidden' }}>
              <View style={{ position: 'absolute', top: -8, left: 0, right: 0, height: 10, backgroundColor: '#4A3F35', borderRadius: 10 }} />
            </View>
          ))}
        </View>
        <Text style={{ fontSize: squishType === 'wide' ? 16 : 18, color: '#C4907A', marginTop: squishType === 'tall' ? 4 : 0, fontWeight: '600' }}>▽</Text>
      </View>
    );
  }
  const eyeH = squishType === 'tall' ? 26 : squishType === 'wide' ? 12 : 20;
  const eyeW = squishType === 'wide' ? 20 : 16;
  const eyeGap = squishType === 'wide' ? 40 : 24;
  return (
    <View style={{ position: 'absolute', top: squishType === 'tall' ? '22%' : '30%', alignSelf: 'center', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', gap: eyeGap, alignItems: 'center' }}>
        {[0, 1].map(i => (
          <View key={i} style={{ width: eyeW, height: eyeH, backgroundColor: '#4A3F35', borderRadius: eyeW / 2 }}>
            <View style={{ position: 'absolute', top: 3, left: 3, width: 6, height: 6, backgroundColor: '#FFF', borderRadius: 3 }} />
            <View style={{ position: 'absolute', bottom: 4, right: 3, width: 3, height: 3, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 2 }} />
          </View>
        ))}
      </View>
      <Text style={{ fontSize: squishType === 'wide' ? 14 : 16, color: '#C4907A', marginTop: squishType === 'tall' ? 6 : 2, fontWeight: '600' }}>ω</Text>
    </View>
  );
};
