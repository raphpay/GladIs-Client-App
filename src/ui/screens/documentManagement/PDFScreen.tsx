import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, SafeAreaView } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import PDFScreenManager from '../../../business-logic/manager/documentManagement/PDFScreenManager';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import CacheService from '../../../business-logic/services/CacheService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import Utils from '../../../business-logic/utils/Utils';

import IconButton from '../../components/Buttons/IconButton';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import PDFViewer from '../../components/nativeComponents/PDFViewer';
import Toast from '../../components/Toast';

import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/documentManagement/PDFScreenStyles';

type PDFScreenProps = NativeStackScreenProps<
  IRootStackParams,
  NavigationRoutes.PDFScreen
>;

function PDFScreen(props: PDFScreenProps): React.JSX.Element {
  // General
  const [searchText, setSearchText] = useState<string>('');
  const [pdfData, setPDFData] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastIsShowingError, setToastIsShowingError] =
    useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Props
  const { navigation } = props;
  const { documentInputs, originalDocument } = props.route.params;
  // Hooks
  const { token } = useAppSelector((state: RootState) => state.tokens);
  const { t } = useTranslation();
  // Images
  const docIcon = require('../../assets/images/doc.fill.png');
  const backIcon = require('../../assets/images/arrowshape.turn.up.left.png');

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
  async function loadFromAPI() {
    let data: string[] = [];
    try {
      const docData = await PDFScreenManager.getInstance().downloadDocument(
        originalDocument.id,
        token,
      );
      const sanitizedData = Utils.removeBase64Prefix(docData);
      data = await PDFScreenManager.getInstance().splitPDF(sanitizedData);
    } catch (error) {}
    await PDFScreenManager.getInstance().cacheDownloadedData(
      originalDocument,
      data,
    );
    setPDFData(data);
    setIsLoading(false);
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      let cachedData = null;
      try {
        cachedData = await CacheService.getInstance().retrieveValue(
          originalDocument.id as string,
        );
      } catch (error) {
        console.log('error getting cached data', error);
      }
      if (cachedData === null || cachedData === undefined) {
        await loadFromAPI();
      } else {
        setPDFData(cachedData as string[]);
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Components
  function ToastContent() {
    return (
      <>
        {showToast && (
          <Toast
            message={toastMessage}
            isVisible={showToast}
            setIsVisible={setShowToast}
            isShowingError={toastIsShowingError}
          />
        )}
      </>
    );
  }

  function PDFView() {
    return (
      <>
        {pdfData ? (
          <PDFViewer pdfPages={pdfData} />
        ) : (
          <ContentUnavailableView
            title={t('document.noDocumentFound.title')}
            message={t('document.noDocumentFound.message')}
            image={docIcon}
          />
        )}
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        PDFView()
      )}
      <IconButton
        title={t('components.buttons.back')}
        icon={backIcon}
        onPress={navigateBack}
        style={styles.backButton}
      />
      {ToastContent()}
    </SafeAreaView>
  );
}

export default PDFScreen;
