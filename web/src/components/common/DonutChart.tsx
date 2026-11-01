import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export type DonutSegment = {
  key: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  segments: DonutSegment[];
  size: number;
  thickness: number;
  /** 가운데 영역에 표시할 내용 */
  children?: ReactNode;
};

/** 12시 방향에서 시작해 시계 방향으로 그리는 도넛 차트 */
export function DonutChart({ segments, size, thickness, children }: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const outer = size / 2;
  const inner = outer - thickness;

  let start = 0;
  const paths = segments
    .filter((s) => s.value > 0)
    .map((segment) => {
      const sweep = (segment.value / total) * Math.PI * 2;
      const d = annulusSector(outer, outer, inner, start, start + sweep);
      start += sweep;
      return <Path key={segment.key} d={d} fill={segment.color} />;
    });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {total > 0 ? paths : null}
      </Svg>
      <View style={styles.center}>{children}</View>
    </View>
  );
}

function annulusSector(c: number, outer: number, inner: number, from: number, to: number) {
  // 한 조각이 100% 일 때 시작점과 끝점이 겹쳐 호가 사라지지 않도록 살짝 줄인다
  const end = Math.min(to, from + Math.PI * 2 - 0.0001);
  const large = end - from > Math.PI ? 1 : 0;
  const point = (r: number, angle: number) => `${c + r * Math.sin(angle)} ${c - r * Math.cos(angle)}`;

  return [
    `M ${point(outer, from)}`,
    `A ${outer} ${outer} 0 ${large} 1 ${point(outer, end)}`,
    `L ${point(inner, end)}`,
    `A ${inner} ${inner} 0 ${large} 0 ${point(inner, from)}`,
    'Z',
  ].join(' ');
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
});
