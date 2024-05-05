import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { IRootStackParams } from '../../../../navigation/Routes';

import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';

import UserType from '../../../../business-logic/model/enums/UserType';
import { useAppSelector } from '../../../../business-logic/store/hooks';
import { RootState } from '../../../../business-logic/store/store';
import AppContainer from '../../../components/AppContainer/AppContainer';
import IconButton from '../../../components/Buttons/IconButton';

type FormsDocumentScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.FormsDocumentScreen>;

function FormsDocumentScreen(props: FormsDocumentScreenProps): React.JSX.Element {

  const { navigation } = props;
  const { t } = useTranslation();
  const { currentUser } = useAppSelector((state: RootState) => state.users);

  const plusIcon = require('../../../assets/images/plus.png');

  // Sync Methods
  function addForm() {
    navigation.navigate(NavigationRoutes.FormEditionScreen);
  }

  // Components
  function AddFormButton() {
    return (
      <>
        {
          currentUser?.userType == UserType.Admin && (
            <IconButton
              title={t('forms.buttons.add')}
              icon={plusIcon}
              onPress={addForm}
            />
          )
        }
      </>
    );
  }

  // TODO: Load forms from the server
  return (
    <AppContainer
      mainTitle={t('forms.title')}
      showBackButton={true}
      showSearchText={false}
      showSettings={true}
      adminButton={AddFormButton()}
    >
      <Text>Hello</Text>
    </AppContainer>
  );
}

export default FormsDocumentScreen;
