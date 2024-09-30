import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, ScrollView, Text, View } from 'react-native';

import { IRootStackParams } from '../../../../navigation/Routes';

import FormEditionManager from '../../../../business-logic/manager/FormEditionManager';
import { IFormCell } from '../../../../business-logic/model/IForm';
import DocumentLogAction from '../../../../business-logic/model/enums/DocumentLogAction';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../../business-logic/model/enums/UserType';
import { useAppDispatch, useAppSelector } from '../../../../business-logic/store/hooks';
import { setFormsCount } from '../../../../business-logic/store/slices/formReducer';
import { RootState } from '../../../../business-logic/store/store';
import Utils from '../../../../business-logic/utils/Utils';

import AppContainer from '../../../components/AppContainer/AppContainer';
import TextButton from '../../../components/Buttons/TextButton';
import Dialog from '../../../components/Dialogs/Dialog';
import Toast from '../../../components/Toast';
import FormTextInput from '../DocumentScreen/FormTextInput';
import FormEditionHeaderCell from './FormEditionHeaderCell';
import ImageButton from '../../../components/Buttons/ImageButton';

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
  // Images
  const addRowImage = require('../../../assets/images/add-row.png');
  const addColumnImage = require('../../../assets/images/add-column.png');
  const removeRowImage = require('../../../assets/images/remove-row.png');
  const removeColumnImage = require('../../../assets/images/remove-column.png');
  // States
  const [grid, setGrid] = useState<IFormCell[][]>([[]]);
  // Dialogs
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const [showQuitWithoutSavingDialog, setShowQuitWithoutSavingDialog] = useState<boolean>(false);
  const [showDeleteLastColumnConfirmationDialog, setShowDeleteLastColumnConfirmationDialog] = useState<boolean>(false);
  const [showDeleteLastRowConfirmationDialog, setShowDeleteLastRowConfirmationDialog] = useState<boolean>(false);
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
  const isUserEmployee = currentUser?.userType === UserType.Employee;

  // Sync Methods
  function tappedOnBackButton() {
    Keyboard.dismiss();
    if (doesFormContainsData()) {
      setShowQuitWithoutSavingDialog(true);
    } else {
      navigateBack();
    }
  }

  function navigateBack() {
    resetDialogs();
    FormEditionManager.getInstance().resetForm();
    navigation.goBack();
  }

  function addColumn() {
    let updatedGrid: IFormCell[][];

    updatedGrid = grid.map((row, index) => {
      const newCell = { id: Utils.generateUUID(), value: '', isTitle: index === 0 };
      return [...row, newCell];
    });

    setGrid(updatedGrid);
  }

  function addRow() {
    if (grid[0].length > 0) {
      const newRow = Array(grid[0].length).fill({}).map(() => ({ id: Utils.generateUUID(), value: '', isTitle: false }));
      setGrid([...grid, newRow]);
    } else {
      displayToast(t('forms.toast.warning.addColumnFirst'), true);
    }
  }

  function removeColumn() {
    const isLastColumnEmpty = grid.every(row => row[row.length - 1].value === '');
    if (isLastColumnEmpty) {
      const updatedGrid = grid.map(row => row.slice(0, -1));
      setGrid(updatedGrid);
    } else {
      displayToast(t('forms.toast.warning.cleanColumnFirst'), true);
    }
  };

  function removeRow() {
    const lastRow = grid[grid.length - 1];
    const isLastRowEmpty = lastRow.every(cell => cell.value === '');
    if (isLastRowEmpty) {
      const updatedGrid = grid.slice(0, -1);
      setGrid(updatedGrid);
    } else {
      displayToast(t('forms.toast.warning.cleanRowFirst'), true);
    }
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

  function displaySaveDialog() {
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

  function doesFormContainsData() {
    let containsData = false;
    containsData = formTitle.length > 0 ||
      grid.length > 1;
    return containsData;
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  function resetDialogs() {
    setShowSaveDialog(false);
    setShowQuitWithoutSavingDialog(false);
    setShowDeleteLastColumnConfirmationDialog(false);
    setShowDeleteLastRowConfirmationDialog(false);
  }

  function displayRemoveColumnConfirmationDialog() {
    if (currentUser?.userType === UserType.Admin) {
      resetDialogs();
      setShowDeleteLastColumnConfirmationDialog(true);
    }
  }

  function displayRemoveRowConfirmationDialog() {
    if (currentUser?.userType === UserType.Admin) {
      resetDialogs();
      setShowDeleteLastRowConfirmationDialog(true);
    }
  }

  function deleteLastColumn() {
    const gridWithoutLastColumn = FormEditionManager.getInstance().deleteLastColumn();
    setGrid(gridWithoutLastColumn);
    setShowDeleteLastColumnConfirmationDialog(false);
  }

  function deleteLastRow() {
    const gridWithoutLastRow = FormEditionManager.getInstance().deleteLastRow();
    setGrid(gridWithoutLastRow);
    setShowDeleteLastRowConfirmationDialog(false);
  }
  
  // Async Methods
  async function saveForm() {
    try {
      if (form) {
        await FormEditionManager.getInstance().updateForm(form, currentUser, token);
        await FormEditionManager.getInstance().recordLog(
          DocumentLogAction.Modification,
          currentUser?.userType as UserType,
          currentUser?.id as string,
          currentClient?.id as string,
          form,
          token
        )
      } else {
        const createdForm = await FormEditionManager.getInstance().createForm(
          formTitle,
          currentUser?.id as string,
          documentPath,
          currentClient?.id as string,
          token
        );
        await FormEditionManager.getInstance().recordLog(
          DocumentLogAction.Creation,
          currentUser?.userType as UserType,
          currentUser?.id as string,
          currentClient?.id as string,
          createdForm,
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
  function ActionButtons() {
    const isColumnGreaterThanOne = grid && grid[0].length >= 1;
    const isRowGreaterThanOne = grid.length > 1;
    
    return (
      <View style={styles.actionButtonContainer}>
        {
          !isUserEmployee && (
            <>
            <ImageButton
                icon={addColumnImage}
                onPress={addColumn}
                style={styles.actionButton}
              />
              <ImageButton
                icon={removeColumnImage}
                onPress={removeColumn}
                style={styles.actionButton}
                disabled={!isColumnGreaterThanOne}
                onLongPress={displayRemoveColumnConfirmationDialog}
              />
              <ImageButton
                icon={addRowImage}
                onPress={addRow}
                style={styles.actionButton}
              />
              <ImageButton
                icon={removeRowImage}
                onPress={removeRow}
                style={styles.actionButton}
                disabled={!isRowGreaterThanOne}
                onLongPress={displayRemoveRowConfirmationDialog}
              />
            </>
          )
        }
      </View>
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
      <Toast
        message={toastMessage}
        isVisible={showToast}
        setIsVisible={setShowToast}
        isShowingError={toastIsShowingError}
      />
    );
  }

  function QuitWithoutSavingDialog() {
    return (
      <Dialog
        title={t('forms.dialog.quit.title')}
        description={t('forms.dialog.quit.description')}
        confirmTitle={t('forms.dialog.quit.confirmTitle')}
        cancelTitle={t('forms.dialog.quit.cancelTitle')}
        isConfirmAvailable={true}
        isCancelAvailable={true}
        onConfirm={navigateBack}
        onCancel={() => { setShowQuitWithoutSavingDialog(false) }}
      />
    )
  }

  function RemoveLastColumnConfirmationDialog() {
    return (
      <Dialog
        title={t('forms.dialog.confirmDelete.column.title')}
        description={t('forms.dialog.confirmDelete.column.description')}
        onConfirm={deleteLastColumn}
        onCancel={resetDialogs}
        isConfirmAvailable={true}
        isCancelAvailable={true}
      />
    )
  }

  function RemoveLastRowConfirmationDialog() {
    return (
      <Dialog
        title={t('forms.dialog.confirmDelete.row.title')}
        description={t('forms.dialog.confirmDelete.row.description')}
        onConfirm={deleteLastRow}
        onCancel={resetDialogs}
        isConfirmAvailable={true}
        isCancelAvailable={true}
      />
    )
  }

  return (
    <>
      <AppContainer
        mainTitle='Forms'
        showBackButton={true}
        navigateBack={tappedOnBackButton}
        adminButton={ActionButtons()}
        additionalComponent={SaveButton()}
        showSearchText={false}
        showSettings={false}
      >
        <ScrollView style={{ flex : 1 }}>
          <FormEditionHeaderCell
              value={formTitle}
              setValue={setFormTitle}
              title={t('forms.headerCells.title')}
              placeholder={t('forms.creation.formTitle')}
              editable={!showSaveDialog}
              width={'100%'}
            />
            <View style={styles.separator}/>

          {/* Form Creator cells */}
          <View style={styles.cellRow}>
            <FormEditionHeaderCell
              value={formCreation}
              setValue={setFormCreation}
              title={t('forms.headerCells.createdAt')}
              placeholder={t('forms.creation.creationDate')}
              editable={!showSaveDialog}
              width={'50%'}
            />
            <FormEditionHeaderCell
              value={formCreationActor}
              setValue={setFormCreationActor}
              title={t('forms.headerCells.createdBy')}
              placeholder={t('forms.creation.creationActor')}
              editable={!showSaveDialog}
              width={'50%'}
            />
          </View>

          {/* Form Updator cells */}
          <View style={styles.cellRow}>
            <FormEditionHeaderCell
              value={formUpdate}
              setValue={setFormUpdate}
              title={t('forms.headerCells.updatedAt')}
              placeholder={t('forms.creation.updateDate')}
              editable={!showSaveDialog}
              width={'50%'}
            />
            <FormEditionHeaderCell
              value={formUpdateActor}
              setValue={setFormUpdateActor}
              title={t('forms.headerCells.updatedBy')}
              placeholder={t('forms.creation.updateActor')}
              editable={!showSaveDialog}
              width={'50%'}
            />
          </View>
          <View style={styles.separator}/>


          {/* Grid */}
          {grid.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, columnIndex) => (
                <FormTextInput
                  key={columnIndex}
                  value={cell.value}
                  onChangeText={(newText) => updateCell(rowIndex, columnIndex, newText)}
                  editable={!showSaveDialog || !showQuitWithoutSavingDialog}
                  isTitle={cell.isTitle}
                  multiline={false}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      </AppContainer>
      {showSaveDialog && SaveDialogContent()}
      {showQuitWithoutSavingDialog && QuitWithoutSavingDialog()}
      {showToast && ToastContent()}
      {showDeleteLastColumnConfirmationDialog && RemoveLastColumnConfirmationDialog()}
      {showDeleteLastRowConfirmationDialog && RemoveLastRowConfirmationDialog()}
    </>
  );
}

export default FormEditionScreen;