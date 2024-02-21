import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import FinderModule from '../../../business-logic/modules/FinderModule';
import PDFViewer from '../../components/nativeComponents/PDFViewer';

function PDFScreen(): React.JSX.Element {

  const [pdfPath, setPDFPath] = useState<string>('');

  async function pickPDF() {
    const selectedPDF = await FinderModule.getInstance().pickPDF();
    setPDFPath(selectedPDF);
  }

  // TODO: Implement a pdf picker
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default PDFScreen;