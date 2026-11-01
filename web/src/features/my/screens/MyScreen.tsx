import { useSubscriptions } from '@/web/subscriptions';
import { useSettingsStore } from '@/web/settings';
import { notify } from '@/web/toast';
import Constants from 'expo-constants';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BellIcon from '@/assets/icons/menu/bell.svg';
import CardIcon from '@/assets/icons/menu/card.svg';
import ChatIcon from '@/assets/icons/menu/chat.svg';
import CircleIcon from '@/assets/icons/menu/circle.svg';
import CloudIcon from '@/assets/icons/menu/cloud.svg';
import DownloadIcon from '@/assets/icons/menu/download.svg';
import InfoIcon from '@/assets/icons/menu/info.svg';
import ListIcon from '@/assets/icons/menu/list.svg';
import LockIcon from '@/assets/icons/menu/lock.svg';
import { PageHeader } from '@/components/common/PageHeader';
import { SettingsRow, SettingsSection } from '@/components/common/SettingsList';
import { Toggle } from '@/components/ui/Toggle';
import { mockSubscriptions } from '@/features/subscription/data/mockSubscriptions';
import { colors, radius, spacing, typography } from '@/theme';
import { formatWon } from '@/utils/format';

import { ProfileCard } from '../components/ProfileCard';
import { SavingsReportCard } from '../components/SavingsReportCard';
import { mockProfile, mockSavingsReport, mockSettings } from '../data/mockProfile';

export type MyMenu =
  | 'profile'
  | 'report'
  | 'subscriptions'
  | 'paymentMethods'
  | 'budget'
  | 'notifications'
  | 'communityActivity'
  | 'export'
  | 'backup'
  | 'notices'
  | 'contact'
  | 'withdraw';

type MyScreenProps = {
  onPressMenu?: (menu: MyMenu) => void;
  onLogout?: () => void;
};

export function MyScreen({ onPressMenu, onLogout }: MyScreenProps) {
  const [scrolled, setScrolled] = useState(false);
  const subscriptions = useSubscriptions();
  const {profile, budget, reminders} = useSettingsStore();
  const open = (menu: MyMenu) => () => onPressMenu?.(menu);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <PageHeader title="마이" elevated={scrolled} />

      <ScrollView
        contentContainerStyle={styles.content}
        scrollEventThrottle={16}
        onScroll={(e) => setScrolled(e.nativeEvent.contentOffset.y > 0)}
      >
        <ProfileCard {...profile} onPressEdit={open('profile')} />
        <SavingsReportCard {...mockSavingsReport} onPressReport={open('report')} />

        <View style={styles.sections}>
          <SettingsSection title="구독 관리">
            <SettingsRow
              icon={<ListIcon width={13.8} height={11.8} />}
              title="내 구독 관리"
              value={`${subscriptions.length}개`}
              onPress={open('subscriptions')}
            />
            <SettingsRow
              icon={<CardIcon width={17.8} height={13.8} />}
              title="결제수단 관리"
              value={`카드 ${mockSettings.paymentMethodCount}개`}
              onPress={open('paymentMethods')}
            />
            <SettingsRow
              icon={<SymbolInCircle symbol="₩" fontSize={10.5} />}
              title="월 예산"
              value={formatWon(budget)}
              onPress={open('budget')}
            />
            <SettingsRow
              icon={<BellIcon width={17.8} height={21.3} />}
              title="알림 설정"
              value={reminders.map((d) => `D-${d}`).join(', ')}
              onPress={open('notifications')}
            />
          </SettingsSection>

          <SettingsSection title="커뮤니티">
            <SettingsRow
              icon={<ChatIcon width={20.8} height={15.8} />}
              title="커뮤니티 활동"
              subtitle="내가 쓴 글 · 참여 중인 파티"
              onPress={open('communityActivity')}
            />
          </SettingsSection>

          <SettingsSection title="데이터 · 보안">
            <SettingsRow
              icon={<DownloadIcon width={17.8} height={16.8} />}
              title="데이터 내보내기"
              subtitle="CSV, 엑셀로 저장"
              onPress={open('export')}
            />
            <SettingsRow
              icon={<CloudIcon width={18.94} height={13.18} />}
              title="백업 / 동기화"
              subtitle="브라우저 데이터 백업 파일 저장"
              onPress={open('backup')}
            />
            <SettingsRow
              icon={<LockIcon width={13.8} height={17.3} />}
              title="앱 잠금"
              subtitle="생체 잠금은 모바일 앱에서 지원"
              accessory={<Toggle value={false} onChange={() => notify('브라우저에서는 앱의 생체 잠금을 지원하지 않아요.')}  accessibilityLabel="앱 잠금" />}
            />
          </SettingsSection>

          <SettingsSection title="고객지원">
            <SettingsRow icon={<InfoIcon width={17.8} height={17.8} />} title="공지사항" onPress={open('notices')} />
            <SettingsRow
              icon={<SymbolInCircle symbol="?" fontSize={12} />}
              title="문의하기"
              onPress={open('contact')}
            />
          </SettingsSection>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={onLogout}
          style={({ pressed }) => [styles.logout, pressed && styles.logoutPressed]}
        >
          <Text style={styles.logoutText}>로그아웃</Text>
        </Pressable>

        <View style={styles.footer}>
          <Pressable accessibilityRole="button" hitSlop={8} onPress={open('withdraw')}>
            <Text style={styles.withdraw}>회원탈퇴</Text>
          </Pressable>
          <Text style={styles.version}>{`루틴슬림 v${Constants.expoConfig?.version ?? ''}`}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/** 원형 테두리 아이콘 안에 글자(₩, ?)를 얹은 메뉴 아이콘 */
function SymbolInCircle({ symbol, fontSize }: { symbol: string; fontSize: number }) {
  return (
    <View style={styles.symbolIcon}>
      <CircleIcon width={17.8} height={17.8} style={StyleSheet.absoluteFill} />
      <Text style={[styles.symbolText, { fontSize }]}>{symbol}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundMuted,
  },
  content: {
    gap: 14,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  sections: {
    gap: 17,
    marginTop: 3,
  },
  symbolIcon: {
    width: 17.8,
    height: 17.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    fontWeight: '700',
    color: colors.primary,
  },
  logout: {
    height: 52,
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
  },
  logoutPressed: {
    backgroundColor: colors.backgroundMuted,
  },
  logoutText: {
    ...typography.settingsTitle,
    color: colors.textPrimary,
  },
  footer: {
    alignItems: 'center',
    gap: 11,
    marginTop: 4,
  },
  withdraw: {
    ...typography.caption,
    color: colors.textMuted,
  },
  version: {
    ...typography.small,
    color: colors.textPlaceholder,
  },
});
