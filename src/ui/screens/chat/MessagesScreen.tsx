import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { IRootStackParams } from '../../../navigation/Routes';

import { IMessage } from '../../../business-logic/model/IMessage';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import MessageService from '../../../business-logic/services/MessageService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import Utils from '../../../business-logic/utils/Utils';

import AppContainer from '../../components/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';

import styles from '../../assets/styles/chat/MessagesScreenStyles';

type MessagesScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.MessagesScreen>;

function MessagesScreen(props: MessagesScreenProps): React.JSX.Element {

  const messageIcon = require('../../assets/images/message.fill.png');
  const sentIcon = require('../../assets/images/arrow.up.right.png');
  const receivedIcon = require('../../assets/images/arrow.down.left.png');

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

  function MessageRow(message: IMessage, index: number) {
    const date = new Date(message.dateSent);
    const formattedDate = Utils.formatDate(date);
  
    const isMessageFromCurrentUser = message.sender.id === currentUser?.id;
    const emailToDisplay = isMessageFromCurrentUser ? message.receiverMail : message.senderMail;
    const arrowIcon = isMessageFromCurrentUser ? sentIcon : receivedIcon;
  
    return (
      <View>
        <View key={message.id} style={styles.row}>
          <Text style={[styles.cell, styles.messageCellText, styles.narrowCell]}>{index + 1}</Text>
          <Text style={[styles.cell, styles.messageCellText, styles.wideCell]}>{message.title}</Text>
          <Text style={[styles.cell, styles.messageCellText, styles.wideCell]}>{formattedDate}</Text>
          <Text style={[styles.cell, styles.messageCellText, styles.wideCell]}>{emailToDisplay}</Text>
          <View style={styles.iconCell}>
            <Image source={arrowIcon} style={styles.arrowIcon}/>
          </View>
        </View>
        <View style={styles.separator}/>
      </View>
    );
  }

  // TODO: Add translations
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
                <Text style={[styles.cell, styles.headerCell, styles.narrowCell]}>#</Text>
                <Text style={[styles.cell, styles.headerCell, styles.wideCell]}>Title</Text>
                <Text style={[styles.cell, styles.headerCell, styles.wideCell]}>Date Sent</Text>
                <Text style={[styles.cell, styles.headerCell, styles.wideCell]}>User Mail</Text>
              </View>
              {messages.map((message, index) => (
                MessageRow(message, index)
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