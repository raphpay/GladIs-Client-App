import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import IAction from '../../../business-logic/model/IAction';
import IUser from '../../../business-logic/model/IUser';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserService from '../../../business-logic/services/UserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer/AppContainer';
import Dialog from '../../components/Dialogs/Dialog';
import Grid from '../../components/Grid/Grid';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';
import Toast from '../../components/Toast';
import Tooltip from '../../components/Tooltip';
import TooltipAction from '../../components/TooltipAction';

import styles from '../../assets/styles/settings/AdminUserManagementScreenStyles';

type AdminUserManagementScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.AdminUserManagementScreen>;

function AdminUserManagementScreen(props: AdminUserManagementScreenProps): React.JSX.Element {

  const { navigation } = props;

  // TODO: Filter admins for search
  // Admin
  const [admins, setAdmins] = useState<IUser[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<IUser | null>(null);
  // Inputs
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  // Dialog
  const [dialogTitle, setDialogTitle] = useState<string>('');
  const [dialogDescription, setDialogDescription] = useState<string>('');
  const [showActionDialog, setShowActionDialog] = useState<boolean>(false);
  const [showAdminDialog, setShowAdminDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentUser } = useAppSelector((state: RootState) => state.users);

  const { t } = useTranslation();

  const popoverActions: IAction[] = [
    {
      title: t('components.dialog.adminManagement.modify'),
      onPress: () => displayAdminDialog(),
    },
    {
      title: t('components.dialog.adminManagement.delete.button'),
      onPress: () => displayDeleteDialog(),
      isDisabled: currentUser?.id === selectedAdmin?.id,
    }
  ];

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  function displayActionDialog(item: IUser) {
    setSelectedAdmin(item);
    setShowActionDialog(true);
    setDialogTitle(`${t('components.dialog.adminManagement.title')} : ${item.username}`);
  }

  function displayAdminDialog() {
    setShowActionDialog(false);
    setShowDeleteDialog(false);
    setShowAdminDialog(true);
    setFirstName(selectedAdmin?.firstName || '');
    setLastName(selectedAdmin?.lastName || '');
    setEmail(selectedAdmin?.email || '');
    setPhoneNumber(selectedAdmin?.phoneNumber || '');
  }

  function displayDeleteDialog() {
    resetDialog();
    setDialogTitle(`${t('components.dialog.adminManagement.delete.title')} : ${selectedAdmin?.firstName} ${selectedAdmin?.lastName}`);
    setDialogDescription(`${t('components.dialog.adminManagement.delete.description')}`);
    setShowDeleteDialog(true);
  }

  function resetDialog() {
    setShowActionDialog(false);
    setShowAdminDialog(false);
    setShowDeleteDialog(false);
    setDialogTitle('');
    setDialogDescription('');
  }

  // Async Methods
  async function loadAdmins() {
    try {
      const apiAdmins = await UserService.getInstance().getAdmins(token);
      setAdmins(apiAdmins);
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(errorMessage, true);
    }
  }

  async function modifyAdmin() {
    //
  }

  async function deleteAdmin() {
    //
  }

  // Lyfecycle Methods
  useEffect(() => {
    async function init() {
      await loadAdmins();
    }
    init();
  }, []);

  // Components
  function AdminRow(item: IUser) {
    return (
      <View style={styles.lineContainer}>
        <View style={styles.lineRow}>
          <View style={styles.button}>
            <View style={styles.textContainer}>
              <Text style={styles.text}>
                {item.firstName} {item.lastName}
              </Text>
            </View>
          </View>
          <Tooltip action={() => displayActionDialog(item)} />
        </View>
        <View style={styles.separator}/>
      </View>
    );
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
    );
  }

  const ModifyAdminDialogContent = () => {
    return (
      <>
        {
          showAdminDialog && (
            <Dialog
              title={dialogTitle}
              description={dialogDescription}
              confirmTitle={t('components.dialog.adminManagement.save')}
              onConfirm={modifyAdmin}
              isCancelAvailable={true}
              onCancel={resetDialog}
            >
              <>
                <GladisTextInput
                  value={firstName}
                  onValueChange={setFirstName}
                  placeholder={t('quotation.firstName')}
                />
                <GladisTextInput 
                  value={lastName}
                  onValueChange={setLastName}
                  placeholder={t('quotation.lastName')}
                />
                <GladisTextInput 
                  value={email}
                  onValueChange={setEmail}
                  placeholder={t('quotation.email')}
                />
                <GladisTextInput 
                  value={phoneNumber}
                  onValueChange={setPhoneNumber}
                  placeholder={t('quotation.phone')}
                />
              </>
            </Dialog>
          )
        }
      </>
    );
  }

  function DeleteDialogContent() {
    return (
      <>
        {
          showDeleteDialog && (
            <Dialog
              title={dialogTitle}
              description={dialogDescription}
              confirmTitle={t('components.dialog.adminManagement.delete.button')}
              onConfirm={deleteAdmin}
              isCancelAvailable={true}
              onCancel={resetDialog}
            />
          )
        }
      </>
    );
  }

  return (
    <>
      <AppContainer
        mainTitle={t('settings.adminUserManagement.title')}
        showSearchText={true}
        showSettings={false}
        showBackButton={true}
        navigateBack={navigateBack}
      >
        <Grid
          data={admins}
          renderItem={(renderItem) => AdminRow(renderItem.item)}
        />
      </AppContainer>
      {ToastContent()}
      {ModifyAdminDialogContent()}
      {DeleteDialogContent()}
      <TooltipAction
        showDialog={showActionDialog}
        title={`${t('components.dialog.adminManagement.title')}: ${selectedAdmin?.firstName} ${selectedAdmin?.lastName}`}
        isConfirmAvailable={false}
        isCancelAvailable={true}
        onConfirm={() => {}}
        onCancel={resetDialog}
        popoverActions={popoverActions}
      />
    </>
  );
}

export default AdminUserManagementScreen;
