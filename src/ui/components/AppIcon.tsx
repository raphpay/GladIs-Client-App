import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';

import { useAppDispatch } from '../../business-logic/store/hooks';

import styles from '../assets/styles/components/AppIconStyles';

type AppIconProps = {
  style?: StyleProp<ViewStyle>;
};

function AppIcon(props: AppIconProps): React.JSX.Element {

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, props.style]}>
      <Image
        source={require('../assets/images/Logo-Gladis_Vertical-Couleur1-Fond-Transparent.png')}
        style={styles.image}
      />
    </View>
  );
}

export default AppIcon;