import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import INavigationHistoryItem from '../../../business-logic/model/INavigationHistoryItem';
import IUser from '../../../business-logic/model/IUser';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserService from '../../../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import { IRootStackParams } from '../../../navigation/Routes';
import { Fonts } from '../../assets/fonts/fonts';
import AppContainer from '../../components/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import IconButton from '../../components/IconButton';

type ClientEmployeesProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.ClientEmployees>;

function ClientEmployees(props: ClientEmployeesProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [employees, setEmployees] = useState<IUser[]>([]);
  const employeesFiltered = employees.filter(employee =>
    employee.firstName.toLowerCase().includes(searchText?.toLowerCase()) || employee.lastName.toLowerCase().includes(searchText?.toLowerCase()),  
  );

  const plusIcon = require('../../assets/images/plus.png');
  const personIcon = require('../../assets/images/person.2.fill.png');
  const ellipsisIcon = require('../../assets/images/ellipsis.png');

  const { t } = useTranslation();
  
  const { navigation } = props;

  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const dispatch = useAppDispatch();

  const navigationHistoryItems: INavigationHistoryItem[] = [
    {
      title: t('settings.title'),
      action: () => navigateBack()
    }
  ];

  function navigateBack() {
    navigation.goBack();
  }

  async function loadEmployees() {
    if (currentClient && token) {
      const clientEmployees = await UserService.getInstance().getClientEmployees(currentClient.id, token);
      setEmployees(clientEmployees);
    }
  }

  useEffect(() => {
    async function init() {
      await loadEmployees();
    }
    init();
  }, []);

  function EmployeeRow(item: IUser) {
    return (
      <View style={styles.documentLineContainer}>
        <View style={styles.documentLineRow}>
          <View style={styles.documentButton}>
            <Image source={require('../../assets/images/PDF_file_icon.png')}/>
            <View style={styles.documentTextContainer}>
              <Text style={styles.documentText}>
                {item.firstName} {item.lastName}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.actionButton}>
            <Image source={ellipsisIcon}/>
          </TouchableOpacity>
        </View>
        <View style={styles.separator}/>
      </View>
    );
  }

  return (
    <AppContainer
      mainTitle={t('settings.clientSettings.employees')}
      searchText={searchText}
      setSearchText={setSearchText}
      showSearchText={true}
      showSettings={false}
      navigationHistoryItems={navigationHistoryItems}
      showBackButton={true}
      navigateBack={navigateBack}
      showDialog={showDialog}
      setShowDialog={setShowDialog}
      dialogIsShown={showDialog}
      adminButton={
        <IconButton
          title={t('components.buttons.addEmployee')}
          icon={plusIcon}
          onPress={() => setShowDialog(true)}
        />
      }
    >
      {
        employeesFiltered.length === 0 ? (
          <ContentUnavailableView
            title={t('settings.clientSettings.noEmployees.title')}
            message={t('settings.clientSettings.noEmployees.message')}
            image={(
              <Image source={personIcon}/>
            )}
          />
        ) : (
          <FlatList
            data={employeesFiltered}
            renderItem={(renderItem) => EmployeeRow(renderItem.item)}
            keyExtractor={(item) => item.id}
          />
        )
      }
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Containers
  documentLineContainer: {
    height: 55,
    width: '100%',
  },
  documentLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  documentTextContainer: {
    flex: 1,
    paddingLeft: 8
  },
  // Components
  documentButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    margin: 4
  },
  actionButton: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  documentText: {
    fontFamily: Fonts.poppinsLight,
    fontWeight: Fonts.regular,
  },
});

export default ClientEmployees;