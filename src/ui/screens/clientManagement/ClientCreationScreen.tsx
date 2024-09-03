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
import PlatformName from '../../../business-logic/model/enums/PlatformName';
import FinderModule from '../../../business-logic/modules/FinderModule';
import DocumentService from '../../../business-logic/services/DocumentService';
import DocumentServicePost from '../../../business-logic/services/DocumentService/DocumentService.post';
import ModuleService from '../../../business-logic/services/ModuleService';
import PendingUserService from '../../../business-logic/services/PendingUserService';
import PotentialEmployeeService from '../../../business-logic/services/PotentialEmployeeService';
import UserService from '../../../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { setClientListCount, setPendingUserListCount } from '../../../business-logic/store/slices/appStateReducer';
import { RootState } from '../../../business-logic/store/store';
import Utils from '../../../business-logic/utils/Utils';

import { IClientCreationStack } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer/AppContainer';
import TextButton from '../../components/Buttons/TextButton';
import ModuleCheckBox from '../../components/CheckBox/ModuleCheckBox';
import AddEmployeeDialog from '../../components/Dialogs/AddEmployeeDialog';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';
import Toast from '../../components/Toast';

import styles from '../../assets/styles/clientManagement/ClientCreationScreenStyles';

type ClientCreationScreenProps = NativeStackScreenProps<IClientCreationStack, NavigationRoutes.ClientCreationScreen>;

