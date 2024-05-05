import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { IRootStackParams } from '../../../../navigation/Routes';

import IAction from '../../../../business-logic/model/IAction';
import NavigationRoutes from '../../../../business-logic/model/enums/NavigationRoutes';

import Utils from '../../../../business-logic/utils/Utils';
import AppContainer from '../../../components/AppContainer/AppContainer';
import IconButton from '../../../components/Buttons/IconButton';
import TooltipAction from '../../../components/TooltipAction';
import FormTextInput from '../DocumentScreen/FormTextInput';

interface ICell {
  id: string;
  value: string;
  isTitle: boolean;
}

type FormEditionScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.FormEditionScreen>;

function FormEditionScreen(props: FormEditionScreenProps): React.JSX.Element {

  const { navigation } = props;
  const { t } = useTranslation();
  // States
  const [showActionDialog, setShowActionDialog] = useState(false);

  // Make a grid of ICell
  const [grid, setGrid] = useState<ICell[][]>([[]]);

  const [formTitle, setFormTitle] = useState('');
  const [formCreation, setFormCreation] = useState('');
  const [formUpdate, setFormUpdate] = useState('');
  const [formCreationActor, setFormCreationActor] = useState('');
  const [formUpdateActor, setFormUpdateActor] = useState('');

  const plusIcon = require('../../../assets/images/plus.png');

  const popoverActions: IAction[] = [
    {
      title: 'Set a title',
      onPress: () => console.log('Set a title'),
    },
    {
      title: 'Set a creator',
      onPress: () => console.log('Set a creator'),
    },
    {
      title: 'Add a column',
      onPress: () => addColumn(),
    },
    {
      title: 'Add a row',
      onPress: () => addRow(),
    },
    {
      title: 'Export to CSV',
      onPress: () => arrayToCsv(),
    }
  ];

  // const addColumn = () => {
  //   const updatedGrid = grid.map(row => [...row, '']);
  //   setGrid(updatedGrid);
  //   setShowActionDialog(false);
  // };

  function navigateBack() {
    navigation.goBack();
  }

  const addColumn = () => {
    let updatedGrid: ICell[][];

    updatedGrid = grid.map((row, index) => {
      const newCell = { id: Utils.generateUUID(), value: '', isTitle: index === 0 };
      return [...row, newCell];
    });

    setGrid(updatedGrid);
    setShowActionDialog(false);
  };

  const addRow = () => {
  if (grid[0].length > 0) {
    const newRow = Array(grid[0].length).fill({}).map(() => ({ id: Utils.generateUUID(), value: '', isTitle: false }));
    setGrid([...grid, newRow]);
  } else {
    console.log('Add column first');
  }
  setShowActionDialog(false);
};

  const removeColumn = () => {
    const updatedGrid = grid.map(row => row.slice(0, -1));
    setGrid(updatedGrid);
  };

  const removeRow = () => {
    const updatedGrid = grid.slice(0, -1);
    setGrid(updatedGrid);
  };

  const updateCell = (rowIndex: number, columnIndex: number, newText: string) => {
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

  function ActionButton() {
    return (
      <IconButton
        title={t('actions')}
        icon={plusIcon}
        onPress={displayActionDialog}
      />
    )
  }

  function ActionDialogContent() {
    return (
      <TooltipAction
        showDialog={showActionDialog}
        title={t('actions')}
        isConfirmAvailable={true}
        confirmTitle='Fermer'
        isCancelAvailable={false}
        onConfirm={() => setShowActionDialog(false)}
        onCancel={() => {}}
        popoverActions={popoverActions}
      />
    )
  }

  return (
    <>
      <AppContainer
        mainTitle="Form Creation"
        showSearchText={false}
        showSettings={false}
        adminButton={ActionButton()}
        showBackButton={true}
        navigateBack={navigateBack}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <FormTextInput
            value={formTitle}
            onChangeText={setFormTitle}
            isTitle={true}
            placeholder={t('formTitle')}
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
              placeholder='Creation date'
            />
            <FormTextInput
              value={formCreationActor}
              onChangeText={setFormCreationActor}
              editable={!showActionDialog}
              isTitle={true}
              placeholder='Creation actor'
            />
          </View>
          <View style={styles.cellRow}>
            <FormTextInput
              value={formUpdate}
              onChangeText={setFormUpdate}
              editable={!showActionDialog}
              isTitle={true}
              placeholder='Update date'
            />
            <FormTextInput
              value={formUpdateActor}
              onChangeText={setFormUpdateActor}
              editable={!showActionDialog}
              isTitle={true}
              placeholder='Update actor'
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    margin: 5,
    minWidth: 50,
  },
  midCell: {
    flex: 0.5,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    margin: 5,
    minWidth: 50,
  },
  cellRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    width: '100%',
    height: 2,
    backgroundColor: 'black',
  }
});

export default FormEditionScreen;