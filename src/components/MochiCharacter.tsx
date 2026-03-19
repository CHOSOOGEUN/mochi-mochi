import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// ─── Skin-specific patterns ───
export const MochiPattern = ({ skinId, isDead }: { skinId: string; isDead: boolean }) => {
  if (isDead) return null;
  switch (skinId) {
    case 'matcha':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Matcha swirl */}
          <View style={{ position: 'absolute', top: '48%', left: '20%', width: 40, height: 40, borderRadius: 20, borderWidth: 2.5, borderColor: 'rgba(80,140,60,0.2)', borderRightColor: 'transparent', borderBottomColor: 'transparent', transform: [{ rotate: '-20deg' }] }} />
          <View style={{ position: 'absolute', top: '54%', left: '28%', width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: 'rgba(80,140,60,0.15)', borderRightColor: 'transparent', borderBottomColor: 'transparent', transform: [{ rotate: '40deg' }] }} />
          {/* Tea powder dots */}
          {[{ t: 50, l: 18, s: 5 }, { t: 55, l: 38, s: 3 }, { t: 58, l: 62, s: 4 }, { t: 52, l: 76, s: 3 }, { t: 60, l: 28, s: 4 }, { t: 57, l: 52, s: 3 }, { t: 53, l: 72, s: 5 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: p.s, height: p.s, borderRadius: p.s / 2, backgroundColor: 'rgba(70,130,50,0.22)' }} />
          ))}
          {/* Leaf */}
          <View style={{ position: 'absolute', top: '18%', right: '18%', width: 18, height: 11, borderRadius: 9, backgroundColor: 'rgba(80,150,60,0.22)', transform: [{ rotate: '-30deg' }] }}>
            <View style={{ position: 'absolute', top: 5, left: 2, right: 2, height: 1, backgroundColor: 'rgba(60,120,40,0.18)', borderRadius: 1 }} />
          </View>
        </View>
      );
    case 'sakura':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Petals */}
          {[{ t: 22, l: 18, r: '-15deg', s: 1.1 }, { t: 32, l: 62, r: '30deg', s: 0.9 }, { t: 52, l: 12, r: '-40deg', s: 0.8 }, { t: 45, l: 68, r: '20deg', s: 1.0 }, { t: 65, l: 38, r: '-25deg', s: 0.7 }, { t: 60, l: 78, r: '10deg', s: 0.6 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, transform: [{ rotate: p.r }, { scale: p.s }] }}>
              {[0, 72, 144, 216, 288].map((deg, j) => (
                <View key={j} style={{ position: 'absolute', width: 7, height: 9, borderRadius: 4, backgroundColor: `rgba(240,140,170,${0.25 - i * 0.02})`, transform: [{ rotate: `${deg}deg` }, { translateY: -5 }], transformOrigin: '3.5px 9px' as any }} />
              ))}
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(240,200,80,0.3)' }} />
            </View>
          ))}
          {/* Leaf */}
          <View style={{ position: 'absolute', bottom: '10%', left: '8%', width: '45%', height: 18, backgroundColor: 'rgba(130,180,110,0.2)', borderTopLeftRadius: 18, borderTopRightRadius: 36, borderBottomRightRadius: 8, transform: [{ rotate: '-6deg' }] }} />
        </View>
      );
    case 'ichigo':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Seeds */}
          {[{ t: 32, l: 22 }, { t: 28, l: 55 }, { t: 45, l: 68 }, { t: 52, l: 32 }, { t: 40, l: 48 }, { t: 62, l: 20 }, { t: 58, l: 62 }, { t: 70, l: 42 }, { t: 35, l: 78 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: 4, height: 6, borderRadius: 2, backgroundColor: 'rgba(160,40,55,0.38)', transform: [{ rotate: `${i * 22}deg` }] }} />
          ))}
          {/* Leaf cluster on top */}
          <View style={{ position: 'absolute', top: '4%', left: '32%', width: 16, height: 9, borderRadius: 8, backgroundColor: 'rgba(50,140,55,0.55)', transform: [{ rotate: '-35deg' }] }} />
          <View style={{ position: 'absolute', top: '2%', left: '45%', width: 14, height: 8, borderRadius: 7, backgroundColor: 'rgba(60,150,60,0.55)', transform: [{ rotate: '5deg' }] }} />
          <View style={{ position: 'absolute', top: '5%', left: '58%', width: 12, height: 7, borderRadius: 6, backgroundColor: 'rgba(50,135,50,0.5)', transform: [{ rotate: '40deg' }] }} />
          {/* Shine */}
          <View style={{ position: 'absolute', top: '20%', left: '18%', width: 18, height: 10, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.22)', transform: [{ rotate: '-20deg' }] }} />
        </View>
      );
    case 'kogeme':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Burnt top zone */}
          <View style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: '32%', backgroundColor: 'rgba(150,90,10,0.2)', borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }} />
          {/* Caramel spots */}
          {[{ t: 6, l: 22, w: 16, h: 8 }, { t: 10, l: 55, w: 12, h: 7 }, { t: 4, l: 40, w: 9, h: 6 }, { t: 16, l: 70, w: 14, h: 8 }, { t: 14, l: 12, w: 10, h: 6 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: p.w, height: p.h, borderRadius: p.h / 2, backgroundColor: `rgba(155,85,8,${0.22 + (i % 3) * 0.06})` }} />
          ))}
          {/* Caramel drips */}
          <View style={{ position: 'absolute', top: '26%', left: '28%', width: 4, height: 20, borderRadius: 2, backgroundColor: 'rgba(170,100,15,0.28)' }}>
            <View style={{ position: 'absolute', bottom: -4, left: -3, width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(170,100,15,0.22)' }} />
          </View>
          <View style={{ position: 'absolute', top: '22%', left: '62%', width: 3, height: 14, borderRadius: 2, backgroundColor: 'rgba(170,100,15,0.22)' }}>
            <View style={{ position: 'absolute', bottom: -3, left: -3, width: 9, height: 9, borderRadius: 4.5, backgroundColor: 'rgba(170,100,15,0.18)' }} />
          </View>
        </View>
      );
    case 'anko':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Anko filling seam */}
          <View style={{ position: 'absolute', top: '40%', left: '5%', right: '5%', height: 3, backgroundColor: 'rgba(70,25,15,0.32)', borderRadius: 2 }} />
          {/* Sauce drips */}
          <View style={{ position: 'absolute', top: '36%', left: '18%', width: 6, height: 24, borderRadius: 3, backgroundColor: 'rgba(70,25,15,0.3)' }}>
            <View style={{ position: 'absolute', bottom: -5, left: -3, width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(70,25,15,0.24)' }} />
          </View>
          <View style={{ position: 'absolute', top: '34%', left: '52%', width: 5, height: 18, borderRadius: 2.5, backgroundColor: 'rgba(70,25,15,0.26)' }}>
            <View style={{ position: 'absolute', bottom: -4, left: -3, width: 11, height: 11, borderRadius: 5.5, backgroundColor: 'rgba(70,25,15,0.2)' }} />
          </View>
          <View style={{ position: 'absolute', top: '38%', left: '72%', width: 4, height: 14, borderRadius: 2, backgroundColor: 'rgba(70,25,15,0.24)' }}>
            <View style={{ position: 'absolute', bottom: -3, left: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(70,25,15,0.18)' }} />
          </View>
          {/* Anko texture */}
          {[{ t: 54, l: 22 }, { t: 60, l: 44 }, { t: 56, l: 66 }, { t: 65, l: 30 }, { t: 63, l: 58 }, { t: 70, l: 42 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: 6, height: 5, borderRadius: 3, backgroundColor: 'rgba(70,25,15,0.22)' }} />
          ))}
          {/* Highlight */}
          <View style={{ position: 'absolute', top: '42%', left: '22%', width: 22, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.14)' }} />
        </View>
      );
    case 'sumi':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Crack lines */}
          <View style={{ position: 'absolute', top: '18%', left: '15%', width: 38, height: 1.5, backgroundColor: 'rgba(210,190,180,0.22)', transform: [{ rotate: '12deg' }] }} />
          <View style={{ position: 'absolute', top: '26%', left: '52%', width: 22, height: 1, backgroundColor: 'rgba(210,190,180,0.18)', transform: [{ rotate: '-28deg' }] }} />
          <View style={{ position: 'absolute', top: '55%', left: '20%', width: 16, height: 1, backgroundColor: 'rgba(210,190,180,0.15)', transform: [{ rotate: '8deg' }] }} />
          {/* Ember glow */}
          {[{ t: 58, l: 18 }, { t: 66, l: 52 }, { t: 62, l: 72 }, { t: 72, l: 33 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(220,90,30,0.35)' }} />
          ))}
          {/* Ash specks */}
          {[{ t: 28, l: 32 }, { t: 42, l: 68 }, { t: 52, l: 24 }, { t: 38, l: 76 }, { t: 63, l: 48 }, { t: 33, l: 52 }, { t: 48, l: 40 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(225,215,205,0.22)' }} />
          ))}
        </View>
      );
    case 'yuzu':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Citrus slice */}
          <View style={{ position: 'absolute', top: '48%', left: '22%', width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: 'rgba(210,170,30,0.25)', backgroundColor: 'rgba(255,235,100,0.1)', justifyContent: 'center', alignItems: 'center' }}>
            {[0, 45, 90, 135].map((deg, i) => (
              <View key={i} style={{ position: 'absolute', width: 20, height: 1.5, backgroundColor: 'rgba(210,170,30,0.2)', borderRadius: 1, transform: [{ rotate: `${deg}deg` }] }} />
            ))}
            <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: 'rgba(240,200,40,0.2)' }} />
          </View>
          {/* Small citrus */}
          <View style={{ position: 'absolute', top: '62%', right: '18%', width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: 'rgba(210,170,30,0.2)', justifyContent: 'center', alignItems: 'center' }}>
            {[0, 90].map((deg, i) => (
              <View key={i} style={{ position: 'absolute', width: 10, height: 1, backgroundColor: 'rgba(210,170,30,0.16)', transform: [{ rotate: `${deg}deg` }] }} />
            ))}
          </View>
          {/* Zest dots */}
          {[{ t: 32, l: 18 }, { t: 40, l: 58 }, { t: 68, l: 28 }, { t: 44, l: 78 }, { t: 73, l: 62 }, { t: 28, l: 68 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(240,200,30,0.25)' }} />
          ))}
          {/* Leaf */}
          <View style={{ position: 'absolute', top: '26%', right: '20%', width: 16, height: 10, borderRadius: 8, backgroundColor: 'rgba(90,160,60,0.22)', transform: [{ rotate: '22deg' }] }}>
            <View style={{ position: 'absolute', top: 4.5, left: 2, right: 2, height: 1, backgroundColor: 'rgba(70,130,45,0.18)', borderRadius: 1 }} />
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
