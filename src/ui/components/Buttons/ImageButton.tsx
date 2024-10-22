import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  TouchableOpacity,
  ViewStyle
} from 'react-native';

import styles from '../../assets/styles/components/ImageButtonStyles';
import { Colors } from '../../assets/colors/colors';

type ImageButtonProps = {
  icon: ImageSourcePropType;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string
  disabled?: boolean;
  onLongPress?: () => void;
};

function ImageButton(props: ImageButtonProps): React.JSX.Element {
  const { icon, onPress, style, backgroundColor, disabled, onLongPress } = props;

  const color = disabled ? Colors.inactive : ( backgroundColor || Colors.primary);

  return (
    <TouchableOpacity
      style={[styles.container, style, { backgroundColor: color }]}
      onPress={onPress}
      disabled={disabled}
      onLongPress={onLongPress}
    >
        <Image
            style={styles.icon}
            source={icon}
        />
    </TouchableOpacity>
  );
}

export default ImageButton;