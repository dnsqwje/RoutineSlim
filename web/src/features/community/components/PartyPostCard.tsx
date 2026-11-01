import { Pressable, StyleSheet, Text, View } from 'react-native';

import MessageCircleIcon from '@/assets/icons/message-circle.svg';
import UsersIcon from '@/assets/icons/users.svg';
import { Badge } from '@/components/ui/Badge';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import { formatTimeAgo, formatWon } from '@/utils/format';

import type { PartyPost } from '../types';

type PartyPostCardProps = {
  post: PartyPost;
  now?: string;
  onPress?: () => void;
};

export function PartyPostCard({ post, now, onPress }: PartyPostCardProps) {
  const recruiting = post.status === 'recruiting';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.tags}>
        <Badge label={post.serviceName} />
        {(!post.board || post.board === 'party') ? <Badge label={recruiting ? '모집 중' : '모집 완료'} tone={recruiting ? 'positive' : 'neutral'} /> : null}
      </View>

      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.description}>{post.description}</Text>

      {(!post.board || post.board === 'party') ? <View style={styles.partyRow}>
        <UsersIcon width={16} height={16} />
        <Text style={styles.members}>{`${post.currentMembers}/${post.maxMembers}명 참여`}</Text>
        <Text style={styles.price}>{formatWon(post.pricePerMember)}</Text>
        <Text style={styles.priceUnit}>/ 월·인</Text>
      </View> : null}

      <View style={styles.metaRow}>
        <Text style={styles.meta}>{`${post.authorName} · ${formatTimeAgo(post.createdAt, now)}`}</Text>
        <MessageCircleIcon width={13} height={13} />
        <Text style={styles.comments}>{` ${post.commentCount}`}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 7,
    padding: 14,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.85,
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
  },
  title: {
    ...typography.postTitle,
    color: colors.textTitle,
  },
  description: {
    ...typography.meta,
    color: colors.textSubtle,
  },
  partyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  members: {
    ...typography.captionSmBold,
    flex: 1,
    color: colors.primary,
  },
  price: {
    ...typography.postTitle,
    color: colors.textTitle,
  },
  priceUnit: {
    ...typography.micro,
    color: colors.textSubtle,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meta: {
    ...typography.micro,
    flex: 1,
    color: colors.textSubtle,
    marginRight: spacing.xs,
  },
  comments: {
    ...typography.micro,
    color: colors.textSubtle,
  },
});
