import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme
} from 'react-native';

import {
  Colors,
} from '../components/colors';

type SubCategoryAppProps = {
  setShowSubCategoryScreen: React.Dispatch<React.SetStateAction<boolean>>;
};

function SubCategoryScreen(props: SubCategoryAppProps): React.JSX.Element {

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  function navigateBack() {
    props.setShowSubCategoryScreen(false);
  }

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <TouchableOpacity style={[styles.backButton, { backgroundColor: Colors.primary }]} onPress={navigateBack}>
        <Text style={{ color: Colors.white }}>Retour</Text>
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
  backButton: {
    width: 178,
    height: 55,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default SubCategoryScreen;