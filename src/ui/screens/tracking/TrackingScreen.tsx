import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import IDocumentActivityLog from '../../../business-logic/model/IDocumentActivityLog';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import DocumentActivityLogsService from '../../../business-logic/services/DocumentActivityLogsService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IRootStackParams } from '../../../navigation/Routes';

import styles from '../../assets/styles/tracking/TrackingScreenStyles';
import AppContainer from '../../components/AppContainer';

type TrackingScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.TrackingScreen>;

function TrackingScreen(props: TrackingScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const { t } = useTranslation();
  const { navigation } = props;
  const { currentClient } = useAppSelector((state: RootState) => state.users);
  const [logs, setLogs] = useState<IDocumentActivityLog[]>([]);
  const logsFiltered = logs.filter(log =>
    log.name.toLowerCase().includes(searchText.toLowerCase()),
  );
  function navigateBack() {
    navigation.goBack();
  }

  useEffect(() => {
    async function init() {
      const clientLogs = await DocumentActivityLogsService.getInstance().getLogsForClient(currentClient?.id);
      setLogs(clientLogs.reverse());
    }
    init();
  }, []);

  function LogFlatListItem(item: IDocumentActivityLog) {
    const actorName = item.actorIsAdmin ? 'MD Consulting' : item.actorUsername;
    const itemDate = new Date(item.actionDate)
    const formattedDate = itemDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const dateText = `${t(`tracking.actions.${item.action}`)} ${formattedDate}`

    return (
      <TouchableOpacity>
        <View style={styles.logContainer}>
          <Text style={styles.logName}>{item.name}</Text>
          <Text style={styles.actor}>{actorName}</Text>
          <Text style={styles.date}>{dateText}</Text>
        </View>
        <View style={styles.separator} />
      </TouchableOpacity>
    );
  }

  return (
    <AppContainer
      mainTitle={t('modules.tracking')}
      searchText={searchText}
      setSearchText={setSearchText}
      showBackButton={true}
      navigateBack={navigateBack}
    >
      <FlatList
        data={logsFiltered}
        renderItem={(renderItem) => LogFlatListItem(renderItem.item)}
        keyExtractor={(item) => item.id}
      />
    </AppContainer>
  );
}

export default TrackingScreen;