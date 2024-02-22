import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text
} from 'react-native';

function SystemQualityScreen(): React.JSX.Element {

  return (
    <SafeAreaView style={styles.container}>
      <Text>System quality</Text>
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

export default SystemQualityScreen;