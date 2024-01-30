import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';

import CategoryScreen from '../CategoryScreen';

import AppIcon from '../../components/AppIcon';
import SearchTextInput from '../../components/SearchTextInput';
import { Colors } from '../../components/colors';

function DashboardClientScreen(): React.JSX.Element {

  const [searchText,setSearchText] = useState<string>('');
  const [showCategoryScreen, setShowCategoryScreen] = useState<boolean>(false);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  function navigateToCategory() {
    setShowCategoryScreen(true)
  }

  const dashboardScreen = () => {
    return (
      <SafeAreaView style={[{ backgroundColor: Colors.primary }, styles.container]}>
        <View style={[styles.innerContainer, backgroundStyle]}>
          <View style={styles.innerComponentsContainer}>
            <View style={styles.searchInputContainer}>
              <SearchTextInput 
                searchText={searchText}
                setSearchText={setSearchText}
              />
            </View>
            <TouchableOpacity onPress={navigateToCategory} style={[styles.moduleContainer, { backgroundColor: Colors.textInput}]}>
              <Text>Gestion des documents</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.topContainer}>
          <AppIcon />
          <Text style={styles.navigationHistory}>Tableau de bord</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[{ backgroundColor: Colors.primary }, styles.container]}>
      {
        showCategoryScreen ? <CategoryScreen setShowCategoryScreen={setShowCategoryScreen} /> : dashboardScreen()
      }
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
  moduleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 75,
    width: 190,
    borderRadius: 10
  },
  // Components
  navigationHistory: {
    paddingLeft: 8,
    fontSize: 20,
    fontWeight: '600'
  },
});

export default DashboardClientScreen;