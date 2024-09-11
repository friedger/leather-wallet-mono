import { RefObject, useState } from 'react';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { t } from '@lingui/macro';
import { useTheme } from '@shopify/restyle';
import { Image } from 'expo-image';

import {
  ArrowRotateClockwiseIcon,
  Box,
  CLOSED_ANIMATED_SHARED_VALUE,
  EllipsisHIcon,
  EmailIcon,
  Eye2Icon,
  PaletteIcon,
  PlusIcon,
  Sheet,
  SheetRef,
  SignalIcon,
  Text,
  Theme,
  ThemeVariant,
} from '@leather.io/ui/native';

import { OptionData } from '../sheets/notify-user-sheet.layout';
import { AddWalletListItem } from './add-wallet-list-item';

const AnimatedBox = Animated.createAnimatedComponent(Box);

function getUnavailableFeatures(theme: Theme) {
  const UNAVAILABLE_FEATURES = {
    hardwareWallet: {
      title: t`Connect hardware wallet`,
      subtitle: t`Ledger, Trezor, Ryder and more`,
      icon: <SignalIcon color={theme.colors['ink.text-subdued']} />,
    },
    emailRestore: {
      title: t`Create or restore via email`,
      subtitle: t`Access custodial wallet`,
      icon: <EmailIcon color={theme.colors['ink.text-subdued']} />,
    },
    mpcWallet: {
      title: t`Connect MPC wallet`,
      subtitle: t`Import existing accounts`,
      icon: <PaletteIcon color={theme.colors['ink.text-subdued']} />,
    },
    watchOnlyWallet: {
      title: t`Create watch-only wallet`,
      subtitle: t`No key needed`,
      icon: <Eye2Icon color={theme.colors['ink.text-subdued']} />,
    },
  };
  return UNAVAILABLE_FEATURES;
}

interface AddWalletSheetBaseProps {
  addWalletSheetRef: RefObject<SheetRef>;
}

interface AddWalletSheetLayoutProps extends AddWalletSheetBaseProps {
  createWallet(): unknown;
  restoreWallet(): unknown;
  onOpenNotificationsSheet(option: OptionData): unknown;
  themeVariant: ThemeVariant;
}
export function AddWalletSheetLayout({
  addWalletSheetRef,
  createWallet,
  restoreWallet,
  onOpenNotificationsSheet,
  themeVariant,
}: AddWalletSheetLayoutProps) {
  const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
  const animatedIndex = useSharedValue<number>(CLOSED_ANIMATED_SHARED_VALUE);
  const theme = useTheme<Theme>();

  function openOptions() {
    setMoreOptionsVisible(!moreOptionsVisible);
  }
  const animatedStyle = useAnimatedStyle(() => ({
    marginTop: interpolate(animatedIndex.value, [-1, 0], [-200, 0], Extrapolation.CLAMP),
    marginBottom: interpolate(animatedIndex.value, [-1, 0], [200, 0], Extrapolation.CLAMP),
  }));

  return (
    <Sheet
      isScrollView
      animatedIndex={animatedIndex}
      ref={addWalletSheetRef}
      themeVariant={themeVariant}
    >
      <AnimatedBox style={animatedStyle}>
        <Box width="100%" style={{ height: 200, overflow: 'hidden' }} bg="ink.text-primary">
          <Image
            style={{ height: '100%' }}
            contentFit="cover"
            source={require('@/assets/create-wallet-image.png')}
          />
        </Box>
        <Box p="5">
          <Text pb="5" variant="heading03">
            {t`Add wallet to "Use case"`}
          </Text>
          <Box flexDirection="column" gap="1">
            <AddWalletListItem
              onPress={createWallet}
              title={t`Create new wallet`}
              subtitle={t`Create a new Bitcoin and Stacks wallet`}
              icon={<PlusIcon />}
            />
            <AddWalletListItem
              onPress={restoreWallet}
              title={t`Restore wallet`}
              subtitle={t`Import existing accounts`}
              icon={<ArrowRotateClockwiseIcon />}
            />
            <AddWalletListItem
              onPress={openOptions}
              title={t`More options`}
              icon={moreOptionsVisible ? undefined : <EllipsisHIcon />}
            />
            {!moreOptionsVisible
              ? null
              : Object.entries(getUnavailableFeatures(theme)).map(featureEntry => {
                  const [featureKey, feature] = featureEntry;
                  return (
                    <AddWalletListItem
                      key={featureKey}
                      onPress={() =>
                        onOpenNotificationsSheet({ title: feature.title, id: featureKey })
                      }
                      title={feature.title}
                      subtitle={feature.subtitle}
                      icon={feature.icon}
                    />
                  );
                })}
          </Box>
        </Box>
      </AnimatedBox>
    </Sheet>
  );
}