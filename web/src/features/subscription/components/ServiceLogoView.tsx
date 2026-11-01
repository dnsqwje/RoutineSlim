import { StyleSheet, Text, View } from 'react-native';

import { radius } from '@/theme';

import type { ServiceLogo } from '../types';

const BASE_SIZE = 36;
const SIZES = { md: BASE_SIZE, lg: 42 } as const;

type ServiceLogoViewProps = {
  logo: ServiceLogo;
  size?: keyof typeof SIZES;
};

export function ServiceLogoView({ logo, size = 'md' }: ServiceLogoViewProps) {
  const boxSize = SIZES[size];
  const scale = boxSize / BASE_SIZE;

  return (
    <View style={[styles.container, { width: boxSize, height: boxSize, backgroundColor: logo.background }]}>
      {logo.kind === 'text' ? (
        <Text style={[styles.text, { color: logo.color, fontSize: logo.fontSize * scale }]}>{logo.text}</Text>
      ) : size === 'lg' && logo.large ? (
        <logo.large.Icon width={logo.large.size} height={logo.large.size} />
      ) : (
        <logo.Icon width={logo.size * scale} height={logo.size * scale} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    fontWeight: '800',
  },
});
