import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

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
import Dialog from '../../../components/Dialogs/Dialog';
import Grid from '../../../components/Grid/Grid';
import Toast from '../../../components/Toast';
import TooltipAction from '../../../components/TooltipAction';
import FormRow from './FormRow';

import styles from '../../../assets/styles/forms/FormsDocumentScreenStyles';

type FormsDocumentScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.FormsDocumentScreen>;

function FormsDocumentScreen(props: FormsDocumentScreenProps): React.JSX.Element {

  const { navigation } = props;
  const { documentPath } = props.route.params;
  const { t } = useTranslation();
  const { currentUser, currentClient } = useAppSelector((state: RootState) => state.users);
  const { formsCount } = useAppSelector((state: RootState) => state.forms);
  const { token } = useAppSelector((state: RootState) => state.tokens);
  // States
  const [searchText, setSearchText] = useState<string>('');
  // Form
  const [forms, setForms] = useState<IForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<IForm>({} as IForm);
  // Dialogs
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showRemoveConfirmationDialog, setShowRemoveConfirmationDialog] = useState<boolean>(false);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);

  const formsFiltered = forms.filter(form =>
    form.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const plusIcon = require('../../../assets/images/plus.png');
  const docIcon = require('../../../assets/images/doc.fill.png');

  const [popoverActions, setPopoverActions] = useState<IAction[]>([]);

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  function addForm() {
    navigation.navigate(NavigationRoutes.FormEditionScreen, { form: undefined, documentPath });
  }

  function loadActions(form: IForm) {
    const basicActions: IAction[] = [
      {
        title: t('forms.actions.tooltip.open'),
        onPress: () => openForm(form),
      },
      {
        title: t('forms.actions.tooltip.remove'),
        onPress: () => displayRemoveConfirmationDialog(),
        isDestructive: true,
      }
    ];

    const approveTitle = form.approvedByAdmin ? t('forms.actions.tooltip.deapprove') : t('forms.actions.tooltip.approve');
    const approveAction: IAction = {
      title: approveTitle,
      onPress: () => approveForm(form),
    };

    const newActions = [...basicActions];
    const openActionIndex = newActions.findIndex(action => action.title === t('forms.actions.tooltip.open'));
    if (openActionIndex !== -1) {
      newActions.splice(openActionIndex + 1, 0, approveAction);
      if (currentUser?.userType === UserType.Admin) {
        const exportAction: IAction = {
          title: t('forms.actions.exportToCSV'),
          onPress: () => exportToCSV(form),
        }
        newActions.splice(openActionIndex + 2, 0, exportAction);
      }
    }
    setPopoverActions(newActions);
  }

  function displayActionDialog(form: IForm) {
    setSelectedForm(form);
    loadActions(form);
    setShowDialog(true);
  }

  function openForm(form: IForm) {
    setShowDialog(false);
    setShowRemoveConfirmationDialog(false);
    navigation.navigate(NavigationRoutes.FormEditionScreen, { form, documentPath });
  }

  function displayRemoveConfirmationDialog() {
    if (currentUser?.userType === UserType.Admin) {
      setShowDialog(false);
      setShowRemoveConfirmationDialog(true);
    }
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  function exportToCSV(form: IForm) {
    const value = form.value;
    Clipboard.setString(value);
    // Display toast
    displayToast(t('smqSurvey.toast.csvCopied'));
    // Hide alert
    setShowDialog(false);
    setShowRemoveConfirmationDialog(false);
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

  async function approveForm(form: IForm) {
    try {
      const formID = form.id as string;
      const userType = currentUser?.userType as UserType;
      const updatedForm = await FormService.getInstance().approve(formID, userType, token);
      // Display success message
      const approvalStatus = userType === UserType.Admin ? updatedForm.approvedByAdmin : updatedForm.approvedByClient;
      const message = approvalStatus ? t('forms.toast.success.approve') : t('forms.toast.success.deapprove');
      displayToast(message);
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(errorMessage, true);
    }

    setShowDialog(false);
    await loadForms();
  }

  async function deleteForm() {
    try {
      const selectedFormID = selectedForm.id as string;
      await FormService.getInstance().delete(selectedFormID, token);
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(errorMessage, true);
    }
    
    await loadForms();

    setShowRemoveConfirmationDialog(false);
    displayToast(t('forms.actions.remove.success'));
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      loadForms();
    }
    init();
  }, []);

  useEffect(() => {
    async function init() {
      loadForms();
    }
    init();
  }, [formsCount]);

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

  function RemoveDialogContent() {
    return (
      <Dialog
        title={t('forms.actions.remove.title')}
        description={t('forms.actions.remove.description')}
        confirmTitle={t('forms.actions.remove.confirm')}
        cancelTitle={t('forms.actions.remove.cancel')}
        isConfirmAvailable={true}
        isCancelAvailable={true}
        onConfirm={() => deleteForm()}
        onCancel={() => {
          setShowDialog(true);
          setShowRemoveConfirmationDialog(false);
        }}
      />
    )
  }

  function TooltipActionContent() {
    const tooltipTitle = `${t('forms.actions.tooltip.title')}: ${selectedForm.title}`;

    return (
      <TooltipAction
        showDialog={showDialog}
        title={tooltipTitle}
        isConfirmAvailable={true}
        onConfirm={() => setShowDialog(false)}
        onCancel={() => {}}
        popoverActions={popoverActions}
      >
        <View style={styles.dialogChildren}>
          <>
            {
              selectedForm?.approvedByAdmin ? (
                <Text style={styles.approvedText}>{t('forms.dialog.approve.admin.yes')}</Text>
              ) : (
                <Text style={styles.approvedText}>{t('forms.dialog.approve.admin.no')}</Text>
              )
            }
            {
              selectedForm?.approvedByClient ? (
                <Text style={styles.approvedText}>{t('forms.dialog.approve.client.yes')}</Text>
              ) : (
                <Text style={styles.approvedText}>{t('forms.dialog.approve.client.no')}</Text>
              )
            }
          </>
        </View>
      </TooltipAction>
    )
  }

  function ToastContent() {
    return (
      <>
        {
          showToast && (
            <Toast
              message={toastMessage}
              isVisible={showToast}
              setIsVisible={setShowToast}
              isShowingError={toastIsShowingError}
            />
          )
        }
      </>
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
      { showRemoveConfirmationDialog && RemoveDialogContent() }
      { ToastContent() }
    </>
  );
}

export default FormsDocumentScreen;
