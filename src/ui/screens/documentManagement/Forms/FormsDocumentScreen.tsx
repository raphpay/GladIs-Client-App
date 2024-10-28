import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NativeModules, Platform, Text, View } from 'react-native';
const { FilePickerModule } = NativeModules;

import { IRootStackParams } from '../../../../navigation/Routes';

import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';

import FormManager, {
  IResult,
} from '../../../../business-logic/manager/FormManager';
import IAction from '../../../../business-logic/model/IAction';
import IForm from '../../../../business-logic/model/IForm';
import DocumentLogAction from '../../../../business-logic/model/enums/DocumentLogAction';
import PlatformName from '../../../../business-logic/model/enums/PlatformName';
import UserType from '../../../../business-logic/model/enums/UserType';
import FinderModule from '../../../../business-logic/modules/FinderModule';
import { useAppSelector } from '../../../../business-logic/store/hooks';
import { RootState } from '../../../../business-logic/store/store';
import Utils from '../../../../business-logic/utils/Utils';

import AppContainer from '../../../components/AppContainer/AppContainer';
import IconButton from '../../../components/Buttons/IconButton';
import ContentUnavailableView from '../../../components/ContentUnavailableView';
import Dialog from '../../../components/Dialogs/Dialog';
import Grid from '../../../components/Grid/Grid';
import Toast from '../../../components/Toast';
import TooltipAction from '../../../components/TooltipAction';
import FormRow from './FormRow';

import MimeType from '../../../../business-logic/model/enums/MimeType';
import FileOpenPicker from '../../../../business-logic/modules/FileOpenPicker';
import styles from '../../../assets/styles/forms/FormsDocumentScreenStyles';

type FormsDocumentScreenProps = NativeStackScreenProps<
  IRootStackParams,
  NavigationRoutes.FormsDocumentScreen
>;

