import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import IUser from '../../../business-logic/model/IUser';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import UserService from '../../../business-logic/services/UserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IClientCreationStack } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer/AppContainer';
import TextButton from '../../components/Buttons/TextButton';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';
import Toast from '../../components/Toast';

import styles from '../../assets/styles/clientManagement/ClientCreationScreenStyles';

type AdminCreationScreenProps = NativeStackScreenProps<IClientCreationStack, NavigationRoutes.ClientCreationScreen>;

function AdminCreationScreen(props: AdminCreationScreenProps): React.JSX.Element {

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);

  const { t } = useTranslation();
  const { token } = useAppSelector((state: RootState) => state.tokens);

  const { navigation } = props;

  // Sync Methods
  function isFormFilled() {
    let isFilled = false;
    isFilled = firstName.length > 0 &&
    lastName.length > 0 &&
    phoneNumber.length > 0 &&
    email.length > 0;
    return isFilled;
  }

  function navigateBack() {
    navigation.goBack();
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  // Async Methods
  async function submit() {
    const admin: IUser = {
      firstName,
      lastName,
      phoneNumber,
      email,
      password: 'Passwordlong1(',
      companyName: 'MD Consulting',
      userType: UserType.Admin,
    };

    try {
      await UserService.getInstance().createUser(admin, token);
      displayToast(t('createAdmin.success'));
      setTimeout(() => {
        navigateBack();
      }, 2500);
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(t(`errors.api.${errorMessage}`), true);
    }
  }

  function SendButton() {
    return (
      <View style={styles.sendButtonContainer}>
        <TextButton
          width={'100%'}
          title={t('quotation.submit')}
          onPress={submit}
          disabled={!isFormFilled()}
        />
      </View>
    );
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
        mainTitle={t('createAdmin.title')}
        showSearchText={false}
        showSettings={false}
        additionalComponent={SendButton()}
        showBackButton={true}
        navigateBack={navigateBack}
      >
        <>
          <GladisTextInput
            value={firstName}
            onValueChange={setFirstName}
            placeholder={t('quotation.firstName')}
          />
          <GladisTextInput
            value={lastName}
            onValueChange={setLastName}
            placeholder={t('quotation.lastName')}
          />
          <GladisTextInput
            value={phoneNumber}
            onValueChange={setPhoneNumber}
            placeholder={t('quotation.phone')}
          />
          <GladisTextInput
            value={email}
            onValueChange={setEmail}
            placeholder={t('quotation.email')}
          />
        </>
      </AppContainer>
      {ToastContent()}
    </>
  );
}

export default AdminCreationScreen;
