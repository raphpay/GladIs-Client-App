import React from 'react';
import {
  Image,
  StyleProp,
  View,
  ViewStyle
} from 'react-native';


import styles from '../assets/styles/components/AppIconStyles';

type AppIconProps = {
  logo?: string;
  style?: StyleProp<ViewStyle>;
};

function AppIcon(props: AppIconProps): React.JSX.Element {

  const { logo, style } = props;

  return (
    <View style={[styles.container, style]}>
      {
        logo ? (
          <Image
            source={{uri: logo}}
            style={styles.logo}
          />
        ) : (
          <Image
            source={require('../assets/images/Logo-Gladis_Vertical-Couleur1-Fond-Transparent.png')}
            style={styles.image}
          />
        )
      }
    </View>
  );
}

export default AppIcon;