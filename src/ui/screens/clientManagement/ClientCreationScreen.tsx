import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  NativeModules,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
const { FilePickerModule } = NativeModules;

import ClientCreationScreenManager from '../../../business-logic/manager/clientManagement/ClientCreationScreenManager';
import IModule from '../../../business-logic/model/IModule';
import IPotentialEmployee from '../../../business-logic/model/IPotentialEmployee';
import IUser from '../../../business-logic/model/IUser';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PendingUserStatus from '../../../business-logic/model/enums/PendingUserStatus';
import PlatformName from '../../../business-logic/model/enums/PlatformName';
import FileOpenPicker from '../../../business-logic/modules/FileOpenPicker';
import FinderModule from '../../../business-logic/modules/FinderModule';
import DocumentServiceGet from '../../../business-logic/services/DocumentService/DocumentService.get';
import DocumentServicePost from '../../../business-logic/services/DocumentService/DocumentService.post';
import ModuleService from '../../../business-logic/services/ModuleService';
import PendingUserServiceGet from '../../../business-logic/services/PendingUserService/PendingUserService.get';
import UserServicePut from '../../../business-logic/services/UserService/UserService.put';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../business-logic/store/hooks';
import {
  setClientListCount,
  setPendingUserListCount,
} from '../../../business-logic/store/slices/appStateReducer';
import { RootState } from '../../../business-logic/store/store';
import Utils from '../../../business-logic/utils/Utils';

import { IClientCreationStack } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer/AppContainer';
import TextButton from '../../components/Buttons/TextButton';
import ModuleCheckBox from '../../components/CheckBox/ModuleCheckBox';
import AddEmployeeDialog from '../../components/Dialogs/AddEmployeeDialog';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';
import Toast from '../../components/Toast';

import IPendingUser from '../../../business-logic/model/IPendingUser';
import MimeType from '../../../business-logic/model/enums/MimeType';
import styles from '../../assets/styles/clientManagement/ClientCreationScreenStyles';

type ClientCreationScreenProps = NativeStackScreenProps<
  IClientCreationStack,
  NavigationRoutes.ClientCreationScreen
>;

