import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/components/ErrorDialogStyles';

type DialogProps = {
  title: string;
  description?: string;
  cancelTitle?: string;
  onCancel: () => void;
};

function ErrorDialog(props: DialogProps): React.JSX.Element {

  const {
    title,
    description,
    cancelTitle,
    onCancel,
  } = props;
  const { t } = useTranslation();

  return (
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={[styles.buttonText, { color: Colors.primary }]}>{cancelTitle ?? t('components.dialog.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default ErrorDialog;