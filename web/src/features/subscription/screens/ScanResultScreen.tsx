import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CalendarDaysIcon from '@/assets/icons/calendar-days-muted.svg';
import CircleCheckIcon from '@/assets/icons/circle-check-positive.svg';
import ExpandIcon from '@/assets/icons/expand.svg';
import InfoIcon from '@/assets/icons/info-primary.svg';
import PencilIcon from '@/assets/icons/pencil.svg';
import { BackHeader } from '@/components/common/BackHeader';
import { OptionSheet } from '@/components/common/OptionSheet';
import { Button } from '@/components/ui/Button';
import { FormField, FormInput, FormSelect } from '@/components/ui/FormField';
import { colors, radius, spacing, typography } from '@/theme';
import type { DateKey } from '@/utils/date';
import { formatWon } from '@/utils/format';

import { ServiceLogoView } from '../components/ServiceLogoView';
import { mockSubscriptions } from '../data/mockSubscriptions';
import type { ScanResult } from '../data/mockScanResult';
import type { ServiceLogo } from '../types';
import {
  CYCLE_OPTIONS,
  digitsOnly,
  formatDateInput,
  parseDateInput,
  type BillingCycle,
} from '../utils/billingForm';

export type ScanResultDraft = {
  name: string;
  price: number;
  cycle: BillingCycle;
  nextBillingDate: DateKey;
  /** 이미 등록된 구독이면 그 id (업데이트 대상) */
  existingId?: string;
};

/** 등록된 구독이 아니면 서비스 이름 첫 글자로 로고를 대신한다 */
function fallbackLogo(name: string): ServiceLogo {
  return { kind: 'text', text: name.trim().charAt(0), color: colors.primary, fontSize: 20, background: colors.primarySoft };
}

type ScanResultScreenProps = {
  result: ScanResult;
  onBack: () => void;
  onPreviewSource?: () => void;
  onSubmit: (draft: ScanResultDraft) => void;
};

export function ScanResultScreen({ result, onBack, onPreviewSource, onSubmit }: ScanResultScreenProps) {
  const [name, setName] = useState(result.name);
  const [priceInput, setPriceInput] = useState(String(result.price));
  const [priceFocused, setPriceFocused] = useState(false);
  const [cycle, setCycle] = useState<BillingCycle>(result.cycle);
  const [dateInput, setDateInput] = useState(formatDateInput(result.nextBillingDate));
  const [cycleSheetOpen, setCycleSheetOpen] = useState(false);

  const price = Number(priceInput) || 0;
  const nextBillingDate = parseDateInput(dateInput);
  const existing = mockSubscriptions.find((s) => s.name === name.trim());
  const canSubmit = name.trim().length > 0 && price > 0 && !!nextBillingDate;

  // 편집 중에는 숫자만, 아닐 때는 시안처럼 '17,000원'으로 보여준다
  const priceText = price > 0 ? (priceFocused ? price.toLocaleString('ko-KR') : formatWon(price)) : '';

  const submit = () => {
    if (!canSubmit || !nextBillingDate) return;
    onSubmit({ name: name.trim(), price, cycle, nextBillingDate, existingId: existing?.id });
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <BackHeader title="스캔 결과 확인" onBack={onBack} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.success}>
            <CircleCheckIcon width={20} height={20} />
            <View style={styles.successText}>
              <Text style={styles.successTitle}>{result.source.title === '체험용 예시 결과' ? '체험용 예시 결과예요' : '구독 정보를 찾았어요'}</Text>
              <Text style={styles.successBody}>정보가 맞는지 확인하고 수정해주세요.</Text>
            </View>
          </View>

          <View style={styles.source}>
            <ServiceLogoView logo={existing?.logo ?? fallbackLogo(name || result.name)} size="lg" />
            <View style={styles.sourceText}>
              <Text style={styles.sourceTitle} numberOfLines={1}>
                {result.source.title}
              </Text>
              <Text style={styles.sourceMeta} numberOfLines={1}>
                {result.source.fileName}
              </Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="원본 이미지 크게 보기" hitSlop={10} onPress={onPreviewSource}>
              <ExpandIcon width={18} height={18} />
            </Pressable>
          </View>

          <FormField label="서비스 이름">
            <FormInput
              value={name}
              onChangeText={setName}
              placeholder="서비스 이름"
              maxLength={30}
              trailing={<PencilIcon width={17} height={17} />}
            />
          </FormField>

          <FormField label="결제 금액">
            <FormInput
              value={priceText}
              onChangeText={(t) => setPriceInput(digitsOnly(t).slice(0, 9))}
              onFocus={() => setPriceFocused(true)}
              onBlur={() => setPriceFocused(false)}
              placeholder="0원"
              keyboardType="number-pad"
              trailing={<PencilIcon width={17} height={17} />}
              accessibilityLabel="결제 금액"
            />
          </FormField>

          <FormField label="결제 주기">
            <FormSelect
              value={CYCLE_OPTIONS.find((o) => o.value === cycle)?.label}
              placeholder="결제 주기"
              onPress={() => setCycleSheetOpen(true)}
            />
          </FormField>

          <FormField label="다음 결제일">
            <FormInput
              value={dateInput}
              onChangeText={(t) => setDateInput(formatDateInput(t))}
              placeholder="YYYY. MM. DD"
              keyboardType="number-pad"
              maxLength={12}
              trailing={<CalendarDaysIcon width={17} height={17} />}
              accessibilityLabel="다음 결제일"
            />
          </FormField>

          {existing ? (
            <View style={styles.notice}>
              <InfoIcon width={16} height={16} />
              <Text style={styles.noticeText}>{'이미 등록된 구독이에요.\n확인하면 기존 결제 정보를 업데이트해요.'}</Text>
            </View>
          ) : null}

          <View style={styles.spacer} />

          <Button size="md" title={existing ? '확인하고 업데이트' : '구독 저장'} disabled={!canSubmit} onPress={submit} />
        </ScrollView>
      </KeyboardAvoidingView>

      <OptionSheet
        visible={cycleSheetOpen}
        title="결제 주기"
        options={CYCLE_OPTIONS}
        selected={cycle}
        onSelect={setCycle}
        onClose={() => setCycleSheetOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundMuted,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: spacing.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  success: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.positiveSoft,
  },
  successText: {
    flex: 1,
    gap: 3,
  },
  successTitle: {
    ...typography.listTitleLg,
    color: colors.positive,
  },
  successBody: {
    ...typography.meta,
    color: colors.positive,
  },
  source: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: 14,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
  },
  sourceText: {
    flex: 1,
    gap: spacing.xs,
  },
  sourceTitle: {
    ...typography.listTitle,
    color: colors.textTitle,
  },
  sourceMeta: {
    ...typography.meta,
    color: colors.textSubtle,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  noticeText: {
    ...typography.captionSm,
    flex: 1,
    color: colors.textSubtle,
  },
  spacer: {
    flex: 1,
  },
});
