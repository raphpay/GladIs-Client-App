import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform } from 'react-native';

import PlatformName from '../../../business-logic/model/enums/PlatformName';
import {
  ANDROID_APP_LINK,
  WINDOWS_APP_LINK,
} from '../../../business-logic/utils/envConfig';

import Dialog from './Dialog';

type VersionLogAlertProps = {
  show: boolean | null;
};

function VersionLogAlert(props: VersionLogAlertProps): React.JSX.Element {
  const { show } = props;

  const { t } = useTranslation();

  async function goToAppStore() {
    // Checking if the link is supported for links with custom URL scheme.
    let url: string = '';
    if (Platform.OS === PlatformName.Android) {
      url = ANDROID_APP_LINK;
    } else if (Platform.OS === PlatformName.Windows) {
      url = WINDOWS_APP_LINK;
    }

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    }
  }

  return (
    <>
      {show && (
        <Dialog
          title={t('versionLogAlert.title')}
          description={t('versionLogAlert.description')}
          confirmTitle={t('versionLogAlert.button')}
          isConfirmDisabled={false}
          isConfirmAvailable={true}
          isCancelAvailable={false}
          onConfirm={goToAppStore}
        />
      )}
    </>
  );
}

export default VersionLogAlert;
