import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

import { IActionItem } from '../../../business-logic/model/IAction';
import IUser from '../../../business-logic/model/IUser';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import MessageService from '../../../business-logic/services/MessageService';
import PasswordResetService from '../../../business-logic/services/PasswordResetService';
import SurveyService from '../../../business-logic/services/SurveyService';
import UserService from '../../../business-logic/services/UserService/UserService';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { setSMQSurveysListCount } from '../../../business-logic/store/slices/smqReducer';
import { RootState } from '../../../business-logic/store/store';

import styles from '../../assets/styles/components/DashboardAdminGridStyles';
import ActionSection from './Action/ActionSection';
import ClientSection from './Client/ClientSection';
import ModuleSection from './Modules/ModuleSection';

type DashboardAdminGridProps = {
  searchText: string;
};

function DashboardAdminGrid(props: DashboardAdminGridProps): React.JSX.Element {
  const { searchText } = props;

  const [clients, setClients] = useState<IUser[]>([]);
  const [passwordResetAction, setPasswordResetAction] = useState<IActionItem>();
  const [messagesAction, setMessagesAction] = useState<IActionItem>();
  const [surveysAction, setSurveysAction] = useState<IActionItem>();

  const clientsFiltered = clients.filter(client =>
    client.username?.toLowerCase().includes(searchText?.toLowerCase()),
  );

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentUser } = useAppSelector((state: RootState) => state.users);
  const { clientListCount, passwordResetTokenCount } = useAppSelector((state: RootState) => state.appState);
  const { smqSurveysListCount } = useAppSelector((state: RootState) => state.smq);
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  // Asynchronous Methods
  async function loadClients() {
    try {
      const apiClients = await UserService.getInstance().getClients(token);
      setClients(apiClients); 
    } catch (error) {
      console.log('Error loading clients', error);
    }
  }

  async function loadActions() {
    await loadPasswordReset();
    await loadChatMessages();
    await loadSurveys();
  }

  async function loadPasswordReset() {
    try {
      const passwordsToReset = await PasswordResetService.getInstance().getAll(token);
      if (passwordsToReset.length === 0) {
        setPasswordResetAction(undefined);
      } else {
        const resetAction: IActionItem = {
          id: '1',
          number: passwordsToReset.length,
          name: t('dashboard.sections.actions.passwordsToReset'),
          screenDestination: NavigationRoutes.PasswordResetScreen,
        }
        setPasswordResetAction(resetAction);
      }
    } catch (error) {
      console.log('Error loading password reset tokens', error);
    }
  }

  async function loadChatMessages() {
    if (currentUser) {
      try {
        const messages = await MessageService.getInstance().getReceivedMessagesForUser(currentUser.id as string, token);
        if (messages.length === 0) {
          setMessagesAction(undefined);
        } else {
          const messageAction: IActionItem = {
            id: '2',
            number: messages.length,
            name: t('dashboard.sections.actions.messages'),
            screenDestination: NavigationRoutes.MessagesScreen,
          }
          setMessagesAction(messageAction);
        }
      } catch (error) {
        console.log('Error loading messages', error );
      }
    }
  }

  async function loadSurveys() {
    try {
      const surveys = await SurveyService.getInstance().getAll(token);
      if (surveys.length === 0) {
        setSurveysAction(undefined);
      } else {
        const surveyAction: IActionItem = {
          id: '3',
          number: surveys.length,
          name: t('dashboard.sections.actions.surveys'),
          screenDestination: NavigationRoutes.SurveysScreen,
        }
        setSurveysAction(surveyAction);
        dispatch(setSMQSurveysListCount(surveys.length));
      }
    } catch (error) {
      console.log('Error loading surveys', error );
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadClients();
      await loadActions();
    }
    init();
  }, []);

  useEffect(() => {
    async function init() {
      await loadClients();
    }
    init();
  }, [clientListCount]);

  useEffect(() => {
    async function init() {
      await loadPasswordReset();
    }
    init();
  }, [passwordResetTokenCount]);

  useEffect(() => {
    async function init() {
      await loadSurveys();
    }
    init();
  }, [smqSurveysListCount]);

  // Components
  return (
    <ScrollView style={styles.container}>
      <ActionSection
        passwordResetAction={passwordResetAction}
        messagesAction={messagesAction}
        surveysAction={surveysAction}
      />
      <ModuleSection />
      <ClientSection clientsFiltered={clientsFiltered}/>
    </ScrollView>
  );
}

export default DashboardAdminGrid;