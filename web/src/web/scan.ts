import { create } from 'zustand';
import type { ScanResult } from '@/features/subscription/data/mockScanResult';
export const useScanStore = create<{result: ScanResult | null; image: string | null; set: (result: ScanResult, image: string) => void}>((set, get) => ({
 result: null, image: null,
 set: (result, image) => { const previous = get().image; if (previous) URL.revokeObjectURL(previous); set({result, image}); },
}));
