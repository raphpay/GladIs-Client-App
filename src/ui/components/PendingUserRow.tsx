import React from 'react';
import {
  Text,
  View
} from 'react-native';

import IPendingUser from '../../business-logic/model/IPendingUser';

type PendingUserRowProps = {
  pendingUser: IPendingUser;
};

function PendingUserRow(props: PendingUserRowProps): React.JSX.Element {

  const { pendingUser } = props;

  return (
    <View>
      <Text>
        {pendingUser.lastName}
      </Text>
    </View>
  );
}

export default PendingUserRow;