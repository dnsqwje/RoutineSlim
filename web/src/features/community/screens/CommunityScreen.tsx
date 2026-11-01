import { useCommunityPosts } from '@/web/community';
import { OptionSheet } from '@/components/common/OptionSheet';
import { FormInput } from '@/components/ui/FormField';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ChevronDownIcon from '@/assets/icons/chevron-down.svg';
import SearchIcon from '@/assets/icons/search.svg';
import SquarePenIcon from '@/assets/icons/square-pen.svg';
import { PageHeader } from '@/components/common/PageHeader';
import { FAB_CONTENT_INSET, FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { colors, spacing, typography } from '@/theme';

import { BOARD_OPTIONS } from '../boards';
import { PartyPostCard } from '../components/PartyPostCard';

import type { CommunityBoard, PartyPost } from '../types';

type CommunityScreenProps = {
  initialBoard?: CommunityBoard;
  onPressSearch?: () => void;
  onPressServiceFilter?: () => void;
  onPressSort?: () => void;
  onPressPost?: (post: PartyPost) => void;
  onPressWrite?: (board: CommunityBoard) => void;
};

export function CommunityScreen({
  initialBoard = 'party',
  onPressSearch,
  onPressServiceFilter,
  onPressSort,
  onPressPost,
  onPressWrite,
}: CommunityScreenProps) {
  const [board, setBoard] = useState<CommunityBoard>(initialBoard);
  const allPosts = useCommunityPosts();
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [service, setService] = useState('');
  const [sortNewest, setSortNewest] = useState(true);
  const posts = allPosts.filter(post => (post.board ?? 'party') === board && (!service || post.serviceName === service) && `${post.title} ${post.description}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sortNewest ? Date.parse(b.createdAt) - Date.parse(a.createdAt) : b.commentCount - a.commentCount);
  const serviceOptions = [{value:'',label:'전체 서비스'}, ...[...new Set(allPosts.map(p => p.serviceName))].map(name => ({value:name,label:name}))];

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <PageHeader
        title="커뮤니티"
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="검색" hitSlop={8} onPress={() => {setSearching(!searching); onPressSearch?.();}}>
            <SearchIcon width={22} height={22} />
          </Pressable>
        }
      />

      <View style={styles.body}>
        <FlatList
          data={posts}
          keyExtractor={(post) => post.id}
          contentContainerStyle={styles.content}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={
            <View style={styles.header}>
              {searching ? <FormInput placeholder="게시글 검색" value={query} onChangeText={setQuery} accessibilityLabel="게시글 검색"/> : null}
              <SegmentedControl options={BOARD_OPTIONS} value={board} onChange={setBoard} />
              <View style={styles.filters}>
                <Pressable accessibilityRole="button" hitSlop={8} onPress={() => {setFiltering(true); onPressServiceFilter?.();}} style={styles.serviceFilter}>
                  <Text style={styles.serviceFilterText}>{service || '전체 서비스'}</Text>
                  <ChevronDownIcon width={14} height={14} />
                </Pressable>
                <Pressable accessibilityRole="button" hitSlop={8} onPress={() => {setSortNewest(!sortNewest); onPressSort?.();}}>
                  <Text style={styles.sort}>{sortNewest ? '최신순 ↓' : '댓글순 ↓'}</Text>
                </Pressable>
              </View>
            </View>
          }
          ListEmptyComponent={<Text style={styles.empty}>아직 게시글이 없어요</Text>}
          renderItem={({ item }) => <PartyPostCard post={item}  onPress={() => onPressPost?.(item)} />}
        />

        <FloatingActionButton
          accessibilityLabel="글쓰기"
          icon={<SquarePenIcon width={24} height={24} />}
          onPress={() => onPressWrite?.(board)}
        />
      </View>
      <OptionSheet visible={filtering} title="서비스 선택" options={serviceOptions} selected={service} onSelect={setService} onClose={() => setFiltering(false)}/>
    </SafeAreaView>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundMuted,
  },
  body: {
    flex: 1,
  },
  content: {
    paddingTop: 6,
    paddingHorizontal: spacing.xl,
    paddingBottom: FAB_CONTENT_INSET,
  },
  header: {
    gap: 10,
    marginBottom: 10,
  },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  serviceFilterText: {
    ...typography.captionSmBold,
    color: colors.textTitle,
  },
  sort: {
    ...typography.meta,
    color: colors.textSubtle,
  },
  separator: {
    height: 10,
  },
  empty: {
    ...typography.captionSm,
    paddingVertical: 48,
    textAlign: 'center',
    color: colors.textSubtle,
  },
});
