import Svg, { Circle, G, Path } from 'react-native-svg';

const paths = {
  spin: 'M20 12a8 8 0 1 1-2.35-5.65L20 8.7 M20 3.8v5.1h-5.1',
  wheel: 'M12 3v9l7.8 4.5 M12 12l-7.8 4.5 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  cutlery: 'M5 3v5c0 3.5 6 3.5 6 0V3 M8 3v18 M18 3c-2.5 2.3-3.6 5.8-3.4 9H18 M18 3v18',
  book: 'M6 3.5h12.5V21H6a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z M8 3.5V21 M11 8h4.5 M11 11.5h3',
  calendar: 'M4 6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z M8 3v4 M16 3v4 M4 10h16',
  arrow: 'M4 12h15 M14 7l5 5-5 5',
  left: 'm14.5 5-7 7 7 7',
  right: 'm9 5 7 7-7 7',
  plus: 'M12 5v14 M5 12h14',
  check: 'm4.5 12 5 5 10-11',
  trash: 'M4 6h16 M9 6V3.5h6V6 M6.5 6l.8 14h9.4l.8-14 M10 10v6 M14 10v6',
  breakfast: 'M3 16h18 M4 20h16 M7 16a5 5 0 0 1 10 0 M12 4v3 M3 10l2 1 M21 10l-2 1 M5.5 5.8l2 2 M18.5 5.8l-2 2',
  lunch: 'M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1.5 1.5 M17.5 17.5 19 19 M19 5l-1.5 1.5 M6.5 17.5 5 19',
  dinner: 'M20.3 14.3A8.8 8.8 0 0 1 9.7 3.7a8.8 8.8 0 1 0 10.6 10.6Z',
} as const;
export type IconName = keyof typeof paths;

export function Icon({ name, color, size = 20 }: { name: IconName; color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <Path d={paths[name]} stroke={color} strokeWidth={1.65} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

export function PlateMark({ color, paper, size = 36 }: { color: string; paper: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <Circle cx="20" cy="20" r="19" fill={color} />
      <Circle cx="20" cy="20" r="15.6" stroke={paper} strokeWidth=".8" fill="none" />
      <G transform="translate(8, 8)" fill="none" stroke={paper} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <Path d={paths.cutlery} />
      </G>
    </Svg>
  );
}
