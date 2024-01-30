import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';

type CategoryAppProps = {
  setShowCategoryScreen: React.Dispatch<React.SetStateAction<boolean>>;
};

import SearchTextInput from '../components/SearchTextInput';
import { Colors } from '../components/colors';
import SubCategoryScreen from './SubCategoryScreen';

function CategoryScreen(props: CategoryAppProps): React.JSX.Element {
  const [searchText,setSearchText] = useState<string>('');
  const [showSubCategoryScreen, setShowSubCategoryScreen] = useState<boolean>(false);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  function navigateBack() {
    props.setShowCategoryScreen(false);
  }

  function navigateToSubCategory() {
    setShowSubCategoryScreen(true);
  }

  const mainScreen = () => {
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
            <TouchableOpacity onPress={navigateToSubCategory}>
              <View style={styles.categoryContainer}>
                <View style={styles.categoryImageContainer} />
                <View style={[styles.categoryTextsContainer, { backgroundColor: Colors.textInput }]}>
                  <Text style={styles.categoryTitle}>Système qualité</Text>
                  <Text style={styles.categoryDescription}>Description</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.backButtonContainer}>
            <TouchableOpacity style={[styles.backButton, { backgroundColor: Colors.primary }]} onPress={navigateBack}>
              <Text style={{ color: Colors.white }}>Retour</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.topContainer}>
          <View style={[styles.appIcon, { backgroundColor: Colors.primary }]}>
            <Text style={{color: Colors.white }}>App Icon</Text>
          </View>
          <View>
            <View style={styles.navigationHistoryContainer}>
              <TouchableOpacity onPress={navigateBack}>
                <Text style={styles.navigationHistory}>Tableau de bord</Text>
              </TouchableOpacity>
              <Image source={require('../assets/chevron.right.png')}/>
            </View>
            <Text style={styles.currentPageTitle}>Gestion des documents</Text>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[{ backgroundColor: Colors.primary }, styles.container]}>
      {
        showSubCategoryScreen ? 
          <SubCategoryScreen 
            setShowCategoryScreen={props.setShowCategoryScreen}
            setShowSubCategoryScreen={setShowSubCategoryScreen}
          /> : 
          mainScreen()
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
  backButtonContainer: {
    width: '100%',
    flexDirection: 'row-reverse',
    padding: 16
  },
  navigationHistoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContainer: {
    borderRadius: 10,
    width: 148,
    height: 228,
    borderWidth: 1,
    borderColor: 'black'
  },
  categoryImageContainer: {
    height: '75%'
  },
  categoryTextsContainer: {
    height: '25%',
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    padding: 4,
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
    fontSize: 12,
    fontWeight: '400',
    paddingRight: 4
  },
  currentPageTitle: {
    paddingLeft: 8,
    fontSize: 20,
    fontWeight: '600'
  },
  backButton: {
    width: 178,
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryTitle: {
    fontSize: 12
  },
  categoryDescription: {
    fontSize: 10
  },
});

export default CategoryScreen;