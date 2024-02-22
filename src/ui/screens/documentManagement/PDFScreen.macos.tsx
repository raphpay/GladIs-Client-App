import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity
} from 'react-native';
import APIService from '../../../business-logic/services/APIService';
import styles from '../../assets/styles/documentManagement/PDFScreenStyles';
import PDFViewer from '../../components/nativeComponents/PDFViewer';

function PDFScreen(): React.JSX.Element {

  const [pdfPath, setPDFPath] = useState<string>('');

  async function pickPDF() {
    // const selectedPDF = await FinderModule.getInstance().pickPDF();
    // setPDFPath(selectedPDF);
    const test = await APIService.getPDF('documents', 'test');
    setPDFPath(test);
    // setPDFPath('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={pickPDF}>
        <Text>Mac OS</Text>
      </TouchableOpacity>
      {
        pdfPath && (
          <PDFViewer style={styles.pdf} pdfURL={pdfPath} />
        )
      }
    </SafeAreaView>
  );
}

export default PDFScreen;