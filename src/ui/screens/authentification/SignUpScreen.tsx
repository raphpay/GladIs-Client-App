import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  View
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';

import { IRootStackParams } from '../../../navigation/Routes';

import IFile from '../../../business-logic/model/IFile';
import IModule from '../../../business-logic/model/IModule';
import IPendingUser from '../../../business-logic/model/IPendingUser';
import IPotentialEmployee from '../../../business-logic/model/IPotentialEmployee';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PendingUserStatus from '../../../business-logic/model/enums/PendingUserStatus';
import FinderModule from '../../../business-logic/modules/FinderModule';
import DocumentService from '../../../business-logic/services/DocumentService';
import ModuleService from '../../../business-logic/services/ModuleService';
import PendingUserService from '../../../business-logic/services/PendingUserService';
import PotentialEmployeeService from '../../../business-logic/services/PotentialEmployeeService';
import Utils from '../../../business-logic/utils/Utils';

import AddEmployeeDialog from '../../components/AddEmployeeDialog';
import AppContainer from '../../components/AppContainer';
import ErrorDialog from '../../components/ErrorDialog';
import GladisTextInput from '../../components/GladisTextInput';
import ModuleCheckBox from '../../components/ModuleCheckBox';
import TextButton from '../../components/TextButton';

import PlatformName from '../../../business-logic/model/enums/PlatformName';
import styles from '../../assets/styles/authentification/SignUpScreenStyles';

type SignUpScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.SignUpScreen>;

function SignUpScreen(props: SignUpScreenProps): React.JSX.Element {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [products, setProducts] = useState<string>('');
  const [modules, setModules] = useState<IModule[]>([]);
  const [selectedModules, setSelectedModules] = useState<IModule[]>([]);
  const [numberOfEmployees, setNumberOfEmployees] = useState<string>('');
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

  const { t } = useTranslation();

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
      status: PendingUserStatus.pending
    }
    try {
      const createdUser = await PendingUserService.getInstance().askForSignUp(pendingUser, selectedModules);
      await uploadLogo();
      const id = createdUser.id as string;
      await createEmployees(id);
      navigateBack();
    } catch (error) {
      const errorKeys: string[] = error as string[];
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

  function toggleCheckbox(module: IModule) {
    setSelectedModules((prevSelectedObjects) => {
      if (prevSelectedObjects.includes(module)) {
        return prevSelectedObjects.filter((objectModule) => objectModule.id !== module.id);
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

  async function addLogo() {
    if (Platform.OS === PlatformName.Mac) {
      const data = await FinderModule.getInstance().pickImage();
      setImageData(data);
      setLogoURI(`data:image/png;base64,${data}`);
    } else {
      const doc = await DocumentPicker.pickSingle({ type: DocumentPicker.types.images });
      const data = await Utils.getFileBase64FromURI(doc.uri);
      setImageData(data);
      setLogoURI(doc.uri);
    }
  }

  const isButtonDisabled = firstName.length === 0 || lastName.length === 0 || phoneNumber.length === 0 || companyName.length === 0 ||
    email.length === 0 || products.length === 0 || numberOfEmployees.length === 0 || numberOfUsers.length === 0 || sales.length === 0;

  useEffect(() => {
    async function init() {
      const apiModules = await ModuleService.getInstance().getModules();  
      setModules(apiModules);
      setSelectedModules([]);
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
    )
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
            editable={!showErrorDialog && !showDialog}
          />
          <GladisTextInput
            value={lastName}
            onValueChange={setLastName}
            placeholder={t('quotation.lastName')} showTitle={true}
            editable={!showErrorDialog && !showDialog}
            />
          <GladisTextInput
            value={phoneNumber}
            onValueChange={setPhoneNumber}
            placeholder={t('quotation.phone')} showTitle={true}
            editable={!showErrorDialog && !showDialog}
          />
          <GladisTextInput
            value={companyName}
            onValueChange={setCompanyName}
            placeholder={t('quotation.companyName')} showTitle={true}
            editable={!showErrorDialog && !showDialog}
          />
          <GladisTextInput
            value={email}
            onValueChange={setEmail}
            placeholder={t('quotation.email')} showTitle={true}
            editable={!showErrorDialog && !showDialog}
          />
          <GladisTextInput
            value={products}
            onValueChange={setProducts}
            placeholder={t('quotation.products')} showTitle={true}
            editable={!showErrorDialog && !showDialog}
          />
          <Text style={styles.subtitle}>{t('quotation.modulesTitle')}</Text>
          {modules.map((module) => (
            <ModuleCheckBox
              key={module.id}
              module={module}
              isSelected={isModuleSelected(module)}
              isDisabled={false}
              onSelectModule={() => toggleCheckbox(module)}
            />
          ))}
          <GladisTextInput
            value={numberOfEmployees}
            onValueChange={setNumberOfEmployees}
            placeholder={t('quotation.employees')} showTitle={true}
            editable={!showErrorDialog && !showDialog}
          />
          <GladisTextInput
            value={numberOfUsers}
            onValueChange={setNumberOfUsers}
            placeholder={t('quotation.users')} showTitle={true}
            editable={!showErrorDialog && !showDialog}
          />
          <GladisTextInput
            value={sales}
            onValueChange={setSales}
            placeholder={t('quotation.capital')} showTitle={true}
            editable={!showErrorDialog && !showDialog}
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
          <View style={styles.logoContainer}>
            <TextButton width={'30%'} title={t('quotation.logo.add')} onPress={addLogo} />
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

export default SignUpScreen;