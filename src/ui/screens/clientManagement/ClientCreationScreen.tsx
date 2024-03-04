import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import IModule from '../../../business-logic/model/IModule';
import IPendingUser from '../../../business-logic/model/IPendingUser';
import IToken from '../../../business-logic/model/IToken';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PendingUserStatus from '../../../business-logic/model/enums/PendingUserStatus';
import ModuleService from '../../../business-logic/services/ModuleService';
import PendingUserService from '../../../business-logic/services/PendingUserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IClientManagementParams } from '../../../navigation/Routes';

import GladisTextInput from '../../components/GladisTextInput';
import ModuleCheckBox from '../../components/ModuleCheckBox';
import TextButton from '../../components/TextButton';

import styles from '../../assets/styles/clientManagement/ClientCreationScreenStyles';
import AppContainer from '../../components/AppContainer';
import ErrorDialog from '../../components/ErrorDialog';

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
  const [users, setUsers] = useState<string>('');
  const [sales, setSales] = useState<string>('');
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const [errorTitle, setErrorTitle] = useState<string>('');
  const [errorDescription, setErrorDescription] = useState<string>('');
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

  async function createPendingUser() {
    const newPendingUser: IPendingUser = {
      firstName,
      lastName,
      phoneNumber,
      companyName,
      email,
      products,
      numberOfEmployees: parseInt(employees),
      numberOfUsers: parseInt(users),
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
      await PendingUserService.getInstance().askForSignUp(newPendingUser, selectedModules)
      navigation.goBack();
    } catch (error) {
      const errorKeys: string[] = error as string[];
      showError(errorKeys);
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
      numberOfUsers: parseInt(users),
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
      setUsers(users.toString());
      const salesAmount = pendingUser.salesAmount as number;
      setSales(salesAmount.toString());
    }
  }

  function navigateBack() {
    navigation.goBack();
  }

  const isButtonDisabled = firstName.length === 0 || lastName.length === 0 || phoneNumber.length === 0 || companyName.length === 0 ||
    email.length === 0 || products.length === 0 || employees.length === 0 || users.length === 0 || sales.length === 0;

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
  

  return (
    <>
      <AppContainer
        mainTitle={t('quotation.adminTitle')}
        showBackButton={true}
        navigateBack={navigateBack}
        showSearchText={false}
        additionalButton={(
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
            value={users}
            onValueChange={setUsers}
            placeholder={t('quotation.users')} showTitle={true}
            editable={!showErrorDialog}
          />
          <GladisTextInput
            value={sales}
            onValueChange={setSales}
            placeholder={t('quotation.capital')} showTitle={true}
            editable={!showErrorDialog}
          />
          <TextButton
            title={t('quotation.submit')}
            onPress={submit}
            disabled={isButtonDisabled}
          />
        </ScrollView>
      </AppContainer>
      {
        showErrorDialog && (
          <ErrorDialog
            title={errorTitle}
            description={errorDescription}
            cancelTitle={t('errors.modules.cancelButton')}
            onCancel={() => setShowErrorDialog(false)}
          />
        )
      }
    </>
  );
}

export default ClientCreationScreen;