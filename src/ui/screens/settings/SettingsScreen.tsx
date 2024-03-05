import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserService from '../../../business-logic/services/UserService';

import AppContainer from '../../components/AppContainer';
import Dialog from '../../components/Dialog';
import GladisTextInput from '../../components/GladisTextInput';

import styles from '../../assets/styles/settings/SettingsScreenStyles';

type SettingsScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.SettingsScreen>;

interface ISettingsAction {
  id: string;
  title: string;
  action: () => void;
}

function SettingsScreen(props: SettingsScreenProps): React.JSX.Element {
  const { t } = useTranslation();
  const { navigation } = props;

  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const settingsActions: ISettingsAction[] = [
    {
      id: 'changePasswordId',
      title: t('settings.modifyPassword'),
      action: () => showModifyPasswordDialog()
    }
  ];


  function showModifyPasswordDialog() {
    setShowDialog(true);
  }

  function navigateBack() {
    navigation.goBack()
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

  function SettingsActionFlatListItem(item: ISettingsAction) {
    return (
      <TouchableOpacity style={styles.actionContainer} onPress={item.action}>
        <Text style={styles.actionText}>{item.title}</Text>
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
    </>
  );
}

export default SettingsScreen;