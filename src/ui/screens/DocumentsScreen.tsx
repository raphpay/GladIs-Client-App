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

import AppIcon from '../components/AppIcon';
import TextButton from '../components/TextButton';
import {
  Colors,
} from '../components/colors';

type DocumentsAppProps = {
  setShowDocumentsScreen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCategoryScreen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSubCategoryScreen: React.Dispatch<React.SetStateAction<boolean>>;
};

function DocumentsScreen(props: DocumentsAppProps): React.JSX.Element {
  const [searchText, setSearchText] = useState<string>('');

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  function navigateToDashboard() {
    props.setShowCategoryScreen(false);
    props.setShowSubCategoryScreen(false);
  }

  function navigateToCategories() {
    props.setShowCategoryScreen(true);
    props.setShowSubCategoryScreen(false);
    props.setShowDocumentsScreen(false);
  }

  function navigateBack() {
    props.setShowDocumentsScreen(false)
  }

  function navigateToDocument() {

  }

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
            <TouchableOpacity onPress={navigateToDocument}>
              <View style={styles.subCategoryLineContainer}>
                <View style={styles.subCategoryLineRow}>
                  <Image source={require('../assets/PDF_file_icon.png')}/>
                  <View style={styles.subCategoryTextContainer}>
                    <Text>PRS_M01_Management</Text>
                  </View>
                  <Image source={require('../assets/ellipsis.png')}/>
                </View>
                <View style={styles.separator}/>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.backButtonContainer}>
            <TextButton title={'Retour'} onPress={navigateBack}/>
          </View>
        </View>
        <View style={styles.topContainer}>
          <AppIcon style={styles.appIcon} />
          <View>
            <View style={styles.navigationHistoryContainer}>
              <TouchableOpacity onPress={navigateToDashboard}>
                <Text style={styles.navigationHistory}>Tableau de bord</Text>
              </TouchableOpacity>
              <Image source={require('../assets/chevron.right.png')}/>
              <TouchableOpacity onPress={navigateToCategories}>
                <Text style={styles.navigationHistory}>Gestion des documents</Text>
              </TouchableOpacity>
              <Image source={require('../assets/chevron.right.png')}/>
              <TouchableOpacity onPress={navigateBack}>
                <Text style={styles.navigationHistory}>Système qualité</Text>
              </TouchableOpacity>
              <Image source={require('../assets/chevron.right.png')}/>
            </View>
            <Text style={styles.currentPageTitle}>Processus</Text>
          </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  subCategoryTextContainer: {
    flex: 1,
    paddingLeft: 8
  },
  // Components
  appIcon: {
    marginLeft: 60,
    marginTop: 16,
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

export default DocumentsScreen;