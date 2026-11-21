import { Fragment, useId } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, G, Path, Pattern, Rect, Text as SvgText } from 'react-native-svg';

import { type Restaurant } from '@/data/model';
import { useTheme } from '@/hooks/use-theme';

const radius = 145;
const radians = Math.PI / 180;
function point(distance: number, angle: number) {
  return { x: distance * Math.cos(angle * radians), y: distance * Math.sin(angle * radians) };
}

// All slice angles are clockwise from the twelve o’clock pointer.
export function landingAngle(current: number, index: number, count: number) {
  const center = (index + 0.5) * 360 / count;
  return current + 1080 + ((360 - center - current % 360 + 360) % 360);
}

const rimTicks = Array.from({ length: 72 }, (_, index) => {
  const a = point(155, index * 5);
  const b = point(index % 6 === 0 ? 161 : 158, index * 5);
  return `M${a.x} ${a.y}L${b.x} ${b.y}`;
}).join(' ');

function Slice({ name, index, count }: { name: string; index: number; count: number }) {
  const c = useTheme();
  const step = 360 / count;
  const start = index * step - 90;
  const mid = start + step / 2;
  const a = point(radius, start);
  const b = point(radius, start + step);
  const pos = count === 1 ? { x: 0, y: -68 } : point(count === 2 ? 83 : 92, mid);
  const chars = Array.from(name);
  const label = chars.length > 10 ? chars.slice(0, 9).join('') + '…' : name;
  const direction = count < 3 ? 0 : count <= 4 ? mid + 90 : mid;
  const tilt = ((direction + 270) % 180) - 90;
  // Wide glyphs take up more of a slice. Keep both ends clear of the rim and hub.
  const ems = Array.from(label).reduce((width, ch) =>
    width + (/[^\x20-\x7e]|[MW@%]/.test(ch) ? 1.1 : /[ijl I.]/.test(ch) ? 0.38 : 0.72), 0);
  const fontSize = Math.min(count <= 4 ? 18 : 15.5, (count <= 4 ? 122 : 94) / ems);
  const fill = index % 2 === 0 ? c.terracotta : c.sage;
  return <Fragment>
    {count === 1 ? <Circle r={radius} fill={fill} stroke={c.wheelLine} /> :
      <Path d={`M0 0L${a.x} ${a.y}A${radius} ${radius} 0 0 1 ${b.x} ${b.y}Z`}
        fill={fill} stroke={c.wheelLine} strokeWidth={1.15} />}
    <G transform={`translate(${pos.x} ${pos.y}) rotate(${tilt})`}>
      <SvgText x={0} y={fontSize * 0.34} textAnchor="middle" fontSize={fontSize}
        fontWeight="600" fill={c.text}>{label}</SvgText>
    </G>
  </Fragment>;
}

export function RestaurantWheel({ restaurants, rotation }: { restaurants: Restaurant[]; rotation: Animated.Value }) {
  const c = useTheme();
  const patternId = 'linen' + useId().replace(/[^a-zA-Z0-9]/g, '');
  const rotate = rotation.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });
  return <View style={[styles.board, { backgroundColor: c.board, borderColor: c.border }]}>
    <View style={StyleSheet.absoluteFill} pointerEvents="none" aria-hidden>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id={patternId} width={24} height={24} patternUnits="userSpaceOnUse">
            <Path d="M0 0H24 M0 0V24" fill="none" stroke={c.grid} strokeWidth={1.3} opacity={0.75} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </Svg>
    </View>
    <View style={styles.dial} accessible accessibilityRole="image"
      accessibilityLabel={`Restaurant wheel with ${restaurants.length} choices. ${restaurants.map(item => item.name).join(', ')}`}>
      <Svg width="100%" height="100%" viewBox="-180 -180 360 360" style={StyleSheet.absoluteFill}>
        <Circle cy={4} r={167} fill={c.wheelLine} opacity={0.24} />
        <Circle r={167} fill={c.rim} stroke={c.wheelLine} strokeWidth={1.6} />
        <Circle r={162.5} fill="none" stroke={c.wheelLine} strokeWidth={0.8} />
        <Path d={rimTicks} stroke={c.wheelLine} opacity={0.72} strokeWidth={1.3} />
        <Circle r={150.4} fill="none" stroke={c.wheelLine} strokeWidth={1} />
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate }] }]}>
        <Svg width="100%" height="100%" viewBox="-180 -180 360 360">
          {restaurants.map((item, i) => <Slice key={item.id} name={item.name} index={i} count={restaurants.length} />)}
          {restaurants.length > 0 && <Circle r={139} fill="none" stroke={c.wheelLine} opacity={0.5} strokeWidth={0.75} />}
        </Svg>
      </Animated.View>
      <Svg width="100%" height="100%" viewBox="-180 -180 360 360" style={StyleSheet.absoluteFill}>
        <Circle cy={2} r={20} fill={c.wheelLine} opacity={0.4} />
        <Circle r={20} fill={c.rim} stroke={c.wheelLine} strokeWidth={1.2} />
        <Circle r={15.8} fill="none" stroke={c.wheelLine} opacity={0.65} strokeWidth={0.8} />
        <Path d="M-8-8v5c0 3.8 6 3.8 6 0v-5 M-5-8V9 M6-8C3-5 2-1 2 2h4 M6-8V9"
          fill="none" stroke={c.text} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M-9-174Q-12-174-11-170L-2-143Q0-138 2-143L11-170Q12-174 9-174Z"
          fill={c.text} stroke={c.rim} strokeWidth={2} strokeLinejoin="round" />
        <Circle cy={-168} r={2.1} fill={c.rim} />
      </Svg>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  board: { overflow: 'hidden', borderBottomWidth: 1, alignItems: 'center', justifyContent: 'center', padding: 12 },
  dial: { width: '100%', maxWidth: 362, aspectRatio: 1 },
});
