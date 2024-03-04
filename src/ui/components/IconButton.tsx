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

import { Colors } from '../assets/colors/colors';
import styles from '../assets/styles/components/IconButtonStyles';

type IconButtonProps = {
  title: string;
  icon: ImageSourcePropType;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string
  textColor?: string
};

function IconButton(props: IconButtonProps): React.JSX.Element {
  const { title, icon, onPress, style, backgroundColor, textColor } = props;

  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <View style={[styles.container, { backgroundColor: backgroundColor || Colors.primary}]}>
          <Image
            style={styles.icon}
            source={icon}
          />
        <Text style={[styles.textButton, { color: textColor || Colors.white }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default IconButton;