function ClientCreationScreen(
  props: ClientCreationScreenProps,
): React.JSX.Element {
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
  const [potentialEmployees, setPotentialEmployees] = useState<
    IPotentialEmployee[]
  >([]);
  // Logo
  const [imageData, setImageData] = useState<string>('');
  const [logoURI, setLogoURI] = useState<string>('');
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] =
    useState<boolean>(false);

  const { navigation } = props;
  const { pendingUser } = props.route.params;

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { pendingUserListCount, clientListCount } = useAppSelector(
    (state: RootState) => state.appState,
  );
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
    setSelectedModules(currentSelectedModules => [
      ...currentSelectedModules,
      moduleToAdd,
    ]);
  }

  function removeModuleFromClient(moduleToRemove: IModule) {
    setSelectedModules(currentSelectedModules =>
      currentSelectedModules.filter(
        module => module.index !== moduleToRemove.index,
      ),
    );
  }

  function isModuleSelected(module: IModule): boolean {
    return selectedModules.some(
      selectedModule => selectedModule.index === module.index,
    );
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
      isFilled =
        firstName.length > 0 &&
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
      // Create pending user
      await createPendingUser();
    } else {
      await convertPendingUser();
    }
  }

  async function createPendingUser() {
    let newPendingUser: IPendingUser | undefined;
    try {
      newPendingUser =
        await ClientCreationScreenManager.getInstance().createPendingUser(
          firstName,
          lastName,
          phoneNumber,
          companyName,
          email,
          products,
          employees,
          numberOfUsers,
          sales,
          PendingUserStatus.pending,
          selectedModules,
        );
    } catch (error) {
      const errorKeys: string[] = error as string[];
      const errorTitle = Utils.handleErrorKeys(errorKeys);
      displayToast(t(errorTitle), true);
    }

    if (newPendingUser) {
      // Create related employees
      try {
        await ClientCreationScreenManager.getInstance().createEmployees(
          potentialEmployees,
          newPendingUser.id as string,
        );
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }

      // Upload logo
      const destinationPath = `${companyName}/logos/`;
      await ClientCreationScreenManager.getInstance().uploadLogo(
        destinationPath,
        logoURI,
      );

      navigateBack();
    }
  }

  async function convertPendingUser() {
    let createdUser: IUser | undefined;
    // Convert Pending User to User
    try {
      createdUser =
        await ClientCreationScreenManager.getInstance().convertPendingUser(
          pendingUser,
          token,
        );
    } catch (error) {
      const errorKeys = error as string[];
      const errorTitle = Utils.handleErrorKeys(errorKeys);
      displayToast(t(errorTitle), true);
    }

    if (createdUser) {
      try {
        // Update modules
        await UserServicePut.updateModules(
          createdUser.id as string,
          selectedModules,
          token,
        );

        // Convert employees to users
        const createdEmployees =
          await ClientCreationScreenManager.getInstance().convertEmployeesToUser(
            potentialEmployees,
            createdUser,
            selectedModules,
            token,
          );
        // Send email with username and password ( and employees username if existing )
        await ClientCreationScreenManager.getInstance().sendEmail(
          createdUser,
          createdEmployees,
          token,
        );
      } catch (error) {
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
      }
    }

    const destinationPath = `${companyName}/logos/`;
    await ClientCreationScreenManager.getInstance().uploadLogo(
      destinationPath,
      logoURI,
    );
    dispatch(setClientListCount(clientListCount + 1));
    navigateBack();
  }

  async function addLogo() {
    let filePath: string = '';
    if (Platform.OS === PlatformName.Mac) {
      filePath = await FinderModule.getInstance().pickImageFilePath();
    } else if (Platform.OS === PlatformName.Android) {
      const granted =
        await ClientCreationScreenManager.getInstance().askAndroidPermission(
          t('permission.title'),
          t('permission.message'),
          t('permission.buttonNuetral'),
          t('permission.buttonNegative'),
          t('permission.buttonPositive'),
        );
      if (granted) {
        filePath = FilePickerModule.pickSingleFile([
          MimeType.jpeg,
          MimeType.png,
        ]);
      }
    } else if (Platform.OS === PlatformName.Windows) {
      const originPath = await FileOpenPicker?.pickPDFFile();
      if (originPath) {
        filePath = originPath;
      }
    }
    setLogoURI(filePath);
  }

  async function loadModules() {
    try {
      if (pendingUser?.id != null) {
        const pendingUsersModules =
          await PendingUserServiceGet.getPendingUsersModules(pendingUser.id);
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
        const employees = await PendingUserServiceGet.getPotentialEmployees(
          pendingUser?.id,
          token,
        );
        setPotentialEmployees(employees);
      } catch (error) {
        console.log('Error loading employees', error);
      }
    }
  }

  async function loadLogo() {
    const company = pendingUser?.companyName as string;
    if (company) {
      const docs = await DocumentServicePost.getDocumentsAtPath(
        `${company}/logos/`,
        token,
      );
      if (docs.length > 0) {
        const logo = docs[0];
        const logoData = await DocumentServiceGet.download(
          logo.id as string,
          token,
        );
        Platform.OS === PlatformName.Mac
          ? setLogoURI(`data:image/png;base64,${logoData}`)
          : setLogoURI(logoData);
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
  function ScreenContent() {
    return (
      <ScrollView>
        <GladisTextInput
          value={firstName}
          onValueChange={setFirstName}
          placeholder={t('quotation.firstName')}
          showTitle={true}
        />
        <GladisTextInput
          value={lastName}
          onValueChange={setLastName}
          placeholder={t('quotation.lastName')}
          showTitle={true}
        />
        <GladisTextInput
          value={phoneNumber}
          onValueChange={setPhoneNumber}
          placeholder={t('quotation.phone')}
          showTitle={true}
        />
        <GladisTextInput
          value={companyName}
          onValueChange={setCompanyName}
          placeholder={t('quotation.companyName')}
          showTitle={true}
        />
        <GladisTextInput
          value={email}
          onValueChange={setEmail}
          placeholder={t('quotation.email')}
          showTitle={true}
        />
        <GladisTextInput
          value={products}
          onValueChange={setProducts}
          placeholder={t('quotation.products')}
          showTitle={true}
        />
        <Text style={styles.subtitle}>{t('quotation.modulesTitle')}</Text>
        {modules.map(module => (
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
          placeholder={t('quotation.employees')}
          showTitle={true}
        />
        <GladisTextInput
          value={numberOfUsers}
          onValueChange={setNumberOfUsers}
          placeholder={t('quotation.users')}
          showTitle={true}
        />
        <GladisTextInput
          value={sales}
          onValueChange={setSales}
          placeholder={t('quotation.capital')}
          showTitle={true}
        />
        {pendingUser == null && (
          <TextButton
            width={'30%'}
            title={t('quotation.employee.create')}
            onPress={() => setShowDialog(true)}
          />
        )}
        {potentialEmployees.length > 0 && (
          <>
            <Text style={styles.employeesTitle}>
              {t('quotation.employee.title')}
            </Text>
            {potentialEmployees.map((employee, index) =>
              PotentialEmployeeGridItem(employee, index),
            )}
          </>
        )}
        <View style={styles.logoContainer}>
          <TextButton
            width={'30%'}
            title={t('quotation.logo.modify')}
            onPress={addLogo}
          />
          {logoURI && <Image source={{ uri: logoURI }} style={styles.logo} />}
        </View>
      </ScrollView>
    );
  }

  function PotentialEmployeeGridItem(item: IPotentialEmployee, index: number) {
    return (
      <Text key={index} style={styles.employeeText}>
        {item.firstName} {item.lastName}
      </Text>
    );
  }

  // TODO: Find a way to refactor the Toast
  function ToastContent() {
    return (
      <>
        {showToast && (
          <Toast
            message={toastMessage}
            isVisible={showToast}
            setIsVisible={setShowToast}
            isShowingError={toastIsShowingError}
          />
        )}
      </>
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
        additionalComponent={
          <View style={styles.sendButtonContainer}>
            <TextButton
              width={'100%'}
              title={t('quotation.submit')}
              onPress={submit}
              disabled={!isFormFilled()}
            />
          </View>
        }>
        {ScreenContent()}
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
