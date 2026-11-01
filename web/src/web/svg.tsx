import type { SVGProps } from 'react';
import { StyleSheet } from 'react-native';
export type SvgProps = SVGProps<SVGSVGElement>;
export default function Svg({ style, ...props }: SvgProps) { return <svg style={StyleSheet.flatten(style as never)} {...props}/>; }
export function Path(props: SVGProps<SVGPathElement>) { return <path {...props}/>; }
export function webSvgStyle(style: unknown): React.CSSProperties {
  const flat = StyleSheet.flatten(style as never) as Record<string, unknown>;
  const { transform, ...rest } = flat;
  const cssTransform = Array.isArray(transform) ? transform.map(entry => Object.entries(entry).map(([key, value]) => `${key}(${typeof value === 'number' && key.startsWith('translate') ? `${value}px` : value})`).join(' ')).join(' ') : transform;
  return { ...rest, ...(cssTransform ? { transform: cssTransform } : {}) } as React.CSSProperties;
}
