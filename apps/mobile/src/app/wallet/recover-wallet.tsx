import { useRef, useState } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CircleQuestionMark from '@/assets/circle-questionmark.svg';
import Note from '@/assets/note-2.svg';
import { Button } from '@/components/button';
import { InputState, TextInput } from '@/components/text-input';
import { TransText } from '@/components/trans-text';
import { APP_ROUTES } from '@/constants';
import { tempMnemonicStore } from '@/state/storage-persistors';
import { t } from '@lingui/macro';
import { useTheme } from '@shopify/restyle';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';

import { isValidMnemonic, isValidMnemonicWord } from '@leather.io/crypto';
import { Box, Theme, TouchableOpacity } from '@leather.io/ui/native';

function constructErrorMessage(invalidWords: string[]) {
  return t`Invalid words: ${invalidWords.join(', ')}`;
}

function getInvalidMnemonicWords(recoveryMnemonic: string) {
  return recoveryMnemonic
    .trim()
    .split(/\s+/g)
    .filter(word => !isValidMnemonicWord(word));
}

export default function RecoverWallet() {
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme<Theme>();
  const router = useRouter();
  const [recoveryMnemonic, setRecoveryMnemonic] = useState('');
  const inputRef = useRef<RNTextInput>(null);
  const [inputState, setInputState] = useState<InputState>('default');
  const [errorMessage, setErrorMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  function validateMnemonicOnBlur() {
    const invalidWords = getInvalidMnemonicWords(recoveryMnemonic);
    const isError = invalidWords.length !== 0;
    if (isError) {
      setInputState('error');
      setErrorMessage(constructErrorMessage(invalidWords));
    } else {
      setInputState('default');
      setErrorMessage('');
    }
  }

  function checkMnemonic(text: string) {
    const isValid = isValidMnemonic(text);
    if (isValid) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }

  function onChangeText(text: string) {
    checkMnemonic(text);
    setRecoveryMnemonic(text);
    setInputState('default');
  }

  async function onSubmit() {
    const isValid = isValidMnemonic(recoveryMnemonic);
    if (isValid) {
      await tempMnemonicStore.setTemporaryMnemonic(recoveryMnemonic);
      router.navigate(APP_ROUTES.WalletSecureYourWallet);
    }
  }

  async function pasteFromClipboard() {
    const copiedString = await Clipboard.getStringAsync();
    setRecoveryMnemonic(copiedString);
    checkMnemonic(copiedString);
    inputRef.current?.focus();
  }

  return (
    <Box
      flex={1}
      backgroundColor="base.ink.background-primary"
      px="5"
      justifyContent="space-between"
      style={{ paddingBottom: bottom + theme.spacing['5'] }}
    >
      <Box>
        <Box gap="3" pt="5">
          <TouchableOpacity
            onPress={() => {
              // TODO: show some kind of a helper here
            }}
            p="5"
            position="absolute"
            right={-theme.spacing['5']}
            zIndex={10}
            top={theme.spacing['1']}
          >
            <CircleQuestionMark
              height={16}
              width={16}
              color={theme.colors['base.ink.text-primary']}
            />
          </TouchableOpacity>
          <TransText variant="heading03">ENTER YOUR SECRET KEY</TransText>
          <TransText variant="label01">
            Paste or type a Secret Key to add its associated wallet.
          </TransText>
        </Box>
        <Box>
          <Button
            onPress={pasteFromClipboard}
            style={{ position: 'absolute', bottom: 12, right: 12, zIndex: 100 }}
            buttonState="default"
            title={t`Paste`}
            Icon={Note}
          />
          <TextInput
            onBlur={validateMnemonicOnBlur}
            ref={inputRef}
            mt="5"
            value={recoveryMnemonic}
            errorMessage={errorMessage}
            onChangeText={onChangeText}
            placeholder={t`Type your recovery phrase`}
            inputState={inputState}
            height={220}
            multiline
            blurOnSubmit
            autoCapitalize="none"
            autoCorrect
          />
        </Box>
      </Box>
      <Button
        onPress={onSubmit}
        disabled={isButtonDisabled}
        buttonState={isButtonDisabled ? 'disabled' : 'default'}
        title={t`Continue`}
      />
    </Box>
  );
}