import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_SEEN_KEY = 'routineslim:onboarding-seen';

/** 소개 화면을 이미 봤는지. 저장소를 읽지 못하면 다시 보여준다 */
export async function hasSeenOnboarding() {
  try {
    return (await AsyncStorage.getItem(ONBOARDING_SEEN_KEY)) === 'true';
  } catch {
    return false;
  }
}

export async function markOnboardingSeen() {
  try {
    await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
  } catch {
    // 저장에 실패해도 다음 실행 때 소개를 한 번 더 볼 뿐이라 흐름은 막지 않는다
  }
}

/** 개발·테스트용: 소개 화면을 다시 보이게 한다 */
export async function resetOnboardingSeen() {
  try {
    await AsyncStorage.removeItem(ONBOARDING_SEEN_KEY);
  } catch {
    // 무시
  }
}
