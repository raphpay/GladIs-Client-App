import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import Dialog from '../../components/Dialog';
import IconButton from '../../components/IconButton';

import styles from '../../assets/styles/chat/MessagesScreenStyles';

type MessagesScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.MessagesScreen>;

function MessagesScreen(props: MessagesScreenProps): React.JSX.Element {

  const messageIcon = require('../../assets/images/message.fill.png');
  const sentIcon = require('../../assets/images/arrow.up.right.png');
  const receivedIcon = require('../../assets/images/arrow.down.left.png');
  const plusIcon = require('../../assets/images/plus.png');

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState<boolean>(false);

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentUser } = useAppSelector((state: RootState) => state.users);

  const { t } = useTranslation();

  const { navigation } = props;

  // Synchronous Methods
  function navigateBack() {
    navigation.goBack();
  }

  function displayMessageDialog() {
    setShowNewMessageDialog(true);
  }

  function resetDialogs() {
    setShowNewMessageDialog(false);
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

  // Components
  function MessageTable() {
    return (
      <>
        {
          messages.length === 0 ? (
            <ContentUnavailableView
              title={t('chat.emptyState.title')}
              message={t('chat.emptyState.description')}
              image={messageIcon}
            />
          ) : (
            <View style={styles.table}>
              <View style={styles.rowHeader}>
                <Text style={[styles.cell, styles.headerCell, styles.narrowCell]}>#</Text>
                <Text style={[styles.cell, styles.headerCell, styles.wideCell]}>{t('chat.table.title')}</Text>
                <Text style={[styles.cell, styles.headerCell, styles.wideCell]}>{t('chat.table.dateSent')}</Text>
                <Text style={[styles.cell, styles.headerCell, styles.wideCell]}>{t('chat.table.userMail')}</Text>
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

  function AddMessageButton() {
    return (
      <IconButton
        title={t('chat.button.sendMessage')}
        icon={plusIcon}
        onPress={displayMessageDialog}
      />
    )
  }

  function NewMessageDialog() {
    return (
      <>
        {
          showNewMessageDialog && (
            <Dialog
              title={t('chat.button.sendMessage')}
              confirmTitle={t('chat.dialog.confirmButton')}
              isConfirmAvailable={true}
              onConfirm={resetDialogs}
              isCancelAvailable={true}
              onCancel={resetDialogs}
            />
          )
        }
      </>
    )
  }

  return (
    <>
      <AppContainer
        mainTitle={t('chat.title')}
        showSearchText={false}
        showSettings={true}
        showBackButton={true}
        navigateBack={navigateBack}
        adminButton={AddMessageButton()}
      >
        {MessageTable()}
      </AppContainer>
      {NewMessageDialog()}
    </>
  );
}

export default MessagesScreen;