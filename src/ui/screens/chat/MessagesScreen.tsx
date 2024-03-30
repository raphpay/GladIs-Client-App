import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { IMessage } from '../../../business-logic/model/IMessage';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import MessageService from '../../../business-logic/services/MessageService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';

import { IRootStackParams } from '../../../navigation/Routes';
import styles from '../../assets/styles/chat/MessagesScreenStyles';

type MessagesScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.MessagesScreen>;

function MessagesScreen(props: MessagesScreenProps): React.JSX.Element {

  const messageIcon = require('../../assets/images/message.fill.png');

  const [messages, setMessages] = useState<IMessage[]>([]);

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentUser } = useAppSelector((state: RootState) => state.users);

  const { navigation } = props;

  // Synchronous Methods
  function navigateBack() {
    navigation.goBack();
  }

  // Async Methods
  async function loadMessages() {
    if (currentUser) {
      try {
        const messages = await MessageService.getInstance().getMessagesForUser(currentUser.id as string, token);
        setMessages(messages);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadMessages();
    }
    init();
  }, []);

  // Components
  function MessageTable() {
    return (
      <>
        {
          messages.length === 0 ? (
            <ContentUnavailableView
              title='No Messages'
              message='You have no messages to display.'
              image={messageIcon}
            />
          ) : (
            <View style={styles.table}>
              <View style={styles.rowHeader}>
                <Text style={[styles.cell, styles.headerCell]}>#</Text>
                <Text style={[styles.cell, styles.headerCell]}>Title</Text>
                <Text style={[styles.cell, styles.headerCell]}>Date Sent</Text>
                <Text style={[styles.cell, styles.headerCell]}>Sender ID</Text>
              </View>
              {messages.map((message, index) => (
                <View key={message.id} style={styles.row}>
                  <Text style={styles.cell}>{index + 1}</Text>
                  <Text style={styles.cell}>{message.title}</Text>
                  {/* <Text style={styles.cell}>{message.dateSent.toLocaleDateString()}</Text> */}
                  <Text style={styles.cell}>{message.sender.id}</Text>
                </View>
              ))}
            </View>
          )
        }
      </>
    )
  }

  return (
    <AppContainer
      mainTitle='Messages'
      showSearchText={false}
      showSettings={true}
      showBackButton={true}
      navigateBack={navigateBack}
    >
      {MessageTable()}
    </AppContainer>
  );
}

export default MessagesScreen;