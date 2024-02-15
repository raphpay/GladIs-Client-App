import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';

import styles from '../assets/styles/components/IconButtonStyles';

type IconButtonProps = {
  title: string;
  icon: ImageSourcePropType;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

function IconButton(props: IconButtonProps): React.JSX.Element {
  const { title, icon, onPress, style } = props;

  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <View style={styles.container}>
          <Image
            style={styles.icon}
            source={icon}
          />
        <Text style={styles.textButton}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default IconButton;