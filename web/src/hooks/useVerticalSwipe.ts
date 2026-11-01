import { useEffect, useMemo, useRef } from 'react';
import { PanResponder } from 'react-native';

const START_DISTANCE = 10;
const TRIGGER_DISTANCE = 40;

type VerticalSwipeHandlers = {
  onSwipeDown?: () => void;
  onSwipeUp?: () => void;
};

/**
 * 세로 스와이프(쓸어내리기/올리기)를 감지하는 panHandlers.
 * 등록된 방향으로 세로 움직임이 가로보다 뚜렷할 때만 제스처를 가져가므로
 * 탭(날짜 선택)이나 반대 방향 스크롤은 그대로 동작한다.
 */
export function useVerticalSwipe(handlers: VerticalSwipeHandlers) {
  // 제스처 콜백에서 항상 최신 핸들러를 쓰도록 ref 에 담는다 (렌더 중이 아니라 커밋 후 갱신 — React Compiler 규칙)
  const latest = useRef(handlers);
  useEffect(() => {
    latest.current = handlers;
  });

  return useMemo(() => {
    const wantsGesture = (dx: number, dy: number) => {
      if (Math.abs(dy) < START_DISTANCE || Math.abs(dy) < Math.abs(dx) * 1.5) return false;
      return dy > 0 ? !!latest.current.onSwipeDown : !!latest.current.onSwipeUp;
    };

    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx, dy }) => wantsGesture(dx, dy),
      onMoveShouldSetPanResponderCapture: (_, { dx, dy }) => wantsGesture(dx, dy),
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: (_, { dy }) => {
        if (dy > TRIGGER_DISTANCE) latest.current.onSwipeDown?.();
        else if (dy < -TRIGGER_DISTANCE) latest.current.onSwipeUp?.();
      },
    }).panHandlers;
  }, []);
}
