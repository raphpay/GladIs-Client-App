import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { IActionItem } from '../../../business-logic/model/IAction';
import IModule from '../../../business-logic/model/IModule';
import IUser from '../../../business-logic/model/IUser';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import MessageService from '../../../business-logic/services/MessageService';
import PasswordResetService from '../../../business-logic/services/PasswordResetService';
import UserService from '../../../business-logic/services/UserService';
import { useAppDispatch, useAppSelector } from '../../../business-logic/store/hooks';
import { setCurrentClient } from '../../../business-logic/store/slices/userReducer';
import { RootState } from '../../../business-logic/store/store';

import ContentUnavailableView from '../ContentUnavailableView';
import Grid from '../Grid';
import GridClientItem from '../GridClientItem';

import styles from '../../assets/styles/components/DashboardAdminGridStyles';
import GridModuleItem from '../GridModuleItem';
import ActionSection from './Action/ActionSection';

type DashboardAdminGridProps = {
  searchText: string;
};

function DashboardAdminGrid(props: DashboardAdminGridProps): React.JSX.Element {
  const { searchText } = props;

  const clipboardIcon = require('../../assets/images/list.clipboard.png');

  const [clients, setClients] = useState<IUser[]>([]);
  const [passwordResetAction, setPasswordResetAction] = useState<IActionItem>();
  const [messagesAction, setMessagesAction] = useState<IActionItem>();

  const clientsFiltered = clients.filter(client =>
    client.username?.toLowerCase().includes(searchText?.toLowerCase()),
  );

  const navigation = useNavigation();
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentUser } = useAppSelector((state: RootState) => state.users);
  const { clientListCount, passwordResetTokenCount } = useAppSelector((state: RootState) => state.appState);
  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const modules: IModule[] = [
    {
      id: '1',
      name: 'reminders',
      index: 1,
    },
    {
      id: '2',
      name: 'chat',
      index: 2,
    },
  ];

  // Synchronous Methods
  function navigateToClientDashboard(client: IUser) {
    dispatch(setCurrentClient(client));
    navigation.navigate(NavigationRoutes.ClientDashboardScreenFromAdmin)
  }

  function navigateToModule(module: IModule) {
    switch (module.name) {
      case 'reminders':
        navigation.navigate(NavigationRoutes.RemindersScreen);
        break;
      case 'chat':
        navigation.navigate(NavigationRoutes.MessagesScreen);
        break;
      default:
        break;
    }
  }

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

  // Components
  function ModulesSection() {
    return (
      <View style={styles.clientSectionContainer}>
        <Text style={styles.sectionTitle}>{t('dashboard.sections.modules')}</Text>
        <View style={styles.separator}/>
        <Grid
          data={modules}
          scrollEnabled={false}
          renderItem={(renderItem) => 
            <GridModuleItem 
              module={renderItem.item}
              onPress={navigateToModule}
            />
          }
        />
      </View>
    );
  }

  function ClientSection() {
    return (
      <View style={styles.clientSectionContainer}>
        <Text style={styles.sectionTitle}>{t('dashboard.sections.clients')}</Text>
        <View style={styles.separator}/>
        {
          clientsFiltered.length === 0 ? (
            <ContentUnavailableView
              title={t('dashboard.noClients.title')}
              message={t('dashboard.noClients.message')}
              image={clipboardIcon}
            />
            ) : (
            <Grid
              data={clientsFiltered}
              scrollEnabled={false}
              renderItem={(renderItem) => 
                <GridClientItem
                  client={renderItem.item} 
                  onPress={() => navigateToClientDashboard(renderItem.item)}
                />
              }
            />
          )
        }
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <ActionSection
        passwordResetAction={passwordResetAction}
        messagesAction={messagesAction}
      />
      {ModulesSection()}
      {ClientSection()}
    </ScrollView>
  );
}

export default DashboardAdminGrid;