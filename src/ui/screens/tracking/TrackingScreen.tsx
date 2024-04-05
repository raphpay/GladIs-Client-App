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
import Utils from '../../../business-logic/utils/Utils';

import AppContainer from '../../components/AppContainer';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import Grid from '../../components/Grid';
import Pagination from '../../components/Pagination';
import Toast from '../../components/Toast';

import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/tracking/TrackingScreenStyles';

type TrackingScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.TrackingScreen>;

function TrackingScreen(props: TrackingScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);
  
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
  ];

  // Sync Methods
  function navigateBack() {
    navigation.goBack();
  }

  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  // Async Methods
  async function loadPaginatedLogs() {
    try {
      setIsLoading(true);
      const logs = await DocumentActivityLogsService.getInstance().getPaginatedLogsForClient(currentClient?.id, token, currentPage);
      setLogs(logs);
      setIsLoading(false);
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(t(`errors.api.${errorMessage}`), true);
    }
  }

  async function loadLogsForClient() {
    try {
      const totalLogs = await DocumentActivityLogsService.getInstance().getLogsForClient(currentClient?.id, token);
      setTotalPages(Math.ceil(totalLogs.length / 5));
      const initialLogsToShow = totalLogs.slice(0, 5);
      setLogs(initialLogsToShow);
      setIsLoading(false);
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(t(`errors.api.${errorMessage}`), true);
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadPaginatedLogs(); 
    }
    init();
  }, [currentPage]);

  useEffect(() => {
    async function init() {
      await loadLogsForClient();
    }
    init();
  }, []);

  // Components
  function ToastContent() {
    return (
      <>
        {
          showToast && (
            <Toast
              message={toastMessage}
              isVisible={showToast}
              setIsVisible={setShowToast}
              isShowingError={toastIsShowingError}
            />
          )
        }
      </>
    )
  }

  function LogGridItem(item: IDocumentActivityLog) {
    const actorName = item.actorIsAdmin ? 'MD Consulting' : item.actorUsername;
    const itemDate = new Date(item.actionDate)
    const formattedDate = itemDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const dateText = `${t(`tracking.actions.${item.action}`)} ${formattedDate}`
    const hours = itemDate.getHours();
    const minutes = Utils.formatWithLeadingZero(itemDate.getMinutes());
    const seconds = Utils.formatWithLeadingZero(itemDate.getSeconds());
    const hourText = `${hours}:${minutes}:${seconds}`

    return (
      <TouchableOpacity style={styles.logContainer}>
        <View style={styles.logContainer}>
          <Text style={styles.logName}>{item.name }</Text>
          <Text style={styles.actor}>{actorName}</Text>
          <Text style={styles.date}>{dateText} {t('tracking.at')} {hourText}</Text>
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
    <>
      <AppContainer
        mainTitle={t('modules.tracking')}
        searchText={searchText}
        setSearchText={setSearchText}
        showBackButton={true}
        showSearchText={true}
        showSettings={true}
        navigateBack={navigateBack}
        navigationHistoryItems={navigationHistoryItems}
        additionalComponent={
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        }
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
      {ToastContent()}
    </>
  );
}

export default TrackingScreen;