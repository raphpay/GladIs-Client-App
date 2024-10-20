import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
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

import { IRootStackParams } from '../../../navigation/Routes';

import SignUpScreenManager from '../../../business-logic/manager/authentification/SignUpScreenManager';
import IModule from '../../../business-logic/model/IModule';
import IPendingUser from '../../../business-logic/model/IPendingUser';
import IPotentialEmployee from '../../../business-logic/model/IPotentialEmployee';
import MimeType from '../../../business-logic/model/enums/MimeType';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PendingUserStatus from '../../../business-logic/model/enums/PendingUserStatus';
import PlatformName from '../../../business-logic/model/enums/PlatformName';
import FinderModule from '../../../business-logic/modules/FinderModule';
import ModuleService from '../../../business-logic/services/ModuleService';
import PendingUserServicePost from '../../../business-logic/services/PendingUserService/PendingUserService.post';
import Utils from '../../../business-logic/utils/Utils';

import AppContainer from '../../components/AppContainer/AppContainer';
import TextButton from '../../components/Buttons/TextButton';
import ModuleCheckBox from '../../components/CheckBox/ModuleCheckBox';
import AddEmployeeDialog from '../../components/Dialogs/AddEmployeeDialog';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';
import Toast from '../../components/Toast';

import styles from '../../assets/styles/authentification/SignUpScreenStyles';

type SignUpScreenProps = NativeStackScreenProps<
  IRootStackParams,
  NavigationRoutes.SignUpScreen
>;

function SignUpScreen(props: SignUpScreenProps): React.JSX.Element {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [products, setProducts] = useState<string>('');
  const [selectedModules, setSelectedModules] = useState<IModule[]>([]);
  const [numberOfEmployees, setNumberOfEmployees] = useState<string>('');
  const [numberOfUsers, setNumberOfUsers] = useState<string>('');
  const [sales, setSales] = useState<string>('');
  // Dialog
  const [showDialog, setShowDialog] = useState<boolean>(false);
  // Potential employee
  const [potentialEmployees, setPotentialEmployees] = useState<
    IPotentialEmployee[]
  >([]);
  // Logo
  const [logoURI, setLogoURI] = useState<string>('');
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] =
    useState<boolean>(false);

  const { navigation } = props;
  const { t } = useTranslation();

  const modules = ModuleService.getInstance().getModules();

  // Sync Methods
  function toggleCheckbox(module: IModule) {
    setSelectedModules(prevSelectedObjects => {
      if (prevSelectedObjects.includes(module)) {
        return prevSelectedObjects.filter(
          objectModule => objectModule.id !== module.id,
        );
      } else {
        return [...prevSelectedObjects, module];
      }
    });
  }

  function isModuleSelected(module: IModule): boolean {
    return selectedModules.includes(module);
  }

  function navigateBack() {
    navigation.goBack();
  }

  function isFormFilled(): boolean {
    let isFilled = false;
    isFilled =
      firstName.length > 0 &&
      lastName.length > 0 &&
      phoneNumber.length > 0 &&
      companyName.length > 0 &&
      email.length > 0 &&
      products.length > 0 &&
      numberOfEmployees.length > 0 &&
      Utils.isANumber(numberOfEmployees) &&
      numberOfUsers.length > 0 &&
      Utils.isANumber(numberOfUsers) &&
      sales.length > 0 &&
      Utils.isANumber(sales);
    return isFilled;
  }

  function displayToast(message: string, isShowingError: boolean) {
    setShowToast(true);
    setToastMessage(message);
    setToastIsShowingError(isShowingError);
  }

  // Async Methods
  async function submit() {
    const pendingUser: IPendingUser = {
      firstName,
      lastName,
      phoneNumber,
      companyName,
      email,
      products,
      numberOfEmployees: parseInt(numberOfEmployees),
      numberOfUsers: parseInt(numberOfUsers),
      salesAmount: parseFloat(sales),
      status: PendingUserStatus.pending,
    };
    try {
      // Create pending user/client
      const createdUser = await PendingUserServicePost.askForSignUp(
        pendingUser,
        selectedModules,
      );
      // Upload logo if needed
      const destinationPath = `${companyName}/logos/`;
      await SignUpScreenManager.getInstance().uploadLogo(
        destinationPath,
        logoURI,
      );
      // Create employees
      const id = createdUser.id as string;
      await SignUpScreenManager.getInstance().createEmployees(
        potentialEmployees,
        id,
      );
      navigateBack();
    } catch (error) {
      const errorKeys: string[] = error as string[];
      const errorTitle = Utils.handleErrorKeys(errorKeys);
      displayToast(t(errorTitle), true);
    }
  }

  async function addLogo() {
    let filePath: string = '';
    // TODO: Do for the other platforms
    if (Platform.OS === PlatformName.Mac) {
      filePath = await FinderModule.getInstance().pickImageFilePath();
    } else if (Platform.OS === PlatformName.Android) {
      const granted =
        await SignUpScreenManager.getInstance().askAndroidPermission(
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
    }
    setLogoURI(filePath);
  }

  // Components
  function PotentialEmployeeGridItem(item: IPotentialEmployee, index: number) {
    return (
      <Text key={index} style={styles.employeeText}>
        {item.firstName} {item.lastName}
      </Text>
    );
  }

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

  function ScreenContent() {
    return (
      <ScrollView>
        <GladisTextInput
          value={firstName}
          onValueChange={setFirstName}
          placeholder={t('quotation.firstName')}
          showTitle={true}
          editable={!showDialog}
        />
        <GladisTextInput
          value={lastName}
          onValueChange={setLastName}
          placeholder={t('quotation.lastName')}
          showTitle={true}
          editable={!showDialog}
        />
        <GladisTextInput
          value={phoneNumber}
          onValueChange={setPhoneNumber}
          placeholder={t('quotation.phone')}
          showTitle={true}
          editable={!showDialog}
        />
        <GladisTextInput
          value={companyName}
          onValueChange={setCompanyName}
          placeholder={t('quotation.companyName')}
          showTitle={true}
          editable={!showDialog}
        />
        <GladisTextInput
          value={email}
          onValueChange={setEmail}
          placeholder={t('quotation.email')}
          showTitle={true}
          editable={!showDialog}
        />
        <GladisTextInput
          value={products}
          onValueChange={setProducts}
          placeholder={t('quotation.products')}
          showTitle={true}
          editable={!showDialog}
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
          value={numberOfEmployees}
          onValueChange={setNumberOfEmployees}
          placeholder={t('quotation.employees')}
          showTitle={true}
          editable={!showDialog}
        />
        <GladisTextInput
          value={numberOfUsers}
          onValueChange={setNumberOfUsers}
          placeholder={t('quotation.users')}
          showTitle={true}
          editable={!showDialog}
        />
        <GladisTextInput
          value={sales}
          onValueChange={setSales}
          placeholder={t('quotation.capital')}
          showTitle={true}
          editable={!showDialog}
        />
        <TextButton
          width={'30%'}
          title={t('quotation.employee.create')}
          onPress={() => setShowDialog(true)}
        />
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
            title={t('quotation.logo.add')}
            onPress={addLogo}
          />
          {logoURI && <Image source={{ uri: logoURI }} style={styles.logo} />}
        </View>
      </ScrollView>
    );
  }

  return (
    <>
      <AppContainer
        mainTitle={t('quotation.title')}
        showBackButton={true}
        navigateBack={navigateBack}
        showSearchText={false}
        showSettings={false}
        dialogIsShown={showDialog}
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

export default SignUpScreen;
