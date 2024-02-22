import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';
import Pdf from 'react-native-pdf';

import styles from '../../assets/styles/documentManagement/PDFScreenStyles';

function PDFScreen(): React.JSX.Element {

  const [pdfPath, setPDFPath] = useState<string>('');

  async function pickPDF() {
    // try {
    //   const pickerResult = await DocumentPicker.pickSingle({
    //     presentationStyle: 'fullScreen',
    //     copyTo: 'cachesDirectory',
    //     type: [types.pdf]
    //   })
    //   if (pickerResult.fileCopyUri) {
    //     setPDFPath(pickerResult.fileCopyUri)
    //   }
    // } catch (e) {
    //   console.log('error', e);
    // }
    
    // setPDFPath('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'); // -> Works

    // const test = await APIService.getPDF("documents", "test"); // -> Wokrs too
    // setPDFPath(test) 
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
        )
      }
    </SafeAreaView>
  );
}

export default PDFScreen;