import React from 'react';
import {
  Image,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';

import styles from '../assets/styles/components/AppIconStyles';

type AppIconProps = {
  style?: StyleProp<ViewStyle>;
};

function AppIcon(props: AppIconProps): React.JSX.Element {

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