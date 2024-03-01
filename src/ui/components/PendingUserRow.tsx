import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import IPendingUser from '../../business-logic/model/IPendingUser';

import styles from '../assets/styles/components/PendingUserRowStyles';

type PendingUserRowProps = {
  pendingUser: IPendingUser;
  onUserSelect: (user: IPendingUser) => void;
};

// TODO: Style row
function PendingUserRow(props: PendingUserRowProps): React.JSX.Element {

  const { pendingUser, onUserSelect } = props;

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.circle}/>
        <View style={styles.textContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.textName}>
              {pendingUser.lastName.toUpperCase()}
            </Text>
            <Text style={styles.textName}>
              {pendingUser.firstName}
            </Text>
          </View>
          <Text>
            {pendingUser.companyName}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => onUserSelect(pendingUser)}>
        <Image source={require('../assets/images/ellipsis.png')}/>
      </TouchableOpacity>
    </View>
  );
}

export default PendingUserRow;