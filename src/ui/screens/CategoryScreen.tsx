import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme
} from 'react-native';

type CategoryAppProps = {
  setShowCategoryScreen: React.Dispatch<React.SetStateAction<boolean>>;
};

import { Colors } from '../components/colors';

function CategoryScreen(props: CategoryAppProps): React.JSX.Element {

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.dark : Colors.light,
  };

  function navigateBack() {
    props.setShowCategoryScreen(false);
  }

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <Text>Category</Text>
      <TouchableOpacity onPress={navigateBack}>
        <Text>Retour</Text>
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
});

export default CategoryScreen;