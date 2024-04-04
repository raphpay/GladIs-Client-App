import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import Pdf from 'react-native-pdf';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import CacheService from '../../../business-logic/services/CacheService';
import DocumentService from '../../../business-logic/services/DocumentService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import Utils from '../../../business-logic/utils/Utils';

import ContentUnavailableView from '../../components/ContentUnavailableView';
import IconButton from '../../components/IconButton';
import Toast from '../../components/Toast';

import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/documentManagement/PDFScreenStyles';

type PDFScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.PDFScreen>;

function PDFScreen(props: PDFScreenProps): React.JSX.Element {

  const [pdfData, setPDFData] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Toast
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastIsShowingError, setToastIsShowingError] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const { navigation } = props;
  const { documentInput } = props.route.params;
  const { t } = useTranslation();
  const { token } = useAppSelector((state: RootState) => state.tokens);

  const docIcon = require('../../assets/images/doc.fill.png');
  const backIcon = require('../../assets/images/arrowshape.turn.up.left.png');

  // Sync Methods
  function displayToast(message: string, isError: boolean = false) {
    setShowToast(true);
    setToastIsShowingError(isError);
    setToastMessage(message);
  }

  function navigateBack() {
    navigation.goBack();
  }
  
  // Async Methods
  async function loadFromAPI() {
    try {
      let data = await DocumentService.getInstance().download(documentInput.id as string, token)
      await CacheService.getInstance().storeValue(documentInput.id as string, data);
      data = Utils.changeMimeType(data, 'application/pdf');
      setPDFData(data);
      setIsLoading(false);
    } catch (error) {
      const errorMessage = (error as Error).message;
      displayToast(errorMessage, true);
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      let cachedData = null;
      try {
        cachedData = await CacheService.getInstance().retrieveValue(documentInput.id as string);
      } catch (error) {
        console.log('error getting cached data', error ); 
      }
      if (cachedData === null || cachedData === undefined) {
        await loadFromAPI();
      } else {
        cachedData = Utils.changeMimeType(cachedData as string, 'application/pdf');
        setPDFData(cachedData as string);
        setIsLoading(false);
      }
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

  function PDFView() {
    return (
      <>
        {
          pdfData ? (
            <Pdf
              source={{uri: pdfData}}
              onLoadProgress={(percent) => {
                console.log('percent loaded', percent );
              }}
              onLoadComplete={(numberOfPages: number, filePath: string) => {
                  console.log(`Number of pages: ${numberOfPages}`, filePath);
              }}
              onPageChanged={(page: number, numberOfPages: number) => {
                  console.log(`Current page: ${page}`, numberOfPages);
              }}
              onError={(error: string) => {
                  console.log(error);
              }}
              onPressLink={(uri: string) => {
                  console.log(`Link pressed: ${uri}`);
              }}
              style={styles.pdf}
            />
          ) : (
            <ContentUnavailableView
              title={t('documentsScreen.noDocs.title')}
              message={t('documentsScreen.noDocs.message.client')}
              image={docIcon}
            />
          )
        }
      </>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {
        isLoading ? (
          <ActivityIndicator size={'large'} color={Colors.primary} />
        ) : (
          PDFView()
        )
      }
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