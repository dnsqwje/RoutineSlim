import { diffInDays, parseDateKey, type DateKey } from './date';

export function formatWon(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

/** 'YYYY-MM-DD' → '10월 12일' */
export function formatMonthDay(date: DateKey) {
  const { month, day } = parseDateKey(date);
  return `${month}월 ${day}일`;
}

/** ISO 시각 → '방금 전' / '10분 전' / '1시간 전' / '3일 전' */
export function formatTimeAgo(iso: string, now: string | Date = new Date()) {
  const minutes = Math.floor((new Date(now).getTime() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

/** 받침 유무에 따라 주격 조사 '이/가'를 붙인다. 한글이 아니면 '가' (예: OTT가) */
export function withSubjectParticle(word: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  const hasFinalConsonant = code >= 0 && code <= 11171 && code % 28 !== 0;
  return `${word}${hasFinalConsonant ? '이' : '가'}`;
}

const WEEKDAY_NAMES = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

/** 'YYYY-MM-DD' → '10월 12일 월요일' */
export function formatMonthDayWeekday(date: DateKey) {
  const { year, month, day } = parseDateKey(date);
  return `${formatMonthDay(date)} ${WEEKDAY_NAMES[new Date(year, month - 1, day).getDay()]}`;
}

/** 기준일 대비 '오늘' / '내일' / 'N일 후' */
export function formatRelativeDay(date: DateKey, today: DateKey) {
  const diff = diffInDays(today, date);
  if (diff === 0) return '오늘';
  if (diff === 1) return '내일';
  return diff > 0 ? `${diff}일 후` : `${-diff}일 전`;
}
