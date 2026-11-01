import { useLocalSearchParams } from 'expo-router';

import { CalendarScreen } from '@/features/calendar/screens/CalendarScreen';

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export default function CalendarRoute() {
  // /calendar?date=2026-10-12 → 해당 날짜의 결제 시트를 연 상태로 진입
  // /calendar?view=expanded → 확장(날짜별 금액) 보기로 진입
  const { date, view } = useLocalSearchParams<{ date?: string; view?: string }>();
  const initialSelectedDate = date && DATE_KEY_PATTERN.test(date) ? date : undefined;

  return <CalendarScreen initialSelectedDate={initialSelectedDate} initialExpanded={view === 'expanded'} />;
}
