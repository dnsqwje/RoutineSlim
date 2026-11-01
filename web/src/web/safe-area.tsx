import { View, type ViewProps } from 'react-native';
export function SafeAreaView({ edges: _edges, ...props }: ViewProps & {edges?: string[]}) { return <View {...props}/>; }
export const useSafeAreaInsets = () => ({ top: 0, right: 0, bottom: 0, left: 0 });
