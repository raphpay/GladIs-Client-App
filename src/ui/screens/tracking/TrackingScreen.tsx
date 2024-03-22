import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import IAction from '../../../business-logic/model/IAction';
import IDocumentActivityLog from '../../../business-logic/model/IDocumentActivityLog';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import DocumentActivityLogsService from '../../../business-logic/services/DocumentActivityLogsService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import AppContainer from '../../components/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Grid from '../../components/Grid';

import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/tracking/TrackingScreenStyles';

type TrackingScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.TrackingScreen>;

function TrackingScreen(props: TrackingScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { navigation } = props;
  
  const { t } = useTranslation();
  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const { token } = useAppSelector((state: RootState) => state.tokens);

  const clipboardIcon = require('../../assets/images/list.clipboard.png');

  const [logs, setLogs] = useState<IDocumentActivityLog[]>([]);
  const logsFiltered = logs.filter(log =>
    log.name.toLowerCase().includes(searchText.toLowerCase()),
  );
  const navigationHistoryItems: IAction[] = [
    {
      title: t('dashboard.title'),
      onPress: () => navigateBack()
    }
  ]


  function navigateBack() {
    navigation.goBack();
  }

  useEffect(() => {
    async function init() {
      const clientLogs = await DocumentActivityLogsService.getInstance().getLogsForClient(currentClient?.id, token);
      setLogs(clientLogs.reverse());
      setIsLoading(false);
    }
    init();
  }, []);

  function LogGridItem(item: IDocumentActivityLog) {
    const actorName = item.actorIsAdmin ? 'MD Consulting' : item.actorUsername;
    const itemDate = new Date(item.actionDate)
    const formattedDate = itemDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const dateText = `${t(`tracking.actions.${item.action}`)} ${formattedDate}`

    return (
      <TouchableOpacity style={styles.logContainer}>
        <View style={styles.logContainer}>
          <Text style={styles.logName}>{item.name }</Text>
          <Text style={styles.actor}>{actorName}</Text>
          <Text style={styles.date}>{dateText}</Text>
        </View>
        <View style={styles.separator} />
      </TouchableOpacity>
    );
  }

  function LogGrid() {
    return (
      <>
        {
          logsFiltered && logsFiltered.length === 0 ? (
            <ContentUnavailableView
              title={t('tracking.noLogs.title')}
              message={t('tracking.noLogs.message')}
              image={clipboardIcon}
            />
          ) : (
            <Grid
              data={logsFiltered}
              renderItem={(renderItem) => LogGridItem(renderItem.item)}
            />
          )
        }
      </>
    )
  }

  return (
    <AppContainer
      mainTitle={t('modules.tracking')}
      searchText={searchText}
      setSearchText={setSearchText}
      showBackButton={true}
      showSearchText={true}
      showSettings={true}
      navigateBack={navigateBack}
      navigationHistoryItems={navigationHistoryItems}
    >
      <>
        {
          isLoading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            LogGrid()
          )
        }
      </>
    </AppContainer>
  );
}

export default TrackingScreen;