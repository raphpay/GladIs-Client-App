import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  SafeAreaView
} from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import DocumentService from '../../../business-logic/services/DocumentService';

import ContentUnavailableView from '../../components/ContentUnavailableView';
import PDFViewer from '../../components/nativeComponents/PDFViewer';

import styles from '../../assets/styles/documentManagement/PDFScreenStyles';

type PDFScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.PDFScreen>;

function PDFScreen(props: PDFScreenProps): React.JSX.Element {

  const [pdfData, setPDFData] = useState<string>('');
  const { documentInput } = props.route.params;
  const { t } = useTranslation();

  async function pickPDF() {
    const pdfData = await DocumentService.getInstance().download(documentInput.id ?? "");
    setPDFData(pdfData);
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
            image={(
              <Image source={require('../../assets/images/doc.fill.png')} />
            )}
          />
        )
      }
    </SafeAreaView>
  );
}

export default PDFScreen;