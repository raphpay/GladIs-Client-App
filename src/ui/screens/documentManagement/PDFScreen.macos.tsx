import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView
} from 'react-native';

import { IRootStackParams } from '../../../navigation/Routes';

import NavigationRoutes from '../../../business-logic/model/enums/NavigationRoutes';
import APIService from '../../../business-logic/services/APIService';

import PDFViewer from '../../components/nativeComponents/PDFViewer';

import styles from '../../assets/styles/documentManagement/PDFScreenStyles';

type PDFScreenProps = NativeStackScreenProps<IRootStackParams, NavigationRoutes.PDFScreen>;

function PDFScreen(props: PDFScreenProps): React.JSX.Element {

  const [pdfData, setPDFData] = useState<string>('');

  const { documentInput } = props.route.params;

  async function pickPDF() {
    const pdfData = await APIService.getPDF(documentInput);
    setPDFData(pdfData);
  }

  useEffect(() => {
    async function init() {
      await pickPDF();
    }
    init();
  }, []);

  // TODO: Add an emoty view
  return (
    <SafeAreaView style={styles.container}>
      {
        pdfData && (
          <PDFViewer style={styles.pdf} dataString={pdfData} />
        )
      }
    </SafeAreaView>
  );
}

export default PDFScreen;