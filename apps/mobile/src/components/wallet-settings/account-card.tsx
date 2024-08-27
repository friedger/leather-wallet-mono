import { t } from '@lingui/macro';
import { useTheme } from '@shopify/restyle';

import { Box, IconProps, Text, Theme, TouchableOpacity } from '@leather.io/ui/native';

export function AccountCard({
  Icon,
  name,
  onPress,
}: {
  Icon: React.FC<IconProps>;
  name: string;
  onPress?(): unknown;
}) {
  const theme = useTheme<Theme>();

  const Container = onPress ? TouchableOpacity : Box;

  return (
    <Container
      onPress={onPress}
      flexDirection="column"
      p="5"
      borderRadius="sm"
      borderWidth={1}
      borderColor="ink.border-transparent"
    >
      <Box mb="6" p="2" alignSelf="flex-start" borderRadius="round" bg="ink.text-primary">
        <Icon color={theme.colors['ink.background-primary']} />
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Text variant="label01">{name}</Text>
        <Box>
          <Text variant="label01">$1231</Text>
          <Text variant="caption01" color="ink.text-subdued">
            {t`Address`}
          </Text>
        </Box>
      </Box>
    </Container>
  );
}