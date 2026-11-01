import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockSubscriptions } from '@/features/subscription/data/mockSubscriptions';
import type { Subscription } from '@/features/subscription/types';
import type { SubscriptionDraft } from '@/features/subscription/screens/ManualSubscriptionScreen';
import type { ScanResultDraft } from '@/features/subscription/screens/ScanResultScreen';
import { colors } from '@/theme';

type SavedSubscription = Omit<Subscription, 'logo'> & { memo?: string; paymentMethodId?: string };
const { useSubscriptionStore } = { useSubscriptionStore: create<{
  items: SavedSubscription[];
  add: (draft: SubscriptionDraft) => void;
  saveScan: (draft: ScanResultDraft) => void;
  remove: (id: string) => void;
}>()(persist((set) => ({
  items: mockSubscriptions.map(({ logo: _logo, ...item }) => item),
  add: draft => set(state => ({ items: [...state.items, {
    id: crypto.randomUUID(), name: draft.name, category: draft.category, price: draft.price,
    nextBillingDate: draft.startDate, cycle: draft.cycle,
    accent: { color: colors.primary, soft: colors.primarySoft }, memo: draft.memo, paymentMethodId: draft.paymentMethodId,
  }] })),
  saveScan: draft => set(state => {
    const existing = state.items.find(s => s.id === draft.existingId);
    const item: SavedSubscription = {
      id: existing?.id ?? crypto.randomUUID(), category: existing?.category ?? 'ott',
      accent: existing?.accent ?? { color: colors.primary, soft: colors.primarySoft },
      name: draft.name, price: draft.price, cycle: draft.cycle, nextBillingDate: draft.nextBillingDate,
    };
    return { items: existing ? state.items.map(s => s.id === existing.id ? item : s) : [...state.items, item] };
  }),
  remove: id => set(state => ({ items: state.items.filter(s => s.id !== id) })),
}), { name: 'routineslim.subscriptions.v1' })) };
export { useSubscriptionStore };
export function useSubscriptions(): Subscription[] {
 const items = useSubscriptionStore(s => s.items);
 return useMemo(() => items.map(item => ({ ...item, logo: mockSubscriptions.find(s => s.id === item.id)?.logo ?? {
   kind: 'text' as const, text: item.name.charAt(0), color: colors.primary, fontSize: 20, background: colors.primarySoft,
 } })), [items]);
}
