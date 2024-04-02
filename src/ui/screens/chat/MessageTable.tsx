import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { IMessage } from '../../../business-logic/model/IMessage';

import ContentUnavailableView from '../../components/ContentUnavailableView';
import MessageRow from './MessageRow';

import styles from '../../assets/styles/chat/MessagesScreenStyles';

type MessageTableProps = {
  messages: IMessage[];
  onMessageSelection: (message: IMessage) => void;
};

function MessageTable(props: MessageTableProps): React.JSX.Element {

  const { messages, onMessageSelection } = props;

  const messageIcon = require('../../assets/images/message.fill.png');

  const { t } = useTranslation();

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
            <ScrollView style={styles.scrollView}>
              {messages.map((message, index) => (
                <MessageRow onMessageSelection={onMessageSelection} message={message} index={index} key={message.id} />
              ))}
            </ScrollView>
          </View>
        )
      }
    </>
  );
}

export default MessageTable;