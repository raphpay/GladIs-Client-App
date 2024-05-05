import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { IRootStackParams } from '../../../../navigation/Routes';

import IAction from '../../../../business-logic/model/IAction';
import { IFormCell } from '../../../../business-logic/model/IForm';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';
import Utils from '../../../../business-logic/utils/Utils';

import AppContainer from '../../../components/AppContainer/AppContainer';
import IconButton from '../../../components/Buttons/IconButton';
import TooltipAction from '../../../components/TooltipAction';
import FormTextInput from '../DocumentScreen/FormTextInput';

import styles from '../../../assets/styles/forms/FormEditionScreenStyles';

type FormEditionScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.FormEditionScreen>;

function FormEditionScreen(props: FormEditionScreenProps): React.JSX.Element {

  const { navigation } = props;
  const { form } = props.route.params;
  const { t } = useTranslation();
  // States
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [grid, setGrid] = useState<IFormCell[][]>([[]]);
  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCreation, setFormCreation] = useState('');
  const [formUpdate, setFormUpdate] = useState('');
  const [formCreationActor, setFormCreationActor] = useState('');
  const [formUpdateActor, setFormUpdateActor] = useState('');

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
    const csv = grid.map(row => row.map(cell => cell.value).join(',')).join('\n');
    console.log('csv', csv);
  }

  function displayActionDialog() {
    setShowActionDialog(true);
  }

  function saveForm() {
    // TODO: Display a confirmation dialog
    // It should be disabled if no grid is present, no title is set
    console.log('Save form');
  }

  function loadFormInfo() {
    // TODO: Load more infos
    if (form) {
      setFormTitle(form.title);
      const gridFromCSV = Utils.csvToGrid(form.value);
      setGrid(gridFromCSV);
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    loadFormInfo();
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

  function ActionDialogContent() {
    return (
      <TooltipAction
        showDialog={showActionDialog}
        title={t('forms.actions.title')}
        isConfirmAvailable={true}
        confirmTitle={t('forms.creation.confirm')}
        isCancelAvailable={false}
        onConfirm={() => setShowActionDialog(false)}
        onCancel={() => {}}
        popoverActions={popoverActions}
      />
    );
  }

  function SaveButton() {
    return (
      <IconButton
        title={t('components.buttons.save')}
        icon={plusIcon}
        onPress={saveForm}
        style={styles.saveButton}
      />
    );
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
    </>
  );
}

export default FormEditionScreen;