import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IRootStackParams } from '../../../../navigation/Routes';

import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';

import IAction from '../../../../business-logic/model/IAction';
import IForm from '../../../../business-logic/model/IForm';
import UserType from '../../../../business-logic/model/enums/UserType';
import FormService from '../../../../business-logic/services/FormService';
import { useAppSelector } from '../../../../business-logic/store/hooks';
import { RootState } from '../../../../business-logic/store/store';

import AppContainer from '../../../components/AppContainer/AppContainer';
import IconButton from '../../../components/Buttons/IconButton';
import ContentUnavailableView from '../../../components/ContentUnavailableView';
import Grid from '../../../components/Grid/Grid';
import TooltipAction from '../../../components/TooltipAction';
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
  const [selectedForm, setSelectedForm] = useState<IForm>({} as IForm);
  const [searchText, setSearchText] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const formsFiltered = forms.filter(form =>
    form.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const plusIcon = require('../../../assets/images/plus.png');
  const docIcon = require('../../../assets/images/doc.fill.png');

  const popoverActions: IAction[] = [
    {
      title: t('forms.tooltip.actions.open'),
      onPress: () => openForm(),
    },
    {
      title: t('forms.tooltip.actions.remove'),
      onPress: () => deleteForm(),
      isDestructive: true,
    }
  ];

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  function addForm() {
    navigation.navigate(NavigationRoutes.FormEditionScreen);
  }

  function displayActionDialog(form: IForm) {
    setSelectedForm(form);
    setShowDialog(true);
  }

  function openForm() {
    if (selectedForm) {
      navigation.navigate(NavigationRoutes.FormEditionScreen);
    }
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

  async function deleteForm() {
    if (selectedForm) {
      console.log('dele', selectedForm );
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

  function TooltipActionContent() {
    const tooltipTitle = `${t('forms.tooltip.actions.title')}: ${selectedForm.title}`;

    return (
      <TooltipAction
        showDialog={showDialog}
        title={tooltipTitle}
        isConfirmAvailable={true}
        onConfirm={() => setShowDialog(false)}
        onCancel={() => {}}
        popoverActions={popoverActions}
      />
    )
  }

  return (
    <>
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
                <FormRow form={item} showActionDialog={(form) => displayActionDialog(form)}/>
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
      { TooltipActionContent() }
    </>
  );
}

export default FormsDocumentScreen;
