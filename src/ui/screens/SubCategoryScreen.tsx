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

import {
  Colors,
} from '../components/colors';
import DocumentsScreen from './DocumentsScreen';

type SubCategoryAppProps = {
  setShowCategoryScreen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSubCategoryScreen: React.Dispatch<React.SetStateAction<boolean>>;
};

function SubCategoryScreen(props: SubCategoryAppProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');
  const [showDocumentsScreen, setShowDocumentsScreen] = useState<boolean>(false);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  function navigateToDashboard() {
    props.setShowCategoryScreen(false);
    props.setShowSubCategoryScreen(false);
  }

  function navigateBack() {
    props.setShowSubCategoryScreen(false);
  }

  function navigateToDocuments() {
    setShowDocumentsScreen(true);
  }

  const mainScreen = () => {
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
            <TouchableOpacity onPress={navigateToDocuments}>
              <View style={styles.subCategoryLineContainer}>
                <View style={styles.subCategoryLineRow}>
                  <View style={[styles.letterCircle, { backgroundColor: Colors.textInput }]}>
                    <Text>P</Text>
                  </View>
                  <View style={styles.subCategoryTextContainer}>
                    <Text>Processus</Text>
                  </View>
                  <Image source={require('../assets/ellipsis.png')}/>
                </View>
                <View style={styles.separator}/>
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
              <TouchableOpacity onPress={navigateToDashboard}>
                <Text style={styles.navigationHistory}>Tableau de bord</Text>
              </TouchableOpacity>
              <Image source={require('../assets/chevron.right.png')}/>
              <TouchableOpacity onPress={navigateBack}>
                <Text style={styles.navigationHistory}>Gestion des documents</Text>
              </TouchableOpacity>
              <Image source={require('../assets/chevron.right.png')}/>
            </View>
            <Text style={styles.currentPageTitle}>Système qualité</Text>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[{ backgroundColor: Colors.primary }, styles.container]}>
      {
        showDocumentsScreen ?
        <DocumentsScreen
          setShowDocumentsScreen={setShowDocumentsScreen}
          setShowSubCategoryScreen={props.setShowSubCategoryScreen}
          setShowCategoryScreen={props.setShowCategoryScreen}
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
  subCategoryLineContainer: {
    height: 55,
    width: '100%',
  },
  subCategoryLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  subCategoryTextContainer: {
    flex: 1,
    paddingLeft: 8
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
  textInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    width: '30%',
    padding: 10,
    margin: 8,
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
  letterCircle: {
    width: 25,
    height: 25,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    margin: 4
  },
});

export default SubCategoryScreen;