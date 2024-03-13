import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import FinderModule from '../../../business-logic/modules/FinderModule';
import AuthenticationService from '../../../business-logic/services/AuthenticationService';
import UserService from '../../../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { removeToken } from '../../../business-logic/store/slices/tokenReducer';
import { RootState } from '../../../business-logic/store/store';
import Utils from '../../../business-logic/utils/Utils';

import AppContainer from '../../components/AppContainer';
import Dialog from '../../components/Dialog';
import ErrorDialog from '../../components/ErrorDialog';
import GladisTextInput from '../../components/GladisTextInput';

import { format } from 'date-fns';
import { IDocumentActivityLogInput } from '../../../business-logic/model/IDocumentActivityLog';
import IFile from '../../../business-logic/model/IFile';
import DocumentLogAction from '../../../business-logic/model/enums/DocumentLogAction';
import DocumentActivityLogsService from '../../../business-logic/services/DocumentActivityLogsService';
import DocumentService from '../../../business-logic/services/DocumentService';
import styles from '../../assets/styles/settings/SettingsScreenStyles';

type ClientSettingsScreenFromAdminProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.ClientSettingsScreenFromAdmin>;

interface ISettingsAction {
  id: string;
  title: string;
  action: () => void;
  isActionDisabled: boolean;
}

