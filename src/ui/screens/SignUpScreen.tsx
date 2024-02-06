import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme
} from 'react-native';

import { Colors } from '../assets/colors/colors';

function SignUpScreen(): React.JSX.Element {

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <Text>Sign up</Text>
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

export default SignUpScreen;