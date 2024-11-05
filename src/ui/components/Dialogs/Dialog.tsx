import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/components/DialogStyles';

type DialogProps = {
  title: string;
  description?: string;
  confirmTitle?: string;
  cancelTitle?: string;
  isConfirmDisabled?: boolean;
  isConfirmAvailable?: boolean | true;
  isCancelAvailable?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  descriptionChildren?: JSX.Element;
  children?: JSX.Element;
  extraConfirmButtonTitle?: string;
  extraConfirmButtonAction?: () => void;
};

function Dialog(props: DialogProps): React.JSX.Element {
  const {
    title,
    description,
    confirmTitle,
    cancelTitle,
    isConfirmDisabled,
    isConfirmAvailable,
    isCancelAvailable,
    onConfirm,
    onCancel,
    descriptionChildren,
    children,
    extraConfirmButtonTitle,
    extraConfirmButtonAction,
  } = props;
  const { t } = useTranslation();

  return (
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        <Text style={styles.title}>{title}</Text>
        {descriptionChildren ? (
          descriptionChildren
        ) : (
          <Text style={styles.description}>{description}</Text>
        )}
        {children}
        <View style={styles.buttonContainer}>
          {isCancelAvailable ? (
            <TouchableOpacity style={styles.dialogButton} onPress={onCancel}>
              <Text style={[styles.buttonText, { color: Colors.danger }]}>
                {cancelTitle ?? t('components.dialog.cancel')}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          {isConfirmAvailable == true || isConfirmAvailable == undefined ? (
            <View style={styles.confirmButtonsContainer}>
              <TouchableOpacity
                style={styles.dialogButton}
                onPress={onConfirm}
                disabled={isConfirmDisabled}>
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: isConfirmDisabled
                        ? Colors.inactive
                        : Colors.primary,
                    },
                  ]}>
                  {confirmTitle ?? t('components.dialog.confirm')}
                </Text>
              </TouchableOpacity>
              {extraConfirmButtonAction && extraConfirmButtonTitle && (
                <TouchableOpacity
                  style={styles.extraButton}
                  onPress={extraConfirmButtonAction}>
                  <Text style={[styles.buttonText, { color: Colors.primary }]}>
                    {extraConfirmButtonTitle}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={{ flex: 1 }} />
          )}
        </View>
      </View>
    </View>
  );
}

export default Dialog;