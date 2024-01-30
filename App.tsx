import React from 'react';
import { SafeAreaView, StyleSheet, useColorScheme } from 'react-native';
import './src/localization/i18n';

import { Colors } from './src/ui/components/colors';
import DashboardScreen from './src/ui/screens/dashboard/DashboardScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      {/* <LoginScreen /> */}
      <DashboardScreen isAdmin={false} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
