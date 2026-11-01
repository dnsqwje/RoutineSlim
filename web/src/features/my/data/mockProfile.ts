// API 연동 전까지 사용하는 Figma 시안 데이터
export const mockProfile = {
  name: '민지',
  email: 'minji@routineslim.com',
  /** 가입 후 경과 일수 ('슬림 42일째') */
  slimDays: 42,
};

export const mockSavingsReport = {
  savedAmount: 23000,
  cancelledCount: 2,
};

export const mockSettings = {
  paymentMethodCount: 3,
  monthlyBudget: 100000,
  /** 결제 며칠 전에 알릴지 */
  reminderDays: [3, 1],
  lastBackupLabel: '어제 21:40',
  appLockEnabled: true,
};
