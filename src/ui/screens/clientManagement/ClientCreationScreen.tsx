import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Platform, ScrollView, Text, View } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import IFile from '../../../business-logic/model/IFile';
import IModule from '../../../business-logic/model/IModule';
import IPendingUser from '../../../business-logic/model/IPendingUser';
import IPotentialEmployee from '../../../business-logic/model/IPotentialEmployee';
import IToken from '../../../business-logic/model/IToken';
import IUser from '../../../business-logic/model/IUser';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PendingUserStatus from '../../../business-logic/model/enums/PendingUserStatus';
import FinderModule from '../../../business-logic/modules/FinderModule';
import DocumentService from '../../../business-logic/services/DocumentService';
import ModuleService from '../../../business-logic/services/ModuleService';
import PendingUserService from '../../../business-logic/services/PendingUserService';
import PotentialEmployeeService from '../../../business-logic/services/PotentialEmployeeService';
import UserService from '../../../business-logic/services/UserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import Utils from '../../../business-logic/utils/Utils';

import { IClientCreationStack } from '../../../navigation/Routes';

import AddEmployeeDialog from '../../components/AddEmployeeDialog';
import AppContainer from '../../components/AppContainer';
import ErrorDialog from '../../components/ErrorDialog';
import GladisTextInput from '../../components/GladisTextInput';
import ModuleCheckBox from '../../components/ModuleCheckBox';
import TextButton from '../../components/TextButton';

import styles from '../../assets/styles/clientManagement/ClientCreationScreenStyles';

type ClientCreationScreenProps = NativeStackScreenProps<IClientCreationStack, NavigationRoutes.ClientCreationScreen>;

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
  // Dialog
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const [errorTitle, setErrorTitle] = useState<string>('');
  const [errorDescription, setErrorDescription] = useState<string>('');
  // Potential employee
  const [potentialEmployees, setPotentialEmployees] = useState<IPotentialEmployee[]>([]);
  // Logo
  const [imageData, setImageData] = useState<string>('');
  const [logoURI, setLogoURI] = useState<string>('');

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

  function retrieveSelectedModules(): IModule[] {
    const selectedModules: IModule[] = [];
    for (const id of selectedModulesIDs) {
      const module = modules.find(module => module.id === id) as IModule;
      selectedModules.push(module);
    }
    return selectedModules;
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
    const selectedModules = retrieveSelectedModules();
    // TODO: remove thens in the application
    try {
      const createdUser = await PendingUserService.getInstance().askForSignUp(newPendingUser, selectedModules)
      await createEmployees(createdUser.id as string);
      await uploadLogo();
      navigation.goBack();
    } catch (error) {
      const errorKeys: string[] = error as string[];
      showError(errorKeys);
    }
  }

  async function createEmployees(pendingUserID: string) {
    // Update all employees with pendingUserID
    const updatedPotentialEmployees = potentialEmployees.map(employee => {
      return {
        ...employee,
        pendingUserID,
      };
    });
    for (const employee of updatedPotentialEmployees) {
      if (employee.pendingUserID !== null) {
        try {
          await PotentialEmployeeService.getInstance().create(employee)
        } catch (error) {
          console.log('Error creating employee', employee, error);
        }
      }
    }
  }

  async function convertEmployeesToUser(): Promise<IUser[]> {
    const newUsers: IUser[] = [];
    for (const employee of potentialEmployees) {
      const newUserEmployee = await PotentialEmployeeService.getInstance().convertToUser(employee.id as string, token);
      newUsers.push(newUserEmployee);
    }
    return newUsers;
  }

  async function convertPendingUser() {
    const id = pendingUser?.id as string;
    const castedToken = token as IToken;
    try {
      // 1 Convert manager
      const createdUser = await PendingUserService.getInstance().convertPendingUserToUser(id, castedToken);
      const selectedModules = retrieveSelectedModules();
      await UserService.getInstance().addModules(createdUser.id as string, selectedModules, castedToken)
      // 2 Convert employees
      const createdEmployees = await convertEmployeesToUser();
      // 3 Add manager to employees
      for (const employee of createdEmployees) {
        await UserService.getInstance().addManagerToUser(employee.id as string, createdUser.id as string, castedToken);
      }
      await uploadLogo();
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

  async function addLogo() {
    if (Platform.OS === 'macos') {
      const data = await FinderModule.getInstance().pickImage();
      setImageData(data);
      setLogoURI(`data:image/png;base64,${data}`);
    } else {
      const doc = await DocumentPicker.pickSingle({ type: DocumentPicker.types.images });
      const data = await Utils.getFileBase64FromURI(doc.uri) as string;
      setImageData(data);
      setLogoURI(doc.uri);
    }
  }

  async function uploadLogo() {
    if (imageData) {
      const fileName = 'logo.png';
      const file: IFile = {
        data: imageData,
        filename: fileName
      }
      await DocumentService.getInstance().uploadLogo(file, fileName, `${companyName}/logos/`);
    }
  }

  const isButtonDisabled = !firstName || !lastName || !phoneNumber ||
    !companyName || !email ||
    (products && !products.length) || (employees && !employees.length) ||
    (numberOfUsers && !numberOfUsers.length) || (sales && !sales.length);
  
  async function loadModules() {
    try {
      const apiModules = await ModuleService.getInstance().getModules();  
      setModules(apiModules);
      if (pendingUser?.id != null) {
        const pendingUsersModulesIDs = await PendingUserService.getInstance().getPendingUsersModulesIDs(pendingUser.id);
        setSelectedModulesIDs(pendingUsersModulesIDs);
      } else {
        setSelectedModulesIDs([]);
      }
    } catch (error) {
      console.log('Error loading modules', error);
    }
  }

  async function loadEmployees() {
    if (pendingUser != null) {
      try {
        const employees = await PendingUserService.getInstance().getPotentialEmployees(pendingUser?.id, token);
        setPotentialEmployees(employees);
      } catch (error) {
        console.log('Error loading employees', error);
      }
    }
  }

  async function loadLogo() {
    const company = pendingUser?.companyName as string;
    const docs = await DocumentService.getInstance().getDocumentsAtPath(`${company}/logos/`, token);
    const logo = docs[0];
    const logoData = await DocumentService.getInstance().download(logo.id as string, token);
    Platform.OS === 'macos' ? setLogoURI(`data:image/png;base64,${logoData}`) : setLogoURI(logoData);
  }

  useEffect(() => {
    async function init() {
      await loadModules();
      await loadEmployees();
      await loadLogo();
      setDefaultValues();
    }
    init();
  }, []);

  function PotentialEmployeeFlatListItem(item: IPotentialEmployee, index: number) {
    return (
      <Text key={index} style={styles.employeeText}>{item.firstName} {item.lastName}</Text>
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
              onPress={submit}
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
          {
            pendingUser == null && (
              <TextButton width={'30%'} title={t('quotation.employee.create')} onPress={() => setShowDialog(true)} />
            )
          }
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
          <View style={styles.logoContainer}>
            <TextButton width={'30%'} title={t('quotation.logo.modify')} onPress={addLogo} />
            {
              logoURI && (
                <Image source={{uri: logoURI}} style={styles.logo}/>
              )
            }
          </View>
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