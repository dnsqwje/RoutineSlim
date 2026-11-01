import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CalendarDaysIcon from '@/assets/icons/calendar-days-muted.svg';
import { BackHeader } from '@/components/common/BackHeader';
import { OptionSheet } from '@/components/common/OptionSheet';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FormField, FormInput, FormSelect, formStyles } from '@/components/ui/FormField';
import { colors, spacing, typography } from '@/theme';
import { parseDateKey, type DateKey } from '@/utils/date';

import { CATEGORY_META, CATEGORY_ORDER } from '../categories';
import { mockPaymentMethods } from '../data/mockPaymentMethods';
import type { SubscriptionCategory } from '../types';
import {
  CYCLE_OPTIONS,
  digitsOnly,
  formatDateInput,
  parseDateInput,
  type BillingCycle,
} from '../utils/billingForm';

export type SubscriptionDraft = {
  name: string;
  category: SubscriptionCategory;
  price: number;
  cycle: BillingCycle;
  startDate: DateKey;
  paymentMethodId: string;
  memo?: string;
};

const CATEGORY_OPTIONS = CATEGORY_ORDER.map((c) => ({ value: c, label: CATEGORY_META[c].label }));
const PAYMENT_OPTIONS = mockPaymentMethods.map((m) => ({ value: m.id, label: m.label }));

const MEMO_MAX_LENGTH = 100;

function billingNotice(startDate: DateKey | null, cycle: BillingCycle) {
  if (!startDate) return '시작일을 입력하면 결제 알림 일정을 알려드려요.';
  const { year, month, day } = parseDateKey(startDate);
  return cycle === 'monthly'
    ? `${month}월부터 매월 ${day}일에 결제 알림을 보내드려요.`
    : `${year}년부터 매년 ${month}월 ${day}일에 결제 알림을 보내드려요.`;
}

type ManualSubscriptionScreenProps = {
  onBack: () => void;
  onSubmit: (draft: SubscriptionDraft) => void;
};

export function ManualSubscriptionScreen({ onBack, onSubmit }: ManualSubscriptionScreenProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SubscriptionCategory | null>(null);
  const [priceInput, setPriceInput] = useState('');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [dateInput, setDateInput] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [memo, setMemo] = useState('');
  const [openSheet, setOpenSheet] = useState<'category' | 'cycle' | 'payment' | null>(null);

  const price = Number(priceInput) || 0;
  const startDate = parseDateInput(dateInput);
  const canSubmit = name.trim().length > 0 && !!category && price > 0 && !!startDate && !!paymentMethodId;

  const submit = () => {
    if (!canSubmit || !category || !startDate || !paymentMethodId) return;
    onSubmit({
      name: name.trim(),
      category,
      price,
      cycle,
      startDate,
      paymentMethodId,
      memo: memo.trim() || undefined,
    });
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <BackHeader title="직접 입력" onBack={onBack} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.intro}>
            <Text style={styles.introText}>새 구독 정보를 입력해주세요</Text>
            <Badge label="저장 전" />
          </View>

          <FormField label="서비스 이름">
            <FormInput value={name} onChangeText={setName} placeholder="예: 왓챠" maxLength={30} />
          </FormField>

          <FormField label="카테고리">
            <FormSelect
              value={category ? CATEGORY_META[category].label : undefined}
              placeholder="카테고리 선택"
              onPress={() => setOpenSheet('category')}
            />
          </FormField>

          <View style={styles.row}>
            <FormField label="결제 금액" style={styles.flex}>
              <FormInput
                value={price > 0 ? price.toLocaleString('ko-KR') : ''}
                onChangeText={(t) => setPriceInput(digitsOnly(t).slice(0, 9))}
                placeholder="0"
                keyboardType="number-pad"
                trailing={<Text style={styles.unit}>원</Text>}
                accessibilityLabel="결제 금액"
              />
            </FormField>

            <FormField label="결제 주기" style={styles.flex}>
              <FormSelect
                value={CYCLE_OPTIONS.find((o) => o.value === cycle)?.label}
                placeholder="결제 주기"
                onPress={() => setOpenSheet('cycle')}
              />
            </FormField>
          </View>

          <FormField label="시작일">
            <FormInput
              value={dateInput}
              onChangeText={(t) => setDateInput(formatDateInput(t))}
              placeholder="YYYY. MM. DD"
              keyboardType="number-pad"
              maxLength={12}
              trailing={<CalendarDaysIcon width={17} height={17} />}
              accessibilityLabel="시작일"
            />
          </FormField>

          <FormField label="결제 수단">
            <FormSelect
              value={mockPaymentMethods.find((m) => m.id === paymentMethodId)?.label}
              placeholder="결제 수단 선택"
              onPress={() => setOpenSheet('payment')}
            />
          </FormField>

          <FormField label="메모 (선택)">
            <View style={[formStyles.box, styles.memoBox]}>
              <TextInput
                value={memo}
                onChangeText={setMemo}
                placeholder="구독 용도 등을 적어두세요"
                placeholderTextColor={colors.textPlaceholder}
                multiline
                maxLength={MEMO_MAX_LENGTH}
                textAlignVertical="top"
                style={styles.memoInput}
              />
            </View>
          </FormField>

          <Text style={styles.notice}>{billingNotice(startDate, cycle)}</Text>

          <View style={styles.spacer} />

          <Button size="md" title="구독 저장" disabled={!canSubmit} onPress={submit} />
        </ScrollView>
      </KeyboardAvoidingView>

      <OptionSheet
        visible={openSheet === 'category'}
        title="카테고리"
        options={CATEGORY_OPTIONS}
        selected={category}
        onSelect={setCategory}
        onClose={() => setOpenSheet(null)}
      />
      <OptionSheet
        visible={openSheet === 'cycle'}
        title="결제 주기"
        options={CYCLE_OPTIONS}
        selected={cycle}
        onSelect={setCycle}
        onClose={() => setOpenSheet(null)}
      />
      <OptionSheet
        visible={openSheet === 'payment'}
        title="결제 수단"
        options={PAYMENT_OPTIONS}
        selected={paymentMethodId}
        onSelect={setPaymentMethodId}
        onClose={() => setOpenSheet(null)}
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
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  introText: {
    ...typography.bodyRegular,
    color: colors.textSubtle,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  unit: {
    ...typography.formInput,
    color: colors.textTitle,
  },
  memoBox: {
    height: 80,
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
  },
  memoInput: {
    ...formStyles.input,
    alignSelf: 'stretch',
  },
  notice: {
    ...typography.meta,
    color: colors.textSubtle,
  },
  spacer: {
    flex: 1,
  },
});
