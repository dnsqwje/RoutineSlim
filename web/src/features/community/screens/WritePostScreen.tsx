import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SquareCheckIcon from '@/assets/icons/square-check.svg';
import UsersIcon from '@/assets/icons/users-muted.svg';
import { BackHeader } from '@/components/common/BackHeader';
import { OptionSheet } from '@/components/common/OptionSheet';
import { Button } from '@/components/ui/Button';
import { FormField, FormInput, FormSelect, formStyles } from '@/components/ui/FormField';
import { mockSubscriptions } from '@/features/subscription/data/mockSubscriptions';
import { colors, radius, spacing, typography } from '@/theme';

import { BOARD_OPTIONS } from '../boards';
import type { CommunityBoard } from '../types';

const CONTENT_MAX_LENGTH = 2000;

const SERVICE_OPTIONS = mockSubscriptions.map((s) => ({ value: s.id, label: s.name }));

export type PostDraft = {
  board: CommunityBoard;
  serviceId: string;
  title: string;
  content: string;
  /** 파티원 모집 게시판일 때만 */
  party?: { currentMembers: number; maxMembers: number; pricePerMember: number };
};

type WritePostScreenProps = {
  initialBoard?: CommunityBoard;
  onBack: () => void;
  onSubmit: (draft: PostDraft) => void;
};

const toNumber = (text: string) => Number(text.replace(/[^0-9]/g, '')) || 0;
const digitsOnly = (text: string) => text.replace(/[^0-9]/g, '');

