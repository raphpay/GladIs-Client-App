import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, SafeAreaView } from 'react-native';
import Pdf from 'react-native-pdf';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import DocumentService from '../../../business-logic/services/DocumentService';
import { useAppSelector } from '../../../business-logic/store/hooks';
import { RootState } from '../../../business-logic/store/store';

import styles from '../../assets/styles/documentManagement/PDFScreenStyles';
import ContentUnavailableView from '../../components/ContentUnavailableView';

type PDFScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.PDFScreen>;

function PDFScreen(props: PDFScreenProps): React.JSX.Element {

  const [pdfData, setPDFData] = useState<string>('');
  const { documentInput } = props.route.params;
  const { t } = useTranslation();
  const { token } = useAppSelector((state: RootState) => state.tokens);

  async function pickPDF() {
    const data = await DocumentService.getInstance().download(documentInput.id as string, token)
    setPDFData(data)
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
          <Pdf
          source={{uri: pdfData}}
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
          style={styles.pdf}/>
        ) : (
          <ContentUnavailableView
            title={t('documentsScreen.noDocs.title')}
            message={t('documentsScreen.noDocs.message.client')}
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