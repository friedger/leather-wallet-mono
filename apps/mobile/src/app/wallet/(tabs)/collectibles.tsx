import { StyleSheet, View } from 'react-native';

import { AppRoutes } from '@/routes';
import { t } from '@lingui/macro';
import { useRouter } from 'expo-router';

import { Text, TouchableOpacity } from '@leather.io/ui/native';

export default function SwapScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text>{t`Collectibles 🖼️`}</Text>
      <TouchableOpacity
        onPress={() => router.navigate(AppRoutes.WalletBrowser)}
        p="4"
        bg="ink.background-primary"
        borderRadius="sm"
      >
        <Text>{t`navigate to browser`}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
