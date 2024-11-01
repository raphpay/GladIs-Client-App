import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import PDFScreenManager from '../../../business-logic/manager/documentManagement/PDFScreenManager';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import IconButton from '../../components/Buttons/IconButton';
import TextButton from '../../components/Buttons/TextButton';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import PDFViewer from '../../components/nativeComponents/PDFViewer';

import { Colors } from '../../assets/colors/colors';
import styles from '../../assets/styles/documentManagement/PDFScreenStyles';

type PDFScreenProps = NativeStackScreenProps<
  IRootStackParams,
  NavigationRoutes.PDFScreen
>;

function PDFScreen(props: PDFScreenProps): React.JSX.Element {
  // General
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // PDF
  const [pdfData, setPDFData] = useState<string[] | null>(null);
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  // Props
  const { navigation } = props;
  const { documentInput } = props.route.params;
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

  // Async Methods
  async function loadData() {
    setIsLoading(true);
    const data = await PDFScreenManager.getInstance().loadData(
      documentInput,
      token,
    );
    if (data) {
      setPDFData(data);
      setIsLoading(false);
      setCurrentPage(0);
      setTotalPages(data.length);
    }
  }

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      await loadData();
    }
    init();
  }, []);

  // Components
  function PDFView() {
    return (
      <View style={{ flex: 1 }}>
        {pdfData !== null && currentPage !== null ? (
          <PDFViewer pageData={pdfData[currentPage]} />
        ) : (
          <ContentUnavailableView
            title={t('document.noDocumentFound.title')}
            message={t('document.noDocumentFound.message')}
            image={docIcon}
          />
        )}
      </View>
    );
  }

  function PageIndicator() {
    return (
      <>
        {currentPage !== null && totalPages !== null && (
          <View style={styles.pageIndicator}>
            <TextButton
              title={t('components.buttons.previous')}
              width={100}
              onPress={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
              extraStyle={styles.pageIndicatorButton}
            />
            <Text style={styles.pageIndicatorText}>
              Page {currentPage + 1} {t('components.pageIndicator.of')}{' '}
              {totalPages}
            </Text>
            <TextButton
              title={t('components.buttons.next')}
              width={80}
              onPress={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              extraStyle={styles.pageIndicatorButton}
            />
          </View>
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
      {PageIndicator()}
    </SafeAreaView>
  );
}

export default PDFScreen;
