import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text
} from 'react-native';

function PDFScreen(): React.JSX.Element {

  // TODO: Implement a pdf picker
  return (
    <SafeAreaView style={styles.container}>
      <Text>Mac OS</Text>
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