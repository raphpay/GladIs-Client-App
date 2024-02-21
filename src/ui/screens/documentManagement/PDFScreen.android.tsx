import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';
import DocumentPicker, { types } from 'react-native-document-picker';
import Pdf from 'react-native-pdf';

import styles from '../../assets/styles/documentManagement/PDFScreenStyles';

function PDFScreen(): React.JSX.Element {

  const [pdfPath, setPDFPath] = useState<string>('');

  async function pickPDF() {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: [types.pdf]
      })
      console.log('res', pickerResult );
      if (pickerResult.fileCopyUri !== null) {
        console.log('not null', pickerResult.fileCopyUri);
        setPDFPath(pickerResult.fileCopyUri);
      }
    } catch (e) {
      console.log('error', e);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={pickPDF}>
        <Text>Pick PDF</Text>
      </TouchableOpacity>
      {
        pdfPath && (
          <Pdf
            source={{uri: pdfPath}}
            style={styles.pdf}
            onLoadComplete={(numberOfPages: number, filePath: string) => {
              console.log(`Number of pages: ${numberOfPages}`, filePath);
            }}
          />
        )
      }
    </SafeAreaView>
  );
}

export default PDFScreen;