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
import PendingUserService from '../../../business-logic/services/PendingUserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import Tooltip from '../../components/Tooltip';

import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/clientManagement/PendingUserRowStyles';

type PendingUserRowProps = {
  pendingUser: IPendingUser;
  isTooltipVisible: boolean;
  setIsTooltipVisible: React.Dispatch<React.SetStateAction<boolean>>;
  updateFlatList: () => Promise<void>;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPendingUser: React.Dispatch<React.SetStateAction<IPendingUser | undefined>>;
};

function PendingUserRow(props: PendingUserRowProps): React.JSX.Element {
  const { t } = useTranslation();
  const navigation = useNavigation()
  const {
    pendingUser,
    isTooltipVisible,
    setIsTooltipVisible,
    updateFlatList,
    setShowDialog,
    setSelectedPendingUser,
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
  const { token } = useAppSelector((state: RootState) => state.tokens);

  function navigateToSpecificClientCreation(client: IPendingUser) {
    navigation.navigate(NavigationRoutes.ClientCreationScreen, { pendingUser: client });
  }

  async function updatePendingUserStatus(pendingUser: IPendingUser, status: PendingUserStatus) {
    await PendingUserService.getInstance().updatePendingUserStatus(pendingUser, token, status);
    setIsTooltipVisible(!isTooltipVisible);
    // Update the flatlist
    await updateFlatList()
  }

  function showAlert() {
    setIsTooltipVisible(false);
    setSelectedPendingUser(pendingUser);
    setShowDialog(true);
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
      <Tooltip
        isVisible={isTooltipVisible}
        setIsVisible={setIsTooltipVisible}
        children={(
          <View style={styles.tooltipIconContainer}>
            <Image source={require('../../assets/images/ellipsis.png')}/>
          </View>
        )}
        popover={(
          <View style={styles.popover}>
            <TouchableOpacity style={styles.popoverButton} onPress={() => navigateToSpecificClientCreation(pendingUser)}>
              <Text style={styles.tooltipButtonText}>{t('components.tooltip.open')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popoverButton} onPress={() => updatePendingUserStatus(pendingUser, PendingUserStatus.pending)}>
              <Text style={styles.tooltipButtonText}>{t('components.tooltip.pendingUserManagement.status.pending')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popoverButton} onPress={() => updatePendingUserStatus(pendingUser, PendingUserStatus.inReview)}>
              <Text style={styles.tooltipButtonText}>{t('components.tooltip.pendingUserManagement.status.inReview')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popoverButton} onPress={() => updatePendingUserStatus(pendingUser, PendingUserStatus.rejected)}>
              <Text style={styles.tooltipButtonText}>{t('components.tooltip.pendingUserManagement.status.rejected')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popoverButton} onPress={() => updatePendingUserStatus(pendingUser, PendingUserStatus.rejected)}>
              <Text style={styles.tooltipButtonText}>{t('components.tooltip.pendingUserManagement.status.rejected')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popoverButton} onPress={showAlert}>
              <Text style={styles.tooltipButtonText}>{t('components.tooltip.pendingUserManagement.delete')}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

export default PendingUserRow;