function ClientCreationScreen(props: ClientCreationScreenProps): React.JSX.Element {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [products, setProducts] = useState<string>('');
  const [selectedModules, setSelectedModules] = useState<IModule[]>([]);
  const [employees, setEmployees] = useState<string>('');
  const [numberOfUsers, setNumberOfUsers] = useState<string>('');
  const [sales, setSales] = useState<string>('');
  // Dialog
  const [showDialog, setShowDialog] = useState<boolean>(false);
  // Potential employee
  const [potentialEmployees, setPotentialEmployees] = useState<IPotentialEmployee[]>([]);
  // Logo
  const [imageData, setImageData] = useState<string>('');
  const [logoURI, setLogoURI] = useState<string>('');
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);

  const { navigation } = props;
  const { pendingUser } = props.route.params;

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { pendingUserListCount, clientListCount } = useAppSelector((state: RootState) => state.appState);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const modules = ModuleService.getInstance().getModules();

  // Sync Methods
  function toggleCheckbox(module: IModule): void {
    if (isModuleSelected(module)) {
      // If the module is already selected, deselect it
      removeModuleFromClient(module);
    } else {
      // If the module is not selected, select it
      addModuleToClient(module);
    }
  }

  function addModuleToClient(moduleToAdd: IModule) {
    setSelectedModules((currentSelectedModules) => [
      ...currentSelectedModules,
      moduleToAdd,
    ]);
  }

  function removeModuleFromClient(moduleToRemove: IModule) {
    setSelectedModules((currentSelectedModules) =>
      currentSelectedModules.filter(
        (module) => module.index !== moduleToRemove.index
      )
    );
  }

  function isModuleSelected(module: IModule): boolean {
    return selectedModules.some(selectedModule => selectedModule.index === module.index);
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
    dispatch(setPendingUserListCount(pendingUserListCount + 1));
    navigation.goBack();
  }

  function isFormFilled() {
    let isFilled = false;
    if (products && employees && numberOfUsers && sales) {
      isFilled = firstName.length > 0 &&
      lastName.length > 0 &&
      phoneNumber.length > 0 &&
      companyName.length > 0 &&
      email.length > 0 &&
      products.length > 0 &&
      employees.length > 0 &&
      Utils.isANumber(employees) &&
      numberOfUsers.length > 0 &&
      Utils.isANumber(numberOfUsers) &&
      parseInt(employees) >= parseInt(numberOfUsers) &&
      sales.length > 0 &&
      Utils.isANumber(sales);
    }
    return isFilled;
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  // Async Methods
  async function submit() {
    if (pendingUser == null) {
      createPendingUser();
    } else {
      convertPendingUser();
    }
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
    let createdUser: IPendingUser | undefined;
    try {
      createdUser = await PendingUserService.getInstance().askForSignUp(newPendingUser, selectedModules)
    } catch (error) {
      const errorKeys: string[] = error as string[];
      const errorTitle = Utils.handleErrorKeys(errorKeys);
      displayToast(t(errorTitle), true)
    }

    if (createdUser) {
      await createEmployees(createdUser.id as string);
      await uploadLogo();
      navigateBack();
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
          const errorMessage = (error as Error).message;
          displayToast(t(`errors.api.${errorMessage}`), true);
        }
      }
    }
  }

  async function convertEmployeesToUser(): Promise<IUser[]> {
    const newUsers: IUser[] = [];
    for (const employee of potentialEmployees) {
      try {
        const newUserEmployee = await PotentialEmployeeService.getInstance().convertToUser(employee.id as string, token);
        newUsers.push(newUserEmployee);
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }
    }
    return newUsers;
  }

  async function convertPendingUser() {
    const id = pendingUser?.id as string;
    const castedToken = token as IToken;
    let createdUser: IUser | undefined;

    try {
      createdUser = await PendingUserService.getInstance().convertPendingUserToUser(id, castedToken);
    } catch (error) {
      const errorKeys = error as string[];
      const errorTitle = Utils.handleErrorKeys(errorKeys);
      displayToast(t(errorTitle), true);
    }

    if (createdUser) {
      try {
        await UserService.getInstance().updateModules(createdUser.id as string, selectedModules, castedToken);
        const createdEmployees = await convertEmployeesToUser();
        for (const employee of createdEmployees) {
          await UserService.getInstance().addManagerToUser(employee.id as string, createdUser.id as string, castedToken);
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }
    }

    await uploadLogo();
    dispatch(setClientListCount(clientListCount + 1));
    navigateBack();
  }

  async function addLogo() {
    if (Platform.OS === PlatformName.Mac) {
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
      await DocumentServicePost.uploadLogo(file, fileName, `${companyName}/logos/`);
    }
  }
  
  async function loadModules() {
    try {
      if (pendingUser?.id != null) {
        const pendingUsersModules = await PendingUserService.getInstance().getPendingUsersModules(pendingUser.id);
        setSelectedModules(pendingUsersModules);
      } else {
        setSelectedModules([]);
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
    if (company) {
      const docs = await DocumentServicePost.getDocumentsAtPath(`${company}/logos/`, token);
      if (docs.length > 0) {
        const logo = docs[0];
        const logoData = await DocumentService.getInstance().download(logo.id as string, token);
        Platform.OS === PlatformName.Mac ?
          setLogoURI(`data:image/png;base64,${logoData}`) :
          setLogoURI(logoData);
      }
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    setDefaultValues();
    async function init() {
      await loadModules();
      await loadEmployees();
      await loadLogo();
    }
    init();
  }, []);

  // Components
  function PotentialEmployeeGridItem(item: IPotentialEmployee, index: number) {
    return (
      <Text key={index} style={styles.employeeText}>{item.firstName} {item.lastName}</Text>
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
              disabled={!isFormFilled()}
            />
          </View>
        )}
      >
        <ScrollView>
          <GladisTextInput
            value={firstName}
            onValueChange={setFirstName}
            placeholder={t('quotation.firstName')} showTitle={true}
          />
          <GladisTextInput
            value={lastName}
            onValueChange={setLastName}
            placeholder={t('quotation.lastName')} showTitle={true}
          />
          <GladisTextInput
            value={phoneNumber}
            onValueChange={setPhoneNumber}
            placeholder={t('quotation.phone')} showTitle={true}
          />
          <GladisTextInput
            value={companyName}
            onValueChange={setCompanyName}
            placeholder={t('quotation.companyName')} showTitle={true}
          />
          <GladisTextInput
            value={email}
            onValueChange={setEmail}
            placeholder={t('quotation.email')} showTitle={true}
          />
          <GladisTextInput
            value={products}
            onValueChange={setProducts}
            placeholder={t('quotation.products')} showTitle={true}
          />
          <Text style={styles.subtitle}>{t('quotation.modulesTitle')}</Text>
          {modules.map((module) => (
            <ModuleCheckBox
              key={module.id}
              module={module}
              isSelected={isModuleSelected(module)}
              onSelectModule={() => toggleCheckbox(module)}
            />
          ))}
          <GladisTextInput
            value={employees}
            onValueChange={setEmployees}
            placeholder={t('quotation.employees')} showTitle={true}
          />
          <GladisTextInput
            value={numberOfUsers}
            onValueChange={setNumberOfUsers}
            placeholder={t('quotation.users')} showTitle={true}
          />
          <GladisTextInput
            value={sales}
            onValueChange={setSales}
            placeholder={t('quotation.capital')} showTitle={true}
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
                  PotentialEmployeeGridItem(employee, index)
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
      {ToastContent()}
    </>
  );
}

export default ClientCreationScreen;