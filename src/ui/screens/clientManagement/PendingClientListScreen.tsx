import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

import IPendingUser from '../../../business-logic/model/IPendingUser';
import IToken from '../../../business-logic/model/IToken';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import PendingUserStatus from '../../../business-logic/model/enums/PendingUserStatus';
import PendingUserService from '../../../business-logic/services/PendingUserService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IClientManagementParams } from '../../../navigation/Routes';

import AppContainer from '../../components/AppContainer';
import IconButton from '../../components/IconButton';
import Tooltip from '../../components/Tooltip';

import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/clientManagement/PendingClientListScreenStyles';

type PendingClientListScreenProps = NativeStackScreenProps<IClientManagementParams, NavigationRoutes.PendingClientListScreen>;

function PendingClientListScreen(props: PendingClientListScreenProps): React.JSX.Element {
  const [pendingUsers, setPendingUsers] = useState<IPendingUser[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  // TODO: Make this available everywhere on the component
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
  // TODO: Change all plus icons to remove the warning
  const plusIcon = require('../../assets/images/plus.png');
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { t } = useTranslation();
  // TODO: filter pending users

  const { navigation } = props;

  function navigateToCreateClient() {
    navigation.navigate(NavigationRoutes.ClientCreationScreen, { pendingUser: null });
  }

  function navigateToSpecificClientCreation(client: IPendingUser) {
    navigation.navigate(NavigationRoutes.ClientCreationScreen, { pendingUser: client });
  }

  function navigateBack() {
    navigation.goBack();
  }

  async function updatePendingUserStatus(pendingUser: IPendingUser, status: PendingUserStatus) {
    await PendingUserService.getInstance().updatePendingUserStatus(pendingUser, token, status);
    setIsTooltipVisible(!isTooltipVisible);
  }

  useEffect(() => {
    async function init() {
      const castedToken = token as IToken;
      const users = await PendingUserService.getInstance().getUsers(castedToken);
      setPendingUsers(users);
    }
    init();
  }, []);

  function PendinguserRow(item: IPendingUser) {
    const statusColors = {
      pending: Colors.warning,
      inReview: Colors.primary,
      accepted: Colors.green,
      rejected: Colors.danger,
    };
    
    const getStatusColor = (status: PendingUserStatus) => {
      return statusColors[status] || 'gray'; // Default color if status is not found
    };
    
    const status = PendingUserStatus.pending;
    const color = getStatusColor(status);
    const userFullName = `${item.lastName.toUpperCase()} ${item.firstName}`;

    // TODO: Change the circle color and the title
    return (
      <View>
        <View style={styles.rowContainer}>
          <TouchableOpacity style={styles.leftContainer} onPress={() => navigateToSpecificClientCreation(item)}>
            <View style={styles.status}>
              <View style={[styles.circle, { backgroundColor: color}]}/>
              <Text style={styles.statusText}>{t(`pendingUserManagement.status.${item.status}`)}</Text>
            </View>
            <View>
              <Text style={styles.companyName}>{item.companyName}</Text>
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
                <TouchableOpacity style={styles.popoverButton} onPress={() => navigateToSpecificClientCreation(item)}>
                  <Text>{t('components.tooltip.open')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.popoverButton} onPress={() => updatePendingUserStatus(item, PendingUserStatus.pending)}>
                  <Text>{t('components.tooltip.status.pending')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.popoverButton} onPress={() => updatePendingUserStatus(item, PendingUserStatus.inReview)}>
                  <Text>{t('components.tooltip.status.inReview')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.popoverButton} onPress={() => updatePendingUserStatus(item, PendingUserStatus.rejected)}>
                  <Text>{t('components.tooltip.status.rejected')}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    )
  }

  // TODO: translate the title
  return (
    <AppContainer
      mainTitle='Liste de clients'
      searchText={searchText}
      setSearchText={setSearchText}
      showBackButton={true}
      navigateBack={navigateBack}
      hideTooltip={() => setIsTooltipVisible(false)}
      adminButton={
        <IconButton
          title={t('components.buttons.addClient')}
          icon={plusIcon}
          onPress={navigateToCreateClient}
        />
      }
    >
      <FlatList
        data={pendingUsers}
        renderItem={(renderItem) => PendinguserRow(renderItem.item)}
      />
    </AppContainer>
  );
}

export default PendingClientListScreen;