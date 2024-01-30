import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useColorScheme
} from 'react-native';

import AppIcon from '../../components/AppIcon';
import IconButton from '../../components/IconButton';
import SearchTextInput from '../../components/SearchTextInput';
import { Colors } from '../../components/colors';

import plusIcon from '../../assets/plus.png';

function DashboardAdminScreen(): React.JSX.Element {

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
            <IconButton
              title='Hello'
              icon={plusIcon}
              onPress={() => { console.log('hello')}}
            />
            <SearchTextInput
              searchText={searchText}
              setSearchText={setSearchText}
            />
          </View>
          <View style={[styles.clientContainer, { backgroundColor: Colors.textInput}]}>
            <View style={[styles.innerTopClientContainer, { backgroundColor: Colors.secondary }]}>
              <Text>Client A</Text>
            </View>
            <View style={styles.innerBottomClientContainer}>
              <Text>Gestion des documents</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.topContainer}>
        <AppIcon style={styles.appIcon} />
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
  innerTopClientContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '75%',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10
  },
  innerBottomClientContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '25%',
  },
  clientContainer: {
    height: 75,
    width: 190,
    borderRadius: 10,
    margin: 4
  },
  // Components
  appIcon: {
    marginLeft: 60,
    marginTop: 16,
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
    margin: 8,
  },
});

export default DashboardAdminScreen;