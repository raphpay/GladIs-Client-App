import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text
} from 'react-native';

function SMQBuyScreen(): React.JSX.Element {

  return (
    <SafeAreaView style={styles.container}>
      <Text>SMQBuyScreen</Text>
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

export default SMQBuyScreen;