function ClientSettingsScreenFromAdmin(props: ClientSettingsScreenFromAdminProps): React.JSX.Element {
  const { t } = useTranslation();
  const { navigation } = props;
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentUser, currentClient } = useAppSelector((state: RootState) => state.users);
  const dispatch = useAppDispatch();

  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState<boolean>(false);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const [showBillDialog, setShowBillDialog] = useState<boolean>(false);
  const [documentName, setDocumentName] = useState<string>('');

  const settingsActions: ISettingsAction[] = [
    {
      id: 'userInfos',
      title: `${t('settings.userInfos')} ${currentUser?.username}`,
      action: () => {},
      isActionDisabled: true,
    },
    {
      id: 'clientInfos',
      title: `${t('settings.clientSettings.clientInfos')} ${currentClient?.username}`,
      action: () => {},
      isActionDisabled: true,
    },
    {
      id: 'addBillID',
      title: t('settings.clientSettings.addBill'),
      action: () => displayBillDialog(),
      isActionDisabled: false,
    }
  ];

  function navigateBack() {
    navigation.goBack()
  }

  function displayBillDialog() {
    setShowBillDialog(true);
  }

  async function addBill() {
    if (currentClient) {
      const path = `${currentClient.companyName}/bills/`;
      const filename = documentName.replace(/\s/g, "_");
      let data: string = '';
      if (Platform.OS !== 'macos') {
        const doc = await DocumentPicker.pickSingle({ type: DocumentPicker.types.pdf })
        data = await Utils.getFileBase64FromURI(doc.uri) as string;
      } else {
        data = await FinderModule.getInstance().pickPDF();
      }
      const file: IFile = { data, filename: filename}
      const createdDocument = await DocumentService.getInstance().upload(file, filename, path, token);
      const logInput: IDocumentActivityLogInput = {
        action: DocumentLogAction.Creation,
        actorIsAdmin: true,
        actorID: currentUser?.id as string,
        clientID: currentClient?.id as string,
        documentID: createdDocument.id,
      }
      await DocumentActivityLogsService.getInstance().recordLog(logInput, token);
      setShowBillDialog(false);
    }
  }

  async function submitPasswordChange() {
    if (oldPassword.length !== 0 && newPassword.length !== 0) {
      try {
        await UserService.getInstance().changePassword(oldPassword, newPassword);
        setShowDialog(false);
      } catch (error) {
        console.log('Error changing password', error);
      }
    }
  }

  async function logout() {
    try {
      await AuthenticationService.getInstance().logout(token)
      dispatch(removeToken())
    } catch (error) {
      setShowErrorDialog(true);
    }
  }

  useEffect(() => {
    const today = new Date();
    const formatedDate = format(today, 'dd_MM_yyyy');
    setDocumentName(formatedDate);
  }, []);

  function billDialog() {
    return (
      <>
        {
          showBillDialog && (
            <Dialog
              title={t('components.dialog.addDocument.title')}
              confirmTitle={t('components.dialog.addDocument.confirmButton')}
              onConfirm={addBill}
              isCancelAvailable={true}
              onCancel={() => setShowBillDialog(false)}
              isConfirmDisabled={documentName.length === 0}
            >
              <TextInput
                value={documentName}
                onChangeText={setDocumentName}
                placeholder={t('components.dialog.addDocument.placeholder')}
                style={styles.dialogInput}
              />
            </Dialog>
          )
        }
      </>
    )
  }

  function additionalMentions() {
    // TODO: Add app version number to API
    return (
      <View style={styles.additionalMentions}>
        <Text style={styles.mentionText}>{t('legal.appName')} v 0.1.0</Text>
        <Text style={styles.mentionText}>{t('legal.developer')}</Text>
      </View>
    )
  }

  function dialogContent() {
    return (
      <>
        {
          showDialog && (
            <Dialog
              title={t('components.dialog.firstConnection.title')}
              description={t('components.dialog.firstConnection.description')}
              confirmTitle={t('components.dialog.firstConnection.confirmButton')}
              isConfirmDisabled={oldPassword.length === 0 || newPassword.length === 0}
              onConfirm={submitPasswordChange}
              isCancelAvailable={true}
              onCancel={() => setShowDialog(false)}
            >
              <>
                <GladisTextInput 
                  value={oldPassword}
                  placeholder={t('components.dialog.firstConnection.temporary')}
                  onValueChange={setOldPassword}
                  secureTextEntry={true}
                  autoCapitalize={'none'}
                  showVisibilityButton={true}
                  width={'100%'}
                />
                <GladisTextInput 
                  value={newPassword}
                  placeholder={t('components.dialog.firstConnection.new')}
                  onValueChange={setNewPassword}
                  secureTextEntry={true}
                  autoCapitalize={'none'}
                  showVisibilityButton={true}
                  width={'100%'}
                />
              </>
            </Dialog>
          )
        }
      </>
    );
  }

  function logoutDialog() {
    return (
      <>
        {
          showLogoutDialog && (
            <Dialog 
              title={t('components.dialog.logout.title')}
              confirmTitle={t('components.dialog.logout.confirmButton')}
              onConfirm={logout}
              isCancelAvailable={true}
              onCancel={() => setShowLogoutDialog(false)}
            />
          )
        }
      </>
    )
  }

  function errorDialog() {
    return (
      <>
        {
          showErrorDialog && (
            <ErrorDialog
              title={t('errors.logout.title')}
              description={t('errors.logout.message')}
              cancelTitle={t('errors.modules.cancelButton')}
              onCancel={() => setShowErrorDialog(false)}
            />
          )
        }
      </>
    )
  }

  function SettingsActionFlatListItem(item: ISettingsAction) {
    return (
      <TouchableOpacity
        disabled={item.isActionDisabled}
        style={styles.actionContainer}
        onPress={item.action}
      >
        <Text style={item.isActionDisabled ? styles.text : styles.actionText}>{item.title}</Text>
        <View style={styles.separator} />
      </TouchableOpacity>
    )
  }

  return (
    <>
      <AppContainer
        mainTitle={t('settings.title')}
        showSearchText={false}
        showSettings={false}
        showBackButton={true}
        navigateBack={navigateBack}
        additionalComponent={additionalMentions()}
      >
        <FlatList
          data={settingsActions}
          renderItem={(renderItem) => SettingsActionFlatListItem(renderItem.item)}
          keyExtractor={(item) => item.id}
        />
      </AppContainer>
      {dialogContent()}
      {logoutDialog()}
      {errorDialog()}
      {billDialog()}
    </>
  );
}

export default ClientSettingsScreenFromAdmin;