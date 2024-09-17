import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { IClientManagementParams } from '../../../navigation/Routes';

import IAction from '../../../business-logic/model/IAction';
import IModule from '../../../business-logic/model/IModule';
import IUser from '../../../business-logic/model/IUser';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import UserServiceDelete from '../../../business-logic/services/UserService/UserService.delete';
import UserServiceGet from '../../../business-logic/services/UserService/UserService.get';
import UserServicePost from '../../../business-logic/services/UserService/UserService.post';
import UserServicePut from '../../../business-logic/services/UserService/UserService.put';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import Utils from '../../../business-logic/utils/Utils';
import { BASE_PASSWORD } from '../../../business-logic/utils/envConfig';

import AppContainer from '../../components/AppContainer/AppContainer';
import IconButton from '../../components/Buttons/IconButton';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialogs/Dialog';
import Grid from '../../components/Grid/Grid';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';
import Toast from '../../components/Toast/Toast';
import Tooltip from '../../components/Tooltip';
import TooltipAction from '../../components/TooltipAction';

import styles from '../../assets/styles/settings/ClientEmployeesStyles';

type ClientEmployeesProps = NativeStackScreenProps<IClientManagementParams, NavigationRoutes.ClientEmployees>;

function ClientEmployees(props: ClientEmployeesProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  // Dialogs
  const [dialogDescription, setDialogDescription] = useState<string>('');
  const [showAddEmployeeDialog, setShowAddEmployeeDialog] = useState<boolean>(false);
  const [showDeleteEmployeeDialog, setShowDeleteEmployeeDialog] = useState<boolean>(false);
  const [showModifyDialog, setShowModifyDialog] = useState<boolean>(false);
  const [showTooltipAction, setShowTooltipAction] = useState<boolean>(false);
  // Potential Employee
  const [potentialEmployeeFirstName, setPotentialEmployeeFirstName] = useState<string>('');
  const [potentialEmployeeLastName, setPotentialEmployeeLastName] = useState<string>('');
  const [potentialEmployeeEmail, setPotentialEmployeeEmail] = useState<string>('');
  const [potentialEmployeePhoneNumber, setPotentialEmployeePhoneNumber] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<IUser>();
  // Employee
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
      onPress: () => displayModifyEmployeeDialog(selectedEmployee as IUser)
    },
    {
      title: t('components.buttons.delete'),
      onPress: () => displayDeleteEmployeeDialog(),
      isDestructive: true
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

  function closeDialogs() {
    setShowAddEmployeeDialog(false);
    setShowDeleteEmployeeDialog(false);
    setShowModifyDialog(false);
    setShowTooltipAction(false);
  }

  function displayModifyEmployeeDialog(employee: IUser) {
    closeDialogs();
    setShowModifyDialog(true);
    setDialogDescription(t('components.dialog.modifyEmployee.description'));
    if (employee) {
      setPotentialEmployeeFirstName(employee.firstName);
      setPotentialEmployeeLastName(employee.lastName);
      setPotentialEmployeeEmail(employee.email);
      setPotentialEmployeePhoneNumber(employee.phoneNumber);
    }
  }

  function displayAddEmployeeDialog() {
    closeDialogs();
    setShowAddEmployeeDialog(true);
    setDialogDescription(t('components.dialog.addEmployee.description'));
  }

  function displayEmployeeDialog(item: IUser) {
    closeDialogs();
    setSelectedEmployee(item);
    setShowTooltipAction(true);
  }

  function displayDeleteEmployeeDialog() {
    closeDialogs();
    setShowDeleteEmployeeDialog(true);
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
    closeDialogs();
  }

  // Async Methods
  async function loadEmployees() {
    if (currentClient && token) {
      try {
        const clientEmployees = await UserServiceGet.getClientEmployees(currentClient.id as string, token);
        setEmployees(clientEmployees);
      } catch (error) {
        console.log('Error loading employees', error);
      }
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
        password: BASE_PASSWORD,
        modules: currentClient.modules ?? [],
      }
      // Create user and add manager to user
      let user: IUser | undefined;
      try {
        user = await UserServicePost.createUser(newEmployee, token);
        await UserServicePut.addManagerToUser(user.id as string, currentClient.id as string, token);
        await UserServicePut.updateModules(user.id as string, currentClient.modules as IModule[], token);
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }
      // Reload employees
      await loadEmployees();
      resetForm();
    }
  }

  async function modifyEmployee() {
    if (isFormFilled() && isContactDetailsValid() && currentClient && selectedEmployee) {
      const modifiedEmployee: IUser = {
        id: selectedEmployee.id,
        firstName: potentialEmployeeFirstName,
        lastName: potentialEmployeeLastName,
        email: potentialEmployeeEmail,
        phoneNumber: potentialEmployeePhoneNumber,
        companyName: currentClient?.companyName || '',
        userType: UserType.Employee,
      }

      try {
        await UserServicePut.updateUser(modifiedEmployee, token);
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
        await UserServiceDelete.removeUser(selectedEmployee?.id as string, token);
        await UserServicePut.removeEmployeeFromManager(currentClient?.id as string, selectedEmployee.id as string, token);
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }

      closeDialogs();
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

  const AddEmployeeDialog = () => {
    return (
      <>
        {
          showAddEmployeeDialog && (
            <Dialog
              title={t('components.dialog.addEmployee.title')}
              description={dialogDescription}
              onConfirm={addEmployee}
              isCancelAvailable={true}
              onCancel={closeDialogs}
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
      </>
    )
  }

  const ModifyEmployeeDialog = () => {
    return (
      <>
        {
          showModifyDialog && (
            <Dialog
              title={t('components.dialog.modifyEmployee.title')}
              description={dialogDescription}
              onConfirm={modifyEmployee}
              isCancelAvailable={true}
              onCancel={closeDialogs}
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
      </>
    );
  }

  function DeleteEmployeeDialog() {
    return (
      <>
        {
          showDeleteEmployeeDialog && (
            <Dialog
              title={`${t('components.dialog.deleteEmployee.title')} ${selectedEmployee?.username} ?`}
              description={t('components.dialog.deleteEmployee.description')}
              onConfirm={deleteSelectedEmployee}
              onCancel={closeDialogs}
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

  const TooltipContent = () => {
    return (
      <TooltipAction
        showDialog={showTooltipAction}
        title={`${t('components.dialog.pendingUserManagement.action')} : ${selectedEmployee?.username}`}
        isConfirmAvailable={false}
        isCancelAvailable={true}
        onConfirm={() => {}}
        onCancel={closeDialogs}
        popoverActions={popoverActions}
      />
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
        adminButton={
          <IconButton
            title={t('components.buttons.addEmployee')}
            icon={plusIcon}
            onPress={displayAddEmployeeDialog}
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
      {ToastContent()}
      {TooltipContent()}
      {AddEmployeeDialog()}
      {ModifyEmployeeDialog()}
      {DeleteEmployeeDialog()}
    </>
  );
}

export default ClientEmployees;