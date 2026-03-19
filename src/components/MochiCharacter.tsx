import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// ─── Skin-specific patterns ───
export const MochiPattern = ({ skinId, isDead }: { skinId: string; isDead: boolean }) => {
  if (isDead) return null;
  switch (skinId) {
    case 'matcha':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Bold diagonal stripe */}
          <View style={{ position: 'absolute', top: '55%', left: '-10%', right: '-10%', height: 28, backgroundColor: 'rgba(70,130,50,0.18)', transform: [{ rotate: '-8deg' }] }} />
          {/* Matcha swirl */}
          <View style={{ position: 'absolute', top: '45%', left: '18%', width: 44, height: 44, borderRadius: 22, borderWidth: 3, borderColor: 'rgba(60,120,40,0.3)', borderRightColor: 'transparent', borderBottomColor: 'transparent', transform: [{ rotate: '-20deg' }] }} />
          <View style={{ position: 'absolute', top: '52%', left: '28%', width: 24, height: 24, borderRadius: 12, borderWidth: 2.5, borderColor: 'rgba(60,120,40,0.22)', borderRightColor: 'transparent', borderBottomColor: 'transparent', transform: [{ rotate: '40deg' }] }} />
          {/* Tea powder dots */}
          {[{ t: 48, l: 16, s: 7 }, { t: 54, l: 38, s: 5 }, { t: 57, l: 62, s: 6 }, { t: 50, l: 76, s: 4 }, { t: 60, l: 26, s: 5 }, { t: 56, l: 52, s: 4 }, { t: 52, l: 72, s: 7 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: p.s, height: p.s, borderRadius: p.s / 2, backgroundColor: 'rgba(60,120,40,0.32)' }} />
          ))}
          {/* Leaf sticking out top */}
          <View style={{ position: 'absolute', top: '-12%', left: '38%', width: 20, height: 28, borderRadius: 10, backgroundColor: 'rgba(60,140,50,0.7)', transform: [{ rotate: '-15deg' }] }}>
            <View style={{ position: 'absolute', top: 6, left: 2, right: 2, height: 1.5, backgroundColor: 'rgba(40,100,30,0.5)', borderRadius: 1 }} />
          </View>
          <View style={{ position: 'absolute', top: '-8%', left: '55%', width: 16, height: 22, borderRadius: 8, backgroundColor: 'rgba(70,150,55,0.6)', transform: [{ rotate: '20deg' }] }} />
        </View>
      );
    case 'sakura':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Pink wash */}
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', backgroundColor: 'rgba(240,140,170,0.12)', borderBottomLeftRadius: 60, borderBottomRightRadius: 60 }} />
          {/* Petals inside */}
          {[{ t: 28, l: 12, r: '-15deg', s: 1.2 }, { t: 35, l: 60, r: '30deg', s: 1.0 }, { t: 55, l: 8, r: '-40deg', s: 0.9 }, { t: 48, l: 65, r: '20deg', s: 1.1 }, { t: 68, l: 35, r: '-25deg', s: 0.8 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, transform: [{ rotate: p.r }, { scale: p.s }] }}>
              {[0, 72, 144, 216, 288].map((deg, j) => (
                <View key={j} style={{ position: 'absolute', width: 8, height: 10, borderRadius: 4, backgroundColor: `rgba(240,130,165,${0.38 - i * 0.03})`, transform: [{ rotate: `${deg}deg` }, { translateY: -6 }], transformOrigin: '4px 10px' as any }} />
              ))}
              <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: 'rgba(250,200,80,0.45)' }} />
            </View>
          ))}
          {/* Floating petals outside top-right */}
          <View style={{ position: 'absolute', top: '-18%', right: '8%', transform: [{ rotate: '25deg' }] }}>
            {[0, 72, 144, 216, 288].map((deg, j) => (
              <View key={j} style={{ position: 'absolute', width: 9, height: 11, borderRadius: 5, backgroundColor: 'rgba(240,130,165,0.55)', transform: [{ rotate: `${deg}deg` }, { translateY: -7 }], transformOrigin: '4.5px 11px' as any }} />
            ))}
          </View>
          {/* Leaf bottom */}
          <View style={{ position: 'absolute', bottom: '6%', left: '5%', width: '42%', height: 16, backgroundColor: 'rgba(110,170,90,0.35)', borderTopLeftRadius: 16, borderTopRightRadius: 32, borderBottomRightRadius: 8, transform: [{ rotate: '-6deg' }] }} />
        </View>
      );
    case 'ichigo':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Red gradient wash */}
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', backgroundColor: 'rgba(200,60,80,0.1)', borderTopLeftRadius: 60, borderTopRightRadius: 60 }} />
          {/* Seeds - bolder */}
          {[{ t: 30, l: 20 }, { t: 26, l: 55 }, { t: 44, l: 68 }, { t: 52, l: 30 }, { t: 40, l: 46 }, { t: 62, l: 18 }, { t: 57, l: 62 }, { t: 70, l: 40 }, { t: 34, l: 76 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: 5, height: 7, borderRadius: 2.5, backgroundColor: 'rgba(150,30,45,0.5)', transform: [{ rotate: `${i * 22}deg` }] }} />
          ))}
          {/* Shine */}
          <View style={{ position: 'absolute', top: '18%', left: '15%', width: 20, height: 12, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.35)', transform: [{ rotate: '-20deg' }] }} />
          {/* Leaf cluster sticking out above */}
          <View style={{ position: 'absolute', top: '-22%', left: '25%', width: 18, height: 26, borderRadius: 9, backgroundColor: 'rgba(40,140,50,0.75)', transform: [{ rotate: '-30deg' }] }}>
            <View style={{ position: 'absolute', top: 7, left: 2, right: 2, height: 1.5, backgroundColor: 'rgba(20,100,30,0.5)', borderRadius: 1 }} />
          </View>
          <View style={{ position: 'absolute', top: '-26%', left: '44%', width: 16, height: 24, borderRadius: 8, backgroundColor: 'rgba(50,155,55,0.75)', transform: [{ rotate: '5deg' }] }} />
          <View style={{ position: 'absolute', top: '-20%', left: '60%', width: 14, height: 20, borderRadius: 7, backgroundColor: 'rgba(40,140,50,0.65)', transform: [{ rotate: '35deg' }] }} />
        </View>
      );
    case 'kogeme':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Burnt top zone */}
          <View style={{ position: 'absolute', top: 0, left: '5%', right: '5%', height: '36%', backgroundColor: 'rgba(140,80,5,0.28)', borderBottomLeftRadius: 60, borderBottomRightRadius: 60 }} />
          {/* Diamond-shaped caramel spots */}
          {[{ t: 5, l: 20, s: 14 }, { t: 9, l: 52, s: 11 }, { t: 3, l: 38, s: 9 }, { t: 15, l: 68, s: 13 }, { t: 13, l: 10, s: 10 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: p.s, height: p.s, backgroundColor: `rgba(150,80,5,${0.32 + (i % 3) * 0.08})`, transform: [{ rotate: '45deg' }] }} />
          ))}
          {/* Caramel drips */}
          <View style={{ position: 'absolute', top: '28%', left: '25%', width: 5, height: 24, borderRadius: 2.5, backgroundColor: 'rgba(160,90,10,0.38)' }}>
            <View style={{ position: 'absolute', bottom: -5, left: -4, width: 13, height: 13, borderRadius: 6.5, backgroundColor: 'rgba(160,90,10,0.32)' }} />
          </View>
          <View style={{ position: 'absolute', top: '24%', left: '60%', width: 4, height: 18, borderRadius: 2, backgroundColor: 'rgba(160,90,10,0.32)' }}>
            <View style={{ position: 'absolute', bottom: -4, left: -3, width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(160,90,10,0.26)' }} />
          </View>
          {/* Flame tips sticking out above */}
          <View style={{ position: 'absolute', top: '-20%', left: '30%', width: 10, height: 22, borderRadius: 5, backgroundColor: 'rgba(240,120,20,0.55)', transform: [{ rotate: '-8deg' }] }} />
          <View style={{ position: 'absolute', top: '-26%', left: '45%', width: 8, height: 28, borderRadius: 4, backgroundColor: 'rgba(255,140,10,0.6)', transform: [{ rotate: '5deg' }] }} />
          <View style={{ position: 'absolute', top: '-18%', left: '58%', width: 9, height: 20, borderRadius: 4.5, backgroundColor: 'rgba(240,110,15,0.5)', transform: [{ rotate: '20deg' }] }} />
        </View>
      );
    case 'anko':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Dark bottom fill */}
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', backgroundColor: 'rgba(60,20,10,0.14)', borderTopLeftRadius: 50, borderTopRightRadius: 50 }} />
          {/* Anko filling seam */}
          <View style={{ position: 'absolute', top: '40%', left: '5%', right: '5%', height: 4, backgroundColor: 'rgba(60,20,10,0.42)', borderRadius: 2 }} />
          {/* Sauce drips - bolder */}
          <View style={{ position: 'absolute', top: '36%', left: '16%', width: 7, height: 26, borderRadius: 3.5, backgroundColor: 'rgba(60,20,10,0.42)' }}>
            <View style={{ position: 'absolute', bottom: -6, left: -4, width: 15, height: 15, borderRadius: 7.5, backgroundColor: 'rgba(60,20,10,0.34)' }} />
          </View>
          <View style={{ position: 'absolute', top: '33%', left: '50%', width: 6, height: 20, borderRadius: 3, backgroundColor: 'rgba(60,20,10,0.36)' }}>
            <View style={{ position: 'absolute', bottom: -5, left: -4, width: 14, height: 14, borderRadius: 7, backgroundColor: 'rgba(60,20,10,0.28)' }} />
          </View>
          <View style={{ position: 'absolute', top: '37%', left: '70%', width: 5, height: 16, borderRadius: 2.5, backgroundColor: 'rgba(60,20,10,0.34)' }}>
            <View style={{ position: 'absolute', bottom: -4, left: -3, width: 11, height: 11, borderRadius: 5.5, backgroundColor: 'rgba(60,20,10,0.26)' }} />
          </View>
          {/* Anko beans texture */}
          {[{ t: 54, l: 20 }, { t: 60, l: 42 }, { t: 56, l: 64 }, { t: 66, l: 28 }, { t: 63, l: 56 }, { t: 70, l: 40 }, { t: 58, l: 76 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: 7, height: 6, borderRadius: 3.5, backgroundColor: 'rgba(60,20,10,0.3)' }} />
          ))}
          {/* Highlight */}
          <View style={{ position: 'absolute', top: '42%', left: '20%', width: 26, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.2)' }} />
        </View>
      );
    case 'sumi':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Inner glow - ember center */}
          <View style={{ position: 'absolute', bottom: '10%', left: '20%', right: '20%', height: '35%', backgroundColor: 'rgba(200,70,20,0.12)', borderRadius: 40 }} />
          {/* Bold crack lines */}
          <View style={{ position: 'absolute', top: '20%', left: '12%', width: 44, height: 2, backgroundColor: 'rgba(220,200,190,0.35)', transform: [{ rotate: '10deg' }] }} />
          <View style={{ position: 'absolute', top: '28%', left: '50%', width: 26, height: 1.5, backgroundColor: 'rgba(220,200,190,0.28)', transform: [{ rotate: '-30deg' }] }} />
          <View style={{ position: 'absolute', top: '52%', left: '18%', width: 20, height: 1.5, backgroundColor: 'rgba(220,200,190,0.22)', transform: [{ rotate: '12deg' }] }} />
          {/* Ember glow - diamonds */}
          {[{ t: 56, l: 16 }, { t: 64, l: 50 }, { t: 60, l: 70 }, { t: 70, l: 30 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: 9, height: 9, backgroundColor: 'rgba(230,80,20,0.5)', transform: [{ rotate: '45deg' }] }} />
          ))}
          {/* Ash specks */}
          {[{ t: 26, l: 30 }, { t: 40, l: 66 }, { t: 50, l: 22 }, { t: 36, l: 75 }, { t: 61, l: 46 }, { t: 32, l: 50 }, { t: 46, l: 38 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(230,215,205,0.32)' }} />
          ))}
          {/* Smoke wisps above */}
          <View style={{ position: 'absolute', top: '-20%', left: '28%', width: 6, height: 20, borderRadius: 3, backgroundColor: 'rgba(180,170,165,0.4)', transform: [{ rotate: '-10deg' }] }} />
          <View style={{ position: 'absolute', top: '-26%', left: '48%', width: 5, height: 26, borderRadius: 3, backgroundColor: 'rgba(180,170,165,0.35)', transform: [{ rotate: '8deg' }] }} />
          <View style={{ position: 'absolute', top: '-18%', left: '62%', width: 4, height: 16, borderRadius: 2, backgroundColor: 'rgba(180,170,165,0.3)', transform: [{ rotate: '22deg' }] }} />
        </View>
      );
    case 'yuzu':
      return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Yellow glow wash */}
          <View style={{ position: 'absolute', top: '30%', left: '15%', right: '15%', height: '45%', backgroundColor: 'rgba(240,200,30,0.15)', borderRadius: 40 }} />
          {/* Citrus slice - bolder */}
          <View style={{ position: 'absolute', top: '44%', left: '18%', width: 36, height: 36, borderRadius: 18, borderWidth: 2.5, borderColor: 'rgba(200,160,20,0.4)', backgroundColor: 'rgba(255,240,100,0.18)', justifyContent: 'center', alignItems: 'center' }}>
            {[0, 45, 90, 135].map((deg, i) => (
              <View key={i} style={{ position: 'absolute', width: 22, height: 2, backgroundColor: 'rgba(200,160,20,0.32)', borderRadius: 1, transform: [{ rotate: `${deg}deg` }] }} />
            ))}
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(240,200,30,0.3)' }} />
          </View>
          {/* Star shape next to citrus */}
          {[0, 60, 120].map((deg, i) => (
            <View key={i} style={{ position: 'absolute', top: '58%', right: '14%', width: 18, height: 4, borderRadius: 2, backgroundColor: 'rgba(200,160,20,0.3)', transform: [{ rotate: `${deg}deg` }] }} />
          ))}
          {/* Zest dots - bigger */}
          {[{ t: 30, l: 16 }, { t: 38, l: 58 }, { t: 66, l: 25 }, { t: 43, l: 76 }, { t: 72, l: 60 }, { t: 27, l: 66 }].map((p, i) => (
            <View key={i} style={{ position: 'absolute', top: `${p.t}%` as any, left: `${p.l}%` as any, width: 5, height: 5, borderRadius: 2.5, backgroundColor: 'rgba(220,180,20,0.38)' }} />
          ))}
          {/* Leaf sticking out top */}
          <View style={{ position: 'absolute', top: '-16%', right: '15%', width: 18, height: 24, borderRadius: 9, backgroundColor: 'rgba(80,160,55,0.65)', transform: [{ rotate: '28deg' }] }}>
            <View style={{ position: 'absolute', top: 6, left: 2, right: 2, height: 1.5, backgroundColor: 'rgba(55,120,35,0.45)', borderRadius: 1 }} />
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
