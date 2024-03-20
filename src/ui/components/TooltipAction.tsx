import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import IAction from '../../business-logic/model/IAction';
import { Colors } from '../assets/colors/colors';
import { Fonts } from '../assets/fonts/fonts';
import Dialog from './Dialog';

type TooltipActionProps = {
  showDialog: boolean;
  title: string;
  description?: string;
  confirmTitle?: string;
  cancelTitle?: string;
  isConfirmDisabled?: boolean;
  isConfirmAvailable?: boolean | true;
  isCancelAvailable?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  popoverActions: IAction[];
};

function TooltipAction(props: TooltipActionProps): React.JSX.Element {

  const {
    showDialog,
    title,
    description,
    confirmTitle,
    cancelTitle,
    isConfirmDisabled,
    isConfirmAvailable,
    isCancelAvailable,
    onConfirm,
    onCancel,
    popoverActions,
  } = props;

  return (
    <>
      {
        showDialog && (
          <Dialog
            title={title}
            description={description}
            confirmTitle={confirmTitle}
            cancelTitle={cancelTitle}
            isConfirmDisabled={isConfirmDisabled}
            isConfirmAvailable={isConfirmAvailable}
            isCancelAvailable={isCancelAvailable}
            onConfirm={onConfirm}
            onCancel={onCancel}
          >
            <>
              {popoverActions.map((action: IAction, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.popoverButton}
                  onPress={action.onPress} disabled={action.isDisabled}
                >
                  <Text style={[styles.popoverButtonText, {color: action.isDisabled ? Colors.inactive : Colors.primary}]}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </>
          </Dialog>
        )
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // TODO: Create component for this
  popoverButton: {
    width: '500%',
    marginVertical: 4,
    marginBottom: 18
  },
  popoverButtonText: {
    fontSize: 14,
    fontFamily: Fonts.poppinsLight,
  },
});

export default TooltipAction;