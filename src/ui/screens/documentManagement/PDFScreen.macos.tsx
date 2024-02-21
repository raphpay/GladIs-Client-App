import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import FinderModule from '../../../business-logic/modules/FinderModule';

function PDFScreen(): React.JSX.Element {

  async function pickPDF() {
    const selectedPDF = await FinderModule.getInstance().pickPDF();
    console.log('ui', selectedPDF );
  }

  // TODO: Implement a pdf picker
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={pickPDF}>
        <Text>Mac OS</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PDFScreen;