function FormsDocumentScreen(
  props: FormsDocumentScreenProps,
): React.JSX.Element {
  // General
  const [searchText, setSearchText] = useState<string>('');
  // Form
  const [forms, setForms] = useState<IForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<IForm>({} as IForm);
  // Dialogs
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showRemoveConfirmationDialog, setShowRemoveConfirmationDialog] =
    useState<boolean>(false);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] =
    useState<boolean>(false);

  const { navigation } = props;
  const { documentPath, currentFolder } = props.route.params;
  const { t } = useTranslation();
  const { currentUser, currentClient } = useAppSelector(
    (state: RootState) => state.users,
  );
  const { formsCount } = useAppSelector((state: RootState) => state.forms);
  const { token } = useAppSelector((state: RootState) => state.tokens);

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

  const navigationHistoryItems: IAction[] = [
    {
      title: t('dashboard.title'),
      onPress: () => navigateToDashboard(),
    },
    {
      title: t('documentManagement.title'),
      onPress: () => navigateToDocumentManagement(),
    },
    {
      title: t('systemQuality.title'),
      onPress: () => navigateToSystemQuality(),
    },
    {
      title: currentFolder.title,
      onPress: () => navigateBack(),
    },
  ];

  // Sync Methods
  function navigateToDashboard() {
    navigation.navigate(
      currentUser?.userType === UserType.Admin
        ? NavigationRoutes.ClientDashboardScreenFromAdmin
        : NavigationRoutes.DashboardScreen,
    );
  }

  function navigateToDocumentManagement() {
    navigation.navigate(NavigationRoutes.DocumentManagementScreen);
  }

  function navigateToSystemQuality() {
    navigation.navigate(NavigationRoutes.SystemQualityScreen);
  }

  function addForm() {
    navigation.navigate(NavigationRoutes.FormEditionScreen, {
      form: undefined,
      documentPath,
    });
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
      },
    ];

    let approveTitle = '';
    if (currentUser?.userType === UserType.Client) {
      approveTitle = form.approvedByClient
        ? t('forms.actions.tooltip.deapprove')
        : t('forms.actions.tooltip.approve');
    } else if (currentUser?.userType === UserType.Admin) {
      approveTitle = form.approvedByAdmin
        ? t('forms.actions.tooltip.deapprove')
        : t('forms.actions.tooltip.approve');
    }

    const approveAction: IAction = {
      title: approveTitle,
      onPress: () => approveForm(form),
    };

    const newActions = [...basicActions];
    const openActionIndex = newActions.findIndex(
      action => action.title === t('forms.actions.tooltip.open'),
    );
    if (openActionIndex !== -1) {
      newActions.splice(openActionIndex + 1, 0, approveAction);
      if (currentUser?.userType === UserType.Admin) {
        const exportAction: IAction = {
          title: t('forms.actions.exportToCSV'),
          onPress: () => exportToCSV(form),
        };
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
    navigation.navigate(NavigationRoutes.FormEditionScreen, {
      form,
      documentPath,
    });
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

  async function exportToCSV(form: IForm) {
    try {
      await FormManager.getInstance().exportToCSV(form);
      displayToast(t('forms.toast.csv.created'));
    } catch (error) {
      FormManager.getInstance().copyCSV(form);
      displayToast(t('forms.toast.csv.copied'));
    }
    // Hide alert
    setShowDialog(false);
    setShowRemoveConfirmationDialog(false);
  }

  // Async Methods
  async function loadForms() {
    try {
      const forms = await FormManager.getInstance().loadForms(
        currentClient?.id as string,
        documentPath,
        token,
      );
      setForms(forms);
    } catch (error) {
      console.log('Error loading forms', error);
    }
  }

  async function approveForm(form: IForm) {
    let approvalResult: IResult = {
      success: false,
      message: '',
    };
    if (currentUser?.userType === UserType.Admin) {
      if (form.approvedByAdmin) {
        // Deapprove form
        approvalResult = await FormManager.getInstance().adminDeapprove(
          form,
          token,
        );
      } else {
        // Approve form
        approvalResult = await FormManager.getInstance().adminApprove(
          form,
          token,
        );
        await FormManager.getInstance().recordLog(
          DocumentLogAction.Approbation,
          UserType.Admin,
          currentUser?.id as string,
          currentClient?.id as string,
          form,
          token,
        );
      }
    } else if (currentUser?.userType === UserType.Client) {
      if (form.approvedByClient) {
        // Deapprove form
        approvalResult = await FormManager.getInstance().clientDeapprove(
          form,
          token,
        );
      } else {
        // Approve form
        approvalResult = await FormManager.getInstance().clientApprove(
          form,
          token,
        );
        await FormManager.getInstance().recordLog(
          DocumentLogAction.Approbation,
          UserType.Client,
          currentUser?.id as string,
          currentClient?.id as string,
          form,
          token,
        );
      }
    }

    // Display toast
    displayToast(t(`${approvalResult.message}`), !approvalResult.success);
    // Load forms
    await loadForms();
    // Hide alert
    setShowDialog(false);
  }

  async function deleteForm() {
    // Delete form
    const result: IResult = await FormManager.getInstance().deleteForm(
      selectedForm,
      token,
    );
    await FormManager.getInstance().recordLog(
      DocumentLogAction.Deletion,
      currentUser?.userType as UserType,
      currentUser?.id as string,
      currentClient?.id as string,
      selectedForm,
      token,
    );
    displayToast(t(`${result.message}`), !result.success);
    // Load forms
    await loadForms();
    // Hide alert
    setShowRemoveConfirmationDialog(false);
  }

  async function pickAFile() {
    let data: string = '';
    if (Platform.OS === PlatformName.Mac) {
      data = await FinderModule.getInstance().pickCSV();
      data = Utils.replaceAllOccurrences(data, ';', ',');
    } else if (Platform.OS === PlatformName.Android) {
      const filePath = await FilePickerModule.pickSingleFile([MimeType.csv]);
      data = (await Utils.getCSVFromFile(filePath)) as string;
    } else if (Platform.OS === PlatformName.Windows) {
      const filePath = await FileOpenPicker?.pickCSVFile();
      if (filePath) {
        data = (await Utils.getCSVFromFile(filePath)) as string;
      }
    }
    const form: IForm = {
      title: '',
      createdBy: currentUser?.id as string,
      value: data,
      approvedByAdmin: false,
      approvedByClient: false,
      clientID: currentClient?.id as string as string,
    };
    openForm(form);
    return data;
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
        {currentUser?.userType == UserType.Admin && (
          <IconButton
            title={t('forms.buttons.add')}
            icon={plusIcon}
            onPress={addForm}
            style={styles.adminButton}
          />
        )}
      </>
    );
  }

  function ImportButton() {
    return (
      <>
        {currentUser?.userType == UserType.Admin && (
          <IconButton
            title={t('forms.buttons.importCSV')}
            icon={plusIcon}
            onPress={pickAFile}
            style={styles.adminButton}
          />
        )}
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
    );
  }

  function TooltipActionContent() {
    const tooltipTitle = `${t('forms.actions.tooltip.title')}: ${
      selectedForm.title
    }`;

    return (
      <TooltipAction
        showDialog={showDialog}
        title={tooltipTitle}
        isConfirmAvailable={true}
        onConfirm={() => setShowDialog(false)}
        onCancel={() => {}}
        popoverActions={popoverActions}>
        <View style={styles.dialogChildren}>
          <>
            {selectedForm?.approvedByAdmin ? (
              <Text style={styles.approvedText}>
                {t('forms.dialog.approve.admin.yes')}
              </Text>
            ) : (
              <Text style={styles.approvedText}>
                {t('forms.dialog.approve.admin.no')}
              </Text>
            )}
            {selectedForm?.approvedByClient ? (
              <Text style={styles.approvedText}>
                {t('forms.dialog.approve.client.yes')}
              </Text>
            ) : (
              <Text style={styles.approvedText}>
                {t('forms.dialog.approve.client.no')}
              </Text>
            )}
          </>
        </View>
      </TooltipAction>
    );
  }

  function ToastContent() {
    return (
      <>
        {showToast && (
          <Toast
            message={toastMessage}
            isVisible={showToast}
            setIsVisible={setShowToast}
            isShowingError={toastIsShowingError}
          />
        )}
      </>
    );
  }

  function AdminButtons() {
    return (
      <>
        {AddFormButton()}
        {ImportButton()}
      </>
    );
  }

  return (
    <>
      <AppContainer
        mainTitle={t('forms.title')}
        navigationHistoryItems={navigationHistoryItems}
        showBackButton={true}
        showSearchText={true}
        searchText={searchText}
        setSearchText={setSearchText}
        showSettings={true}
        adminButton={AdminButtons()}
        navigateBack={navigateBack}>
        {formsFiltered.length !== 0 ? (
          <Grid
            data={formsFiltered}
            renderItem={({ item }) => (
              <FormRow
                form={item}
                showActionDialog={form => displayActionDialog(form)}
              />
            )}
          />
        ) : (
          <ContentUnavailableView
            title={t('forms.noDocs.title')}
            message={
              currentUser?.userType === UserType.Admin
                ? t('forms.noDocs.message.admin')
                : t('forms.noDocs.message.client')
            }
            image={docIcon}
          />
        )}
      </AppContainer>
      {TooltipActionContent()}
      {showRemoveConfirmationDialog && RemoveDialogContent()}
      {ToastContent()}
    </>
  );
}

export default FormsDocumentScreen;
