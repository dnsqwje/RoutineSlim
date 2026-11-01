import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EllipsisIcon from '@/assets/icons/ellipsis.svg';
import MessageCircleIcon from '@/assets/icons/message-circle-md.svg';
import UserPlusIcon from '@/assets/icons/user-plus.svg';
import UserRoundIcon from '@/assets/icons/user-round.svg';
import { BackHeader } from '@/components/common/BackHeader';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ServiceLogoView } from '@/features/subscription/components/ServiceLogoView';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import { formatTimeAgo, formatWon } from '@/utils/format';

import type { PartyPost } from '../types';

type PartyPostDetailScreenProps = {
  post: PartyPost;
  now?: string;
  onBack: () => void;
  onPressMore?: () => void;
  onPressComments?: () => void;
  onRequestJoin?: () => void;
};

export function PartyPostDetailScreen({
  post,
  now,
  onBack,
  onPressMore,
  onPressComments,
  onRequestJoin,
}: PartyPostDetailScreenProps) {
  const recruiting = post.status === 'recruiting';
  const isFull = post.currentMembers >= post.maxMembers;
  const latestComment = post.comments[0];

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <BackHeader
        title={post.board === 'review' ? '구독 후기' : post.board === 'free' ? '자유 게시판' : '파티원 모집'}
        onBack={onBack}
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="더보기" hitSlop={8} onPress={onPressMore}>
            <EllipsisIcon width={22} height={22} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <View style={styles.tags}>
            <Badge label={post.serviceName} />
            <Badge label={recruiting ? '모집 중' : '모집 완료'} tone={recruiting ? 'positive' : 'neutral'} />
          </View>
          <Text style={styles.title}>{post.title}</Text>
          <View style={styles.author}>
            <View style={styles.avatar}>
              <UserRoundIcon width={18} height={18} />
            </View>
            <Text style={styles.authorName}>{post.authorName}</Text>
            <Text style={styles.meta}>{`${formatTimeAgo(post.createdAt, now)} · 조회 ${post.viewCount}`}</Text>
          </View>
        </View>

        {(!post.board || post.board === 'party') ? <Card style={styles.pricingCard}>
          <View style={styles.pricing}>
            <ServiceLogoView logo={post.serviceLogo} size="lg" />
            <View style={styles.pricingTexts}>
              <Text style={styles.pricingLabel}>1인당 월 구독료</Text>
              <Text style={styles.pricingAmount}>{formatWon(post.pricePerMember)}</Text>
            </View>
            <Badge label={`${post.currentMembers}/${post.maxMembers}명`} />
          </View>
          <View style={styles.divider} />
          <View style={styles.terms}>
            <Text style={styles.termsTotal}>{`전체 ${formatWon(post.totalPrice)} / 월`}</Text>
            <Text style={styles.termsSettlement}>{`매월 ${post.settlementDay}일 정산`}</Text>
          </View>
        </Card> : null}

        <View style={styles.body}>
          <Text style={styles.bodyTitle}>{post.body.title}</Text>
          <Text style={styles.bodyContent}>{post.body.content}</Text>
        </View>

        <View style={styles.comments}>
          <Pressable
            accessibilityRole="button"
            disabled={!onPressComments}
            onPress={onPressComments}
            style={styles.commentsHeading}
          >
            <MessageCircleIcon width={16} height={16} />
            <Text style={styles.commentsTitle}>{`댓글 ${post.commentCount}`}</Text>
          </Pressable>
          {latestComment ? (
            <View style={styles.commentCard}>
              <Text style={styles.commentMeta}>
                {`${latestComment.authorName} · ${formatTimeAgo(latestComment.createdAt, now)}`}
              </Text>
              <Text style={styles.commentContent}>{latestComment.content}</Text>
            </View>
          ) : (
            <Text style={styles.noComment}>아직 댓글이 없어요. 궁금한 점을 남겨보세요!</Text>
          )}
        </View>
      </ScrollView>

      {(!post.board || post.board === 'party') ? <View style={styles.footer}>
        <Button
          size="md"
          title={!recruiting || isFull ? '모집이 마감됐어요' : '참여 요청하기'}
          icon={recruiting && !isFull ? <UserPlusIcon width={20} height={20} /> : undefined}
          disabled={!recruiting || isFull}
          onPress={onRequestJoin}
        />
      </View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundMuted,
  },
  content: {
    gap: 18,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  intro: {
    gap: spacing.md,
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
  },
  title: {
    ...typography.postDetailTitle,
    color: colors.textTitle,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  authorName: {
    ...typography.captionSmBold,
    flex: 1,
    color: colors.textTitle,
  },
  meta: {
    ...typography.micro,
    color: colors.textSubtle,
  },
  pricingCard: {
    gap: spacing.md,
    padding: 18,
  },
  pricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pricingTexts: {
    flex: 1,
    gap: 3,
  },
  pricingLabel: {
    ...typography.meta,
    color: colors.textSubtle,
  },
  pricingAmount: {
    ...typography.amountPerPerson,
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  terms: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  termsTotal: {
    ...typography.meta,
    color: colors.textSubtle,
  },
  termsSettlement: {
    ...typography.metaBold,
    color: colors.textTitle,
  },
  body: {
    gap: 10,
  },
  bodyTitle: {
    ...typography.postTitle,
    color: colors.textTitle,
  },
  bodyContent: {
    ...typography.bodyRegular,
    color: colors.textSubtle,
  },
  comments: {
    gap: spacing.sm,
  },
  commentsHeading: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  commentsTitle: {
    ...typography.listTitle,
    color: colors.textTitle,
  },
  commentCard: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    ...shadows.card,
  },
  commentMeta: {
    ...typography.metaBold,
    color: colors.textTitle,
  },
  commentContent: {
    ...typography.captionSm,
    color: colors.textSubtle,
  },
  noComment: {
    ...typography.captionSm,
    color: colors.textSubtle,
  },
  footer: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
});
