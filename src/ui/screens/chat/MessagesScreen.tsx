import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import { IRootStackParams } from '../../../navigation/Routes';

import { IMessage, IMessageInput, IUserID } from '../../../business-logic/model/IMessage';
import IUser from '../../../business-logic/model/IUser';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import MessageService from '../../../business-logic/services/MessageService';
import UserService from '../../../business-logic/services/UserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import Utils from '../../../business-logic/utils/Utils';

import AppContainer from '../../components/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Dialog from '../../components/Dialog';
import ExpandingTextInput from '../../components/ExpandingTextInput';
import GladisTextInput from '../../components/GladisTextInput';
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
  const [messageReceiver, setMessageReceiver] = useState<string>('');
  const [messageTitle, setMessageTitle] = useState<string>('');
  const [messageContent, setMessageContent] = useState<string>('');
  const [charactersLeft, setCharactersLeft] = useState<number>(300);

  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { currentUser } = useAppSelector((state: RootState) => state.users);

  const { t } = useTranslation();

  const { navigation } = props;

  const isFormFilled = messageReceiver.length > 0 && messageTitle.length > 0 && messageContent.length > 0;

  // Synchronous Methods
  function navigateBack() {
    navigation.goBack();
  }

  function displayMessageDialog() {
    setShowNewMessageDialog(true);
  }

  function resetDialogs() {
    setShowNewMessageDialog(false);
    setMessageReceiver('');
    setMessageTitle('');
    setMessageContent('');
  }

  function onMessageContentChange(text: string) {
    setMessageContent(text);
    setCharactersLeft(300 - text.length);
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

  async function sendMessage() {
    // Get user by mail
    let receiver: IUser | undefined;
    try {
      receiver = await UserService.getInstance().getUserByEmail(messageReceiver, token);
    } catch (error) {
      // TODO: Handle error
      console.log('error');
    }

    if (receiver && currentUser) {
      // Create message
      const senderID: IUserID = { id: currentUser.id as string };
      const receiverID: IUserID = { id: receiver.id as string };
      const message: IMessageInput = {
        title: messageTitle,
        content: messageContent,
        senderID: senderID.id,
        senderMail: currentUser.email,
        receiverID: receiverID.id,
        receiverMail: receiver.email
      }

      // Send message
      try {
        const newMessage = await MessageService.getInstance().sendMessage(message, token);
        setMessages([...messages, newMessage]);
        resetDialogs();
      } catch (error) {
        // TODO: Handle error
        console.log('error');
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
  // TODO: Correct key prop
  // TODO: Extract to separate componentxs
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
              onConfirm={sendMessage}
              isConfirmDisabled={!isFormFilled}
              isCancelAvailable={true}
              onCancel={resetDialogs}
            >
              <>
                <GladisTextInput
                  value={messageReceiver}
                  onValueChange={setMessageReceiver}
                  placeholder={t('chat.dialog.messageReceiverPlaceholder')}
                />
                <GladisTextInput
                  value={messageTitle}
                  onValueChange={setMessageTitle}
                  placeholder={t('chat.dialog.messageTitlePlaceholder')}
                />
                <ExpandingTextInput
                  text={messageContent}
                  setText={onMessageContentChange}
                  placeholder={t('chat.dialog.messageContentPlaceholder')}
                />
                <View style={styles.charactersCount}>
                  <Text style={styles.charactersCountText}>{t('chat.dialog.charactersLeft')}: {charactersLeft}</Text>
                </View>
              </>
            </Dialog>
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