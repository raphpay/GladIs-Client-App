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
  imageData?: string;
};

function AppIcon(props: AppIconProps): React.JSX.Element {

  return (
    <View style={[styles.container, props.style]}>
      {
        props.imageData ? (
          <Image
            source={{uri: props.imageData}}
            style={styles.clientIcon}
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