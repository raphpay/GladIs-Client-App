import React from 'react';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../assets/styles/components/DialogStyles';

type DialogProps = {
  title: string;
  description?: string;
  confirmTitle?: string;
  cancelTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: JSX.Element;
};

function Dialog(props: DialogProps): React.JSX.Element {

  const {
    title,
    description,
    confirmTitle,
    cancelTitle,
    onConfirm,
    onCancel,
    children,
  } = props;
  return (
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.title}>{description}</Text>
        {children}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onConfirm}>
            <Text>{confirmTitle ?? "Confirm"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel}>
            <Text>{cancelTitle ?? "Cancel"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default Dialog;