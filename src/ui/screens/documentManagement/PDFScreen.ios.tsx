import React, { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import DocumentPicker, {
  isCancel,
  isInProgress,
  types
} from 'react-native-document-picker';
import Pdf from 'react-native-pdf';

function PDFScreen(): React.JSX.Element {

  const [pdfPath, setPDFPath] = useState<string>('');

  async function pickPDF() {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: [types.pdf]
      })
      if (pickerResult.fileCopyUri) {
        setPDFPath(pickerResult.fileCopyUri)
      }
    } catch (e) {
      handleError(e)
    }
  }

  const handleError = (err: unknown) => {
    if (isCancel(err)) {
      console.warn('cancelled')
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(err)) {
      console.warn('multiple pickers were opened, only the last will be considered')
    } else {
      throw err
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