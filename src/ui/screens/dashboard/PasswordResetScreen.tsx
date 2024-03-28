import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text
} from 'react-native';

function PasswordResetScreen(): React.JSX.Element {

  return (
    <SafeAreaView style={styles.container}>
      <Text>PasswordResetScreen</Text>
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

export default PasswordResetScreen;