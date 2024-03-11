import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import IModule from '../../../business-logic/model/IModule';
import IPendingUser from '../../../business-logic/model/IPendingUser';
import IPotentialEmployee from '../../../business-logic/model/IPotentialEmployee';
import IToken from '../../../business-logic/model/IToken';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PendingUserStatus from '../../../business-logic/model/enums/PendingUserStatus';
import ModuleService from '../../../business-logic/services/ModuleService';
import PendingUserService from '../../../business-logic/services/PendingUserService';
import PotentialEmployeeService from '../../../business-logic/services/PotentialEmployeeService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IClientManagementParams } from '../../../navigation/Routes';

import AddEmployeeDialog from '../../components/AddEmployeeDialog';
import AppContainer from '../../components/AppContainer';
import ErrorDialog from '../../components/ErrorDialog';
import GladisTextInput from '../../components/GladisTextInput';
import ModuleCheckBox from '../../components/ModuleCheckBox';
import TextButton from '../../components/TextButton';

import styles from '../../assets/styles/clientManagement/ClientCreationScreenStyles';

type ClientCreationScreenProps = NativeStackScreenProps<IClientManagementParams, NavigationRoutes.ClientCreationScreen>;

function ClientCreationScreen(props: ClientCreationScreenProps): React.JSX.Element {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [products, setProducts] = useState<string>('');
  const [modules, setModules] = useState<IModule[]>([]);
  const [selectedModulesIDs, setSelectedModulesIDs] = useState<string[]>([]);
  const [employees, setEmployees] = useState<string>('');
  const [numberOfUsers, setNumberOfUsers] = useState<string>('');
  const [sales, setSales] = useState<string>('');
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const [errorTitle, setErrorTitle] = useState<string>('');
  const [errorDescription, setErrorDescription] = useState<string>('');

  // Potential employee
  const [potentialEmployeeFirstName, setPotentialEmployeeFirstName] = useState<string>('');
  const [potentialEmployeeLastName, setPotentialEmployeeLastName] = useState<string>('');
  const [potentialEmployees, setPotentialEmployees] = useState<IPotentialEmployee[]>([]);

  const { navigation } = props;
  const { pendingUser } = props.route.params;
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { t } = useTranslation();

  async function submit() {
    if (pendingUser == null) {
      createPendingUser();
    } else {
      convertPendingUser();
    }
  }

  function showError(errorKeys: string []) {
    if (errorKeys.includes('email.invalid')) {
      if (errorKeys.includes('phoneNumber.invalid')) {
        setErrorTitle(t('errors.signup.phoneAndEmail.title'));
        setErrorDescription(t('errors.signup.phoneAndEmail.description'));
      } else {
        setErrorTitle(t('errors.signup.email.title'));
        setErrorDescription(t('errors.signup.email.description'));
      }
    } else if (errorKeys.includes('phoneNumber.invalid')) {
      setErrorTitle(t('errors.signup.phoneNumber.title'));
      setErrorDescription(t('errors.signup.phoneNumber.description'));
    }
    setShowErrorDialog(true);
  }

  async function createPendingUser() {
    const newPendingUser: IPendingUser = {
      firstName,
      lastName,
      phoneNumber,
      companyName,
      email,
      products,
      numberOfEmployees: parseInt(employees),
      numberOfUsers: parseInt(numberOfUsers),
      salesAmount: parseFloat(sales),
      status: PendingUserStatus.pending
    };
    const selectedModules: IModule[] = [];
    for (const id of selectedModulesIDs) {
      const module = modules.find(module => module.id === id) as IModule;
      selectedModules.push(module);
    }
    // TODO: remove thens in the application
    try {
      const createdUser = await PendingUserService.getInstance().askForSignUp(newPendingUser, selectedModules)
      for (const employee of potentialEmployees) {
        employee.pendingUserID = createdUser.id
        await PotentialEmployeeService.getInstance().create(employee);
      }
      navigation.goBack();
    } catch (error) {
      const errorKeys: string[] = error as string[];
      showError(errorKeys);
    }
  }

  async function convertPendingUser() {
    const newPendingUser: IPendingUser = {
      id: pendingUser?.id,
      firstName,
      lastName,
      phoneNumber,
      companyName,
      email,
      products,
      numberOfEmployees: parseInt(employees),
      numberOfUsers: parseInt(numberOfUsers),
      salesAmount: parseFloat(sales),
      status: PendingUserStatus.pending
    }
    const castedToken = token as IToken;
    try {
      await PendingUserService.getInstance().convertPendingUserToUser(newPendingUser, castedToken)
      const castedUser = pendingUser as IPendingUser;
      await PendingUserService.getInstance().updatePendingUserStatus(castedUser, castedToken, PendingUserStatus.accepted);
      await PendingUserService.getInstance().removePendingUser(castedUser.id, token);
      navigation.goBack(); 
    } catch (error) {
      const errorKeys = error as string[];
      showError(errorKeys);
    }
  }

  function toggleCheckbox(module: IModule) {
    setSelectedModulesIDs((prevSelectedObjectsIDs) => {
      const moduleID = module.id as string;
      if (prevSelectedObjectsIDs.includes(moduleID)) {
        return prevSelectedObjectsIDs.filter((objectModule) => objectModule !== moduleID);
      } else {
        return [...prevSelectedObjectsIDs, moduleID];
      }
    });
  }

  function isModuleSelected(module: IModule): boolean {
    const id = module.id as string;
    return selectedModulesIDs.includes(id);
  }

  function setDefaultValues() {
    if (pendingUser != null) {
      setFirstName(pendingUser.firstName);
      setLastName(pendingUser.lastName);
      setPhoneNumber(pendingUser.phoneNumber);
      setCompanyName(pendingUser.companyName);
      setEmail(pendingUser.email);
      const products = pendingUser.products as string;
      setProducts(products);
      const employees = pendingUser.numberOfEmployees as number;
      setEmployees(employees.toString());
      const users = pendingUser.numberOfUsers as number;
      setNumberOfUsers(users.toString());
      const salesAmount = pendingUser.salesAmount as number;
      setSales(salesAmount.toString());
    }
  }

  function navigateBack() {
    navigation.goBack();
  }

  async function addEmployeesBeforeSubmit() {
    if (parseInt(numberOfUsers) > 0) {
      if (pendingUser !== null) {
        const employees = await PendingUserService.getInstance().getPotentialEmployees(pendingUser?.id, token);
        setPotentialEmployees(employees)
      }
      setShowDialog(true);
    } else {
      await submit();
    }
  }

  async function addEmployee() {
    const employees = potentialEmployees;
    if (employees.length !== parseInt(numberOfUsers)) {
      const newEmployee: IPotentialEmployee = {
        firstName: potentialEmployeeFirstName,
        lastName: potentialEmployeeLastName,
        companyName: companyName
      };
      employees.push(newEmployee);
      setPotentialEmployees(employees);
      setPotentialEmployeeFirstName('');
      setPotentialEmployeeLastName('');
      if (employees.length === parseInt(numberOfUsers)) {
        await submit();
      }
    } else {
      await submit();
    }
  }

  const isButtonDisabled = !firstName || !lastName || !phoneNumber ||
    !companyName || !email ||
    (products && !products.length) || (employees && !employees.length) ||
    (numberOfUsers && !numberOfUsers.length) || (sales && !sales.length);

  useEffect(() => {
    async function init() {
      const apiModules = await ModuleService.getInstance().getModules();  
      setModules(apiModules);
      if (pendingUser?.id != null) {
        const pendingUsersModulesIDs = await PendingUserService.getInstance().getPendingUsersModulesIDs(pendingUser.id);
        setSelectedModulesIDs(pendingUsersModulesIDs);
      } else {
        setSelectedModulesIDs([]);
      }
      setDefaultValues();
    }
    init();
  }, []);

  function PotentialEmployeeFlatListItem(item: IPotentialEmployee) {
    return (
      <Text style={styles.employeeText}>{item.firstName} {item.lastName}</Text>
    )
  }

  function errorDialog() {
    return (
      showErrorDialog && (
        <ErrorDialog
          title={errorTitle}
          description={errorDescription}
          cancelTitle={t('errors.modules.cancelButton')}
          onCancel={() => setShowErrorDialog(false)}
        />
      )
    );
  }
  

  return (
    <>
      <AppContainer
        mainTitle={t('quotation.adminTitle')}
        showBackButton={true}
        navigateBack={navigateBack}
        showSearchText={false}
        showSettings={false}
        additionalComponent={(
          <View style={styles.sendButtonContainer}>
            <TextButton
              width={'100%'}
              title={t('quotation.submit')}
              onPress={addEmployeesBeforeSubmit}
              disabled={isButtonDisabled}
            />
          </View>
        )}
      >
        <ScrollView>
          <GladisTextInput
            value={firstName}
            onValueChange={setFirstName}
            placeholder={t('quotation.firstName')} showTitle={true}
            editable={!showErrorDialog}
          />
          <GladisTextInput
            value={lastName}
            onValueChange={setLastName}
            placeholder={t('quotation.lastName')} showTitle={true}
            editable={!showErrorDialog}
          />
          <GladisTextInput
            value={phoneNumber}
            onValueChange={setPhoneNumber}
            placeholder={t('quotation.phone')} showTitle={true}
            editable={!showErrorDialog}
          />
          <GladisTextInput
            value={companyName}
            onValueChange={setCompanyName}
            placeholder={t('quotation.companyName')} showTitle={true}
            editable={!showErrorDialog}
          />
          <GladisTextInput
            value={email}
            onValueChange={setEmail}
            placeholder={t('quotation.email')} showTitle={true}
            editable={!showErrorDialog}
          />
          <GladisTextInput
            value={products}
            onValueChange={setProducts}
            placeholder={t('quotation.products')} showTitle={true}
            editable={!showErrorDialog}
          />
          <Text style={styles.subtitle}>{t('quotation.modulesTitle')}</Text>
          {modules.map((module) => (
            <ModuleCheckBox
              key={module.id}
              module={module}
              isSelected={isModuleSelected(module)}
              onSelectModule={() => toggleCheckbox(module)}
              isDisabled={pendingUser != null}
            />
          ))}
          <GladisTextInput
            value={employees}
            onValueChange={setEmployees}
            placeholder={t('quotation.employees')} showTitle={true}
            editable={!showErrorDialog}
          />
          <GladisTextInput
            value={numberOfUsers}
            onValueChange={setNumberOfUsers}
            placeholder={t('quotation.users')} showTitle={true}
            editable={!showErrorDialog}
          />
          <GladisTextInput
            value={sales}
            onValueChange={setSales}
            placeholder={t('quotation.capital')} showTitle={true}
            editable={!showErrorDialog}
          />
          <TextButton width={'30%'} title={t('quotation.employee.create')} onPress={() => setShowDialog(true)} />
          {
            potentialEmployees.length > 0 && (
              <>
                <Text style={styles.employeesTitle}>{t('quotation.employee.title')}</Text>
                {potentialEmployees.map((employee, index) => (
                  PotentialEmployeeFlatListItem(employee, index)
                ))}
              </>
            )
          }
        </ScrollView>
      </AppContainer>
      {
        <AddEmployeeDialog
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          companyName={companyName}
          potentialEmployees={potentialEmployees}
          setPotentialEmployees={setPotentialEmployees}
        />
      }
      {errorDialog()}
    </>
  );
}

export default ClientCreationScreen;