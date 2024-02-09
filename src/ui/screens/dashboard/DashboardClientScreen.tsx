import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { IClientDashboardStackParams } from '../../../navigation/Routes';

import IToken from '../../../business-logic/model/IToken';
import UserService from '../../../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { removeToken, removeUser } from '../../../business-logic/store/slices/tokenReducer';
import { RootState } from '../../../business-logic/store/store';

import AppIcon from '../../components/AppIcon';
import SearchTextInput from '../../components/SearchTextInput';

import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/dashboard/DashboardClientScreenStyles';


type DashboardClientScreenProps = NativeStackScreenProps<IClientDashboardStackParams, 'DashboardClientScreen'>;

function DashboardClientScreen(props: DashboardClientScreenProps): React.JSX.Element {
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

  function navigateToCategory() {
    navigation.navigate('CategoriesScreen', { isAdmin: false, category: 'documentManagement'})
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.innerComponentsContainer}>
          <View style={styles.searchInputContainer}>
            <SearchTextInput 
              searchText={searchText}
              setSearchText={setSearchText}
            />
          </View>
          <TouchableOpacity onPress={navigateToCategory} style={[styles.moduleContainer, { backgroundColor: Colors.inactive}]}>
            <Text>{t('dashboard.modules.documentManagement')}</Text>
          </TouchableOpacity>
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

export default DashboardClientScreen;