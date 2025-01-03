import React from 'react';
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
          title={'Update available'}
          description={
            'A new version of the app is available. Please update to the latest version.'
          }
          confirmTitle={'Update'}
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
