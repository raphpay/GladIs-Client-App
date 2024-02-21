import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity
} from 'react-native';
import FinderModule from '../../../business-logic/modules/FinderModule';
import styles from '../../assets/styles/documentManagement/PDFScreenStyles';
import PDFViewer from '../../components/nativeComponents/PDFViewer';

function PDFScreen(): React.JSX.Element {

  const [pdfPath, setPDFPath] = useState<string>('');

  async function pickPDF() {
    const selectedPDF = await FinderModule.getInstance().pickPDF();
    setPDFPath(selectedPDF);
  }

  // TODO: Add a back button
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