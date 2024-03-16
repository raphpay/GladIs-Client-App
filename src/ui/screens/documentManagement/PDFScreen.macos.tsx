import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SafeAreaView
} from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import DocumentService from '../../../business-logic/services/DocumentService';

import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';
import ContentUnavailableView from '../../components/ContentUnavailableView';
import PDFViewer from '../../components/nativeComponents/PDFViewer';

import styles from '../../assets/styles/documentManagement/PDFScreenStyles';
import IconButton from '../../components/IconButton';

type PDFScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.PDFScreen>;

function PDFScreen(props: PDFScreenProps): React.JSX.Element {

  const [pdfData, setPDFData] = useState<string>('');
  const { navigation } = props;
  const { documentInput } = props.route.params;
  const { t } = useTranslation();
  const { token } = useAppSelector((state: RootState) => state.tokens);

  const docIcon = require('../../assets/images/doc.fill.png');
  const backIcon = require('../../assets/images/arrowshape.turn.up.left.png');

  async function pickPDF() {
    const data = await DocumentService.getInstance().download(documentInput.id as string, token)
    setPDFData(data);
  }

  function navigateBack() {
    navigation.goBack();
  }

  useEffect(() => {
    async function init() {
      await pickPDF();
    }
    init();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {
        pdfData ? (
          <PDFViewer style={styles.pdf} dataString={pdfData} />
        ) : (
          <ContentUnavailableView
            title={t('document.noDocumentFound.title')}
            message={t('document.noDocumentFound.message')}
            image={docIcon}
          />
        )
      }
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