import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';

import { IEmail } from '../../../business-logic/model/IEmail';
import IUser from '../../../business-logic/model/IUser';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import UserType from '../../../business-logic/model/enums/UserType';
import EmailService from '../../../business-logic/services/EmailService';
import UserServicePost from '../../../business-logic/services/UserService/UserService.post';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../business-logic/store/hooks';
import { setPendingUserListCount } from '../../../business-logic/store/slices/appStateReducer';
import { RootState } from '../../../business-logic/store/store';
import Utils from '../../../business-logic/utils/Utils';
import {
  BASE_PASSWORD,
  FROM_MAIL,
  FROM_NAME,
  SEND_GRID_API_KEY,
} from '../../../business-logic/utils/envConfig';

import { IClientCreationStack } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer/AppContainer';
import TextButton from '../../components/Buttons/TextButton';
import GladisTextInput from '../../components/TextInputs/GladisTextInput';
import Toast from '../../components/Toast';

import styles from '../../assets/styles/clientManagement/ClientCreationScreenStyles';

type AdminCreationScreenProps = NativeStackScreenProps<
  IClientCreationStack,
  NavigationRoutes.AdminCreationScreen
>;

function AdminCreationScreen(
  props: AdminCreationScreenProps,
): React.JSX.Element {
  // General
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('MD Consulting');
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] =
    useState<boolean>(false);
  // Navigation
  const { navigation } = props;
  // Hooks
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { pendingUserListCount } = useAppSelector(
    (state: RootState) => state.appState,
  );
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  // Sync Methods
  function navigateBack() {
    dispatch(setPendingUserListCount(pendingUserListCount + 1));
    navigation.goBack();
  }

  function isFormFilled() {
    let isFilled = false;
    isFilled =
      firstName.length > 0 &&
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
    // TODO: Disable the button during the sending process
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
      const createdUser = await UserServicePost.createUser(newAdmin, token);
      displayToast(t('pendingUserManagement.success.adminCreation'));

      const email = await createEmail(createdUser);
      await EmailService.getInstance().sendEmail(email);

      const delay = 2000; // 2 seconds
      setTimeout(() => {
        navigateBack();
      }, delay); // 3-second delay (3000 milliseconds)
    } catch (error) {
      const errorKeys = error as string[];
      const errorTitle = Utils.handleErrorKeys(errorKeys);
      displayToast(t(errorTitle), true);
    }
  }

  async function createEmail(user: IUser): Promise<IEmail> {
    const content = createEmailContent(user);
    const email: IEmail = {
      to: [user.email],
      fromMail: FROM_MAIL,
      fromName: FROM_NAME,
      replyTo: FROM_MAIL,
      subject: 'Bienvenue à Glad-Is',
      content,
      apiKey: SEND_GRID_API_KEY,
      isHTML: true,
    };
    return email;
  }

  function createEmailContent(user: IUser) {
    return `
    <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Glad-Is - Compte créé</title>
      </head>
      <body>
        <p>Bonjour <span id="userName">${user.firstName} ${user.lastName}</span>,</p>

        <p>Votre compte a été créé avec succès, vous pouvez désormais accéder à votre espace <strong>App1</strong>.</p>

        <p>Vos identifiants sont :</p>
        <ul>
          <li>Nom d'utilisateur : <span id="username">${user.username}</span></li>
          <li>Mot de passe : <span id="password">${BASE_PASSWORD}</span></li>
        </ul>

        <p><strong>Le mot de passe est à changer à la première connexion.</strong></p>

        <p>L'équipe <strong>Glad-Is</strong></p>
      </body>
      </html>
    `;
  }

  // Components
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
            value={email}
            onValueChange={setEmail}
            placeholder={t('quotation.email')}
            showTitle={true}
          />
          <GladisTextInput
            value={companyName}
            onValueChange={setCompanyName}
            placeholder={t('quotation.companyName')}
            showTitle={true}
          />
        </ScrollView>
      </AppContainer>
      {ToastContent()}
    </>
  );
}

export default AdminCreationScreen;
