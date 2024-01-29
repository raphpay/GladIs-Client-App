import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';

import { Colors } from '../components/colors';

function LoginScreen(): React.JSX.Element {
  const [email, onEmailChange] = useState('');
  const [password, onPasswordChange] = useState('');

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  const primaryColor = isDarkMode ? Colors.secondary : Colors.primary;

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <View style={[styles.appIcon, { backgroundColor: Colors.primary }]}>
        <Text>App icon</Text>
      </View>
      <Text>Se connecter à GladIs</Text>
      <TextInput
        value={email}
        onChangeText={onEmailChange}
        placeholder={'Email'}
        keyboardType='email-address'
        style={styles.textInput}
      />
      <TextInput
        value={password}
        onChangeText={onPasswordChange}
        placeholder={'Mot de passe'}
        style={styles.textInput}
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: primaryColor }]}>
        <Text style={[styles.buttonText, { color: Colors.white }]}>
          Se connecter
        </Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={[styles.textButtonText, { color: primaryColor }]}>
          Pas de compte ? Contactez votre fournisseur.
        </Text>
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
  appIcon: {
    borderRadius: 10,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    width: '70%',
    padding: 10,
    margin: 8
  },
  button: {
    borderRadius: 10,
    height: 50,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600'
  },
  textButtonText: {
    fontSize: 14,
  },
});

export default LoginScreen;