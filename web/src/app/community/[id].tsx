import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { PartyPostDetailScreen } from '@/features/community/screens/PartyPostDetailScreen';
import { useCommunityPosts, useCommunityStore } from '@/web/community';
import { Sheet } from '@/web/Sheet';
import { notify } from '@/web/toast';
export default function PartyPostDetailRoute() {
 const { id } = useLocalSearchParams<{id: string}>();
 const post = useCommunityPosts().find(p => p.id === id);
 const joined = useCommunityStore(s => s.joined.includes(id));
 const [comments, setComments] = useState(false);
 const [text, setText] = useState('');
 const goBack = () => router.canGoBack() ? router.back() : router.replace('/community');
 if (!post) return <Sheet title="게시글을 찾을 수 없어요" onClose={goBack}><button className="primary-button" onClick={goBack}>목록으로</button></Sheet>;
 return <><PartyPostDetailScreen post={post} onBack={goBack}
   onPressComments={() => setComments(true)}
   onPressMore={() => notify('이 게시글은 브라우저 체험용 게시글이에요.')}
   onRequestJoin={() => {
     if (joined) {notify('이미 참여 요청을 기록했어요.'); return;}
     useCommunityStore.getState().join(id);
     notify('참여 요청을 이 브라우저에 기록했어요. 실제 모집자에게 전송되지는 않아요.');
   }}/>
   {comments ? <Sheet title={`댓글 ${post.commentCount}`} onClose={() => setComments(false)}>
     {post.comments.map(c => <div key={c.id} className="comment-item"><small>{c.authorName}</small><div>{c.content}</div></div>)}
     <form onSubmit={e => {e.preventDefault(); if (text.trim()) {useCommunityStore.getState().comment(id, text); setText('');}}}>
       <label>댓글<textarea aria-label="댓글 내용" value={text} onChange={e => setText(e.target.value)} maxLength={1000} required/></label>
       <button className="primary-button" disabled={!text.trim()}>댓글 등록</button>
     </form>
   </Sheet> : null}
 </>;
}
