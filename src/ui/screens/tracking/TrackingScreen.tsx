import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity } from 'react-native';

import IDocumentActivityLog from '../../../business-logic/model/IDocumentActivityLog';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import DocumentActivityLogsService from '../../../business-logic/services/DocumentActivityLogsService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import { IRootStackParams } from '../../../navigation/Routes';

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
      setLogs(clientLogs);
    }
    init();
  }, []);

  // TODO: Style this item
  function LogFlatListItem(item: IDocumentActivityLog) {
    return (
      <TouchableOpacity>
        <Text>item = {item.name}</Text>
        <Text>action= {item.action}</Text>
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