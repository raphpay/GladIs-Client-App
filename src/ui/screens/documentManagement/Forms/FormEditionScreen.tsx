import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, ScrollView, View } from 'react-native';

import { IRootStackParams } from '../../../../navigation/Routes';

import FormEditionManager from '../../../../business-logic/manager/FormEditionManager';
import IAction from '../../../../business-logic/model/IAction';
import { IFormCell } from '../../../../business-logic/model/IForm';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import { useAppDispatch, useAppSelector } from '../../../../business-logic/store/hooks';
import { setFormsCount } from '../../../../business-logic/store/slices/formReducer';
import { RootState } from '../../../../business-logic/store/store';
import Utils from '../../../../business-logic/utils/Utils';

import AppContainer from '../../../components/AppContainer/AppContainer';
import IconButton from '../../../components/Buttons/IconButton';
import TextButton from '../../../components/Buttons/TextButton';
import Dialog from '../../../components/Dialogs/Dialog';
import Toast from '../../../components/Toast';
import TooltipAction from '../../../components/TooltipAction';
import FormTextInput from '../DocumentScreen/FormTextInput';

import styles from '../../../assets/styles/forms/FormEditionScreenStyles';

type FormEditionScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.FormEditionScreen>;

function FormEditionScreen(props: FormEditionScreenProps): React.JSX.Element {

  const { navigation } = props;
  const { form, documentPath } = props.route.params;
  const { t } = useTranslation();
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentUser, currentClient } = useAppSelector((state: RootState) => state.users);
  const { formsCount } = useAppSelector((state: RootState) => state.forms);
  const dispatch = useAppDispatch();
  // States
  const [grid, setGrid] = useState<IFormCell[][]>([[]]);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCreation, setFormCreation] = useState('');
  const [formUpdate, setFormUpdate] = useState('');
  const [formCreationActor, setFormCreationActor] = useState('');
  const [formUpdateActor, setFormUpdateActor] = useState('');
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);

  const plusIcon = require('../../../assets/images/plus.png');

  const popoverActions: IAction[] = [
    {
      title: t('forms.actions.addColumn'),
      onPress: () => addColumn(),
    },
    {
      title: t('forms.actions.addRow'),
      onPress: () => addRow(),
    },
  ];

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  function addColumn() {
    let updatedGrid: IFormCell[][];

    updatedGrid = grid.map((row, index) => {
      const newCell = { id: Utils.generateUUID(), value: '', isTitle: index === 0 };
      return [...row, newCell];
    });

    setGrid(updatedGrid);
    setShowActionDialog(false);
  }

  function addRow() {
    if (grid[0].length > 0) {
      const newRow = Array(grid[0].length).fill({}).map(() => ({ id: Utils.generateUUID(), value: '', isTitle: false }));
      setGrid([...grid, newRow]);
    } else {
      console.log('Add column first');
    }
    setShowActionDialog(false);
  }

  function removeColumn() {
    const updatedGrid = grid.map(row => row.slice(0, -1));
    setGrid(updatedGrid);
  };

  function removeRow() {
    const updatedGrid = grid.slice(0, -1);
    setGrid(updatedGrid);
  }

  function updateCell(rowIndex: number, columnIndex: number, newText: string) {
    // Create a copy of the grid
    const newGrid = [...grid];

    // Update the cell value in the copied grid
    newGrid[rowIndex][columnIndex].value = newText;

    // Update the state with the new grid
    setGrid(newGrid);
    FormEditionManager.getInstance().setGrid(newGrid);
  };

  function displayActionDialog() {
    Keyboard.dismiss();
    setShowActionDialog(true);
  }

  function displaySaveDialog() {
    setShowActionDialog(false);
    Keyboard.dismiss();
    setShowSaveDialog(true);
  }

  function isFormFilled() {
    let isFilled = false;
    isFilled = formTitle.length > 0 &&
      formCreation.length > 0 &&
      formCreationActor.length > 0 &&
      grid.length > 1;
    return isFilled;
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }
  
  // Async Methods
  async function saveForm() {
    try {
      if (form) {
        await FormEditionManager.getInstance().updateForm(form, currentUser, currentClient, token);
      } else {
        await FormEditionManager.getInstance().createForm(
          formTitle,
          currentUser?.id as string,
          documentPath,
          currentClient?.id as string,
          token
        );
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(errorMessage, true);
    }

    resetDialogs();
    navigateBack();
    // Reload forms
    dispatch(setFormsCount(formsCount + 1));
  }

  async function loadFormInfo() {
    await FormEditionManager.getInstance().loadFormInfo(form, currentUser, token);
    const formTitle = FormEditionManager.getInstance().getFormTitle();
    const formCreation = FormEditionManager.getInstance().getFormCreation();
    const formUpdate = FormEditionManager.getInstance().getFormUpdate();
    const formCreationActor = FormEditionManager.getInstance().getFormCreationActor();
    const formUpdateActor = FormEditionManager.getInstance().getFormUpdateActor();

    setFormTitle(formTitle);
    setFormCreation(formCreation);
    setFormUpdate(formUpdate);
    setFormCreationActor(formCreationActor);
    setFormUpdateActor(formUpdateActor);
  }

  async function loadGrid() {
    await FormEditionManager.getInstance().loadGrid(form);
    const grid = FormEditionManager.getInstance().getGrid();
    setGrid(grid);
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadFormInfo();
      await loadGrid();
    }
    init();
  }, []);

  // Components
  function ActionButton() {
    return (
      <IconButton
        title={t('forms.actions.title')}
        icon={plusIcon}
        onPress={displayActionDialog}
      />
    )
  }

  function resetDialogs() {
    setShowActionDialog(false);
    setShowSaveDialog(false);
  }

  function ActionDialogContent() {
    return (
      <TooltipAction
        showDialog={showActionDialog}
        title={t('forms.actions.title')}
        isConfirmAvailable={true}
        confirmTitle={t('forms.creation.confirm')}
        isCancelAvailable={false}
        onConfirm={() => resetDialogs()}
        onCancel={() => {}}
        popoverActions={popoverActions}
      />
    );
  }

  function SaveButton() {
    return (
      <TextButton
        width={'30%'}
        title={t('components.buttons.save')}
        onPress={displaySaveDialog}
        disabled={!isFormFilled()}
        extraStyle={styles.saveButton}
      />
    );
  }

  function SaveDialogContent() {
    return (
      <Dialog
        title={t('forms.dialog.save.title')}
        description={t('forms.dialog.save.description')}
        isConfirmAvailable={true}
        confirmTitle={t('forms.dialog.save.confirm')}
        onConfirm={() => saveForm()}
        cancelTitle={t('forms.dialog.save.cancel')}
        isCancelAvailable={true}
        onCancel={() => setShowSaveDialog(false)}
      />
    );
  }
  
  function ToastContent() {
    return (
      <>
        {
          showToast && (
            <Toast
              message={toastMessage}
              isVisible={showToast}
              setIsVisible={setShowToast}
              isShowingError={toastIsShowingError}
            />
          )
        }
      </>
    )
  }

  return (
    <>
      <AppContainer
        mainTitle={t('forms.creation.title')}
        showSearchText={false}
        showSettings={false}
        adminButton={ActionButton()}
        showBackButton={true}
        navigateBack={navigateBack}
        additionalComponent={SaveButton()}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <FormTextInput
            value={formTitle}
            onChangeText={setFormTitle}
            isTitle={true}
            placeholder={t('forms.creation.formTitle')}
            editable={!showActionDialog && !showSaveDialog}
            multiline={true}
            numberOfLines={2}
          />
          <View style={styles.separator}/>
          <View style={styles.cellRow}>
            <FormTextInput
              value={formCreation}
              onChangeText={setFormCreation}
              editable={!showActionDialog && !showSaveDialog}
              isTitle={true}
              placeholder={t('forms.creation.creationDate')}
            />
            <FormTextInput
              value={formCreationActor}
              onChangeText={setFormCreationActor}
              editable={!showActionDialog && !showSaveDialog}
              isTitle={true}
              placeholder={t('forms.creation.creationActor')}
            />
          </View>
          <View style={styles.cellRow}>
            <FormTextInput
              value={formUpdate}
              onChangeText={setFormUpdate}
              editable={!showActionDialog && !showSaveDialog}
              isTitle={true}
              placeholder={t('forms.creation.updateDate')}
            />
            <FormTextInput
              value={formUpdateActor}
              onChangeText={setFormUpdateActor}
              editable={!showActionDialog && !showSaveDialog}
              isTitle={true}
              placeholder={t('forms.creation.updateActor')}
            />
          </View>
          <View style={styles.separator}/>
          {grid.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, columnIndex) => (
                <FormTextInput
                  key={columnIndex}
                  value={cell.value}
                  onChangeText={(newText) => updateCell(rowIndex, columnIndex, newText)}
                  editable={!showActionDialog && !showSaveDialog}
                  isTitle={cell.isTitle}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      </AppContainer>
      { ActionDialogContent() }
      { showSaveDialog && SaveDialogContent() }
      { ToastContent() }
    </>
  );
}

export default FormEditionScreen;