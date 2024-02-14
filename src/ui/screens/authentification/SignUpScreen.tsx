import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
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

import GladisTextInput from '../../components/GladisTextInput';
import IconButton from '../../components/IconButton';
import ModuleCheckBox from '../../components/ModuleCheckBox';
import TextButton from '../../components/TextButton';

import backIcon from '../../assets/images/arrow.uturn.left.png';
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
  const [employees, setEmployees] = useState<string>('');
  const [users, setUsers] = useState<string>('');
  const [sales, setSales] = useState<string>('');

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
      numberOfEmployees: parseInt(employees),
      numberOfUsers: parseInt(users),
      salesAmount: parseFloat(sales),
      status: PendingUserStatus.pending
    }
    await PendingUserService.getInstance()
      .askForSignUp(pendingUser, selectedModules)
      .then(() => {
        navigation.goBack();
      });
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

  function goBack() {
    navigation.goBack();
  }

  const isButtonDisabled = firstName.length === 0 || lastName.length === 0 || phoneNumber.length === 0 || companyName.length === 0 ||
    email.length === 0 || products.length === 0 || employees.length === 0 || users.length === 0 || sales.length === 0;

  useEffect(() => {
    async function init() {
      const apiModules = await ModuleService.getInstance().getModules();  
      setModules(apiModules);
      setSelectedModules([]);
    }
    init();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <IconButton
          title={t('components.buttons.back')}
          icon={backIcon}
          onPress={goBack}
        />
      </View>
      <ScrollView>
        <Text style={styles.title}>{t('quotation.title')}</Text>
        <GladisTextInput value={firstName} onValueChange={setFirstName} placeholder={t('quotation.firstName')}/>
        <GladisTextInput value={lastName} onValueChange={setLastName} placeholder={t('quotation.lastName')}/>
        <GladisTextInput value={phoneNumber} onValueChange={setPhoneNumber} placeholder={t('quotation.phone')}/>
        <GladisTextInput value={companyName} onValueChange={setCompanyName} placeholder={t('quotation.companyName')}/>
        <GladisTextInput value={email} onValueChange={setEmail} placeholder={t('quotation.email')}/>
        <GladisTextInput value={products} onValueChange={setProducts} placeholder={t('quotation.products')}/>
        <Text style={styles.subtitle}>{t('quotation.modules.title')}</Text>
        {modules.map((module) => (
          <ModuleCheckBox
            key={module.id}
            module={module}
            isSelected={isModuleSelected(module)}
            isDisabled={false}
            onSelectModule={() => toggleCheckbox(module)}
          />
        ))}
        <GladisTextInput value={employees} onValueChange={setEmployees} placeholder={t('quotation.employees')}/>
        <GladisTextInput value={users} onValueChange={setUsers} placeholder={t('quotation.users')}/>
        <GladisTextInput value={sales} onValueChange={setSales} placeholder={t('quotation.capital')}/>
        <TextButton
          title={t('quotation.submit')}
          onPress={submit}
          disabled={isButtonDisabled}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default SignUpScreen;