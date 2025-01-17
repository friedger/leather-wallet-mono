import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';

import { whenTheme } from '@/utils/when-theme';
import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

import {
  accountDisplayPreferencesKeyedByType,
  bitcoinUnitsKeyedByName,
} from '@leather.io/constants';
import {
  AccountDisplayPreference,
  BitcoinUnit,
  DefaultNetworkConfigurations,
  FiatCurrency,
  WalletDefaultNetworkConfigurationIds,
  defaultNetworksKeyedById,
} from '@leather.io/models';

import type { RootState } from '..';
import { handleAppResetWithState } from '../global-action';
import { useAppDispatch } from '../utils';

export const defaultNetworks = ['mainnet', 'testnet', 'signet'] as const;

export const defaultThemes = ['light', 'dark', 'system'] as const;
export type ThemeStore = (typeof defaultThemes)[number];
export type Theme = Exclude<ThemeStore, 'system'>;

export type WalletSecurityLevel = 'undefined' | 'secure' | 'insecure';

export interface SettingsState {
  accountDisplayPreference: AccountDisplayPreference;
  bitcoinUnit: BitcoinUnit;
  conversionUnit: FiatCurrency;
  createdOn: string;
  network: DefaultNetworkConfigurations;
  theme: ThemeStore;
  walletSecurityLevel: WalletSecurityLevel;
}

const initialState: SettingsState = {
  accountDisplayPreference: 'ns',
  bitcoinUnit: 'bitcoin',
  conversionUnit: 'USD',
  createdOn: new Date().toISOString(),
  network: WalletDefaultNetworkConfigurationIds.mainnet,
  theme: 'system',
  walletSecurityLevel: 'undefined',
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    userChangedAccountDisplayPreference(state, action: PayloadAction<AccountDisplayPreference>) {
      state.accountDisplayPreference = action.payload;
    },
    userChangedBitcoinUnit(state, action: PayloadAction<BitcoinUnit>) {
      state.bitcoinUnit = action.payload;
    },
    userChangedConversionUnit(state, action: PayloadAction<FiatCurrency>) {
      state.conversionUnit = action.payload;
    },
    userChangedTheme(state, action: PayloadAction<ThemeStore>) {
      state.theme = action.payload;
    },
    userChangedNetwork(state, action: PayloadAction<DefaultNetworkConfigurations>) {
      state.network = action.payload;
    },
    userChangedWalletSecurityLevel(state, action: PayloadAction<WalletSecurityLevel>) {
      state.walletSecurityLevel = action.payload;
    },
  },
  extraReducers: builder => builder.addCase(...handleAppResetWithState(initialState)),
});

const selectSettings = (state: RootState) => state.settings;

export const selectAccountDisplayPreference = createSelector(
  selectSettings,
  state => accountDisplayPreferencesKeyedByType[state.accountDisplayPreference]
);

export const selectBitcoinUnit = createSelector(
  selectSettings,
  state => bitcoinUnitsKeyedByName[state.bitcoinUnit]
);

const selectConversionUnit = createSelector(selectSettings, state => state.conversionUnit);
const selectTheme = createSelector(selectSettings, state => state.theme);

export const selectNetwork = createSelector(
  selectSettings,
  state => defaultNetworksKeyedById[state.network]
);

export const selectWalletSecurityLevel = createSelector(
  selectSettings,
  state => state.walletSecurityLevel
);

export const {
  userChangedAccountDisplayPreference,
  userChangedBitcoinUnit,
  userChangedConversionUnit,
  userChangedTheme,
  userChangedNetwork,
  userChangedWalletSecurityLevel,
} = settingsSlice.actions;

export function useSettings() {
  const dispatch = useAppDispatch();
  const network = useSelector(selectNetwork);
  const walletSecurityLevel = useSelector(selectWalletSecurityLevel);
  const systemTheme = useColorScheme();
  const accountDisplayPreference = useSelector(selectAccountDisplayPreference);
  const bitcoinUnit = useSelector(selectBitcoinUnit);
  const conversionUnit = useSelector(selectConversionUnit);
  const themeStore = useSelector(selectTheme);
  const theme = (themeStore === 'system' ? systemTheme : themeStore) ?? 'light';

  return {
    accountDisplayPreference,
    bitcoinUnit,
    conversionUnit,
    theme,
    themeStore,
    whenTheme: whenTheme(theme),
    changeAccountDisplayPreference(type: AccountDisplayPreference) {
      dispatch(userChangedAccountDisplayPreference(type));
    },
    changeBitcoinUnit(unit: BitcoinUnit) {
      dispatch(userChangedBitcoinUnit(unit));
    },
    changeConversionUnit(unit: FiatCurrency) {
      dispatch(userChangedConversionUnit(unit));
    },
    changeTheme(theme: ThemeStore) {
      dispatch(userChangedTheme(theme));
    },
    toggleTheme() {
      dispatch(theme === 'light' ? userChangedTheme('dark') : userChangedTheme('light'));
    },
    network,
    changeNetwork(network: DefaultNetworkConfigurations) {
      dispatch(userChangedNetwork(network));
    },
    // TODO: Remove when live, debug only
    toggleNetwork() {
      dispatch(
        network.chain.bitcoin.bitcoinNetwork === 'mainnet'
          ? userChangedNetwork('testnet')
          : userChangedNetwork('mainnet')
      );
    },
    walletSecurityLevel,
    changeWalletSecurityLevel(level: WalletSecurityLevel) {
      dispatch(userChangedWalletSecurityLevel(level));
    },
  };
}
