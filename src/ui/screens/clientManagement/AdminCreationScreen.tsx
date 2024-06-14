import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { setPendingUserListCount } from '../../../business-logic/store/slices/appStateReducer';
import { RootState } from '../../../business-logic/store/store';

import { IClientCreationStack } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer/AppContainer';
import TextButton from '../../components/Buttons/TextButton';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';
import Toast from '../../components/Toast';

import IUser from '../../../business-logic/model/IUser';
import UserType from '../../../business-logic/model/enums/UserType';
import UserService from '../../../business-logic/services/UserService';
import { BASE_PASSWORD } from '../../../business-logic/utils/envConfig';
import styles from '../../assets/styles/clientManagement/ClientCreationScreenStyles';

type AdminCreationScreenProps = NativeStackScreenProps<IClientCreationStack, NavigationRoutes.AdminCreationScreen>;

function AdminCreationScreen(props: AdminCreationScreenProps): React.JSX.Element {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('MD Consulting');
  // Dialog
  const [showDialog, setShowDialog] = useState<boolean>(false);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);

  const { navigation } = props;

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { pendingUserListCount } = useAppSelector((state: RootState) => state.appState);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  // Sync Methods
  function navigateBack() {
    dispatch(setPendingUserListCount(pendingUserListCount + 1));
    navigation.goBack();
  }

  function isFormFilled() {
    let isFilled = false;
    isFilled = firstName.length > 0 &&
    lastName.length > 0 &&
    phoneNumber.length > 0 &&
    email.length > 0 &&
    companyName.length > 0;
    return isFilled;
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  // Async Methods
  async function submit() {
    const newAdmin: IUser = {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      userType: UserType.Admin,
      companyName: companyName,
      password: BASE_PASSWORD,
    };
    try {
      await UserService.getInstance().createUser(newAdmin, token);
      displayToast(t('pendingUserManagement.success.adminCreation'));

      const delay = 2000; // 2 seconds
      setTimeout(() => {
        navigateBack();
      }, delay); // 3-second delay (3000 milliseconds)
    } catch (error) {
      const errorMessage = (error as Error).message as string;
      displayToast(t(`errors.api.${errorMessage}`), true);
    }
  }

  // Lifecycle Methods

  // Components
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
            value={email}
            onValueChange={setEmail}
            placeholder={t('quotation.email')} showTitle={true}
          />
          <GladisTextInput
            value={companyName}
            onValueChange={setCompanyName}
            placeholder={t('quotation.companyName')} showTitle={true}
          />
        </ScrollView>
      </AppContainer>
      {ToastContent()}
    </>
  );
}

export default AdminCreationScreen;