export function WritePostScreen({ initialBoard = 'party', onBack, onSubmit }: WritePostScreenProps) {
  const [board, setBoard] = useState<CommunityBoard>(initialBoard);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [currentMembers, setCurrentMembers] = useState('');
  const [maxMembers, setMaxMembers] = useState('');
  // 직접 입력하기 전까지는 '서비스 요금 ÷ 전체 인원'을 자동으로 채운다
  const [priceInput, setPriceInput] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [openSheet, setOpenSheet] = useState<'board' | 'service' | null>(null);

  const service = mockSubscriptions.find((s) => s.id === serviceId);
  const current = toNumber(currentMembers);
  const max = toNumber(maxMembers);
  const suggestedPrice = service && max > 0 ? Math.ceil(service.price / max / 10) * 10 : 0;
  const price = priceInput !== null ? toNumber(priceInput) : suggestedPrice;

  const isParty = board === 'party';
  const partyValid = !isParty || (current >= 1 && max >= 2 && current < max && price > 0);
  const canSubmit = !!service && title.trim().length > 0 && content.trim().length > 0 && agreed && partyValid;

  const submit = () => {
    if (!canSubmit || !serviceId) return;
    onSubmit({
      board,
      serviceId,
      title: title.trim(),
      content: content.trim(),
      party: isParty ? { currentMembers: current, maxMembers: max, pricePerMember: price } : undefined,
    });
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <BackHeader title="글 작성" onBack={onBack} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <FormField label="게시판">
            <FormSelect
              value={BOARD_OPTIONS.find((o) => o.value === board)?.label}
              placeholder="게시판 선택"
              onPress={() => setOpenSheet('board')}
            />
          </FormField>

          <FormField label="서비스">
            <FormSelect value={service?.name} placeholder="서비스 선택" onPress={() => setOpenSheet('service')} />
          </FormField>

          <FormField label="제목">
            <FormInput value={title} onChangeText={setTitle} placeholder="제목을 입력해주세요" maxLength={50} />
          </FormField>

          {isParty ? (
            <View style={styles.row}>
              <FormField label="참여 인원 / 전체 인원" style={styles.flex}>
                <View style={formStyles.box}>
                  <View style={styles.members}>
                    <TextInput
                      value={currentMembers}
                      onChangeText={(t) => setCurrentMembers(digitsOnly(t))}
                      placeholder="2"
                      placeholderTextColor={colors.textPlaceholder}
                      keyboardType="number-pad"
                      maxLength={2}
                      style={styles.memberInput}
                      accessibilityLabel="현재 참여 인원"
                    />
                    <Text style={styles.unit}>명 / </Text>
                    <TextInput
                      value={maxMembers}
                      onChangeText={(t) => setMaxMembers(digitsOnly(t))}
                      placeholder="4"
                      placeholderTextColor={colors.textPlaceholder}
                      keyboardType="number-pad"
                      maxLength={2}
                      style={styles.memberInput}
                      accessibilityLabel="전체 인원"
                    />
                    <Text style={styles.unit}>명</Text>
                  </View>
                  <UsersIcon width={17} height={17} />
                </View>
              </FormField>

              <FormField label="1인당 월 금액" style={styles.flex}>
                <FormInput
                  value={price > 0 ? price.toLocaleString('ko-KR') : ''}
                  onChangeText={(t) => setPriceInput(digitsOnly(t))}
                  placeholder="0"
                  keyboardType="number-pad"
                  trailing={<Text style={styles.unit}>원</Text>}
                  accessibilityLabel="1인당 월 금액"
                />
              </FormField>
            </View>
          ) : null}

          <FormField label="내용">
            <View style={[formStyles.box, styles.contentBox]}>
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder={'모집 조건, 정산 방법 등을 자유롭게 적어주세요.'}
                placeholderTextColor={colors.textPlaceholder}
                multiline
                maxLength={CONTENT_MAX_LENGTH}
                textAlignVertical="top"
                style={styles.contentInput}
              />
              <Text style={styles.counter}>
                {`${content.length.toLocaleString('ko-KR')} / ${CONTENT_MAX_LENGTH.toLocaleString('ko-KR')}`}
              </Text>
            </View>
          </FormField>

          <Pressable
            accessibilityRole="checkbox"
            aria-checked={agreed}
            onPress={() => setAgreed((v) => !v)}
            style={styles.agreement}
          >
            {agreed ? <SquareCheckIcon width={18} height={18} /> : <View style={styles.uncheckedBox} />}
            <Text style={styles.agreementText}>
              {'서비스 이용 약관과 커뮤니티 가이드를 확인했어요.\n개인정보나 계정 비밀번호는 게시하지 마세요.'}
            </Text>
          </Pressable>
        </ScrollView>

        <View style={styles.footer}>
          <Button size="md" title="게시하기" disabled={!canSubmit} onPress={submit} />
        </View>
      </KeyboardAvoidingView>

      <OptionSheet
        visible={openSheet === 'board'}
        title="게시판"
        options={BOARD_OPTIONS}
        selected={board}
        onSelect={setBoard}
        onClose={() => setOpenSheet(null)}
      />
      <OptionSheet
        visible={openSheet === 'service'}
        title="서비스"
        options={SERVICE_OPTIONS}
        selected={serviceId}
        onSelect={(id) => {
          setServiceId(id);
          setPriceInput(null);
        }}
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
    gap: spacing.md,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  members: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberInput: {
    ...typography.formInput,
    width: 18,
    padding: 0,
    textAlign: 'right',
    color: colors.textTitle,
  },
  unit: {
    ...typography.formInput,
    color: colors.textTitle,
  },
  contentBox: {
    height: 154,
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: spacing.sm,
    padding: 13,
  },
  contentInput: {
    ...typography.bodyRegular,
    flex: 1,
    padding: 0,
    color: colors.textTitle,
  },
  counter: {
    ...typography.micro,
    alignSelf: 'flex-end',
    color: colors.textSubtle,
  },
  agreement: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  uncheckedBox: {
    width: 15,
    height: 15,
    margin: 1.5,
    borderWidth: 1.8,
    borderColor: colors.primary,
    borderRadius: 3,
  },
  agreementText: {
    ...typography.meta,
    flex: 1,
    color: colors.textSubtle,
  },
  footer: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
});
