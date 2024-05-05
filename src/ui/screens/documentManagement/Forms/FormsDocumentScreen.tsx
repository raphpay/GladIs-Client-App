import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IRootStackParams } from '../../../../navigation/Routes';

import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';

import IForm from '../../../../business-logic/model/IForm';
import UserType from '../../../../business-logic/model/enums/UserType';
import FormService from '../../../../business-logic/services/FormService';
import { useAppSelector } from '../../../../business-logic/store/hooks';
import { RootState } from '../../../../business-logic/store/store';

import AppContainer from '../../../components/AppContainer/AppContainer';
import IconButton from '../../../components/Buttons/IconButton';
import ContentUnavailableView from '../../../components/ContentUnavailableView';
import Grid from '../../../components/Grid/Grid';
import FormRow from './FormRow';

type FormsDocumentScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.FormsDocumentScreen>;

function FormsDocumentScreen(props: FormsDocumentScreenProps): React.JSX.Element {

  const { navigation } = props;
  const { documentPath } = props.route.params;
  const { t } = useTranslation();
  const { currentUser, currentClient } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);
  // States
  const [forms, setForms] = useState<IForm[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  const formsFiltered = forms.filter(form =>
    form.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const plusIcon = require('../../../assets/images/plus.png');
  const docIcon = require('../../../assets/images/doc.fill.png');

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  function addForm() {
    navigation.navigate(NavigationRoutes.FormEditionScreen);
  }

  // Async Methods
  async function loadForms() {
    try {
      const clientID = currentClient?.id as string;
      const forms = await FormService.getInstance().getAllByClientAtPath(clientID, documentPath, token);
      setForms(forms);
    } catch (error) {
      console.log('error', error );
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      loadForms();
    }
    init();
  }, []);

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

  return (
    <AppContainer
      mainTitle={t('forms.title')}
      showBackButton={true}
      showSearchText={true}
      searchText={searchText}
      setSearchText={setSearchText}
      showSettings={true}
      adminButton={AddFormButton()}
      navigateBack={navigateBack}
    >
      {
        formsFiltered.length !== 0 ? (
          <Grid
            data={formsFiltered}
            renderItem={({ item }) =>
              <FormRow form={item} />
            }
          />
        ) : (
          <ContentUnavailableView
            title={t('forms.noDocs.title')}
            message={currentUser?.userType === UserType.Admin ? t('forms.noDocs.message.admin') : t('forms.noDocs.message.client')}
            image={docIcon}
          />
        )
      }
    </AppContainer>
  );
}

export default FormsDocumentScreen;
