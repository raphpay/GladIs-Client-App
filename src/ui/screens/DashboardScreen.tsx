import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme
} from 'react-native';

import { Colors } from '../components/colors';

function DashboardScreen(): React.JSX.Element {
  const [searchText,setSearchText] = useState<string>('');

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  return (
    <SafeAreaView style={[{ backgroundColor: Colors.primary }, styles.container]}>
      <View style={[styles.innerContainer, backgroundStyle]}>
        <View style={styles.innerComponentsContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder={'Recherche'}
              style={styles.textInput}
            />
          </View>
        </View>
      </View>
      <View style={styles.topContainer}>
        <View style={[styles.appIcon, { backgroundColor: Colors.primary }]}>
          <Text>App Icon</Text>
        </View>
        <Text style={styles.navigationHistory}>Tableau de bord</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
  },
  topContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'flex-end',
  },
  innerContainer: {
    flex: 1,
    marginTop: 104,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  innerComponentsContainer: {
    flex: 1,
    marginTop: 91,
    marginHorizontal: 16,
    marginBottom: 16
  },
  searchInputContainer: {
    width: '100%',
    flexDirection: 'row-reverse'
  },
  // Components
  appIcon: {
    borderRadius: 10,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 60,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'black',
  },
  navigationHistory: {
    paddingLeft: 8,
    fontSize: 20,
    fontWeight: '600'
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    width: '30%',
    padding: 10,
    margin: 8
  },
});

export default DashboardScreen;