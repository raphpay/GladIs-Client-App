import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  ScrollView,
  Text
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IAuthenticationStackParams } from '../../../navigation/Routes';
import styles from '../../assets/styles/authentification/SignUpScreenStyles';
import CheckboxWithTitle from '../../components/CheckBoxWithTitle';
import GladisTextInput from '../../components/GladisTextInput';
import TextButton from '../../components/TextButton';

type SignUpScreenProps = NativeStackScreenProps<IAuthenticationStackParams, 'SignUpScreen'>;

function SignUpScreen(props: SignUpScreenProps): React.JSX.Element {
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [products, setProducts] = useState<string>('');
  const [documentManagementIsChecked, setDocumentManagementIsChecked] = useState<boolean>(false);
  const [moduleOneIsChecked, setModuleOneIsChecked] = useState<boolean>(false);
  const [employees, setEmployees] = useState<string>('');
  const [users, setUsers] = useState<string>('');
  const [sales, setSales] = useState<string>('');

  const { navigation } = props;

  const { t } = useTranslation();

  function submit() {
    // TODO: Handle sumbission
    navigation.goBack();
  }

  const isButtonDisabled = name.length === 0 || phoneNumber.length === 0 || companyName.length === 0 ||
  email.length === 0 || products.length === 0 || employees.length === 0 || users.length === 0 || sales.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>{t('quotation.title')}</Text>
        <GladisTextInput value={name} onValueChange={setName} placeholder={t('quotation.name')}/>
        <GladisTextInput value={phoneNumber} onValueChange={setPhoneNumber} placeholder={t('quotation.phone')}/>
        <GladisTextInput value={companyName} onValueChange={setCompanyName} placeholder={t('quotation.companyName')}/>
        <GladisTextInput value={email} onValueChange={setEmail} placeholder={t('quotation.email')}/>
        <GladisTextInput value={products} onValueChange={setProducts} placeholder={t('quotation.products')}/>
        <Text style={styles.subtitle}>{t('quotation.modules.title')}</Text>
        <CheckboxWithTitle
          title={t('quotation.modules.documentManagement')}
          isChecked={documentManagementIsChecked}
          setIsChecked={setDocumentManagementIsChecked}
        />
        <CheckboxWithTitle
          title={t('quotation.modules.module1')}
          isChecked={moduleOneIsChecked}
          setIsChecked={setModuleOneIsChecked}
        />
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