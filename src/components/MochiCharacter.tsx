import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// ─── Interior patterns (inside overflow:hidden body) ───
export const MochiPattern = ({ skinId, isDead }: { skinId: string; isDead: boolean }) => {
  if (isDead) return null;
  switch (skinId) {
    case 'classic':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Shine */}
          <View style={{ position: 'absolute', top: '14%', left: '10%', width: 24, height: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.3)', transform: [{ rotate: '-18deg' }] }} />
        </View>
      );
    case 'matcha':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Matcha foam circle */}
          <View style={{ position: 'absolute', top: '36%', left: '18%', width: 48, height: 42, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.28)' }} />
          {/* Foam swirl */}
          <View style={{ position: 'absolute', top: '38%', left: '25%', width: 32, height: 32, borderRadius: 16, borderWidth: 3, borderColor: 'rgba(40,110,30,0.45)', borderRightColor: 'transparent', borderBottomColor: 'transparent', transform: [{ rotate: '-20deg' }] }} />
          <View style={{ position: 'absolute', top: '44%', left: '34%', width: 18, height: 18, borderRadius: 9, borderWidth: 2.5, borderColor: 'rgba(40,110,30,0.38)', borderRightColor: 'transparent', borderBottomColor: 'transparent', transform: [{ rotate: '50deg' }] }} />
          {/* Tea powder dots */}
          {[{ t: 62, l: 16, s: 8 }, { t: 66, l: 38, s: 6 }, { t: 70, l: 60, s: 7 }, { t: 74, l: 28, s: 5 }, { t: 72, l: 72, s: 6 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: p.s, height: p.s, borderRadius: p.s / 2, backgroundColor: 'rgba(40,110,30,0.38)' }} />
          ))}
        </View>
      );
    case 'sakura':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Soft pink inner wash */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(248,138,168,0.1)' }} />
          {/* Scattered petals inside */}
          {[{ t: 30, l: 8, r: '-18deg', op: 0.52 }, { t: 44, l: 60, r: '28deg', op: 0.47 }, { t: 58, l: 12, r: '-38deg', op: 0.42 }, { t: 52, l: 66, r: '16deg', op: 0.5 }, { t: 66, l: 36, r: '-12deg', op: 0.4 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, transform: [{ rotate: p.r }] }}>
              {[0, 72, 144, 216, 288].map((deg, j) => (
                <View key={j} style={{ position: 'absolute', width: 8, height: 10, borderRadius: 4, backgroundColor: `rgba(245,130,163,${p.op})`, transform: [{ rotate: `${deg}deg` }, { translateY: -6 }], transformOrigin: '4px 10px' as any }} />
              ))}
              <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: `rgba(255,205,65,${p.op + 0.15})` }} />
            </View>
          ))}
          {/* Leaf */}
          <View style={{ position: 'absolute', bottom: '6%', left: '5%', width: '40%', height: 15, backgroundColor: 'rgba(105,168,85,0.38)', borderTopLeftRadius: 14, borderTopRightRadius: 30, borderBottomRightRadius: 7, transform: [{ rotate: '-6deg' }] }} />
        </View>
      );
    case 'ichigo':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Red wash bottom */}
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '58%', backgroundColor: 'rgba(195,35,65,0.13)', borderTopLeftRadius: 90, borderTopRightRadius: 90 }} />
          {/* Seeds */}
          {[{ t: 26, l: 16 }, { t: 22, l: 52 }, { t: 40, l: 70 }, { t: 50, l: 26 }, { t: 36, l: 44 }, { t: 60, l: 14 }, { t: 55, l: 60 }, { t: 68, l: 36 }, { t: 30, l: 74 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: 5, height: 7, borderRadius: 2.5, backgroundColor: 'rgba(135,18,32,0.58)', transform: [{ rotate: `${i * 22}deg` }] }} />
          ))}
          {/* Shine */}
          <View style={{ position: 'absolute', top: '15%', left: '13%', width: 24, height: 15, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.42)', transform: [{ rotate: '-20deg' }] }} />
        </View>
      );
    case 'kogeme':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Burnt top */}
          <View style={{ position: 'absolute', top: 0, left: '5%', right: '5%', height: '38%', backgroundColor: 'rgba(138,78,4,0.34)', borderBottomLeftRadius: 70, borderBottomRightRadius: 70 }} />
          {/* Caramel diamond spots */}
          {[{ t: 4, l: 16, s: 17 }, { t: 8, l: 50, s: 13 }, { t: 2, l: 34, s: 11 }, { t: 14, l: 68, s: 14 }, { t: 12, l: 8, s: 12 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: p.s, height: p.s, backgroundColor: `rgba(148,78,4,${0.38 + (i % 3) * 0.1})`, transform: [{ rotate: '45deg' }] }} />
          ))}
          {/* Caramel drips */}
          <View style={{ position: 'absolute', top: '30%', left: '20%', width: 7, height: 30, borderRadius: 3.5, backgroundColor: 'rgba(152,84,6,0.48)' }}>
            <View style={{ position: 'absolute', bottom: -7, left: -5, width: 17, height: 17, borderRadius: 8.5, backgroundColor: 'rgba(152,84,6,0.4)' }} />
          </View>
          <View style={{ position: 'absolute', top: '26%', left: '58%', width: 6, height: 22, borderRadius: 3, backgroundColor: 'rgba(152,84,6,0.42)' }}>
            <View style={{ position: 'absolute', bottom: -6, left: -4, width: 14, height: 14, borderRadius: 7, backgroundColor: 'rgba(152,84,6,0.34)' }} />
          </View>
        </View>
      );
    case 'anko':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Dark anko fill */}
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '52%', backgroundColor: 'rgba(52,14,6,0.2)', borderTopLeftRadius: 65, borderTopRightRadius: 65 }} />
          {/* Seam */}
          <View style={{ position: 'absolute', top: '40%', left: '5%', right: '5%', height: 5, backgroundColor: 'rgba(52,14,6,0.52)', borderRadius: 2.5 }} />
          {/* Thick sauce drips */}
          <View style={{ position: 'absolute', top: '36%', left: '12%', width: 10, height: 32, borderRadius: 5, backgroundColor: 'rgba(52,14,6,0.54)' }}>
            <View style={{ position: 'absolute', bottom: -8, left: -6, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(52,14,6,0.44)' }} />
          </View>
          <View style={{ position: 'absolute', top: '32%', left: '47%', width: 8, height: 24, borderRadius: 4, backgroundColor: 'rgba(52,14,6,0.48)' }}>
            <View style={{ position: 'absolute', bottom: -6, left: -5, width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(52,14,6,0.38)' }} />
          </View>
          <View style={{ position: 'absolute', top: '38%', left: '67%', width: 7, height: 19, borderRadius: 3.5, backgroundColor: 'rgba(52,14,6,0.44)' }}>
            <View style={{ position: 'absolute', bottom: -5, left: -4, width: 15, height: 15, borderRadius: 7.5, backgroundColor: 'rgba(52,14,6,0.35)' }} />
          </View>
          {/* Anko beans */}
          {[{ t: 55, l: 16 }, { t: 62, l: 36 }, { t: 58, l: 58 }, { t: 68, l: 24 }, { t: 65, l: 53 }, { t: 73, l: 40 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: 9, height: 7, borderRadius: 4.5, backgroundColor: 'rgba(52,14,6,0.36)' }} />
          ))}
          {/* Drip highlight */}
          <View style={{ position: 'absolute', top: '37%', left: '13%', width: 4, height: 22, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.24)' }} />
        </View>
      );
    case 'sumi':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Ember glow center */}
          <View style={{ position: 'absolute', bottom: '8%', left: '16%', right: '16%', height: '42%', backgroundColor: 'rgba(215,68,14,0.18)', borderRadius: 55 }} />
          {/* Crack lines */}
          <View style={{ position: 'absolute', top: '20%', left: '10%', width: 50, height: 2.5, backgroundColor: 'rgba(220,200,188,0.45)', transform: [{ rotate: '9deg' }] }} />
          <View style={{ position: 'absolute', top: '31%', left: '46%', width: 32, height: 2, backgroundColor: 'rgba(220,200,188,0.38)', transform: [{ rotate: '-34deg' }] }} />
          <View style={{ position: 'absolute', top: '54%', left: '14%', width: 26, height: 1.5, backgroundColor: 'rgba(220,200,188,0.3)', transform: [{ rotate: '16deg' }] }} />
          {/* Ember diamonds */}
          {[{ t: 54, l: 12 }, { t: 61, l: 46 }, { t: 57, l: 67 }, { t: 67, l: 26 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: 12, height: 12, backgroundColor: 'rgba(245,88,18,0.65)', transform: [{ rotate: '45deg' }] }} />
          ))}
          {/* Ash specks */}
          {[{ t: 23, l: 26 }, { t: 37, l: 62 }, { t: 47, l: 18 }, { t: 33, l: 72 }, { t: 59, l: 42 }, { t: 29, l: 46 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: 5, height: 5, borderRadius: 2.5, backgroundColor: 'rgba(228,213,202,0.44)' }} />
          ))}
          {/* Ember peek at top */}
          <View style={{ position: 'absolute', top: '-8%', left: '32%', width: 22, height: 12, borderRadius: 11, backgroundColor: 'rgba(245,75,14,0.34)', transform: [{ rotate: '-5deg' }] }} />
        </View>
      );
    case 'yuzu':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Yellow glow */}
          <View style={{ position: 'absolute', top: '26%', left: '10%', right: '10%', height: '52%', backgroundColor: 'rgba(240,198,18,0.2)', borderRadius: 55 }} />
          {/* Big citrus slice */}
          <View style={{ position: 'absolute', top: '38%', left: '14%', width: 42, height: 42, borderRadius: 21, borderWidth: 3, borderColor: 'rgba(188,148,12,0.52)', backgroundColor: 'rgba(255,238,95,0.24)', justifyContent: 'center', alignItems: 'center' }}>
            {[0, 45, 90, 135].map((deg, i) => (
              <View key={i} style={{ position: 'absolute', width: 26, height: 2.5, backgroundColor: 'rgba(188,148,12,0.45)', borderRadius: 1.5, transform: [{ rotate: `${deg}deg` }] }} />
            ))}
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(238,198,18,0.45)' }} />
          </View>
          {/* Star asterisk */}
          {[0, 60, 120].map((deg, i) => (
            <View key={i} style={{ position: 'absolute', top: '56%', right: '8%', width: 22, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(188,148,12,0.42)', transform: [{ rotate: `${deg}deg` }] }} />
          ))}
          {/* Zest dots */}
          {[{ t: 26, l: 12 }, { t: 34, l: 55 }, { t: 62, l: 20 }, { t: 40, l: 74 }, { t: 70, l: 56 }, { t: 23, l: 64 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(208,168,12,0.45)' }} />
          ))}
        </View>
      );
    default:
      return null;
  }
};

