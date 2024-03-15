import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import IPendingUser from '../../../business-logic/model/IPendingUser';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PendingUserStatus from '../../../business-logic/model/enums/PendingUserStatus';

import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/clientManagement/PendingUserRowStyles';

type PendingUserRowProps = {
  pendingUser: IPendingUser;
  loadPendingUsers: () => Promise<void>;
  setSelectedPendingUser: React.Dispatch<React.SetStateAction<IPendingUser | undefined>>;
  setShowPendingUserDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

function PendingUserRow(props: PendingUserRowProps): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const {
    pendingUser,
    loadPendingUsers,
    setSelectedPendingUser,
    setShowPendingUserDialog
  } = props;

  const statusColors = {
    pending: Colors.warning,
    inReview: Colors.primary,
    accepted: Colors.green,
    rejected: Colors.danger,
  };

  const getStatusColor = (status: PendingUserStatus) => {
    return statusColors[status] || 'gray'; // Default color if status is not found
  };
  
  const color = getStatusColor(pendingUser.status);
  const userFullName = `${pendingUser.lastName.toUpperCase()} ${pendingUser.firstName}`;
  const ellipsisIcon = require('../../assets/images/ellipsis.png');
  
  function navigateToSpecificClientCreation(client: IPendingUser) {
    navigation.navigate(NavigationRoutes.ClientCreationScreen, { pendingUser: client, loadPendingUsers });
  }

  function tapOnOptions() {
    setShowPendingUserDialog(true);
    setSelectedPendingUser(pendingUser);
  }

  return (
    <View style={styles.rowContainer}>
      <TouchableOpacity style={styles.leftContainer} onPress={() => navigateToSpecificClientCreation(pendingUser)}>
        <View style={styles.status}>
          <View style={[styles.circle, { backgroundColor: color}]}/>
          <Text style={styles.statusText}>{t(`pendingUserManagement.status.${pendingUser.status}`)}</Text>
        </View>
        <View>
          <Text style={styles.companyName}>{pendingUser.companyName}</Text>
          <Text style={styles.userFullName}>{userFullName}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tooltipIconContainer} onPress={tapOnOptions}>
        <Image style={styles.ellipsisIcon} source={ellipsisIcon}/>
      </TouchableOpacity>
    </View>
  );
}

export default PendingUserRow;