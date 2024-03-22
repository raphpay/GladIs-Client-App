import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { IClientManagementParams } from '../../../navigation/Routes';

import IAction from '../../../business-logic/model/IAction';
import IUser from '../../../business-logic/model/IUser';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import UserService from '../../../business-logic/services/UserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import Utils from '../../../business-logic/utils/Utils';

import AppContainer from '../../components/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialog';
import GladisTextInput from '../../components/GladisTextInput';
import Grid from '../../components/Grid';
import IconButton from '../../components/IconButton';
import Tooltip from '../../components/Tooltip';

import styles from '../../assets/styles/settings/ClientEmployeesStyles';
import TooltipAction from '../../components/TooltipAction';

type ClientEmployeesProps = NativeStackScreenProps<IClientManagementParams, NavigationRoutes.ClientEmployees>;

function ClientEmployees(props: ClientEmployeesProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>('');
  const [dialogDescription, setDialogDescription] = useState<string>('');
  const [potentialEmployeeFirstName, setPotentialEmployeeFirstName] = useState<string>('');
  const [potentialEmployeeLastName, setPotentialEmployeeLastName] = useState<string>('');
  const [potentialEmployeeEmail, setPotentialEmployeeEmail] = useState<string>('');
  const [potentialEmployeePhoneNumber, setPotentialEmployeePhoneNumber] = useState<string>('');
  const [isModifyingEmployee, setIsModifiyingEmployee] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<IUser>();
  const [showEmployeeDialog, setShowEmployeeDialog] = useState<boolean>(false);

  const [employees, setEmployees] = useState<IUser[]>([]);
  const employeesFiltered = employees.filter(employee =>
    employee.firstName.toLowerCase().includes(searchText?.toLowerCase()) || employee.lastName.toLowerCase().includes(searchText?.toLowerCase()),  
  );

  const plusIcon = require('../../assets/images/plus.png');
  const personIcon = require('../../assets/images/person.2.fill.png');

  const { t } = useTranslation();
  
  const { navigation } = props;

  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);

  const navigationHistoryItems: IAction[] = [
    {
      title: t('settings.title'),
      onPress: () => navigateBack()
    }
  ];

  const popoverActions: IAction[] = [
    {
      title: t('components.tooltip.modify'),
      onPress: () => showModifyEmployeeDialog(selectedEmployee as IUser)
    },
    {
      title: t('components.buttons.delete'),
      onPress: () => console.log('delete')
    }
  ];

  function navigateBack() {
    navigation.goBack();
  }

  async function loadEmployees() {
    if (currentClient && token) {
      const clientEmployees = await UserService.getInstance().getClientEmployees(currentClient.id as string, token);
      setEmployees(clientEmployees);
    }
  }

  function isContactDetailsValid(): boolean {
    let isValid: boolean = true;
    const isPhoneValid = Utils.isPhoneValid(potentialEmployeePhoneNumber);
    const isEmailValid = Utils.isEmailValid(potentialEmployeeEmail);
    if (!isPhoneValid && !isEmailValid) {
      setDialogDescription(t('components.dialog.addEmployee.errors.invalidPhoneAndEmail'));
      isValid = false;
    } else if (!isPhoneValid) {
      setDialogDescription(t('components.dialog.addEmployee.errors.invalidPhone'));
      isValid = false;
    } else if (!isEmailValid) {
      setDialogDescription(t('components.dialog.addEmployee.errors.invalidEmail'));
      isValid = false;
    }
    return isValid;
  }

  function isFormFilled(): boolean {
    let isFilled: boolean = false;
    if (potentialEmployeeEmail.length !== 0 && potentialEmployeeLastName.length !== 0 &&
      potentialEmployeeEmail.length !== 0 && potentialEmployeePhoneNumber.length !== 0) {
        isFilled = true;
    }
    return isFilled;
  }

  async function addOrModifyEmployee() {
    if (isModifyingEmployee) {
      await modifyEmployee(selectedEmployee as IUser);
    } else {
      await addEmployee();
    }
  }
  
  async function addEmployee() {
    if (isFormFilled() && isContactDetailsValid() && currentClient) {
      const newEmployee: IUser = {
        firstName: potentialEmployeeFirstName,
        lastName: potentialEmployeeLastName,
        email: potentialEmployeeEmail,
        phoneNumber: potentialEmployeePhoneNumber,
        companyName: currentClient?.companyName || '',
        userType: UserType.Employee,
      }
      // Create user and add manager to user
      const user = await UserService.getInstance().createUser(newEmployee, token);
      await UserService.getInstance().addManagerToUser(user.id as string, currentClient.id as string, token);
      // Reload employees
      await loadEmployees();
      // Reset form
      setPotentialEmployeeFirstName('');
      setPotentialEmployeeLastName('');
      setPotentialEmployeeEmail('');
      setPotentialEmployeePhoneNumber('');
      setShowDialog(false);
    }
  }

  async function modifyEmployee(employee: IUser) {
    if (isFormFilled() && isContactDetailsValid() && currentClient) {
      const modifiedEmployee: IUser = {
        id: employee.id,
        firstName: potentialEmployeeFirstName,
        lastName: potentialEmployeeLastName,
        email: potentialEmployeeEmail,
        phoneNumber: potentialEmployeePhoneNumber,
        companyName: currentClient?.companyName || '',
        userType: UserType.Employee,
      }
      await UserService.getInstance().updateUser(modifiedEmployee, token);
      await loadEmployees();
      setPotentialEmployeeFirstName('');
      setPotentialEmployeeLastName('');
      setPotentialEmployeeEmail('');
      setPotentialEmployeePhoneNumber('');
      setShowDialog(false);
    }
  }

  function showModifyEmployeeDialog(employee: IUser) {
    setShowEmployeeDialog(false);
    setIsModifiyingEmployee(true);
    setShowDialog(true);
    if (employee) {
      setPotentialEmployeeFirstName(employee.firstName);
      setPotentialEmployeeLastName(employee.lastName);
      setPotentialEmployeeEmail(employee.email);
      setPotentialEmployeePhoneNumber(employee.phoneNumber);
      setDialogTitle(t('components.dialog.modifyEmployee.title'));
      setDialogDescription(t('components.dialog.modifyEmployee.description'));
    }
  }

  // TODO: Add translations
  function showAddEmployeeDialog() {
    setShowDialog(true);
    setIsModifiyingEmployee(false);
    setDialogTitle(t('components.dialog.addEmployee.title'));
    setDialogDescription(t('components.dialog.addEmployee.description'));
  }

  function displayEmployeeDialog(item: IUser) {
    setSelectedEmployee(item);
    setDialogTitle(`${t('components.dialog.pendingUserManagement.action')} : ${item.username}`);
    setShowEmployeeDialog(true);
  }

  function resetDialog() {
    setShowDialog(false);
    setDialogTitle('');
    setDialogDescription('');
  }

  useEffect(() => {
    async function init() {
      await loadEmployees();
    }
    init();
  }, []);

  function EmployeeRow(item: IUser) {
    return (
      <View style={styles.employeeLineContainer}>
        <View style={styles.employeeLineRow}>
          <View style={styles.employeeButton}>
            <View style={styles.employeeTextContainer}>
              <Text style={styles.employeeText}>
                {item.firstName} {item.lastName}
              </Text>
            </View>
          </View>
          <Tooltip action={() => displayEmployeeDialog(item)} />
        </View>
        <View style={styles.separator}/>
      </View>
    );
  }

  const dialogContent = () => {
    return (
      <Dialog
        title={dialogTitle}
        description={dialogDescription}
        onConfirm={addOrModifyEmployee}
        isCancelAvailable={true}
        onCancel={resetDialog}
      >
        <>
          <GladisTextInput
            value={potentialEmployeeFirstName}
            onValueChange={setPotentialEmployeeFirstName}
            placeholder={t('quotation.firstName')}
          />
          <GladisTextInput 
            value={potentialEmployeeLastName}
            onValueChange={setPotentialEmployeeLastName}
            placeholder={t('quotation.lastName')}
          />
          <GladisTextInput 
            value={potentialEmployeeEmail}
            onValueChange={setPotentialEmployeeEmail}
            placeholder={t('quotation.email')}
          />
          <GladisTextInput 
            value={potentialEmployeePhoneNumber}
            onValueChange={setPotentialEmployeePhoneNumber}
            placeholder={t('quotation.phone')}
          />
        </>
      </Dialog>
    )
  }

  return (
    <>
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
        dialog={dialogContent()}
        adminButton={
          <IconButton
            title={t('components.buttons.addEmployee')}
            icon={plusIcon}
            onPress={showAddEmployeeDialog}
          />
        }
      >
        {
          employeesFiltered.length > 0 ? (
            <Grid
              data={employeesFiltered}
              renderItem={(renderItem) => EmployeeRow(renderItem.item)}
            />
          ) : (
            <ContentUnavailableView
              title={t('settings.clientSettings.noEmployees.title')}
              message={t('settings.clientSettings.noEmployees.message')}
              image={personIcon}
            />
          )
        }
      </AppContainer>
      <TooltipAction
        showDialog={showEmployeeDialog}
        title={dialogTitle}
        description={dialogDescription}
        isCancelAvailable={true}
        onConfirm={addOrModifyEmployee}
        onCancel={() => setShowEmployeeDialog(false)}
        popoverActions={popoverActions}
      />
    </>
  );
}

export default ClientEmployees;