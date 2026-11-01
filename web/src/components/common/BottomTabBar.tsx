import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, typography } from '@/theme';

// expo-router 버전마다 탭 바 props 타입의 export 위치가 달라 Tabs 의 tabBar prop 에서 꺼내 쓴다
type BottomTabBarProps = {
  state: { index: number; routes: {key: string; name: string}[] };
  descriptors: Record<string, {options: {title: string; tabBarIcon?: (props: {focused: boolean; color: string; size: number}) => ReactNode}}>;
  emitter: {emit: (event: unknown) => {defaultPrevented: boolean}};
  navigateToTab: (key: string) => void;
  insets: {bottom: number};
};

export function BottomTabBar({ state, descriptors, emitter, navigateToTab, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const label = typeof options.title === 'string' ? options.title : route.name;

        const onPress = () => {
          const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigateToTab(route.key);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            aria-selected={focused}
            onPress={onPress}
            style={styles.tab}
          >
            {options.tabBarIcon?.({
              focused,
              color: focused ? colors.primary : colors.iconInactive,
              size: 21,
            })}
            <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    backgroundColor: colors.white,
  },
  tab: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    ...typography.tabLabel,
    color: colors.textSubtle,
  },
  labelFocused: {
    fontWeight: '700',
    color: colors.primary,
  },
});
