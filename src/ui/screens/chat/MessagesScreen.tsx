import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
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
import Dialog from '../../components/Dialog';
import ExpandingTextInput from '../../components/ExpandingTextInput';
import GladisTextInput from '../../components/GladisTextInput';
import IconButton from '../../components/IconButton';
import Toast from '../../components/Toast';
import MessageTable from './MessageTable';

import styles from '../../assets/styles/chat/MessagesScreenStyles';

type MessagesScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.MessagesScreen>;

function MessagesScreen(props: MessagesScreenProps): React.JSX.Element {

  const plusIcon = require('../../assets/images/plus.png');

  const [messages, setMessages] = useState<IMessage[]>([]);
  // Dialog
  const [showNewMessageDialog, setShowNewMessageDialog] = useState<boolean>(false);
  const [showSingleMessageDialog, setShowSingleMessageDialog] = useState<boolean>(false);
  // Message
  const [messageReceiver, setMessageReceiver] = useState<string>('');
  const [messageTitle, setMessageTitle] = useState<string>('');
  const [messageContent, setMessageContent] = useState<string>('');
  const [charactersLeft, setCharactersLeft] = useState<number>(300);
  const [selectedMessage, setSelectedMessage] = useState<IMessage>();
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);

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
    setShowSingleMessageDialog(false);
    setMessageReceiver('');
    setMessageTitle('');
    setMessageContent('');
  }

  function onMessageContentChange(text: string) {
    setMessageContent(text);
    setCharactersLeft(300 - text.length);
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  function onMessageSelection(message: IMessage) {
    setSelectedMessage(message);
    setShowSingleMessageDialog(true);
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
      const errorKeys: string[] = error as string[];
      const errorTitle = Utils.handleErrorKeys(errorKeys);
      displayToast(t(`${errorTitle}`), true);
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
        const errorMessage = (error as Error).message;
        displayToast(t(`errors.api.${errorMessage}`), true);
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

  function SingleMessageDialog() {
    const isMessageFromCurrentUser = selectedMessage?.sender.id === currentUser?.id;
    const emailToDisplay = isMessageFromCurrentUser ? selectedMessage?.receiverMail : selectedMessage?.senderMail;
    const linkedWord = isMessageFromCurrentUser ? t('chat.dialog.to') : t('chat.dialog.from');
    const dialogTitle = `${t('chat.dialog.message')} ${linkedWord} ${emailToDisplay}`;

    return (
      <>
        {
          showSingleMessageDialog && (
            <Dialog
              title={dialogTitle}
              isConfirmAvailable={false}
              onConfirm={() => {}}
              isCancelAvailable={true}
              onCancel={resetDialogs}
            >
              <>
                <Text style={styles.messageTitle}>{selectedMessage?.title}</Text>
                <Text style={styles.messageContent}>{selectedMessage?.content}</Text>
              </>
            </Dialog>
          )
        }
      </>
    )
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
        mainTitle={t('chat.title')}
        showSearchText={false}
        showSettings={true}
        showBackButton={true}
        navigateBack={navigateBack}
        adminButton={AddMessageButton()}
      >
        <MessageTable messages={messages} onMessageSelection={onMessageSelection}/>
      </AppContainer>
      {NewMessageDialog()}
      {SingleMessageDialog()}
      {ToastContent()}
    </>
  );
}

export default MessagesScreen;