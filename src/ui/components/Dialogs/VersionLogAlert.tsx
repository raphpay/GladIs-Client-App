import React from 'react';

import Dialog from './Dialog';

type VersionLogAlertProps = {
  show: boolean | null;
};

function VersionLogAlert(props: VersionLogAlertProps): React.JSX.Element {
  const { show } = props;
  function goToAppStore() {
    // TODO: Implement the logic to redirect to the app store
    console.log('goToAppStore');
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
