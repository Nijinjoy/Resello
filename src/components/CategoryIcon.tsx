import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { ItemCategory } from '../data/categories';
import { colors } from '../theme/colors';

// Stand-in for a listing photo: an outline icon for the item's category.
export function CategoryIcon({
  category,
  size,
}: {
  category: ItemCategory;
  size: number;
}) {
  const stroke = {
    fill: 'none',
    stroke: colors.primary,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {category === 'phone' && (
        <>
          <Rect x={7} y={2.5} width={10} height={19} rx={2.5} {...stroke} />
          <Path d="M11 18.5h2" {...stroke} />
        </>
      )}
      {category === 'electronics' && (
        <>
          <Rect x={4} y={5} width={16} height={11} rx={1.5} {...stroke} />
          <Path d="M2 19h20" {...stroke} />
        </>
      )}
      {category === 'fashion' && (
        <Path
          d="M9 3 4 5.5 2.5 10l3 1.2V21h13v-9.8l3-1.2L20 5.5 15 3a3 3 0 0 1-6 0z"
          {...stroke}
        />
      )}
      {category === 'furniture' && (
        <>
          <Path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" {...stroke} />
          <Path
            d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v4H3zM5 17v2M19 17v2"
            {...stroke}
          />
        </>
      )}
      {category === 'gaming' && (
        <>
          <Path
            d="M7 8h10a4 4 0 0 1 3.9 4.8l-.8 3.6a2.3 2.3 0 0 1-4 1L14.5 16h-5l-1.6 1.4a2.3 2.3 0 0 1-4-1l-.8-3.6A4 4 0 0 1 7 8z"
            {...stroke}
          />
          <Path d="M8 11v3M6.5 12.5h3" {...stroke} />
          <Circle cx={16} cy={12.5} r={0.8} {...stroke} />
        </>
      )}
      {category === 'baby' && (
        <>
          <Path d="M5 5h3l2 8h9a6 6 0 0 0-6-6V5" {...stroke} />
          <Path d="M10 13a5 5 0 0 0 9 0" {...stroke} />
          <Circle cx={9} cy={19} r={1.6} {...stroke} />
          <Circle cx={17} cy={19} r={1.6} {...stroke} />
        </>
      )}
      {category === 'bike' && (
        <>
          <Circle cx={6} cy={16} r={3.5} {...stroke} />
          <Circle cx={18} cy={16} r={3.5} {...stroke} />
          <Path d="M6 16l4-7h5l3 7M10 9l2 7h-6M14 6h2.5" {...stroke} />
        </>
      )}
    </Svg>
  );
}
