import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';

import { Colors } from '../../components/colors';

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
            <TouchableOpacity>
              <View style={[styles.addButtonContainer, { backgroundColor: Colors.primary}]}>
                <Image
                  style={styles.plusIcon}
                  source={require('../../assets/plus.png')}
                />
                <Text style={styles.textButtonColor}>Ajouter un client</Text>
              </View>
            </TouchableOpacity>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder={'Recherche'}
              style={styles.textInput}
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
        <View style={[styles.appIcon, { backgroundColor: Colors.primary }]}>
          <Text style={{color: Colors.white }}>App Icon</Text>
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
  addButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 50,
    padding: 8
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
    margin: 8,
  },
  textButtonColor: {
    color: 'white',
    fontSize: 14,
    padding: 4
  },
  plusIcon: {
    width: 20,
    height: 20,
    padding: 4
  }
});

export default DashboardAdminScreen;