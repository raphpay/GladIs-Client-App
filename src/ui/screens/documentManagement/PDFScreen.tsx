import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, SafeAreaView } from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import PDFScreenManager from '../../../business-logic/manager/documentManagement/PDFScreenManager';
import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import IconButton from '../../components/Buttons/IconButton';
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
  const [pdfData, setPDFData] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  // Lifecycle Methods
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      const data = await PDFScreenManager.getInstance().loadData(
        documentInput,
        token,
      );
      setPDFData(data);
      setIsLoading(false);
    }
    init();
  }, []);

  // Components
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
    </SafeAreaView>
  );
}

export default PDFScreen;
