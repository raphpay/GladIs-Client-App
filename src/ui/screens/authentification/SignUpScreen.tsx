import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView,
  ScrollView,
  Text
} from 'react-native';

import styles from '../../assets/styles/SignUpScreenStyles';
import CheckboxWithTitle from '../../components/CheckBoxWithTitle';
import GladisTextInput from '../../components/GladisTextInput';
import TextButton from '../../components/TextButton';

function SignUpScreen(): React.JSX.Element {
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

  const { t } = useTranslation();

  function submit() {}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text>{t('quotation.title')}</Text>
        <GladisTextInput value={name} onValueChange={setName} placeholder={t('quotation.name')}/>
        <GladisTextInput value={phoneNumber} onValueChange={setPhoneNumber} placeholder={t('quotation.phone')}/>
        <GladisTextInput value={companyName} onValueChange={setCompanyName} placeholder={t('quotation.companyName')}/>
        <GladisTextInput value={email} onValueChange={setEmail} placeholder={t('quotation.email')}/>
        <GladisTextInput value={products} onValueChange={setProducts} placeholder={t('quotation.products')}/>
        <Text>{t('quotation.modules.title')}</Text>
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
        <TextButton title={t('quotation.submit')} onPress={submit} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default SignUpScreen;