// ─── Overflow decorations (rendered OUTSIDE overflow:hidden body) ───
export const MochiDecoration = ({ skinId, isDead }: { skinId: string; isDead: boolean }) => {
  if (isDead) return null;
  switch (skinId) {
    case 'classic':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Pink bow - left wing */}
          <View style={{ position: 'absolute', top: '-32%', left: '6%', width: 28, height: 19, borderRadius: 14, backgroundColor: '#E06882', transform: [{ rotate: '-28deg' }] }} />
          <View style={{ position: 'absolute', top: '-35%', left: '11%', width: 19, height: 13, borderRadius: 9, backgroundColor: '#F090A8', transform: [{ rotate: '-28deg' }] }} />
          {/* Right wing */}
          <View style={{ position: 'absolute', top: '-32%', right: '6%', width: 28, height: 19, borderRadius: 14, backgroundColor: '#E06882', transform: [{ rotate: '28deg' }] }} />
          <View style={{ position: 'absolute', top: '-35%', right: '11%', width: 19, height: 13, borderRadius: 9, backgroundColor: '#F090A8', transform: [{ rotate: '28deg' }] }} />
          {/* Bow center knot */}
          <View style={{ position: 'absolute', top: '-22%', left: '41%', width: 16, height: 16, borderRadius: 8, backgroundColor: '#C85070' }} />
          {/* Bow tails */}
          <View style={{ position: 'absolute', top: '-12%', left: '34%', width: 10, height: 17, borderRadius: 5, backgroundColor: '#E06882', transform: [{ rotate: '-22deg' }] }} />
          <View style={{ position: 'absolute', top: '-12%', right: '34%', width: 10, height: 17, borderRadius: 5, backgroundColor: '#E06882', transform: [{ rotate: '22deg' }] }} />
        </View>
      );
    case 'matcha':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Bamboo leaves sticking out */}
          <View style={{ position: 'absolute', top: '-34%', left: '18%', width: 15, height: 34, borderRadius: 7, backgroundColor: '#2E9038', transform: [{ rotate: '-38deg' }] }}>
            <View style={{ position: 'absolute', top: 8, left: 2, right: 2, height: 2, backgroundColor: 'rgba(15,65,20,0.55)', borderRadius: 1 }} />
            <View style={{ position: 'absolute', top: 18, left: 2, right: 2, height: 2, backgroundColor: 'rgba(15,65,20,0.45)', borderRadius: 1 }} />
          </View>
          <View style={{ position: 'absolute', top: '-38%', right: '18%', width: 13, height: 30, borderRadius: 6, backgroundColor: '#3AAA42', transform: [{ rotate: '32deg' }] }}>
            <View style={{ position: 'absolute', top: 7, left: 2, right: 2, height: 2, backgroundColor: 'rgba(15,65,20,0.5)', borderRadius: 1 }} />
            <View style={{ position: 'absolute', top: 16, left: 2, right: 2, height: 2, backgroundColor: 'rgba(15,65,20,0.4)', borderRadius: 1 }} />
          </View>
        </View>
      );
    case 'sakura':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Big cherry blossom above top-right */}
          <View style={{ position: 'absolute', top: '-46%', right: '2%', transform: [{ rotate: '18deg' }] }}>
            {[0, 72, 144, 216, 288].map((deg, j) => (
              <View key={j} style={{ position: 'absolute', width: 15, height: 20, borderRadius: 7, backgroundColor: 'rgba(245,125,162,0.92)', transform: [{ rotate: `${deg}deg` }, { translateY: -13 }], transformOrigin: '7.5px 20px' as any }} />
            ))}
            <View style={{ width: 9, height: 9, borderRadius: 4.5, backgroundColor: 'rgba(255,215,55,0.98)' }} />
          </View>
          {/* Falling petal left */}
          <View style={{ position: 'absolute', top: '-22%', left: '12%', width: 11, height: 14, borderRadius: 5, backgroundColor: 'rgba(245,128,163,0.75)', transform: [{ rotate: '35deg' }] }} />
        </View>
      );
    case 'ichigo':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Strawberry calyx - 5 pointed leaves */}
          {[{ r: '-58deg', l: '14%', t: '-40%' }, { r: '-28deg', l: '28%', t: '-46%' }, { r: '0deg', l: '42%', t: '-49%' }, { r: '28deg', l: '56%', t: '-46%' }, { r: '56deg', l: '68%', t: '-40%' }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: p.t as any, left: p.l as any, width: 12, height: 28, borderRadius: 6, backgroundColor: '#1E8C38', transform: [{ rotate: p.r }] }}>
              <View style={{ position: 'absolute', top: 7, left: 2, right: 2, height: 2, backgroundColor: 'rgba(10,60,20,0.55)', borderRadius: 1 }} />
            </View>
          ))}
        </View>
      );
    case 'kogeme':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Tall flames */}
          <View style={{ position: 'absolute', top: '-46%', left: '20%', width: 15, height: 42, borderBottomLeftRadius: 7, borderBottomRightRadius: 7, borderTopLeftRadius: 15, borderTopRightRadius: 15, backgroundColor: '#FF6C08', transform: [{ rotate: '-12deg' }] }} />
          <View style={{ position: 'absolute', top: '-55%', left: '37%', width: 13, height: 50, borderBottomLeftRadius: 6, borderBottomRightRadius: 6, borderTopLeftRadius: 13, borderTopRightRadius: 13, backgroundColor: '#FFAA08', transform: [{ rotate: '4deg' }] }} />
          <View style={{ position: 'absolute', top: '-48%', left: '55%', width: 14, height: 44, borderBottomLeftRadius: 7, borderBottomRightRadius: 7, borderTopLeftRadius: 14, borderTopRightRadius: 14, backgroundColor: '#FF7A10', transform: [{ rotate: '16deg' }] }} />
          {/* Bright inner flame */}
          <View style={{ position: 'absolute', top: '-42%', left: '28%', width: 11, height: 32, borderRadius: 5.5, backgroundColor: 'rgba(255,225,45,0.65)', transform: [{ rotate: '-8deg' }] }} />
          <View style={{ position: 'absolute', top: '-48%', left: '44%', width: 9, height: 36, borderRadius: 4.5, backgroundColor: 'rgba(255,225,45,0.6)', transform: [{ rotate: '5deg' }] }} />
        </View>
      );
    case 'anko':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Sesame seeds on top */}
          {[{ t: '-10%', l: '24%', r: '-15deg' }, { t: '-13%', l: '42%', r: '5deg' }, { t: '-10%', l: '59%', r: '20deg' }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: p.t as any, left: p.l as any, width: 7, height: 10, borderRadius: 3.5, backgroundColor: '#C0A828', transform: [{ rotate: p.r }] }} />
          ))}
        </View>
      );
    case 'sumi':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Smoke wisps - tall */}
          <View style={{ position: 'absolute', top: '-42%', left: '18%', width: 11, height: 40, borderRadius: 5.5, backgroundColor: 'rgba(155,150,145,0.52)', transform: [{ rotate: '-16deg' }] }} />
          <View style={{ position: 'absolute', top: '-50%', left: '38%', width: 9, height: 48, borderRadius: 4.5, backgroundColor: 'rgba(155,150,145,0.48)', transform: [{ rotate: '9deg' }] }} />
          <View style={{ position: 'absolute', top: '-42%', left: '57%', width: 8, height: 36, borderRadius: 4, backgroundColor: 'rgba(155,150,145,0.43)', transform: [{ rotate: '26deg' }] }} />
        </View>
      );
    case 'yuzu':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Big leaf sticking out */}
          <View style={{ position: 'absolute', top: '-44%', right: '5%', width: 24, height: 42, borderRadius: 12, backgroundColor: '#30A840', transform: [{ rotate: '34deg' }] }}>
            <View style={{ position: 'absolute', top: 9, left: 3, right: 3, height: 2, backgroundColor: 'rgba(15,75,22,0.55)', borderRadius: 1 }} />
            <View style={{ position: 'absolute', top: 20, left: 3, right: 3, height: 2, backgroundColor: 'rgba(15,75,22,0.45)', borderRadius: 1 }} />
            <View style={{ position: 'absolute', top: 30, left: 3, right: 3, height: 2, backgroundColor: 'rgba(15,75,22,0.38)', borderRadius: 1 }} />
          </View>
          <View style={{ position: 'absolute', top: '-36%', right: '24%', width: 17, height: 30, borderRadius: 8, backgroundColor: '#48C052', transform: [{ rotate: '-6deg' }] }}>
            <View style={{ position: 'absolute', top: 8, left: 2, right: 2, height: 2, backgroundColor: 'rgba(15,75,22,0.48)', borderRadius: 1 }} />
            <View style={{ position: 'absolute', top: 18, left: 2, right: 2, height: 2, backgroundColor: 'rgba(15,75,22,0.38)', borderRadius: 1 }} />
          </View>
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
