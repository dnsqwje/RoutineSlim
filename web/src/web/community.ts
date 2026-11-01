import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PartyPost, CommunityBoard } from '@/features/community/types';
import type { PostDraft } from '@/features/community/screens/WritePostScreen';
import { mockPartyPosts } from '@/features/community/data/mockPosts';
import { mockSubscriptions } from '@/features/subscription/data/mockSubscriptions';
import { colors } from '@/theme';
type StoredPost = Omit<PartyPost, 'serviceLogo'> & { board: CommunityBoard; serviceId: string };
export const useCommunityStore = create<{
 posts: StoredPost[];
 joined: string[];
 comments: Record<string, PartyPost['comments']>;
 add: (draft: PostDraft) => string;
 join: (id: string) => void;
 comment: (id: string, text: string) => void;
}>()(persist((set, get) => ({
 posts: [], joined: [], comments: {},
 add: draft => {
   const service = mockSubscriptions.find(s => s.id === draft.serviceId);
   const id = crypto.randomUUID();
   const post: StoredPost = { id, serviceId: draft.serviceId, board: draft.board,
     serviceName: service?.name ?? '구독', status: 'recruiting', title: draft.title, description: draft.content.slice(0, 100),
     currentMembers: draft.party?.currentMembers ?? 1, maxMembers: draft.party?.maxMembers ?? 1,
     totalPrice: service?.price ?? 0, pricePerMember: draft.party?.pricePerMember ?? 0, settlementDay: 12,
     authorName: '나', createdAt: new Date().toISOString(), viewCount: 0, commentCount: 0,
     body: {title: draft.title, content: draft.content}, comments: [],
   };
   set(s => ({posts: [post, ...s.posts]})); return id;
 },
 join: id => {if (!get().joined.includes(id)) set(s => ({joined: [...s.joined, id]}));},
 comment: (id, text) => set(s => ({ comments: {...s.comments, [id]: [{id: crypto.randomUUID(), content: text.trim(), authorName: '나', createdAt: new Date().toISOString()}, ...(s.comments[id] ?? [])]} })),
}), {name: 'routineslim.community.v1'}));
export function useCommunityPosts(): PartyPost[] {
 const posts = useCommunityStore(s => s.posts); const comments = useCommunityStore(s => s.comments);
 return useMemo(() => [...posts.map(post => ({...post, serviceLogo: mockSubscriptions.find(s => s.id === post.serviceId)?.logo ?? {kind: 'text' as const, text: 'R', color: colors.primary, fontSize: 20, background: colors.primarySoft}})), ...mockPartyPosts]
 .map(post => ({...post, comments: [...(comments[post.id] ?? []), ...post.comments], commentCount: post.commentCount + (comments[post.id]?.length ?? 0)})), [posts, comments]);
}
