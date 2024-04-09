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
import Toast from '../../components/Toast';
import Tooltip from '../../components/Tooltip';
import TooltipAction from '../../components/TooltipAction';

import styles from '../../assets/styles/settings/ClientEmployeesStyles';

type ClientEmployeesProps = NativeStackScreenProps<IClientManagementParams, NavigationRoutes.ClientEmployees>;

function ClientEmployees(props: ClientEmployeesProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  // Dialogs
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>('');
  const [dialogDescription, setDialogDescription] = useState<string>('');
  const [showEmployeeDialog, setShowEmployeeDialog] = useState<boolean>(false);
  const [showDeleteEmployeeDialog, setShowDeleteEmployeeDialog] = useState<boolean>(false);
  // Potential Employee
  const [potentialEmployeeFirstName, setPotentialEmployeeFirstName] = useState<string>('');
  const [potentialEmployeeLastName, setPotentialEmployeeLastName] = useState<string>('');
  const [potentialEmployeeEmail, setPotentialEmployeeEmail] = useState<string>('');
  const [potentialEmployeePhoneNumber, setPotentialEmployeePhoneNumber] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<IUser>();
  // Modifying Employee
  const [isModifyingEmployee, setIsModifiyingEmployee] = useState<boolean>(false);
  const [employees, setEmployees] = useState<IUser[]>([]);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);

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
      onPress: () => displayDeleteEmployeeDialog(selectedEmployee as IUser)
    }
  ];

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
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

  function displayDeleteEmployeeDialog(employee: IUser) {
    setShowEmployeeDialog(false);
    setShowDeleteEmployeeDialog(true);
    setDialogTitle(`${t('components.dialog.deleteEmployee.title')} ${employee.username} ?`);
    setDialogDescription(t('components.dialog.deleteEmployee.description'));
  }

  function resetDialog() {
    setShowDialog(false);
    setShowDeleteEmployeeDialog(false);
    setDialogTitle('');
    setDialogDescription('');
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  function resetForm() {
    setPotentialEmployeeFirstName('');
    setPotentialEmployeeLastName('');
    setPotentialEmployeeEmail('');
    setPotentialEmployeePhoneNumber('');
    setShowDialog(false);
  }

  // Async Methods
  async function loadEmployees() {
    if (currentClient && token) {
      try {
        const clientEmployees = await UserService.getInstance().getClientEmployees(currentClient.id as string, token);
        setEmployees(clientEmployees);
      } catch (error) {
        console.log('Error loading employees', error);
      }
    }
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
      let user: IUser | undefined;
      try {
        user = await UserService.getInstance().createUser(newEmployee, token);
        await UserService.getInstance().addManagerToUser(user.id as string, currentClient.id as string, token);
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }
      // Reload employees
      await loadEmployees();
      resetForm();
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

      try {
        await UserService.getInstance().updateUser(modifiedEmployee, token);
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }

      await loadEmployees();
      resetForm();
    }
  }

  async function deleteSelectedEmployee() {
    if (selectedEmployee) {
      try {
        await UserService.getInstance().removeUser(selectedEmployee?.id as string, token);
        await UserService.getInstance().removeEmployeeFromManager(currentClient?.id as string, selectedEmployee.id as string, token);
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }

      resetDialog();
      await loadEmployees();
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadEmployees();
    }
    init();
  }, []);

  // Components
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

  function deleteEmployeeDialog() {
    return (
      <>
        {
          showDeleteEmployeeDialog && (
            <Dialog
              title={dialogTitle}
              description={dialogDescription}
              onConfirm={deleteSelectedEmployee}
              onCancel={resetDialog}
              isCancelAvailable={true}
            />
          )
        }
      </>
    )
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
        extraTopAppBarButton={
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
      {deleteEmployeeDialog()}
      <TooltipAction
        showDialog={showEmployeeDialog}
        title={dialogTitle}
        description={dialogDescription}
        isCancelAvailable={true}
        onConfirm={addOrModifyEmployee}
        onCancel={() => setShowEmployeeDialog(false)}
        popoverActions={popoverActions}
      />
      {ToastContent()}
    </>
  );
}

export default ClientEmployees;