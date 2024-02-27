import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, SafeAreaView } from 'react-native';
import Pdf from 'react-native-pdf';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import DocumentService from '../../../business-logic/services/DocumentService';

import styles from '../../assets/styles/documentManagement/PDFScreenStyles';
import ContentUnavailableView from '../../components/ContentUnavailableView';

type PDFScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.PDFScreen>;

function PDFScreen(props: PDFScreenProps): React.JSX.Element {

  const [pdfData, setPDFData] = useState<string>('');
  const { t } = useTranslation();
  const { documentInput } = props.route.params;

  useEffect(() => {
    async function init() {
      const data = await DocumentService.getInstance().download(documentInput.id ?? "");
      setPDFData(data)
    }
    init();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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