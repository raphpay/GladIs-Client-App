import React from 'react';
import {
  StyleSheet,
  Text
} from 'react-native';
import AppContainer from '../../components/AppContainer';

function RemindersScreen(): React.JSX.Element {

  return (
    <AppContainer
      mainTitle='Reminders'
      showBackButton={true}
      showSearchText={false}
      showSettings={true}
    >
      <Text>Reminders</Text>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RemindersScreen;