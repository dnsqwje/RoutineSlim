import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CameraIcon from '@/assets/icons/camera-primary.svg';
import ImageIcon from '@/assets/icons/image.svg';
import LightbulbIcon from '@/assets/icons/lightbulb.svg';
import { BackHeader } from '@/components/common/BackHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/ui/Button';
import { colors, spacing, typography } from '@/theme';

import { ImageUploadArea } from '../components/ImageUploadArea';

type ScanSubscriptionScreenProps = {
  onBack: () => void;
  onPickFromAlbum?: () => void;
  onTakePhoto?: () => void;
};

export function ScanSubscriptionScreen({ onBack, onPickFromAlbum, onTakePhoto }: ScanSubscriptionScreenProps) {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <BackHeader title="영수증/캡처 스캔" onBack={onBack} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <Text style={styles.title}>사진 한 장으로 간편하게</Text>
          <Text style={styles.subtitle}>{'영수증 또는 결제 내역을 올려주세요.\n구독 정보를 자동으로 찾아드릴게요.'}</Text>
        </View>

        <ImageUploadArea onPress={onPickFromAlbum} />

        <Card style={styles.tip}>
          <View style={styles.tipHeading}>
            <LightbulbIcon width={17} height={17} />
            <Text style={styles.tipTitle}>이렇게 올리면 더 정확해요</Text>
          </View>
          <Text style={styles.tipBody}>{'서비스 이름, 결제 금액, 결제일이\n잘 보이도록 이미지를 잘라주세요.'}</Text>
        </Card>

        <View style={styles.spacer} />

        <Button
          size="md"
          title="앨범에서 선택"
          icon={<ImageIcon width={20} height={20} />}
          onPress={onPickFromAlbum}
        />
        <Button
          size="md"
          variant="secondary"
          title="사진 촬영"
          icon={<CameraIcon width={20} height={20} />}
          onPress={onTakePhoto}
          titleStyle={styles.secondaryTitle}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundMuted,
  },
  content: {
    flexGrow: 1,
    gap: 22,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  intro: {
    gap: spacing.sm,
  },
  title: {
    ...typography.pageTitle,
    color: colors.textTitle,
  },
  subtitle: {
    ...typography.body14Regular,
    color: colors.textSubtle,
  },
  tip: {
    gap: 10,
  },
  tipHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  tipTitle: {
    ...typography.listTitle,
    flex: 1,
    color: colors.textTitle,
  },
  tipBody: {
    ...typography.captionSm,
    color: colors.textSubtle,
  },
  spacer: {
    flex: 1,
  },
  secondaryTitle: {
    color: colors.primary,
  },
});
