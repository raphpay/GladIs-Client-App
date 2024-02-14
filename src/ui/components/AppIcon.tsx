import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

import AuthenticationService from '../../business-logic/services/AuthenticationService';
import { useAppDispatch } from '../../business-logic/store/hooks';
import { removeToken } from '../../business-logic/store/slices/tokenReducer';

import styles from '../assets/styles/components/AppIconStyles';

type AppIconProps = {
  style?: StyleProp<ViewStyle>;
};

function AppIcon(props: AppIconProps): React.JSX.Element {

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  async function logout() {
    await AuthenticationService.getInstance()
      .logout()
      .then(() => {
        dispatch(removeToken())
      })
      .catch(() => {
        Alert.alert(t('errors.logout.title'), t('error.logout.message'));
      });
  }

  return (
    <TouchableOpacity onPress={logout}>
      <View style={[styles.container, props.style]}>
        <Image
          source={require('../assets/images/Logo-Gladis_Vertical-Couleur1-Fond-Transparent.png')}
          style={styles.image}
        />
      </View>
    </TouchableOpacity>
  );
}

export default AppIcon;