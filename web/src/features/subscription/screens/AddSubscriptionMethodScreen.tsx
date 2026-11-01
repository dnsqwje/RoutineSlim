import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ScanLineIcon from '@/assets/icons/scan-line.svg';
import ShieldCheckIcon from '@/assets/icons/shield-check.svg';
import SquarePenIcon from '@/assets/icons/square-pen-primary.svg';
import { BackHeader } from '@/components/common/BackHeader';
import { colors, spacing, typography } from '@/theme';

import { AddMethodCard } from '../components/AddMethodCard';

type AddSubscriptionMethodScreenProps = {
  onBack: () => void;
  onPressScan?: () => void;
  onPressManual?: () => void;
};

export function AddSubscriptionMethodScreen({ onBack, onPressScan, onPressManual }: AddSubscriptionMethodScreenProps) {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <BackHeader title="구독 추가" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.title}>{'어떤 방법으로\n구독을 추가할까요?'}</Text>
          <Text style={styles.subtitle}>한 번 등록하면 결제일을 챙겨드려요.</Text>
        </View>

        <AddMethodCard
          icon={<ScanLineIcon width={27} height={27} />}
          badge="빠른 등록"
          title="영수증/캡처 스캔"
          description={'결제 영수증이나 구독 화면을 올리면\n서비스와 결제 정보를 자동으로 읽어요.'}
          onPress={onPressScan}
        />
        <AddMethodCard
          icon={<SquarePenIcon width={27} height={27} />}
          title="직접 입력"
          description={'서비스 이름부터 결제일까지\n내 구독 정보를 직접 입력해요.'}
          onPress={onPressManual}
        />

        <View style={styles.spacer} />

        <View style={styles.privacyNote}>
          <ShieldCheckIcon width={16} height={16} />
          <Text style={styles.privacyText}>등록한 정보는 나에게만 보여요</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundMuted,
  },
  content: {
    flexGrow: 1,
    gap: spacing.xl,
    paddingTop: 26,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  intro: {
    gap: 10,
  },
  title: {
    ...typography.introTitle,
    color: colors.textTitle,
  },
  subtitle: {
    ...typography.body14Regular,
    color: colors.textSubtle,
  },
  spacer: {
    flex: 1,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  privacyText: {
    ...typography.meta,
    color: colors.textSubtle,
  },
});
