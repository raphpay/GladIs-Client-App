import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text
} from 'react-native';

function SurveysScreen(): React.JSX.Element {

  return (
    <SafeAreaView style={styles.container}>
      <Text>Surveys</Text>
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

export default SurveysScreen;
