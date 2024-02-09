import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { IAdminDashboardStackParams } from '../../../navigation/Routes';

import IToken from '../../../business-logic/model/IToken';
import UserService from '../../../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { removeToken, removeUser } from '../../../business-logic/store/slices/tokenReducer';
import { RootState } from '../../../business-logic/store/store';

import AppIcon from '../../components/AppIcon';
import IconButton from '../../components/IconButton';
import SearchTextInput from '../../components/SearchTextInput';

import plusIcon from '../../assets/images/plus.png';
import styles from '../../assets/styles/dashboard/DashboardAdminScreenStyles';

type DashboardAdminScreenProps = NativeStackScreenProps<IAdminDashboardStackParams, 'DashboardAdminScreen'>;

function DashboardAdminScreen(props: DashboardAdminScreenProps): React.JSX.Element {

  const [searchText,setSearchText] = useState<string>('');

  const { t } = useTranslation();

  const { token } = useAppSelector((state: RootState) => state.token);
  const dispatch = useAppDispatch();

  const { navigation } = props;

  async function logout() {
    const castedToken = token as IToken;
    await UserService.getInstance().logout(castedToken);
    dispatch(removeToken());
    dispatch(removeUser());
    navigation.popToTop();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.innerComponentsContainer}>
          <View style={styles.searchInputContainer}>
            <IconButton
              title={t('components.buttons.addClient')}
              icon={plusIcon}
              onPress={() => { console.log('hello')}}
            />
            <SearchTextInput
              searchText={searchText}
              setSearchText={setSearchText}
            />
          </View>
          <View style={styles.clientContainer}>
            <View style={styles.innerTopClientContainer}>
              <Text>Client A</Text>
            </View>
            <View style={styles.innerBottomClientContainer}>
              <Text>{t('dashboard.modules.documentManagement')}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={logout}>
          <AppIcon style={styles.appIcon} />
        </TouchableOpacity>
        <Text style={styles.navigationHistory}>
          {t('dashboard.title')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default DashboardAdminScreen;