import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { IMessage } from '../../../business-logic/model/IMessage';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import DateUtils from '../../../business-logic/utils/DateUtils';

import styles from '../../assets/styles/chat/MessagesScreenStyles';

type MessageRowProps = {
  message: IMessage;
  index: number;
  onMessageSelection: (message: IMessage) => void;
};

function MessageRow(props: MessageRowProps): React.JSX.Element {
  const { message, index, onMessageSelection } = props;

  const { currentUser } = useAppSelector((state: RootState) => state.users);

  const sentIcon = require('../../assets/images/arrow.up.right.png');
  const receivedIcon = require('../../assets/images/arrow.down.left.png');

  const date = new Date(message.dateSent);
  const formattedDate = DateUtils.formatDate(date);

  const isMessageFromCurrentUser = message.sender.id === currentUser?.id;
  const emailToDisplay = isMessageFromCurrentUser
    ? message.receiverMail
    : message.senderMail;
  const arrowIcon = isMessageFromCurrentUser ? sentIcon : receivedIcon;

  return (
    <View key={message.id}>
      <TouchableOpacity
        onPress={() => onMessageSelection(message)}
        style={styles.row}>
        <Text style={[styles.cell, styles.messageCellText, styles.narrowCell]}>
          {index + 1}
        </Text>
        <Text style={[styles.cell, styles.messageCellText, styles.wideCell]}>
          {message.title}
        </Text>
        <Text style={[styles.cell, styles.messageCellText, styles.wideCell]}>
          {formattedDate}
        </Text>
        <Text style={[styles.cell, styles.messageCellText, styles.wideCell]}>
          {emailToDisplay}
        </Text>
        <View style={styles.iconCell}>
          <Image source={arrowIcon} style={styles.arrowIcon} />
        </View>
      </TouchableOpacity>
      <View style={styles.separator} />
    </View>
  );
}

export default MessageRow;
