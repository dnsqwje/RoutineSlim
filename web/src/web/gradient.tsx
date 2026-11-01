import { View, type ViewProps } from 'react-native';
export function LinearGradient({ colors, start: _start, end: _end, style, ...props }: ViewProps & {colors: readonly string[]; start?: {x:number;y:number}; end?: {x:number;y:number}}) {
  return <View {...props} style={[style, { backgroundImage: `linear-gradient(162deg, ${colors.join(', ')})` } as never]}/>;
}
