import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EyeIcon from '@/assets/icons/eye.svg';
import LockIcon from '@/assets/icons/lock.svg';
import UserIcon from '@/assets/icons/user.svg';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { TextField } from '@/components/ui/TextField';
import { colors, spacing, typography } from '@/theme';

import { BiometricLoginCard } from '../components/BiometricLoginCard';
import { LoginHero } from '../components/LoginHero';
import { SocialLoginButtons, type SocialProvider } from '../components/SocialLoginButtons';

/*
 * [로그인 구현 6/9] 로그인 화면에 "실패 안내" 와 "요청 중" 표시 추가
 *
 * 이 파일은 화면 모양만 담당한다. 서버 호출은 하지 않고, 값은 props 로 받는다.
 * 실제 로그인 처리는 7번 src/app/(auth)/login.tsx 가 하고 결과를 아래 props 로 내려 준다.
 *
 * 할 일
 *   1) LoginScreenProps 에 두 개 추가
 *        errorMessage?: string | null;   // 로그인 실패 안내 문구. 없으면 안내를 그리지 않음
 *        submitting?: boolean;           // 로그인 요청 중이면 true (기본값 false)
 *      그리고 함수 매개변수 구조 분해에도 errorMessage, submitting = false 추가
 *   2) 로그인 버튼 바로 위에 errorMessage 가 있을 때만 <Text> 로 표시 (아래 버튼 위치 주석 참고)
 *        - 접근성: accessibilityRole="alert" (화면 읽기 프로그램이 바로 읽어 줌)
 *        - 스타일은 styles 에 error 를 추가: ...typography.caption, color: colors.danger,
 *          marginTop: spacing.md  (색·글자·간격은 하드코딩하지 말고 theme 토큰을 쓴다)
 *   3) 로그인 버튼
 *        - submitting 이면 title 을 '로그인 중…' 으로, disabled={submitting} 으로 두 번 누르기 방지
 *          (Button 컴포넌트는 disabled 를 이미 지원한다: src/components/ui/Button.tsx)
 *        - onLogin 에 넘기는 id 는 앞뒤 공백 제거: id.trim()  (비밀번호는 그대로)
 */
type LoginScreenProps = {
  errorMessage?: string | null;
  submitting?: boolean;
  notice?: string;
  onLogin?: (credentials: { id: string; password: string; keepLoggedIn: boolean }) => void;
  onSocialLogin?: (provider: SocialProvider) => void;
  onBiometricLogin?: () => void;
  onResetPassword?: () => void;
  onSignUp?: () => void;
};

export function LoginScreen({
  errorMessage, submitting = false, notice,
  onLogin,
  onSocialLogin,
  onBiometricLogin,
  onResetPassword,
  onSignUp,
}: LoginScreenProps) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <LoginHero savingsAmount="61,790" />
        {notice ? <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 12 }}>{notice}</Text> : null}

        <View style={styles.form}>
          <TextField
            label="아이디"
            placeholder="이메일 또는 아이디"
            value={id}
            onChangeText={setId}
            autoCapitalize="none"
            autoComplete="username"
            keyboardType="email-address"
            leftIcon={<UserIcon width={15.7} height={17.2} />}
          />
          <TextField
            label="비밀번호"
            placeholder="비밀번호 입력"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="password"
            leftIcon={<LockIcon width={14.7} height={18.2} />}
            rightAccessory={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                hitSlop={8}
                onPress={() => setShowPassword((v) => !v)}
              >
                <EyeIcon width={19.7} height={9.95} />
              </Pressable>
            }
          />
        </View>

        <View style={styles.optionsRow}>
          <Checkbox label="로그인 상태 유지" checked={keepLoggedIn} onChange={setKeepLoggedIn} />
          <Pressable accessibilityRole="link" hitSlop={8} onPress={onResetPassword}>
            <Text style={styles.resetPassword}>비밀번호 재설정</Text>
          </Pressable>
        </View>

        {/* [로그인 구현 6/9] 여기에 errorMessage 안내 <Text> 추가, 아래 버튼에 submitting 반영 */}
        {errorMessage ? <Text accessibilityRole="alert" style={{color: colors.danger, marginTop: spacing.md}}>{errorMessage}</Text> : null}
        <Button title={submitting ? '로그인 중…' : '로그인'} disabled={submitting} style={styles.loginButton} onPress={() => onLogin?.({ id, password, keepLoggedIn })} />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>또는 간편 로그인</Text>
          <View style={styles.dividerLine} />
        </View>

        <SocialLoginButtons onPress={(provider) => onSocialLogin?.(provider)} />

        <View style={styles.biometric}>
          <BiometricLoginCard onPress={() => onBiometricLogin?.()} />
        </View>

        <View style={styles.signUpRow}>
          <Text style={styles.signUpPrompt}>아직 회원이 아니신가요?</Text>
          <Pressable accessibilityRole="link" hitSlop={8} onPress={onSignUp}>
            <Text style={styles.signUpLink}>회원가입</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: 9,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  form: {
    marginTop: 19,
    gap: 13,
  },
  optionsRow: {
    marginTop: 14,
    paddingHorizontal: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resetPassword: {
    ...typography.caption,
    color: colors.textMuted,
  },
  loginButton: {
    marginTop: spacing.lg,
  },
  divider: {
    marginTop: 22,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.small,
    color: colors.textMuted,
    width: 118,
    textAlign: 'center',
  },
  biometric: {
    marginTop: spacing.xl,
  },
  signUpRow: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  signUpPrompt: {
    ...typography.body,
    color: colors.textMuted,
  },
  signUpLink: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});
