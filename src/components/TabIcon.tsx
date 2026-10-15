import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type TabIconName = 'home' | 'explore' | 'sell' | 'cart' | 'chats';

type TabIconProps = {
  name: TabIconName;
  color: string;
  size: number;
};

export function TabIcon({ name, color, size }: TabIconProps) {
  const stroke = {
    fill: 'none',
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'home' && (
        <Path
          d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"
          {...stroke}
        />
      )}
      {name === 'explore' && (
        <>
          <Circle cx={12} cy={12} r={9} {...stroke} />
          <Path d="m15.5 8.5-2 5-5 2 2-5z" {...stroke} />
        </>
      )}
      {name === 'sell' && (
        <>
          <Rect x={3} y={3} width={18} height={18} rx={5} {...stroke} />
          <Path d="M12 8v8M8 12h8" {...stroke} />
        </>
      )}
      {name === 'chats' && (
        <Path
          d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12z"
          {...stroke}
        />
      )}
      {name === 'cart' && (
        <>
          <Path
            d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6"
            {...stroke}
          />
          <Circle cx={9} cy={19} r={1.5} {...stroke} />
          <Circle cx={17} cy={19} r={1.5} {...stroke} />
        </>
      )}
    </Svg>
  );
}
