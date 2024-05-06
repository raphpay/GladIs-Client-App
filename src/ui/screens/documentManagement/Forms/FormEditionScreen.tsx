import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { IRootStackParams } from '../../../../navigation/Routes';

import IAction from '../../../../business-logic/model/IAction';
import { IFormCell, IFormInput, IFormUpdateInput } from '../../../../business-logic/model/IForm';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import FormService from '../../../../business-logic/services/FormService';
import UserService from '../../../../business-logic/services/UserService';
import { useAppSelector } from '../../../../business-logic/store/hooks';
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
  // States
  const [grid, setGrid] = useState<IFormCell[][]>([[]]);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
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
    {
      title: t('forms.actions.exportToCSV'),
      onPress: () => arrayToCsv(),
    }
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
  };

  function arrayToCsv() {
    // TODO: Export the title and the dates too
    const csv = grid.map(row => row.map(cell => cell.value).join(',')).join('\n');
    return csv;
  }

  function displayActionDialog() {
    setShowActionDialog(true);
  }

  function displayApproveDialog() {
    setShowActionDialog(false);
    setShowApproveDialog(true);
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
        // Update
        const updateUserID = currentUser?.id as string;
        const newForm: IFormUpdateInput = {
          updatedBy: updateUserID,
          value: arrayToCsv(),
        };
        await FormService.getInstance().update(form.id as string, newForm, token);
      } else {
        // Create
        const newForm: IFormInput = {
          title: formTitle,
          createdBy: currentUser?.id as string,
          value: arrayToCsv(),
          path: documentPath,
          clientID: currentClient?.id as string,
        };
        await FormService.getInstance().create(newForm, token);
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(errorMessage, true);
    }
  }

  async function loadFormInfo() {
    if (form) {
      setFormTitle(form.title);
      if (form.createdAt && form.createdBy) {
        const creationDate = Utils.formatStringDate(new Date(form.createdAt), 'numeric');
        setFormCreation(creationDate);
        const createdByUser = await loadUser(form.createdBy);
        if (createdByUser) {
          setFormCreationActor(createdByUser.firstName + ' ' + createdByUser.lastName);
        }
      }
      if (form.updatedAt && form.updatedBy) {
        const updateDate = form.updatedAt && Utils.formatStringDate(new Date(form.updatedAt), 'numeric');
        setFormUpdate(updateDate);
        const updatedByUser = await loadUser(form.updatedBy);
        if (updatedByUser) {
          setFormUpdateActor(updatedByUser.firstName + ' ' + updatedByUser.lastName);
        }
      }
      const gridFromCSV = Utils.csvToGrid(form.value);
      setGrid(gridFromCSV);
    } else {
      setFormCreation(Utils.formatStringDate(new Date(), 'numeric'));
      setFormCreationActor(currentUser?.firstName + ' ' + currentUser?.lastName);
    }
  }

  async function loadUser(id: string) {
    try {
      const user = await UserService.getInstance().getUserByID(id, token);
      return user;
    } catch (error) {
      console.log('Error loading user', error);
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      loadFormInfo();
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
    setShowApproveDialog(false);
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
        onPress={displayApproveDialog}
        disabled={!isFormFilled()}
        extraStyle={styles.saveButton}
      />
    );
  }

  function ApproveDialogContent() {
    return (
      <Dialog
        title={t('forms.dialog.approve.title')}
        description={t('forms.dialog.approve.description')}
        isConfirmAvailable={true}
        confirmTitle={t('forms.dialog.approve.confirm')}
        onConfirm={() => saveForm()}
        cancelTitle={t('forms.dialog.approve.cancel')}
        isCancelAvailable={true}
        onCancel={() => setShowApproveDialog(false)}
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
            editable={!showActionDialog}
            multiline={true}
            numberOfLines={2}
          />
          <View style={styles.separator}/>
          <View style={styles.cellRow}>
            <FormTextInput
              value={formCreation}
              onChangeText={setFormCreation}
              editable={!showActionDialog}
              isTitle={true}
              placeholder={t('forms.creation.creationDate')}
            />
            <FormTextInput
              value={formCreationActor}
              onChangeText={setFormCreationActor}
              editable={!showActionDialog}
              isTitle={true}
              placeholder={t('forms.creation.creationActor')}
            />
          </View>
          <View style={styles.cellRow}>
            <FormTextInput
              value={formUpdate}
              onChangeText={setFormUpdate}
              editable={!showActionDialog}
              isTitle={true}
              placeholder={t('forms.creation.updateDate')}
            />
            <FormTextInput
              value={formUpdateActor}
              onChangeText={setFormUpdateActor}
              editable={!showActionDialog}
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
                  editable={!showActionDialog}
                  isTitle={cell.isTitle}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      </AppContainer>
      { ActionDialogContent() }
      { showApproveDialog && ApproveDialogContent() }
      { ToastContent() }
    </>
  );
}

export default FormEditionScreen;