import React from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from '../IconButton';

type BackButtonProps = {
  showBackButton?: boolean;
  navigateBack?: () => void;
};

function BackButton(props: BackButtonProps): React.JSX.Element {
  const backIcon = require('../../assets/images/arrowshape.turn.up.left.png');

  const { showBackButton, navigateBack } = props;
  const { t } = useTranslation();

  return (
    <>
      {
        showBackButton && (
          <IconButton
            title={t('components.buttons.back')}
            icon={backIcon}
            onPress={navigateBack}
          />
        )
      }
    </>
  );
}

export default BackButton;