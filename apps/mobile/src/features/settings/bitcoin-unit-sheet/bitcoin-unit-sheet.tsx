import { RefObject } from 'react';

import { useToastContext } from '@/components/toast/toast-context';
import { useSettings } from '@/store/settings/settings.write';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { bitcoinUnitsKeyedByName } from '@leather.io/constants';
import { BitcoinUnit } from '@leather.io/models';
import { BitcoinCircleIcon, SheetRef } from '@leather.io/ui/native';

import { SettingsSheetLayout } from '../settings-sheet.layout';
import { BitcoinUnitCell } from './bitcoin-unit-cell';

interface BitcoinUnitSheetProps {
  sheetRef: RefObject<SheetRef>;
}
export function BitcoinUnitSheet({ sheetRef }: BitcoinUnitSheetProps) {
  const settings = useSettings();
  const { displayToast } = useToastContext();
  const { i18n } = useLingui();

  function onUpdateBitcoinUnit(unit: BitcoinUnit) {
    settings.changeBitcoinUnit(unit);
    displayToast({ title: t`Bitcoin unit updated`, type: 'success' });
  }

  return (
    <SettingsSheetLayout icon={<BitcoinCircleIcon />} sheetRef={sheetRef} title={t`Bitcoin unit`}>
      {Object.values(bitcoinUnitsKeyedByName).map(unit => (
        <BitcoinUnitCell
          key={unit.name}
          activeBitcoinUnit={settings.bitcoinUnit.name}
          caption={i18n._(unit.name)}
          onUpdateBitcoinUnit={onUpdateBitcoinUnit}
          unit={unit}
          title={i18n._(unit.symbol)}
        />
      ))}
    </SettingsSheetLayout>
  );
}
