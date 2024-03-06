import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  ScrollView,
  Text,
  View
} from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import IModule from '../../../business-logic/model/IModule';
import IPendingUser from '../../../business-logic/model/IPendingUser';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PendingUserStatus from '../../../business-logic/model/enums/PendingUserStatus';
import ModuleService from '../../../business-logic/services/ModuleService';
import PendingUserService from '../../../business-logic/services/PendingUserService';

import AppContainer from '../../components/AppContainer';
import Dialog from '../../components/Dialog';
import ErrorDialog from '../../components/ErrorDialog';
import GladisTextInput from '../../components/GladisTextInput';
import ModuleCheckBox from '../../components/ModuleCheckBox';
import TextButton from '../../components/TextButton';

import styles from '../../assets/styles/authentification/SignUpScreenStyles';

// TODO: To be exported
interface IPotentialEmployee {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  // Always check if pendingUserID is not null
  pendingUserID?: string
}

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
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const [errorTitle, setErrorTitle] = useState<string>('');
  const [errorDescription, setErrorDescription] = useState<string>('');

  // Potential employee
  const [potentialEmployeeFirstName, setPotentialEmployeeFirstName] = useState<string>('');
  const [potentialEmployeeLastName, setPotentialEmployeeLastName] = useState<string>('');
  const [potentialEmployees, setPotentialEmployees] = useState<IPotentialEmployee[]>([]);

  const { navigation } = props;

  const { t } = useTranslation();

  async function addEmployeesBeforeSubmit() {
    if (parseInt(numberOfUsers) > 0) {
      setShowDialog(true);
    } else {
      submit()
    }
  }

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
      await PendingUserService.getInstance().askForSignUp(pendingUser, selectedModules);
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

  function addEmployee() {
    // TODO: Add API method
    console.log('hello', potentialEmployeeFirstName, potentialEmployeeLastName, potentialEmployees);
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

  function PotentialEmployeeFlatListItem(item: IPotentialEmployee) {
    return (
      <Text>{item.firstName} {item.lastName}</Text>
    )
  }

  function dialogContent() {
    return (
      showDialog && (
        (
          <Dialog
            title='Add employees'
            onConfirm={addEmployee}
            onCancel={() => setShowDialog(false)}
          >
            <>
              {
                potentialEmployees && (
                  <FlatList
                    data={potentialEmployees}
                    numColumns={4}
                    renderItem={(renderItem) => PotentialEmployeeFlatListItem(renderItem.item)}
                    keyExtractor={(item) => item.id}
                  />
                )
              }
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
            </>
          </Dialog>
        )
      )
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
        </ScrollView>
      </AppContainer>
      {dialogContent()}
      {errorDialog()}
    </>
  );
}

export default SignUpScreen;