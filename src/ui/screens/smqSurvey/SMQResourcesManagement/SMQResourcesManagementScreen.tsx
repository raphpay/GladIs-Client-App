import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text
} from 'react-native';

function SMQResourcesManagement(): React.JSX.Element {

  return (
    <SafeAreaView style={styles.container}>
      <Text>SMQResourcesManagement</Text>
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

export default SMQResourcesManagement;
